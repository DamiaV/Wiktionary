local m_sectionArticle = mw.loadData("Module:section article/data")
local m_typesDeMots = mw.loadData("Module:types de mots/data")

local p = {}

--- @return table
local function getAliases(alias_table)
  local aliases = {}
  for code, valeur in pairs(alias_table) do
    if aliases[valeur] == nil then
      aliases[valeur] = {}
    end
    table.insert(aliases[valeur], code)
  end
  return aliases
end

--- @param level number|string
--- @return string
local function getLevel(level)
  if level == "tous" then
    level = 5
  end
  return mw.ustring.rep("=", level or 4)
end

--- @return string
function p.showPythonReplacements()
  local result = {}

  table.insert(result, "<pre>")

  table.insert(result, "# Sections de titres normaux")
  local articleSectionsAliases = getAliases(m_sectionArticle["alias"])

  for code, t in pairs(m_sectionArticle["texte"]) do
    local alias = articleSectionsAliases and articleSectionsAliases[code] or {}
    table.insert(alias, code)

    local level = getLevel(t["niveau"])

    -- Remplacement des alias par le nom standard en corrigeant le niveau au passage si besoin
    local replaced = table.concat(alias, "|")
    local replacements = mw.ustring.format(
        '(r"\\n[\\t ]*=*[\\t ]*\\{\\{S\\|(%s)\\}\\}[\\t ]*=*[\\t ]*\\n", "\\n%s {{S|%s}} %s"),',
        replaced,
        level,
        code,
        level
    )
    table.insert(result, replacements)
  end

  table.insert(result, "\n# Sections de types")
  local wordTypesAliases = getAliases(m_typesDeMots["alias"])

  for code, _ in pairs(m_typesDeMots["texte"]) do
    local alias = wordTypesAliases and wordTypesAliases[code] or {}
    table.insert(alias, code)

    -- Remplacement des alias par le nom standard en corrigeant le niveau au passage si besoin
    local replaced = table.concat(alias, "|")
    local replacements = mw.ustring.format(
        '(r"\\n[\\t ]*=*[\\t ]*\\{\\{S\\|(%s)\\|(.+?)\\}\\}[\\t ]*=*[\\t ]*\\r", "\\n=== {{S|%s|" + r"\\2}} ==="),',
        replaced,
        code
    )
    table.insert(result, replacements)
  end

  table.insert(result, "</pre>")

  return table.concat(result, "\n")
end

--- @return string
function p.showJavaScriptReplacements()
  local resultat = {}

  table.insert(resultat, "<pre>")

  table.insert(resultat, "// Sections de titres normaux")
  local articleSectionsAliases = getAliases(m_sectionArticle["alias"])

  for code, t in pairs(m_sectionArticle["texte"]) do
    local alias = articleSectionsAliases and articleSectionsAliases[code] or {}
    table.insert(alias, code)

    local level = t["niveau"]
    if level == "tous" then
      level = 5
    end

    for i, al in pairs(alias) do
      mw.log(code, i, al)
      local ligne = '"' .. al .. '": {"niveau": ' .. level .. ', "nom_maj": "' .. code .. '"},'
      table.insert(resultat, ligne)
    end
  end

  table.insert(resultat, "\n// Sections de types")
  local wordTypesAliases = getAliases(m_typesDeMots["alias"])

  for code, _ in pairs(m_typesDeMots["texte"]) do
    local alias = wordTypesAliases and wordTypesAliases[code] or {}
    table.insert(alias, code)

    for _, al in pairs(alias) do
      local line = '"' .. al .. '": { "niveau": 3, "nom_maj": "' .. code .. '", "hasCode":1},'
      table.insert(resultat, line)
    end
  end

  table.insert(resultat, "</pre>")

  return table.concat(resultat, "\n")
end

function p.showRegexForDump()
  -- ébauche
  local resultTable = {}
  table.insert(resultTable, "1. Titres et alias de niveau 4\n\n")
  local articleSectionsAliases = getAliases(m_sectionArticle["alias"])
  for code, t in pairs(m_sectionArticle["texte"]) do
    local alias = articleSectionsAliases and articleSectionsAliases[code] or {}
    table.insert(alias, code)
    local replaced = table.concat(alias, "|") .. "|"
    if t["niveau"] == 4 then
      table.insert(resultTable, replaced)
    end
  end
  local result = table.concat(resultTable, "")
  return mw.ustring.sub(result, 1, -2)
end

return p
