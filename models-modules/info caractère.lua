local m_unicode = require("Module:données Unicode")
local p = {}

--- @param char_or_code string
local function get_char(char_or_code)
  if mw.ustring.len(char_or_code) > 1 then
    return mw.ustring.char(char_or_code)
  end
  return char_or_code
end

--- @param char_or_code string
local function get_code(char_or_code)
  if mw.ustring.len(char_or_code) > 1 then
    return tonumber(char_or_code)
  end
  return mw.ustring.codepoint(char_or_code)
end

function p.get_data(char_or_code, prev_char_or_code, next_char_or_code)
  local char = get_char(char_or_code)
  local code = get_code(char_or_code)
  local prev_code = prev_char_or_code ~= nil and get_code(prev_char_or_code) or code - 1
  local next_code = next_char_or_code ~= nil and get_code(next_char_or_code) or code + 1

  local data = {
    ["character"] = char,
    ["code"] = code,
    ["name"] = m_unicode.get_char_name(char),
    ["block_name"] = m_unicode.get_block_for_char(char)[4],
    ["prev_char"] = mw.ustring.char(prev_code),
    ["prev_char_code"] = prev_code,
    ["next_char"] = mw.ustring.char(next_code),
    ["next_char_code"] = next_code
  }

  return data
end

function p.table(frame)
  local args = frame.args
  local char_or_code = args[1]
  local prev_char_or_code = args[2]
  local next_char_or_code = args[3]

  local data = p.get_data(char_or_code, prev_char_or_code, next_char_or_code)

  return ""
end

return p
