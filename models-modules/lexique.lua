local m_bases = require("Module:bases")
local m_langs = require("Module:langues")
local m_table = require("Module:table")
local m_string = require("Module:string")
local m_params = require("Module:paramètres")

local tree = mw.loadData("Module:lexique/data")

local p = {}

function p.categorizeInterlanguageLexicon(_)
  local lexicon = mw.title.getCurrentTitle().text
  local lexiconData = tree[m_bases.lc(lexicon)] or tree[lexicon]

  if lexiconData then
    local categories = lexiconData["description"] .. "\n"

    if lexiconData["super_categories"] then
      for _, v in pairs(lexiconData["super_categories"]) do
        categories = categories .. "[[Catégorie:" .. m_bases.ucfirst(v) .. "]]"
      end
    end

    return categories .. "[[Catégorie:Lexiques]]"
  else
    return "[[Catégorie:Wiktionnaire:Lexiques non définis]]"
  end
end

local function parseLexiconTitle(title, langCode)
  local root = "Lexique en "

  if langCode == nil or langCode == "" then
    root = root .. "(.+)"
  else
    root = root .. "(" .. mw.ustring.gsub(m_langs.get_nom(langCode), "([()-])", "%%%1") .. ")"
  end

  local determiners = { "du ", "de la ", "de l’", "des " }
  local langCat, subjectCat, lang, subject

  for _, d in ipairs(determiners) do
    lang, subject = mw.ustring.match(title, root .. " " .. d .. "(.+)")

    if lang ~= nil and subject ~= nil then
      langCat = "Lexiques en " .. lang .. "|" .. subject
      subjectCat = subject .. "|" .. lang
      break
    end
  end

  return langCat, subjectCat, lang, subject
end

function p.categorizeLexicon(frame)
  local args = m_params.process(frame:getParent().args, {
    [1] = {}
  })
  local langCode = args[1]

  local title = mw.title.getCurrentTitle().text
  local langCat, lexiconCat, lang, subject = parseLexiconTitle(title, langCode)

  if langCat and lexiconCat and lang and m_langs._getLanguageCode(lang) and subject then
    local header = ""

    if tree[subject] then
      local det

      if tree[subject]["determiner"] == "du " then
        det = "le "
      elseif tree[subject]["determiner"] == "de la " then
        det = "la "
      elseif tree[subject]["determiner"] == "des " then
        det = "les "
      elseif tree[subject]["determiner"] == "de l’" then
        det = "l’"
      end

      header = mw.ustring.format(
          [=[Cette page liste les mots en [[%s]] en rapport avec %s[[%s]].

%s

Pour ajouter une entrée à cette catégorie, utilisez le modèle <code>{{[[Modèle:lexique|lexique]]|%s|%s}}</code>.
]=],
          lang, det, subject, tree[subject]["description"], subject, m_langs._getLanguageCode(lang)
      )
      if tree[subject]["super_categories"] ~= nil then
        for _, v in pairs(tree[subject]["super_categories"]) do
          if tree[v] then
            header = header .. mw.ustring.format(
                "[[Catégorie:Lexique en %s %s|%s]]",
                lang, tree[v]["determiner"] .. v, subject
            )
          else
            header = header .. "[[Catégorie:Wiktionnaire:Lexiques avec lexique parent non défini]]"
          end
        end
      end
    else
      header = "[[Catégorie:Wiktionnaire:Lexiques non définis]]"
    end

    return header .. mw.ustring.format("[[Catégorie:%s]][[Catégorie:%s]]", langCat, m_bases.ucfirst(lexiconCat))
  else
    return "[[Catégorie:Wiktionnaire:Lexiques avec erreur]]"
  end
end

local function parseLexiconTitleNoLanguage(title)
  if not title then
    return nil
  end

  local determiners = { "du ", "de la ", "de l’", "des " }
  local subject

  for _, d in ipairs(determiners) do
    subject = mw.ustring.match(title, "Lexique " .. d .. "(.+) sans langue précisée")
    if subject then
      break
    end
  end

  return subject
end

function p.categorizeLexiconWithoutLanguage(_)
  local title = mw.title.getCurrentTitle().text
  local subject = parseLexiconTitleNoLanguage(title)

  if subject then
    local header = ""

    if tree[subject] then
      local det

      if tree[subject]["determiner"] == "du " then
        det = "le "
      elseif tree[subject]["determiner"] == "de la " then
        det = "la "
      elseif tree[subject]["determiner"] == "des " then
        det = "les "
      elseif tree[subject]["determiner"] == "de l’" then
        det = "l’"
      end

      local templateLink = mw.getCurrentFrame():expandTemplate { title = "M", args = { "lexique" } }

      header = mw.ustring.format(
          [=[Cette catégorie liste les pages qui incluent le modèle %s avec la valeur <code>%s</code> sans avoir précisé le paramètre de langue.

Cette catégorie devrait être vide&nbsp;: tous les appels du modèle %s doivent mentionner un paramètre de langue.

<small>Cette catégorie est une catégorie de maintenance.<small>
[[Catégorie:Wiktionnaire:Lexiques sans langue précisée|%s]]
[[Catégorie:%s|*]]
]=],
          templateLink, subject, templateLink, subject, m_bases.ucfirst(subject)
      )
    end

    return header
  else
    return "[[Catégorie:Wiktionnaire:Lexiques avec erreur]]"
  end
end

function p.lexiconNoCat(frame)
  return p.lexicon(frame, true)
end

function p.lexicon(frame, nocat)
  nocat = nocat or false

  -- Analyse des arguments
  local args = frame:getParent().args

  local tableLen = m_table.length(args)
  if nocat then
    if tableLen < 1 then
      return [[<span style="color:red">'''Veuillez saisir au moins un lexique !'''</span>]]
    end
  else
    if tableLen < 2 then
      return [[<span style="color:red">'''Veuillez saisir au moins un lexique et un code langue !'''</span>]]
    end
  end

  local lexicons = {}
  local last

  for _, arg in ipairs(args) do
    if last ~= nil then
      table.insert(lexicons, last)
    end
    last = arg
  end

  local lang_code
  local lang

  if nocat then
    table.insert(lexicons, last)
  else
    lang_code = last
    lang = m_langs.get_nom(lang_code)
  end

  local text = ""
  local categories = ""

  if not nocat and lang == nil then
    return mw.ustring.format(
        [=[<span style="color:red" title="Code langue saisi : %s">'''Code langue inconnu !'''</span>[[Catégorie:Wiktionnaire:Lexiques avec langue manquante]]]=],
        lang_code
    )
  end

  local filteredLexicons = {}

  for _, lexicon in ipairs(lexicons) do
    if tree[lexicon] then
      table.insert(filteredLexicons, [[<span title="]] .. tree[lexicon]["description"] .. [[">'']] .. (not nocat and m_bases.ucfirst(lexicon) or lexicon) .. [[''</span>]])
      if tree[lexicon]["determiner"] then
        if not nocat then
          categories = categories .. mw.ustring.format(
              "[[Catégorie:Lexique en %s %s]]",
              lang, tree[lexicon]["determiner"] .. lexicon
          )
        end
      else
        categories = categories .. "[[Catégorie:Wiktionnaire:Lexiques avec déterminant inconnu]]"
      end
    else
      table.insert(filteredLexicons, [[<span style="color:red" title="Lexique inexistant : ]] .. lexicon .. [[">'''Lexique inconnu !'''</span>]])
      categories = categories .. "[[Catégorie:Wiktionnaire:Lexiques avec nom inconnu]]"
    end
  end

  if next(filteredLexicons) then
    text = "(" .. table.concat(filteredLexicons, ", ") .. ")"
  end

  return text .. categories
end

function p.getLexiconList(_)
  local lexicons = {}

  for lexicon, _ in pairs(tree) do
    table.insert(lexicons, lexicon)
  end

  table.sort(lexicons, function(a, b)
    return m_string.undiacritize(mw.ustring.lower(a)) < m_string.undiacritize(mw.ustring.lower(b))
  end)

  local res = ""

  for _, lexicon in ipairs(lexicons) do
    res = res .. "* " .. lexicon .. "\n"
  end

  return res
end

return p
