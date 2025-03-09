local m_table = require('Module:table')

local p = {}

-- Constants

local START = 'start'
local END = 'end'

local FLAGS = {
  ['A'] = 'start of string',
  ['Z'] = 'end of string',
  ['z'] = 'absolute of string',
  ['b'] = 'word boundary',
  ['B'] = 'non-word boundary',
  ['G'] = 'last match', -- TODO garder ?
}

local OR = 'or'
local GROUP = 'group'
local CLASS = 'class'

local QUANTIFIED = 'quantified'
local SYMBOL = 'symbol'
local NON_GREEDY = 'non-greedy'

local PREDEFINED_CLASSES = {
  -- Whitespace (space, new lines and tabulations)
  ['s'] = function(c)
    local cp = mw.ustring.codepoint(c)
    return c == ' ' or c == '\n' or c == '\r' or c == '\t' or cp == 11
  end,
  -- Digits [0-9]
  ['d'] = function(c)
    return tonumber(c) ~= nil
  end,
  -- Alphanum [_0-9A-Za-z]
  ['w'] = function(c)
    local cp = mw.ustring.codepoint(c)
    return c == '_' or (48 <= cp and cp <= 57) or (65 <= cp and cp <= 90) or (97 <= cp and cp <= 122)
  end,
  -- Vertical whitespace (new line, carriage return and vertical tabulation)
  ['v'] = function(c)
    -- CP 11 = vertical tabulation
    return c == '\n' or c == '\r' or mw.ustring.codepoint(c) == 11
  end,
  -- Horizontal whitespace (space and horizontal tabulation)
  ['h'] = function(c)
    return c == ' ' or c == '\t'
  end,
}

-- Generate negations of preceding character classes.
for class, predicate in pairs(PREDEFINED_CLASSES) do
  PREDEFINED_CLASSES[mw.ustring.upper(class)] = function(c)
    return not predicate(c)
  end
end

-- Others classes
-- \X: any valid Unicode character.
-- \C: 1 data unit (?).
-- \R: Unicode new lines (\n, \r, \r\n).
-- \K: sets the given position in the regex as the new "start" of the match.
--    This means that nothing preceding the K will be captured in the overall match.
-- \#: #-th sub-pattern.
-- \p#: Unicode property (negation = \P#).
-- \p{…}: Unicode property or script category (negation = \P{…}).
-- \Q…\E: all metacharacter between these bounds are treated as literals.

-- New line
PREDEFINED_CLASSES['n'] = function(c)
  return c == '\n'
end
-- Carriage return
PREDEFINED_CLASSES['r'] = function(c)
  return c == '\r'
end
-- Horizontal tabulation
PREDEFINED_CLASSES['t'] = function(c)
  return c == '\t'
end
-- Form feed
PREDEFINED_CLASSES['f'] = function(c)
  return c == '\f'
end
-- Null character
PREDEFINED_CLASSES['0'] = function(c)
  return c == '\0'
end
-- Any character
PREDEFINED_CLASSES['.'] = function(_)
  return true
end

-- Utility functions

--- Tests wether the given element is a group.
local function isGroup(element)
  return type(element) == 'table' and element[GROUP] ~= nil
end

--- Tests wether the given element is a character class.
local function isClass(element)
  return type(element) == 'table' and type(element[CLASS]) == 'function'
end

--- Tests wether the given element is a character literal.
local function isLiteral(element)
  return type(element) == 'string'
end

--- Tests wether the given element is a character literal.
local function isStarOrPlusQuantifier(element)
  return type(element) == 'table' and (element[SYMBOL] == '*' or element[SYMBOL] == '+')
end

local function checkIfQuantifiable(element, i)
  if not isGroup(element) and not isClass(element) and not isLiteral(element) then
    error(mw.ustring.format('nothing to repeat at position %d', i), 0)
  end
end

local function createQuantifier(min, max, value, symbol)
  return {
    [QUANTIFIED] = value,
    [SYMBOL] = symbol,
    [NON_GREEDY] = false,
    ['min'] = min,
    ['max'] = max,
  }
end

-- Functions

--- Handles the simple quantifiers (*, + and ?).
--- @param tree table The current regex tree.
--- @param c string The current character.
--- @param i number The current index.
local function handleQuantifier(tree, c, i)
  local lastIndex = m_table.length(tree)
  local prevValue = tree[lastIndex]
  local min, max

  checkIfQuantifiable(prevValue, i - 1)

  if c == '*' then
    min = 0
    max = math.huge
  elseif c == '+' then
    min = 1
    max = math.huge
  elseif c == '?' then
    min = 0
    max = 1
  end

  tree[lastIndex] = createQuantifier(min, max, prevValue, c)
end

--- Compiles the given regex.
--- May throw an error if a syntax error is encountered.
--- @param regex string The regular expression to compile.
--- @param endChar string The character to stop at.
---                       If it is not found, an error is raised.
--- @param startIndex number The index to start at in the regex.
--- @return table The compiled regular expression as a tree.
local function pcreCompile_impl(regex, endChar, startIndex)
  local regexTree = {}
  local endCharFound = false
  local len = mw.ustring.len(regex)
  local inGroup = endChar == ')'
  local inOr = false
  local inQuantifierRange = endChar == '}'
  local commaFoundInRange = false
  local otherCharFoundInRange = false
  local inClass = endChar == ']'
  local escape = false
  local i = startIndex
  local currentTree = regexTree

  if inQuantifierRange then
    currentTree.min = -1
    currentTree.max = -1
  end

  repeat
    local c = mw.ustring.sub(regex, i, i)

    if not escape and c == endChar then
      if inQuantifierRange then
        if currentTree.min ~= -1 then
          if currentTree.max == -1 then
            if commaFoundInRange then
              currentTree.max = math.huge
            else
              currentTree.max = currentTree.min
            end
            -- Quantifier range is out of order.
          elseif currentTree.max < currentTree.min then
            error(mw.ustring.format('quantifier range min greater than max at position %d', i), 0)
          end
        else
          currentTree.min = nil
          currentTree.max = nil
          -- To keep the “}” after returning.
          i = i - 1
        end
      end

      endCharFound = true
    else

      if inQuantifierRange then
        table.insert(currentTree, c)

        if not otherCharFoundInRange then
          local digit = tonumber(c)

          if digit ~= nil then
            if commaFoundInRange then
              if currentTree.max == -1 then
                currentTree.max = 0
              end
              currentTree.max = currentTree.max * 10 + digit
            else
              if currentTree.min == -1 then
                currentTree.min = 0
              end
              currentTree.min = currentTree.min * 10 + digit
            end
          elseif c == ',' then
            commaFoundInRange = true
          else
            currentTree.min = nil
            currentTree.max = nil
            -- Set “endChar” to nil to avoid raising the error before the last return.
            endChar = nil
            -- Remove last char and step back in case “c” is a “(”.
            table.remove(currentTree, m_table.length(currentTree))
            i = i - 1
            break
          end
        end

        -- In group or root regex
      else

        -- Capture group
        if not escape and c == '(' then
          -- TODO gérer ?:, ?<=, ?=, ?<!, ?!, ?>, ?#
          local subGroup, endIndex = pcreCompile_impl(regex, ')', i + 1)
          table.insert(currentTree, { [GROUP] = subGroup })
          i = endIndex

          -- Stray end of group
        elseif not escape and c == ')' and not inGroup then
          error(mw.ustring.format('unexpected ")" at position %d', i), 0)

          -- Alternative
        elseif not escape and c == '|' then
          if not inOr then
            inOr = true
            regexTree = { [OR] = { regexTree } }
          end
          table.insert(regexTree[OR], {})
          currentTree = regexTree[OR][m_table.length(regexTree[OR])]

          -- Line/string start
        elseif not escape and c == '^' then
          table.insert(currentTree, START)

          -- Line/string end
        elseif not escape and c == '$' then
          table.insert(currentTree, END)

          -- Dot special character
        elseif not escape and c == '.' or escape and PREDEFINED_CLASSES[c] then
          table.insert(currentTree, { [CLASS] = PREDEFINED_CLASSES[c] })

          -- Quantifiers (*, + and ?)
        elseif not escape and (c == '*' or c == '+' or c == '?') then
          local lastIndex = m_table.length(currentTree)
          local prevValue = currentTree[lastIndex]
          local skip = false

          if c == '?' and isStarOrPlusQuantifier(prevValue) then
            prevValue[NON_GREEDY] = true
            skip = true
          end
          if not skip then
            handleQuantifier(currentTree, c, i)
          end

          -- Quantifier range
        elseif not escape and c == '{' then
          local repetition, endIndex = pcreCompile_impl(regex, '}', i + 1)

          if repetition.min ~= nil then
            local lastIndex = m_table.length(currentTree)
            local prevValue = currentTree[lastIndex]
            checkIfQuantifiable(prevValue, i - 1)
            currentTree[lastIndex] = createQuantifier(repetition.min, repetition.max, prevValue, '{}')
          else
            table.insert(currentTree, '{')
            m_table.arrayConcat(currentTree, repetition)
          end
          i = endIndex

          -- Escape next character
        elseif not escape and c == '\\' then
          escape = true

          -- Default case: add literal character to the current sequence
        else
          table.insert(currentTree, c)
          if escape then
            escape = false
          end
        end
      end

      i = i + 1
    end
  until endCharFound or i == len + 1

  if not endCharFound and endChar ~= nil then
    error(mw.ustring.format('expected "%s" at position %d', endChar, i), 0)
  end

  return regexTree, i
end

--- Compiles the given regular expression.
--- May throw an error if a syntax error is encountered.
--- @param regex string The regular expression to compile.
--- @return table The compiled regular expression as a tree.
function p.pcreCompile(regex)
  local success, value = pcall(pcreCompile_impl, regex, nil, 1)

  if success then
    return value
  else
    error('Regex syntax error: ' .. value)
  end
end

-- Flags
p.I = 'i'
p.G = 'g'
p.M = 'm'

--- Tests wether the given string matches the given regex
--- then returns all captured matches.
--- @param s string The string to test.
--- @param regex string|table The regex (as a string or compiled).
--- @param offset number The index to start from in parameter "s".
--- @param flags table|nil The flags (i, g or m).
--- @return table|nil An array containing all matches or nil if the match failed.
---                   The array index 0 contains the whole match, subsequent indices
---                   contain the values from the corresponding capture group if any.
function p.pcreMatch(s, regex, offset, flags)
  local compiledRegex = type(regex) == 'table' and regex or p.pcreCompile(regex)
  local startIndex = offset or 1
  flags = flags or {}

  -- TODO

  return nil
end

--- Tests wether the given string matches the given regex.
--- @param s string The string to test.
--- @param regex string|table The regex (as a string or compiled).
--- @param offset number The index to start from in parameter "s".
--- @param flags table|nil The flags (i, g or m).
--- @return boolean True if and only if parameter "s" matches the
---                 given regex from the given index.
function p.pcreFind(s, regex, offset, flags)
  return p.pcreMatch(s, regex, offset, flags) ~= nil
end

return p
