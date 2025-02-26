local m_tests = require("Module:UnitTests")
local m_lemme = require("Module:lemme")

function m_tests:checkIsLemma(mot, lang, type, flexion, loc, attendu)
  local text = mw.ustring.format(
      "%s (%s-%s-%s-%s)",
      mot,
      lang,
      type,
      flexion and "flex" or "noflex",
      loc and "loc" or "noloc"
  )
  self:equals(text, m_lemme.isLemma(lang, type, flexion, loc), attendu)
end

function m_tests:testIsLemmaFr()
  self:checkIsLemma("maison", "fr", "nom", false, false, true)
  self:checkIsLemma("maisons", "fr", "nom", true, false, false)
  self:checkIsLemma("parce que", "fr", "nom", false, true, false)
  self:checkIsLemma("Paul", "fr", "prénom", false, false, false)
  self:checkIsLemma("Paris", "fr", "nom-pr", false, false, false)
  self:checkIsLemma("Dupont", "fr", "nom-fam", false, false, false)
end

function m_tests:testIsLemmaOther()
  self:checkIsLemma("house", "en", "nom", false, false, true)
  self:checkIsLemma("houses", "en", "nom", true, false, false)
  self:checkIsLemma("domus", "la", "nom", false, false, true)
  self:checkIsLemma("domum", "la", "nom", true, false, false)
end

return m_tests
