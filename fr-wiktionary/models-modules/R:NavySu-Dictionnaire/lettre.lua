--- This module converts cyrillic characters to the latin names
--- used in the URLs of the website <http://www.navy.su/dictionary/>.

local m_params = require("Module:paramètres")
-- Le code est issu de Module:transliterator
local p = {}

local transtable = mw.loadData("Module:R:NavySu-Dictionnaire/lettre/data")

--- Transliterate the given cyrillic character to the name used by <navy.su>.
--- This function implements the template {{R:NavySu-Dictionnaire/lettre}}.
--- @param frame frame
--- Parameters:
---  parent.args[1] (string): The cyrillic character to convert.
function p.transliterate(frame)
    local args = m_params.process(frame:getParent().args, {
        [1] = { required = true },
    })
    local char = args[1]
    return (transtable[mw.ustring.lower(char)] or
        "<span style='color: red'>Caractère non valide&nbsp;: " .. char .. ".</span>")
end

return p
