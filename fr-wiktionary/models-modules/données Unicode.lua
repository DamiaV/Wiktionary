local m_table = require("Module:table")
local m_params = require("Module:paramètres")

local p = {}

---------------------------------
-- Functions for other modules --
---------------------------------

-- Data loading functions --

--- Returns the list of all Unicode blocks.
--- @return table
function p.getBlocks()
  return mw.loadData("Module:données Unicode/data/blocks")
end

--- Returns the list of all Unicode scripts.
--- @return table
function p.getScripts()
  return mw.loadData("Module:données Unicode/data/scripts")
end

--- Returns the list of all Unicode script ranges.
--- @return table
function p.getScriptRanges()
  -- Loaded with require() instead of mw.loadData() as the returned table
  -- has tables as keys.
  return require("Module:données Unicode/data/script ranges")
end

--- Returns the list of all number systems.
--- @return table
function p.getNumberSystems()
  return mw.loadData("Module:données Unicode/data/numbers")
end

-- Block-related functions --

--- Returns the Unicode block that has the given lowest codepoint.
--- @param lowerCodepoint number The lowest codepoint of the block.
--- @return table|nil The block or nil if none were found.
function p.getBlock(lowerCodepoint)
  return p.getBlocks()[lowerCodepoint]
end

--- Returns the Unicode block that contains the given character.
--- Throws an error if zero or more than 1 characters were given.
--- @param char string The character.
--- @return table|nil The block or nil if the character doesn’t belong to any block.
function p.getBlockForChar(char)
  local len = mw.ustring.len(char)
  if len ~= 1 then
    error(mw.ustring.format('Un seul caractère attendu, %d donnés ("%s")', len, char))
  end
  local code = mw.ustring.codepoint(char)

  for _, block in pairs(p.getBlocks()) do
    if block.lower <= code and code <= block.upper then
      return block
    end
  end

  return nil
end

-- Script-related functions --

--- Returns the Unicode script for the given code.
--- @param code string The script’s code.
--- @return table|nil The script or nil if none were found.
function p.getScript(code)
  return p.getScripts()[code]
end

--- Returns the Unicode script for the given character.
--- Throws an error if zero or more than 1 characters were given.
--- @param char string The character.
--- @return table|nil The script or nil if the character doesn’t belong to any block.
function p.getScriptForChar(char)
  local len = mw.ustring.len(char)
  if len ~= 1 then
    error(mw.ustring.format("Un seul caractère attendu, %d donnés", len))
  end
  local code = mw.ustring.codepoint(char)
  local scripts = p.getScripts()

  for range, script_code in pairs(p.getScriptRanges()) do
    if range[1] <= code and code <= range[2] then
      return scripts[script_code]
    end
  end

  return scripts["Unknown"]
end

--- Returns the Unicode script for the given text.
--- If the text contains character from several scripts other than
--- Common or Inherited, the returned script is Common.
--- @param text string The text.
--- @return table The script.
function p.getScriptForText(text)
  local inheritedFound = false
  local commonFound = false
  local res

  for _, script in pairs(p.getScriptsForText(text)) do
    local name = script.code

    if not commonFound and name == "Common" then
      commonFound = true
    elseif not inheritedFound and name == "Inherited" then
      inheritedFound = true
    elseif name ~= "Common" and name ~= "Inherited" then
      if res == nil or res.code == "Unknown" then
        res = script
      elseif res and script.code ~= "Unknown" and script.code ~= res.code then
        return p.getScript("Unknown")
      end
    end
  end

  if res == nil then
    if inheritedFound then
      return p.getScript("Inherited")
    elseif commonFound then
      return p.getScript("Common")
    end
  end

  return res
end

--- Returns the Unicode scripts for the given text.
--- @param text string The text.
--- @param getRanges boolean If true, ranges for each script will be returned
--- @return table The list of scripts (unsorted).
function p.getScriptsForText(text, getRanges)
  local res = {}
  local scriptsRanges = {}

  local i = 1
  while i <= mw.ustring.len(text) do
    local c = mw.ustring.sub(text, i, i)

    -- Skip HTML tags
    local skip = false
    if c == "<" then
      local j = mw.ustring.find(text, ">", i, true)
      if j ~= nil then
        table.insert(scriptsRanges, { script = nil, from = i, to = j })
        i = j
        skip = true
      end
    end

    if not skip then
      local script = p.getScriptForChar(c)
      local name = script.code

      if not res[name] then
        res[name] = script
        table.insert(scriptsRanges, { script = name, from = i, to = i })
      else
        local lastRange = scriptsRanges[#scriptsRanges]
        if lastRange.script == name and lastRange.to + 1 == i then
          lastRange.to = i
        else
          table.insert(scriptsRanges, { script = name, from = i, to = i })
        end
      end
    end

    i = i + 1
  end

  if getRanges then
    return res, scriptsRanges
  end
  return res
end

--- Indicates whether the given text contains characters in the given Unicode script.
--- @param text string The text.
--- @param scriptCode string The script’s code.
--- @return boolean True if the code exists and the text contains characters in this script,
---                 false otherwise.
function p.textHasScript(text, scriptCode)
  local script = p.getScript(scriptCode)
  return script ~= nil and p.getScriptsForText(text)[script.code] ~= nil
end

--- Indicates whether the given text should be in italics, based on the different character scripts.
--- A text should be in italics if and only if p.getScriptForText(text) returns either Latin, Common or Inherit;
--- in all other cases, it should not.
--- @param text string The text.
--- @return boolean True if the text should be in italics.
function p.shouldItalicize(text)
  local name = p.getScriptForText(text).code
  return name == "Latin" or name == "Common" or name == "Inherited"
end

local directionToCss = {
  ["lr"] = "horizontal-tb",
  ["rl"] = "horizontal-tb",
  ["tb"] = "vertical-lr",
  ["i"] = "inherit",
  ["m"] = "inherit",
}

local directionToDir = {
  ["lr"] = "ltr",
  ["rl"] = "rtl",
  ["tb"] = "ltr",
}

--- Sets the writing direction for the given text, based on its Unicode scripts,
--- by inserting span tags.
--- @param text string The text.
--- @return string The text which contains span tags with the writing-mode CSS rule and dir attribute.
function p.setWritingDirection(text)
  local dirsToIgnore = { lr = true, rl = true }
  local res = ""
  local scripts, intervals = p.getScriptsForText(text, true)

  local prevScriptName
  local inSpan = false
  for i, interval in ipairs(intervals) do
    local substr = mw.ustring.sub(text, interval.from, interval.to)

    if interval.script then
      local script = scripts[interval.script]
      local scriptName = script.name
      local scriptDir = script.direction or "i"
      local nextScript = intervals[i + 1] and scripts[intervals[i + 1].script] or nil
      local nextScriptDir = nextScript and (nextScript.direction or "i") or nil

      if inSpan and scriptDir ~= "i" and scriptDir ~= "m" and scriptName ~= prevScriptName then
        res = res .. "</span>"
        inSpan = false
      end

      if dirsToIgnore[scriptDir] or prevScriptName == scriptName
          -- Special case for when text begins with i or m scripts and is followed by script that is not lr nor rl
          or ((scriptDir == "i" or scriptDir == "m") and ((i == 1 and (dirsToIgnore[nextScriptDir] or nextScriptDir == "i" or nextScriptDir == "m")) or i > 1 or not nextScript)) then
        res = res .. substr
      else
        local dir
        local cssDir
        -- Include current span in next script’s span
        if scriptDir ~= "i" and scriptDir ~= "m" then
          dir = directionToDir[scriptDir]
          cssDir = scriptDir
          prevScriptName = scriptName
        elseif nextScriptDir then
          dir = directionToDir[nextScriptDir]
          cssDir = nextScriptDir
          prevScriptName = nextScript.name
        end

        if dir then
          local dirAttr = dir and ('dir="' .. dir .. '"') or ""
          local writingMode = directionToCss[cssDir]
          res = res .. mw.ustring.format('<span %s style="writing-mode:%s">', dirAttr, writingMode) .. substr
          inSpan = true
        end
      end
    else
      if inSpan then
        res = res .. "</span>"
        inSpan = false
      end
      res = res .. substr
      prevScriptName = nil
    end
  end

  if inSpan then
    res = res .. "</span>"
  end

  return res
end

--- Converts an integer into another system.
--- @param n number The number to convert.
--- @param system string The target number system.
--- @return string The converted number as a string of digits.
function p.convertNumber(n, system)
  if n < 0 then
    error("Le nombre doit être un entier positif ou nul !")
  end
  local s = p.getNumberSystems()[system]
  if not s then
    error("Système numérique invalide : " .. tostring(system))
  end
  if (s.min_value and n < s.min_value) or (s.max_value and n > s.max_value) then
    error("Valeur invalide : " .. tostring(n))
  end

  -- Positional systems
  if s.positional then
    local base = s.base
    local offset = s.zero_offset
    local digit = function(i)
      return mw.ustring.char(i + offset)
    end

    if n == 0 then
      return digit(0)
    end

    local res = ""
    local i = n
    while i > 0 do
      res = digit(i % base) .. res
      i = math.floor(i / base)
    end

    return res

    -- Roman numerals
  elseif system == "romain" then
    local symbols = {
      "I", "V",
      "X", "L",
      "C", "D",
      "M", "ↁ",
      "ↂ", "ↇ",
      "ↈ",
    }
    local exp = 0;
    local res = "";

    local i = n
    while i > 0 do
      local d = i % 10;
      local unit1 = symbols[exp * 2 + 1];
      local unit5 = symbols[(exp + 1) * 2];
      local unit10 = symbols[(exp + 1) * 2 + 1];
      local str = "";

      if d ~= 0 then
        if d <= 3 then
          for _ = 0, d - 1 do
            str = str .. unit1
          end
        elseif d == 4 then
          str = str .. unit1 .. unit5
        elseif d == 5 then
          str = str .. unit5
        elseif 5 < d and d < 9 then
          str = str .. unit5
          for _ = 0, d - 6 do
            str = str .. unit1
          end
        else
          str = str .. unit1 .. unit10
        end
      end
      res = str .. res;
      i = math.floor(i / 10);
      exp = exp + 1;
    end

    return res;

    -- Greek numerals
  elseif system == "grec" then
    local symbols = {
      "α", "β", "γ", "δ", "ε", "ϛ", "ζ", "η", "θ", -- 1 to 9
      "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π", "ϟ", -- 10 to 90
      "ρ", "σ", "τ", "υ", "φ", "χ", "ψ", "ω", "ϡ", -- 100 to 900
    }

    local exp = 1;
    local res = "";

    local i = n
    while i > 0 do
      local d = i % 10
      if d > 0 then
        if exp == 10 or exp == 10000 then
          d = d + 9
        elseif exp == 100 or exp == 100000 then
          d = d + 18
        end
        res = symbols[d] .. res
        if exp >= 1000 then
          res = "͵" .. res
        end
      end
      exp = exp * 10
      i = math.floor(i / 10)
    end
    if n % 1000 ~= 0 then
      res = res .. "ʹ"
    end

    return res

    -- Chinese and japanese numerals
  elseif system == "sinogrammes" then
    local symbols = { "〇", "一", "二", "三", "四", "五", "六", "七", "八", "九" }

    if n == 0 then
      return symbols[1]
    end

    local res = "";
    local i = n
    while i > 0 do
      res = symbols[(i % 10) + 1] .. res
      i = math.floor(i / 10)
    end

    return res
  end
end

-----------------------------
-- Functions for templates --
-----------------------------

--- Returns the wikitext for template [[Modèle:Bloc Unicode]].
---  frame.args[1] (int, optional): The lower bound of the Unicode block
---   (decimal or hexadecimal with “0x” prefix).
---   If undefined, the code will be extracted from the page’s title.
--- @return string The template’s wikicode.
function p.blockReference(frame)
  local args = m_params.process(frame.args, {
    [1] = { type = m_params.INT },
  })
  local blockCode = args[1]
  local block

  if blockCode then
    block = p.getBlock(blockCode)
  else
    block = p.getBlockForChar(mw.title.getCurrentTitle().text)
  end

  if block then
    return mw.ustring.format("Unicode, Inc., ''[%s %s]'', The Unicode Standard, version %s, %d",
      block.url, block.name.en, block.version, block.year)
  end

  error(mw.ustring.format("Bloc Unicode «&nbsp;%s&nbsp;» invalide", blockCode or ""))
end

--- Sets the writing direction for the given text, based on its Unicode script,
--- by inserting it inside a span tag.
---  frame.args[1] (string): The text.
--- @return string The text, included in a span tag with the writing-mode CSS rule.
function p.writingDirection(frame)
  local args = m_params.process(frame.args, {
    [1] = { required = true, allow_empty = true },
  })
  if args[1] then
    return p.setWritingDirection(args[1])
  end
  return ""
end

--- Returns the Unicode codepoint of the given character.
--- Throws an error if zero or more than 1 characters were given.
---  frame.args[1] (string, only one character): The character.
---  frame.args[2] (boolean, default = false) : Indicates wether the returned codepoint
---   will be in hexadecimal.
--- @return string|number The character’s codepoint, without the “0x” prefix if it is in hexadecimal.
function p.codepoint(frame)
  local args = m_params.process(frame.args, {
    [1] = {
      required = true,
      checker = function(value)
        return mw.ustring.len(value) == 1
      end,
    },
    ["hexa"] = { type = m_params.BOOLEAN, default = false },
  })
  local char = args[1]
  local isHex = args["hexa"]

  local code = mw.ustring.codepoint(char)
  if isHex then
    return string.format("%04X", code)
  end
  return code
end

--- Returns the Unicode codepoints of the given characters.
---  frame.args[1] (string): The characters.
--- @return string The characters’ codepoints in the format "U+XXXX U+XXXX …".
function p.codepoints(frame)
  local args = m_params.process(frame.args, {
    [1] = {},
  })
  local chars = args[1] or mw.title.getCurrentTitle().fullText

  local codepoints = {}
  for codepoint in mw.ustring.gcodepoint(chars) do
    table.insert(codepoints, "U+" .. string.format("%04X", codepoint))
  end
  return table.concat(codepoints, " ")
end

--- Returns the character with the given Unicode codepoint.
--- Throws an error if the codepoint is invalid.
---  frame.args[1] (int): The codepoint.
--- @return string The character.
function p.character(frame)
  local args = m_params.process(frame.args, {
    [1] = { required = true, type = m_params.INT },
  })
  local code = tonumber(args[1])

  if code ~= nil then
    local success, char = pcall(mw.ustring.char, code)
    if success then
      return char
    end
  end

  error("Point de code incorrect")
end

--- Converts an arab number into the given system.
---  frame.args[1] (int): The number.
---  frame.args["script"] (string): The target system.
--- @return string The converted number as a string of digits.
function p.number(frame)
  local systems = p.getNumberSystems()
  local args = m_params.process(frame.args, {
    [1] = {
      required = true,
      type = m_params.INT,
      checker = function(i)
        return tonumber(i) >= 0
      end
    },
    ["script"] = { required = true, enum = m_table.keysToList(systems) }
  })

  local n = args[1]
  local script = args["script"]
  local convertedNumber = p.convertNumber(n, script)
  local title = mw.ustring.format("%d en ", n)
  if script == "sinogrammes" then
    title = title .. "sinogrammes"
  else
    title = title .. "chiffres "
    if systems[script].text then
      title = title .. systems[script].text
    elseif mw.ustring.sub(script, -1) ~= "s" then
      title = title .. script .. "s"
    else
      title = title .. script
    end
  end
  return mw.ustring.format("<span title='%s' style='cursor: help'>%s</span>", title, convertedNumber)
end

return p
