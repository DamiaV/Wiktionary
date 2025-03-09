local m_params = require("Module:paramètres")

local UnitTester = {}

local SUCCESS_IMAGE = "[[File:OOjs UI icon check-constructive.svg|20px|alt=Passed|link=|Test réussi]]"
local FAILURE_IMAGE = "[[File:OOjs UI icon close-ltr-destructive.svg|20px|alt=Failed|link=|Test échoué]]"
local IGNORED_IMAGE = "[[File:OOjs UI icon cancel-progressive.svg|20px|alt=Failed|link=|Test ignoré]]"

--- Détermine la position de la première différence entre deux chaines.
--- @param s1 string Une chaine.
--- @param s2 string Une chaine.
--- @return number|nil La position de la première différence,
---         -1 s’il n’y a aucune différence ou nil si une des deux
---         valeurs n’est pas une chaine.
local function firstDifference(s1, s2)
  if type(s1) ~= "string" or type(s2) ~= "string" then
    return nil
  end
  if s1 == s2 then
    return -1
  end

  local iter1 = mw.ustring.gmatch(s1, ".")
  local iter2 = mw.ustring.gmatch(s2, ".")
  local max = math.min(mw.ustring.len(s1) or #s1, mw.ustring.len(s2) or #s2)

  for i = 1, max do
    local c1 = iter1()
    local c2 = iter2()
    if c1 ~= c2 then
      return i
    end
  end

  return max + 1
end

--- Convertit une valeur en chaine de caractères.
--- @param value any La valeur à convertir.
--- @return string La représentation sous forme de chaine de la valeur.
local function valueToString(value)
  if type(value) == "string" then
    value = mw.ustring.gsub(value, "\n", "\\n")

    if mw.ustring.match(mw.ustring.gsub(value, "[^'\"]", ""), '^"+$') then
      return "'" .. value .. "'"
    end

    return '"' .. mw.ustring.gsub(value, '"', '\\"') .. '"'
  elseif type(value) == "table" then
    local result, done = {}, {}

    for k, val in ipairs(value) do
      table.insert(result, valueToString(val))
      done[k] = true
    end

    for k, v in pairs(value) do
      if not done[k] then
        if (type(k) ~= "string") or not mw.ustring.match(k, "^[_%a][_%a%d]*$") then
          k = "[" .. valueToString(k) .. "]"
        end
        table.insert(result, k .. "=" .. valueToString(v))
      end
    end

    return "{" .. table.concat(result, ", ") .. "}"
  else
    return tostring(value)
  end
end

--- Compare deux valeurs.
--- @param value1 any La première valeur.
--- @param value2 any La deuxième valeur.
--- @return boolean Vrai si les deux valeurs sont égales, faux sinon.
local function simpleCompare(value1, value2)
  return value1 == value2
end

--- Compare deux valeurs. Si les deux sont des tables, la comparaison
--- est effectuée pour chaque sous-table.
--- @param value1 any La première valeur.
--- @param value2 any La deuxième valeur.
--- @return boolean Vrai si les deux valeurs sont égales en récursivement, faux sinon.
local function deepCompare(value1, value2)
  local type1 = type(value1)
  local type2 = type(value2)

  if type1 ~= type2 then
    return false
  end
  if type1 ~= "table" and type2 ~= "table" then
    return simpleCompare(value1, value2)
  end

  local metatable = getmetatable(value1)
  if metatable and metatable.__eq then
    return value1 == value2
  end

  for k1, v1 in pairs(value1) do
    local v2 = value2[k1]
    if v2 == nil or not deepCompare(v1, v2) then
      return false
    end
  end
  for k2, v2 in pairs(value2) do
    local v1 = value1[k2]
    if v1 == nil or not deepCompare(v1, v2) then
      return false
    end
  end

  return true
end

--- Teste l’égalité de deux valeurs.
--- @param testName string Le nom du test.
--- @param actual any La valeur retournée par l’opération à tester.
--- @param expected any La valeur attendue.
--- @param comment string|nil Un commentaire optionnel.
--- @private
function UnitTester:_equals(equals, toString, testName, actual, expected, comment)
  local result = {
    testName = testName,
    success = equals(actual, expected),
  }

  local actualStr, expectedStr

  if expected == nil then
    expectedStr = "''nil''"
  else
    expectedStr = mw.text.nowiki(toString(expected))
  end
  if actual == nil then
    actualStr = "''nil''"
  else
    actualStr = mw.text.nowiki(toString(actual))
  end

  result.actual = actualStr
  result.expected = expectedStr

  if self.differsAt then
    result.diff = firstDifference(expectedStr, actualStr)
  end
  if self.comments then
    result.comment = comment or "''Pas de commentaire''"
  end

  table.insert(self.resultsTable, result)
end

--- Teste si deux valeurs sont égales.
--- @param testName string Le nom du test.
--- @param actual string|number|boolean La valeur retournée par l’opération à tester.
--- @param expected string|number|boolean La valeur attendue.
--- @param comment string|nil Un commentaire optionnel.
function UnitTester:equals(testName, actual, expected, comment)
  self:_equals(simpleCompare, tostring, testName, actual, expected, comment)
end

--- Teste l’égalité de deux valeurs en profondeur.
--- @param testName string Le nom du test.
--- @param actual table|string|number|boolean La valeur retournée par l’opération à tester.
--- @param expected table|string|number|boolean La valeur attendue.
--- @param comment string|nil Un commentaire optionnel.
function UnitTester:equals_deep(testName, actual, expected, comment)
  self:_equals(deepCompare, valueToString, testName, actual, expected, comment)
end

--- Fonction permettant de tester si la fonction donnée
--- lance une erreur précise pour les paramètres donnés.
--- Si ce n’est pas le cas, une erreur est lancée et
--- le test échoue.
--- @param testName string Le nom du test.
--- @param func function La fonction à tester.
--- @param args table Les paramètres de la fonction.
--- @param expectedErrorMessage string Le message d’erreur attendu sans le préfixe
---                                    « Erreur Lua dans Module:<module> à la ligne <numéro> : ».
--- @param comment string|nil Un commentaire optionnel.
function UnitTester:expect_error(testName, func, args, expectedErrorMessage, comment)
  local functionReturned, actualResult = pcall(func, unpack(args))
  testName = "''(Test d’erreur)'' " .. testName

  if functionReturned then
    local result = {
      testName = testName,
      success = false,
    }

    local expectedStr = mw.text.nowiki(expectedErrorMessage)
    local actualStr

    if actualResult == nil then
      actualStr = "''nil''"
    else
      actualStr = mw.text.nowiki(valueToString(actualResult))
    end

    result.actual = actualStr
    result.expected = expectedStr

    if self.differsAt then
      result.diff = firstDifference(expectedStr, actualStr)
    end
    if self.comments then
      result.comment = comment or "''Pas de commentaire''"
    end

    table.insert(self.resultsTable, result)
  else
    local prefix = "^Module:.+:%d+: "
    local match = mw.ustring.match(actualResult, prefix)
    -- Suppression du début du message si présent.
    if match then
      actualResult = mw.ustring.sub(actualResult, mw.ustring.len(match) + 1)
    end
    self:equals(testName, actualResult, expectedErrorMessage, comment)
  end
end

--- Ignore les tous les tests de la fonction courante.
--- Ils seront quand même exécutés (limitation technique) mais
--- les résultats ou erreurs ne seront pas prises en compte.
function UnitTester:ignore()
  self.ignoreCurrentTests = true
end

--- Exécute les tests.
---  frame.args["differs_at"] (booléen) : Si vrai, ajoute une colonne
---     montrant les différences entre les valeurs attendue et obtenue.
---  frame.args["comments"] : Si vrai, ajoute une colonne affichant les
---     commentaires des tests qui en ont.
---  frame.args["summarize"] : Si vrai, les tableaux de résultat seront
---     cachés, seul le pourcentage de réussite sera affiché.
function UnitTester:run(frame)
  local args = m_params.process(frame.args, {
    differsAt = { type = m_params.BOOLEAN, default = false, },
    comments = { type = m_params.BOOLEAN, default = false, },
    summarize = { type = m_params.BOOLEAN, default = false, },
    hideIgnored = { type = m_params.BOOLEAN, default = false, },
  })
  self.differsAt = args.differs_at
  self.comments = args.comments
  local summarize = args.summarize

  local columns = 4
  local tableHeader = '{| class="wikitable"\n! title="Liste des tests" | &nbsp; !! Texte !! Attendu !! Obtenu'

  -- Ajout des colonnes supplémentaires.
  if self.differsAt then
    columns = columns + 1
    tableHeader = tableHeader .. " !! Différence à la position"
  end
  if self.comments then
    columns = columns + 1
    tableHeader = tableHeader .. " !! Commentaires"
  end

  local testMethods = {}

  -- Extraction des méthodes de test.
  for key, _ in pairs(self) do
    if key:find("^test") then
      table.insert(testMethods, key)
    end
  end

  table.sort(testMethods)

  local totalTests = 0
  local numIgnored = 0
  local numFailed = 0
  local results = {}

  -- Exécution des tests.
  for _, key in ipairs(testMethods) do
    local resultsTable = {}

    table.insert(resultsTable, mw.ustring.format(
        '%s\n|+ style="text-align:left" | %s&nbsp;:\n|-\n',
        tableHeader, key
    ))

    --- Contient les résultats des tests de la méthode en train d’être évaluée.
    self.resultsTable = {}
    self.ignoreCurrentTests = false

    local traceback = "''(pas de trace d’appel)''"
    local success, message = xpcall(function()
      return self[key](self)
    end, function(msg)
      traceback = debug.traceback("", 2)
      return msg
    end)

    if self.ignoreCurrentTests then
      totalTests = totalTests + 1
      numIgnored = numIgnored + 1
      table.insert(resultsTable, mw.ustring.format(
          '|-\n| %s\n| colspan="%u" style="text-align:left" | <strong>Test(s) ignoré(s)</strong>\n',
          IGNORED_IMAGE, columns - 1
      ))
    elseif not success then
      totalTests = totalTests + 1
      numFailed = numFailed + 1
      table.insert(resultsTable, mw.ustring.format(
          '|-\n| %s\n| colspan="%u" style="text-align:left" | <strong class="error">Erreur de script pendant le test : %s</strong>%s\n',
          FAILURE_IMAGE, columns - 1, mw.text.nowiki(message), frame:extensionTag("pre", traceback)
      ))
    else
      for _, result in pairs(self.resultsTable) do
        totalTests = totalTests + 1
        if result.success then
          table.insert(resultsTable, '|-\n| ' .. SUCCESS_IMAGE)
        else
          table.insert(resultsTable, '|-\n| ' .. FAILURE_IMAGE)
          numFailed = numFailed + 1
        end

        local diff = ""
        if result.diff ~= nil then
          diff = " || " .. result.diff
        end

        local comment = ""
        if result.comment ~= nil then
          comment = " || " .. result.comment
        end

        table.insert(resultsTable, mw.ustring.format(
            " || %s || %s || %s%s%s\n",
            result.testName, result.expected, result.actual, diff, comment
        ))
      end
    end

    table.insert(resultsTable, "|}\n\n")
    table.insert(results, table.concat(resultsTable))
  end

  -- Construction des tableaux des résultats.

  local failureCat = "[[Catégorie:Modules avec tests unitaires ayant échoué]]"
  if mw.title.getCurrentTitle().text:find("/documentation$") then
    failureCat = ""
  end

  local numSuccesses = totalTests - numFailed - numIgnored

  -- Résumé des résultats, tableaux non affichés
  if summarize then
    local cssClass

    if numFailed == 0 then
      cssClass = "success"
    else
      cssClass = "error"
    end

    local s = numSuccesses == 1 and "" or "s"
    local res = mw.ustring.format(
        '<strong class="%s">%u/%u test%s réussi%s</strong>',
        cssClass, numSuccesses, totalTests - numIgnored, s, s
    )

    if numIgnored ~= 0 then
      s = numIgnored == 1 and "" or "s"
      res = res .. mw.ustring.format(
          ', <em>%u test%s ignoré%s</em>',
          numIgnored, s, s
      )
    end

    return res

    -- Résultats complets
  else
    local message, cssClass

    if numFailed == 0 then
      cssClass = "success"
      message = "Tous les tests ont réussi"
    else
      local s = numFailed == 1 and "" or "s"
      local verb = numFailed == 1 and "a" or "ont"
      cssClass = "error"
      message = mw.ustring.format('%u test%s %s échoué', numFailed, s, verb)
    end

    local status = mw.ustring.format('<strong class="%s">%s</strong>', cssClass, message)

    if numIgnored ~= 0 then
      local s = numIgnored == 1 and "" or "s"
      status = status .. mw.ustring.format(
          ', <em>%u test%s ignoré%s</em>',
          numIgnored, s, s
      )
    end
    if numFailed ~= 0 then
      status = status .. failureCat
    end

    local refreshLink = tostring(mw.uri.fullUrl(mw.title.getCurrentTitle().fullText, "action=purge&forcelinkupdate"))

    return mw.ustring.format(
        '%s <span class="plainlinks">[%s (rafraichir)]</span>\n\n%s',
        status, refreshLink, table.concat(results)
    )
  end
end

--- Instancie le framework.
function UnitTester:new()
  local o = {}
  setmetatable(o, self)
  self.__index = self
  return o
end

local export = UnitTester:new()

--- Exécute les tests.
function export.run_tests(frame)
  return export:run(frame)
end

return export
