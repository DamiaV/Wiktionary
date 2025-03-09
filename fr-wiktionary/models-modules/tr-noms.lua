local m_params = require("Module:paramètres")
local m_bases = require("Module:bases")

local p = {}

local vowels = {
  ["a"] = { high = "ı", low = "a" },
  ["â"] = { high = "ı", low = "a" },
  ["e"] = { high = "i", low = "e" },
  ["ı"] = { high = "ı", low = "a" },
  ["i"] = { high = "i", low = "e" },
  ["î"] = { high = "i", low = "e" },
  ["o"] = { high = "u", low = "a" },
  ["ö"] = { high = "ü", low = "e" },
  ["u"] = { high = "u", low = "a" },
  ["û"] = { high = "u", low = "a" },
  ["ü"] = { high = "ü", low = "e" },
}


-- Inflection functions

function p.vowel(frame)
  local params = {
    [1] = { required = true, default = "u" },
    ["n"] = {},
    ["poss"] = { type = m_params.BOOLEAN },
    ["pred"] = { type = m_params.BOOLEAN },
    ["json"] = { type = m_params.BOOLEAN },
  }

  local args = m_params.process(frame:getParent().args, params)
  local data = { forms = {}, info = "Flexions", categories = {} }
  local stem = mw.title.getCurrentTitle().text
  local vowel = vowels[args[1]]
  local plvowel = vowels[vowel.low]

  local plstem
  if args["n"] == "p" then
    plstem = stem
  else
    plstem = stem .. "l" .. vowel.low .. "r"
  end

  data.forms["nom|s"] = { stem }
  data.forms["def|acc|s"] = { stem .. "y" .. vowel.high }
  data.forms["dat|s"] = { stem .. "y" .. vowel.low }
  data.forms["loc|s"] = { stem .. "d" .. vowel.low }
  data.forms["abl|s"] = { stem .. "d" .. vowel.low .. "n" }
  data.forms["gen|s"] = { stem .. "n" .. vowel.high .. "n" }

  data.forms["nom|p"] = { plstem }
  data.forms["def|acc|p"] = { plstem .. plvowel.high }
  data.forms["dat|p"] = { plstem .. plvowel.low }
  data.forms["loc|p"] = { plstem .. "d" .. plvowel.low }
  data.forms["abl|p"] = { plstem .. "d" .. plvowel.low .. "n" }
  data.forms["gen|p"] = { plstem .. plvowel.high .. "n" }

  if args["poss"] then
    data.forms["1|s|spos|poss"] = { stem .. "m" }
    data.forms["2|s|spos|poss"] = { stem .. "n" }
    data.forms["3|s|spos|poss"] = { stem .. "s" .. vowel.high }
    data.forms["1|p|spos|poss"] = { stem .. "m" .. vowel.high .. "z" }
    data.forms["2|p|spos|poss"] = { stem .. "n" .. vowel.high .. "z" }
    data.forms["3|p|spos|poss"] = { plstem .. plvowel.high }

    data.forms["1|s|mpos|poss"] = { plstem .. plvowel.high .. "m" }
    data.forms["2|s|mpos|poss"] = { plstem .. plvowel.high .. "n" }
    data.forms["3|s|mpos|poss"] = { plstem .. plvowel.high }
    data.forms["1|p|mpos|poss"] = { plstem .. plvowel.high .. "m" .. plvowel.high .. "z" }
    data.forms["2|p|mpos|poss"] = { plstem .. plvowel.high .. "n" .. plvowel.high .. "z" }
    data.forms["3|p|mpos|poss"] = { plstem .. plvowel.high }
  end

  if args["pred"] then
    data.forms["1|s|pred|of the|s"] = { stem .. "y" .. vowel.high .. "m" }
    data.forms["2|s|pred|of the|s"] = { stem .. "s" .. vowel.high .. "n" }
    data.forms["3|s|pred|of the|s"] = { stem, stem .. "d" .. vowel.high .. "r" }
    data.forms["1|p|pred|of the|s"] = { stem .. "y" .. vowel.high .. "z" }
    data.forms["2|p|pred|of the|s"] = { stem .. "s" .. vowel.high .. "n" .. vowel.high .. "z" }
    data.forms["3|p|pred|of the|s"] = { plstem }

    data.forms["1|s|pred|of the|p"] = { plstem .. plvowel.high .. "m" }
    data.forms["2|s|pred|of the|p"] = { plstem .. "s" .. plvowel.high .. "n" }
    data.forms["3|s|pred|of the|p"] = { plstem, plstem .. "d" .. plvowel.high .. "r" }
    data.forms["1|p|pred|of the|p"] = { plstem .. plvowel.high .. "z" }
    data.forms["2|p|pred|of the|p"] = { plstem .. "s" .. plvowel.high .. "n" .. plvowel.high .. "z" }
    data.forms["3|p|pred|of the|p"] = { plstem .. "d" .. plvowel.high .. "r" }
  end

  postprocess(args, data)

  if args["json"] then
    return mw.text.jsonEncode(data)
  end

  return make_table(data)
end

function p.cons(frame)
  local params = {
    [1] = { required = true, default = "u" },
    ["n"] = {},
    ["poss"] = { type = m_params.BOOLEAN },
    ["pred"] = { type = m_params.BOOLEAN },
    ["stem"] = {},
    ["json"] = { type = m_params.BOOLEAN },
  }

  local args = m_params.process(frame:getParent().args, params)
  local data = { forms = {}, info = "Flexions", categories = {} }

  local stem = mw.title.getCurrentTitle().text
  local stem2 = args["stem"] or stem
  local vowel = vowels[args[1]]
  local plvowel = vowels[vowel.low]
  local plstem
  if args["n"] == "p" then
    plstem = stem
  else
    plstem = stem .. "l" .. vowel.low .. "r"
  end

  local dt = "d"

  if mw.ustring.find(stem, "[çfhkptsş]$") then
    dt = "t"
  end

  data.forms["nom|s"] = { stem }
  data.forms["def|acc|s"] = { stem2 .. vowel.high }
  data.forms["dat|s"] = { stem2 .. vowel.low }
  data.forms["loc|s"] = { stem .. dt .. vowel.low }
  data.forms["abl|s"] = { stem .. dt .. vowel.low .. "n" }
  data.forms["gen|s"] = { stem2 .. vowel.high .. "n" }

  data.forms["nom|p"] = { plstem }
  data.forms["def|acc|p"] = { plstem .. plvowel.high }
  data.forms["dat|p"] = { plstem .. plvowel.low }
  data.forms["loc|p"] = { plstem .. "d" .. plvowel.low }
  data.forms["abl|p"] = { plstem .. "d" .. plvowel.low .. "n" }
  data.forms["gen|p"] = { plstem .. plvowel.high .. "n" }

  if args["poss"] then
    data.forms["1|s|spos|poss"] = { stem2 .. vowel.high .. "m" }
    data.forms["2|s|spos|poss"] = { stem2 .. vowel.high .. "n" }
    data.forms["3|s|spos|poss"] = { stem2 .. vowel.high }
    data.forms["1|p|spos|poss"] = { stem2 .. vowel.high .. "m" .. vowel.high .. "z" }
    data.forms["2|p|spos|poss"] = { stem2 .. vowel.high .. "n" .. vowel.high .. "z" }
    data.forms["3|p|spos|poss"] = { plstem .. plvowel.high }

    data.forms["1|s|mpos|poss"] = { plstem .. plvowel.high .. "m" }
    data.forms["2|s|mpos|poss"] = { plstem .. plvowel.high .. "n" }
    data.forms["3|s|mpos|poss"] = { plstem .. plvowel.high }
    data.forms["1|p|mpos|poss"] = { plstem .. plvowel.high .. "m" .. plvowel.high .. "z" }
    data.forms["2|p|mpos|poss"] = { plstem .. plvowel.high .. "n" .. plvowel.high .. "z" }
    data.forms["3|p|mpos|poss"] = { plstem .. plvowel.high }
  end

  if args["pred"] then
    data.forms["1|s|pred|of the|s"] = { stem2 .. vowel.high .. "m" }
    data.forms["2|s|pred|of the|s"] = { stem .. "s" .. vowel.high .. "n" }
    data.forms["3|s|pred|of the|s"] = { stem, stem .. dt .. vowel.high .. "r" }
    data.forms["1|p|pred|of the|s"] = { stem2 .. vowel.high .. "z" }
    data.forms["2|p|pred|of the|s"] = { stem .. "s" .. vowel.high .. "n" .. vowel.high .. "z" }
    data.forms["3|p|pred|of the|s"] = { plstem }

    data.forms["1|s|pred|of the|p"] = { plstem .. plvowel.high .. "m" }
    data.forms["2|s|pred|of the|p"] = { plstem .. "s" .. plvowel.high .. "n" }
    data.forms["3|s|pred|of the|p"] = { plstem, plstem .. "d" .. plvowel.high .. "r" }
    data.forms["1|p|pred|of the|p"] = { plstem .. plvowel.high .. "z" }
    data.forms["2|p|pred|of the|p"] = { plstem .. "s" .. plvowel.high .. "n" .. plvowel.high .. "z" }
    data.forms["3|p|pred|of the|p"] = { plstem .. "d" .. plvowel.high .. "r" }
  end

  postprocess(args, data)

  if args["json"] then
    return mw.text.jsonEncode(data)
  end

  return make_table(data)
end

function postprocess(args, data)
  data.hasPoss = args["poss"]
  data.hasPred = args["pred"]
  data.n = args["n"]

  if args["n"] == "p" then
    table.insert(data.categories, "Turkish pluralia tantum")
  elseif args["n"] == "s" then
    table.insert(data.categories, "Turkish uncountable nouns")
  elseif args["n"] then
    error('args= doit valoir "s" ou "p".')
  end

  for key, form in pairs(data.forms) do
    -- Do not show singular or plural forms for nominals that don't have them
    if (args["n"] == "p" and key:find("|s$")) or (args["n"] == "s" and key:find("|p$")) then
      form = nil
    end

    data.forms[key] = form
  end

  data.lemma = (data.forms["nom|" .. (data.n or "s")])[1]

  -- Check if the lemma form matches the page name
  if data.lemma ~= mw.title.getCurrentTitle().text then
    table.insert(data.categories, "Turkish entries with inflection not matching pagename")
  end
end


-- Make the table
function make_table(data)
  local function repl(param)
    local accel = true
    local no_store = false

    if param == "info" then
      return mw.getContentLanguage():ucfirst(data.info or "")
    elseif string.sub(param, 1, 1) == "!" then
      no_store = true
      param = string.sub(param, 2)
    elseif string.sub(param, 1, 1) == "#" then
      accel = false
      param = string.sub(param, 2)
    end

    local forms = data.forms[param]

    if not forms then
      return "&mdash;"
    end

    local ret = {}

    for _, subform in ipairs(forms) do
      table.insert(ret, mw.ustring.format("[[%s#tr|%s]]", subform, subform))
    end

    return table.concat(ret, "<br/>")
  end

  local wikicode = {}
  table.insert(wikicode, [=[
{| class="inflection-table vsSwitcher" data-toggle-category="inflection" style="text-align: left; background: #F9F9F9; border: 1px solid #AAAAAA;"
|- style="background: #DEDEDE; text-align: left;"
! class="vsToggleElement" colspan="3" | {{{info}}}
|- class="vsShow"
! style="background: #EFEFEF; width: 12em;" | Nominative
| colspan="2" style="width: 10em;" | {{{nom|]=] .. (data.n or "s") .. [=[}}}
|- class="vsShow"
! style="background: #EFEFEF;" | Definite accusative
| colspan="2" | {{{def|acc|]=] .. (data.n or "s") .. [=[}}}
|- class="vsHide" style="background: #DEDEDE;"
! style="width: 12em;" |
! style="width: 10em;" | Singular
! style="width: 10em;" | Plural
|- class="vsHide"
! style="background: #EFEFEF;" | Nominative
| {{{nom|s}}}
| {{{nom|p}}}
|- class="vsHide"
! style="background: #EFEFEF;" | Definite accusative
| {{{def|acc|s}}}
| {{{def|acc|p}}}
|- class="vsHide"
! style="background: #EFEFEF;" | Dative
| {{{dat|s}}}
| {{{dat|p}}}
|- class="vsHide"
! style="background: #EFEFEF;" | Locative
| {{{loc|s}}}
| {{{loc|p}}}
|- class="vsHide"
! style="background: #EFEFEF;" | Ablative
| {{{abl|s}}}
| {{{abl|p}}}
|- class="vsHide"
! style="background: #EFEFEF;" | Genitive
| {{{gen|s}}}
| {{{gen|p}}}]=])

  -- Possessive forms
  if data.hasPoss then
    table.insert(wikicode, [=[

|- class="vsHide"
| colspan="3" style="padding: 0;" |
{| class="inflection-table vsSwitcher" style="text-align: left; width: 100%;"
|- style="background: #EFEFEF; text-align: left;"
! class="vsToggleElement" colspan="3" | Possessive forms
|- class="vsHide" style="background: #DEDEDE;"
! style="width: 12em;" |
! style="width: 10em;" | Singular
! style="width: 10em;" | Plural
|- class="vsHide"
! style="background: #EFEFEF;" | 1st singular
| {{{1|s|spos|poss}}}
| {{{1|s|mpos|poss}}}
|- class="vsHide"
! style="background: #EFEFEF;" | 2nd singular
| {{{2|s|spos|poss}}}
| {{{2|s|mpos|poss}}}
|- class="vsHide"
! style="background: #EFEFEF;" | 3rd singular
| {{{3|s|spos|poss}}}
| {{{3|s|mpos|poss}}}
|- class="vsHide"
! style="background: #EFEFEF;" | 1st plural
| {{{1|p|spos|poss}}}
| {{{1|p|mpos|poss}}}
|- class="vsHide"
! style="background: #EFEFEF;" | 2nd plural
| {{{2|p|spos|poss}}}
| {{{2|p|mpos|poss}}}
|- class="vsHide"
! style="background: #EFEFEF;" | 3rd plural
| {{{3|p|spos|poss}}}
| {{{3|p|mpos|poss}}}
|}]=])
  end

  -- Predicative forms
  if data.hasPred then
    table.insert(wikicode, [=[

|- class="vsHide"
| colspan="3" style="padding: 0;" |
{| class="inflection-table vsSwitcher" style="text-align: left; width: 100%;"
|- style="background: #EFEFEF; text-align: left;"
! class="vsToggleElement" colspan="3" | Predicative forms
|- class="vsHide" style="background: #DEDEDE;"
! style="width: 12em;" |
! style="width: 10em;" | Singular
! style="width: 10em;" | Plural
|- class="vsHide"
! style="background: #EFEFEF;" | 1st singular
| {{{1|s|pred|of the|s}}}
| {{{1|s|pred|of the|p}}}
|- class="vsHide"
! style="background: #EFEFEF;" | 2nd singular
| {{{2|s|pred|of the|s}}}
| {{{2|s|pred|of the|p}}}
|- class="vsHide"
! style="background: #EFEFEF;" | 3rd singular
| {{{3|s|pred|of the|s}}}
| {{{3|s|pred|of the|p}}}
|- class="vsHide"
! style="background: #EFEFEF;" | 1st plural
| {{{1|p|pred|of the|s}}}
| {{{1|p|pred|of the|p}}}
|- class="vsHide"
! style="background: #EFEFEF;" | 2nd plural
| {{{2|p|pred|of the|s}}}
| {{{2|p|pred|of the|p}}}
|- class="vsHide"
! style="background: #EFEFEF;" | 3rd plural
| {{{3|p|pred|of the|s}}}
| {{{3|p|pred|of the|p}}}
|}]=])
  end

  table.insert(wikicode, "\n|}")

  local text = mw.ustring.gsub(table.concat(wikicode), "{{{([#!]?[a-z0-9| ]+)}}}", repl)
  for _, cat in ipairs(data.categories) do
    text = text .. m_bases.fait_categorie_contenu(cat)
  end

  return text
end

return p
