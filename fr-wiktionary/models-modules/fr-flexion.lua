--- This module defines functions for use in French inflections tables.

local m_params = require("Module:paramètres")
local m_pron = require("Module:prononciation")
local m_table = require("Module:table")

local p = {}


----------------
-- Args class --
----------------


--- @class Args
local Args = {}
Args.__index = Args

function Args:new()
  local this = {}
  setmetatable(this, Args)

  this.title = nil

  this.ms = nil
  this.mp = {}
  this.m = nil

  this.fs = {}
  this.fp = {}
  this.f = nil

  this.msPronPrefixes = {}
  this.msProns = {}

  this.mpPronPrefixes = {}
  this.mpProns = {}

  this.fsPronPrefixes = {}
  this.fsProns = {}

  this.fpPronPrefixes = {}
  this.fpProns = {}

  this.mPronPrefixes = {}
  this.mProns = {}

  this.fPronPrefixes = {}
  this.fProns = {}

  this.pronPrefixes = {}
  this.prons = {}

  this.noCat = false

  return this
end

-- Inflections

--- Returns the masculine singular form.
--- @return string
function Args:getMS()
  return self.ms or self.m
end

--- Returns the masculine plural form.
--- @return string
function Args:getMP()
  if self.mp[1] then
    return self.mp[1]
  elseif self.m then
    return self.m
  else
    return self:getMS() .. "s"
  end
end

--- Returns the other masculine plural forms.
--- @return table
function Args:getOtherMPs()
  return { unpack(self.mp, 2) }
end

--- Returns the feminine singular form.
--- @return string
function Args:getFS()
  if self.fs[1] then
    return self.fs[1]
  elseif self.f then
    return self.f
  else
    return self:getMS() .. "e"
  end
end

--- Returns the other feminine singular forms.
--- @return table
function Args:getOtherFSs()
  return { unpack(self.fs, 2) }
end

--- Returns the feminine plural form.
--- @return string
function Args:getFP()
  if self.fp[1] then
    return self.fp[1]
  elseif self.f then
    return self.f
  elseif self.fs[1] then
    return self.fs[1] .. "s"
  else
    return self:getMS() .. "es"
  end
end

--- Returns the other feminine plural forms.
--- @return table
function Args:getOtherFPs()
  return { unpack(self.fp, 2) }
end

-- Pronunciation prefixes

--- Returns the masculine singular pronunciation prefix.
--- @return string|nil
function Args:getMSPronPrefix(i)
  return self.msPronPrefixes[i] or self.mPronPrefixes[i] or self.pronPrefixes[i]
end

--- Returns the masculine plural pronunciation prefix.
--- @return string|nil
function Args:getMPPronPrefix(i)
  return self.mpPronPrefixes[i] or self.mPronPrefixes[i] or self.pronPrefixes[i]
end

--- Returns the feminine singular pronunciation prefix.
--- @return string|nil
function Args:getFSPronPrefix(i)
  return self.fsPronPrefixes[i] or self.fPronPrefixes[i] or self.pronPrefixes[i]
end

--- Returns the feminine plural pronunciation prefix.
--- @return string|nil
function Args:getFPPronPrefix(i)
  return self.fpPronPrefixes[i] or self.fPronPrefixes[i] or self.pronPrefixes[i]
end

-- Pronunciation

--- Returns the masculine singular pronunciation.
--- @return string|nil
function Args:getMSPron(i)
  return self.msProns[i] or self.mProns[i] or self.prons[i]
end

--- Returns the masculine plural pronunciation.
--- @return string|nil
function Args:getMPPron(i)
  return self.mpProns[i] or self.mProns[i] or self.prons[i]
end

--- Returns the feminine singular pronunciation.
--- @return string|nil
function Args:getFSPron(i)
  return self.fsProns[i] or self.fProns[i] or self.prons[i]
end

--- Returns the feminine plural pronunciation.
--- @return string|nil
function Args:getFPPron(i)
  return self.fpProns[i] or self.fProns[i] or self.prons[i]
end


---------------------
-- Utils functions --
---------------------


--- Prepends the right character before the given API string
--- if needed (dot, space, liaison).
--- @param api string The string to prepend the character to.
--- @return string
local function addSeparatorBeforeInvPart(api)
  if not api then
    return ""
  end

  local firstChar = mw.ustring.sub(api, 1, 1)
  if firstChar == "." or firstChar == "‿" or firstChar == " " then
    return api
  end
  -- NBSP in UTF8 is 0xC2 0xA0
  if firstChar == "\194\160" then
    return " " .. mw.ustring.sub(api, 2)
  end
  -- nbsp HTML entity replaced by regular space
  if mw.ustring.sub(api, 1, 6) == "&nbsp;" then
    return " " .. mw.ustring.sub(api, 7)
  end

  -- In all other cases, add a space
  return " " .. api
end

--- Splits the first argument into 2 parts: the part before the suffix and the part after it.
--- @param word string The word to split.
--- @param ms string Ending for masculine singular.
--- @param mp string Ending for masculine plural.
--- @param fs string Ending for feminine singular.
--- @param fp string Ending for feminine plural.
--- @return (string,string) The text before and after the suffix.
local function splitWord(word, ms, mp, fs, fp)
  local wordStart = ""
  local wordEnd = ""

  -- Add space so that %s matches the end of the string
  local pageTitle1 = word .. " "
  -- Hyphen has to be escaped
  local matchStart, matchEnd = mw.ustring.find(pageTitle1, ms .. "[%s%-]")
  if not matchStart and mp then
    matchStart, matchEnd = mw.ustring.find(pageTitle1, mp .. "[%s%-]")
  end
  if not matchStart and fs then
    matchStart, matchEnd = mw.ustring.find(pageTitle1, fs .. "[%s%-]")
  end
  if not matchStart and fp then
    matchStart, matchEnd = mw.ustring.find(pageTitle1, fp .. "[%s%-]")
  end

  if matchStart then
    wordStart = mw.ustring.sub(word, 1, matchStart - 1)
    if matchEnd <= mw.ustring.len(word) then
      wordEnd = mw.ustring.sub(word, matchEnd) -- comprend le séparateur
    end
    return wordStart, wordEnd
  end

  return nil, nil
end

local function errorTable(message, noCat)
  local text = '{| class="flextable"\n' ..
      '|+ <span style="color:red"><b>Erreur&nbsp;!</b></span>\n' ..
      '|-\n' ..
      '! scope="col" | Singulier\n' ..
      '! scope="col" | Pluriel\n' ..
      '|-\n' ..
      '| scope="row" colspan="2" | <span style="color:red">' .. message .. '</span>\n' ..
      '|}'

  -- 2 = User
  if mw.title.getCurrentTitle().namespace ~= 2 and not noCat then
    text = text .. "[[Catégorie:Appels de modèles incorrects]]"
  end

  return text
end

--- Generates the inflection table using the given Args object.
--- @param argsObject Args
--- @return string
function p.generateTable(argsObject)
  local res = '{| class="flextable flextable-fr-mfsp"\n'

  if argsObject.title then
    res = res .. mw.ustring.format("|+ %s\n", argsObject.title)
  end

  res = res .. [[|-
| class="invisible" |
! scope="col" | Singulier
! scope="col" | Pluriel
|- class="flextable-fr-m"
! scope="row" | Masculin
]]

  local formatCell = function(inflection, class, colSpan)
    local upper = mw.ustring.upper(inflection)
    local inflectionsTable = { argsObject["get" .. upper](argsObject) }
    local otherInflections = argsObject["getOther" .. upper .. "s"]

    if otherInflections then
      inflectionsTable = { inflectionsTable[1], unpack(otherInflections(argsObject)) }
    end

    inflectionsTable = m_table.map(inflectionsTable, function(v)
      return mw.ustring.format("[[%s]]", v)
    end)

    local pronsTable = {}
    local done = false
    local i = 1

    while not done do
      local prefix = argsObject["get" .. upper .. "PronPrefix"](argsObject, i)
      local pron = argsObject["get" .. upper .. "Pron"](argsObject, i)

      if pron then
        table.insert(
            pronsTable,
            (prefix or "") .. m_pron.lua_pron(pron, "fr")
        )
      else
        done = true
      end
      i = i + 1
    end

    if #pronsTable == 0 then
      table.insert(pronsTable, m_pron.lua_pron("", "fr"))
    end

    local inflections = table.concat(inflectionsTable, "<br/><small>ou</small> ")
    local prons = table.concat(pronsTable, "<br/><small>ou</small> ")

    return mw.ustring.format(
        '| colspan="%d" | <span class="flextable-fr-%s">%s<br/>%s</span>\n',
        colSpan, class, inflections, prons
    )
  end

  if argsObject:getMS() ~= argsObject:getMP() or argsObject:getMSPron(1) ~= argsObject:getMPPron(1) then
    res = res .. formatCell("ms", "ms", 1)
    res = res .. formatCell("mp", "mp", 1)
  else
    res = res .. formatCell("ms", "msp", 2)
  end

  res = res .. '|- class="flextable-fr-f"\n! scope="row" | Féminin\n'

  if argsObject:getFS() ~= argsObject:getFP() or argsObject:getFSPron(1) ~= argsObject:getFPPron(1) then
    res = res .. formatCell("fs", "fs", 1)
    res = res .. formatCell("fp", "fp", 1)
  else
    res = res .. formatCell("fs", "fsp", 2)
  end

  res = res .. "|}"

  if not argsObject.noCat then
    -- TODO catégoriser dans "Singuliers manquants en français" ou "Pluriels manquants en français" si nécessaire
    -- TODO vérifier l’existance des formes singulier/pluriel
  end

  return res
end

local function generateRootNotFoundMessage(templateName)
  local text = mw.ustring.format(
      "Usage erroné de %s.<br/>Le titre de la page ne comporte pas<br/>une des terminaisons attendues.",
      mw.getCurrentFrame():expandTemplate { title = 'M', args = { templateName } })
  return errorTable(text) .. "[[Catégorie:Appels de modèles incorrects/fr-flexion-lua]]"
end


------------------------
-- Template functions --
------------------------


-- TODO utile ?
----------------------------------------------------------------------------------------
-- récupération prononciation en param 2 ou 1 selon syntaxe ancienne/nouvelle
-- retourne PronRadic, PronFinInvar
-- fonction à usage transitoire, en attendant l'abandon définitif de l'ancienne syntaxe
----------------------------------------------------------------------------------------
-- tableau des cas possibles, hors cas particuliers :
--         entrées       :         sorties
--    radical arg1 arg2  : radical PronRad PronInv
-- (1)    R     -    -   :     R      -       -      (nouvelle)
-- (2)    R     R    -   :     R      -       -      (ancienne)
-- (3)    R     P    -   :     R      P       -      (nouvelle)
-- (4)    R     R    P   :     R      P       -      (ancienne)
-- (5)    R     P    I   :     R      P       I      (nouvelle)
local function nouvelle_ancienne_syntaxe_radic4(radic, args)
  if (not args[1]) or (args[1] == '') then
    --(1) syntaxe nouvelle, sans prononciation ou avec param nommés
    --(c’était une erreur dans l’ancienne syntaxe)
    return args["pron"] or '', addSeparatorBeforeInvPart(args["pinv"])

  elseif (radic ~= args[1]) then
    --(3,5) syntaxe nouvelle, cas général : le param 1 n’est pas le radical, donc c’est la prononciation
    --(sinon c’est une erreur à corriger à la main)
    return args[1], addSeparatorBeforeInvPart(args[2] or args["pinv"])

  elseif (radic == 'b') then
    --cas particuliers des radicaux monosyllabes identiques à leur API où le test précédent échoue (comme pour "beau")
    -- liste des radicaux potentiellement concernés (WT:QT/décembre 2014#Problème métaphysique avec Modèle:fr-accord-eau + Module:fr-flexion) :
    -- b, bl, d, f, (k), (kl), l, m, n, p, pl, ps, s, t, ts, v, w, z.
    if args[2] and (args[2] ~= radic) then
      --(5) nouvelle syntaxe avec "prononciation partie invar" en args[2]
      return radic, addSeparatorBeforeInvPart(args[2])

    else
      --(2,4) ancienne syntaxe sans ou avec pron en args[2] (de tte façon dévinée comme égale à radic)
      --(3) nouvelle sans "prononciation partie invar" en args[2]
      return radic, addSeparatorBeforeInvPart(args["pinv"])

    end
  else
    --(2,4) syntaxe ancienne sans ou avec pron en args[2]
    return args[2] or '', addSeparatorBeforeInvPart(args["pinv"])

  end
end

function p.errorBox(frame)
  -- TODO supprimer ? utilisée uniquement dans [[Wiktionnaire:Gestion des modèles/2014#Boites de flexions en français]]
  local msg = frame.args[1] or frame:getParent().args[1] or "erreur inconnue"
  local nocat = frame.args["nocat"] or frame:getParent().args["nocat"]
  return errorTable(msg, nocat)
end

function p.inflectionRegular(frame)
  local args = m_params.process(frame.args, {
    ["type flexion"] = { required = true },
    ["autre param"] = {},
  })

  local inflectionType = args["type flexion"]
  local otherParamName = args["autre param"]

  local argsDefinition = {
    ["préfpron"] = {}, ["préfpron2"] = {}, ["préfpron3"] = {},
    ["pron"] = {}, ["pron2"] = {}, ["pron3"] = {},
    [1] = { alias_of = "pron" },

    ["pinv"] = {},
    [2] = { alias_of = "pinv" },

    ["mot"] = { default = mw.title.getCurrentTitle().text },
    ["titre"] = {},
  }

  if otherParamName then
    argsDefinition[otherParamName] = { type = "boolean" }
  end

  local parentArgs = m_params.process(frame:getParent().args, argsDefinition)

  local pronPrefix1 = parentArgs["préfpron"]
  local pronPrefix2 = parentArgs["préfpron2"]
  local pronPrefix3 = parentArgs["préfpron3"]
  local pronRoot1 = parentArgs["pron"]
  local pronRoot2 = parentArgs["pron2"]
  local pronRoot3 = parentArgs["pron3"]
  local word = parentArgs["mot"]
  local tableTitle = parentArgs["titre"]

  -- Inflections detection
  local inflections = mw.loadData("Module:bac à sable/Danÿa/fr-flexion/data")[inflectionType] -- TEMP nom data
  local alternateF = parentArgs[otherParamName]
  local fIndex = alternateF and otherParamName or 1

  local suffixMS = inflections.ms[1]
  local suffixMP = inflections.mp[1]
  local suffixFS = inflections.fs[fIndex]
  local suffixFP = inflections.fp[fIndex]

  local pronSuffixMS = inflections.ms[2]
  local pronSuffixMP = inflections.mp[2]
  local pronSuffixFS = inflections.fs[2]
  local pronSuffixFP = inflections.fp[2]

  -- Word root extraction
  local root, invariablePart = splitWord(word, suffixMS, suffixMP, suffixFS, suffixFP)
  -- No root found, abort
  if not root then
    return generateRootNotFoundMessage("fr-accord-" .. inflectionType)
  end

  local invariablePronPart = addSeparatorBeforeInvPart(parentArgs["pinv"])

  local argsObject = Args:new()

  argsObject.title = tableTitle
  argsObject.ms = root .. suffixMS .. invariablePart
  argsObject.mp = { root .. suffixMP .. invariablePart }
  argsObject.fs = { root .. suffixFS .. invariablePart }
  argsObject.fp = { root .. suffixFP .. invariablePart }

  local generateProns = function(pronRoot, pronPrefix)
    table.insert(argsObject.msProns, pronRoot .. pronSuffixMS .. invariablePronPart)
    table.insert(argsObject.mpProns, pronRoot .. pronSuffixMP .. invariablePronPart)
    table.insert(argsObject.fsProns, pronRoot .. pronSuffixFS .. invariablePronPart)
    table.insert(argsObject.fpProns, pronRoot .. pronSuffixFP .. invariablePronPart)
    if pronPrefix then
      table.insert(argsObject.msPronPrefixes, pronPrefix)
      table.insert(argsObject.mpPronPrefixes, pronPrefix)
      table.insert(argsObject.fsPronPrefixes, pronPrefix)
      table.insert(argsObject.fpPronPrefixes, pronPrefix)
    end
  end

  if pronRoot1 then
    generateProns(pronRoot1, pronPrefix1)
    if pronRoot2 then
      generateProns(pronRoot2, pronPrefix2)
      if pronRoot3 then
        generateProns(pronRoot3, pronPrefix3)
      end
    end
  end

  return p.generateTable(argsObject)
end

function p.inflectionBoxGeneric(frame)
  local args = m_params.process(frame:getParent().args, {
    ["titre"] = {},

    ["ms"] = { default = mw.title.getCurrentTitle().text },
    ["mp"] = {}, ["mp2"] = {},
    ["m"] = {},

    ["fs"] = {}, ["fs2"] = {},
    ["fp"] = {}, ["fp2"] = {},
    ["f"] = {},

    ["préfpms"] = {}, ["pms"] = {},
    ["préfpms2"] = {}, ["pms2"] = {},
    ["préfpms3"] = {}, ["pms3"] = {},

    ["préfpmp"] = {}, ["pmp"] = {},
    ["préfpmp2"] = {}, ["pmp2"] = {},
    ["préfpmp3"] = {}, ["pmp3"] = {},

    ["préfpm"] = {}, ["pm"] = {},
    ["préfpm2"] = {}, ["pm2"] = {},
    ["préfpm3"] = {}, ["pm3"] = {},

    ["préfpfs"] = {}, ["pfs"] = {},
    ["préfpfs2"] = {}, ["pfs2"] = {},
    ["préfpfs3"] = {}, ["pfs3"] = {},

    ["préfpfp"] = {}, ["pfp"] = {},
    ["préfpfp2"] = {}, ["pfp2"] = {},
    ["préfpfp3"] = {}, ["pfp3"] = {},

    ["préfpf"] = {}, ["pf"] = {},
    ["préfpf2"] = {}, ["pf2"] = {},
    ["préfpf3"] = {}, ["pf3"] = {},

    ["préfpron"] = {}, ["préfpron2"] = {}, ["préfpron3"] = {},
    ["pron"] = {}, ["pron2"] = {}, ["pron3"] = {},
    [1] = { alias_of = "pron" },

    ["nocat"] = { type = "boolean" },
    ["inv"] = {}, -- XXX ?
  })

  local argsObject = Args:new()

  argsObject.title = args["titre"]

  -- TODO extraire les paramètres

  argsObject.pronPrefixes = { args["pron"], args["pron2"], args["pron3"] }
  argsObject.prons = { args["préfpron"], args["préfpron2"], args["préfpron3"] }

  argsObject.noCat = args["nocat"]
end

function p.inflectionBox4(frame)
  -- TODO
end

function p.inflectionBox3(frame)
  -- TODO
end

function p.inflectionBox2(frame)
  -- TODO
end

p.Args = Args -- TEMP

return p
