local m_typesDeMots = require("Module:types de mots")
local m_langues = require("Module:langues")

local p = {}

-- Critères basés sur [[Wiktionnaire:Prise de décision/Catégories de lemmes]]
local validLangCodes = {
  ['fr'] = true,
  ['de'] = true,
  ['en'] = true,
  ['eo'] = true,
  ['es'] = true,
  ['io'] = true,
  ['it'] = true,
  ['ru'] = true,
  ['uk'] = true,
  ['bg'] = true,
  ['ga'] = true,
  ['gallo'] = true,
  ['se'] = true,
  ['la'] = true,
  ['sl'] = true,
  ['cs'] = true,
  ['sv'] = true,
  ['nl'] = true,
  ['pt'] = true,
  ['fi'] = true,
}
local invalidTypes = {
  ['variante par contrainte typographique'] = true,
  ['nom propre'] = true,
  ['prénom'] = true,
  ['nom de famille'] = true,
  ['nom scientifique'] = true,
  ['infixe'] = true,
  ['interfixe'] = true,
  ['préfixe'] = true,
  ['suffixe'] = true,
  ['circonfixe'] = true,
  ['symbole'] = true,
}

function p.isLemma(langCode, type, flexion, locution)
  return langCode
      and validLangCodes[langCode]
      and not flexion
      and type
      and m_typesDeMots.is_type(type)
      and not invalidTypes[m_typesDeMots.get_nom(type)]
      and not locution
end

function p.categorizeLemma(langCode, type, flexion, locution)
  if langCode == nil or type == nil or flexion == nil or locution == nil then
    return ''
  end

  if p.isLemma(langCode, type, flexion, locution) then
    local langName = m_langues.get_nom(langCode)
    if langName then
      return "Lemmes en " .. langName
    else
      return ""
    end
  end
end

return p
