local m_bases = require("Module:bases")
local m_params = require("Module:paramètres")
local m_langs = require("Module:langues")

local p = {}

local cats = {}
-- List of languages for which the "’" must be kept
local keepApos = { fr = true, de = true, }
-- Shows categories when true.
-- For debugging purposes, deactivate *before* saving.
local DEBUG = false

--- Returns the category with the given name.
--- @param categoryName string The category’s name.
--- @param sortingKey string The sorting key.
--- @param asLink boolean Whether the category should be a link or not.
--- @return string The category.
local function getCategory(categoryName, sortingKey, asLink)
  if DEBUG then
    if sortingKey then
      return m_bases.fait_categorie(categoryName, nil, true) .. "(" .. sortingKey .. ")"
    else
      return m_bases.fait_categorie(categoryName, nil, true)
    end
  else
    return m_bases.fait_categorie_contenu(categoryName, sortingKey, asLink)
  end
end

--- Formats a language name.
--- @param langName string The language’s name.
--- @param langCode string The language’s code.
--- @return string The formated language name.
local function formatLanguageName(langName, langCode)
  if langName and langCode then
    return mw.ustring.format('<span class="trad-%s">%s</span>', langCode, langName)
  else
    return ""
  end
end

--- Function for the template {{T}}.
---  frame.args[1] (string): Language code.
---  frame.args[2] (string): If equal to "trier", tells that this translation has to be sorted by users.
--- @return string Template’s code.
function p.templateT(frame)
  local args = m_params.process(frame:getParent().args, {
    [1] = {},
    [2] = {},
  })
  local langCode = args[1]
  local sort = args[2] == "trier"

  -- Language code is mandatory.
  if not langCode then
    return "[[WT:Liste des langues|Langue à préciser]]"
        .. getCategory("Wiktionnaire:Traductions T sans langue précisée")
  end

  local langName = m_langs.get_nom(langCode)
  local formatedText
  local category

  if langName then
    formatedText = m_bases.ucfirst(langName)
    local categoryNamePrefix = sort and "Wiktionnaire:Traductions à trier en " or "Traductions en "
    category = getCategory(categoryNamePrefix .. langName)

    -- Undefined language code, categorize for easy checking.
  else
    formatedText = mw.ustring.format('<i><span style="color:red">%s</span></i>[[WT:Liste des langues|*]]', langCode)
    category = getCategory("Wiktionnaire:Traductions T avec code langue non défini", langCode)
  end

  return formatLanguageName(formatedText, langCode) .. category
end

--- Generates the link pointing to another Wiktionary.
--- @param langCode string Word’s language code.
--- @param word string The word to link to.
--- @param status string The status (either "existe", "inconnu", "absent", "" or nil).
--- @return string The outgoing link.
local function generateOutgoingLink(langCode, word, status)
  local displayedText = ""

  -- Link destination
  local wikiLangCode = m_langs.get_lien_Wikimedia(langCode) or langCode
  if not keepApos[langCode] then
    word = mw.ustring.gsub(word, "[’ʼ]", "'") -- apostrophes dactylographique et modificative
  end
  local destination = mw.ustring.format(":%s:%s", wikiLangCode, word)

  if not m_langs.has_wiktionary(langCode) and langCode ~= 'conv' then
    displayedText = '<span class="trad-nowikt">(*)</span>'
    destination = "Wiktionnaire:Pas de wiktionnaire dans cette langue"
  elseif status == "existe" then
    displayedText = mw.ustring.format('<span class="trad-existe">(%s)</span>', wikiLangCode)
  elseif status == "inconnu" then
    displayedText = mw.ustring.format('<span class="trad-inconnu">(%s)</span>', wikiLangCode)
  elseif status == "absent" then
    displayedText = mw.ustring.format('<span class="trad-absent">(%s)</span>', wikiLangCode)
  else
    displayedText = ""
    destination = nil
  end

  return destination
      and mw.ustring.format('<span class="trad-exposant">[[%s|%s]]</span>', destination, displayedText)
      or ""
end

--- Formats the given text as traditional script (mainly for Chinese).
--- @param langCode string The language code.
--- @param word string The word to format.
--- @return string The formated word.
local function formatTraditionalScript(langCode, word)
  if not word then
    return nil
  end

  -- Traditional Chinese is better displayed by browsers when using the code zh-Hant.
  if langCode == "zh" then
    langCode = "zh-Hant"
  elseif langCode == "ko" then
    langCode = "ko-Hani"
  end
  -- Mark the text as “traditional” for gadgets.
  local shownText = mw.ustring.format('<span class="ecrit_tradi">%s</span>', word)

  return m_bases.lien_modele(word, langCode, nil, shownText, true)
end

--- Formats a transcription.
--- @param langCode string Transcription’s language code.
--- @param transcription string Text to format.
--- @param traditionalLangCode string Optional language code for traditional scripts.
--- @return string The formated transcription.
local function formatTranscription(langCode, transcription, traditionalLangCode)
  if not transcription or not langCode then
    return nil
  end

  local lang = traditionalLangCode or langCode .. "-Latn"
  return m_bases.balise_langue(transcription, lang)
end

--- Returns the full gender label for the given code.
--- @param gender string Gender code.
--- @return string The full gender label.
local function formatGender(gender)
  if not gender then
    return nil
  end

  -- List of authorized genders and associated numbers
  local gendersList = {
    ["m"] = "masculin",
    ["f"] = "féminin",
    ["n"] = "neutre",
    ["c"] = "commun",
    ["s"] = "singulier",
    ["p"] = "pluriel",
    ["d"] = "duel",
    ["mf"] = "masculin et féminin identiques",
    ["mp"] = "masculin pluriel",
    ["fp"] = "féminin pluriel",
    ["mfp"] = "masculin et féminin pluriel",
    ["np"] = "neutre pluriel",
    ["ma"] = "masculin animé",
    ["mi"] = "masculin inanimé",
    ["fa"] = "féminin animé",
    ["fi"] = "féminin inanimé",
    ["na"] = "neutre animé",
    ["ni"] = "neutre inanimé",
  }

  if gendersList[gender] then
    return mw.ustring.format("''%s''", gendersList[gender])
  else
    table.insert(cats, getCategory("Wiktionnaire:Traductions avec genre inexistant", gender))
    return ""
  end
end

--- Generates the code for the templates {{trad}}, {{trad+}}, {{trad-}} and {{trad--}}.
--- @param status string Status of the interwiki link.
--- @param langCode string Translation’s language code.
--- @param word string The translation.
--- @param gender string Word’s gender.
--- @param alternativeText string Alternative text to display instead of the word.
--- @param transcription string Word’s transcription.
--- @param traditionalLangCode string Language code for traditional script if any (for Chinese and Korean).
--- @param traditionalTerm string Word for traditional script (for Chinese and Korean).
--- @return string Template’s code.
function p._templateTrad(status, langCode, word, gender, alternativeText, transcription, traditionalLangCode, traditionalTerm)
  if not langCode then
    table.insert(cats, getCategory("Wiktionnaire:Traductions sans langue précisée"))
    return '<span style="color:red;">[[WT:Liste des langues|Langue à préciser]] (paramètre 1)</span>'
  elseif m_langs.get_nom(langCode) == nil then
    table.insert(cats, getCategory("Wiktionnaire:Traductions trad avec code langue non défini"))
  end

  local localLink = ""
  local superscriptText = ""

  if not word then
    table.insert(cats, getCategory("Wiktionnaire:Traductions sans traduction précisée"))
    localLink = '<span style="color:red">pas de traduction précisée (paramètre 2)</span>'
  else
    localLink = m_bases.lien_modele(word, langCode, nil, alternativeText, true)
    superscriptText = generateOutgoingLink(langCode, word, status)
  end

  local formatedTraditionalScript = traditionalTerm and formatTraditionalScript(langCode, traditionalTerm) or nil
  local formatedTranscription = transcription and formatTranscription(langCode, transcription, traditionalLangCode) or nil
  local formatedGender = formatGender(gender)

  local finalText = localLink

  if superscriptText then
    finalText = finalText .. "&nbsp;" .. superscriptText
  end
  if formatedTraditionalScript then
    finalText = finalText .. " (" .. formatedTraditionalScript .. ")"
  end
  if formatedTranscription then
    finalText = finalText .. " " .. formatedTranscription
  end
  if formatedGender then
    finalText = finalText .. " " .. formatedGender
  end

  return finalText
end

--- Generates the code for the templates {{trad}}, {{trad+}}, {{trad-}} and {{trad--}}.
---  frame.args["statut"] (string): Status of the interwiki link.
---  parent frame.args[1] (string): Translation’s language code.
---  parent frame.args[2] (string): The translation.
---  parent frame.args[3] (string): Word’s gender.
---  parent frame.args["dif"] (string): Alternative text to display instead of the word.
---  parent frame.args["tr"]/parent frame.args["R"] (string): Word’s transcription.
---  parent frame.args["lang-tr"]/parent frame.args["lang-R"] (string): Language code for traditional script if any (for Chinese and Korean).
---  parent frame.args["tradi"] (string): Word for traditional script (for Chinese and Korean).
--- @return string Template’s code.
function p.templateTrad(frame)
  local status = m_params.process(frame.args, {
    ["statut"] = { enum = { "nowikt", "existe", "inconnu", "absent", nil } },
  })["statut"]

  local args = m_params.process(frame:getParent().args, {
    [1] = {},
    [2] = {},
    [3] = {},
    ["lang-tr"] = {},
    ["lang-R"] = { alias_of = "lang-tr" },
    ["tr"] = {},
    ["R"] = { alias_of = "tr" },
    ["dif"] = {},
    ["tradi"] = {},
  })
  local langCode = args[1]
  local traditionalLangCode = args["lang-tr"]

  local word = args[2]
  local alternativeText = args["dif"]
  local traditionalTerm = args["tradi"]
  local transcription = args["tr"]

  local gender = args[3]

  local wikicode = p._templateTrad(status, langCode, word, gender, alternativeText, transcription, traditionalLangCode, traditionalTerm)
  return wikicode .. table.concat(cats)
end

return p
