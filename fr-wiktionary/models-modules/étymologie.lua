-- <nowiki>
local m_bases = require("Module:bases")
local m_params = require("Module:paramètres")
local m_langues = require("Module:langues")
local m_table = require("Module:table")
local m_Unicode_data = require("Module:données Unicode")

local checkLang = function(langCode, allowSpecial)
  return m_langues.getName(langCode, allowSpecial) ~= nil
end

local p = {}

--- Function for templates {{sigle}}, {{abréviation}}, {{acronyme}}, etc.
---  frame.args["terme"] (string) : Etymological process’ name (sigle, verlan, etc.).
---  frame.args["terme-pluriel"] (string, optional) : Plural form of previous parameter.
---   If not present, an "s" will be appended to the first parameter.
---  frame.args["de"] (string, optional) : Source word.
---  frame.args["de2"] (string, optional) : Second source word.
---  frame.args["tr"] (string, optional) : Source word transcription.
---  frame.args["tr2"] (string, optional) : Second source word transcription.
---  frame.args["sens"] (string, optional) : Source word sense.
---  frame.args["sens2"] (string, optional) : Second source word sense.
---  frame.args["code"] (string, optional) : Source word link nature anchor.
---  frame.args["code2"] (string, optional) : Second source word link nature anchor.
---  frame.args["texte"] (string, optional) : Text to show in place of source word.
---  frame.args["texte2"] (string, optional) : Text to show in place of second source word.
---  frame.args["adjectif"] (string, required if nocat is false) : An adjective to add between words “terme” and “de”.
---  frame.args["lang"] (string, required if nocat is false) : Language code of target word.
---  frame.args["lang-lien"] (string, optional) : Language code of source word(s).
---   If not present, lang parameter will be used instead.
---  frame.args["m"] (string, optional) : If true, the first word’s initial letter will be in upper case.
---  frame.args["nolien"] (booléen, optional) : If true, no link will be created to the source word(s).
---  frame.args["nocat"] (booléen, optional) : If true, no category will be inserted.
---  frame.args["clé"] (string, optional) : Sort key for the categories.
---  frame.args["nom-cat"] (string, optional) : First category name.
---  frame.args["nom-cat2"] (string, optional) : Second category name.
--- @return string Template’s text and relevant categories.
function p.templateEtymologyConstruction(frame)
  local params = {
    ["terme"] = { required = true },
    ["terme-pluriel"] = {},
    ["de"] = {},
    ["de2"] = {},
    ["tr"] = {},
    ["R"] = { alias_of = "tr" },
    ["tr2"] = {},
    ["R2"] = { alias_of = "tr2" },
    ["sens"] = {},
    ["sens2"] = {},
    ["code"] = {},
    ["code2"] = {},
    ["texte"] = {},
    ["texte2"] = {},
    ["adjectif"] = {},
    ["lang"] = { checker = checkLang },
    ["langue"] = { alias_of = "lang" },
    ["lang-lien"] = { checker = checkLang },
    ["m"] = { type = m_params.BOOLEAN, default = false },
    ["nolien"] = { type = m_params.BOOLEAN, default = false },
    ["nocat"] = { type = m_params.BOOLEAN, default = false },
    ["clé"] = { default = mw.title.getCurrentTitle().text },
    ["nom-cat"] = {},
    ["nom-cat2"] = {},
  }
  local args = m_params.process(frame.args, params)
  local term = args["terme"]
  local termPlural = args["terme-pluriel"] or (term .. "s")
  local caps = args["m"]
  local from = args["de"]
  local from2 = args["de2"]
  local transcription = args["tr"]
  local transcription2 = args["tr2"]
  local meaning = args["sens"]
  local meaning2 = args["sens2"]
  local code = args["code"]
  local code2 = args["code2"]
  local text = args["texte"] or from
  local text2 = args["texte2"] or from2
  local adj = args["adjectif"]
  local noLink = args["nolien"]
  local noCategorization = args["nocat"]
  local lang = args["lang"]
  local linkLang = args["lang-lien"] or (lang or "fr")
  local sortingKey = args["clé"]
  local category = args["nom-cat"]
  local category2 = args["nom-cat2"]

  local res = mw.ustring.format("[[%s#fr|%s]]", term, caps and m_bases.ucfirst(term) or term)

  if code then
    linkLang = linkLang .. "-" .. code
  end

  -- TODO call {{lien}} instead of reinventing it
  local format = function(baseWord, replacementText, baseString, additionalText, transcription, meaning)
    if baseWord then
      local word
      if noLink then
        word = baseWord
      else
        word = mw.ustring.format("[[%s#%s|%s]]", baseWord, linkLang, replacementText)
      end

      baseString = baseString .. mw.ustring.format(additionalText .. " de ''%s''", word)
    end

    if transcription then
      if baseString == "" then
        baseString = mw.ustring.format("''%s''", transcription)
      else
        baseString = mw.ustring.format("%s, ''%s''", baseString, transcription)
      end
    end

    if meaning then
      if baseString == "" then
        baseString = mw.ustring.format("(«&nbsp;%s&nbsp;»)", meaning)
      else
        baseString = mw.ustring.format("%s («&nbsp;%s&nbsp;»)", baseString, meaning)
      end
    end

    return baseString
  end

  local getCategory = function(cat_name)
    return m_bases.ucfirst(cat_name) .. " " ..
        (lang and "en " .. m_langues.getName(lang) or "sans langue précisée")
  end

  res = format(from, text, res, adj and (" " .. adj) or "", transcription, meaning)
  res = format(from2, text2, res, " et", transcription2, meaning2)

  if noCategorization then
    return res
  else
    local categoryName
    if category then
      categoryName = category
    else
      if lang == nil then
        error("Code de langue manquant")
      end
      categoryName = getCategory(termPlural)
    end
    res = res .. m_bases.fait_categorie_contenu(categoryName, sortingKey)

    if category2 then
      if lang == nil then
        error("Code de langue manquant")
      end
      categoryName = getCategory(category2)
      res = res .. m_bases.fait_categorie_contenu(categoryName, sortingKey)
    end

    return res
  end
end

-- Various latin codes accepted by {{étyl}}.
local LATIN_CODES = {
  "bas latin",
  "gallo-roman",
  "latin archaïque",
  "latin classique",
  "latin contemporain",
  "latin ecclésiastique",
  "latin humaniste",
  "latin impérial",
  "latin médiéval",
  "latin populaire",
  "latin tardif",
  "latin vulgaire",
  "néolatin",
}

local function getLanguageCode(langCode)
  return m_table.contains(LATIN_CODES, langCode) and "la" or langCode
end

local function checkLangExtended(langCode)
  return checkLang(getLanguageCode(langCode), true)
end

local function getLanguageName(langCode)
  return m_table.contains(LATIN_CODES, langCode) and langCode or m_langues.getName(langCode, true)
end

local function italicIfLatinScript(text)
  return m_Unicode_data.shouldItalicize(text) and mw.ustring.format("''%s''", text) or text
end

--- Function for templates {{étyl}} and {{étylp}}. If at least one of the two languages is unknown or missing,
--- an error message is displayed in place of the text and the category
--- [[Catégorie:Wiktionnaire:Modèle étyl sans langue précisée]] is inserted.
---  frame.args[1] (string) : Source language code.
---  frame.args[2] (string) : Target language code.
---  frame.args["mot", 3] (string, optional) : Source word.
---  frame.args["tr", R, 4] (string, optional) : Transcription of source word.
---  frame.args["sens", 5] (string, optional) : Meaning of source word.
---  frame.args["dif"] (string, optional) : Text to show instead of the source word.
---  frame.args["type"] (string, optional) : Section code in source word’s page.
---  frame.args["num"] (int, optional) : Section number in source word’s page.
---  frame.args["nocat"] (boolean, optional) : If true and no errors are found, no categories will be returned.
---  frame.args["lien"] (boolean, optinal) : If true, inserts a link to the source language.
--- @return string Template’s text and relevant categories.
function p.templateEtyl(frame)
  local args = m_params.process(frame:getParent().args, {
    [1] = {},
    [2] = {},
    ["mot"] = {},
    [3] = { alias_of = "mot" },
    ["tr"] = {},
    ["R"] = { alias_of = "tr" },
    [4] = { alias_of = "tr" },
    ["sens"] = {},
    [5] = { alias_of = "sens" },
    ["dif"] = {},
    ["type"] = {},
    ["num"] = { type = m_params.INT, checker = function(n)
      return n > 0
    end },
    ["nocat"] = { type = m_params.BOOLEAN, default = false },
    ["lien"] = { type = m_params.BOOLEAN, default = false },
  })

  local forProperNouns = frame.args["noms propres"] ~= nil
  local originLang = args[1]
  local destLang = args[2]
  local word = args["mot"]
  local transcription = args["tr"]
  local meaning = args["sens"]
  local alternativeText = args["dif"]
  local anchorSection = args["type"]
  local anchorNum = args["num"]
  local noCat = args["nocat"]
  local linkToLang = args["lien"]

  if not checkLangExtended(originLang) or (not noCat and not checkLangExtended(destLang)) then
    return '<span style="color:red">Erreur modèle étyl&nbsp;: langue inconnue ou absente</span>' ..
        m_bases.fait_categorie_contenu("Wiktionnaire:Modèle étyl sans langue précisée")
  end

  local categories = ""
  local content = ""
  local anchor = ""
  local originLangName = getLanguageName(originLang)
  local destLangName = getLanguageName(destLang)
  local displayedLang = linkToLang and m_bases.lien_modele(originLangName, "fr") or originLangName

  content = ""
  if word then
    if anchorSection then
      anchor = anchorSection
    end
    if anchorNum then
      anchor = anchor .. "-" .. tostring(anchorNum)
    end

    content = italicIfLatinScript(m_bases.lien_modele(word, getLanguageCode(originLang), anchor, alternativeText, true))
  end

  if transcription then
    if content == "" then
      content = mw.ustring.format("''%s''", transcription)
    else
      content = mw.ustring.format("%s, ''%s''", content, transcription)
    end
  end
  if meaning then
    if content == "" then
      content = mw.ustring.format("(«&nbsp;%s&nbsp;»)", meaning)
    else
      content = mw.ustring.format("%s («&nbsp;%s&nbsp;»)", content, meaning)
    end
  end

  if content == "" then
    content = displayedLang
  else
    content = mw.ustring.format("%s %s", displayedLang, content)
  end

  if not noCat then
    local catNamePrefix = forProperNouns and "Noms propres" or "Mots"
    if originLang == destLang then
      categories = categories .. m_bases.fait_categorie_contenu("Appels de modèles incorrects:étyl")
    elseif originLang == "onom" then
      categories = categories .. m_bases.fait_categorie_contenu(mw.ustring.format(
          "%s en %s issus d’une onomatopée",
          catNamePrefix,
          destLangName
      ))
    else
      categories = categories .. m_bases.fait_categorie_contenu(mw.ustring.format(
          "%s en %s issus d’un mot en %s",
          catNamePrefix,
          destLangName,
          originLangName
      ))
    end
  end

  return content .. categories
end

function p.templateEtylcat(frame)
  return ""
end

--- Function for template {{lien-ancre-étym}}.
---  frame.args[1] (string) : Language code.
---  frame.args[2] (string) : Section ID.
---  frame.args[3] (int, optional) : Section’s number.
---  frame.args["locution"] (int, optional) : Whether the target section is a locution. Changes the displayed text.
--- @return string Template’s text.
function p.templateLienAncreEtym(frame)
  local wordTypes = mw.loadData("Module:types de mots/data")
  local args = m_params.process(frame:getParent().args, {
    [1] = { required = true, checker = checkLang },
    [2] = { required = true, checker = function(v)
      return wordTypes["alias"][v] ~= nil or wordTypes["texte"][v] ~= nil
    end },
    [3] = { type = m_params.INT, checker = function(v)
      return v > 0
    end },
    ["locution"] = { type = m_params.BOOLEAN, default = false },
  })
  local langCode = args[1]
  local wordTypeData = wordTypes["texte"][wordTypes["alias"][args[2]] or args[2]]
  local locution = args["locution"] and wordTypeData["locution"] ~= nil
  local text = wordTypeData[locution and "locution" or "mot"]
  local number = args[3]
  local anchor = langCode .. "-" .. wordTypeData["abrev"] .. (number ~= nil and ("-" .. tostring(number)) or "")
  text = m_bases.ucfirst(text)
  if number ~= nil then
    text = text .. " " .. tostring(number)
  end

  return mw.ustring.format("''([[#%s|%s]])''", anchor, text)
end

return p
-- </nowiki>
