local data = {
  letters = {
    ["Ა"] = {
      diacritics = { { "Ა̄", "ა̄" }, { "Ა̈", "ა̈" }, { "Ა̄̈", "ა̄̈" }, },
    },
    ["Გ"] = {
      variants = { { "Ჹ", "ჹ" }, },
    },
    ["Ე"] = {
      diacritics = { { "Ე̄", "ე̄" }, },
    },
    ["Ი"] = {
      diacritics = { { "Ი̄", "ი̄" }, },
    },
    ["Ნ"] = {
      variants = { { "ჼ" }, },
    },
    ["Ო"] = {
      diacritics = { { "Ო̈", "ო̈" }, { "Ო̄", "ო̄" }, { "Ო̄̈", "ო̄̈" }, },
    },
    ["Უ"] = {
      diacritics = { { "Უ̂", "უ̂" }, { "Უ̈", "უ̈" }, { "Უ̄", "უ̄" }, { "Უ̄̈", "უ̄̈" }, },
    },
  },
  diacritics = {
    ["circonflexe"] = {
      title = "Lettres avec [[accent circonflexe]]",
      entries = { { "Უ̂", "უ̂" }, },
    },
    ["tréma"] = {
      title = "Lettres avec [[tréma]] ([[diérèse]])",
      entries = { { "Ა̈", "ა̈" }, { "Ო̈", "ო̈" }, { "Უ̈", "უ̈" }, { "Ა̄̈", "ა̄̈" }, { "Ო̄̈", "ო̄̈" }, { "Უ̄̈", "უ̄̈" }, },
    },
    ["macron"] = {
      title = "Lettres avec [[macron]]",
      entries = { { "Ა̄", "ა̄" }, { "Ე̄", "ე̄" }, { "Ი̄", "ი̄" }, { "Ო̄", "ო̄" }, { "Უ̄", "უ̄" }, { "Ა̄̈", "ა̄̈" }, { "Ო̄̈", "ო̄̈" }, { "Უ̄̈", "უ̄̈" }, },
    },
    ------------------------
    ["culbuté"] = {
      title = "Lettres [[culbuté#fr|culbutées]]",
      entries = { { "Ჹ", "ჹ" }, },
    },
  }
}

return data
