-- Page de test : Utilisateur:Darkdadaah/Test:Sections
local m_bases = require("Module:bases")

local p = {}

-- Expose data
p.types = mw.loadData("Module:types de mots/data")

--- Check whether the given value is a valid word type code from [[Module:types de mots/data]].
--- @param code string The string to check.
--- @return boolean True if the argument is a valid word type code, false otherwise.
function p.isValidWordType(code)
  if code == nil then
    return false
  end
  code = mw.ustring.lower(code)
  return p.types["alias"][code] or p.types["texte"][code]
end

--- Check whether the given value is a valid word type code alias from [[Module:types de mots/data]].
--- @param code string The string to check.
--- @return boolean True if the argument is a valid word type code alias, false otherwise.
function p.isWordTypeAlias(code)
  if code == nil then
    return false
  end
  return p.types["alias"][mw.ustring.lower(code)]
end

--- Get the phrase for the flexion of the given word type.
--- @param wordType string The word type.
--- @param isPlural boolean Whether to return the plural form instead of the singular.
--- @return string A string in the form `"forme[s] d{’|e }<wordType>"`.
local function getFlexionType(wordType, isPlural)
  return mw.ustring.format(
      "forme%s d%s%s",
      isPlural and "s" or "",
      m_bases.is_elidable(wordType) and "’" or "e ",
      wordType
  )
end

--- Get the name of the given word type code.
--- @param code string A word type from [[Module:types de mots/data]].
--- @param isLocution boolean Whether the word is a locution.
--- @param isFlexion boolean Whether the word is a flexion.
--- @param isPlural boolean Whether to return the plural form instead of the singular.
--- @return string|nil A string containing the name for the code, `nil` if the code is `nil` or invalid.
function p.getWordTypeName(code, isLocution, isFlexion, isPlural)
  if code == nil then
    return nil
  end

  code = mw.ustring.lower(code);

  if p.types["alias"][code] then
    code = p.types["alias"][code]
  end

  if p.types["texte"][code] then
    local key
    if isLocution and p.types["texte"][code]["locution"] then
      key = "locution"
    else
      key = "mot"
    end
    if isPlural then
      key = key .. "_pl"
    end

    local name = p.types["texte"][code][key]
    -- Flexion
    if isFlexion then
      name = getFlexionType(name, isPlural)
    end
    return name;
  end

  return nil
end

--- Get the singular name of the given word type code.
--- Same as calling `p.getWordTypeName(code, isLocution, isFlexion, false)`.
--- @param code string A word type from [[Module:types de mots/data]].
--- @param isLocution boolean Whether the word is a locution.
--- @param isFlexion boolean Whether the word is a flexion.
--- @return string|nil A string containing the name for the code, `nil` if the code is `nil` or invalid.
function p.getWordTypeNameSingular(code, isLocution, isFlexion)
  return p.getWordTypeName(code, isLocution, isFlexion, false)
end

--- Get the plural name of the given word type code.
--- Same as calling `p.getWordTypeName(code, isLocution, isFlexion, true)`.
--- @param code string A word type from [[Module:types de mots/data]].
--- @param isLocution boolean Whether the word is a locution.
--- @param isFlexion boolean Whether the word is a flexion.
--- @return string|nil A string containing the name for the code, `nil` if the code is `nil` or invalid.
function p.getWordTypeNamePlural(code, isLocution, isFlexion)
  return p.getWordTypeName(code, isLocution, isFlexion, true)
end

--- Return the abbreviated name of the given word type code.
--- @param code string A word type from [[Module:types de mots/data]].
--- @param isFlexion boolean Whether the word is a flexion.
--- @return string|nil A string in the form `[flex-]<abbr name>`, or `nil` if the code is `nil` or invalid.
function p.getWordTypeAbbr(code, isFlexion)
  if code == nil then
    return nil
  end
  code = mw.ustring.lower(code)

  if p.types["alias"][code] then
    code = p.types["alias"][code]
  end

  if p.types["texte"][code] then
    local abbrName = p.types["texte"][code]["abrev"]
    if isFlexion then
      abbrName = "flex-" .. abbrName
    end
    return abbrName
  end
  return nil
end

return p
