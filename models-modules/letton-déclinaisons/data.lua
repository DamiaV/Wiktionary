-- This table contains the data for each latvian noun declension.
-- Its structure is as follows:
-- ["<declension>-<ending>"] = { endings = { <endings for each case> }, vsMayDropEnding = <true|false> }
-- The vsMayDropEnding property indicates whether the vocative singular form
-- may lose its last letter in some circumstances.
return {
  ["1-s"] = {
    endings = {
      n = { "s", "i" },
      a = { "u", "us" },
      g = { "a", "u" },
      d = { "am", "iem" },
      i = { "u", "em" },
      l = { "ā", "os" },
      v = { "s", "i" },
    },
    vsMayDropEnding = true,
  },
  ["1-š"] = {
    endings = {
      n = { "š", "i" },
      a = { "u", "us" },
      g = { "a", "u" },
      d = { "am", "iem" },
      i = { "u", "em" },
      l = { "ā", "os" },
      v = { "š", "i" },
    },
    vsMayDropEnding = true,
  },
  ["2-is"] = {
    endings = {
      n = { "is", "i", palatal = { 2 } },
      a = { "i", "us", palatal = { 2 } },
      g = { "a", "u", palatal = { 1, 2 } },
      d = { "im", "iem", palatal = { 2 } },
      i = { "i", "iem", palatal = { 2 } },
      l = { "ī", "os", palatal = { 2 } },
      v = { "i", "i", palatal = { 2 } },
    },
    vsMayDropEnding = true,
  },
  ["2-ns"] = {
    endings = {
      n = { "ns", "ņi" },
      a = { "ni", "ņus" },
      g = { "ns", "ņu" },
      d = { "nim", "ņiem" },
      i = { "ni", "ņiem" },
      l = { "nī", "ņos" },
      v = { "ni", "ņi" },
    },
    vsMayDropEnding = true,
  },
  ["2-ss"] = {
    endings = {
      n = { "ss", "ši" },
      a = { "si", "šus" },
      g = { "ss", "šu" },
      d = { "sim", "šiem" },
      i = { "si", "šiem" },
      l = { "sī", "šos" },
      v = { "si", "ši" },
    },
    vsMayDropEnding = true,
  },
  ["3-us"] = {
    endings = {
      n = { "us", "i" },
      a = { "u", "us" },
      g = { "us", "u" },
      d = { "um", "iem" },
      i = { "u", "iem" },
      l = { "ū", "os" },
      v = { "us", "i" },
    },
  },
  ["4-a"] = {
    endings = {
      n = { "a", "as" },
      a = { "u", "as" },
      g = { "as", "u" },
      d = { "ai", "ām" },
      i = { "u", "ām" },
      l = { "ā", "ās" },
      v = { "a", "as" },
    },

    vsMayDropEnding = true,
  },
  ["5-e"] = {
    endings = {
      n = { "e", "es" },
      a = { "i", "es" },
      g = { "es", "u", palatal = { 2 } },
      d = { "ei", "ēm" },
      i = { "i", "ēm" },
      l = { "ē", "ēs" },
      v = { "e", "es" },
    },
    vsMayDropEnding = true,
  },
  ["6-s"] = {
    endings = {
      n = { "s", "is" },
      a = { "i", "is" },
      g = { "s", "u", palatal = { 2 } },
      d = { "ij", "īm" },
      i = { "i", "īm" },
      l = { "ī", "īs" },
      v = { "s", "is" },
    },
  },
}
