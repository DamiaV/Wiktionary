local m_bases = require('Module:bases')
local m_langs = require('Module:langues')
local m_params = require('Module:paramètres')

local p = {}

-- TODO vérifier le format du nombre /^M{0,3}(D?C{1,3}|C?D|CM)?(L?X{1,3}|X?L|XC)?(V?I{1,3}|I?V|IX)?$/
--- Convertit un nombre romain en entier.
--- @param romanNumber string Le nombre romain à convertir.
--- @return number L’entier correspondant ou nil si le paramèter n’est pas un nombre romain.
local function fromRoman(romanNumber)
  -- Check if arg is a valid roman numeral
  local pattern = "^M{0,3}(D?C{1,3}|C?D|CM)?(L?X{1,3}|X?L|XC)?(V?I{1,3}|I?V|IX)?$" -- FIXME pas de {n,m} ni |
  if not romanNumber or not mw.ustring.gmatch(romanNumber, pattern) then
    return nil;
  end
  local digitValues = {
    ['I'] = 1,
    ['V'] = 5,
    ['X'] = 10,
    ['L'] = 50,
    ['C'] = 100,
    ['D'] = 500,
    ['M'] = 1000,
  }

  local n = 0
  local prevDigit = 0
  for i = 1, mw.ustring.len(romanNumber) do
    local digit = digitValues[mw.ustring.sub(romanNumber, i, i)]

    n = n + digit
    -- Cases: IV, IX, XL, XC, etc.
    if digit == 5 * prevDigit or digit == 10 * prevDigit then
      n = n - 2 * prevDigit
    end
    prevDigit = digit
  end

  return n
end

--- Formate un siècle en chiffres romains et y ajoute le "ième" et le "siècle".
--- @param romanNumber string Le siècle en chiffres romains.
--- @return string Le siècle formaté.
local function formatCentury(romanNumber)
  --- Met un texte en exposant.
  local function superscript(text)
    return '<sup style="font-size:83%;line-height:1">' .. text .. '</sup>'
  end

  local text = mw.ustring.format('<abbr title="%d"><small>%s</small></abbr>', fromRoman(romanNumber), romanNumber)
  if romanNumber == 'I' then
    text = text .. superscript('er')
  else
    text = text .. superscript('e')
  end

  return text .. ' siècle'
end

--- Formate une chaine contenant au plus un siècle en chiffres romains.
--- @param text string Le texte à formater.
--- @return string Le texte formaté.
local function formatStringContainingCentury(text)
  local startIndex, endIndex
  -- Recherche de la séquence de chiffres romains suivie d’une ponctuation (%p) ou d’une espace (%s).
  -- L’espace ajoutée à la fin sert à prendre en compte la fin de ligne.
  startIndex, endIndex = mw.ustring.find(text .. ' ', '[IVX]+[%s%p]')
  -- Si pas trouvé, i et j valent nil
  if startIndex then
    -- Espace ou ponctuation terminale ne fait pas partie du résultat utile
    local s = formatCentury(mw.ustring.sub(text, startIndex, endIndex - 1))
    return mw.ustring.sub(text, 1, startIndex - 1) .. s .. mw.ustring.sub(text, endIndex)
  else
    return text
  end
end

--- Formate une chaine contenant au plus un siècle en chiffres romains.
---  frame.args[1] (string) : Le texte à formater.
---  frame.args[lang] (string) : La langue de la section dans laquelle se trouve le modèle {{siècle}}.
--- @return string Le texte formaté.
function p.formate_un_siecle(frame)
  local args = m_params.process(frame.args, {
    [1] = {},
    ['lang'] = { checker = function(value)
      return m_langs.get_nom(value) ~= nil
    end },
  })
  local text = args[1]

  -- Cas de l’absence de paramètre (un paramètre égal à "?" est traité comme pas de paramètre).
  if text == nil or text == '?' then
    local categoryName = 'Dates manquantes'
    local langCode = args['lang']

    if langCode == nil or langCode == '' then
      categoryName = categoryName .. ' sans langue précisée'
    else
      local langName = m_langs.get_nom(mw.text.trim(langCode))
      categoryName = categoryName .. ' en ' .. langName
    end

    return 'Siècle à préciser' .. m_bases.fait_categorie_contenu(categoryName)
  end

  return formatStringContainingCentury(text)
end

return p
