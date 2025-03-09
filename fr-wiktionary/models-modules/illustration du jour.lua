local m_table = require("Module:table")

local p = {}

local function getTodaysIllustration()
  local illustrationsList = mw.loadData("Module:Bac à sable/illustration du jour/data")
  local date = tonumber(os.date("%Y%m%d"))
  local illustration = (date % m_table.length(illustrationsList)) + 1
  return illustrationsList[illustration]
end

function p.illustrationName(_)
  return getTodaysIllustration()[1]
end

function p.illustrationText(_)
  return getTodaysIllustration()[2] or ""
end

return p
