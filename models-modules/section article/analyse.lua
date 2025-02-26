-- Tests: [[Discussion module:section article/analyse]]
local m_bases = require("Module:bases")

local data = mw.loadData("Module:section article/data")

local p = {}

--- @return table
local function getAliases()
  local aliases = {}
  for alias, refCode in pairs(data["alias"]) do
    if aliases[refCode] == nil then
      aliases[refCode] = {}
    end
    table.insert(aliases[refCode], alias)
  end
  return aliases
end

--- @param code string
--- @param sectionTypeData table
--- @return string
local function generateSectionTypeWikicode(code, sectionTypeData)
  local level = sectionTypeData["niveau"]
  local equalSigns = "====="
  if level ~= nil then
    if level == 3 then
      equalSigns = "==="
    elseif level == 4 then
      equalSigns = "===="
    end
  end

  return "<code>" .. equalSigns .. " {{S&vert;" .. code .. "}} " .. equalSigns .. "</code>"
end

--- @param code1 string
--- @param code2 string
--- @return boolean
local function sortSections(code1, code2)
  local data1 = data["texte"][code1]
  local data2 = data["texte"][code2]
  local level1 = tostring(data1["niveau"])
  local level2 = tostring(data2["niveau"])
  return level1 < level2 or (level1 == level2 and data1["nom"] < data2["nom"])
end

--- @return string A wiki table that lists all defined section types and their data.
function p.showSectionTypes()
  local keySet = {}
  local n = 0
  for key, _ in pairs(data["texte"]) do
    n = n + 1
    keySet[n] = key
  end
  table.sort(keySet, sortSections)

  local result = {
    "Cette liste est générée automatiquement à partir de [[Module:section article/data]].\n\nIl y a actuellement "
        .. n .. " titres de section dans cette liste.\nElle peut être triée."
  }

  table.insert(result, m_bases.tableau_entete({
    "Nom", "Code", "Alias possibles", "Niveau", "Sous-section de"
  }))

  local aliases = getAliases()
  for _, code in ipairs(keySet) do
    local sectionTypeData = data["texte"][code]
    local aliasesForCode = aliases and aliases[code] or {}
    table.insert(aliasesForCode, 1, "'''" .. code .. "'''")
    local aliasesText = table.concat(aliasesForCode, "<br>")
    code = generateSectionTypeWikicode(code, sectionTypeData)
    local parentText = (
        (sectionTypeData["parent"]
            and data["texte"][sectionTypeData["parent"]]
            and data["texte"][sectionTypeData["parent"]]["nom"])
            or sectionTypeData["parent"]
    )
    local values = {
      sectionTypeData["nom"] or "-",
      code or "-",
      aliasesText or "-",
      sectionTypeData["niveau"] or "-",
      parentText or "-"
    }
    table.insert(result, m_bases.tableau_ligne(values))
  end
  table.insert(result, m_bases.tableau_fin())

  return table.concat(result, "\n")
end

function p.showPythonReplacements()
  local result = {}

  table.insert(result, "<pre>")

  local aliases = getAliases()
  for code, _ in pairs(data["texte"]) do
    local aliasesForCode = aliases and aliases[code] or {}
    if #aliasesForCode > 0 then
      local text = table.concat(aliasesForCode, "|")
      local replacements = '(r"\\{\\{S\\|(' .. text .. ')\\}\\}", "{{S|' .. code .. '}}"),';
      table.insert(result, replacements)
    end
  end
  table.insert(result, "</pre>")

  return table.concat(result, "\n")
end

return p
