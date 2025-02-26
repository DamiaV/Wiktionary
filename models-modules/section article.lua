local m_bases = require('Module:bases')
local titles = mw.loadData('Module:section article/data')

local p = {}

-- Récupère un objet pour le type de section demandé
local function _getWordType(word)
  if word == nil then
    return nil
  end

  -- Pour chercher dans les listes, on autorise éventuellement les majuscules en début de mot
  word = m_bases.lcfirst(word)

  -- Alias?
  if p.is_alias(word) then
    word = titles['alias'][word]
  end

  -- Titre défini?
  if titles['texte'][word] ~= nil then
    return titles['texte'][word]
  else
    return nil
  end
end

-- S'agit-il d'un alias?
function p.is_alias(word)
  if word == nil then
    return nil
  end

  word = m_bases.lcfirst(word)

  return titles['alias'][word]
end

-- S'agit-il d'un titre de section reconnu (ou d'un alias) ?
function p.is_titre(word)
  if word == nil then
    return nil
  end

  -- Récupération de l'objet correspondant à ce type de mot, s'il existe
  return _getWordType(word) ~= nil
end

-- Fonction de récupération du nom standard à partir de son code et de ses propriétés
function p.get_nom_section(word)
  if word == nil then
    return nil
  end

  -- Récupération de l'objet correspondant à ce type de mot, s'il existe
  local wordType = _getWordType(word)

  -- L'objet existe, on peut renvoyer son nom
  if wordType ~= nil then
    return wordType['nom']
  else
    return nil
  end
end

-- Fonction de récupération de la classe d'un titre
function p.get_class(word)
  if word == nil then
    return nil
  end

  -- Récupération de l'objet correspondant à ce type de mot, s'il existe
  local wordType = _getWordType(word)

  -- L'objet existe, on peut renvoyer sa classe
  if wordType ~= nil then
    return wordType['class']
  else
    return nil
  end
end

-- Fonction de récupération de la catégorie d'un titre
function p.get_category(word)
  if word == nil then
    return nil
  end

  -- Récupération de l'objet correspondant à ce type de mot, s'il existe
  local wordType = _getWordType(word)

  -- L'objet existe, on peut renvoyer sa catégorie
  if wordType ~= nil then
    return wordType['category']
  else
    return nil
  end
end

-- Fonction de récupération de la catégorie d'un titre
function p.get_infobulle(word)
  if word == nil then
    return nil
  end

  -- Récupération de l'objet correspondant à ce type de mot, s'il existe
  local wordType = _getWordType(word)

  -- L'objet existe, on peut renvoyer son infobulle
  if wordType ~= nil and wordType['infobulle'] ~= nil then
    return wordType['infobulle']
  else
    return nil
  end
end

return p
