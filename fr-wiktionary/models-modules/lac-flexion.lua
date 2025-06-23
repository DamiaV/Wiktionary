--- (fr) Génération des tableaux de flexions des mots en lacandon
--- (en) Module building inflexion tables for Lacandon
local m_inflBases = require("Module:simple-inflections-base")

local p = {}

--- Generate the inflections table for a word.
--- @param frame frame
---  parent.args["s"] (string, optional): The singular form.
---  parent.args["p"] (string, optional): The plural form.
---  parent.args["f"] (string, optional): The inflection type.
---  parent.args["titre"] (string, optional): The table’s title.
--- @return string The generated table.
function p.inflectionsTable(frame)
  return m_inflBases.inflectionsTable(frame, "lac", { "ob" })
end

return p
