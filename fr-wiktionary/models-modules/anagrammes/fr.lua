return {
  -- List of characters to keep unchanged, empty for French
  keep = {},
  -- Table of character transformations, meant for characters without diacritics (ligatures, etc.)
  mappings = {
    ["æ"] = "ae",
    ["œ"] = "oe",
  },
}
