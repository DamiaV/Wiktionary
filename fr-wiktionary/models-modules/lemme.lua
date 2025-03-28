local m_langues = require("Module:langues")
local m_typesDeMots = require("Module:types de mots")

local p = {}

-- Critères basés sur [[Wiktionnaire:Prise de décision/Catégories de lemmes]]
local validLangCodes = {
  ["fr"] = true,
  ["de"] = true,
  ["en"] = true,
  ["eo"] = true,
  ["es"] = true,
  ["io"] = true,
  ["it"] = true,
  ["ru"] = true,
  ["uk"] = true,
  ["bg"] = true,
  ["ga"] = true,
  ["gallo"] = true,
  ["se"] = true,
  ["la"] = true,
  ["sl"] = true,
  ["cs"] = true,
  ["sv"] = true,
  ["nl"] = true,
  ["pt"] = true,
  ["fi"] = true,
}
local invalidTypes = {
  ["variante par contrainte typographique"] = true,
  ["nom propre"] = true,
  ["prénom"] = true,
  ["nom de famille"] = true,
  ["nom scientifique"] = true,
  ["infixe"] = true,
  ["interfixe"] = true,
  ["préfixe"] = true,
  ["suffixe"] = true,
  ["circonfixe"] = true,
  ["symbole"] = true,
}

--- Indicate whether the given grammatical information constitutes a lemma.
--- @param langCode string The language code.
--- @param wordType string The word type as defined in [[Module:types de mots]].
--- @param isFlexion boolean Whether the entry is a flexion.
--- @param isLocution boolean Whether the entry is a locution (contains multiple words).
--- @return boolean True if the language code and word type are valid, and flexion and locution are false.
function p.isLemma(langCode, wordType, isFlexion, isLocution)
  return langCode
      and validLangCodes[langCode]
      and not isFlexion
      and wordType
      and m_typesDeMots.isValidWordType(wordType)
      and not invalidTypes[m_typesDeMots.getWordTypeName(wordType)]
      and not isLocution
end

--- Return the lemma category name for the given grammatical information.
--- @param langCode string The language code.
--- @param wordType string The word type as defined in [[Module:types de mots]].
--- @param isFlexion boolean Whether the entry is a flexion.
--- @param isLocution boolean Whether the entry is a locution (contains multiple words).
--- @return string|nil Nil if any argument is nil, the category name if the entry is a lemma, an empty string otherwise.
function p.getLemmaCategoryName(langCode, wordType, isFlexion, isLocution)
  if langCode == nil or wordType == nil then
    return nil
  end

  if p.isLemma(langCode, wordType, isFlexion, isLocution) then
    local langName = m_langues.get_nom(langCode)
    if langName then
      return "Lemmes en " .. langName
    else
      return ""
    end
  end
end

return p
