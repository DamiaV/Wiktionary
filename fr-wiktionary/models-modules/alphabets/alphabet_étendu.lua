local bases = require("Module:bases")
local p = {}

local DIACRITICS_TITLE = 0
local VARIANTS_TITLE = 1
local CUSTOM_TITLE = 2

--- Indique si un tableau contient une certaine valeur.
--- @param array table : Le tableau dans lequel chercher la valeur.
--- @param value string : La valeur à chercher.
--- @return boolean Vrai si la valeur est présente dans le tableau.
local function contains_value(array, value)
  for _, v in ipairs(array) do
    if v == value then
      return true
    end
  end
  return false
end

--- Supprime les valeurs vides (= "") de la liste donnée.
--- @param t table : Le tableau à filtrer.
--- @return table Le tableau filtré.
local function remove_empty_values(t)
  local tt = {}
  for _, v in ipairs(t) do
    if v ~= "" then
      table.insert(tt, v)
    end
  end
  return tt
end

--- Formate un le titre donné.
--- @param title string : Le titre.
--- @param title_type number :
---  Une de ces trois valeurs :
---  - DIACRITICS_TITLE : Affiche "Lettre <title> avec [[diacritique]]s"
---  - VARIANTS_TITLE : Affiche "Variantes de la lettre <title>"
---  - CUSTOM_TITLE : Affiche le titre donné
--- @return string Le titre formaté.
local function format_title(title, title_type)
  local base_start = "<div style=\"clear: both; background: #efefef; text-align: center\">'''"
  local base_end = "'''</div>"
  if title_type == CUSTOM_TITLE then
    return base_start .. title .. base_end
  elseif title_type == VARIANTS_TITLE then
    return base_start .. "Variantes de la lettre " .. mw.ustring.upper(title) .. base_end
  else
    return base_start .. mw.ustring.format("Lettre %s avec %s", mw.ustring.upper(title),
        bases.lien_modele("diacritique", "fr", "", "diacritiques")) .. base_end
  end
end

--- Formate un tuple de caractères.
--- @param c1 string : Premier caractère (obligatoire).
--- @param c2 string : Deuxième caractère (optionnel si c3 est nil).
--- @param c3 string : Troisième caractère (optionnel).
--- @param wide_chars table : Une liste de caractères auxquels allouer un espace plus grand (4.2em au lieu de 2.1em).
--- @return string Le tuple formaté.
local function format_characters(c1, c2, c3, wide_chars)
  if c3 ~= nil then
    return '<span style="float:left;width:4.2em">' .. bases.lien_modele(c1, "") .. bases.lien_modele(c2, "") ..
        bases.lien_modele(c3, "") .. "</span>"
  elseif c2 ~= nil then
    local width = "2.1"
    if contains_value(wide_chars, c1) then
      width = "4.2"
    end
    return mw.ustring.format('<span style="float: left; width: %fem">%s%s</span>',
        width, bases.lien_modele(c1, ""), bases.lien_modele(c2, ""))
  else
    return '<span style="float: left; width: 2.1em">' .. bases.lien_modele(c1, "") .. "</span>"
  end
end

--- Affiche une table avec son titre et la liste des caractères.
--- @param title string : Le titre de la section.
--- @param letter_list string : La liste des lettres.
--- @param title_type string : Le type de titre (cf. format_title).
--- @param wide_chars string : Cf. format_characters.
--- @return string La table en HTML.
local function format_table(title, letter_list, title_type, wide_chars)
  local result = format_title(title, title_type) .. '<div style="text-align:center">'
  for _, letters in ipairs(letter_list) do
    result = result .. format_characters(letters[1], letters[2], letters[3], wide_chars)
  end
  return result .. "</div>"
end

--- Affiche les sections en rapport avec le caractère donné.
---  frame.args[1] : Nom de la langue du module de données à charger
---  frame.args[2,] : Sections (lettre, diacritiques, ligatures, etc.)
function p.table(frame)
  local data = mw.loadData("Module:caractères " .. frame.args[1] .. "s")
  local wide_chars = data["wide characters"]
  local args = remove_empty_values(frame.args)
  local result = ""

  -- Tables des caractères supplémentaires
  for _, array in pairs(data["extensions"]) do
    result = result .. format_table(array["title"], array["entries"], CUSTOM_TITLE, wide_chars)
  end

  -- Tables des diacritiques/variantes
  for i, arg in ipairs(args) do
    if i == 2 then
      local entry = data["letters"][mw.ustring.upper(arg)]
      if entry ~= nil then
        local diacritics = entry["diacritics"]
        local variants = entry["variants"]

        if diacritics[1] ~= nil then
          result = result .. format_table(arg, diacritics, DIACRITICS_TITLE, wide_chars)
        end
        if variants[1] ~= nil then
          result = result .. format_table(arg, variants, VARIANTS_TITLE, wide_chars)
        end
      end
    elseif i > 2 then
      local entry = data["diacritics"][arg]
      if entry ~= nil then
        result = result .. format_table(entry["title"], entry["entries"], CUSTOM_TITLE, wide_chars)
      end
    end
  end

  return result
end

return p
