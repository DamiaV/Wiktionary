local m_bases = require("Module:bases")
local m_params = require("Module:paramètres")

local languagesData = mw.loadData("Module:langues/data")

local p = {}

p.specialCodes = {
  ["zh-Hans"] = "zh",
  ["zh-Hant"] = "zh",
  ["yue-Hant"] = "yue",
  ["wuu-Hant"] = "wuu",
  ["ko-Hani"] = "ko",
  ["vi-Hani"] = "vi",
  ["vi-Hans"] = "vi",
  ["vi-Hant"] = "vi",
  ["nan-Hani"] = "nan",
  ["nan-Hans"] = "nan",
  ["nan-Hant"] = "nan",
}

--- Return the name of the language matching the given language code.
--- @param code string A language code.
--- @param allowSpecial boolean If true, codes marked as group or special also will be considered.
--- @return string|nil The matching language name, nil otherwise.
function p.get_nom(code, allowSpecial)
  -- TODO rename
  if not code or not languagesData[code] or not allowSpecial and (languagesData[code].special or languagesData[code].groupe) then
    return nil
  end
  return languagesData[code].nom
end

--- Return the sort key for the given language code.
--- @param code string A language code.
--- @param allowSpecial boolean If true, codes marked as group or special will also be considered.
--- @return string|nil The sort key for the language, nil if the code is invalid.
function p.getSortKey(code, allowSpecial)
  if not code or not languagesData[code] or not allowSpecial and (languagesData[code].special or languagesData[code].groupe) then
    return nil
  end
  return languagesData[code]["tri"] or languagesData[code]["nom"]
end

--- Return the name of the given language. Available to templates.
--- @param frame frame
--- Parameters:
---  parent.args[1] (string): Language code.
--- @return string The name of the language or an empty string if the code is invalid.
function p.languageName(frame)
  local args = m_params.process(frame:getParent().args, {
    [1] = { required = true },
  })
  return p.get_nom(args[1]) or ""
end

--- Return the sort key for the given language code. Available to templates.
--- @param frame frame
--- Parameters:
---  args[1] (string): Language code.
--- @return string|nil The sort key for the language, nil if the code is invalid.
function p.languageSortKey(frame)
  local args = m_params.process(frame:getParent().args, {
    [1] = { required = true },
  })
  return p.getSortKey(args[1]) or ""
end

-- Fonction pour écrire le nom d’une langue dans une liste (ou traductions).
-- Elle met la première lettre en majuscule.
-- Cette fonction marche pour un modèle {{L}}.
function p.langue_pour_liste(frame)
  -- TODO rename and refactor
  local args
  if frame.args ~= nil and frame.args[1] ~= nil then
    args = frame.args
  else
    args = frame:getParent().args
  end
  local code = args[1]

  -- Un code est-il donné?
  if code == nil or mw.text.trim(code) == "" then
    return "''Pas de code donné''" .. m_bases.fait_categorie_contenu("Wiktionnaire:Codes langue manquants")
  end

  code = mw.text.trim(code)

  local langue = p.get_nom(code)

  if langue == nil or langue == "" then
    return code .. "*" .. m_bases.fait_categorie_contenu("Wiktionnaire:Codes langue non définis")
  else
    return m_bases.ucfirst(langue)
  end
end

-- Cherche et renvoie le code Wikimedia du Wiktionnaire correspondant s’il existe
function p.get_lien_Wikimedia(code)
  -- TODO rename and refactor
  -- Permet l’usage depuis un modèle (via #invoke)
  if table.getn(mw.getCurrentFrame()) == 0 then
    code = mw.getCurrentFrame().args[1] or code
  end

  -- Pas de code langue ? Renvoie nil.
  if code == nil then
    return nil
  end

  -- Espaces avant et après enlevés
  code = mw.text.trim(code)

  -- A-t-on la langue correspondant au code donné ?
  if languagesData[code] and languagesData[code]["wmlien"] then
    -- Trouvé ! Renvoie le nom
    return languagesData[code]["wmlien"]
  else
    -- Pas trouvé : on renvoie nil
    return nil
  end
end

--- Indique s’il existe un « Portail » local pour le code de langue spécifié.
--- @param code string Le code de langue.
--- @return boolean True si un « Portail » existe, false sinon ou si l code de langue est inconnu.
function p.has_portail(code)
  -- TODO rename and refactor
  return languagesData[code] and languagesData[code]["portail"]
end

--- Indique s’il existe un Wiktionnaire pour le code de langue spécifié.
--- @param code string Le code de langue.
--- @return boolean True si un Wiktionnaire existe, false sinon ou si le code est inconnu.
function p.has_wiktionary(code)
  -- TODO rename and refactor
  return languagesData[code] and languagesData[code]["wiktionnaire"]
end

--- Return the code corresponding to the given language name.
--- If there are more than one, keep the shortest one.
--- The function also takes code aliases into account (e.g. "anglo-saxon" for "vieil anglais").
--- Special case: if there exists a code that strictly equals a language name,
--- it will be returned even if a shorter code exists (e.g. "vieil écossais" vs "vieux scots"),
--- unless there exists a code with 3 characters or less (e.g. "créole guadeloupéen" vs "gcf"),
--- except if the language name is "normand".
--- @param languageName string A language name.
--- @param allowSpecial boolean If true, codes marked as group or special also will be considered.
--- @return string|nil The language’s code, or nil if none matched.
function p.getLanguageCode(languageName, allowSpecial)
  if languageName == "normand" then
    -- Special case: we prefer to return "normand" instead of shorter code "nrf"
    return languageName
  end
  local result
  for code, languageData in pairs(languagesData) do
    if languageName == languageData["nom"] and
        (allowSpecial or not languageData.groupe and not languageData.special) then
      local codeLength = mw.ustring.len(code)
      if result == nil or code == languageName or
          codeLength < mw.ustring.len(result) and (result ~= languageName or codeLength <= 3)
      then
        result = code
      end
    end
  end
  -- If no match yet, consider the name as an alias and try again
  if result == nil and languagesData[languageName] and languagesData[languageName]["nom"] then
    return p.getLanguageCode(languagesData[languageName]["nom"])
  end
  return result
end

--- Return the code corresponding to the given language name.
--- If there are more than one, keep the shortest one.
--- The function also takes code aliases into account (e.g. "anglo-saxon" for "vieil anglais").
--- Special case: if there exists a code that strictly equals a language name,
--- it will be returned even if a shorter code exists (e.g. "vieil écossais" vs "vieux scots"),
--- unless there exists a code with 3 characters or less (e.g. "créole guadeloupéen" vs "gcf"),
--- except if the language name is "normand".
--- @param frame frame
--- Parameters:
---  parent.args[1] (string, optional): A language name. Defaults to the current page’s title.
---  parent.args["codes spéciaux"] (boolean, optional): If true, codes marked as group or special also will be considered.
--- @return string The language’s code, or an empty string if none matched.
function p.languageCode(frame)
  local args = m_params.process(frame:getParent().args, {
    [1] = { default = mw.title.getCurrentTitle().text },
    ["codes spéciaux"] = { type = m_params.BOOLEAN, default = false },
  })
  return p.getLanguageCode(args[1], args["codes spéciaux"]) or ""
end

return p
