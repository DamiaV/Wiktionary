--- (fr) Génération des tableaux de flexions des mots en lacandon
--- (en) Module building inflexion tables for Lacandon
local m_bases = require("Module:bases")
local m_langues = require("Module:langues")
local m_params = require("Module:paramètres")

local p = {}

--- Generate a link for the given page title.
--- @param pageTitle string A page title.
--- @param langCode string The language’s code.
--- @return string The generated link.
local function link(pageTitle, langCode)
  return m_bases.lien_modele(pageTitle, langCode)
end

--- Generate the inflections table for the given word.
--- @param title string|nil The table’s title.
--- @param singular string The singular form.
--- @param plural string The plural form.
--- @param pageName string The current page’s name.
--- @param langCode string The language’s code.
--- @return string The generated table.
local function formatTable(title, singular, plural, pageName, langCode)
  local res = '{| class="wikitable flextable"\n'

  if title then
    res = res .. "|+" .. title .. "\n"
  end

  res = res ..
      '|-\n' ..
      '! scope="col" | Singulier\n' ..
      '! scope="col" | Pluriel\n' ..
      '|-\n' ..
      '| ' .. link(singular, langCode) .. '\n' ..
      '| ' .. link(plural, langCode) .. '\n' ..
      '|-\n' ..
      '|}'

  if singular == pageName and plural ~= pageName and not m_bases.page_existe(plural) then
    res = res .. mw.ustring.format("[[Catégorie:Pluriels manquants en %s]]", m_langues.getName(langCode))
  end

  return res
end

--- Generate the inflections table for a word.
--- @param frame frame
---  parent.args["s"] (string, optional): The singular form.
---  parent.args["p"] (string, optional): The plural form.
---  parent.args["f"] (string, optional): The inflection type.
---  parent.args["titre"] (string, optional): The table’s title.
--- @param langCode string The language’s code.
--- @param inflections string[] The list of supported inflections.
--- @return string The generated table.
function p.inflectionsTable(frame, langCode, inflections)
  local args = m_params.process(frame:getParent().args, {
    s = {},
    p = {},
    f = { enum = inflections },
    titre = {},
  })
  local inflection = args.f
  local singular = args.s
  local plural = args.p
  local title = args.titre
  local pageName = mw.title.getCurrentTitle().text

  local wordSingular = singular or pageName
  local wordPlural = plural or wordSingular

  if not inflection then
    return formatTable(title, wordSingular, wordPlural, pageName, langCode)
  end

  local n = mw.ustring.len(inflection)
  if mw.ustring.sub(pageName, -n) == inflection then
    wordPlural = wordSingular
    wordSingular = mw.ustring.sub(pageName, 1, -n - 1)
  else
    wordPlural = wordSingular .. inflection
  end
  return formatTable(title, wordSingular, wordPlural, pageName, langCode)
end

return p
