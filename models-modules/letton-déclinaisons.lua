local m_params = require("Module:paramètres")
local m_bases = require("Module:bases")
local m_table = require("Module:table")
local bit32 = require("bit32")

local DECLENSIONS = mw.loadData("Module:letton-déclinaisons/data")
local SINGULAR = 1
local PLURAL = 2

local NO_DECL_ERROR = "no_declension_for_key"
local USELESS_PARAM_ERROR = "useless_param"

local p = {}

--- Mutate the given root.
--- @param root string The root to modify.
--- @param modify boolean If true, the `modifierLetter` will replace the letter before the suffix, otherwise it will be inserted after it.
--- @param palatal string|nil The palatal letter that will modify the one preceding the suffix. Leave `nil` to keep it.
--- @return string The mutated root.
local function mutate(root, modify, palatal)
  if modify then
    return mw.ustring.sub(root, 1, -2) .. palatal
  end
  return root .. palatal
end

local DECl_TITLES = {
  "Première", "Deuxième", "Troisième", "Quatrième", "Cinquième", "Sixième"
}
local CASE_NAMES = {
  n = "Nominatif",
  a = "Accusatif",
  g = "Génitif",
  d = "Datif",
  i = "Instrumental",
  l = "Locatif",
  v = "Vocatif",
}
local DISPLAY_ORDER = { "n", "a", "g", "d", "i", "l", "v" }

--- Generate the wikicode for the given noun forms.
--- @param forms table The noun forms.
--- @param declension number The declension number (1-6).
--- @param numberMode number A number indicating whether to show the singular only, plural only, or both.
--- @return string The generated wikicode.
local function generateNounTable(forms, declension, numberMode)
  local showSing = bit32.band(numberMode, SINGULAR) ~= 0
  local showPlur = bit32.band(numberMode, PLURAL) ~= 0
  if not showSing and not showPlur then
    error("Invalid 'numberMode' value: " .. tostring(numberMode))
  end

  local code = mw.ustring.format('{| class="flextable"\n|+ %s déclinaison\n|-\n|', DECl_TITLES[declension])
  if showSing then
    code = code .. "\n| Singulier"
  end
  if showPlur then
    code = code .. "\n| Pluriel"
  end
  for _, case in ipairs(DISPLAY_ORDER) do
    local flexions = forms[case]
    code = code .. mw.ustring.format("\n|-\n! %s", CASE_NAMES[case])
    if showSing then
      code = code .. "\n|" .. m_bases.lien_modele(flexions[1], "lv", nil, nil, true)
    end
    if showPlur then
      code = code .. "\n|" .. m_bases.lien_modele(flexions[2], "lv", nil, nil, true)
    end
  end
  code = code .. "\n|}"
  return code
end

--- Generate all forms for the given noun.
--- @param word string The nominative singular form of the noun.
--- @param declension number The declension number (1-6).
--- @param modify boolean If true, the `modifierLetter` will replace the letter before the suffix, otherwise it will be inserted after it.
--- @param palatal string|nil The palatal letter that will modify the one preceding the suffix. Leave `nil` to keep it.
--- @param vocativeDropsEnding boolean Whether to drop the last letter of the vocative for the 1st, 5th, and 6th declensions.
--- @return table A table containing all forms of the word.
local function generateNounForms(word, declension, modify, palatal, vocativeDropsEnding)
  local key = tostring(declension)
  if declension == 2 or declension == 3 then
    key = key .. "-" .. mw.ustring.sub(word, -2)
  else
    key = key .. "-" .. mw.ustring.sub(word, -1)
  end
  local decl = DECLENSIONS[key]
  if not decl then
    error({ message = NO_DECL_ERROR, key = key })
  end
  if modify and not palatal then
    error({ message = USELESS_PARAM_ERROR, param = "remplacer" })
  end
  if vocativeDropsEnding and not decl.vsMayDropEnding then
    error({ message = USELESS_PARAM_ERROR, param = "vs-complet" })
  end

  local root = mw.ustring.sub(word, 1, -mw.ustring.len(decl.endings.n[1]) - 1)
  local forms = {}
  local anyPalatal = false
  for case, endings in pairs(decl.endings) do
    local sing = root .. endings[1]
    local plur = root .. endings[2]

    if palatal and endings.palatal and m_table.length(endings.palatal) ~= 0 then
      local mutatedRoot = mutate(root, modify, palatal)
      if m_table.contains(endings.palatal, 1) then
        sing = mutatedRoot .. endings[1]
        anyPalatal = true
      end
      if m_table.contains(endings.palatal, 2) then
        plur = mutatedRoot .. endings[2]
        anyPalatal = true
      end
    end

    if case == "v" and vocativeDropsEnding and decl.vsMayDropEnding then
      sing = root
    end

    -- Special case for "suns" for the genitive singular
    if word == "suns" and declension == 2 and case == "g" then
      sing = "suņa"
    end

    forms[case] = { sing, plur }
  end

  if palatal and not anyPalatal then
    error({ message = USELESS_PARAM_ERROR, param = "palatale" })
  end

  return forms
end

local function errorMessage(message)
  return mw.ustring.format("<span style='color: red'>%s</span>[[Catégorie:Appels de modèles incorrects:lv-nom]]", message)
end

function p.generateNounTable(frame)
  local args, validArgs = m_params.process(frame:getParent().args, {
    [1] = {},
    ["décl"] = { required = true, type = m_params.INT, checker = function(decl)
      return decl >= 1 and decl <= 6
    end },
    ["vs-complet"] = { type = m_params.BOOLEAN, default = false },
    ["palatale"] = {},
    ["remplacer"] = { type = m_params.BOOLEAN, default = false },
    ["mode"] = { enum = { "sing", "plur" }, default = nil }
  }, true) -- Silent errors

  if not validArgs then
    return errorMessage(mw.ustring.format(
        "Paramètre « %s » incorrect : %s",
        tostring(args[1]),
        args[3]
    ))
  end

  local word = args[1] or mw.title.getCurrentTitle().text
  local declension = args["décl"]
  local vocativeDropsEnding = not args["vs-complet"]
  local palatal = args["palatale"]
  local modify = args["remplacer"]
  local numberMode
  if args["mode"] == "sing" then
    numberMode = SINGULAR
  elseif args["mode"] == "plur" then
    numberMode = PLURAL
  else
    numberMode = bit32.bor(SINGULAR, PLURAL)
  end

  local success, data = pcall(function()
    local forms = generateNounForms(word, declension, modify, palatal, vocativeDropsEnding)
    return generateNounTable(forms, declension, numberMode)
  end)
  if not success then
    if data.message == NO_DECL_ERROR then
      return errorMessage("Déclinaison incorrecte : " .. tostring(declension))
    elseif data.message == USELESS_PARAM_ERROR then
      return errorMessage(mw.ustring.format("Paramètre « %s » superflu, veuillez le retirer.", data.param))
    end
    return errorMessage("Une erreur est survenue : " .. tostring(data))
  end
  return data
end

return p
