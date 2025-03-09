-- Avant de publier toute modification, testez l’affichage dans [[Discussion module:voir]]
local m_bases = require("Module:bases")

local p = {}

--- Parses the raw arguments.
--- @param rawTable table Raw parameters table.
--- @param title string Current page’s title.
--- @return table The parsed list.
local function _toTable(rawTable, title)
  local i = 1
  local maxLinks = 200
  local paramsTable = {}

  while rawTable[i] and i <= maxLinks do
    local item = mw.text.trim(rawTable[i])

    -- Pour traiter [[page (explication)]]
    local description = (mw.ustring.match(item, " %(([^%(%)%|]*)%)$")) or ""
    if description ~= "" then
      description = " ''(" .. description .. ")''"
      item = mw.ustring.gsub(item, " %([^%(%)%|]*%)$", "")
    end

    -- Caractères spéciaux non représentables avec une page : à écrire comme Lien{{!}}Caractère
    -- (Bricolage : pas possible de faire mieux ?)
    local link = mw.ustring.gsub(item, "|.*", "")

    if link ~= "" and link ~= title then
      table.insert(paramsTable, "'''[[" .. item .. "]]'''" .. description)
    end
    i = i + 1
  end

  return paramsTable
end

--- Actually builds the list of values. The entry corresponding to the title of
--- the current page is hidden.
--- @param values table The values to display as a list.
--- @return string The formatted list.
local function _makeText(values)
  local title = mw.title.getCurrentTitle().fullText
  local list = _toTable(values, title)
  local text = ''

  if #list > 0 then
    text = table.concat(list, ", ")
  else
    text = "(Merci de rajouter les articles en paramètres, ou à défaut d’enlever ce modèle)"
    text = text .. m_bases.fait_categorie_contenu('Modèle voir sans paramètre valide')
  end

  return text
end

--- Builds the list for [[Modèle:voir]] and [[Modèle:voir autres systèmes]].
function p.templateSee(frame)
  return _makeText(frame:getParent().args)
end

--- Builds the list for [[Modèle:voir autres scripts]].
function p.templateSeeOtherScripts(frame)
  local args = frame:getParent().args;
  local values = {}

  local i = 1
  while args[i] do
    table.insert(values, args[i + 1] .. " (" .. args[i] .. ")")
    i = i + 2
  end

  return _makeText(values)
end

return p
