-- Tests: [[Discussion module:types de mots/analyse/test]]
local m_bases = require("Module:bases")
local m_typesDeMots = require("Module:types de mots")

local p = {}

local TYPES = m_typesDeMots.types

--- @return table
local function getAliases()
  local aliases = {}
  for code, valeur in pairs(TYPES["alias"]) do
    if aliases[valeur] == nil then
      aliases[valeur] = {}
    end
    table.insert(aliases[valeur], code)
  end
  return aliases
end

--- @param code1 string
--- @param code2 string
--- @return boolean
local function sortTypes(code1, code2)
  return code1 < code2
end

--- @return string A wiki table that lists all defined word types and their data.
function p.showWordTypes()
  local keySet = {}
  local n = 0
  for k, _ in pairs(TYPES["texte"]) do
    n = n + 1
    keySet[n] = k
  end
  table.sort(keySet, sortTypes)

  local result = {
    "Cette liste est générée automatiquement à partir de [[Module:types de mots/data]].\n\nIl y a actuellement "
        .. n .. " types de mots dans cette liste.\n\n"
        .. "'''Ce sont les noms au singulier qui doivent être utilisés dans le modèle [[Modèle:S|{{S}}]]'''.\n"
  }
  table.insert(result, m_bases.tableau_entete({
    "Code (ancre/abréviation)", "Nom singulier", "Nom pluriel",
    "Locution singulier", "Locution pluriel", "Alias possibles"
  }))

  local aliases = getAliases()
  for _, code in ipairs(keySet) do
    local data = TYPES["texte"][code]
    local alias = aliases and aliases[code] or {}
    table.insert(alias, 1, "'''" .. code .. "'''")
    local aliasesText = table.concat(alias, "<br>")
    local values = {
      data["abrev"] or "-",
      data["mot"] or "-",
      m_bases.fait_categorie(m_bases.ucfirst(data["mot_pl"]), data["mot_pl"], true) or "-",
      data["locution"] or "-",
      m_bases.fait_categorie(m_bases.ucfirst(data["locution_pl"]), data["locution_pl"], true) or "-",
      aliasesText
    }
    table.insert(result, m_bases.tableau_ligne(values))
  end
  table.insert(result, m_bases.tableau_fin())

  return table.concat(result, "\n")
end

--- @return string
function p.showPythonReplacements()
  local resul = {}
  table.insert(resul, "<pre>")

  local aliases = getAliases()
  for code, _ in pairs(TYPES["texte"]) do
    local alias = aliases and aliases[code] or {}
    if #alias > 0 then
      local aliasesText = table.concat(alias, "|")
      local replacements = '(r"\\{\\{S\\|(' .. aliasesText .. ')\\|", "{{S|' .. code .. '|"),'
      table.insert(resul, replacements)
    end
  end
  table.insert(resul, "</pre>")

  return table.concat(resul, "\n")
end

return p
