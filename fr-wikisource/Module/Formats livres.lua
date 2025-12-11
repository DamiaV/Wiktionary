local m_params = require("Module:paramètres")

local p = {}

--- Check whether the given option is present in the provided arguments table.
--- @param option string The option to look for.
--- @param args table The arguments table.
--- @return boolean # True if the option is present, false otherwise.
local function checkOption(option, args)
  return args[1] == option or args[2] == option or args[3] == option
end

--- @param frame frame
function p.format(frame)
  local args_ = m_params.process(frame.args, {
    [1] = { required = true },
    [2] = { required = true },
    exposant = { type = m_params.BOOLEAN, default = false },
  })

  local text = args_[1]
  local tooltip = args_[2]
  local superscript = args_.exposant

  local options = { "cap", "sp" }
  if superscript then
    table.insert(options, "nx")
    table.insert(options, "ind")
  end
  local defs = {}
  for i = 1, (superscript and 3 or 2) do
    defs[i] = { enum = options }
  end
  local args = m_params.process(frame:getParent().args, defs)

  local capFirst = checkOption("cap", args)
  local space = checkOption("sp", args)
  local nonSuperscript = superscript and checkOption("nx", args)
  local subscript = superscript and checkOption("ind", args)

  local finalText = (capFirst and "In" or "in") .. (space and "&nbsp;" or "-") .. text
  if nonSuperscript then
    finalText = finalText .. "o"
  elseif subscript then
    finalText = finalText .. '<sub style="font-size: 70%">o</sub>'
  elseif superscript then
    finalText = finalText .. '<sup style="font-size: 70%">o</sup>'
  end

  return mw.ustring.format(
    '<abbr class="abbr" title="in-%s" style="white-space: nowrap">%s</abbr>',
    tooltip,
    finalText
  )
end

return p
