local m_langs = require("Module:langues")
local m_bases = require("Module:bases")
local m_table = require("Module:table")
local m_params = require("Module:paramètres")

local p = {}

local groups = { "Premier", "Deuxième", "Troisième", "Quatrième" }
local types = {
  p = "parisyllabiques",
  i = "imparisyllabiques",
  c = "contractes",
}

local function getLangAppendixLink(groupNb, langName)
  local groupName = groups[groupNb] or (tostring(groupNb) .. "e")
  local exp = mw.getCurrentFrame():expandTemplate { title = (groupNb == 1 and "er" or "e") }

  return mw.ustring.format(
      "[[Annexe:Conjugaison en %s/%s groupe|%d%s groupe]]",
      langName,
      groupName,
      groupNb,
      exp
  )
end

function p._conjugaison(verb, group, group2, langCode, type, pronominal, defective, section, noCat)
  local wikicode = ""
  local langName = m_langs.get_nom(langCode)
  local categories = {}

  if group then
    wikicode = wikicode .. getLangAppendixLink(group, langName)
    if group2 then
      wikicode = wikicode .. " ou " .. getLangAppendixLink(group2, langName)
    end
  end

  if pronominal then
    if group then
      wikicode = wikicode .. ", "
    end
    wikicode = wikicode .. "[[pronominal]]"
    table.insert(categories, "Verbes pronominaux en" .. langName)
  end

  if defective then
    if group or pronominal then
      wikicode = wikicode .. ", "
    end
    wikicode = wikicode .. "[[défectif]]"
    table.insert(categories, "Verbes défectifs en " .. langName)
  end

  local text = '<span style="font-size: 100%; font-weight: bold; font-variant: small-caps">voir la conjugaison</span>'
  if wikicode ~= "" then
    wikicode = wikicode .. " "
  end
  wikicode = wikicode .. mw.ustring.format(
      "([[Annexe:Conjugaison en %s/%s%s|%s]])",
      langName,
      verb,
      section and ("#" .. section) or "",
      text
  )
  if group then
    table.insert(categories, mw.ustring.format(
        "Verbes du %s groupe en %s",
        groups[group] and mw.ustring.lower(groups[group]) or (tostring(group) .. "e"),
        langName
    ))
  end
  if group2 then
    table.insert(categories, mw.ustring.format(
        "Verbes du %s groupe en %s",
        groups[group] and mw.ustring.lower(groups[group2]) or (tostring(group2) .. "e"),
        langName
    ))
  end

  if type then
    table.insert(categories, mw.ustring.format("Verbes %s en %s", types[type], langName))
  end

  if not m_bases.page_existe(mw.ustring.format("Annexe:Conjugaison en %s/%s", langName, verb)) then
    table.insert(categories, "Wiktionnaire:Conjugaisons manquantes en " .. langName)
  end

  if not noCat then
    wikicode = wikicode .. table.concat(m_table.map(categories, m_bases.fait_categorie_contenu), "\n")
  end

  return wikicode
end

function p.conjugaison(frame)
  local function groupChecker(nb)
    return nb >= 1
  end

  local args = m_params.process(frame:getParent().args, {
    ["groupe"] = { type = m_params.INT, checker = groupChecker },
    ["grp"] = { alias_of = "groupe" },
    ["groupe2"] = { type = m_params.INT, checker = groupChecker },
    ["grp2"] = { alias_of = "groupe2" },
    ["lang"] = { checker = function(v)
      return m_langs.get_nom(v)
    end },
    [1] = { alias_of = "lang" },
    ["type"] = { checker = function(v)
      return types[v]
    end },
    ["prnl"] = { type = m_params.BOOLEAN, default = false },
    ["déf"] = { type = m_params.BOOLEAN, default = false },
    ["verbe"] = { default = mw.title.getCurrentTitle().text },
    [2] = { alias_of = "verbe" },
    ["section"] = {},
    ["nocat"] = { type = m_params.BOOLEAN, default = false },
  })

  return p._conjugaison(
      args["verbe"],
      args["groupe"],
      args["groupe2"],
      args["lang"] or "fr",
      args["type"],
      args["prnl"],
      args["déf"],
      args["section"],
      args["nocat"]
  )
end

return p
