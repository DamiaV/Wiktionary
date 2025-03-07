local m_bases = require("Module:bases")
local m_params = require("Module:paramètres")
local m_table = require("Module:table")
local m_model = require("Module:conjugaisons/data-model")
local m_gen = require("Module:conjugaisons/tense-generators")

local p = {}

local GRAY_STYLE = "color: gray; font-style: italic"

--- Generate a wikicode link with a #fr anchor for the given page title.
--- @param title string The title of the page to link to.
--- @return string The link.
local function link(title)
  return mw.ustring.format("[[%s#fr|%s]]", title, title)
end

--- Create an HTML table element with a width of 100%, center-aligned text and collapsed borders.
--- @return html The table element.
local function createTable()
  return mw.html.create("table")
           :attr("style", "width: 100%; text-align: center; border-collapse: collapse")
end

--- Format a title.
--- @param base string The base title.
--- @param tenseOrMode VerbTense|VerbMode The verb tense/mode this title represents.
--- @return string The formatted header.
local function formatTitle(base, tenseOrMode)
  local state = tenseOrMode:getStatus()
  if state then
    local text
    if state == m_model.DISABLED then
      text = "défectif"
    elseif state == m_model.RARE then
      text = "rare"
    elseif state == m_model.UNATTESTED then
      text = "inattesté"
    else
      error("État invalide : " .. tostring(state))
    end
    return base .. mw.ustring.format(" (%s)", text)
  end
  return base
end

--- Add an HTML TR tag to the given header.
--- @param headerRow html The parent tag.
--- @param tense VerbTense The tense this header represents.
--- @param title string The header’s title.
--- @param color string The header’s background color.
--- @param width number The header’s width in %.
--- @param colspan number Optional. The header’s "colspan", defaults to 2.
local function createTenseTableHeader(headerRow, tense, title, color, width, colspan)
  local style = mw.ustring.format("width: %d%%; background-color: %s;", width, color)
  if tense:isGray() then
    style = style .. GRAY_STYLE
  end
  local element = headerRow
      :tag("th")
      :attr("scope", colspan > 2 and "colgroup" or "col")
      :attr("style", style)
      :wikitext(formatTitle(title, tense))
  if colspan > 1 then
    element = element:attr("colspan", tostring(colspan))
  end
  return element
end

--- Format the given verb form.
--- @param verbForm VerbForm The verb form to format.
--- @param asLink boolean Whether to wrap the verb form inside a link.
--- @return string The formatted verb form.
local function formatVerbForm(verbForm, asLink)
  local form = verbForm:getForm()
  if not form then
    return "—"
  end
  return asLink and link(form) or form
end

--- Generate the table for all impersonal tenses for the given verb.
--- @param verb Verb A Verb object.
--- @return string The generated table.
local function generateImpersonalTable(verb)
  local tableElement = createTable()

  local headerRow = tableElement:tag("tr")
  headerRow:tag("th")
           :attr("scope", "col")
           :attr("style", "width: 8%; background-color: #ffddaa")
           :wikitext("[[mode#fr|Mode]]")
  headerRow:tag("th")
           :attr("colspan", "2")
           :attr("scope", "colgroup")
           :attr("style", "width: 46%; background-color: #ffeebb")
           :wikitext("[[présent#fr|Présent]]")
  headerRow:tag("th")
           :attr("colspan", "2")
           :attr("scope", "colgroup")
           :attr("style", "width: 46%; background-color: #ffeebb")
           :wikitext("[[passé#fr|Passé]]")

  local infinitifPresent = verb.modes["infinitif"].tenses["present"].forms[1]
  local infinitifPasse = verb.modes["infinitif"].tenses["passe"].forms[1]
  local gerondifPresent = verb.modes["gerondif"].tenses["present"].forms[1]
  local gerondifPasse = verb.modes["gerondif"].tenses["passe"].forms[1]
  local participePresent = verb.modes["participe"].tenses["present"].forms[1]
  local participePasse = verb.modes["participe"].tenses["passe"].forms[1]

  local infinitiveRow = tableElement:tag("tr")
  infinitiveRow:tag("th")
               :attr("scope", "row")
               :wikitext("[[infinitif#fr|Infinitif]]")
  infinitiveRow:tag("td")
               :attr("style", "width: 23%; text-align: right; padding-right: 0")
               :wikitext(infinitifPresent:getPronoun() or "")
  infinitiveRow:tag("td")
               :attr("style", "width: 23%; text-align: left; padding-left: 0")
               :wikitext(formatVerbForm(infinitifPresent, true))
  infinitiveRow:tag("td")
               :attr("style", "width: 23%; text-align: right; padding-right: 0;" .. (infinitifPasse:isGray() and GRAY_STYLE or ""))
               :wikitext(infinitifPasse:getPronoun() or "")
  infinitiveRow:tag("td")
               :attr("style", "width: 23%; text-align: left; padding-left: 0;" .. (infinitifPasse:isGray() and GRAY_STYLE or ""))
               :wikitext(formatVerbForm(infinitifPasse))

  local gerundRow = tableElement:tag("tr")
  gerundRow:tag("th")
           :attr("scope", "row")
           :wikitext("[[gérondif#fr|Gérondif]]")
  gerundRow:tag("td")
           :attr("style", "text-align: right; padding-right: 0;" .. (gerondifPresent:isGray() and GRAY_STYLE or ""))
           :wikitext(gerondifPresent:getPronoun() or "")
  gerundRow:tag("td")
           :attr("style", "text-align: left; padding-left: 0;" .. (gerondifPresent:isGray() and GRAY_STYLE or ""))
           :wikitext(formatVerbForm(gerondifPresent))
  gerundRow:tag("td")
           :attr("style", "text-align: right; padding-right: 0;" .. (gerondifPasse:isGray() and GRAY_STYLE or ""))
           :wikitext(gerondifPasse:getPronoun() or "")
  gerundRow:tag("td")
           :attr("style", "text-align: left; padding-left: 0;" .. (gerondifPasse:isGray() and GRAY_STYLE or ""))
           :wikitext(formatVerbForm(gerondifPasse))

  local participleRow = tableElement:tag("tr")
  participleRow:tag("th")
               :attr("scope", "row")
               :wikitext("[[participe#fr|Participe]]")
  participleRow:tag("td")
  participleRow:tag("td")
               :attr("style", "text-align: left;" .. (participePresent:isGray() and GRAY_STYLE or ""))
               :wikitext(formatVerbForm(participePresent, true))
  participleRow:tag("td")
  participleRow:tag("td")
               :attr("style", "text-align: left;" .. (participePasse:isGray() and GRAY_STYLE or ""))
               :wikitext(formatVerbForm(participePasse, true))

  return tostring(tableElement)
end

--- Create a table row for a single person of simple and compound tenses.
--- @param tableElement html The table to add the row to.
--- @param simpleTense VerbTense The simple tense.
--- @param compoundTense VerbTense The compound tense.
--- @param colsNb number The number of columns for each tense.
--- @param formIndex number The index of verb form to add.
local function createRow(tableElement, simpleTense, compoundTense, colsNb, formIndex)
  local row = tableElement:tag("tr")

  local simpleForm = simpleTense.forms[formIndex]
  local compoundForm = compoundTense.forms[formIndex]
  local simpleStyle = simpleForm:isGray() and GRAY_STYLE or ""
  local compoundStyle = compoundForm:isGray() and GRAY_STYLE or ""

  local formattedSimpleForm = simpleTense:getStatus() == m_model.DISABLED and formIndex > 1 and "" or formatVerbForm(simpleForm, true)
  local formattedCompoundForm = compoundTense:getStatus() == m_model.DISABLED and formIndex > 1 and "" or formatVerbForm(compoundForm)

  if colsNb == 2 then
    local simplePronoun = simpleForm:getPronoun() or ""
    local compoundPronoun = compoundForm:getPronoun() or ""
    local reversedPronouns = simpleTense.mode.reversedPronouns

    row:tag("td")
       :attr("style", "width: 25%; text-align: right; padding-right: 0;" .. simpleStyle)
       :wikitext(reversedPronouns and formattedSimpleForm or simplePronoun)
    row:tag("td")
       :attr("style", "width: 25%; text-align: left; padding-left: 0;" .. simpleStyle)
       :wikitext(reversedPronouns and simplePronoun or formattedSimpleForm)

    row:tag("td")
       :attr("style", "width: 25%; text-align: right; padding-right: 0;" .. compoundStyle)
       :wikitext(reversedPronouns and formattedCompoundForm or compoundPronoun)
    row:tag("td")
       :attr("style", "width: 25%; text-align: left; padding-left: 0;" .. compoundStyle)
       :wikitext(reversedPronouns and compoundPronoun or formattedCompoundForm)
  else
    row:tag("td")
       :attr("style", simpleStyle)
       :wikitext(formattedSimpleForm)
    row:tag("td")
       :attr("style", compoundStyle)
       :wikitext(formattedCompoundForm)
  end
end

--- Generate the rows for the given simple tense and its corresponding compound tense.
--- @param tableElement html The table element to add the generated rows to.
--- @param verb Verb An array containing the flexions of the verb.
--- @param mode string The key of the mode.
--- @param simpleTenseName string The key of the simple tense.
--- @param title1 string Title for the simple tense.
--- @param compoundTenseName string The key of the compound tense.
--- @param title2 string Title for the compound tense.
local function generateTensesRows(tableElement, verb, mode, simpleTenseName, title1, color1, compoundTenseName, title2, color2)
  local headerRow = tableElement:tag("tr")

  local simpleTense = verb.modes[mode].tenses[simpleTenseName]
  local compoundTense = verb.modes[mode].tenses[compoundTenseName]

  local reversedPronouns = simpleTense.mode.reversedPronouns
  local colsNb = reversedPronouns and not verb.spec.pronominal and 1 or 2

  createTenseTableHeader(headerRow, simpleTense, title1, color1, 50, colsNb)
  createTenseTableHeader(headerRow, compoundTense, title2, color2, 50, colsNb)

  local simpleDef = simpleTense:getStatus() == m_model.DISABLED
  local compoundDef = compoundTense:getStatus() == m_model.DISABLED

  for i = 1, (simpleDef and compoundDef and 1 or #simpleTense.forms) do
    local impersonal = verb.spec.impersonal
    if impersonal and #simpleTense.forms == 6 then
      local j = m_model.STRUCT[mode].tenses[simpleTenseName][i]
      if j == 3 or impersonal == m_model.IMPERS and j == 6 then
        createRow(tableElement, simpleTense, compoundTense, colsNb, i)
      end
    else
      createRow(tableElement, simpleTense, compoundTense, colsNb, i)
    end
  end
end

--- Generate the table for the indicative tenses of the given verb.
--- @param verb Verb A Verb object.
--- @return string The generated table.
local function generateIndicativeTable(verb)
  local tableElement = createTable()
  generateTensesRows(tableElement, verb, "indicatif", "present", "Présent", "#ddd", "passeCompose", "Passé composé", "#ececff")
  generateTensesRows(tableElement, verb, "indicatif", "imparfait", "Imparfait", "#ddd", "plusQueParfait", "Plus-que-parfait", "#ececff")
  generateTensesRows(tableElement, verb, "indicatif", "passeSimple", "Passé simple", "#ddd", "passeAnterieur", "Passé antérieur", "#ececff")
  generateTensesRows(tableElement, verb, "indicatif", "futur", "Futur simple", "#ddd", "futurAnterieur", "Futur antérieur", "#ececff")
  return tostring(tableElement)
end

--- Generate the table for the subjunctive tenses of the given verb.
--- @param verb Verb A Verb object.
--- @return string The generated table.
local function generateSubjunctiveTable(verb)
  local tableElement = createTable()
  generateTensesRows(tableElement, verb, "subjonctif", "present", "Présent", "#ddd", "passe", "Passé", "#fec")
  generateTensesRows(tableElement, verb, "subjonctif", "imparfait", "Imparfait", "#ddd", "plusQueParfait", "Plus-que-parfait", "#fec")
  return tostring(tableElement)
end

--- Generate the table for the conditional tenses of the given verb.
--- @param verb Verb A Verb object.
--- @return string The generated table.
local function generateConditionalTable(verb)
  local tableElement = createTable()
  generateTensesRows(tableElement, verb, "conditionnel", "present", "Présent", "#ddd", "passe", "Passé", "#cfc")
  return tostring(tableElement)
end

--- Generate the table for the imperative tenses of the given verb.
--- @param verb Verb A Verb object.
--- @return string The generated table.
local function generateImperativeTable(verb)
  local tableElement = createTable()
  generateTensesRows(tableElement, verb, "imperatif", "present", "Présent", "#ffe5e5", "passe", "Passé", "#ffe5e5")
  return tostring(tableElement)
end

--- Format the given verb group as a link.
--- Throws an error if the group is different than 1, 2 or 3.
--- @param group number The verb group.
--- @return string The generated link.
local function formatGroup(group)
  local res = "[[Conjugaison:français/"
  if group == 1 then
    res = res .. "Premier groupe|1<sup>er</sup>"
  elseif group == 2 then
    res = res .. "Deuxième groupe|2<sup>e</sup>"
  elseif group == 3 then
    res = res .. "Troisième groupe|3<sup>e</sup>"
  else
    error("Groupe invalide : " .. tostring(group))
  end
  return res .. " groupe]]"
end

--- Render the full page for the given verb.
--- @param verb Verb A Verb object.
--- @param group number|nil The verb’s group, either 1, 2 or 3.
--- @param templateVerb string|nil The verb the specified one is conjugated like.
--- @param num number A number to append to section IDs.
--- @return string The generated wikicode.
local function renderPage(verb, group, templateVerb, num)
  local page = mw.html.create()

  local idSuffix = num and ("-" .. tostring(num)) or ""
  -- Links to modes sections
  local small = page:tag("small")
  small:wikitext(mw.ustring.format("[[#mode-impersonnel%s|Modes impersonnels]]", idSuffix))
  small:wikitext(" – ")
  small:wikitext(mw.ustring.format("[[#mode-indicatif%s|Indicatif]]", idSuffix))
  small:wikitext(" – ")
  small:wikitext(mw.ustring.format("[[#mode-subjonctif%s|Subjonctif]]", idSuffix))
  small:wikitext(" – ")
  small:wikitext(mw.ustring.format("[[#mode-conditionnel%s|Conditionnel]]", idSuffix))
  small:wikitext(" – ")
  small:wikitext(mw.ustring.format("[[#mode-impératif%s|Impératif]]", idSuffix))
  small:wikitext("\n\n")

  local inf = verb.modes["infinitif"].tenses["present"].forms[1]
  local introText = mw.ustring.format("Conjugaison de '''%s''', verbe ", link((inf:getPronoun() or "") .. inf:getForm()))
  if verb.spec.pronominal then
    introText = introText .. "pronominal "
  end
  if verb.spec.impersonal then
    introText = introText .. "impersonnel "
  end
  if group then
    introText = introText .. "du " .. formatGroup(group)
  else
    introText = introText .. "sans groupe"
  end
  introText = introText .. mw.ustring.format(
      ", conjugé avec l’auxiliaire %s.",
      link(verb.spec.auxEtre and "être" or "avoir")
  )
  if group == 3 then
    if templateVerb then
      local templateInf = templateVerb
      if mw.ustring.find(templateVerb, "-", 1, true) then
        templateInf = mw.text.split(templateInf, "-", true)[1]
        templateVerb = mw.ustring.gsub(templateVerb, "%-", " (", 1) .. ")"
      end
      if templateInf ~= verb.modes["infinitif"].tenses["present"].forms[1]:getForm() then
        -- Don’t show anything if the template is the verb itself
        introText = introText .. mw.ustring.format(" Conjugué comme [[%s#fr|%s]].", templateInf, templateVerb)
      end
    else
      introText = introText .. " Conjugué comme aucun autre verbe."
    end
  end
  page:wikitext(introText)

  page:tag("h3")
      :tag("span")
      :attr("id", "mode-impersonnel" .. idSuffix)
      :wikitext("Modes impersonnels")
  page:tag("div")
      :attr("style", "margin: 0.5em 2em")
      :wikitext(generateImpersonalTable(verb))

  local mode = verb.modes["indicatif"]
  page:tag("h3")
      :tag("span")
      :attr("id", "mode-indicatif" .. idSuffix)
      :attr("style", mode:isGray() and GRAY_STYLE or "")
      :wikitext(formatTitle("Indicatif", mode))
  page:tag("div")
      :attr("style", "margin: 0.5em 2em")
      :wikitext(generateIndicativeTable(verb))

  mode = verb.modes["subjonctif"]
  page:tag("h3")
      :tag("span")
      :attr("id", "mode-subjonctif" .. idSuffix)
      :attr("style", mode:isGray() and GRAY_STYLE or "")
      :wikitext(formatTitle("Subjonctif", mode))
  page:tag("div")
      :attr("style", "margin: 0.5em 2em")
      :wikitext(generateSubjunctiveTable(verb))

  mode = verb.modes["conditionnel"]
  page:tag("h3")
      :tag("span")
      :attr("id", "mode-conditionnel" .. idSuffix)
      :attr("style", mode:isGray() and GRAY_STYLE or "")
      :wikitext(formatTitle("Conditionnel", mode))
  page:tag("div")
      :attr("style", "margin: 0.5em 2em")
      :wikitext(generateConditionalTable(verb))

  mode = verb.modes["imperatif"]
  page:tag("h3")
      :tag("span")
      :attr("id", "mode-impératif" .. idSuffix)
      :attr("style", mode:isGray() and GRAY_STYLE or "")
      :wikitext(formatTitle("Impératif", mode))
  page:tag("div")
      :attr("style", "margin: 0.5em 2em")
      :wikitext(generateImperativeTable(verb))

  return tostring(page)
end

local modeAbbreviations = {
  part = "participe",
  ind = "indicatif",
  subj = "subjonctif",
  cond = "conditionnel",
  imp = "imperatif",
}
local tenseAbbreviations = {
  pr = "present",
  p = "passe",
  i = "imparfait",
  ps = "passeSimple",
  f = "futur",
  pc = "passeCompose",
  pa = "passeAnterieur",
  pqp = "plusQueParfait",
  fa = "futurAnterieur",
}

--- Parse the arguments of the form "<mode>.<tense>[.<person>]" and "<mode>[.<tense>[.<person>]].état".
--- @param aspiratedH boolean Whether the initial "h" of the verb should prevent a liaison.
--- @param pronominal boolean Whether the verb is pronominal.
--- @param auxEtre boolean Whether the verb should use the verb "être" instead of "avoir" as its auxiliary.
--- @param impersonal string Whether the verb is impersonal.
--- @param args table The parsed frame arguments.
--- @return (VerbSpec, boolean) A VerbSpec object and a boolean indicating whether any form has been specified manually or any form/tense/mode has been marked as non-existent.
local function parseSpecs(aspiratedH, pronominal, auxEtre, impersonal, args)
  local function personToIndex(mode, person)
    if mode == "imp" then
      if person == "2s" then
        return 1
      elseif person == "1p" then
        return 2
      elseif person == "2p" then
        return 3
      end
    end
    return tonumber(mw.ustring.sub(person, 1, 1))
        + (mw.ustring.sub(person, 2, 2) == "s" and 0 or 3)
  end

  --- @type VerbSpec
  local spec = m_model.newVerbSpec(aspiratedH, pronominal, auxEtre, impersonal)
  local manuallySpecified = false

  for k, v in pairs(args) do
    if mw.ustring.find(k, ".", 1, true) then
      local parts = mw.text.split(k, ".", true)
      local nb = #parts

      if parts[nb] == "état" then
        table.remove(parts, nb)
        nb = nb - 1
        local node = spec
        for i, part in ipairs(parts) do
          if i < nb then
            if i == 1 then
              node = node.modeSpecs[modeAbbreviations[part]]
            else
              node = node.tenseSpecs[tenseAbbreviations[part]]
            end
          end
        end
        if mw.ustring.match(parts[nb], "[123][sp]") then
          node.formSpecs[personToIndex(parts[1], parts[nb])].status = v
        else
          if modeAbbreviations[parts[nb]] then
            node.modeSpecs[modeAbbreviations[parts[nb]]].status = v
          else
            node.tenseSpecs[tenseAbbreviations[parts[nb]]].status = v
          end
          manuallySpecified = true
        end

      else
        local node = spec
        for i, part in ipairs(parts) do
          if i < nb then
            if i == 1 then
              node = node.modeSpecs[modeAbbreviations[part]]
            else
              node = node.tenseSpecs[tenseAbbreviations[part]]
            end
          end
        end
        if mw.ustring.match(parts[nb], "[123][sp]") then
          node.formSpecs[personToIndex(parts[1], parts[nb])].form = v
        else
          node.tenseSpecs[tenseAbbreviations[parts[nb]]].formSpecs[1].form = v
        end
        manuallySpecified = true
      end

    end
  end

  if impersonal then
    manuallySpecified = true
    for modeName, mode in pairs(spec.modeSpecs) do
      for tenseName, tense in pairs(mode.tenseSpecs) do
        if #tense.formSpecs ~= 1 then
          for i, form in ipairs(tense.formSpecs) do
            local j = m_model.STRUCT[modeName].tenses[tenseName][i]
            if j ~= 3 and (impersonal == m_model.IMPERS and j ~= 6 or impersonal == m_model.IMPERS_SING) then
              form.status = m_model.DISABLED
            end
          end
        end
      end
    end
  end

  return spec, manuallySpecified
end

--- Render the conjugation tables for the given verb.
--- Parameters:
---  frame.args[1] (string): The verb in its infinitive present form.
---  frame.args["aux-être"] (boolean): Optional. If true, use the “être” auxiliary instead of “avoir”.
---  frame.args["groupe3"] (boolean): Optional. If true, the verb will be classified as belonging to group 3.
---  frame.args["mutation"] (string): Optional. The type of mutation to apply to the verb’s root instead of the default one.
---  frame.args["modèle"] (string): Optional. For group-3 verbs, the verb to use as a template instead of the detected one.
---  frame.args["h-aspiré"] (boolean): Optional. If true, contracted pronoun forms will be used where relevant.
---  frame.args["impersonnel"] (string): Optional. If specified, the verb is considered impersonal.
---  frame.args["composé"] (boolean): Optional. Whether the verb is compound.
---  frame.args["caractère-comp"] (string): Optional. If "composé" is specified, the character to split the verb with. Defaults to "-".
---  frame.args["num"] (integer): Optional. A number to append to modes sections’ IDs when this function is called multiple times on the same page.
--- @return string The generated wikicode.
--- @see [[Modèle:fr-conjugaison/Documentation]] For a detailled explanation of frame arguments.
function p.conj(frame)
  local templates = m_table.keysToList(m_gen.group3Templates)
  table.insert(templates, "-")
  local flexionStates = m_model.STATES

  -- Attempt to extract the verb from the page’s title if it is in the "Conjugaison" namespace
  -- and use it as the default value for argument 1.
  -- Otherwise, mark the argument as required.
  local title = mw.title.getCurrentTitle()
  local pageNamespace = title.namespace
  local pageTitle = title.text
  local verbParamConfig
  if pageNamespace == m_bases.NS_CONJUGAISON.id and mw.ustring.find(pageTitle, "/", 1, true) then
    verbParamConfig = { default = mw.text.split(pageTitle, "/", true)[2] }
  else
    verbParamConfig = { required = true }
  end

  local args = m_params.process(frame:getParent().args, {
    [1] = verbParamConfig,
    ["aux-être"] = { type = m_params.BOOLEAN, default = false },
    ["groupe3"] = { type = m_params.BOOLEAN, default = false },
    ["groupe3-2"] = { type = m_params.BOOLEAN, default = false },
    ["groupe3-3"] = { type = m_params.BOOLEAN, default = false },
    ["mutation"] = { enum = m_gen.mutationTypes },
    ["mutation-2"] = { enum = m_gen.mutationTypes },
    ["mutation-3"] = { enum = m_gen.mutationTypes },
    ["modèle"] = { enum = templates },
    ["modèle-2"] = { enum = templates },
    ["modèle-3"] = { enum = templates },
    ["h-aspiré"] = { type = m_params.BOOLEAN, default = false },
    ["impersonnel"] = { enum = m_model.IMPERSONAL_STATES },
    ["composé"] = { type = m_model.BOOLEAN, default = false },
    ["caractère-comp"] = { default = "-" },
    ["num"] = { type = m_params.INT, checker = function(num)
      return num >= 1
    end },

    -- Full forms and defective tenses

    -- Participes
    ["part.état"] = { enum = flexionStates },
    -- Participe présent
    ["part.pr"] = {},
    ["part.pr.état"] = { enum = flexionStates },
    -- Participe passé
    ["part.p"] = {},
    ["part.p.état"] = { enum = flexionStates },

    -- Indicatif
    ["ind.état"] = { enum = flexionStates },
    -- Indicatif présent
    ["ind.pr.1s"] = {},
    ["ind.pr.2s"] = {},
    ["ind.pr.3s"] = {},
    ["ind.pr.1p"] = {},
    ["ind.pr.2p"] = {},
    ["ind.pr.3p"] = {},
    ["ind.pr.état"] = { enum = flexionStates },
    ["ind.pr.1s.état"] = { enum = flexionStates },
    ["ind.pr.2s.état"] = { enum = flexionStates },
    ["ind.pr.3s.état"] = { enum = flexionStates },
    ["ind.pr.1p.état"] = { enum = flexionStates },
    ["ind.pr.2p.état"] = { enum = flexionStates },
    ["ind.pr.3p.état"] = { enum = flexionStates },
    -- Indicatif imparfait
    ["ind.i.1s"] = {},
    ["ind.i.2s"] = {},
    ["ind.i.3s"] = {},
    ["ind.i.1p"] = {},
    ["ind.i.2p"] = {},
    ["ind.i.3p"] = {},
    ["ind.i.état"] = { enum = flexionStates },
    ["ind.i.1s.état"] = { enum = flexionStates },
    ["ind.i.2s.état"] = { enum = flexionStates },
    ["ind.i.3s.état"] = { enum = flexionStates },
    ["ind.i.1p.état"] = { enum = flexionStates },
    ["ind.i.2p.état"] = { enum = flexionStates },
    ["ind.i.3p.état"] = { enum = flexionStates },
    -- Indicatif passé simple
    ["ind.ps.1s"] = {},
    ["ind.ps.2s"] = {},
    ["ind.ps.3s"] = {},
    ["ind.ps.1p"] = {},
    ["ind.ps.2p"] = {},
    ["ind.ps.3p"] = {},
    ["ind.ps.état"] = { enum = flexionStates },
    ["ind.ps.1s.état"] = { enum = flexionStates },
    ["ind.ps.2s.état"] = { enum = flexionStates },
    ["ind.ps.3s.état"] = { enum = flexionStates },
    ["ind.ps.1p.état"] = { enum = flexionStates },
    ["ind.ps.2p.état"] = { enum = flexionStates },
    ["ind.ps.3p.état"] = { enum = flexionStates },
    -- Indicatif futur
    ["ind.f.1s"] = {},
    ["ind.f.2s"] = {},
    ["ind.f.3s"] = {},
    ["ind.f.1p"] = {},
    ["ind.f.2p"] = {},
    ["ind.f.3p"] = {},
    ["ind.f.état"] = { enum = flexionStates },
    ["ind.f.1s.état"] = { enum = flexionStates },
    ["ind.f.2s.état"] = { enum = flexionStates },
    ["ind.f.3s.état"] = { enum = flexionStates },
    ["ind.f.1p.état"] = { enum = flexionStates },
    ["ind.f.2p.état"] = { enum = flexionStates },
    ["ind.f.3p.état"] = { enum = flexionStates },
    -- Indicatif passé composé
    ["ind.pc.état"] = { enum = flexionStates },
    ["ind.pc.1s.état"] = { enum = flexionStates },
    ["ind.pc.2s.état"] = { enum = flexionStates },
    ["ind.pc.3s.état"] = { enum = flexionStates },
    ["ind.pc.1p.état"] = { enum = flexionStates },
    ["ind.pc.2p.état"] = { enum = flexionStates },
    ["ind.pc.3p.état"] = { enum = flexionStates },
    -- Indicatif passé antérieur
    ["ind.pa.état"] = { enum = flexionStates },
    ["ind.pa.1s.état"] = { enum = flexionStates },
    ["ind.pa.2s.état"] = { enum = flexionStates },
    ["ind.pa.3s.état"] = { enum = flexionStates },
    ["ind.pa.1p.état"] = { enum = flexionStates },
    ["ind.pa.2p.état"] = { enum = flexionStates },
    ["ind.pa.3p.état"] = { enum = flexionStates },
    -- Indicatif plus-que-parfait
    ["ind.pqp.état"] = { enum = flexionStates },
    ["ind.pqp.1s.état"] = { enum = flexionStates },
    ["ind.pqp.2s.état"] = { enum = flexionStates },
    ["ind.pqp.3s.état"] = { enum = flexionStates },
    ["ind.pqp.1p.état"] = { enum = flexionStates },
    ["ind.pqp.2p.état"] = { enum = flexionStates },
    ["ind.pqp.3p.état"] = { enum = flexionStates },
    -- Indicatif futur antérieur
    ["ind.fa.état"] = { enum = flexionStates },
    ["ind.fa.1s.état"] = { enum = flexionStates },
    ["ind.fa.2s.état"] = { enum = flexionStates },
    ["ind.fa.3s.état"] = { enum = flexionStates },
    ["ind.fa.1p.état"] = { enum = flexionStates },
    ["ind.fa.2p.état"] = { enum = flexionStates },
    ["ind.fa.3p.état"] = { enum = flexionStates },

    -- Subjonctif
    ["subj.état"] = { enum = flexionStates },
    -- Subjonctif présent
    ["subj.pr.1s"] = {},
    ["subj.pr.2s"] = {},
    ["subj.pr.3s"] = {},
    ["subj.pr.1p"] = {},
    ["subj.pr.2p"] = {},
    ["subj.pr.3p"] = {},
    ["subj.pr.état"] = { enum = flexionStates },
    ["subj.pr.1s.état"] = { enum = flexionStates },
    ["subj.pr.2s.état"] = { enum = flexionStates },
    ["subj.pr.3s.état"] = { enum = flexionStates },
    ["subj.pr.1p.état"] = { enum = flexionStates },
    ["subj.pr.2p.état"] = { enum = flexionStates },
    ["subj.pr.3p.état"] = { enum = flexionStates },
    -- Subjonctif imparfait
    ["subj.i.1s"] = {},
    ["subj.i.2s"] = {},
    ["subj.i.3s"] = {},
    ["subj.i.1p"] = {},
    ["subj.i.2p"] = {},
    ["subj.i.3p"] = {},
    ["subj.i.état"] = { enum = flexionStates },
    ["subj.i.1s.état"] = { enum = flexionStates },
    ["subj.i.2s.état"] = { enum = flexionStates },
    ["subj.i.3s.état"] = { enum = flexionStates },
    ["subj.i.1p.état"] = { enum = flexionStates },
    ["subj.i.2p.état"] = { enum = flexionStates },
    ["subj.i.3p.état"] = { enum = flexionStates },
    -- Subjonctif passé
    ["subj.p.état"] = { enum = flexionStates },
    ["subj.p.1s.état"] = { enum = flexionStates },
    ["subj.p.2s.état"] = { enum = flexionStates },
    ["subj.p.3s.état"] = { enum = flexionStates },
    ["subj.p.1p.état"] = { enum = flexionStates },
    ["subj.p.2p.état"] = { enum = flexionStates },
    ["subj.p.3p.état"] = { enum = flexionStates },
    -- Subjonctif plus-que-parfait
    ["subj.pqp.état"] = { enum = flexionStates },
    ["subj.pqp.1s.état"] = { enum = flexionStates },
    ["subj.pqp.2s.état"] = { enum = flexionStates },
    ["subj.pqp.3s.état"] = { enum = flexionStates },
    ["subj.pqp.1p.état"] = { enum = flexionStates },
    ["subj.pqp.2p.état"] = { enum = flexionStates },
    ["subj.pqp.3p.état"] = { enum = flexionStates },

    -- Conditionnel
    ["cond.état"] = { enum = flexionStates },
    -- Conditionnel présent
    ["cond.pr.1s"] = {},
    ["cond.pr.2s"] = {},
    ["cond.pr.3s"] = {},
    ["cond.pr.1p"] = {},
    ["cond.pr.2p"] = {},
    ["cond.pr.3p"] = {},
    ["cond.pr.état"] = { enum = flexionStates },
    ["cond.pr.1s.état"] = { enum = flexionStates },
    ["cond.pr.2s.état"] = { enum = flexionStates },
    ["cond.pr.3s.état"] = { enum = flexionStates },
    ["cond.pr.1p.état"] = { enum = flexionStates },
    ["cond.pr.2p.état"] = { enum = flexionStates },
    ["cond.pr.3p.état"] = { enum = flexionStates },
    -- Conditionnel passé
    ["cond.p.état"] = { enum = flexionStates },
    ["cond.p.1s.état"] = { enum = flexionStates },
    ["cond.p.2s.état"] = { enum = flexionStates },
    ["cond.p.3s.état"] = { enum = flexionStates },
    ["cond.p.1p.état"] = { enum = flexionStates },
    ["cond.p.2p.état"] = { enum = flexionStates },
    ["cond.p.3p.état"] = { enum = flexionStates },

    -- Impératif
    ["imp.état"] = { enum = flexionStates },
    -- Impératif présent
    ["imp.pr.2s"] = {},
    ["imp.pr.1p"] = {},
    ["imp.pr.2p"] = {},
    ["imp.pr.état"] = { enum = flexionStates },
    ["imp.pr.2s.état"] = { enum = flexionStates },
    ["imp.pr.1p.état"] = { enum = flexionStates },
    ["imp.pr.2p.état"] = { enum = flexionStates },
    -- Impératif passé
    ["imp.p.état"] = { enum = flexionStates },
    ["imp.p.2s.état"] = { enum = flexionStates },
    ["imp.p.1p.état"] = { enum = flexionStates },
    ["imp.p.2p.état"] = { enum = flexionStates },
  })

  local infinitive = args[1]
  local pronominal = false
  if mw.ustring.match(infinitive, "^se ") then
    pronominal = true
    infinitive = mw.ustring.sub(infinitive, 4)
  elseif mw.ustring.match(infinitive, "^s’") then
    pronominal = true
    infinitive = mw.ustring.sub(infinitive, 3)
  end
  local auxEtre = pronominal or args["aux-être"]
  local aspiratedH = args["h-aspiré"]
  local impersonal = args["impersonnel"]
  local compound = args["composé"]
  local splitChar = args["caractère-comp"]
  if compound and not mw.ustring.find(infinitive, splitChar, 1, true) then
    error(mw.ustring.format('Le caractère "%s" n’est pas dans "%s"', splitChar, infinitive))
  end
  local num = args["num"]
  if aspiratedH and mw.ustring.sub(infinitive, 1, 1) ~= "h" then
    error(mw.ustring.format('Le verbe "%s" ne commence pas par un "h"', infinitive))
  end

  -- TODO wrap errors
  local spec, manuallySpecified = parseSpecs(aspiratedH, pronominal, auxEtre, impersonal, args)
  local verb, group, templateVerb
  if compound then
    local parts = mw.text.split(infinitive, splitChar, true)
    local infinitives = {}
    local group3s = {}
    local mutationTypes = {}
    local verbTemplates = {}
    for i, part in ipairs(parts) do
      local index = i > 1 and "-" .. tostring(i) or ""
      table.insert(infinitives, part)
      table.insert(group3s, args["groupe3" .. index] or m_gen.NULL)
      table.insert(mutationTypes, args["mutation" .. index] or m_gen.NULL)
      table.insert(verbTemplates, args["modèle" .. index] or m_gen.NULL)
    end
    verb, group, templateVerb = m_gen.generateFlexions(infinitives, group3s, mutationTypes, verbTemplates, spec, splitChar)
  else
    verb, group, templateVerb = m_gen.generateFlexions({ infinitive }, { args["groupe3"] }, { args["mutation"] }, { args["modèle"] }, spec)
  end
  if manuallySpecified then
    templateVerb = nil
  end
  return renderPage(verb, group, templateVerb, num)
end

return p
