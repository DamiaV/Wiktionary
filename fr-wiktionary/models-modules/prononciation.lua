local m_params = require("Module:paramètres")
local m_langues = require("Module:langues")
local m_bases = require("Module:bases")
local m_table = require("Module:table")

-- On récupère les données (en cache)
local tree = mw.loadData("Module:prononciation/data")

local p = {}

--- Page principale des annexes de prononciations
p.racine_pron = 'Annexe:Prononciation'

--- Retourne la page de l’annexe de prononciation pour une langue donnée.
--- @param lang_code string le code de langue
--- @return string|nil la page de prononciation si elle existe, nil sinon
function p.page_pron(lang_code)
  local langName = m_langues.get_nom(lang_code)

  if langName then
    local pronPage = p.racine_pron .. '/' .. langName
    if m_bases.page_existe(p.racine_pron .. '/' .. langName) then
      return pronPage
    end
  end

  return nil
end

--- Met en forme une prononciation avec un lien vers l’annexe dédiée si elle existe.
--- Cette fonction destinée à être appelée par d’autres modules lua.
--- @param prons string[] les prononciations API ; si la valeur "-" est passé, la prononciation n’est pas affichée
--- @param langCode string le code de la langue ; s’il est absent, un message d’erreur est affichée à la place de la prononciation et la page est catégorisée dans Wiktionnaire:Prononciations avec langue manquante
--- @param delimiters string les délimiteurs ("[]", "//" ou "\\") ; la valeur par défaut est "\\"
--- @param isAudioLinked boolean indique si un fichier audio est associé à la prononciation pour ajouter la catégorie adéquate
--- @param enforceCharset boolean analyser la prononciation pour s'assurer qu'elle n'utilise que les caractères attendus (pour la prononciation prototypique notamment)
--- @return string la prononciation formatée
function p.lua_pron(prons, langCode, delimiters, isAudioLinked, enforceCharset)
  delimiters = delimiters or '\\\\'
  isAudioLinked = isAudioLinked
  local delimiter1 = string.sub(delimiters, 1, 1)
  local delimiter2 = string.sub(delimiters, 2, 2)
  local langName = m_langues.get_nom(langCode)
  local currentPageTitle = mw.title.getCurrentTitle()

  if not langCode or langCode == "" or not langName then
    return m_bases.fait_categorie_contenu("Wiktionnaire:Prononciations avec langue manquante") .. [[<span style="color:red">'''Erreur sur la langue !'''</span>]]
  end

  local text = ""

  -- Pas de prononciation donnée : invite + catégorie
  if not prons or #prons == 0 or #prons == 1 and (prons[1] == "-" or prons[1] == "" or not prons[1]) then
    -- Invitation à ajouter la prononciation
    text = ('<span title="Prononciation à préciser">' .. delimiter1 .. '<small><span class="plainlinks stubedit">['
        .. tostring(mw.uri.fullUrl(currentPageTitle.fullText, 'action=edit'))
        .. ' Prononciation ?]</span></small>' .. delimiter2 .. '</span>')

    -- Catégorisation de cette absence de prononciation
    local categoryLang = langName and ('en ' .. langName) or 'sans langue précisée'
    local categoryName = 'Prononciations '
    if isAudioLinked then
      categoryName = categoryName .. 'phonétiques'
    end
    categoryName = categoryName .. ' manquantes ' .. categoryLang
    local category = m_bases.fait_categorie_contenu('Wiktionnaire:' .. categoryName)
    if category then
      text = text .. category
    end
  else
    -- Page d’aide de la prononciation dans la langue donnée
    local pronPage = p.page_pron(langCode) or p.racine_pron
    for i, pron in ipairs(prons) do
      if pron ~= nil then
        -- On affiche la prononciation avec le lien vers la page d’aide
        text = text .. mw.ustring.format(
            '[[%s|<span class="API" title="Prononciation API">%s%s%s</span>]]',
            pronPage, delimiter1, pron, delimiter2
        )

        -- Vérification du charset si demandé et disponible
        if enforceCharset and tree[langCode] ~= nil then
          text = text .. p.check_pron(langCode, langName, pron)
        end

        if i < #prons then
          text = text .. " <small>ou</small> "
        end
      end
    end
  end

  return text
end

function p.check_pron(langCode, langName, pron)
  local charset = tree[langCode]['charset']

  pron = mw.ustring.gsub(mw.ustring.gsub(pron, "&#32;", " "), "&nbsp;", " ")
  -- Itération sur chaque caractère de la prononciation
  for c in mw.ustring.gmatch(pron, '.') do
    if not m_table.contains(charset, c) then
      -- Catégorisation de l'emploi d'un caractère non-attendu
      local categoryLang = langName and ('en ' .. langName) or 'sans langue précisée'
      return m_bases.fait_categorie_contenu('Wiktionnaire:Prononciations employant des caractères inconnus ' .. categoryLang, c)
    end
  end
  return ""
end

--- Extrait les paramètres de l’objet frame.
--- Lance une erreur si les paramètres ne sont pas corrects, sauf si uniquement la langue est erronée ou absente.
--- @param frame table le 1er paramètre est la prononciation en API, le 2e le code de la langue
--- @param allow_multiple_prons boolean
--- @return table|nil,boolean les paramètres si la langue est correcte, nil sinon ;
---                           un booléen indiquant si la langue est correctement renseignée
local function getParams(frame, allow_multiple_prons)
  if allow_multiple_prons then
    local prons = {}
    for _, arg in ipairs(frame:getParent().args) do
      table.insert(prons, arg)
    end
    if #prons == 0 then
      return nil, false
    end
    local langCode = table.remove(prons, #prons)
    return { prons, langCode }, true
  end

  local params = {
    [1] = { required = true, allow_empty = true },
    [2] = { required = true },
    ["pron"] = { alias_of = 1 },
    ["lang"] = { alias_of = 2 },
  }
  local args, success = m_params.process(frame:getParent().args, params, true)
  if success then
    return { { args[1] }, args[2] }, true
  elseif args[1] == 2 and (args[2] == m_params.EMPTY_PARAM or args[2] == m_params.MISSING_PARAM) then
    return nil, false
  end
  error(args[3])
end

--- Fonction qui récupère les paramètres de l’objet frame et retourne la prononciation formatée.
--- @param frame table le 1er paramètre est la prononciation en API, le 2e le code de la langue
--- @param delimiters string les délimiteurs ("[]", "//" ou "\\")
--- @param enforceCharset boolean analyser la prononciation pour s'assurer qu'elle n'utilise que les caractères attendus
---                               (pour la prononciation prototypique principalement)
--- @return string la prononciation formatée
local function pronunciation(frame, delimiters, enforceCharset)
  local args, success = getParams(frame, enforceCharset)
  local apiProns = {}
  local langCode = ""

  if success then
    apiProns = args[1]
    langCode = args[2]
  else
    return m_bases.fait_categorie_contenu("Wiktionnaire:Prononciations avec langue manquante")
        .. [[<span style="color:red; font-weight: bold;">Code langue manquant !</span>]]
  end

  return p.lua_pron(apiProns, langCode, delimiters, false, enforceCharset)
end

--- Fonction destinée à être utilisée directement depuis le modèle pron.
--- @param frame table le 1er paramètre est la prononciation en API, le 2e le code de la langue
function p.pron(frame)
  return pronunciation(frame, '\\\\', true)
end

--- Fonction destinée à être utilisée directement depuis le modèle phon.
--- @param frame table le 1er paramètre est la prononciation en API, le 2e le code de la langue
function p.phon(frame)
  -- Prononciation entre crochets
  return pronunciation(frame, '[]', false)
end

--- Fonction destinée à être utilisée directement depuis le modèle phono.
--- @param frame table le 1er paramètre est la prononciation en API, le 2e le code de la langue
function p.phono(frame)
  -- Prononciation entre barres obliques
  return pronunciation(frame, '//', false)
end

--- Fonction destinée à être utilisée directement depuis le modèle écouter.
--- @param frame table Paramètres :
--- 1 = pays/région
--- 2 ou pron = prononciation en API
--- 3 ou lang = code ISO de la langue (obligatoire)
--- 4 ou niveau = niveau de maitrise de la langue de la/le locuteurice.
--- audio = nom du fichier audio (sans le préfixe File:)
--- titre = texte prononcé si différent du mot vedette
function p.pron_reg(frame)
  local levels = {
    ['débutant'] = 'débutant',
    ['moyen'] = 'niveau moyen',
    ['bon'] = 'bon niveau',
  }

  local params = {
    [1] = {},
    [2] = {},
    [3] = { required = true },
    [4] = { enum = m_table.keysToList(levels) },
    ['pron'] = { alias_of = 2 },
    ['lang'] = { alias_of = 3 },
    ['niveau'] = { alias_of = 4 },
    ['audio'] = {},
    ['titre'] = { default = mw.title.getCurrentTitle().text },
  }
  local args = m_params.process(frame:getParent().args, params)
  local region = args[1]
  local pron = args[2]
  local langCode = args[3]
  local level = args[4]
  local audioFile = args['audio']
  local title = args['titre']

  -- Génération du wikicode
  local formattedRegion = region or '<small>(Région à préciser)</small>'
  local text = mw.ustring.format(
      '<span class="audio-pronunciation"><span class="audio-region" data-region="%s">%s</span>&nbsp;: ',
      mw.text.encode(region or ""),
      formattedRegion
  )

  if pron or audioFile then
    local apiPron = mw.ustring.format(
        '<span class="audio-ipa" data-ipa="%s">%s</span>',
        pron or "",
        p.lua_pron({ pron }, langCode, '[]', true)
    )
    if audioFile then
      text = text .. mw.ustring.format(
          'écouter «&nbsp;<span class="audio-word" data-word="%s">%s</span>',
          mw.text.encode(title),
          title
      )
      if langCode and mw.title.getCurrentTitle().namespace == 0 then
        local langName = m_langues.get_nom(langCode)
        if langName then
          text = text .. mw.ustring.format('[[Catégorie:Prononciations audio en %s]]', langName)
        else
          text = text .. '[[Catégorie:Prononciations audio sans langue précisée]]'
        end
      end
      text = text .. ' ' .. apiPron
      text = text .. mw.ustring.format(
          '&nbsp;» <span class="audio-file" data-file="%s">[[File:%s]]</span>',
          mw.text.encode(audioFile),
          audioFile
      )
    else
      text = text .. apiPron
    end
    if level then
      text = text .. mw.ustring.format(
          [[ (''<span class="audio-mastery-level" data-level="%s">%s</span>'')]],
          level,
          levels[level]
      )
    end
  else
    text = text .. '<small>merci de préciser une prononciation phonétique ou un fichier audio (voir la [[Modèle:écouter|notice]])</small>'
  end

  return text .. '</span>'
end

--- Fonction destinée à être utilisée directement depuis le modèle h aspiré.
--- Pour les paramètres, voir la doc du modèle h_aspiré (c'est un peu compliqué).
function p.h_aspire(frame)
  local params = {
    ["nocat"] = { type = m_params.BOOLEAN },
  }
  local args = m_params.process(frame:getParent().args, params)
  local nocat = args["nocat"]
  local text = '<sup style="font-size:83.33%;line-height:1"><small>([[h aspiré]])</small></sup>'

  -- catégorisation si dans "principal" (namespace = 0)
  if mw.title.getCurrentTitle().namespace == 0 and not nocat then
    text = text .. '[[Catégorie:Termes en français à h aspiré]]'
  end

  return text
end

return p
