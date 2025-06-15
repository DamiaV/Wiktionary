local m_bases = require("Module:bases")
local m_table = require("Module:table")

local p = {}

local DIACRITICS_TITLE = 0
local VARIANTS_TITLE = 1
local CUSTOM_TITLE = 2

--- Remove empty and whitespace-only values from the given table.
--- @param t string[] The table to filter.
--- @return string[] The filtered table.
local function removeEmptyValues(t)
  local tt = {}
  for _, v in ipairs(t) do
    v = mw.text.trim(v)
    if v ~= "" then
      table.insert(tt, v)
    end
  end
  return tt
end

--- Format the given title.
--- @param char string The character to use in the title.
--- @param titleType number One of the following values:
---  - DIACRITICS_TITLE: Returns "Lettre <char> avec [[diacritique]]s".
---  - VARIANTS_TITLE: Returns "Variantes de la lettre <char>".
--- @return string The formatted title.
local function formatTitle(char, titleType)
  if titleType == VARIANTS_TITLE then
    return "Variantes de la lettre " .. mw.ustring.upper(char)
  elseif titleType == DIACRITICS_TITLE then
    return mw.ustring.format("Lettre %s avec %s", mw.ustring.upper(char),
        m_bases.lien_modele("diacritique", "fr", "", "diacritiques"))
  end
  error("Invalid value: " .. tostring(titleType))
end

--- Format an array of characters.
--- @param chars string[] The characters to format.
--- @return string The formatted characters.
local function formatCharacters(chars)
  local text = ""
  for _, c in ipairs(chars) do
    text = text .. m_bases.lien_modele(c, "")
  end
  return '<span class="letters-block">' .. text .. "</span>"
end

--- Format the table header and row for the given array of characters.
--- @param title string The header title.
--- @param titleType string The type of the header title.
--- @param charsList string[] The array of characters.
--- @return string The formatted table header and row.
local function formatTableRow(title, titleType, charsList)
  local formattedTitle = titleType == CUSTOM_TITLE and title or formatTitle(title, titleType)
  local result = mw.ustring.format('|-\n! scope="col" | %s\n|-\n| ', formattedTitle)
  for _, letters in ipairs(charsList) do
    result = result .. formatCharacters(letters)
  end
  return result
end

--- Build the wikicode table of characters related to the given one.
--- @param frame frame
---  args[1] (string): The name of the writing system to load.
---  args[2] (string, optional): The letter to show the variants of.
---  args[3, ...] (string, optional): The names of the diacritics sections to show.
--- @return string The generated table.
function p.table(frame)
  local data = mw.loadData("Module:alphabet étendu/caractères " .. frame.args[1] .. "s")
  local args = removeEmptyValues(m_table.slice(frame.args, 2))
  local result = ""

  result = result .. '{| class="wikitable letters-table"\n'
  if data.extensions then
    for _, array in pairs(data.extensions) do
      result = result .. formatTableRow(array.title, CUSTOM_TITLE, array["entries"]) .. "\n"
    end
  end

  for _, arg in ipairs(args) do
    local entry = data.letters[mw.ustring.upper(arg)]
    if entry then
      local diacritics = entry.diacritics or {}
      local variants = entry.variants or {}

      if m_table.length(diacritics) ~= 0 then
        result = result .. formatTableRow(arg, DIACRITICS_TITLE, diacritics) .. "\n"
      end
      if m_table.length(variants) ~= 0 then
        result = result .. formatTableRow(arg, VARIANTS_TITLE, variants) .. "\n"
      end
    else
      entry = (data.diacritics or {})[arg]
      if entry then
        result = result .. formatTableRow(entry.title, CUSTOM_TITLE, entry.entries) .. "\n"
      end
    end
  end
  result = result .. "|}"

  return result
end

return p
