local m_typesDeMots = require("Module:types de mots")

local locutionData = mw.loadData("Module:locution/data")

local p = {}

--- Count the number of space characters (U+0020) contained in the given string.
--- @param s string The string to check.
--- @return number The number of space characters.
local function countSpaces(s)
  local count = 0
  for i = 1, mw.ustring.len(s) do
    if mw.ustring.sub(s, i, i) == " " then
      count = count + 1
    end
  end
  return count
end

local dutchVerbParticles = {
  "aan",
  "aaneen",
  "achter",
  "achterna",
  "achterover",
  "achteruit",
  "achteruit",
  "af",
  "beet",
  "bij",
  "bijeen",
  "binnen",
  "bloot",
  "boven",
  "buiten",
  "deel",
  "dicht",
  "dood",
  "door",
  "droog",
  "fijn",
  "gaar",
  "gelijk",
  "glad",
  "goed",
  "groot",
  "hard",
  "in",
  "ineen",
  "klein",
  "kort",
  "kwijt",
  "lang",
  "langs",
  "leeg",
  "los",
  "mede",
  "mee",
  "mis",
  "na",
  "neer",
  "om",
  "omver",
  "onder",
  "op",
  "open",
  "opeen",
  "over",
  "raak",
  "recht",
  "rond",
  "samen",
  "scheef",
  "schoon",
  "stil",
  "stuk",
  "tegen",
  "terecht",
  "terug",
  "toe",
  "uit",
  "vast",
  "vlak",
  "vol",
  "voor",
  "voort",
  "voorbij",
  "vooruit",
  "vrij",
  "weg",
  "warm",
  "zwart",
}

--- Check whether the given dutch verb ends with a particle.
--- @param word string The word to check.
--- @return boolean True if the word ends with any particle from `dutchVerbParticles`, false otherwise.
local function isDutchVerbWithParticle(word)
  for _, particle in ipairs(dutchVerbParticles) do
    if mw.ustring.find(word, " " .. particle .. "$") then
      return true
    end
  end
  return false
end

--- Check whether the given word is a locution.
--- @param word string The word to check.
--- @param wordType string The word’s type, as defined in [[Module:types de mots/data]].
--- @param langCode string The language code.
--- @return boolean True if the word is a French/Dutch pronominal verb and the number of spaces is > 1,
---                 a Dutch verb with a particle and the number of spaces is > 1,
---                 a Breton pronominal verb and the number of spaces is > 2,
---                 or it contains at least one space character (U+0020);
---                 false otherwise.
local function isLocution(word, wordType, langCode)
  local spaceCount = countSpaces(word)

  -- Language-specific cases
  if wordType and langCode then
    local isVerb = m_typesDeMots.getWordTypeNameSingular(wordType) == "verbe"

    if langCode == "fr" then
      -- Pronominal verb
      if isVerb and mw.ustring.find(word, "^se ") then
        return spaceCount > 1
      end
    elseif langCode == "br" then
      -- Pronominal verb
      -- [[Wiktionnaire:Wikidémie/mars 2018#Verbes pronominaux en breton]]
      if isVerb and mw.ustring.find(word, "^en em ") then
        return spaceCount > 2
      end
    elseif langCode == "nl" then
      if isVerb
          -- Pronominal verb
          and (mw.ustring.find(word, "^zich ")
          -- Verb with a particle
          or isDutchVerbWithParticle(word)) then
        return spaceCount > 1
      end
    end
  end

  -- Default: any space
  return spaceCount ~= 0
end

--- Check whether the word contained in the given title is a locution.
--- Supports main and "Annexe" namespaces.
--- @param pageTitle title The page title to extract the word from.
--- @param wordType string The word’s type, as defined in [[Module:types de mots/data]].
--- @param langCode string The language code.
--- @return boolean True if the word is a French/Dutch pronominal verb and the number of spaces is > 1,
---                 a Dutch verb with a particle and the number of spaces is > 1,
---                 a Breton pronominal verb and the number of spaces is > 2,
---                 or it contains at least one space character (U+0020);
---                 false otherwise.
function p.isLocution(pageTitle, wordType, langCode)
  local title = pageTitle.text
  -- If page is in "Annexe" namespace, keep only the last part
  if pageTitle.namespace == 100 then
    title = mw.ustring.gsub(title, ".+/", "")
  end
  -- If lang is in whitelist, try to detect automatically
  return locutionData[langCode] and isLocution(title, wordType, langCode)
end

return p
