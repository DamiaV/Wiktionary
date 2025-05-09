local m_params = require("Module:paramètres")
local m_bases = require("Module:bases")
local bit32 = require("bit32")

local SINGULAR = 1
local PLURAL = 2
local SAME = 4

local p = {}

--- Adapted from [[en:Module:sw-utilities]]
local CLASS_CODES = {
  ["wa"] = 1,
  ["mw-wa"] = 1,
  ["mw-w"] = 1,
  ["m-wa"] = 1,
  ["mi"] = 3,
  ["mu-mi"] = 3,
  ["mw-mi"] = 3,
  ["m-mi"] = 3,
  ["ji-ma"] = 5,
  ["ja-ma"] = 5,
  ["j-m"] = 5,
  ["ji-me"] = 5,
  ["ma"] = 5,
  ["vi"] = 7,
  ["vy"] = 7,
  ["ch-vy"] = 7,
  ["ki"] = 7,
  ["ki-vi"] = 7,
  ["n"] = 9,
  ["u-n"] = 11,
  ["u-ma"] = 11,
  ["w"] = 11,
  ["w-ny"] = 11,
  ["u-m"] = 11,
  ["ul-nd"] = 11,
  ["ur-nd"] = 11,
  ["uw-mb"] = 11,
  ["u"] = 11,
  ["1"] = 1, ["I"] = 1,
  ["2"] = 2, ["II"] = 2,
  ["3"] = 3, ["III"] = 3,
  ["4"] = 4, ["IV"] = 4,
  ["5"] = 5, ["V"] = 5,
  ["6"] = 6, ["VI"] = 6,
  ["7"] = 7, ["VII"] = 7,
  ["8"] = 8, ["VIII"] = 8,
  ["9"] = 9, ["IX"] = 9,
  ["10"] = 10, ["X"] = 10,
  ["11"] = 11, ["XI"] = 11,
}

--- Show an error message as a table.
--- @param message string The message to display. May be nil.
--- @param nocat boolean If true, do not categorize the page.
--- @return string The generated table.
local function errorMessage(message, nocat)
  local text = '{| class="flextable"\n' ..
      '|+ <span style="color: red; font-weight: bold">Erreur&nbsp;!</span>\n' ..
      "|-\n" ..
      '! scope="col" | Singulier\n' ..
      '! scope="col" | Pluriel\n' ..
      "|-\n" ..
      '| scope="row" colspan="2" | <span style="color: red">' .. (message or "erreur inconnue") .. "</span>\n" ..
      "|}"
  local namespaceId = mw.title.getCurrentTitle().namespace
  if namespaceId ~= 2 and not nocat then
    -- Cf. [[Aide:Espace de noms]]
    text = text .. "[[Catégorie:Appels de modèles incorrects:sw-nom]]"
  end
  return text
end

--- Generate the table for the given noun.
--- @param singularForm string The singular form of the noun.
--- @param pluralForms table<number, string> The plural forms of the noun.
--- @param numberMode number The whether to show only the singular, only the plural, both, or they’re the same.
--- @return string The generated table.
local function generateNounTable(singularForm, pluralForms, numberMode)
  local showSing = bit32.band(numberMode, SINGULAR) ~= 0
  local showPlur = bit32.band(numberMode, PLURAL) ~= 0
  local isSame = bit32.band(numberMode, SAME) ~= 0

  if not showSing and not showPlur and not isSame then
    error("Invalid 'numberMode' value: " .. tostring(numberMode))
  end
  if isSame and showSing or isSame and showPlur then
    error("Invalid 'numberMode' value: " .. tostring(numberMode))
  end

  local code = '{| class="flextable"\n|-'
  if isSame then
    code = code .. "\n! Singulier et pluriel"
  end
  if showSing then
    code = code .. "\n! Singulier"
  end
  if showPlur then
    code = code .. "\n! Pluriel"
  end
  code = code .. "\n|-"
  if showSing or isSame then
    local span = 1
    if #pluralForms > span then
      span = #pluralForms
    end
    code = code .. mw.ustring.format('\n| rowspan="%s" |', span)
        .. m_bases.lien_modele(singularForm, "sw", nil, nil, true)
  end
  if showPlur then
    for _, plural in ipairs(pluralForms) do
      code = code .. "\n|" .. m_bases.lien_modele(plural, "sw", nil, nil, true) .. "\n|-"
    end
  end
  return code .. "\n|}"
end

--- Generate the plural of the given word.
--- @param singular string The singular form of the word.
--- @param classCode number The class number of the word.
--- @return string The word’s plural.
--- @error If the given class is not supported.
local function generatePlural(singular, classCode)
  if classCode == 5 then
    return "ma" .. singular
  elseif classCode == 9 then
    return singular
  end
  error(mw.ustring.format("La classe %s n'est pas encore implémenté", classCode))
end

--- Generate the table for the given noun.
--- @param frame frame
--- Parameters:
---  parent.args[1] (int): The word’s class.
---  parent.args["s"] (string, optional): The word’s singular form. Defaults to the page’s title.
---  parent.args["mode"] (string, optional): Either "sing" for singular only, or "plur" for plural only.
---  parent.args["p"] (string, optional): The word’s plural form if the generated one is not correct.
---  parent.args["p2"] (string, optional): The word’s second plural form.
---  parent.args["p3"] (string, optional): The word’s third plural form.
--- @return string The generated table.
function p.generateNounTable(frame)
  local spec = {
    [1] = { required = true },
    ["s"] = { default = mw.title.getCurrentTitle().text },
    ["mode"] = { enum = { "sing", "plur" } },
  }
  local pluralArgNames = { "p", "p2", "p3" }
  for _, argName in ipairs(pluralArgNames) do
    spec[argName] = {}
  end

  local args, validArgs = m_params.process(frame:getParent().args, spec, true) -- Silent errors

  if not validArgs then
    if args[1] == "1" and (args[2] == m_params.EMPTY_PARAM or args[2] == m_params.MISSING_PARAM) then
      return errorMessage("Veuillez préciser la classe nominale.<br>Voir {{[[Modèle:sw-nom|sw-nom]]}}.")
    end
    return errorMessage(mw.ustring.format(
        "Paramètre «&nbsp;%s&nbsp;» incorrect&nbsp;: %s",
        args[1],
        args[3]
    ))
  end

  local classCode = CLASS_CODES[args[1]]
  if not classCode then
    return errorMessage(mw.ustring.format(
        "La classe nominale «&nbsp;%s&nbsp;» est inconnue.<br>Voir {{[[Modèle:sw-nom|sw-nom]]}}.",
        args[1]
    ))
  end

  local sing = args["s"]

  local pluralForms = {}
  for _, argName in ipairs(pluralArgNames) do
    if args[argName] then
      table.insert(pluralForms, args[argName])
    end
  end
  if #pluralForms == 0 then
    pluralForms[1] = generatePlural(sing, classCode)
  end

  local numberMode
  if args["mode"] == "sing" then
    numberMode = SINGULAR
  elseif args["mode"] == "plur" then
    numberMode = PLURAL
  elseif #pluralForms == 1 and pluralForms[1] == sing then
    numberMode = SAME
  else
    numberMode = bit32.bor(SINGULAR, PLURAL)
  end

  return generateNounTable(sing, pluralForms, numberMode)
end

return p
