local m_bases = require("Module:bases")
local m_langues = require("Module:langues")
local m_params = require("Module:paramètres")

local p = {}

--- Format the given language name and code. If a portal for the language exists, a link to it is returned.
--- Else, if a main namespace page with the same title as the language name exists, a link to that page is returned.
--- Otherwise, the passed language name is returned.
--- @param langName string The language name.
--- @param langCode string The language code.
--- @return string The formatted title.
local function getTitleText(langName, langCode)
  local langNameUc = m_bases.ucfirst(langName)
  if m_langues.has_portail(langCode) then
    return mw.ustring.format("[[Portail:%s|%s]]", langNameUc, langNameUc)
  end
  -- Do not link to [[conventions internationales]] as no specific meaning has been established as of 2015-06-22.
  if langCode ~= "conv" then
    if mw.title.new(langName).exists then
      return mw.ustring.format("[[%s|%s]]", langName, langNameUc)
    end
  end
  return langNameUc
end

--- Get the rare letters categories for the given language code and page title.
--- @param langCode string A language code to get the category’s name from.
--- @param pageTitle string The title of the page to extract characters from.
--- @return table<string> A table containing all relevant rare letter category links.
local function getRareLettersCategories(langCode, pageTitle)
  local langData = mw.loadData("Module:langues/lettres_rares")
  if not langData or not langData[langCode] or not langData[langCode]["rare"] then
    return {}
  end

  local categories = {}
  for i = 1, mw.ustring.len(pageTitle) do
    local char = mw.ustring.sub(pageTitle, i, i)
    if mw.ustring.find(char, langData[langCode]["rare"]) then
      table.insert(categories, mw.ustring.format(
          "[[Catégorie:%s en %s]]",
          mw.ustring.lower(char),
          m_langues.get_nom(langCode)
      ))
    end
  end
  return categories
end

--- Build the full title for the given text, language code and categories.
--- @param text string The title’s text.
--- @param langCode string The language code to use as the `id`.
--- @param categories table<string> The list of categories to append.
--- @return string The formatted title.
local function assembleTitle(text, langCode, categories)
  local result = "<span class='sectionlangue'"
  if langCode then
    result = result .. " id='" .. langCode .. "'"
  else
    result = result .. " style='color: red; font-style: italic'"
  end
  return result .. ">" .. text .. "</span>" .. table.concat(categories)
end

--- Build the title for the given language code and page title.
--- @param langCode string The language code to use.
--- @param pageTitle string The title of the page.
--- @param noCat boolean If true, categories will not be appended to the returned title.
--- @return string The formatted title.
local function buildTitle(langCode, pageTitle, noCat)
  local langName = m_langues.get_nom(langCode)

  local categories = {}
  if not noCat then
    table.insert(categories, m_bases.fait_categorie_contenu(langName))
    if m_bases.page_de_contenu() then
      for _, c in ipairs(getRareLettersCategories(langCode, pageTitle)) do
        table.insert(categories, c)
      end
    end
  end

  return assembleTitle(getTitleText(langName, langCode), langCode, categories)
end

--- Function used by [[Template:langue]].
--- It shows the name of a language and applies relevant categories.
--- Parameters:
---  parent frame.args[1] (string): The language code.
---  parent frame.args["nocat"] (boolean): If true, no categories will be applied.
--- @return string The wikicode.
function p.sectionLangue(frame)
  -- Récupération des variables nécessaires à la création du titre
  local args, success = m_params.process(frame:getParent().args, {
    [1] = { required = true, checker = function(lang)
      return m_langues.get_nom(lang) ~= nil
    end },
    ["nocat"] = { type = m_params.BOOLEAN, default = false },
  }, true)

  if not success then
    local error = args[2]
    local message = args[3]
    if error == m_params.INVALID_VALUE then
      local text = m_bases.ucfirst(frame:getParent().args[1])
          .. [=[[[Wiktionnaire:Liste des langues|<span title="code langue inconnu">*</span>]]]=]
      local category = { m_bases.fait_categorie_contenu("Wiktionnaire:Sections de langue avec code inconnu") }
      return assembleTitle(text, nil, category)
    elseif error == m_params.MISSING_PARAM or error == m_params.EMPTY_PARAM then
      local text = "[[Wiktionnaire:Liste des langues|Langue manquante*]]"
      local category = { m_bases.fait_categorie_contenu("Wiktionnaire:Sections de langue sans langue précisée") }
      return assembleTitle(text, nil, category)
    end
    return mw.ustring.format("<span>Erreur&nbsp;: %s</span>", message)
        .. "[[Catégorie:Appels de modèles incorrects:langue]]"
  end

  return buildTitle(args[1], mw.title.getCurrentTitle().text, args["nocat"])
end

return p
