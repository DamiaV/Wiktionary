local m_langs = require("Module:langues")
local m_params = require("Module:paramètres")

local p = {}

local topCategoryName = "Personnes ayant un intérêt ou parlant %s"

local levelCategoriesNames = {
  ["Personnes ayant un intérêt ou parlant (.+)"] = {
    desc = "Ces personnes parlent %s à différents niveaux.",
  },
  ["Personnes ne parlant pas (.+) mais s’y intéressant"] = {
    level = "0",
    desc = "Ces personnes ont déclaré ne pas parler %s.",
  },
  ['Personnes ayant un niveau débutant en (.+)'] = {
    level = "1",
    desc = "Ces personnes ont déclaré avoir un niveau débutant en %s.",
  },
  ["Personnes ayant un niveau intermédiaire en (.+)"] = {
    level = "2",
    desc = "Ces personnes ont déclaré avoir un niveau intermédiaire en %s.",
  },
  ["Personnes ayant un niveau avancé en (.+)"] = {
    level = "3",
    desc = "Ces personnes ont déclaré avoir un niveau avancé en %s.",
  },
  ["Personnes ayant un niveau très avancé en (.+)"] = {
    level = "4",
    desc = "Ces personnes ont déclaré avoir un niveau très avancé en %s.",
  },
  ["Personnes parlant nativement en (.+)"] = {
    level = "N",
    desc = "Ces personnes ont déclaré parler nativement en %s.",
  },
}

--- @param title string Page title.
--- @param code string Optional language code if undefined in [[Module:langues/data]].
local function _description(title, code)
  for regex, data in pairs(levelCategoriesNames) do
    local langName = mw.ustring.match(title, "^" .. regex .. "$")
    if langName then
      local desc = mw.ustring.format(data.desc, langName)
      local level = data.level
      code = code or m_langs._getLanguageCode(langName)
      local categoryName = mw.ustring.format(topCategoryName, langName)

      local res = desc
      if level then
        if not code then
          return '<span style="color: red; font-weight: bold">Le nom de la langue est inconnu.</span>[[Catégorie:Langue d’une catégorie Babel inconnue]]'
        end
        res = res .. mw.ustring.format("\n\nCode Babel&nbsp;: <code>%s-%s</code>\n[[Catégorie:%s|%s]]",
            code, level, categoryName, langName .. "-" .. level)
      else
        res = res .. mw.ustring.format("\n[[Catégorie:Wiktionnaristes par langue|%s]]", langName)
      end

      return res .. "\n\n<small>''Le nom de cette catégorie est généré par l’extension Babel, '''merci de ne pas le changer'''.''</small>"
    end
  end

  return '<span style="color: red; font-weight: bold">Le titre de la page ne correspond pas aux critères.</span>[[Catégorie:Titre d’une catégorie Babel invalide]]'
end

function p.description(frame)
  local args, success = m_params.process(frame:getParent().args, {
    [1] = {},
  })
  if success then
    return _description(mw.title.getCurrentTitle().text, args[1])
  else
    error(args[3])
  end
end

return p
