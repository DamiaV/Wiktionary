local m_indexData = require('Module:Index_data')

local p = {}

--- Insert links to Wikidata entities for all links present in the given wikitext.
--- @param wikitext string The wikitext to parse.
--- @param category string? The name of a category to append to the links.
--- @return string? # The transformed wikitext.
function withWikidataLink(wikitext, category)
  if wikitext == nil then
    return nil
  end
  local newWikitext = mw.ustring.gsub(wikitext, '%[%[([^|%]]*)%]%]', function(page)
    return addWikidataToLink(page, mw.ustring.gsub(page, '%.*/', ''), category)
  end)
  if newWikitext ~= wikitext then
    return newWikitext
  end
  local result = mw.ustring.gsub(wikitext, '%[%[([^|]*)|([^|%]]*)%]%]', function(page, link)
    return addWikidataToLink(page, link, category)
  end)
  return result
end

--- Create a link to a local page, followed by a link to the corresponding Wikidata entity.
--- @param page string The page’s title.
--- @param label string The link’s text.
--- @param category string? The name of a category to append to the links.
--- @return string # The formatted link(s).
function addWikidataToLink(page, label, category)
  local title = mw.title.new(page)
  if title == nil then
    return '[[' .. page .. '|' .. label .. ']]'
  end
  if title.isRedirect then
    title = title.redirectTarget
  end

  local tag = mw.html.create('span')
  local itemId = mw.wikibase.getEntityIdForTitle(title.fullText)
  tag:wikitext('[[' .. page .. '|' .. label .. ']]')
  if itemId ~= nil then
    tag:wikitext(' [[Image:Wikidata.svg|10px|link=d:' .. itemId .. '|Voir l\'entité sur Wikidata]]')
    if category ~= nil then
      tag:wikitext('[[Catégorie:' .. category .. ']]')
    end
  end
  return tostring(tag)
end

--- Add a row into the given HTML table. If the value is nil, the table is not modified.
--- @param metadataTable html The HTML table to update.
--- @param label string The row’s label.
--- @param value string? The row’s value.
function addRow(metadataTable, label, value)
  if value then
    metadataTable:tag('tr')
        :tag('th')
        :attr('score', 'row')
        :css('vertical-align', 'top')
        :wikitext(label)
        :done()
        :tag('td'):wikitext(value)
  end
end

--- Split the file name and page title from the given title.
--- @param title title The title to split.
--- @return string,string? # The file name and the page name. The page name may be nil if there is no / in the title.
function splitFileNameInFileAndPage(title)
  local slashPosition = mw.ustring.find(title.text, "/")
  if slashPosition == nil then
    return title.text, nil
  end
  return mw.ustring.sub(title.text, 1, slashPosition - 1), mw.ustring.sub(title.text, slashPosition + 1)
end

--- Generate the Index: (Livre:) page structure.
--- @param frame frame
function p.indexTemplate(frame)
  -- Create a clean table of parameters with blank parameters removed
  local data = m_indexData.indexDataWithWikidata(frame)
  local args = data.args
  local item = data.item

  local html = mw.html.create()

  if item then
    html:wikitext(
      '[[Catégorie:Livres avec un identifiant Wikidata]]<indicator name="wikidata">[[File:Wikidata.svg|20px|élément Wikidata|link=d:' ..
      item.id .. ']]</indicator>')
  end

  -- Left part
  local left = html:tag('div')
  if args.sommaire or args.epigraphe then
    left:css('width', '53%')
  end
  left:css('float', 'left')

  -- Image
  if args.image then
    local imageContainer = left:tag('div')
        :css({
          float = 'left',
          overflow = 'hidden',
          border = 'thin grey solid'
        })
    local imageTitle
    if tonumber(args.image) ~= nil then
      -- This is a page number
      imageTitle = mw.title.getCurrentTitle():subPageTitle(args.image)
    else
      -- This is another file
      imageTitle = mw.title.new(args.image, "File")
      -- TODO mettre une catégorie pour les livres ayant une couverture qui ne provient pas du DJVU/PDF
    end
    if imageTitle == nil then
      imageContainer:wikitext(args.image)
      -- TODO mettre une catégorie de maintenance ici lorsque la couverture est manquante
    else
      local imageName, imagePage = splitFileNameInFileAndPage(imageTitle)
      if imagePage ~= nil then
        imageContainer:wikitext('[[File:' .. imageName .. '|page=' .. imagePage .. '|160px]]')
      else
        imageContainer:wikitext('[[File:' .. imageName .. '|160px]]')
      end
    end
  end

  -- Metadata
  local metadataContainer = left:tag('div')
  if args.image then
    metadataContainer:css('margin-left', '5px')
  end
  local metadataTable = metadataContainer:tag('table')
  metadataTable:css('min-width', 'min(230px, 50%)')
  if args.titre then
    if args.type == 'journal' then
      addRow(metadataTable, 'Journal', withWikidataLink(args.titre))
    else
      addRow(metadataTable, 'Titre', withWikidataLink(args.titre, 'Livres avec un lien Wikidata'))
    end
  else
    mw.addWarning('Vous devez renseigner le champ «&nbsp;Titre&nbsp;» du formulaire.')
  end
  addRow(metadataTable, 'Sous-titre', args.sous_titre)
  addRow(metadataTable, 'Volume', args.volume)
  addRow(metadataTable, 'Auteur', withWikidataLink(args.auteur))
  addRow(metadataTable, 'Traducteur', withWikidataLink(args.traducteur))
  addRow(metadataTable, 'Éditeur', withWikidataLink(args.editeur_scientifique))
  addRow(metadataTable, 'Illustrateur', withWikidataLink(args.illustrateur))
  addRow(metadataTable, 'École', withWikidataLink(args.school))
  addRow(metadataTable, 'Maison&nbsp;d’édition', withWikidataLink(args.editeur))
  addRow(metadataTable, 'Lieu&nbsp;d’édition', withWikidataLink(args.lieu))
  addRow(metadataTable, 'Année&nbsp;d’édition', args.annee)
  addRow(metadataTable, 'Publication&nbsp;originale', args.publication)

  local library = args.bibliotheque
  if args.BNF_ARK then
    local arkLink = '[http://gallica.bnf.fr/ark:/12148/' ..
        args.BNF_ARK .. ' Bibliothèque nationale de France][[Catégorie:Facsimilés issus de Gallica]]<br>'
    if library then
      library = arkLink .. library
    else
      library = arkLink
    end
  end
  addRow(metadataTable, 'Bibliothèque', library)

  if args.source == 'djvu' or args.source == 'pdf' then
    addRow(metadataTable, 'Fac-similés', '[[:File:' .. mw.title.getCurrentTitle().text .. '|' .. args.source .. ']]')

    -- Add an indicator linking to the usages
    local query =
        'SELECT ?item ?itemLabel ?pages ?page WHERE {\n  ?item wdt:P996 <http://commons.wikimedia.org/wiki/Special:FilePath/' ..
        mw.uri.encode(mw.title.getCurrentTitle().text, 'PATH') ..
        '> .\n  OPTIONAL { ?page schema:about ?item ; schema:isPartOf <https://fr.wikisource.org/> . }\n  OPTIONAL { ?item wdt:P304 ?pages . }\n  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".\n}} \n ORDER BY xsd:integer(REPLACE(?pages, "^([0-9]+).*$", "$1"))'
    html:wikitext(
      '<indicator name="index-scan-wikidata">[[File:Wikidata Query Service Favicon.svg|20px|éléments Wikidata|link=https://query.wikidata.org/embed.html#' ..
      mw.uri.encode(query, 'PATH') .. ']]</indicator>')
  else
    addRow(metadataTable, 'Fac-similés', args.source)
  end

  if args.avancement == 'T' then
    addRow(metadataTable, 'Avancement', '[[Catégorie:Livres terminés]][[:Catégorie:Livres terminés|Terminé]]')
  elseif args.avancement == 'V' then
    addRow(metadataTable, 'Avancement', '[[Catégorie:Livres à valider]][[:Catégorie:Livres à valider|À valider]]')
  elseif args.avancement == 'C' then
    addRow(metadataTable, 'Avancement', '[[Catégorie:Livres à corriger]][[:Catégorie:Livres à corriger|À corriger]]')
  elseif args.avancement == 'MS' then
    addRow(metadataTable, 'Avancement',
      '[[Catégorie:Livres à découper]][[:Catégorie:Livres à découper|Texte prêt à être découpé]]')
  elseif args.avancement == 'OCR' then
    addRow(metadataTable, 'Avancement',
      '[[Catégorie:Livres sans couche texte]][[:Catégorie:Livres sans couche texte|Ajouter une couche texte d’OCR]]')
  elseif args.avancement == 'D' then
    addRow(metadataTable, 'Avancement', '[[Catégorie:Doublons]][[:Catégorie:Doublons|Index en double]]')
  elseif args.avancement == 'L' then
    addRow(metadataTable, 'Avancement',
      '[[Catégorie:Livres à réparer]]<span style="color: red">[[:Catégorie:Livres à réparer|Fichier source défectueux]]</span>')
  else
    addRow(metadataTable, 'Avancement',
      '[[Catégorie:Livres d’avancement inconnu]][[:Catégorie:Livres d’avancement inconnu|Avancement inconnu]]')
  end

  if args.compilation == 'true' then
    addRow(metadataTable, 'Compilation',
      '[[Catégorie:Extraits et compilations]][[:Catégorie:Extraits et compilations|Source incomplète&nbsp;: extrait ou compilation]]')
  end

  addRow(metadataTable, 'Série', args.tomes)

  if args.pages then
    left:tag('div'):css('clear', 'both')
    left:tag('h3'):wikitext('Pages')
    local div = left:tag('div'):attr('id', 'pagelist')
    if args.avancement == 'OCR' then
      -- Show the message from {{SansOCR}} if 'OCR' status is selected
      div:newline()
          :wikitext(frame:expandTemplate { title = 'SansOCR', args = {} })
    end
    div:newline()
        :wikitext(args.pages)
        :newline()
  else
    mw.addWarning('Vous devez renseigner la pagination du fac-similé (champ «&nbsp;Pages&nbsp;»).')
  end

  if args.sommaire or args.epigraphe then
    local right = html:tag('div')
        :css({
          width = 'calc(44% - 1em)',
          ['padding-left'] = '1em',
          float = 'right'
        })
    if args.sommaire then
      right:tag('div')
          :attr('id', 'sommaire')
          :wikitext(args.sommaire)
    end
    if args.epigraphe then
      right:tag('hr')
          :css({
            ['margin-top'] = '1em',
            ['margin-bottom'] = '1em'
          })
      right:tag('div')
          :attr('id', 'epigraphe')
          :wikitext(args.epigraphe)
    end
  end

  if args.clef then
    html:wikitext('{{DEFAULTSORT:' .. args.clef .. '}}')
  end

  if args.type == 'book' then
    html:wikitext('[[Catégorie:Index - Livres]]')
  elseif args.type == 'journal' then
    html:wikitext('[[Catégorie:Index - Périodiques]]')
  elseif args.type == 'collection' then
    html:wikitext('[[Catégorie:Index - Recueils]]')
  elseif args.type == 'dictionary' then
    html:wikitext('[[Catégorie:Index - Dictionnaires]]')
  elseif args.type == 'phdthesis' then
    html:wikitext('[[Catégorie:Index - Thèses]]')
  end

  if args.source ~= 'djvu' then
    html:wikitext('[[Catégorie:Livre non djvu]]')
  end
  if not args.sommaire then
    html:wikitext('[[Catégorie:Sommaire manquant]]')
  end

  local index = mw.ext.proofreadPage.newIndex(mw.title.getCurrentTitle())
  local red_pages = index:pagesWithLevel(mw.ext.proofreadPage.QualityLevel.NOT_PROOFREAD) + index.missingPages
  local yellow_pages = index:pagesWithLevel(mw.ext.proofreadPage.QualityLevel.PROOFREAD)

  if red_pages <= 50 then
    if red_pages > 0 then
      for _, i in pairs({ 5, 10, 20, 30, 40, 50 }) do
        if red_pages <= i then
          html:wikitext('[[Catégorie:' .. i .. ' pages ou moins à corriger]]')
          break
        end
      end
    elseif 0 < yellow_pages and yellow_pages <= 50 then
      for _, i in pairs({ 5, 10, 20, 30, 40, 50 }) do
        if yellow_pages <= i then
          html:wikitext('[[Catégorie:' .. i .. ' pages ou moins à valider]]')
          break
        end
      end
    end
  end

  return tostring(html)
end

return p
