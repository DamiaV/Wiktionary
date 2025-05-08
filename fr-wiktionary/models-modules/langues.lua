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
function p.getName(code, allowSpecial)
  if not code or not languagesData[code] or not allowSpecial and (languagesData[code].isSpecial or languagesData[code].isGroup) then
    return nil
  end
  return languagesData[code].nom
end

--- Return the sort key for the given language code.
--- @param code string A language code.
--- @param allowSpecial boolean If true, codes marked as group or special will also be considered.
--- @return string|nil The sort key for the language, nil if the code is invalid.
function p.getSortKey(code, allowSpecial)
  if not code or not languagesData[code] or not allowSpecial and (languagesData[code].isSpecial or languagesData[code].isGroup) then
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

--- Return the name of the given language with its first letter capitalized.
--- This function is used by the template {{L}}.
--- @param frame frame
--- Parameters:
---  parent.args[1] (string): A language code.
--- @return string The capitalized name of the language, an error message if none matched.
function p.languageNameForList(frame)
  local args = m_params.process(frame:getParent().args, {
    [1] = {}
  })

  local code = args[1]
  if not code then
    return '<span style="color: red">Code de langue manquant<span>' ..
        m_bases.fait_categorie_contenu("Wiktionnaire:Codes langue manquants")
  end

  local languageName = p.get_nom(code)
  if not languageName then
    return mw.ustring.format('<span style="color: red">Code de inconnu : %s*<span>', code) ..
        m_bases.fait_categorie_contenu("Wiktionnaire:Codes langue non définis")
  end
  return m_bases.ucfirst(languageName)
end

--- Return the Wikimedia language code for the given internal language code if it exists.
--- @param code string A language code.
--- @return string The corresponding Wikimedia language code, or nil if none matched.
function p.getWikimediaCode(code)
  if not code or not languagesData[code] then
    return nil
  end
  return languagesData[code].wmlien
end

--- Return the Wikimedia language code for the given internal language code if it exists.
--- @param frame frame
--- Parameters:
---  parent.args[1] (string): A language code.
--- @return string The corresponding Wikimedia language code, or an empty string if none matched.
function p.wikimediaCode(frame)
  local args = m_params.process(frame:getParent().args, {
    [1] = { required = true },
  })
  local code = args[1]
  return p.getWikimediaCode(code) or code
end

--- Check whether a page in the “Portail” namespace exists for the given language code.
--- @param code string A language code.
--- @return boolean True if a “Portail” page exists, false otherwise.
function p.hasPortal(code)
  return languagesData[code] ~= nil and languagesData[code]["portail"]
end

--- Check whether a Wiktionary exists for the given language code.
--- @param code string Le code de langue.
--- @return boolean True if a Wiktionary exists, false otherwise.
function p.hasWiktionary(code)
  return languagesData[code] ~= nil and languagesData[code]["wiktionnaire"]
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
        (allowSpecial or not languageData.isGroup and not languageData.isSpecial) then
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
