b = require('Module:bases')
typ = require('Module:types de mots')
lang = require('Module:langues')
sect = require('Module:section article')
locu = require('Module:locution')
lem = require('Module:lemme')

local p = {}

-- Types de mots autorisés en conventions internationales (-> pas de nom de langue dans les catégories)
local conv_autorise = {
  ['noms scientifiques'] = true,
  ['numéraux'] = true,
}

-- Messages d’erreur généraux
local lien_aide_section = " [[Wiktionnaire:Liste des sections|<span style=\"color:red;font-size:70%\">(section inconnue)</span>]]"
local lien_aide_type = " [[Wiktionnaire:Types de mots|<span style=\"color:red;font-size:70%\">(section inconnue)</span>]]"
local lien_aide_langue = " [[WT:Liste des langues|<span style=\"color:red;font-size:70%\">(section inconnue)</span>]]"
local lien_aide_numero = " <span style=\"color:red;font-size:70%\">(numéro incorrect)</span>"

-- Regroupe les catégories ensemble
categories = {}
-- Regroupe les messages d’erreur ensemble
erreurs = {}

-- Activer pour voir les catégories générées (seulement pour déboguer avec l’aperçu : désactiver en sauvegardant)
-------------------------------
local isdebug = false
-------------------------------

-- Pour voir les ancres générées
local show_ancre = false

function _ajoute_categorie(nom_cat, clef, ecrit)
  local texte_categorie = ''
  -- Debug : affiche tout
  if isdebug then
    if clef then
      texte_categorie = b.fait_categorie(nom_cat, nil, true) .. '(' .. clef .. ')'
    else
      texte_categorie = b.fait_categorie(nom_cat, nil, true)
    end
    -- Utilisation réelle : crée une vraie catégorie
  else
    texte_categorie = b.fait_categorie_contenu(nom_cat, clef, ecrit)
  end
  table.insert(categories, texte_categorie)
end

function _ajoute_erreur(message)
  if message ~= nil and message ~= '' then
    table.insert(erreurs, message)
  end
end

-- Vérifie que num est bien un entier strictement positif
function _check_num(num)
  num = tonumber(num)
  if num == nil then
    return false
  end  -- Pas un nombre
  if num ~= math.floor(num) then
    return false
  end  -- Pas un entier
  if num > 0 then
    return true
  end
  return false
end

---------------------------------------------------------------------------------------------------------------------
-- SECTION DE TYPE DE MOT

-- Crée le texte qui sera affiché pour la section de type de mot donné
function _fait_titre(typen, flex, loc, num)
  -- Nom complet
  local nom = typ.getWordTypeNameSingular(typen, loc, flex)

  -- Pas de nom ?
  if nom == nil then
    -- Peut-être parce qu’on demande un nom de locution pour un mot qui n’en est pas ?
    local nom_loc = typ.getWordTypeNameSingular(typen, true, flex)
    if not loc and nom_loc ~= nil then
      nom = nom_loc
      _ajoute_categorie("Wiktionnaire:Locutions sans espace", typen)
    end
  end

  -- Numéro ?
  local numtext = ''
  if num then
    if _check_num(num) then
      numtext = ' ' .. num
    else
      _ajoute_erreur(lien_aide_numero)
      _ajoute_categorie("Wiktionnaire:Numéros de section incorrects", num)
    end
  end

  -- Affichage final
  if (typen) then
    -- Type de mot défini?
    if nom then
      return b.ucfirst(nom) .. numtext
    else
      -- Indéfini : affiché (mais avec une astérisque + catégorie)
      _ajoute_erreur(lien_aide_type)
      _ajoute_categorie('Wiktionnaire:Sections avec titre inconnu', typen)
      return numtext
    end
    -- Type même pas donné
  else
    _ajoute_erreur(lien_aide_type)
    _ajoute_categorie('Wiktionnaire:Sections sans titre')
    return 'Section sans titre'
  end
end

-- Crée l’ancre correspondant au titre de section donné
function _fait_ancre(article, lang, typen, flex, loc, num)
  -- Abréviation du type
  local abrev = typ.getWordTypeAbbr(typen, flex)

  local ancre = ''

  -- Affichage final
  if (lang and abrev) then
    ancre = lang .. '-' .. abrev
    num = num or 1
    if num then
      if _check_num(num) then
        ancre = ancre .. '-' .. num
      end
    end
  end

  return ancre
end

local module_sinogramme -- pour la clé de sinogramme

-- Crée la catégorie correspondant au titre de section donné
function _fait_categorie(code_lang, typen, flex, loc, clef, genre, titre)
  -- Pas de catégorie si pas espace principal
  if not b.page_de_contenu then
    return ''
  end

  -- Catégorie de lemme
  lemme_cat = lem.getLemmaCategoryName(code_lang, typen, flex, loc)
  if lemme_cat then
    _ajoute_categorie(lemme_cat, clef)
  end

  -- Nom complet du type au pluriel pour la catégorie
  local nom = typ.getWordTypeNamePlural(typen, loc, flex)

  -- Spécial : genre pour les prénoms
  if nom == 'prénoms' and genre ~= nil then
    if genre == 'm' then
      nom = nom .. ' masculins'
    elseif genre == 'f' then
      nom = nom .. ' féminins'
    elseif genre == 'mf' then
      nom = nom .. ' mixtes'
    else
      _ajoute_categorie('Wiktionnaire:Sections de prénom avec genre invalide', genre)
    end
  end

  -- Nom de la langue
  local langue = lang.get_nom(code_lang)

  -- Catégorie "type de mot" en "langue"
  if nom and langue then
    local nom_cat = ''
    -- Spécial : sections spéciales en conventions internationales
    -- Pas de nom de langue pour ça
    if code_lang == 'conv' then
      if conv_autorise[nom] ~= nil then
        nom_cat = b.ucfirst(nom)
      else
        -- Type de mot pas autorisé pour les conventions internationales : afficher normalement, mais catégoriser ?
        --_ajoute_categorie('Wiktionnaire:Sections non autorisées en conventions internationales', nom)
        nom_cat = b.ucfirst(nom) .. ' en ' .. langue
      end
    else
      nom_cat = b.ucfirst(nom) .. ' en ' .. langue
    end

    -- Ajoute aussi la catégorie de langue si la clef est donnée (pour modifier la catégorie créée par la section de langue)
    if clef ~= nil and clef ~= '' then
      _ajoute_categorie(langue, clef)
    end

    -- clé de tri d’un sinogramme
    if nom == 'sinogrammes' then
      if not module_sinogramme then
        module_sinogramme = require('Module:sinogramme')
      end
      clef = module_sinogramme.chaine_radical_trait(titre)
    end

    _ajoute_categorie(nom_cat, clef)
  else
    -- Nom correct, mais langue incorrecte : pas de catégorie
    if nom then
      -- nocat empêche la catégorisation sans être une erreur
      if code_lang ~= 'nocat' then
        _ajoute_erreur(lien_aide_langue)
        if code_lang ~= nil and code_lang ~= '' then
          -- Code donné : n’est pas défini dans la liste
          _ajoute_categorie('Wiktionnaire:Sections de titre avec langue inconnue', nom)
        else
          -- Pas de code langue donné du tout
          _ajoute_categorie('Wiktionnaire:Sections de titre sans langue précisée', nom)
        end
      end
    end
  end
end

-- TYPES DE MOT : FONCTION POUR MODÈLE (ou en lui passant le frame d’un modèle)
function p.entree(frame)
  -- Récupération des variables nécessaires à la création du titre
  local args = frame:getParent().args
  local argsnum = b.trim_parametres(args)
  local article = mw.title.getCurrentTitle()
  local typen = argsnum[1]        -- Le type de mot (nom standard ou alias)
  local lang = argsnum[2]        -- Code langue
  local clef = args['clé']    -- Clé de tri (quand le tri par défaut ne convient pas)

  -- Stocker les erreurs pour afficher les catégories à la fin
  local error_cat = ''

  -- nom en conventions internationales → nom scientifique
  if typen == 'nom' and lang == 'conv' then
    typen = 'nom scientifique'
  end

  -- s’agit-il d’une flexion ?
  local flex = false
  if argsnum[3] then
    if argsnum[3] == 'flexion' then
      flex = true
    else
      _ajoute_categorie('Wiktionnaire:Sections de type avec paramètre 3 invalide')
    end
  end

  -- s’agit-il d’une locution ?
  local loc
  if not args["locution"] then
    loc = locu.isLocution(article, typen, lang)
  elseif args["locution"] == "oui" then
    loc = true
    _ajoute_categorie("Wiktionnaire:Sections de type avec locution forcée")
  elseif args["locution"] == "non" then
    loc = false
    _ajoute_categorie("Wiktionnaire:Sections de type avec locution forcée")
  else
    _ajoute_categorie("Wiktionnaire:Sections avec paramètre locution invalide")
  end

  local num = args.num

  -- S’il s’agit d’un alias, on crée une catégorie (pour remplacer les alias par le mot standard si on le veut)
  if typ.isWordTypeAlias(typen) then
    _ajoute_categorie('Wiktionnaire:Sections de type de mot utilisant un alias', typen)
  end

  -- Crée le texte, l’ancre, la catégorie et utilise le tout pour créer le titre de section de type de mot complet.
  if (args['nocat'] or '') == '' then
    _fait_categorie(lang, typen, flex, loc, clef, args['genre'], article.text)
  end
  local texte_titre = _fait_titre(typen, flex, loc, num)
  local ancre = _fait_ancre(article, lang, typen, flex, loc, num)
  local final = '<span class="titredef" id="' .. ancre .. '">' .. texte_titre .. '</span>'

  -- Ajoute ancre par défaut
  if num == nil or tonumber(num) == 1 then
    local ancre_defaut = mw.ustring.gsub(ancre, '-1$', '')
    local ancre_defaut_span = '<span id="' .. ancre_defaut .. '" style="font-size:0;"> </span>'
    final = final .. ancre_defaut_span
  end

  if show_ancre then
    final = final .. ' ' .. ancre
  end
  return final
end

---------------------------------------------------------------------------------------------------------------------
-- AUTRES SECTIONS (étymologie, synonymes...)

-- AUTRES SECTIONS : FONCTION POUR MODÈLE (ou en lui passant le frame d’un modèle)
-- Création d’un titre de section pour tout ce qui n’est pas type de mot, ni langue
function p.section_autre(frame)
  -- Récupération des variables nécessaires à la création du titre
  local args = frame:getParent().args
  local argsnum = b.trim_parametres(args)
  local titre = argsnum[1]
  local authorized_category = { ['homophones'] = true, ['homo'] = true, ['traductions à trier'] = true, ['trad-trier'] = true }
  if authorized_category[titre] ~= nil then
    if argsnum[2] then
      local langue = lang.get_nom(argsnum[2])
      _ajoute_categorie(sect.get_category(titre) .. ' en ' .. langue)
    else
      _ajoute_categorie(sect.get_category(titre))
    end
  elseif argsnum[2] then
    _ajoute_categorie('Wiktionnaire:Sections avec paramètres superflus', titre)
  end

  -- S’il s’agit d’un alias, on crée une catégorie (pour remplacer les alias par le mot standard si on le veut)
  if sect.is_alias(titre) then
    -- On ignore les alias de titre utilisés sans préférence
    local ignore_alias = { ['trad-trier'] = true, ['variantes orthographiques'] = true, ['voir'] = true }
    if ignore_alias[titre] == nil then
      _ajoute_categorie('Wiktionnaire:Sections utilisant un alias', titre)
    end
  end

  -- Récupération du texte associé à ce titre (créé dans le module dédié section_article)
  local texte_titre = titre and b.ucfirst(sect.get_nom_section(titre)) or "Sans titre"

  -- Récupère aussi la classe de la section (si elle existe) pour afficher une icône adaptée
  local classe = sect.get_class(titre) or ""

  -- Récupère l'infobulle (si elle existe) expliquant le titre de section (hyponymes, etc.)
  local infobulle = sect.get_infobulle(titre) or ""
  if infobulle ~= "" then
    -- remplace {mot} par le titre de la page courante dans l'infobulle
    local article = mw.title.getCurrentTitle().fullText
    infobulle = mw.ustring.gsub(infobulle, "{mot}", article)
  end

  -- Finalisation du texte affiché
  local final = '<span class="' .. classe .. '"' .. ' title="' .. infobulle .. '">' .. texte_titre .. '</span>'
  return final
end

---------------------------------------------------------------------------------------------------------------------
-- TOUTES SECTIONS (autres que LANGUE)

-- TOUTES SECTIONS : FONCTION POUR MODÈLE
-- Renvoie un titre de section, normale ou avec de type de mot défini
function p.section(frame)
  local args = frame:getParent().args
  local titre = args[1] and mw.text.trim(args[1]) or ''

  local texte_final = ''

  -- Pas même un titre donné ?
  if titre == nil or titre == '' then
    _ajoute_erreur(lien_aide_section)
    _ajoute_categorie('Wiktionnaire:Sections sans titre')
    texte_final = 'Section sans titre'
  else

    -- S’agit-il d’un titre de type de mot ?
    if typ.isValidWordType(titre) then
      texte_final = p.entree(frame)

      -- Sinon, est-ce une section autorisée ? (pas de fonction dédiée pour l’instant)
    elseif sect.is_titre(titre) then
      texte_final = p.section_autre(frame)

      -- Section non prise en charge : on affiche quand même la section, mais avec un lien vers l’aide (avec une *)
      -- pour soit 1) trouver le bon nom à utiliser,
      -- soit 2) proposer que le titre utilisé soit pris en charge.
    else
      -- Lien d’aide selon qu’il y a une langue donnée ou pas
      if args[2] ~= nil and args[2] ~= '' then
        _ajoute_erreur(lien_aide_type)
      else
        _ajoute_erreur(lien_aide_section)
      end

      _ajoute_categorie('Wiktionnaire:Sections avec titre inconnu', titre)
      texte_final = b.ucfirst(titre)
    end
  end

  -- Finalise les erreurs et les catégories
  local texte_erreurs = table.concat(erreurs)
  local texte_categories = table.concat(categories)
  return texte_final .. texte_erreurs .. texte_categories
end

return p
