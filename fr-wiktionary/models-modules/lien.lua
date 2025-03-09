local m_bases = require("Module:bases")
local m_langs = require("Module:langues")
local m_params = require("Module:paramètres")

local p = {}

function p.templateLien(frame)
  local raw_args = frame:getParent().args
  local args, ok = m_params.process(raw_args, {
    [1] = { required = true },
    ["lang"] = { default = "fr", checker = function(v)
      return m_langs.get_nom(v) ~= nil or m_langs.specialCodes[v] ~= nil
    end },
    [2] = { alias_of = "lang" },
    ["code"] = {}, -- Code of targetted section
    [3] = { alias_of = "code" },
    ["dif"] = {}, -- Text to show instead of param 1
    ["tr"] = {}, -- Transcription
    ["sens"] = {}, -- Meaning
    ["sc"] = {}, -- TEMP le temps de retirer ce param de tous les appels
    ["écrit"] = { alias_of = "sc" },
  }, true)

  if not ok then
    local errorType = args[2]
    local category = ""
    local message = ""
    local ns = mw.title.getCurrentTitle().namespace

    if errorType == m_params.MISSING_PARAM or errorType == m_params.EMPTY_PARAM then
      category = "Wiktionnaire:Liens sans page cible"
      message = "Lien sans cible&nbsp;!"
      -- No categorization for templates previews
      if ns == m_bases.NS_MEDIAWIKI.id or ns == m_bases.NS_TEMPLATE.id then
        return raw_args[1]
      end
    elseif errorType == m_params.INVALID_VALUE then
      category = "Wiktionnaire:Liens avec code de langue inconnu"
      message = "Lien avec code de langue inconnu&nbsp;!"
    else
      category = "Appels de modèles incorrects:lien"
      message = "Appel incorrect du modèle lien&nbsp;!"
    end

    return mw.ustring.format('[[Catégorie:%s]] <span style="color: red; font-weight: bold;">%s</span>', category, message)
  end

  local word = args[1]
  local langCode = args["lang"]
  local sectionCode = args["code"]
  local text = args["dif"] or word
  local transcription = args["tr"]
  local meaning = args["sens"]

  word = frame:expandTemplate { title = "sans balise", args = { word } }
  local link = m_bases.lien_modele(word, langCode, sectionCode, text, true)
  if transcription then
    link = link .. ", " .. m_bases.balise_langue("''" .. transcription .. "''", langCode .. "-Latn")
  end
  if meaning then
    link = link .. mw.ustring.format(" («&nbsp;%s&nbsp;»)", meaning)
  end
  if args["sc"] then
    -- TEMP le temps de retirer ce param de tous les appels
    link = link .. ' <span style="color: red; font-weight: bold;">Utilisation paramètre <code>sc</code> obsolète&nbsp;!</span>'
        .. '[[Catégorie:Appels de modèles incorrects:lien:sc]]'
  end
  -- TEMP
  --if not langCode then
  --  link = link .. "[[Catégorie:Wiktionnaire:Liens avec code de langue manquant]]<span class='lien-sans-code' style='display:none'></span>"
  --end
  return link
end

return p
