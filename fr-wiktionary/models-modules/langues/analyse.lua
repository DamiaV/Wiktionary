local m_bases = require("Module:bases")

local languagesData = mw.loadData("Module:langues/data")

local p = {}

local function getSortKey(langName)
  if mw.ustring.toNFD(langName) == langName and not mw.ustring.find(langName, "[’)(]") then
    return nil
  end
  local sortKey = mw.ustring.toNFD(langName)
  sortKey = mw.ustring.gsub(sortKey, "[^%a-]", "")
  sortKey = mw.ustring.gsub(sortKey, "æ", "ae")
  sortKey = mw.ustring.gsub(sortKey, "œ", "oe")
  sortKey = mw.ustring.gsub(sortKey, "['’)(]", "")
  sortKey = mw.ustring.gsub(sortKey, "[-\\/]", " ")
  return sortKey
end

local function sortLanguages(code1, code2)
  local t1 = languagesData[code1].sortKey and languagesData[code1].sortKey or
      getSortKey(languagesData[code1].name) or languagesData[code1].name
  local t2 = languagesData[code2].sortKey and languagesData[code2].sortKey or
      getSortKey(languagesData[code2].name) or languagesData[code2].name
  return t1 < t2
end

function p.showLanguagesTable(_)
  local titres = { "n", "Code", "Nom", "Lien Wikimédia" }

  local keyset = {}
  local n = 0

  for k, _ in pairs(languagesData) do
    n = n + 1
    keyset[n] = k
  end

  local result = {
    "Cette liste est générée automatiquement à partir de [[Module:langues/data]].\n\n" ..
        "Il y a actuellement " .. tostring(n) .. " codes de langue dans cette liste.\n" ..
        "La liste peut être triée par nom de langue (défaut) ou par code."
  }

  table.sort(keyset, sortLanguages)

  table.insert(result, m_bases.tableau_entete(titres))
  for i, code in ipairs(keyset) do
    local infos = languagesData[code]
    local langName = infos.name or "NOM MANQUANT"
    local langSortKey = infos.sortKey or getSortKey(langName) or langName
    local langCategory = m_bases.fait_categorie(langName, langName, true)
    local langColumn = 'data-sort-value="' .. langSortKey .. '"|' .. langCategory
    local wmLink = infos.wikimediaCode or ""
    local row = { i, '<span id="' .. code .. '">' .. code .. '</span>', langColumn, wmLink }
    table.insert(result, m_bases.tableau_ligne(row))
  end

  table.insert(result, m_bases.tableau_fin())
  return table.concat(result, "\n")
end

function p.showLanguagesPython(_)
  local lines = {}
  for k, v in pairs(languagesData) do
    table.insert(lines, '    "' .. k .. '": "' .. v.name .. '",')
  end
  return "<pre>\nlanguages = {\n" .. table.concat(lines, "\n") .. "\n}\n</pre>\n"
end

return p
