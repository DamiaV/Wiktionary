local m_bases = require("Module:bases")
local m_langues = require("Module:langues")
local m_lemme = require("Module:lemme")
local m_locution = require("Module:locution")
local m_params = require("Module:paramètres")
local m_sectionArticle = require("Module:section article")
local m_sino = require("Module:sinogramme")
local m_typesDeMots = require("Module:types de mots")

--- Only set to true when previewing
local DEBUG = false
local SHOW_ANCHORS = false

--- List of word type for “conventions internationales” with special category names
local SPECIAL_CONV_WORD_TYPES = {
  ["noms scientifiques"] = true,
  ["numéraux"] = true,
}

local p = {}

--- Add the given category to the specified table.
--- If `DEBUG` is `true`, a link to the category will be appended instead.
--- @param categories table<string> The table to append the category to.
--- @param catName string The category’s name, without “Catégorie:”.
--- @param sortKey string|nil An optional sort key.
local function appendCategory(categories, catName, sortKey)
  local wikicode = ""
  if DEBUG then
    if sortKey then
      wikicode = m_bases.fait_categorie(catName, nil, true) .. "(" .. sortKey .. ")"
    else
      wikicode = m_bases.fait_categorie(catName, nil, true)
    end
  else
    wikicode = m_bases.fait_categorie_contenu(catName, sortKey)
  end
  table.insert(categories, wikicode)
end

--- Build the title text for the given word type.
--- @param wordType string The word type.
--- @param isFlexion boolean Whether the word is a flexion.
--- @param isLocution boolean Whether the word is a locution.
--- @param number number The section’s number.
--- @return string The title text.
local function buildTitle(wordType, isFlexion, isLocution, number)
  local numberText = ""
  if number ~= nil then
    numberText = " " .. tostring(number)
  end
  local title = m_typesDeMots.getWordTypeNameSingular(wordType, isLocution, isFlexion)
  return m_bases.ucfirst(title) .. numberText
end

--- Build the ID for the given word type section.
--- @param langCode string The language code for the section.
--- @param wordType string The word type.
--- @param isFlexion boolean Whether the word is a flexion.
--- @param number number The section’s number.
--- @return string The section’s ID.
local function buildSectionId(langCode, wordType, isFlexion, number)
  local abbr = m_typesDeMots.getWordTypeAbbr(wordType, isFlexion)
  local ancre = ""
  if langCode and abbr then
    ancre = langCode .. "-" .. abbr .. "-" .. (number or 1)
  end
  return ancre
end

--- Append all relevent content categories for the given word type section configuration.
--- @param categories table<string> The table to append categories to.
--- @param langCode string The language code of the section.
--- @param wordType string The word type.
--- @param isFlexion boolean Whether the word is a flexion.
--- @param isLocution boolean Whether the word is a locution.
--- @param sortKey string|nil An optional sort key.
--- @param gender string|nil For `wordType == "prénom"`, the firt name’s gender.
--- @param pageTitle string The current page’s title.
local function appendContentCategories(categories, langCode, wordType, isFlexion, isLocution, sortKey, gender, pageTitle)
  local lemmaCategory = m_lemme.getLemmaCategoryName(langCode, wordType, isFlexion, isLocution)
  if lemmaCategory then
    appendCategory(categories, lemmaCategory, sortKey)
  end

  local pluralWordTypeName = m_typesDeMots.getWordTypeNamePlural(wordType, isLocution, isFlexion)

  if gender then
    if mw.ustring.find(pluralWordTypeName, "prénoms", 1, true) then
      if gender == "m" then
        pluralWordTypeName = pluralWordTypeName .. " masculins"
      elseif gender == "f" then
        pluralWordTypeName = pluralWordTypeName .. " féminins"
      elseif gender == "mf" then
        pluralWordTypeName = pluralWordTypeName .. " mixtes"
      end
    else
      appendCategory(categories, "Wiktionnaire:Sections avec paramètres superflus")
    end
  end

  local langName = m_langues.getName(langCode)

  -- Build "Category:<wordType> en <langName>"
  local catName = ""

  -- Special cases for "conv" language, do not append "en <langName>"
  if langCode == "conv" and SPECIAL_CONV_WORD_TYPES[pluralWordTypeName] then
    catName = m_bases.ucfirst(pluralWordTypeName)
  else
    catName = m_bases.ucfirst(pluralWordTypeName) .. " en " .. langName
  end

  -- Add language category with sort key if specified to modify the one appended by [[Template:langue]]
  if sortKey then
    appendCategory(categories, langName, sortKey)
  end

  -- Sinogram-specific sort key
  if pluralWordTypeName == "sinogrammes" then
    sortKey = m_sino.chaine_radical_trait(pageTitle)
  end

  appendCategory(categories, catName, sortKey)
end

--- Build the title for a word type section.
--- @param pageTitle title The current page title object.
--- @param wordType string The word type.
--- @param langCode string|nil The language code. May be `nil` if `noCat` is `true`.
--- @param number number|nil The section number. May be `nil`.
--- @param isFlexion boolean Whether the word is a flexion or not.
--- @param locutionStatus string|nil Indication on whether the word is a location.
---   Accepted values are `"oui"`, `"non"`, or `nil`.
---   If `nil` the function will try to automatically detect whether the word is a locution.
--- @param gender string|nil For first names, the gender to use for categorization.
--- @param sortKey string|nil The sort key to use for categorization. May be `nil`.
--- @param noCat boolean Whether to disable categorization.
--- @param categories table<string> A table to put categories into.
--- @return string The formatted section title.
local function buildWordTypeSectionTitle(
    pageTitle,
    wordType,
    langCode,
    number,
    isFlexion,
    locutionStatus,
    gender,
    sortKey,
    noCat,
    categories
)
  if wordType == "nom" and langCode == "conv" then
    wordType = "nom scientifique"
  end

  local isLocution = false
  if not locutionStatus then
    isLocution = m_locution.isLocution(pageTitle, wordType, langCode)
  elseif locutionStatus == "oui" then
    isLocution = true
    appendCategory(categories, "Wiktionnaire:Sections de type avec locution forcée")
  elseif locutionStatus == "non" then
    appendCategory(categories, "Wiktionnaire:Sections de type avec locution forcée")
  else
    -- Should never happen
    error("invalid value for locutionStatus: " .. tostring(locutionStatus))
  end

  -- Flag pages that use word type aliases
  if m_typesDeMots.isWordTypeAlias(wordType) then
    appendCategory(categories, "Wiktionnaire:Sections de type de mot utilisant un alias")
  end

  if langCode and not noCat then
    appendContentCategories(categories, langCode, wordType, isFlexion, isLocution, sortKey, gender, pageTitle.text)
  end
  local titleText = buildTitle(wordType, isFlexion, isLocution, number)
  local titleId = buildSectionId(langCode, wordType, isFlexion, number)
  local title = mw.ustring.format('<span class="titredef" id="%s">%s</span>', titleId, titleText)

  if number == nil or number == 1 then
    local defaultSectionId = mw.ustring.gsub(titleId, "-1$", "")
    title = title .. mw.ustring.format('<span id="%s" style="font-size:0;"></span>', defaultSectionId)
  end

  if SHOW_ANCHORS then
    title = title .. " " .. titleId
  end
  return title
end

--- Build a title for any other section.
--- @param sectionType string The type of the section.
--- @param pageTitle string The current page title.
--- @param langCode string|nil The language code for categorization. Required for some section types.
--- @param sortKey string|nil The sort key to use for categorization of homophones. May be `nil`.
--- @param noCat boolean Whether to disable categorization.
--- @param categories table<string> A table to put categories into.
--- @return string The formatted section title.
local function buildOtherSectionTitle(sectionType, pageTitle, langCode, sortKey, noCat, categories)
  if m_sectionArticle.sectionRequiresLanguageCode(sectionType) then
    if not noCat then
      if langCode then
        local langName = m_langues.getName(langCode)
        local key
        if mw.ustring.find(sectionType, "^homo") then
          key = sortKey
        end
        appendCategory(categories, m_sectionArticle.getSectionTypeCategoryName(sectionType) .. " en " .. langName, key)
      else
        appendCategory(categories, m_sectionArticle.getSectionTypeCategoryName(sectionType) .. " sans langue précisée")
      end
    end
  elseif langCode or sortKey or noCat then
    appendCategory(categories, "Wiktionnaire:Sections avec paramètres superflus")
  end

  -- Flag pages that use section type aliases
  if m_sectionArticle.isSectionTypeAlias(sectionType) then
    local ignoredAliases = {
      ["trad-trier"] = true,
      ["variantes orthographiques"] = true,
      ["voir"] = true
    }
    if not ignoredAliases[sectionType] then
      appendCategory(categories, "Wiktionnaire:Sections utilisant un alias")
    end
  end

  local titleText = m_bases.ucfirst(m_sectionArticle.getSectionTypeName(sectionType)) or "Sans titre"
  local cssClass = m_sectionArticle.getSectionTypeClass(sectionType) or ""
  local popupText = m_sectionArticle.getSectionTypePopupText(sectionType) or ""
  if popupText ~= "" then
    popupText = mw.ustring.gsub(popupText, "{mot}", pageTitle)
  end

  return mw.ustring.format('<span class="%s" title="%s">%s</span>', cssClass, popupText, titleText)
end

local function formatError(message, links, categories)
  return mw.ustring.format([=[<span style="color: red">Erreur&nbsp;: %s</span>]=], message)
      .. table.concat(links) .. table.concat(categories)
end

--- Build a section title. Used by [[Template:S]].
--- Parameters:
---  parent frame.args[1] (string): The section type.
---  parent frame.args[2] (string, optional): The section’s language.
---     Required if args[1] is a word type or special section type.
---  parent frame.args[3] (string, optional): For word type sections, pass `flexion` to specify that the word is a flexion.
---  parent frame.args["num"] (string, optional): The section number. Must be a > 0 integer.
---  parent frame.args["clé"] (string, optional): The sort key for categorization.
---  parent frame.args["genre"] (string, optional): For first names, the gender.
---  parent frame.args["locution"] (string, optional): Either `oui` or `non` to force whether the word is a locution or not.
---  parent frame.args["nocat"] (boolean, optional): If `true`, categorization will be disabled.
function p.section(frame)
  local args, success = m_params.process(frame:getParent().args, {
    [1] = { required = true, checker = function(s)
      return m_typesDeMots.isValidWordType(s) or m_sectionArticle.isValidSectionType(s)
    end }, -- section code
    [2] = { checker = function(s)
      return m_langues.getName(s) ~= nil
    end }, -- language code
    [3] = { enum = { "flexion" } },
    ["num"] = { type = m_params.INT, checker = function(v)
      return v > 0
    end },
    ["clé"] = {},
    ["genre"] = { enum = { "m", "f", "mf" } },
    ["locution"] = { enum = { "oui", "non" } },
    ["nocat"] = { type = m_params.BOOLEAN, default = false },
  }, true)

  local errorLinks = {}
  local categories = {}

  local SECTION_TYPE_ERROR_LINK = " <small>[[WT:Liste des sections|(liste des types de sections)]]</small>"
  local WORD_TYPE_ERROR_LINK = " <small>[[WT:Types de mots|(liste des types de mots)]]</small>"
  local LANG_ERROR_LINK = " <small>[[WT:Liste des langues|(liste des langues)]]</small>"

  if not success then
    local argName = args[1]
    local error = args[2]
    local message = args[3]
    if argName == 1 then
      if error == m_params.INVALID_VALUE then
        if frame:getParent().args[2] then
          table.insert(errorLinks, WORD_TYPE_ERROR_LINK)
        else
          table.insert(errorLinks, SECTION_TYPE_ERROR_LINK)
        end
        appendCategory(categories, "Wiktionnaire:Sections avec titre inconnu")
        message = "Titre invalide"
      elseif error == m_params.MISSING_PARAM or error == m_params.EMPTY_PARAM then
        table.insert(errorLinks, SECTION_TYPE_ERROR_LINK)
        appendCategory(categories, "Wiktionnaire:Sections sans titre")
        message = "Section sans titre"
      end
    elseif argName == 2 then
      table.insert(errorLinks, LANG_ERROR_LINK)
      if error == m_params.INVALID_VALUE then
        appendCategory(categories, "Wiktionnaire:Sections de titre avec langue inconnue")
        message = "Code de langue inconnu"
      end
    elseif argName == 3 then
      appendCategory(categories, "Wiktionnaire:Sections de type avec paramètre 3 invalide")
    elseif argName == "num" then
      appendCategory(categories, "Wiktionnaire:Numéros de section incorrects")
      message = "Numéro incorrect"
    elseif argName == "locution" then
      appendCategory(categories, "Wiktionnaire:Sections avec paramètre locution invalide")
      message = "Paramètre «&nbsp;locution&nbsp;» invalide"
    elseif frame:getParent().args[1] == "prénom" and argName == "genre" then
      appendCategory(categories, "Wiktionnaire:Sections de prénom avec genre invalide")
      message = "Genre invalide"
    else
      appendCategory(categories, "Appels de modèles incorrects:S")
    end

    return formatError(message, errorLinks, categories)
  end

  local sectionCode = args[1]
  local langCode = args[2]
  local isFlexion = args[3]
  local number = args["num"]
  local sortKey = args["clé"]
  local gender = args["genre"]
  local locutionStatus = args["locution"]
  local noCat = args["nocat"]
  local pageTitle = mw.title.getCurrentTitle()

  local text = ""

  if m_typesDeMots.isValidWordType(sectionCode) then
    if not noCat and not langCode then
      table.insert(errorLinks, LANG_ERROR_LINK)
      appendCategory(categories, "Wiktionnaire:Sections de titre sans langue précisée")
      return formatError("Code de langue manquant", errorLinks, categories)
    elseif noCat and langCode then
      appendCategory(categories, "Wiktionnaire:Sections avec paramètres superflus")
    end
    text = buildWordTypeSectionTitle(
        pageTitle,
        sectionCode,
        langCode,
        number,
        isFlexion,
        locutionStatus,
        gender,
        sortKey,
        noCat,
        categories
    )
  elseif m_sectionArticle.isValidSectionType(sectionCode) then
    if not noCat and mw.ustring.find(sectionCode, "^homo") and not langCode then
      table.insert(errorLinks, LANG_ERROR_LINK)
      appendCategory(categories, "Wiktionnaire:Sections de titre sans langue précisée")
      return formatError("Code de langue manquant", errorLinks, categories)
    end
    if gender or locutionStatus or number or isFlexion then
      appendCategory(categories, "Wiktionnaire:Sections avec paramètres superflus")
    end
    text = buildOtherSectionTitle(sectionCode, pageTitle.text, langCode, sortKey, noCat, categories)
  else
    -- Should never happen
    error("invalid section code: " .. sectionCode)
  end

  local categoriesText = table.concat(categories)
  if mw.ustring.find(categoriesText, "superflu", 1, true) then
    text = text .. " <small>(paramètre superflu détecté)</small>"
  end

  return text .. categoriesText
end

return p
