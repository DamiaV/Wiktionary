local m_bases = require("Module:bases")
local m_params = require("Module:paramètres")

local langues = mw.loadData("Module:langues/data")

local p = {}

p.specialCodes = {
  ["zh-Hans"] = "zh",
  ["zh-Hant"] = "zh",
  ["ko-Hani"] = "ko",
  ["vi-Hani"] = "vi",
  ["vi-Hans"] = "vi",
  ["vi-Hant"] = "vi",
  ["nan-Hani"] = "nan",
  ["nan-Hans"] = "nan",
  ["nan-Hant"] = "nan",
}

-- Cherche et renvoie le nom de la langue depuis notre liste locale [[Module:langues/data]].
-- Fonction utilisable dans d’autres modules seulement
function p.get_nom(code)
  if not code then
    return nil
  end

  code = mw.text.trim(code)

  if langues[code] and langues[code]["nom"] then
    return langues[code]["nom"]
  else
    return nil
  end
end

-- Cherche et renvoie la clé de tri de la langue depuis notre liste locale [[Module:langues/data]].
-- Fonction utilisable dans d’autres modules seulement
function p.get_tri(code)
  if not code then
    return nil
  end

  code = mw.text.trim(code)

  if langues[code] and langues[code]["tri"] then
    return langues[code]["tri"]
  else
    if langues[code] then
      return langues[code]["nom"]
    else
      return nil
    end
  end
end

-- Fonction pouvant remplacer les appels de type {{ {{{lang}}} }} dans les modèles
-- Cette fonction marche pour un modèle
function p.nom_langue(frame)
  local args

  if frame.args ~= nil and frame.args[1] ~= nil then
    args = frame.args
  else
    args = frame:getParent().args
  end
  local code = args[1]

  local langue = p.get_nom(code)

  if langue == nil or langue == "" then
    return ''
  else
    return langue
  end
end

-- Fonction pouvant remplacer les appels de type {{ {{{lang}}} }} dans les modèles
-- Cette fonction marche pour un modèle
function p.tri_langue(frame)
  local args

  if frame.args ~= nil and frame.args[1] ~= nil then
    args = frame.args
  else
    args = frame:getParent().args
  end
  local code = args[1]

  local tri = p.get_tri(code)

  if tri == nil or tri == "" then
    return ''
  else
    return tri
  end
end

-- Fonction pour écrire le nom d'une langue dans une liste (or traductions)
-- Cette fonction marche pour un modèle {{L}}
function p.langue_pour_liste(frame)
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

-- Cherche et renvoie le code Wikimedia du Wiktionnaire correspondant s'il existe
function p.get_lien_Wikimedia(code)
  -- Permet l'usage depuis un modèle (via #invoke)
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
  if langues[code] and langues[code]["wmlien"] then
    -- Trouvé ! Renvoie le nom
    return langues[code]["wmlien"]
  else
    -- Pas trouvé : on renvoie nil
    return nil
  end
end

--- Indicates whether there exists a local “Portail” for the given language code.
--- @param code string The language code.
--- @return boolean True if a “Portail” exists, false otherwise or if the language code is unknown.
function p.has_portail(code)
  return langues[code] and langues[code]["portail"]
end

--- Indicates whether there exists a Wiktionary for the given language code.
--- @param code string The language code.
--- @return boolean True if a Wiktionary exists, false otherwise or if the language code is unknown.
function p.has_wiktionary(code)
  return langues[code] and langues[code]["wiktionnaire"]
end

--- Looks up the code for the given language name in [[Module:langues/data]].
--- @param languageName string Name of the language.
--- @return string|nil The code for the language or nil if none were found.
function p._getLanguageCode(languageName)
  for code, langue_table in pairs(langues) do
    if languageName == langue_table["nom"] then
      return code
    end
  end

  return nil
end

--- Looks up the code for the given language name in [[Module:langues/data]].
--- Parameters:
---  frame.args[1] (string): Name of the language.
--- @return string|nil The code for the language or an empty string if none were found.
function p.getLanguageCode(frame)
  local args = m_params.process(frame.args, {
    [1] = { required = true }
  })

  return p._getLanguageCode(args[1]) or ""
end

return p
