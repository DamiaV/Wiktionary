local tests = require("Module:UnitTests")
-- Suppression de l’entrée pour pouvoir charger le module une deuxième fois.
package.loaded["Module:UnitTests"] = nil
local m_tests = require("Module:UnitTests")

-- Fonctions utilitaires --

local function test(testName, functionName, actual, expected, expectedResultsTable)
  local testedTestName = "test"
  m_tests.resultsTable = {}
  getmetatable(m_tests).__index[functionName](m_tests, testedTestName, actual, expected)
  tests:equals_deep(testName, m_tests.resultsTable, {
    {
      testName = testedTestName,
      success = expectedResultsTable.success,
      actual = expectedResultsTable.actual,
      expected = expectedResultsTable.expected,
    }
  })
end

local function testError(testName, func, args, expectedErrorMessage, expectedResultsTable)
  local testedTestName = "test"
  m_tests.resultsTable = {}
  m_tests:expect_error(testedTestName, func, args, expectedErrorMessage)
  tests:equals_deep(testName, m_tests.resultsTable, {
    {
      testName = "''(Test d’erreur)'' " .. testedTestName,
      success = expectedResultsTable.success,
      actual = expectedResultsTable.actual,
      expected = expectedResultsTable.expected,
    }
  })
end

-- Tests --

function tests:test_equals_strings()
  test("equals(), chaines", "equals", "a", "a", {
    success = true,
    actual = "a",
    expected = "a",
  })
end

function tests:test_equals_numbers()
  test("equals(), nombres", "equals", 1, 1, {
    success = true,
    actual = "1",
    expected = "1",
  })
end

function tests:test_equals_booleans()
  test("equals(), booléens", "equals", true, true, {
    success = true,
    actual = "true",
    expected = "true",
  })
end

function tests:test_equals_nil()
  test("equals(), nil", "equals", nil, nil, {
    success = true,
    actual = "''nil''",
    expected = "''nil''",
  })
end

function tests:test_equals_deep_not_table()
  test("equals_deep(), pas une table", "equals_deep", 1, 1, {
    success = true,
    actual = "1",
    expected = "1",
  })
end

function tests:test_equals_deep_1_level()
  local testName = "test"
  test("equals_deep(), 1 niveau", "equals_deep", { 1 }, { 1 }, {
    testName = testName,
    success = true,
    actual = "&#123;1&#125;",
    expected = "&#123;1&#125;",
  })
end

function tests:test_equals_deep_1_level_keys()
  test("equals_deep(), 1 niveau", "equals_deep", { a = 1 }, { a = 1 }, {
    success = true,
    actual = "&#123;a&#61;1&#125;",
    expected = "&#123;a&#61;1&#125;",
  })
end

function tests:test_equals_deep_2_levels()
  test("equals_deep(), 2 niveaux", "equals_deep", { { 1 } }, { { 1 } }, {
    success = true,
    actual = "&#123;&#123;1&#125;&#125;",
    expected = "&#123;&#123;1&#125;&#125;",
  })
end

function tests:test_equals_deep_2_levels_keys()
  test("equals_deep(), 2 niveaux", "equals_deep", { a = { b = 1 } }, { a = { b = 1 } }, {
    success = true,
    actual = "&#123;a&#61;&#123;b&#61;1&#125;&#125;",
    expected = "&#123;a&#61;&#123;b&#61;1&#125;&#125;",
  })
end

function tests:test_ignore_flag()
  m_tests:ignore()
  self:equals("ignore() flag", m_tests.ignoreCurrentTests, true)
end

-- Tests négatifs --

function tests:test_not_equals_strings()
  test("equals() négatif, chaines", "equals", "b", "a", {
    success = false,
    actual = "b",
    expected = "a",
  })
end

function tests:test_not_equals_numbers()
  test("equals() négatif, nombres", "equals", 2, 1, {
    success = false,
    actual = "2",
    expected = "1",
  })
end

function tests:test_not_equals_booleans()
  test("equals() négatif, booléens", "equals", false, true, {
    success = false,
    actual = "false",
    expected = "true",
  })
end

function tests:test_not_equals_nil()
  test("equals() négatif, nil", "equals", "nil", nil, {
    success = false,
    actual = "nil",
    expected = "''nil''",
  })
end

function tests:test_not_equals_deep_not_table()
  test("equals_deep() négatif, pas une table", "equals_deep", 2, 1, {
    success = false,
    actual = "2",
    expected = "1",
  })
end

function tests:test_not_equals_deep_1_level()
  test("equals_deep() négatif, 1 niveau", "equals_deep", { 2 }, { 1 }, {
    success = false,
    actual = "&#123;2&#125;",
    expected = "&#123;1&#125;",
  })
end

function tests:test_not_equals_deep_1_level_2_elements()
  test("equals_deep() négatif, 1 niveau, 2 éléments", "equals_deep", { 2, 1 }, { 1, 2 }, {
    success = false,
    actual = "&#123;2, 1&#125;",
    expected = "&#123;1, 2&#125;",
  })
end

function tests:test_not_equals_deep_1_level_keys_same_values_diff()
  test("equals_deep() négatif, 1 niveau, clés identiques, valeurs différentes", "equals_deep", { a = 2 }, { a = 1 }, {
    success = false,
    actual = "&#123;a&#61;2&#125;",
    expected = "&#123;a&#61;1&#125;",
  })
end

function tests:test_not_equals_deep_1_level_keys_diff_values_same()
  test("equals_deep() négatif, 1 niveau, clés différentes, valeurs identiques", "equals_deep", { b = 1 }, { a = 1 }, {
    success = false,
    actual = "&#123;b&#61;1&#125;",
    expected = "&#123;a&#61;1&#125;",
  })
end

function tests:test_not_equals_deep_2_levels()
  test("equals_deep() négatif, 2 niveaux, valeurs différentes", "equals_deep", { { 2 } }, { { 1 } }, {
    success = false,
    actual = "&#123;&#123;2&#125;&#125;",
    expected = "&#123;&#123;1&#125;&#125;",
  })
end

function tests:test_not_equals_deep_2_levels_keys()
  test("equals_deep() négatif, 2 niveaux, clés différentes", "equals_deep", { b = { a = 1 } }, { a = { b = 1 } }, {
    success = false,
    actual = "&#123;b&#61;&#123;a&#61;1&#125;&#125;",
    expected = "&#123;a&#61;&#123;b&#61;1&#125;&#125;",
  })
end

-- Tests expect_error --

function tests:test_expect_error()
  local errorMessage = "Erreur"
  m_tests.resultsTable = {}
  testError("expect_error()", function()
    error(errorMessage)
  end, {}, errorMessage, {
    success = true,
    actual = errorMessage,
    expected = errorMessage,
  })
end

function tests:test_expect_error_wrong_error()
  local errorMessage = "Erreur"
  local errorMessage2 = "Error"
  m_tests.resultsTable = {}
  testError("expect_error(), mauvaise erreur", function()
    error(errorMessage2)
  end, {}, errorMessage, {
    success = false,
    actual = errorMessage2,
    expected = errorMessage,
  })
end

function tests:test_expect_error_no_error()
  local errorMessage = "Erreur"
  m_tests.resultsTable = {}
  testError("expect_error(), pas d’erreur", function()
    return true
  end, {}, errorMessage, {
    success = false,
    actual = "true",
    expected = errorMessage,
  })
end

return tests
