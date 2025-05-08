local p = {}

function p.count()
  local languagesData = mw.loadData("Module:langues/data")
  local count = 0
  for _, _ in pairs(languagesData) do
    count = count + 1
  end
  return count
end

return p
