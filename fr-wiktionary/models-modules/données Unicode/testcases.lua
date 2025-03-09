local tests = require("Module:UnitTests")
local m_unicode = require("Module:données Unicode")
local m_table = require("Module:table")

-- Tests --

function tests:testGetBlock()
  self:equals("Bloc", m_unicode.getBlock(0).name.en, "Basic Latin")
end

function tests:testGetBlockForChar()
  self:equals("Caractère", m_unicode.getBlockForChar("A").name.en, "Basic Latin")
end

function tests:testGetScript()
  self:equals("Script", m_unicode.getScript("Latin").code, "Latin")
end

function tests:testGetScriptForChar()
  self:equals("Caractère", m_unicode.getScriptForChar("A").code, "Latin")
end

function tests:testGetScriptForUnknownChar()
  self:equals("Caractère inconnu", m_unicode.getScriptForChar(mw.ustring.char(0x100000)).code, "Unknown")
end

function tests:testGetScriptForTextOneScript()
  self:equals("Un seul script", m_unicode.getScriptForText("ABCDE").code, "Latin")
end

function tests:testGetScriptForTextScriptAndCommon()
  self:equals("Un script et Common", m_unicode.getScriptForText("Texte principalement en Latin").code, "Latin")
end

function tests:testGetScriptForTextInheritedMajority()
  self:equals("Inherited majoritaire", m_unicode.getScriptForText("T̀ ̀").code, "Latin")
end

function tests:testGetScriptForTextOnlyCommon()
  self:equals("Common uniquement", m_unicode.getScriptForText(" ").code, "Common")
end

function tests:testGetScriptForTextOnlyInherited()
  self:equals("Inherited uniquement", m_unicode.getScriptForText("̀").code, "Inherited")
end

function tests:testGetScriptForTextOnlyCommonAndInherited()
  self:equals("Inherited, Common majoritaire", m_unicode.getScriptForText("̀ ").code, "Inherited")
end

function tests:testGetScriptForTextScriptAndUnknownChar()
  self:equals("Script et caractère inconnu à la fin", m_unicode.getScriptForText("A" .. mw.ustring.char(0x100000)).code, "Latin")
  self:equals("Script et caractère inconnu au début", m_unicode.getScriptForText(mw.ustring.char(0x100000) .. "A").code, "Latin")
end

function tests:testGetScriptForText_commonAndUnknownChar()
  self:equals("Script et caractère inconnu", m_unicode.getScriptForText(" " .. mw.ustring.char(0x100000)).code, "Unknown")
end

function tests:testGetScriptForTextInheritedAndUnknownChar()
  self:equals("Script et caractère inconnu", m_unicode.getScriptForText("̀" .. mw.ustring.char(0x100000)).code, "Unknown")
end

function tests:testGetScriptForTextSeveral()
  self:equals("Plusieurs scripts", m_unicode.getScriptForText("Texte en Latin et en Ελληνικά").code, "Unknown")
end

function tests:testGetScriptsForText()
  self:equals_deep("Un seul script", m_table.keysToList(m_unicode.getScriptsForText("Texte")), { "Latin" })
end

function tests:testGetScriptsForTextSeveral()
  self:equals_deep("Plusieurs scripts", m_table.keysToList(m_unicode.getScriptsForText("Texte en Latin et en Ελληνικά")), { "Common", "Greek", "Latin" })
end

function tests:testGetScriptsForTextTagsIgnored()
  self:equals_deep("Plusieurs scripts", m_table.keysToList(m_unicode.getScriptsForText("Ελληνικά<br>Ελληνικά")), { "Greek" })
  self:equals_deep("Plusieurs scripts", m_table.keysToList(m_unicode.getScriptsForText("Ελληνικά<br/>Ελληνικά")), { "Greek" })
  self:equals_deep("Plusieurs scripts", m_table.keysToList(m_unicode.getScriptsForText('Ελληνικά<span id="yo">Ελληνικά</span>')), { "Greek" })
end

function tests:testTextHasScriptSingle()
  self:equals("Un seul script", m_unicode.textHasScript("Texte", "Latin"), true)
end

function tests:testTextHasScriptSeveral()
  self:equals("Plusieurs scripts, Latin", m_unicode.textHasScript("Texte en Latin et en Ελληνικά", "Latin"), true)
  self:equals("Plusieurs scripts, Greek", m_unicode.textHasScript("Texte en Latin et en Ελληνικά", "Greek"), true)
  self:equals("Plusieurs scripts, Common", m_unicode.textHasScript("Texte en Latin et en Ελληνικά", "Common"), true)
end

function tests:testNotTextHasScript()
  self:equals("Un seul script", m_unicode.textHasScript("Texte", "Greek"), false)
end

function tests:testShouldItalicizeSingleScript()
  self:equals("Latin seulement", m_unicode.shouldItalicize("Texte"), true)
  self:equals("Common seulement", m_unicode.shouldItalicize(" "), true)
  self:equals("Inherited seulement", m_unicode.shouldItalicize("́"), true)
end

function tests:testShouldItalicizeOnlyCommonAndInherited()
  self:equals("Common et Inherited", m_unicode.shouldItalicize("1̧"), true)
end

function tests:testShouldItalicizeOnlyLatinCommonInherited()
  self:equals("Latin, Common et Inherited", m_unicode.shouldItalicize("Un ḿ"), true)
end

function tests:testShouldItalicizeTag()
  self:equals("Balise HTML", m_unicode.shouldItalicize("a<br>a"), true)
end

function tests:testShouldNotItalicizeTag()
  self:equals("Balise HTML", m_unicode.shouldItalicize("ε<br>ε"), false)
end

function tests:testShouldNotItalicize()
  self:equals("Non latin seulement", m_unicode.shouldItalicize("ε"), false)
end

function tests:testShouldNotItalicizeLatinAndOther()
  self:equals("Latin et autre", m_unicode.shouldItalicize("a et ε"), false)
end

function tests:testScriptIntervals()
  local _, invervals = m_unicode.getScriptsForText("yo εε", true)
  self:equals_deep("yo εε", invervals, { { script = "Latin", from = 1, to = 2 }, { script = "Common", from = 3, to = 3 }, { script = "Greek", from = 4, to = 5 } })
end

function tests:testScriptIntervalsTag()
  local _, invervals = m_unicode.getScriptsForText("yo<br>oy", true)
  self:equals_deep("yo<br>oy", invervals, { { script = "Latin", from = 1, to = 2 }, { from = 3, to = 6 }, { script = "Latin", from = 7, to = 8 } })
end

function tests:testSetWritingDirectionLtrHorizontalOnly()
  self:equals("ltr seulement", m_unicode.setWritingDirection("a et ε"), "a et ε")
end

function tests:testSetWritingDirectionLtrHorizontalOnlyTag()
  self:equals("ltr seulement et balise", m_unicode.setWritingDirection("a et<br>ε"), "a et<br>ε")
end

function tests:testSetWritingDirectionRtlHorizontalOnly()
  self:equals("rtl seulement", m_unicode.setWritingDirection("עברית"), '<span dir="rtl" style="writing-mode:horizontal-tb">עברית</span>')
end

function tests:testSetWritingDirectionRtlHorizontalAndCommon()
  self:equals("rtl et Common", m_unicode.setWritingDirection("עב רית"), '<span dir="rtl" style="writing-mode:horizontal-tb">עב רית</span>')
end

function tests:testSetWritingDirectionRtlHorizontalAndInherited()
  self:equals("rtl et Inherited", m_unicode.setWritingDirection("עב́רית"), '<span dir="rtl" style="writing-mode:horizontal-tb">עב́רית</span>')
end

function tests:testSetWritingDirectionRtlHorizontalOnlyTag()
  self:equals("rtl seulement et balise", m_unicode.setWritingDirection("עב<br>רית"), '<span dir="rtl" style="writing-mode:horizontal-tb">עב</span><br><span dir="rtl" style="writing-mode:horizontal-tb">רית</span>')
end

function tests:testSetWritingDirectionLtrVerticalOnly()
  self:equals("vertical seulement", m_unicode.setWritingDirection("ᠠᠨᡳᠶᠠ"), '<span dir="ltr" style="writing-mode:vertical-lr">ᠠᠨᡳᠶᠠ</span>')
end

function tests:testSetWritingDirectionLtrVerticalAndCommon()
  self:equals("vertical et Common", m_unicode.setWritingDirection("ᠠᠨᡳ ᠶᠠ"), '<span dir="ltr" style="writing-mode:vertical-lr">ᠠᠨᡳ ᠶᠠ</span>')
end

function tests:testSetWritingDirectionLtrVerticalAndInherited()
  self:equals("vertical et Inherited", m_unicode.setWritingDirection("ᠠᠨᡳ́ᠶᠠ"), '<span dir="ltr" style="writing-mode:vertical-lr">ᠠᠨᡳ́ᠶᠠ</span>')
end

function tests:testSetWritingDirectionLtrVerticalOnlyTag()
  self:equals("vertical seulement et balise", m_unicode.setWritingDirection("ᠠᠨᡳ<br>ᠶᠠ"), '<span dir="ltr" style="writing-mode:vertical-lr">ᠠᠨᡳ</span><br><span dir="ltr" style="writing-mode:vertical-lr">ᠶᠠ</span>')
end

function tests:testSetWritingDirectionTwoDirections()
  self:equals("a et עברית", m_unicode.setWritingDirection("a et עברית"), 'a et <span dir="rtl" style="writing-mode:horizontal-tb">עברית</span>')
  self:equals("ae ᠠᠨ́ᡳᠶᠠ εε", m_unicode.setWritingDirection("ae ᠠᠨ́ᡳᠶᠠ εε"), 'ae <span dir="ltr" style="writing-mode:vertical-lr">ᠠᠨ́ᡳᠶᠠ </span>εε')
  self:equals("aeᠠᠨ́εε", m_unicode.setWritingDirection("aeᠠᠨ́εε"), 'ae<span dir="ltr" style="writing-mode:vertical-lr">ᠠᠨ́</span>εε')
  self:equals("aeᠠᠨ́ᡳᠶᠠעב רית", m_unicode.setWritingDirection("aeᠠᠨ́ᡳᠶᠠעב רית"), 'ae<span dir="ltr" style="writing-mode:vertical-lr">ᠠᠨ́ᡳᠶᠠ</span><span dir="rtl" style="writing-mode:horizontal-tb">עב רית</span>')
end

-- Error tests --

function tests:testGetUnknownBlock()
  self:equals("Bloc invalide (négatif)", m_unicode.getBlock(-1), nil)
  self:equals("Bloc invalide (trop grand)", m_unicode.getBlock(0x1000000), nil)
end

function tests:testGetBlockForInvalidChar()
  self:expect_error("Chaine vide", m_unicode.getBlockForChar, { "" }, 'Un seul caractère attendu, 0 donnés ("")')
  self:expect_error("Trop de caractères", m_unicode.getBlockForChar, { "AA" }, 'Un seul caractère attendu, 2 donnés ("AA")')
end

function tests:testGetUnknownScript()
  self:equals("Script inconnu", m_unicode.getScript("script invalide"), nil)
end

function tests:testGetScriptForInvalidChar()
  self:expect_error("Chaine vide", m_unicode.getScriptForChar, { "" }, "Un seul caractère attendu, 0 donnés")
  self:expect_error("Trop de caractères", m_unicode.getScriptForChar, { "AA" }, "Un seul caractère attendu, 2 donnés")
end

return tests
