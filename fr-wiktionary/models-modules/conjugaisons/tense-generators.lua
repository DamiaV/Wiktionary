local m_model = require("Module:conjugaisons/data-model")

local p = {}

--- For group-1 verbs ending in "-eler/-eter", mutate the root in "-ell-/-ett-" instead of "-èl-/-èt-".
local MUTATION_DOUBLE_CONS = "double consonne"
--- For group-1 verbs ending in "-ayer", keep the "y" instead of mutating it to "i" before silent endings.
local MUTATION_AYER_YE = "ayer-ye"
--- For group-1 verbs ending in "-uër", put the diaeresis on the "i" and "è" also.
local MUTATION_UER_UIONS = "uër-uïons"
--- For group-2 verbs ending in "-ïr", replace the "ï" by a "i" for the 3 singular persons of indicative
--- and the singular imperative present.
local MUTATION_I = "ï-i"

--- All available root mutation types.
p.mutationTypes = {
  MUTATION_DOUBLE_CONS,
  MUTATION_AYER_YE,
  MUTATION_UER_UIONS,
  MUTATION_I,
}

--- All available template group-3 verb endings, indexed by the template verb.
p.group3Templates = mw.loadData("Module:conjugaisons/group3-templates")

--- Sentinel object representing an empty value in tables
p.NULL = {}

--- Instanciate a new verb table containing empty values for all simple tenses.
--- @return table A new empty template.
local function createEmptyTemplate()
  return {
    infinitif = {
      present = { p.NULL },
    },
    participe = {
      present = { p.NULL },
      passe = { p.NULL },
    },
    indicatif = {
      present = { p.NULL, p.NULL, p.NULL, p.NULL, p.NULL, p.NULL },
      imparfait = { p.NULL, p.NULL, p.NULL, p.NULL, p.NULL, p.NULL },
      passeSimple = { p.NULL, p.NULL, p.NULL, p.NULL, p.NULL, p.NULL },
      futur = { p.NULL, p.NULL, p.NULL, p.NULL, p.NULL, p.NULL },
    },
    subjonctif = {
      present = { p.NULL, p.NULL, p.NULL, p.NULL, p.NULL, p.NULL },
      imparfait = { p.NULL, p.NULL, p.NULL, p.NULL, p.NULL, p.NULL },
    },
    conditionnel = {
      present = { p.NULL, p.NULL, p.NULL, p.NULL, p.NULL, p.NULL },
    },
    imperatif = {
      present = { p.NULL, p.NULL, p.NULL },
    },
  }
end

--- Generate a list of group-1 verb endings of the form `<firstLetter><consonants>er`.
--- @param firstLetter string The first letter.
--- @param consonants string[] The list of consonnants to generate endings with.
--- @return string[] The list of generated endings.
local function generateGroup1Endings(firstLetter, consonants)
  local endings = {}
  for _, c in ipairs(consonants) do
    endings[firstLetter .. c .. "er"] = c
  end
  return endings
end

--- The list of all available group-1 endings of the form `e<consonants>er`.
local eCONSer_verbs = generateGroup1Endings("e", {
  "c",
  "d",
  "g",
  "l",
  "m",
  "n",
  "p",
  "r",
  "s",
  "t",
  "v",
  "vr",
})
--- The list of all available group-1 endings of the form `é<consonants>er`.
local eacuteCONSer_verbs = generateGroup1Endings("é", {
  "b",
  "br",
  "c",
  "ch",
  "cr",
  "d",
  "fl",
  "g",
  "gl",
  "gn",
  "gr",
  "gu",
  "j",
  "l",
  "m",
  "n",
  "p",
  "qu",
  "r",
  "s",
  "t",
  "tr",
  "v",
  "vr",
})

--- Indicate whether the given past participle has a plural form different from its singular.
--- @param pastParticiple string The singular past participle form.
--- @returns True if the plural is different, false otherwise.
local function isPluralDifferent(pastParticiple)
  local lastLetter = mw.ustring.sub(pastParticiple, -1)
  return lastLetter ~= 's' and lastLetter ~= 'x' and lastLetter ~= 'z'
end

--- Raise an error for the given mutation type.
--- @param mutationType string The mutation type.
local function invalidMutationType(mutationType)
  error(mw.ustring.format('Valeur invalide pour le paramètre « mutation » ("%s").', mutationType))
end

--- Check whether the given string starts with an "a", "â" or "o".
--- @param s string The string to check.
--- @return boolean True if the string starts with "a", "â" or "o", false otherwise.
local function startsWithAO(s)
  local firstLetter = mw.ustring.sub(s, 1, 1)
  return firstLetter == "a" or firstLetter == "â" or firstLetter == "o"
end

--- Check whether the given group-1 ending is silent.
--- @param ending string The ending to check.
--- @return boolean True if the ending is silent, false otherwise.
local function isGroup1EndingSilent(ending)
  return ending == "e" or ending == "es" or ending == "ent"
end

--- Generate the simple tense forms of the given group-1 verb.
--- @param infinitive string The infinitive form of the verb.
--- @param rootMapper function Optional. A function that, given the verb’s root and an ending,
---        builds the associated verb form.
--- @param infinitiveMapper function Optional. A function that, given a verb’s ending,
---        builds the associated verb form based on its infinitive.
--- @return table A table containing all simple tense forms of the verb.
local function generateGroup1Forms_(infinitive, rootMapper, infinitiveMapper)
  rootMapper = rootMapper or function(root, ending)
    return root .. ending
  end
  infinitiveMapper = infinitiveMapper or function(ending)
    return infinitive .. ending
  end
  local root = mw.ustring.sub(infinitive, 1, -3)
  return {
    infinitif = {
      present = { infinitive },
    },
    participe = {
      present = { rootMapper(root, "ant") },
      passe = { rootMapper(root, "é") },
    },
    indicatif = {
      present = {
        rootMapper(root, "e"),
        rootMapper(root, "es"),
        rootMapper(root, "e"),
        rootMapper(root, "ons"),
        rootMapper(root, "ez"),
        rootMapper(root, "ent")
      },
      imparfait = {
        rootMapper(root, "ais"),
        rootMapper(root, "ais"),
        rootMapper(root, "ait"),
        rootMapper(root, "ions"),
        rootMapper(root, "iez"),
        rootMapper(root, "aient")
      },
      passeSimple = {
        rootMapper(root, "ai"),
        rootMapper(root, "as"),
        rootMapper(root, "a"),
        rootMapper(root, "âmes"),
        rootMapper(root, "âtes"),
        rootMapper(root, "èrent")
      },
      futur = {
        infinitiveMapper("ai"),
        infinitiveMapper("as"),
        infinitiveMapper("a"),
        infinitiveMapper("ons"),
        infinitiveMapper("ez"),
        infinitiveMapper("ont")
      },
    },
    subjonctif = {
      present = {
        rootMapper(root, "e"),
        rootMapper(root, "es"),
        rootMapper(root, "e"),
        rootMapper(root, "ions"),
        rootMapper(root, "iez"),
        rootMapper(root, "ent")
      },
      imparfait = {
        rootMapper(root, "asse"),
        rootMapper(root, "asses"),
        rootMapper(root, "ât"),
        rootMapper(root, "assions"),
        rootMapper(root, "assiez"),
        rootMapper(root, "assent")
      }
    },
    conditionnel = {
      present = {
        infinitiveMapper("ais"),
        infinitiveMapper("ais"),
        infinitiveMapper("ait"),
        infinitiveMapper("ions"),
        infinitiveMapper("iez"),
        infinitiveMapper("aient")
      }
    },
    imperatif = {
      present = {
        rootMapper(root, "e"),
        rootMapper(root, "ons"),
        rootMapper(root, "ez")
      }
    },
  }
end

--- Mutate the given group-1 verb root according to the given ending.
--- @param root string The verb’s root.
--- @param ending string A verb ending.
--- @return string The mutated root if it ends in "g" or "c", the argument root otherwise.
local function mutateRoot_cer_ger(root, ending)
  local lastLetter = mw.ustring.sub(root, -1)
  if lastLetter ~= "g" and lastLetter ~= "c" then
    return root
  end
  local mutation = lastLetter == "g" and "ge" or "ç"
  return startsWithAO(ending) and (mw.ustring.sub(root, 1, -2) .. mutation) or root
end

--- Generate the simple tense forms of the given group-1 verb ending in `[cg]er`.
--- @param infinitive string The infinitive form of the verb.
--- @return table A table containing all simple tense forms of the verb.
local function generateGroup1Forms_cer_ger(infinitive)
  return generateGroup1Forms_(infinitive, function(root, ending)
    return mutateRoot_cer_ger(root, ending) .. ending
  end)
end

--- Generate the simple tense forms of the given group-1 verb ending in `[eè]<consonant(s)>er`.
--- @param infinitive string The infinitive form of the verb.
--- @param consonants string The consonant(s) that precede the mutating "e".
--- @param doubleConsonant boolean True to double the consonant instead of mutating the "e/é" into an "è".
--- @return table A table containing all simple tense forms of the verb.
local function generateGroup1Forms_eCONSer(infinitive, consonants, doubleConsonant)
  if doubleConsonant and consonants ~= "l" and consonants ~= "t" then
    invalidMutationType(MUTATION_DOUBLE_CONS)
  end
  local base = mw.ustring.sub(infinitive, 1, -4 - mw.ustring.len(consonants))
  local mutatedRoot = base .. (doubleConsonant and ("e" .. consonants) or "è") .. consonants
  return generateGroup1Forms_(infinitive, function(root, ending)
    return mutateRoot_cer_ger(isGroup1EndingSilent(ending) and mutatedRoot or root, ending) .. ending
  end, function(ending)
    return mutatedRoot .. "er" .. ending
  end)
end

--- Generate the simple tense forms of the given group-1 verb ending in `[aeou]yer`.
--- @param infinitive string The infinitive form of the verb.
--- @param mutateYe boolean If the verb ends in "-ayer" and this argument is true the "y"
---        in the root is mutated as "i" before neutral endings.
--- @return table A table containing all simple tense forms of the verb.
local function generateGroup1Forms_yer(infinitive, mutateYe)
  local base = mw.ustring.sub(infinitive, 1, -4)
  local vowel = mw.ustring.sub(base, -1)
  local mutatedRoot
  if mutateYe and vowel ~= "a" then
    invalidMutationType(MUTATION_AYER_YE)
  end
  if vowel == "a" and mutateYe or vowel == "e" then
    mutatedRoot = base .. "y"
  else
    mutatedRoot = base .. "i"
  end
  return generateGroup1Forms_(infinitive, function(root, ending)
    return (isGroup1EndingSilent(ending) and mutatedRoot or root) .. ending
  end, function(ending)
    return mutatedRoot .. "er" .. ending
  end)
end

--- Generate the simple tense forms of the given group-1 verb ending in "envoyer".
--- @param infinitive string The infinitive form of the verb.
--- @return table A table containing all simple tense forms of the verb.
local function generateGroup1Forms_envoyer(infinitive)
  local mutatedRoot = mw.ustring.sub(infinitive, 1, -4) .. "i"
  local mutatedInfinitiveRoot = mw.ustring.sub(infinitive, 1, -5) .. "err"
  return generateGroup1Forms_(infinitive, function(root, ending)
    return (isGroup1EndingSilent(ending) and mutatedRoot or root) .. ending
  end, function(ending)
    return mutatedInfinitiveRoot .. ending
  end)
end

--- Generate the simple tense forms of the given group-1 verb ending in "uër".
--- @param infinitive string The infinitive form of the verb.
--- @param mutate boolean If the verb ends in "-uër" and this argument is true the "i" and "è"
---     of endings will get the diaeresis instead of the "u".
--- @return table A table containing all simple tense forms of the verb.
local function generateGroup1Forms_ue_diaeresis_r(infinitive, mutate)
  local mutatedRoot = mw.ustring.sub(infinitive, 1, -4) .. "ü"
  return generateGroup1Forms_(infinitive, function(root, ending)
    local letter = mw.ustring.sub(ending, 1, 1)
    if letter == "e" then
      return root .. "ë" .. mw.ustring.sub(ending, 2)
    elseif mutate then
      if letter == "i" then
        return root .. "ï" .. mw.ustring.sub(ending, 2)
      elseif letter == "è" then
        return root .. "ë" .. mw.ustring.sub(ending, 2)
      end
    end
    return mutatedRoot .. ending
  end)
end

--- Generate the simple tense forms of the given group-1 verb.
--- @param infinitive string The infinitive form of the verb.
--- @param mutationType string The type of mutation to apply to the verb’s root instead of the default one.
--- @return table A table containing all simple tense forms of the verb.
--- @see [[Conjugaison:français/Premier groupe]] for exceptions.
function p.generateGroup1Forms(infinitive, mutationType)
  if mutationType and mutationType ~= MUTATION_DOUBLE_CONS
      and mutationType ~= MUTATION_AYER_YE
      and mutationType ~= MUTATION_UER_UIONS then
    invalidMutationType(mutationType)
  end

  local last4 = mw.ustring.sub(infinitive, -4)
  local last5 = mw.ustring.sub(infinitive, -5)
  local consonants = eCONSer_verbs[last4] or eCONSer_verbs[last5]
  if consonants then
    if mutationType and mutationType ~= MUTATION_DOUBLE_CONS then
      invalidMutationType(mutationType)
    end
    local doubleConsonant = (consonants == "l" or consonants == "t") and mutationType == MUTATION_DOUBLE_CONS
    return generateGroup1Forms_eCONSer(infinitive, consonants, doubleConsonant)
  end
  if mutationType and mutationType == MUTATION_DOUBLE_CONS then
    invalidMutationType(mutationType)
  end

  if mw.ustring.sub(infinitive, -7) == "envoyer" then
    if mutationType then
      invalidMutationType(mutationType)
    end
    return generateGroup1Forms_envoyer(infinitive)
  end

  local last3 = mw.ustring.sub(infinitive, -3)
  if last3 == "yer" then
    if mutationType and mutationType ~= MUTATION_AYER_YE then
      invalidMutationType(mutationType)
    end
    return generateGroup1Forms_yer(infinitive, mutationType == MUTATION_AYER_YE)
  end
  if mutationType and mutationType == MUTATION_AYER_YE then
    invalidMutationType(mutationType)
  end

  if last3 == "uër" then
    return generateGroup1Forms_ue_diaeresis_r(infinitive, mutationType == MUTATION_UER_UIONS)
  end
  if mutationType then
    invalidMutationType(mutationType)
  end

  consonants = eacuteCONSer_verbs[last4] or eacuteCONSer_verbs[last5]
  if consonants then
    return generateGroup1Forms_eCONSer(infinitive, consonants)
  end

  if last3 == "cer" or last3 == "ger" then
    return generateGroup1Forms_cer_ger(infinitive)
  end

  return generateGroup1Forms_(infinitive)
end

--- Generate the simple tense forms of the given group-2 verb.
--- @param infinitive string The infinitive form of the verb.
--- @param dropDiaeresis boolean Whether to drop the "ï"
---        for the 3 singular persons of indicative and imperative present.
--- @return table A table containing all simple tense forms of the verb.
--- @see [[Conjugaison:français/Deuxième groupe]] for exceptions.
function p.generateGroup2Forms(infinitive, dropDiaeresis)
  local root = mw.ustring.sub(infinitive, 1, -3)
  local hasDiaeresis = mw.ustring.sub(infinitive, -2) == "ïr"
  if not hasDiaeresis and dropDiaeresis then
    invalidMutationType(MUTATION_I)
  end
  local i = hasDiaeresis and "ï" or "i"
  local iCirc = hasDiaeresis and "ï" or "î"
  return {
    infinitif = {
      present = { infinitive },
    },
    participe = {
      present = { root .. i .. "ssant" },
      passe = { root .. i },
    },
    indicatif = {
      present = {
        root .. (dropDiaeresis and "is" or (i .. "s")),
        root .. (dropDiaeresis and "is" or (i .. "s")),
        root .. (dropDiaeresis and "it" or (i .. "t")),
        root .. i .. "ssons",
        root .. i .. "ssez",
        root .. i .. "ssent"
      },
      imparfait = {
        root .. i .. "ssais",
        root .. i .. "ssais",
        root .. i .. "ssait",
        root .. i .. "ssions",
        root .. i .. "ssiez",
        root .. i .. "ssaient"
      },
      passeSimple = {
        root .. i .. "s",
        root .. i .. "s",
        root .. i .. "t",
        root .. iCirc .. "mes",
        root .. iCirc .. "tes",
        root .. i .. "rent"
      },
      futur = {
        infinitive .. "ai",
        infinitive .. "as",
        infinitive .. "a",
        infinitive .. "ons",
        infinitive .. "ez",
        infinitive .. "ont"
      },
    },
    subjonctif = {
      present = {
        root .. i .. "sse",
        root .. i .. "sses",
        root .. i .. "sse",
        root .. i .. "ssions",
        root .. i .. "ssiez",
        root .. i .. "ssent"
      },
      imparfait = {
        root .. i .. "sse",
        root .. i .. "sses",
        root .. iCirc .. "t",
        root .. i .. "ssions",
        root .. i .. "ssiez",
        root .. i .. "ssent"
      }
    },
    conditionnel = {
      present = {
        infinitive .. "ais",
        infinitive .. "ais",
        infinitive .. "ait",
        infinitive .. "ions",
        infinitive .. "iez",
        infinitive .. "aient"
      }
    },
    imperatif = {
      present = {
        root .. (dropDiaeresis and "is" or (i .. "s")),
        root .. i .. "ssons",
        root .. i .. "ssez"
      }
    },
  }
end

--- Looks for the group-3 template whose ending has the longest match with the given infinitive.
--- @param infinitive string The infinitive form of the verb.
--- @return (table|nil, string|nil) The group-3 template that matched the best, or nil if none matched, and the name of the matched template.
local function longestMatchingGroup3Template(infinitive)
  local matchName
  local longestMatch
  local longestMatchLength = 0
  for templateName, template in pairs(p.group3Templates) do
    if not template.ignore_auto then
      local len = mw.ustring.len(template.ending)
      if mw.ustring.find(infinitive, template.ending .. "$") and (not longestMatch or longestMatchLength < len) then
        longestMatch = template
        longestMatchLength = len
        matchName = templateName
      end
    end
  end
  return longestMatch, matchName
end

--- Generate the simple tense forms of the given group-3 verb.
--- @param infinitive string The infinitive form of the verb.
--- @param templateVerb string|nil The verb the given one should be conjugated like.
--- @param spec VerbSpec A VerbSpec object.
--- @return (table, string) A table containing all simple tense forms of the verb, and the verb it is conjugated like.
--- @see [[Conjugaison:français/Troisième groupe]] for sub-types.
function p.generateGroup3Forms(infinitive, templateVerb, spec)
  local template, templateName

  if templateVerb then
    if not p.group3Templates[templateVerb] then
      error(mw.ustring.format('Modèle de verbe inconnu : "%s"', templateVerb))
    end
    template = p.group3Templates[templateVerb]
    templateName = templateVerb
    if mw.ustring.sub(infinitive, -mw.ustring.len(template.ending)) ~= template.ending then
      error(mw.ustring.format('Le verbe "%s" ne se termine pas par "%s"', infinitive, template.ending))
    end
  elseif p.group3Templates[infinitive] then
    template = p.group3Templates[infinitive]
    templateName = infinitive
  else
    template, templateName = longestMatchingGroup3Template(infinitive)
  end
  if not template then
    error(mw.ustring.format('Aucun modèle de conjugaison trouvé pour le verbe "%s"', infinitive))
  end

  local root = mw.ustring.sub(infinitive, 1, -mw.ustring.len(template.ending) - 1)
  local forms = {}
  for mode, tenses in pairs(template.endings) do
    forms[mode] = {}
    for tense, tenseEndings in pairs(tenses) do
      forms[mode][tense] = {}
      for i, ending in ipairs(tenseEndings) do
        local formSpec = spec.modeSpecs[mode].tenseSpecs[tense].formSpecs[i]
        if formSpec:isDisabled() then
          table.insert(forms[mode][tense], p.NULL)
        else
          table.insert(forms[mode][tense], formSpec.form or (root .. ending))
        end
      end
    end
  end

  return forms, templateName
end

--- Generate a compound tense using the given auxiliary verb table and past participle.
--- @param auxTable table A table containing flexions of the auxiliary verb.
--- @param pastParticiple string The past participle.
--- @param spec VerbSpec A VerbSpec object.
--- @param mode string The name of the mode.
--- @param tense string The name of the tense.
--- @return table A table containing the generated compound tense.
local function generateCompoundTense(auxTable, pastParticiple, spec, mode, tense)
  local res = {}
  for i, t in ipairs(auxTable) do
    if spec.modeSpecs[mode].tenseSpecs[tense].formSpecs[i]:isDisabled() then
      table.insert(res, p.NULL)
    else
      if spec.auxEtre and i > 3 and isPluralDifferent(pastParticiple) then
        pastParticiple = pastParticiple .. "s"
      end
      table.insert(res, t .. " " .. pastParticiple)
    end
  end
  return res
end

--- Complete the given verb table by generating compound tenses with the given auxiliary verb table.
--- @param verbTable table A table containing flexions of the verb for all simple tenses.
--- @param spec VerbSpec A VerbSpec object.
local function completeTable(verbTable, spec)
  local auxTable = spec.auxEtre and p.group3Templates["être"].endings or p.group3Templates["avoir"].endings

  local ppr = verbTable.participe.present[1]
  verbTable.gerondif = {}
  if ppr ~= p.NULL then
    verbTable.gerondif.present = { ppr }
  end

  local pp = verbTable.participe.passe[1]
  if pp ~= p.NULL then
    verbTable.infinitif.passe = generateCompoundTense(auxTable.infinitif.present, pp, spec, "infinitif", "passe")

    verbTable.gerondif.passe = generateCompoundTense(auxTable.participe.present, pp, spec, "gerondif", "passe")

    verbTable.indicatif.passeCompose = generateCompoundTense(auxTable.indicatif.present, pp, spec, "indicatif", "passeCompose")
    verbTable.indicatif.plusQueParfait = generateCompoundTense(auxTable.indicatif.imparfait, pp, spec, "indicatif", "plusQueParfait")
    verbTable.indicatif.passeAnterieur = generateCompoundTense(auxTable.indicatif.passeSimple, pp, spec, "indicatif", "passeAnterieur")
    verbTable.indicatif.futurAnterieur = generateCompoundTense(auxTable.indicatif.futur, pp, spec, "indicatif", "futurAnterieur")

    verbTable.subjonctif.passe = generateCompoundTense(auxTable.subjonctif.present, pp, spec, "subjonctif", "passe")
    verbTable.subjonctif.plusQueParfait = generateCompoundTense(auxTable.subjonctif.imparfait, pp, spec, "subjonctif", "plusQueParfait")

    verbTable.conditionnel.passe = generateCompoundTense(auxTable.conditionnel.present, pp, spec, "conditionnel", "passe")

    if not spec.pronominal then
      verbTable.imperatif.passe = generateCompoundTense(auxTable.imperatif.present, pp, spec, "imperatif", "passe")
    else
      verbTable.imperatif.passe = { p.NULL, p.NULL, p.NULL }
    end
  end
end

--- Generate all compound tenses and create a new Verb object from the given template.
--- @param template table A table containing the forms for simple tenses.
--- @param spec VerbSpec A VerbSpec object.
--- @return Verb The generated Verb object.
local function populateVerb(template, spec)
  completeTable(template, spec)
  --- @type Verb
  local verb = m_model.newVerb(spec)
  for modeName, tenses in pairs(template) do
    for tenseName, forms in pairs(tenses) do
      for i, form in ipairs(forms) do
        local f
        if form ~= p.NULL then
          f = form
        end
        verb.modes[modeName].tenses[tenseName].forms[i]:setForm(f)
      end
    end
  end
  return verb
end

--- Retroactively apply the given spec to a template, removing all forms that are disabled in that spec.
--- @param template table A table containing the forms for simple tenses.
--- @param spec VerbSpec A VerbSpec object.
local function applySpec(template, spec)
  for modeName, tenses in pairs(template) do
    for tenseName, forms in pairs(tenses) do
      for i = 1, #forms do
        local formSpec = spec.modeSpecs[modeName].tenseSpecs[tenseName].formSpecs[i]
        if formSpec:isDisabled() then
          forms[i] = p.NULL
        elseif formSpec.form then
          forms[i] = formSpec.form
        end
      end
    end
  end
end

--- Generate the simple tense forms of the given verb.
--- @param infinitive string The infinitive form of the verb.
--- @param group3 boolean If true, the verb will be classified as belonging to group 3.
--- @param mutationType string The type of mutation to apply to the verb’s root instead of the default one.
--- @param templateVerb string|nil For group-3 verbs, the verb the given one should be conjugated like.
--- @param spec VerbSpec A VerbSpec object.
--- @return (table, number|nil, string|nil) A populated template table, the verb’s group or nil if it could not be determined, and the verb the given one is conjugated like.
local function generateFlexions(infinitive, group3, mutationType, templateVerb, spec)
  if mutationType and templateVerb then
    error("Les paramètres « mutation » et « modèle » ne peuvent pas être spécifiés en même temps.")
  end
  if infinitive == "être" then
    if mutationType then
      invalidMutationType(mutationType)
    end
    -- Special case to avoid unnecessary checks
    return p.group3Templates["être"].endings, 3, nil
  end
  if infinitive == "avoir" then
    if mutationType then
      invalidMutationType(mutationType)
    end
    -- Special case to avoid unnecessary checks
    return p.group3Templates["avoir"].endings, 3, nil
  end

  local ending = mw.ustring.sub(infinitive, -2)
  if not group3 and (ending == "ir" or ending == "ïr") then
    if mutationType and mutationType ~= MUTATION_I then
      invalidMutationType(mutationType)
    end
    local forms = p.generateGroup2Forms(infinitive, mutationType == MUTATION_I)
    applySpec(forms, spec)
    return forms, 2, nil
  end
  if mutationType and mutationType == MUTATION_I then
    invalidMutationType(mutationType)
  end

  if not group3 and (ending == "er" or ending == "ër") then
    local forms = p.generateGroup1Forms(infinitive, mutationType)
    applySpec(forms, spec)
    return forms, 1, nil
  end
  if mutationType and mutationType == MUTATION_DOUBLE_CONS
      or mutationType == MUTATION_AYER_YE
      or mutationType == MUTATION_UER_UIONS then
    invalidMutationType(mutationType)
  end

  if templateVerb == "-" then
    local template = createEmptyTemplate()
    for modeName, tenses in pairs(template) do
      for tenseName, forms in pairs(tenses) do
        for i = 1, #forms do
          forms[i] = spec.modeSpecs[modeName].tenseSpecs[tenseName].formSpecs[i].form or p.NULL
        end
      end
    end
    template.infinitif.present = { infinitive }
    return template, 3, nil
  end
  local template, templateName = p.generateGroup3Forms(infinitive, templateVerb, spec)
  return template, 3, templateName
end

--- Generate all forms of the given verb.
--- @param infinitives string[] The infinitive form for each part of the verb.
--- @param group3s boolean[] If true, the verb part will be classified as belonging to group 3.
--- @param mutationTypes string[] The type of mutation to apply to the verb part’s root instead of the default one.
--- @param templateVerbs (string|nil)[] For group-3 verb parts, the verb the given one should be conjugated like.
--- @param spec VerbSpec A VerbSpec object.
--- @param splitChar string Optional. If the verb is compound, the character to use to join the sub-verbs with.
--- @return (Verb, number|nil, string|nil) A populated Verb object, the whole verb’s group or nil if it could not be determined, and the verb the given one is conjugated like.
function p.generateFlexions(infinitives, group3s, mutationTypes, templateVerbs, spec, splitChar)
  local template = createEmptyTemplate()
  local group, templateName
  for i = 1, #infinitives do
    local template_, group_, templateName_ = generateFlexions(
        infinitives[i],
        group3s[i] ~= p.NULL and group3s[i] or nil,
        mutationTypes[i] ~= p.NULL and mutationTypes[i] or nil,
        templateVerbs[i] ~= p.NULL and templateVerbs[i] or nil,
        spec
    )
    if not templateName then
      templateName = templateName_
    elseif templateName ~= p.NULL and templateName ~= templateName_ then
      templateName = p.NULL
    end
    if not group then
      group = group_
    elseif group ~= p.NULL and group ~= group_ then
      group = p.NULL
    end
    for modeName, tenses in pairs(template) do
      for tenseName, forms in pairs(tenses) do
        for j, form in ipairs(forms) do
          local f = template_[modeName][tenseName][j]
          if form == p.NULL then
            template[modeName][tenseName][j] = f
          else
            template[modeName][tenseName][j] = template[modeName][tenseName][j] .. splitChar .. f
          end
        end
      end
    end
  end
  return populateVerb(template, spec), group ~= p.NULL and group or nil, templateName ~= p.NULL and templateName or nil
end

return p
