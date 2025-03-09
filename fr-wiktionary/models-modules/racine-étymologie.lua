local m_bases = require("Module:bases")
local m_params = require("Module:paramètres")
local m_langs = require("Module:langues")

local p = {}

local ROOT = 0
local PREFIX = 1
local SUFFIX = 2
local FINAL = 3

--- Get the type of a word element.
--- @param element string A word element.
--- @return string The element’s type, either ROOT, PREFIX, SUFFIX or FINAL.
local function getType(element)
  if mw.ustring.match(element, "^.+/$") then
    return ROOT
  elseif mw.ustring.match(element, "^[^-]+-$") then
    return PREFIX
  elseif mw.ustring.match(element, "^-[^-]+-$") then
    return SUFFIX
  elseif mw.ustring.match(element, "^-[^-]+$") then
    return FINAL
  else
    error("Élément de type inconnu : " .. element)
  end
end

--- Create a link to the given root.
--- @param root string The word to link to.
--- @param languageName string The language name.
--- @return string The link.
local function formatRoot(root, languageName)
  local roots = mw.loadData("Module:racine-étymologie/data/roots")
  local formatedRoot = mw.ustring.format("[[Racine:%s/%s|%s]]", languageName, root, root)
  if roots[root] ~= nil then
    formatedRoot = formatedRoot .. mw.ustring.format(" (« %s »)", roots[root])
  end
  return formatedRoot
end

--- Create a link to the given affix and language section.
--- @param word string The affix to link to.
--- @param languageCode string The language code.
--- @return string The link.
local function formatAffix(word, languageCode)
  return mw.ustring.format("[[%s#%s|%s]]", word, languageCode, word)
end

--- Format a list of word elements of a given type.
--- @param etymology string The current etymology text to append to.
--- @param categories string The categories to append to.
--- @param list table The list of elements to format.
--- @param languageName string The name of the language.
--- @param languageCode string The code of the language.
--- @param type number The type of the elements, either ROOT, PREFIX or SUFFIX.
--- @return table A table containing the updated etymology and categories.
local function formatList(etymology, categories, list, languageName, languageCode, type)
  local types = {
    [PREFIX] = { "du préfixe", "des préfixes", "préfixés avec" },
    [SUFFIX] = { "du suffixe", "des suffixes", "suffixés avec" },
    [ROOT] = { "de la racine", "des racines", "comportant la racine" },
  }
  local singular, plural, category = unpack(types[type])

  local function formatItem(item)
    if type == ROOT then
      return formatRoot(item, languageName)
    else
      return formatAffix(item, languageCode)
    end
  end

  if #list == 1 then
    etymology = etymology .. " " .. singular .. " " .. formatItem(list[1])
    categories = categories .. mw.ustring.format("[[Catégorie:Mots en %s %s %s]]", languageName, category, list[1])
  elseif #list > 1 then
    etymology = etymology .. " " .. plural .. " "
    local i = 1
    while i <= #list do
      if i ~= #list then
        etymology = etymology .. formatItem(list[i])
        if i ~= #list - 1 then
          etymology = etymology .. ", "
        end
      else
        etymology = etymology .. " et " .. formatItem(list[i])
      end
      categories = categories .. mw.ustring.format("[[Catégorie:Mots en %s %s %s]]", languageName, category, list[i])
      i = i + 1
    end
  end

  return etymology, categories
end

--- Generate the etymology for the given word elements and language code.
--- @param elements table The word elements.
--- @param languageCode string The language code.
--- @return string The formatted etymology.
function p._generateEtymology(elements, languageCode)
  local etymology = "Composé"
  local roots = {}
  local prefixes = {}
  local suffixes = {}
  local final = ""
  local categories = ""
  local languageName = m_langs.get_nom(languageCode)

  for _, element in ipairs(elements) do
    local type = getType(element)
    if type == ROOT then
      element = mw.ustring.gsub(element, "/", "")
      table.insert(roots, element)
    elseif type == PREFIX then
      table.insert(prefixes, element)
    elseif type == SUFFIX then
      table.insert(suffixes, element)
    elseif type == FINAL then
      if final == "" then
        final = element
      else
        error("Une finale est déjà définie ! Conflit entre " .. final .. " et " .. element .. ".")
      end
    end
  end

  etymology, categories = formatList(etymology, categories, prefixes, languageName, languageCode, PREFIX)
  if #prefixes ~= 0 and #roots ~= 0 then
    etymology = etymology .. ", "
  end

  etymology, categories = formatList(etymology, categories, roots, languageName, languageCode, ROOT)
  if (#prefixes ~= 0 or #roots ~= 0) and #suffixes ~= 0 then
    etymology = etymology .. ", "
  end

  etymology, categories = formatList(etymology, categories, suffixes, languageName, languageCode, SUFFIX)

  etymology = etymology .. " et de la finale " .. formatAffix(final, languageCode)

  return etymology .. (m_bases.page_principale() and categories or "")
end

--- Generates an etymology for an Esperanto word.
---  frame.args[1] (string): The language code.
---  parent.args (list of strings): The word elements (roots, affixes and final).
--- @return string The formatted etymology.
function p.generateEtymology(frame)
  local langCode = m_params.process(frame.args, {
    [1] = {
      required = true,
      checker = function(v)
        return m_langs.get_nom(v) ~= nil
      end
    },
  })[1]
  return p._generateEtymology(frame:getParent().args, langCode)
end

return p
