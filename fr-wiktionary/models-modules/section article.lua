local data = mw.loadData("Module:section article/data")

local p = {}

--- Get the data for the given section type code.
--- @param code string The section type code to get the data of.
--- @return table|nil A `table` containing the data for the given section type, or `nil` if the code is `nil` or `invalid`.
local function getSectionData(code)
  if code == nil then
    return nil
  end
  if p.isSectionTypeAlias(code) then
    code = data["alias"][code]
  end
  if data["texte"][code] then
    return data["texte"][code]
  end
  return nil
end

--- Check whether the given value is a valid section type code from [[Module:section article/data]].
--- @param code string The string to check.
--- @return boolean True if the argument is a valid section type code, false otherwise.
function p.isValidSectionType(code)
  return code and getSectionData(code)
end

--- Check whether the given value is a valid section type code alias from [[Module:section article/data]].
--- @param code string The string to check.
--- @return boolean True if the argument is a valid section type code alias, false otherwise.
function p.isSectionTypeAlias(code)
  return code and data["alias"][code]
end

--- Return the value of the given property for a specific section type.
--- @param code string The code of a section type as defined in [[Module:section article/data]].
--- @param propertyName string The name of the property.
--- @return string|nil The property’s value or `nil` if it there is no data for the given code or the property is undefined.
local function getProperty(code, propertyName)
  local sectionTypeData = getSectionData(code)
  return sectionTypeData and sectionTypeData[propertyName]
end

--- Get the name of the given section type code.
--- @param code string The code of a section type as defined in [[Module:section article/data]].
--- @return string|nil The section type’s name or `nil` if the code is `nil` or invalid.
function p.getSectionTypeName(code)
  return getProperty(code, "nom")
end

--- Get the CSS class of the given section type code.
--- @param code string The code of a section type as defined in [[Module:section article/data]].
--- @return string|nil The section type’s CSS class or `nil` if the section type has none or the code is `nil` or invalid.
function p.getSectionTypeClass(code)
  return getProperty(code, "class")
end

--- Get the category name of the given section type code.
--- @param code string The code of a section type as defined in [[Module:section article/data]].
--- @return string|nil The section type’s category name or `nil` if the section type has none or the code is `nil` or invalid.
function p.getSectionTypeCategoryName(code)
  return getProperty(code, "category")
end

--- Get the popup text of the given section type code.
--- @param code string The code of a section type as defined in [[Module:section article/data]].
--- @return string|nil The section type’s popup text or `nil` if the section type has none or the code is `nil` or invalid.
function p.getSectionTypePopupText(code)
  return getProperty(code, "infobulle")
end

--- Return whether the given section needs a language code as its parameter.
--- @param code string The code of a section type as defined in [[Module:section article/data]].
--- @return boolean True if the section requires a language code, false otherwise.
function p.sectionRequiresLanguageCode(code)
  return getProperty(code, "requiresLangCode")
end

return p
