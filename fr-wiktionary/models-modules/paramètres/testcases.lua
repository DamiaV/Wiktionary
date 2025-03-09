local tests = require("Module:UnitTests")
local m_params = require("Module:paramètres")

-- Utility functions --

--- Tests wether the "process" method returns the right value
--- for the given arguments.
--- @param args table The arguments passed to the "process" function.
--- @param p table The defined parameters.
--- @param expectedValue table The expected value.
--- @param testName string The test’s name.
local function test(self, args, p, expectedValue, testName)
  self:equals_deep(testName or "", m_params.process(args, p), expectedValue)
end

--- Tests wether the "process" method raise a given error for the given
--- set of arguments. If this is not the case, the test fails. It also
--- tests wether the quiet mode returns the right values.
--- @param args table The arguments passed to the "process" function.
--- @param p table The defined parameters.
--- @param expectedErrorMessage string The expected error message.
--- @param expectedParam table|nil The expected values for quiet mode;
---                                omitting it or passing nil will deactivate the test.
local function handleError(self, testName, args, p, expectedErrorMessage, expectedParam)
  self:expect_error(testName, m_params.process, { args, p }, expectedErrorMessage)

  if expectedParam then
    local result, success = m_params.process(args, p, true)
    table.insert(expectedParam, expectedErrorMessage)
    self:equals_deep(
        "''(Test d’erreur silencieuse)'' Paramètre erroné « " .. expectedParam[1] .. " »",
        { result, success },
        { expectedParam, false }
    )
  end
end

-- Tests --

function tests:testEmptyValue()
  local p = {
    [1] = {},
  }
  local args = {
    [1] = ""
  }
  local e = {
    [1] = nil
  }

  test(self, args, p, e, 'Arg = ""')
end

function tests:testWhitespaceOnlyValue()
  local p = {
    [1] = {},
  }
  local args = {
    [1] = " "
  }
  local e = {
    [1] = nil
  }

  test(self, args, p, e, 'Arg = " "')
end

function tests:testNoArg()
  local p = {
    [1] = {},
  }
  local args = {}
  local e = {}

  test(self, args, p, e, "Argument absent")
end

function tests:testAlias()
  local p = {
    [1] = {},
    ["lang"] = { alias_of = 1 }
  }
  local args = {
    ["lang"] = "test"
  }
  local e = {
    [1] = "test"
  }

  test(self, args, p, e, "Alias défini uniquement")
end

function tests:testAliasToRequired()
  local p = {
    [1] = { required = true },
    ["test"] = { alias_of = 1 }
  }
  local args = {
    ["test"] = "valeur"
  }
  local e = {
    [1] = "valeur"
  }

  test(self, args, p, e, "Alias vers requis, alias renseigné")
end

function tests:testAliasNoOverride()
  local p = {
    [1] = {},
    ["lang"] = { alias_of = 1 }
  }
  local args = {
    [1] = "test",
    ["lang"] = "test2"
  }
  local e = {
    [1] = "test"
  }

  test(self, args, p, e, "Alias et argument de base définis")
end

function tests:testDefault()
  local p = {
    [1] = { default = "test" }
  }
  local args = {}
  local e = {
    [1] = "test"
  }

  test(self, args, p, e, "Valeur par défaut")
end

function tests:testRequiredOnAliasNoArg()
  local p = {
    [1] = { },
    ["test"] = { required = true, alias_of = 1 }
  }
  local args = {}
  local e = {}

  test(self, args, p, e, "Requis et alias, arg de base manquant")
end

function tests:testType()
  local cases = {
    ["number"] = {
      { [1] = { type = m_params.NUMBER } },
      { [1] = "42" },
      { [1] = 42 }
    },
    ["number"] = {
      { [1] = { type = m_params.NUMBER } },
      { [1] = "42.5" },
      { [1] = 42.5 }
    },
    ["number"] = {
      { [1] = { type = m_params.NUMBER } },
      { [1] = "0x1" },
      { [1] = 1 }
    },
    ["int"] = {
      { [1] = { type = m_params.INT } },
      { [1] = "42" },
      { [1] = 42 }
    },
    ["int"] = {
      { [1] = { type = m_params.INT } },
      { [1] = "0x1" },
      { [1] = 1 }
    },
    ["float"] = {
      { [1] = { type = m_params.FLOAT } },
      { [1] = "42.5" },
      { [1] = 42.5 }
    },
    ["float"] = {
      { [1] = { type = m_params.FLOAT } },
      { [1] = "42" },
      { [1] = 42 }
    },
    ["float"] = {
      { [1] = { type = m_params.FLOAT } },
      { [1] = "0x1" },
      { [1] = 1 }
    },
    ["boolean « 1 »"] = {
      { [1] = { type = m_params.BOOLEAN } },
      { [1] = "1" },
      { [1] = true }
    },
    ["boolean « oui »"] = {
      { [1] = { type = m_params.BOOLEAN } },
      { [1] = "oui" },
      { [1] = true }
    },
    ["boolean « vrai »"] = {
      { [1] = { type = m_params.BOOLEAN } },
      { [1] = "vrai" },
      { [1] = true }
    },
    ["boolean « 0 »"] = {
      { [1] = { type = m_params.BOOLEAN } },
      { [1] = "0" },
      { [1] = false }
    },
    ["boolean « non »"] = {
      { [1] = { type = m_params.BOOLEAN } },
      { [1] = "non" },
      { [1] = false }
    },
    ["boolean « faux »"] = {
      { [1] = { type = m_params.BOOLEAN } },
      { [1] = "faux" },
      { [1] = false }
    },
    ["string (type = nil)"] = {
      { [1] = { type = nil } },
      { [1] = "test" },
      { [1] = "test" }
    },
    ["string (type absent)"] = {
      { [1] = {} },
      { [1] = "test" },
      { [1] = "test" }
    }
  }

  for test_name, case in pairs(cases) do
    local p, args, e = case[1], case[2], case[3]
    test(self, args, p, e, test_name)
  end
end

function tests:testRequiredAllowEmpty()
  local p = {
    [1] = { required = true, allow_empty = true }
  }
  local args = {}
  local e = {}

  local result, _ = m_params.process(args, p)
  self:equals_deep("Requis et allow_empty, arg de base manquant", result, e)
  test(self, args, p, e, "Requis et allow_empty, arg de base manquant")
end

function tests:testListPositional()
  tests:ignore()
  local p = {
    [1] = { list = true }
  }
  local args = {
    [1] = "test1",
    [2] = "test2"
  }
  local e = {
    [1] = { "test1", "test2" }
  }

  test(self, args, p, e, "Liste positionnelle")
end

function tests:testListNamed()
  tests:ignore()
  local p = {
    ["e"] = { list = true }
  }
  local args = {
    ["e1"] = "test1",
    ["e2"] = "test2"
  }
  local e = {
    ["e"] = { "test1", "test2" }
  }

  test(self, args, p, e, "Liste nommée")
end

function tests:testListPositionalMaxLength()
  tests:ignore()
  local p = {
    [1] = { list = true, max_length = 3 }
  }
  local args = {
    [1] = "test1",
    [2] = "test2"
  }
  local e = {
    [1] = { "test1", "test2" }
  }

  test(self, args, p, e, "Liste positionnelle")
end

function tests:testListNamed()
  tests:ignore()
  local p = {
    ["e"] = { list = true, max_length = 3 }
  }
  local args = {
    ["e1"] = "test1",
    ["e2"] = "test2"
  }
  local e = {
    ["e"] = { "test1", "test2" }
  }

  test(self, args, p, e, "Liste nommée")
end

function tests:testListPositionalLast()
  tests:ignore()
  local p = {
    [1] = { list = true },
    [-1] = { required = true }
  }
  local args = {
    [1] = "test1",
    [2] = "test2"
  }
  local e = {
    [1] = { "test1", "test2" }
  }

  test(self, args, p, e, "Liste positionnelle, dernier élément")
end

function tests:testListPositionalLastIsAlias()
  tests:ignore()
  local p = {
    [1] = { list = true },
    [-1] = { alias_of = "lang" },
    ["lang"] = { required = true }
  }
  local args = {
    [1] = "test1",
    [2] = "test2",
    [3] = "fr"
  }
  local e = {
    [1] = { "test1", "test2" },
    ["lang"] = "fr"
  }

  test(self, args, p, e, "Liste positionnelle, dernier élément est un alias")
end

function tests:testListPositionalLastIsAlias2()
  tests:ignore()
  local p = {
    [1] = { list = true },
    [-1] = { alias_of = "lang" },
    ["lang"] = { required = true }
  }
  local args = {
    [1] = "test1",
    [2] = "test2",
    ["lang"] = "fr"
  }
  local e = {
    [1] = { "test1", "test2" },
    ["lang"] = "fr"
  }

  test(self, args, p, e, "Liste positionnelle, dernier élément est un alias")
end

function tests:testListNamedLast()
  tests:ignore()
  local p = {
    ["e"] = { list = true },
    ["e-1"] = { required = true }
  }
  local args = {
    ["e1"] = "test1",
    ["e2"] = "test2"
  }
  local e = {
    ["e"] = { "test1", "test2" }
  }

  test(self, args, p, e, "Liste nommée, dernier élément")
end

function tests:testListNamedLastIsAlias()
  tests:ignore()
  local p = {
    ["e"] = { list = true },
    ["e-1"] = { alias_of = "lang" },
    ["lang"] = { required = true }
  }
  local args = {
    ["e1"] = "test1",
    ["e2"] = "test2",
    ["e3"] = "fr"
  }
  local e = {
    ["e"] = { "test1", "test2" },
    ["lang"] = "fr"
  }

  test(self, args, p, e, "Liste nommée, dernier élément est un alias")
end

function tests:testListNamedLastIsAlias2()
  tests:ignore()
  local p = {
    ["e"] = { list = true },
    ["e-1"] = { alias_of = "lang" },
    ["lang"] = { required = true }
  }
  local args = {
    ["e1"] = "test1",
    ["e2"] = "test2",
    ["lang"] = "fr"
  }
  local e = {
    ["e"] = { "test1", "test2" },
    ["lang"] = "fr"
  }

  test(self, args, p, e, "Liste nommée, dernier élément est un alias")
end

function tests:testListPositionalStartNot1()
  tests:ignore()
  local p = {
    [1] = {},
    [2] = { list = true }
  }
  local args = {
    [1] = "test1",
    [2] = "test2",
    [3] = "test3"
  }
  local e = {
    [1] = "test1",
    [2] = { "test2", "test3" }
  }

  test(self, args, p, e, "Liste positionnelle, indice début > 1")
end

function tests:testEnum()
  local p = {
    [1] = { enum = { "a", "b" } }
  }
  local args = {
    [1] = "a"
  }
  local e = {
    [1] = "a"
  }

  test(self, args, p, e, "Énumération")
end

function tests:testEnumNumber()
  local p = {
    [1] = { enum = { 1, 2 }, type = m_params.NUMBER }
  }
  local args = {
    [1] = "1"
  }
  local e = {
    [1] = 1
  }

  test(self, args, p, e, "Énumération de nombres")
end

function tests:testEnumEmptyString()
  local p = {
    [1] = { enum = { "a", nil } }
  }
  local args = {
    [1] = ""
  }
  local e = {
    [1] = nil
  }

  test(self, args, p, e, "Énumération chaine vide")
end

function tests:testEnumNil()
  local p = {
    [1] = { enum = { "a", nil } }
  }
  local args = {
    [1] = nil
  }
  local e = {
    [1] = nil
  }

  test(self, args, p, e, "Énumération nil")
end

function tests:testCheckerString()
  local p = {
    [1] = { checker = function(s)
      return s == "a"
    end }
  }
  local args = {
    [1] = "a"
  }
  local e = {
    [1] = "a"
  }

  test(self, args, p, e, "Prédicat sur chaine")
end

function tests:testCheckerNumber()
  local p = {
    [1] = { type = m_params.NUMBER, checker = function(n)
      return 0 <= n and n < 10
    end }
  }
  local args = {
    [1] = 0
  }
  local e = {
    [1] = 0
  }

  test(self, args, p, e, "Prédicat sur nombre")
end

function tests:testCheckerNoValue()
  local p = {
    [1] = { checker = function(s)
      return s == "a"
    end }
  }
  local args = {
  }
  local e = {
  }

  test(self, args, p, e, "Prédicat sur paramètre non renseigné")
end

-- Error tests --

function tests:testMissingRequired()
  local p = {
    [1] = { required = true }
  }
  local args = {}

  handleError(self, "Paramètre requis manquant", args, p, "Paramètre requis « 1 » absent", { 1, m_params.MISSING_PARAM })
end

function tests:testRequiredEmpty()
  local p = {
    [1] = { required = true }
  }
  local args = {
    [1] = ""
  }

  handleError(self, "Paramètre requis vide", args, p, "Paramètre requis « 1 » vide", { 1, m_params.EMPTY_PARAM })
end

function tests:testUnknown()
  local p = {
    [1] = {}
  }
  local args = {
    [2] = "test"
  }

  handleError(self, "Paramètre inconnu", args, p, "Paramètre « 2 » inconnu", { 2, m_params.UNKNOWN_PARAM })
end

function tests:testInvalidTypeNumber()
  local p = {
    [1] = { type = m_params.NUMBER }
  }
  local args = {
    [1] = "test"
  }

  handleError(self, "Type invalide, nombre", args, p, 'Valeur invalide pour le paramètre « 1 » ("test") de type nombre', { 1, m_params.INVALID_VALUE })
end

function tests:testInvalidTypeInt()
  local p = {
    [1] = { type = m_params.INT }
  }
  local args = {
    [1] = "42.5"
  }

  handleError(self, "Type invalide, entier", args, p, 'Valeur invalide pour le paramètre « 1 » ("42.5") de type entier', { 1, m_params.INVALID_VALUE })
end

function tests:testInvalidTypeFloat()
  local p = {
    [1] = { type = m_params.FLOAT }
  }
  local args = {
    [1] = "test"
  }

  handleError(self, "Type invalide, flottant", args, p, 'Valeur invalide pour le paramètre « 1 » ("test") de type flottant', { 1, m_params.INVALID_VALUE })
end

function tests:testInvalidTypeBoolean()
  local p = {
    [1] = { type = m_params.BOOLEAN }
  }
  local args = {
    [1] = "test"
  }

  handleError(self, "Type invalide, booléen", args, p, 'Valeur invalide pour le paramètre « 1 » ("test") de type booléen', { 1, m_params.INVALID_VALUE })
end

function tests:testCheckerStringInvalid()
  local p = {
    [1] = { checker = function(s)
      return s == "a"
    end }
  }
  local args = {
    [1] = "b"
  }

  handleError(self, "Checker, valeur invalide, chaine", args, p, 'Valeur invalide pour le paramètre « 1 » ("b") de type chaine', { 1, m_params.INVALID_VALUE })
end

function tests:testCheckerNumberInvalid()
  local p = {
    [1] = { type = m_params.NUMBER, checker = function(n)
      return 0 <= n and n < 10
    end }
  }
  local args = {
    [1] = -1
  }

  handleError(self, "Checker, valeur invalide, nombre", args, p, 'Valeur invalide pour le paramètre « 1 » ("-1") de type nombre', { 1, m_params.INVALID_VALUE })
end

function tests:testCheckerThroughAlias()
  local p = {
    [1] = { checker = function(n)
      return n == "a"
    end },
    ["test"] = { alias_of = 1 }
  }
  local args = {
    ["test"] = "b"
  }

  handleError(self, "Checker, valeur invalide, alias", args, p, 'Valeur invalide pour le paramètre « test » ("b") de type chaine', { "test", m_params.INVALID_VALUE })
end

function tests:testTypeThroughAlias()
  local p = {
    [1] = { type = m_params.INT },
    ["test"] = { alias_of = 1 }
  }
  local args = {
    ["test"] = "test"
  }

  handleError(self, "Type, valeur invalide, alias", args, p, 'Valeur invalide pour le paramètre « test » ("test") de type entier', { "test", m_params.INVALID_VALUE })
end

function tests:testListPositionalLastMissing()
  tests:ignore()
  local p = {
    [1] = { list = true },
    [-1] = { required = true }
  }
  local args = {}

  handleError(self, "Liste positionnelle, dernier requis manquant", args, p, 'Paramètre requis « -1 » absent', { -1, m_params.MISSING_PARAM })
end

function tests:testListNamedLastMissing()
  tests:ignore()
  local p = {
    ["e"] = { list = true },
    ["e-1"] = { required = true }
  }
  local args = {}

  handleError(self, "Liste nommée, dernier requis manquant", args, p, 'Paramètre requis « e-1 » absent', { "e-1", m_params.MISSING_PARAM })
end

function tests:testListPositionalMaxLengthExceeded()
  tests:ignore()
  local p = {
    [1] = { list = true, max_length = 3 }
  }
  local args = {
    [1] = "test1",
    [2] = "test2",
    [3] = "test3",
    [4] = "test4",
  }

  handleError(self, "Liste positionnelle, taille max dépassée", args, p, 'Taille de la liste « 1 » dépassée (4 > 3)', { "1", m_params.LIST_SIZE_EXCEEDED })
end

function tests:testListNamedMaxLengthExceeded()
  tests:ignore()
  local p = {
    ["e"] = { list = true, max_length = 3 }
  }
  local args = {
    ["e1"] = "test1",
    ["e2"] = "test2",
    ["e3"] = "test3",
    ["e4"] = "test4",
  }

  handleError(self, "Liste nommée, taille max dépassée", args, p, 'Taille de la liste « e » dépassée (4 > 3)', { "e", m_params.LIST_SIZE_EXCEEDED })
end

function tests:testListPositionalDuplicates()
  tests:ignore()
  local p = {
    [1] = { list = true, no_duplicates = true }
  }
  local args = {
    [1] = "test1",
    [2] = "test1",
  }

  handleError(self, "Liste positionnelle, pas de doublons", args, p, 'Valeur en double dans la liste « 1 »', { "e", m_params.DUPLICATE_VALUE })
end

function tests:testListNamedDuplicates()
  tests:ignore()
  local p = {
    ["e"] = { list = true, no_duplicates = true }
  }
  local args = {
    ["e1"] = "test1",
    ["e2"] = "test1",
  }

  handleError(self, "Liste nommée, pas de doublons", args, p, 'Valeur en double dans la liste « e »', { "e", m_params.DUPLICATE_VALUE })
end

function tests:testEnumInvalidValue()
  local p = {
    [1] = { enum = { "a", "b" } }
  }
  local args = {
    [1] = "c"
  }

  handleError(self, "Énumération, valeur invalide", args, p, 'Valeur invalide pour le paramètre « 1 » ("c")', { 1, m_params.VALUE_NOT_IN_ENUM })
end

function tests:testEnumInvalidTypeNumber()
  local p = {
    [1] = { enum = { 1, 2 }, type = m_params.NUMBER }
  }
  local args = {
    [1] = "a"
  }

  handleError(self, "Énumération, valeur invalide, nombre", args, p, 'Valeur invalide pour le paramètre « 1 » ("a") de type nombre', { 1, m_params.INVALID_VALUE })
end

-- Internal errors --

function tests:testListPositionalArgOverlap()
  tests:ignore()
  local p = {
    [1] = { list = true },
    [2] = {}
  }
  local args = {
    [1] = "test1"
  }

  handleError(self, "Conflit paramètre et liste positionnelle", args, p, "Erreur interne : Paramètre « 2 » déjà défini par la liste « 1 »", { "e1", m_params.LIST_PARAM_OVERLAP })
end

function tests:testListNamedArgOverlap()
  tests:ignore()
  local p = {
    ["e"] = { list = true },
    ["e1"] = {}
  }
  local args = {
    ["e1"] = "test1"
  }

  handleError(self, "Conflit paramètre et liste nommée", args, p, "Erreur interne : Paramètre « e1 » déjà défini par la liste « e »", { "e1", m_params.LIST_PARAM_OVERLAP })
end

function tests:testUnknownType()
  local p = {
    [1] = { type = "test" }
  }
  local args = {
    [1] = "test"
  }

  handleError(self, "Type inconnu", args, p, 'Erreur interne : Type inconnu pour le paramètre « 1 » ("test")')
  handleError(self, "Type inconnu, pas args", {}, p, 'Erreur interne : Type inconnu pour le paramètre « 1 » ("test")')
end

function tests:testAliasToNonexistant()
  local p = {
    [1] = { alias_of = 2 }
  }
  local args = {
    [1] = "test"
  }

  handleError(self, "Alias vers non défini", args, p, "Erreur interne : Paramètre « 1 », alias vers un paramètre non défini « 2 »")
  handleError(self, "Alias vers non défini, pas args", {}, p, "Erreur interne : Paramètre « 1 », alias vers un paramètre non défini « 2 »")
end

function tests:testAliasToAlias()
  local p = {
    [1] = {},
    [2] = { alias_of = 1 },
    [3] = { alias_of = 2 }
  }
  local args = {
    [1] = "test"
  }

  handleError(self, "Alias vers alias", args, p, "Erreur interne : Paramètre « 3 », alias vers un autre alias (« 2 »)")
  handleError(self, "Alias vers alias, pas args", {}, p, "Erreur interne : Paramètre « 3 », alias vers un autre alias (« 2 »)")
end

function tests:testAliasToItself()
  local p = {
    [1] = { alias_of = 1 }
  }
  local args = {
    [1] = "test"
  }

  handleError(self, "Alias vers lui-même", args, p, "Erreur interne : Paramètre « 1 », alias vers lui-même")
  handleError(self, "Alias vers lui-même, pas args", {}, p, "Erreur interne : Paramètre « 1 », alias vers lui-même")
end

function tests:testEnumAndChecker()
  local p = {
    [1] = { enum = { "a", "b" }, checker = function(_)
      return true
    end }
  }
  local args = {
    [1] = "a"
  }

  handleError(self, "Énumération et checker", args, p, "Erreur interne : Le paramètre « 1 » est une énumération avec une précondition")
  handleError(self, "Énumération et checker, pas args", {}, p, "Erreur interne : Le paramètre « 1 » est une énumération avec une précondition")
end

function tests:testEnumInvalidValues()
  local p = {
    [1] = { enum = { 1, 2 } }
  }
  local args = {
    [1] = "a"
  }

  handleError(self, "Énumération, valeur invalide", args, p, 'Erreur interne : Valeur énumérée invalide pour le paramètre « 1 » ("1") de type chaine')
end

function tests:testEnumInvalidValuesNumber()
  local p = {
    [1] = { enum = { "a", "b" }, type = m_params.NUMBER }
  }
  local args = {
    [1] = "1"
  }

  handleError(self, "Énumération, valeur invalide, nombre", args, p, 'Erreur interne : Valeur énumérée invalide pour le paramètre « 1 » ("a") de type nombre')
end

function tests:testEnumInvalidValuesInt()
  local p = {
    [1] = { enum = { "a", "b" }, type = m_params.INT }
  }
  local args = {
    [1] = "1"
  }

  handleError(self, "Énumération, valeur invalide, entier", args, p, 'Erreur interne : Valeur énumérée invalide pour le paramètre « 1 » ("a") de type entier')
end

function tests:testEnumInvalidValuesFloat()
  local p = {
    [1] = { enum = { "a", "b" }, type = m_params.FLOAT }
  }
  local args = {
    [1] = "1.0"
  }

  handleError(self, "Énumération, valeur invalide, flottant", args, p, 'Erreur interne : Valeur énumérée invalide pour le paramètre « 1 » ("a") de type flottant')
end

function tests:testEnumInvalidValuesBoolean()
  local p = {
    [1] = { enum = { "a", "b" }, type = m_params.BOOLEAN }
  }
  local args = {
    [1] = "vrai"
  }

  handleError(self, "Énumération, valeur invalide, booléen", args, p, 'Erreur interne : Valeur énumérée invalide pour le paramètre « 1 » ("a") de type booléen')
end

return tests
