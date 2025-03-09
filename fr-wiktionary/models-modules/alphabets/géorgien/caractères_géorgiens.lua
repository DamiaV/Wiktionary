local data = {
  ["wide characters"] = {},
  ["extensions"] = {},
  ["letters"] = {
    ["ა"] = {
      ["diacritics"] = { { "Ა̄", "ა̄" }, { "Ა̈", "ა̈" }, { "Ა̄̈", "ა̄̈" } },
      ["variants"] = {}
    },
    ["გ"] = {
      ["diacritics"] = {},
      ["variants"] = { { "Ჹ", "ჹ" } }
    },
    ["ე"] = {
      ["diacritics"] = { { "Ე̄", "ე̄" } },
      ["variants"] = {}
    },
    ["ი"] = {
      ["diacritics"] = { { "Ი̄", "ი̄" } },
      ["variants"] = {}
    },
    ["ნ"] = {
      ["diacritics"] = {},
      ["variants"] = { { "ჼ" } }
    },
    ["ო"] = {
      ["diacritics"] = { { "Ო̈", "ო̈" }, { "Ო̄", "ო̄" }, { "Ო̄̈", "ო̄̈" } },
      ["variants"] = {}
    },
    ["უ"] = {
      ["diacritics"] = { { "Უ̂", "უ̂" }, { "Უ̈", "უ̈" }, { "Უ̄", "უ̄" }, { "Უ̄̈", "უ̄̈" } },
      ["variants"] = {}
    },
  },
  ["diacritics"] = {
    ["circonflexe"] = {
      ["title"] = "Lettres avec [[accent circonflexe]]",
      ["entries"] = { { "Უ̂", "უ̂" } }
    },
    ["tréma"] = {
      ["title"] = "Lettres avec [[tréma]] ([[diérèse]])",
      ["entries"] = { { "Ა̈", "ა̈" }, { "Ო̈", "ო̈" }, { "Უ̈", "უ̈" }, { "Ა̄̈", "ა̄̈" }, { "Ო̄̈", "ო̄̈" }, { "Უ̄̈", "უ̄̈" } }
    },
    ["macron"] = {
      ["title"] = "Lettres avec [[macron]]",
      ["entries"] = { { "Ა̄", "ა̄" }, { "Ე̄", "ე̄" }, { "Ი̄", "ი̄" }, { "Ო̄", "ო̄" }, { "Უ̄", "უ̄" }, { "Ა̄̈", "ა̄̈" }, { "Ო̄̈", "ო̄̈" }, { "Უ̄̈", "უ̄̈" } }
    },
    ------------------------
    ["culbuté"] = {
      ["title"] = "Lettres [[culbuté#fr|culbutées]]",
      ["entries"] = { { "Ჹ", "ჹ" } }
    }
  }
}

return data
