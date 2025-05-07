local m_params = require("Module:paramètres")
local m_bases = require("Module:bases")

local p = {}

local data = mw.loadData("Module:quechua-déclinaisons/data")
local caseEndings = data.endings
local pronounsData = data.pronouns

--- Generate all inflections for the given word.
--- Normal forms:
--- * vowel ending:
--- ** sing: case[1]
--- ** plur: "kuna" .. case[1]
--- * consonants ending:
--- ** sing: case[2]
--- ** plur: "kuna" .. case[1]
--- Possessive forms:
--- * vowel ending:
--- ** 1s:
--- *** sing: "y" .. case[2]
--- *** plur: "y" .. "kuna" .. case[1]
--- ** 2s:
--- *** sing: "yki" .. case[2], except comitative, abessive, and distributive: "yki" .. case[1]
--- *** plur: "yki" .. "kuna" .. case[1]
--- ** 3s:
--- *** sing: "n" .. case[2], except comitative, and distributive: "ni" .. case[1]
--- *** plur: "n" .. "kuna" .. case[1]
--- ** 1pi:
--- *** sing: "nchik" .. case[2]
--- *** plur: "nchik" .. "kuna" .. case[1]
--- ** 1pe:
--- *** sing: "yku" .. case[2], except comitative, abessive, and distributive: "yku" .. case[1]
--- *** plur: "yku" .. "kuna" .. case[1]
--- ** 2p:
--- *** sing: "ykichik" .. case[2]
--- *** plur: "ykichik" .. "kuna" .. case[1]
--- ** 3p:
--- *** sing: "nku" .. case[2], except comitative, abessive, and distributive: "nku" .. case[1]
--- *** plur: "nku" .. "kuna" .. case[1]
--- * consonant ending: same as vowel but prefixed with "ni"
--- @param word string The word in its base form.
--- @param plural boolean If true, generate the plural forms. If false generate the singular form.
--- @param possessive boolean If true, generate the possessive form. If false, generate the non-possessive form.
--- @param possessivePerson number If `possessive` is true, the person from 1 to 6.
--- @param possessivePlural boolean If `possessive` is true, generate the plural form of the possessive.
--- @param inclusiveFirstPluralPerson boolean If `possessive` is true, and `possessivePerson` is 1,
---                                           generate the inclusive forms instead of the exclusive ones.
--- @return table A table containing the generated inflections.
local function generateInflections(
    word,
    plural,
    possessive,
    possessivePerson,
    possessivePlural,
    inclusiveFirstPluralPerson
)
  local lastLetter = mw.ustring.sub(word, -1)
  local endsWithVowel = lastLetter == "a" or lastLetter == "e" or lastLetter == "i" or
      lastLetter == "o" or lastLetter == "u"

  local inflections = {}
  for case, endings in pairs(caseEndings) do
    local ending = ""
    local i = 1
    if not possessive then
      if not endsWithVowel and not plural then
        i = 2
      end
    else
      if not endsWithVowel then
        ending = "ni"
      end
      if not plural then
        i = 2
      end

      if not possessivePlural then
        if possessivePerson == 1 then
          ending = ending .. "y"
        elseif possessivePerson == 2 then
          ending = ending .. "yki"
          if not plural and (case == "comitative" or case == "abessive" or case == "distributive") then
            i = 1
          end
        elseif possessivePerson == 3 then
          ending = ending .. "n"
          if not plural and (case == "comitative" or case == "distributive") then
            ending = ending .. "i"
            i = 1
          end
        end
      else
        if possessivePerson == 1 then
          if inclusiveFirstPluralPerson then
            ending = ending .. "nchik"
          else
            ending = ending .. "yku"
            if not plural and (case == "comitative" or case == "abessive" or case == "distributive") then
              i = 1
            end
          end
        elseif possessivePerson == 2 then
          ending = ending .. "ykichik"
        elseif possessivePerson == 3 then
          ending = ending .. "nku"
          if not plural and (case == "comitative" or case == "abessive" or case == "distributive") then
            i = 1
          end
        end
      end
    end

    if plural then
      ending = ending .. "kuna"
      i = 1
    end

    inflections[case] = word .. ending .. endings.suffixes[i]
  end

  return inflections
end

local cases = {
  "nominative",
  "accusative",
  "dative",
  "genitive",
  "locative",
  "terminative",
  "ablative",
  "instrumental",
  "comitative",
  "abessive",
  "comparative",
  "causative",
  "benefactive",
  "associative",
  "distributive",
  "exclusive",
}

--- Generate an inflections table for the given word.
--- If possessive-related arguments are set, the table will be collapsible.
--- @param langCode string The language code for the links.
--- @param word string The word.
--- @param possessivePerson number Optional. The possessive person from 1 to 6.
--- @param possessivePlural boolean Whether to generate the plural form of the possessive person.
--- @param inclusive boolean Optional. Whether to show the inclusive or exclusive forms of the 1st person plural.
--- @return string The generated table.
local function generateInflectionsTable(langCode, word, possessivePerson, possessivePlural, inclusive)
  local isPossessive = possessivePerson ~= nil

  local inflectionsSing, inflectionsPlur
  if isPossessive then
    inflectionsSing = generateInflections(word, false, true, possessivePerson, possessivePlural, inclusive)
    inflectionsPlur = generateInflections(word, true, true, possessivePerson, possessivePlural, inclusive)
  else
    inflectionsSing = generateInflections(word, false, false)
    inflectionsPlur = generateInflections(word, true, false)
  end

  local frame = mw.getCurrentFrame()

  local wikicode = ""
  if isPossessive then
    local key = tostring(possessivePerson) .. (possessivePlural and "p" or "s")
    if possessivePerson == 1 and possessivePlural then
      key = key .. (inclusive and "i" or "e")
    end
    local pronounData = pronounsData[key]
    local title = mw.ustring.format(
        "''%s'' (%s)",
        m_bases.lien_modele(pronounData.pronoun, langCode),
        pronounData.description
    ) .. "\n"
    wikicode = frame:expandTemplate { title = "(", args = { title, fermer = "oui" } } .. "\n"
  end

  wikicode = wikicode .. '{| class="wikitable"\n|-\n! !! Singulier !! Pluriel\n'
  for _, case in ipairs(cases) do
    wikicode = wikicode .. mw.ustring.format(
        "|-\n! %s\n| %s || %s\n",
        caseEndings[case].name,
        m_bases.lien_modele(inflectionsSing[case], langCode),
        m_bases.lien_modele(inflectionsPlur[case], langCode)
    )
  end
  wikicode = wikicode .. "|}\n"

  if isPossessive then
    wikicode = wikicode .. frame:expandTemplate { title = ")" } .. "\n"
  end

  return wikicode
end

--- Generate the collapsible inflections tables for the given word.
--- @param langCode string The language code for the links.
--- @param word string The word.
--- @return string The generated tables.
local function generateInflectionsTables(langCode, word)
  local frame = mw.getCurrentFrame()
  local wikicode = frame:expandTemplate { title = "(", args = {
    mw.ustring.format("Déclisaisons de ''%s''", word),
    fermer = "oui"
  } } .. "\n"
  wikicode = wikicode .. generateInflectionsTable(langCode, word)
  wikicode = wikicode .. frame:expandTemplate { title = ")" } .. "\n"
  wikicode = wikicode .. frame:expandTemplate { title = "(", args = {
    mw.ustring.format("Formes possessives de ''%s''", word),
    fermer = "oui"
  } } .. "\n"
  wikicode = wikicode .. generateInflectionsTable(langCode, word, 1, false)
  wikicode = wikicode .. generateInflectionsTable(langCode, word, 2, false)
  wikicode = wikicode .. generateInflectionsTable(langCode, word, 3, false)
  wikicode = wikicode .. generateInflectionsTable(langCode, word, 1, true, true)
  wikicode = wikicode .. generateInflectionsTable(langCode, word, 1, true, false)
  wikicode = wikicode .. generateInflectionsTable(langCode, word, 2, true)
  wikicode = wikicode .. generateInflectionsTable(langCode, word, 3, true)
  wikicode = wikicode .. frame:expandTemplate { title = ")" }
  return wikicode
end

--- Generate the collapsible inflections tables for the given word.
--- Used by the template {{quechua-déclinaisons}}
--- @param frame frame
--- Parameters:
---  args[1] (string): The language code for the links.
---  args[2] (string, optional): The word, defaults to the page’s title.
--- @return string The generated tables.
function p.generateInflections(frame)
  local args = m_params.process(frame:getParent().args, {
    [1] = { required = true },
    [2] = { default = mw.title.getCurrentTitle().text },
  })
  return generateInflectionsTables(args[1], args[2])
end

return p
