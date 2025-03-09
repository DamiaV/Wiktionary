local p = {}
local locale = mw.language.new('fr')
local currentTitle = mw.title.getCurrentTitle()

-- Namespaces

p.NS_MEDIA = {
  id = -2,
  canonical_name = 'Media',
  local_name = 'Média',
}
p.NS_SPECIAL = {
  id = -1,
  canonical_name = 'Special',
  local_name = 'Spécial',
}
p.NS_MAIN = {
  id = 0,
  canonical_name = '',
  local_name = '',
}
p.NS_TALK = {
  id = 1,
  canonical_name = 'Talk',
  local_name = 'Discussion',
}
p.NS_USER = {
  id = 2,
  canonical_name = 'User',
  local_name = 'Utilisateur',
}
p.NS_USER_TALK = {
  id = 3,
  canonical_name = 'User talk',
  local_name = 'Discussion utilisateur',
}
p.NS_PROJECT = {
  id = 4,
  canonical_name = 'Project',
  local_name = 'Wiktionnaire',
}
p.NS_PROJECT_TALK = {
  id = 5,
  canonical_name = 'Project talk',
  local_name = 'Discussion Wiktionnaire',
}
p.NS_FILE = {
  id = 6,
  canonical_name = 'File',
  local_name = 'Fichier',
}
p.NS_FILE_TALK = {
  id = 7,
  canonical_name = 'File talk',
  local_name = 'Discussion fichier',
}
p.NS_MEDIAWIKI = {
  id = 8,
  canonical_name = 'MediaWiki',
  local_name = 'MediaWiki',
}
p.NS_MEDIAWIKI_TALK = {
  id = 9,
  canonical_name = 'MediaWiki talk',
  local_name = 'Discussion MediaWiki',
}
p.NS_TEMPLATE = {
  id = 10,
  canonical_name = 'Template',
  local_name = 'Modèle',
}
p.NS_TEMPLATE_TALK = {
  id = 11,
  canonical_name = 'Template talk',
  local_name = 'Discussion modèle',
}
p.NS_HELP = {
  id = 12,
  canonical_name = 'Help',
  local_name = 'Aide',
}
p.NS_HELP_TALK = {
  id = 13,
  canonical_name = 'Help talk',
  local_name = 'Discussion aide',
}
p.NS_CATEGORY = {
  id = 14,
  canonical_name = 'Category',
  local_name = 'Catégorie',
}
p.NS_CATEGORY_TALK = {
  id = 15,
  canonical_name = 'Category talk',
  local_name = 'Discussion catégorie',
}

p.NS_ANNEXE = {
  id = 100,
  canonical_name = 'Annexe',
  local_name = 'Annexe',
}
p.NS_DISCUSSION_ANNEXE = {
  id = 101,
  canonical_name = 'Discussion Annexe',
  local_name = 'Discussion Annexe',
}
p.NS_TRANSWIKI = {
  id = 102,
  canonical_name = 'Transwiki',
  local_name = 'Transwiki',
}
p.NS_DISCUSSION_TRANSWIKI = {
  id = 103,
  canonical_name = 'Discussion Transwiki',
  local_name = 'Discussion Transwiki',
}
p.NS_PORTAIL = {
  id = 104,
  canonical_name = 'Portail',
  local_name = 'Portail',
}
p.NS_DISCUSSION_PORTAIL = {
  id = 105,
  canonical_name = 'Discussion Portail',
  local_name = 'Discussion Portail',
}
p.NS_THESAURUS = {
  id = 106,
  canonical_name = 'Thésaurus',
  local_name = 'Thésaurus',
}
p.NS_DISCUSSION_THESAURUS = {
  id = 107,
  canonical_name = 'Discussion Thésaurus',
  local_name = 'Discussion Thésaurus',
}
p.NS_PROJET = {
  id = 108,
  canonical_name = 'Projet',
  local_name = 'Projet',
}
p.NS_DISCUSSION_PROJET = {
  id = 109,
  canonical_name = 'Discussion Projet',
  local_name = 'Discussion Projet',
}
p.NS_RECONSTRUCTION = {
  id = 110,
  canonical_name = 'Reconstruction',
  local_name = 'Reconstruction',
}
p.NS_DISCUSSION_RECONSTRUCTION = {
  id = 111,
  canonical_name = 'Discussion Reconstruction',
  local_name = 'Discussion Reconstruction',
}
p.NS_TUTORIEL = {
  id = 112,
  canonical_name = 'Tutoriel',
  local_name = 'Tutoriel',
}
p.NS_DISCUSSION_TUTORIEL = {
  id = 113,
  canonical_name = 'Discussion Tutoriel',
  local_name = 'Discussion Tutoriel',
}
p.NS_RIME = {
  id = 114,
  canonical_name = 'Rime',
  local_name = 'Rime',
}
p.NS_DISCUSSION_RIME = {
  id = 115,
  canonical_name = 'Discussion Rime',
  local_name = 'Discussion Rime',
}
p.NS_CONJUGAISON = {
  id = 116,
  canonical_name = 'Conjugaison',
  local_name = 'Conjugaison',
}
p.NS_DISCUSSION_CONJUGAISON = {
  id = 117,
  canonical_name = 'Discussion Conjugaison',
  local_name = 'Discussion Conjugaison',
}
p.NS_RACINE = {
  id = 118,
  canonical_name = 'Racine',
  local_name = 'Racine',
}
p.NS_DISCUSSION_RACINE = {
  id = 119,
  canonical_name = 'Discussion Racine',
  local_name = 'Discussion Racine',
}

p.NS_MODULE = {
  id = 828,
  canonical_name = 'Module',
  local_name = 'Module',
}
p.NS_MODULE_TALK = {
  id = 829,
  canonical_name = 'Module talk',
  local_name = 'Discussion module',
}

p.NS_TRANSLATIONS = {
  id = 1198,
  canonical_name = 'Translations',
  local_name = 'Translations',
}
p.NS_TRANSLATIONS_TALK = {
  id = 1199,
  canonical_name = 'Translations talk',
  local_name = 'Translations talk',
}

p.NS_GADGET = {
  id = 2300,
  canonical_name = 'Gadget',
  local_name = 'Gadget',
}
p.NS_GADGET_TALK = {
  id = 2301,
  canonical_name = 'Gadget talk',
  local_name = 'Discussion gadget',
}
p.NS_GADGET_DEFINITION = {
  id = 2302,
  canonical_name = 'Gadget definition',
  local_name = 'Définition de gadget',
}
p.NS_GADGET_DEFINITION_TALK = {
  id = 2303,
  canonical_name = 'Gadget definition talk',
  local_name = 'Discussion définition de gadget',
}

p.NS_TOPIC = {
  id = 2600,
  canonical_name = 'Topic',
  local_name = 'Sujet',
}

-- Fonctions

--- Indique si le mot donné déclenche une élision.
--- NB: cas particuliers non pris en charge (p. ex. haricot)
--- @param word string Le mot à tester.
--- @return boolean Vrai si le mot déclenche l’élision, faux sinon.
function p.is_elidable(word)
  return mw.ustring.match(p.lcfirst(word), "^h?[aáàâäeéèêëiíìîïoóòôöuúùûüǘǜ]") ~= nil
end

--- Indique si le mot donné est une locution (s’il contient au moins une espace).
--- @param word string Le mot à tester.
--- @return boolean Vrai si le mot contient une espace, faux sinon.
function p.is_locution(word)
  if word == nil then
    return nil
  end
  return mw.ustring.find(word, ". .") ~= nil
end

--- Indique si la page donnée existe.
--- @param title string Le titre de la page.
--- @return boolean Vrai si la page correspondante existe, faux sinon.
function p.page_existe(title)
  return title ~= nil and mw.title.new(title).exists
end

--- Renvoie le texte avec la première lettre en majuscule (si le texte est en français).
--- @param text string Le texte.
--- @return string Le texte avec la première lettre en majuscule.
function p.ucfirst(text)
  if text == nil then
    return nil
  end
  -- parenthèses nécessaires
  return (mw.ustring.gsub(text, "^([’ǂǃǀǁ]*.)", p.uc))
end

--- Renvoie le texte avec la première lettre en minuscule (si le texte est en français).
--- @param text string Le texte.
--- @return string Le texte avec la première lettre en minuscule.
function p.lcfirst(text)
  if text == nil then
    return nil
  end
  return locale:lcfirst(text)
end

--- Renvoie le texte avec en majuscule (si le texte est en français).
--- @param text string Le texte.
--- @return string Le texte en majuscule.
function p.uc(text)
  if text == nil then
    return nil
  end
  return locale:uc(text)
end

--- Renvoie le texte avec en minuscule (si le texte est en français).
--- @param text string Le texte.
--- @return string Le texte en minuscule.
function p.lc(text)
  if text == nil then
    return nil
  end
  return locale:lc(text)
end

--- Renvoie vrai si le contexte est une page de contenu (principal, annexe, thésaurus ou reconstruction).
--- @return boolean
function p.page_de_contenu()
  local ns = currentTitle.namespace
  return ns == p.NS_MAIN.id or ns == p.NS_ANNEXE.id or ns == p.NS_THESAURUS.id or ns == p.NS_RECONSTRUCTION.id or ns == p.NS_RIME.id or ns == p.NS_CONJUGAISON.id or ns == p.NS_RACINE.id
end

--- Renvoie vrai si on est dans une page de l’espace principal.
--- @return boolean
function p.page_principale()
  return currentTitle:inNamespace(p.NS_MAIN.id)
end

--- Génère une catégorie.
--- @param name string Le nom de la catégorie.
--- @param sortingKey string La clé de tri.
--- @param asLink boolean Indique si la fonction doit retourner un lien (:Catégorie:…) ou non.
--- @return string La catégorie ou une chaine vide si le nom est nil.
function p.fait_categorie(name, sortingKey, asLink)
  local cat = asLink and ':Catégorie:' or 'Catégorie:'

  if name ~= nil then
    if sortingKey ~= nil and sortingKey ~= '' then
      return '[[' .. cat .. name .. '|' .. sortingKey .. ']]'
    else
      return '[[' .. cat .. name .. ']]'
    end
  else
    return ''
  end
end

--- Génère une catégorie uniquement si le contexte est dans l’espace principal,
--- annexe, thésaurus ou reconstruction.
--- @param name string Le nom de la catégorie.
--- @param sortingKey string La clé de tri.
--- @param asLink boolean Indique si la fonction doit retourner un lien (:Catégorie:…) ou non.
--- @return string La catégorie ou une chaine vide si le nom est nil.
function p.fait_categorie_contenu(name, sortingKey, asLink)
  if p.page_de_contenu() then
    return p.fait_categorie(name, sortingKey, asLink) or ''
  else
    return ''
  end
end

--- Génère une catégorie uniquement si le contexte est dans l’espace principal.
--- @param name string Le nom de la catégorie.
--- @param sortingKey string La clé de tri.
--- @param asLink boolean Indique si la fonction doit retourner un lien (:Catégorie:…) ou non.
--- @return string La catégorie ou une chaine vide si le nom est nil.
function p.fait_categorie_principale(name, sortingKey, asLink)
  if p.page_principale() then
    return p.fait_categorie(name, sortingKey, asLink) or ''
  else
    return ''
  end
end

--- Crée l’entête d’un tableau wiki triable.
--- @param columnTitles table Les titres des colonnes.
--- @return string L’entête du tableau.
function p.tableau_entete(columnTitles)
  return '{| class="wikitable sortable"\n|-\n!' .. table.concat(columnTitles, ' !! ')
end

--- Crée une ligne de tableau wiki.
--- @param elements table La liste des éléments de la ligne.
--- @return string La ligne du tableau.
function p.tableau_ligne(elements)
  return '|-\n|' .. table.concat(elements, ' || ')
end

--- Crée la fin d’un tableau wiki.
--- @return string La fin du tableau.
function p.tableau_fin()
  return '|}\n'
end

--- Met un texte en exposant.
--- @param text string Le texte.
--- @return string Le texte dans une balise <sup>.
function p.exposant(text)
  return mw.ustring.format('<sup style="font-size:83%%;line-height:1">%s</sup>', text)
end

--- Balise un texte écrit en langue étrangère.
--- @param text string Le texte.
--- @param code string Le code de la langue ([[Module:langues/data]]).
--- @return string Le texte balisé.
function p.balise_langue(text, code)
  return mw.ustring.format('<bdi lang="%s" xml:lang="%s" class="lang-%s">%s</bdi>', code, code, code, text)
end

--- Enlève les espaces de part et d’autre de tous les paramètres fournis.
--- @param args table La table des paramètres.
--- @return table Une nouvelle table contenant les paramètres sans les espaces.
--- @deprecated Utiliser le [[Module:paramètre]] à la place.
function p.trim_parametres(args)
  if args == nil then
    return nil
  end

  local trim_args = {}
  for k, v in pairs(args) do
    trim_args[k] = mw.text.trim(v)
  end

  return trim_args
end

--- Crée un lien.
--- @param word string Le mot vers lequel créer le lien.
--- @param langCode string Le code langue.
--- @param anchor string L’ancre, typiquement l’ID de la section dans la page.
--- @param text string Le texte à afficher (optionnel).
--- @param keepLangAnchor boolean Si vrai, le code langue est ajouté au lien
---                               même s’il pointe vers la page courante.
--- @return string Le lien.
function p.lien_modele(word, langCode, anchor, text, keepLangAnchor)
  if langCode and langCode == "" then
    langCode = nil
  end
  if text and text == "" then
    text = nil
  end
  if anchor and anchor == "" then
    anchor = nil
  end
  local m_unicode = require("Module:données Unicode")
  local m_langs = require("Module:langues")
  text = m_unicode.setWritingDirection(text or word)

  local langCodeForlink = m_langs.specialCodes[langCode] or langCode

  local link

  if word == currentTitle.prefixedText and not anchor then
    if keepLangAnchor and langCodeForlink then
      link = mw.ustring.format("[[%s#%s|%s]]", word, langCodeForlink, text)
    else
      link = mw.ustring.format("[[%s|%s]]", word, text)
    end
  else
    if langCodeForlink then
      if anchor and anchor ~= "" then
        anchor = langCodeForlink .. "-" .. anchor
      else
        anchor = langCodeForlink
      end
    end
    if anchor then
      link = mw.ustring.format("[[%s#%s|%s]]", word, anchor, text)
    else
      link = mw.ustring.format("[[%s|%s]]", word, text)
    end
  end

  if langCode then
    return p.balise_langue(link, langCode)
  end
  return link
end

--- Cherche la position de la dernière occurence de la seconde chaine dans la première.
--- @param subject string La chaine dans laquelle chercher.
--- @param s string La chaine à rechercher.
--- @return number La position de la dernière occurence de “s” dans “subject” ou 0 si aucune n’a été trouvée.
function p.derniereOccurrence(subject, s)
  local dernier = 0

  while subject:sub(dernier + 1, subject:len()):find(s) ~= nil do
    dernier = dernier + subject:sub(dernier + 1, subject:len()):find(s)
  end

  return dernier
end

return p
