local tests = require("Module:UnitTests")
local m_langs = require("Module:langues")

function tests:test_getWikimediaCode()
  local codes = { "fr", "cmn", "conv", "egl", "fra-nor", "gsw", "lzh",
                  "nan", "nb", "nn", "nrf", "rup", "sgs", "vro", "yue" }
  local expectedCodes = {
    ["fr"] = nil,
    ["cmn"] = "zh",
    ["conv"] = "wikispecies",
    ["egl"] = "eml",
    ["fra-nor"] = "nrm",
    ["gsw"] = "als",
    ["lzh"] = "zh-classical",
    ["nan"] = "zh-min-nan",
    ["nb"] = "no",
    ["nn"] = "nn",
    ["nrf"] = "nrm",
    ["rup"] = "roa-rup",
    ["sgs"] = "bat-smg",
    ["vro"] = "fiu-vro",
    ["yue"] = "zh-yue"
  }

  for _, code in ipairs(codes) do
    self:equals(code, m_langs.getWikimediaCode(code), expectedCodes[code])
  end
end

return tests
