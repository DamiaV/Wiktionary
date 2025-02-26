-- Check list at [[Discussion module:section article/analyse]]
local t = {
  -- NOMS STANDARDISÉS DES TITRES DE SECTION
  ["texte"] = {

    -- Titres de niveau 3 (tous ont comme parent la section de langue)
    ["anagrammes"] = {
      nom = "anagrammes",
      niveau = 3,
      class = "titreanagr",
      parent = "langue",
      alias = { "anagramme", "anagr" },
    },
    ["dico sinogrammes"] = {
      nom = "référence dans les dictionnaires de sinogrammes",
      niveau = 3,
      class = "titre",
      parent = "langue",
      alias = { "sino-dico", "dico-sino" },
    },
    ["écriture"] = {
      nom = "autre alphabet ou système d’écriture",
      niveau = 3,
      parent = "type de mot",
      alias = { "écrit" },
    },
    ["étymologie"] = {
      nom = "étymologie",
      niveau = 3,
      class = "titreetym",
      parent = "langue",
      alias = { "étym", "etym" },
    },
    ["prononciation"] = {
      nom = "prononciation",
      niveau = 3,
      class = "titrepron",
      parent = "langue",
      alias = { "pron", "prononciations" },
    },
    ["références"] = {
      nom = "références",
      niveau = 3,
      class = "titreref",
      parent = "langue",
      alias = { "référence", "réf", "ref" },
    },
    ["taux de reconnaissance"] = {
      nom = "taux de reconnaissance",
      niveau = 3,
      class = "titrereconnaissance",
      parent = "langue"
    },
    ["voir aussi"] = {
      nom = "voir aussi",
      niveau = 3,
      class = "titrevoir",
      parent = "langue",
      alias = { "voir" },
    },

    -- NIVEAU 4 (sauf mention contraire, tous sont des sous-sections d"une section de mot)
    ["abréviations"] = {
      nom = "abréviations",
      niveau = 4,
      class = "titreabrev",
      parent = "type de mot",
      alias = { "abrév" },
    },
    ["antonymes"] = {
      nom = "antonymes",
      niveau = 4,
      class = "titreanto",
      parent = "type de mot",
      alias = { "ant", "anto" },
    },
    ["apparentés"] = {
      nom = "apparentés étymologiques",
      niveau = 4,
      class = "titreappar",
      parent = "type de mot",
      alias = { "apr", "app", "apparentés étymologiques" },
    },
    ["augmentatifs"] = {
      nom = "augmentatifs",
      niveau = 4,
      class = "titreaugmen",
      parent = "type de mot",
      alias = { "augm" },
    },
    ["citations"] = {
      nom = "citations",
      niveau = 4,
      desuet = true, -- Vérifier
      parent = "indéfini",
      alias = { "cit" },
    },
    ["composés"] = {
      nom = "composés",
      niveau = 4,
      class = "titrecompos",
      parent = "type de mot",
      alias = { "compos" },
    },
    ["diminutifs"] = {
      nom = "diminutifs",
      niveau = 4,
      class = "titredimin",
      parent = "type de mot",
      alias = { "dimin" },
    },
    ["dérivés"] = {
      nom = "dérivés",
      niveau = 4,
      class = "titrederiv",
      parent = "type de mot",
      alias = { "drv" },
    },
    ["dérivés autres langues"] = {
      nom = "dérivés dans d’autres langues",
      niveau = 4,
      class = "titrederal",
      parent = "type de mot",
      alias = { "drv-int", "dérivés int" },
    },
    ["faux-amis"] = {
      nom = "faux-amis",
      niveau = 4,
      parent = "type de mot",
    },
    ["gentilés"] = {
      nom = "gentilés et adjectifs correspondants",
      niveau = 4,
      parent = "type de mot",
      alias = { "gent" },
    },
    ["holonymes"] = {
      nom = "holonymes",
      niveau = 4,
      class = "titreholo",
      parent = "type de mot",
      alias = { "holo" },
      infobulle = "Mots désignant une chose dont « {mot} » constitue une partie",
    },
    ["hyponymes"] = {
      nom = "hyponymes",
      niveau = 4,
      class = "titrehypo",
      parent = "type de mot",
      alias = { "hypo" },
      infobulle = "Mots dont le sens est plus spécifique que « {mot} »",
    },
    ["hyperonymes"] = {
      nom = "hyperonymes",
      niveau = 4,
      class = "titrehyper",
      parent = "type de mot",
      alias = { "hyper" },
      infobulle = "Mots dont le sens est plus générique que « {mot} »",
    },
    ["hyper-verbes"] = {
      nom = "hyper-verbes",
      niveau = 4,
      class = "titrehypervb",
      parent = "type de mot",
      alias = { "hypervb" },
      infobulle = "Verbes généralisant l’action de « {mot} »",
    },
    ["vidéos"] = {
      nom = "vidéos",
      niveau = 4,
      parent = "type de mot",
    },
    ["méronymes"] = {
      nom = "méronymes",
      niveau = 4,
      class = "titremero",
      parent = "type de mot",
      alias = { "méro" },
      infobulle = "Mots désignant une partie de « {mot} »",
    },
    ["noms vernaculaires"] = {
      nom = "noms vernaculaires",
      niveau = 4,
      parent = "type de mot",
      alias = { "noms-vern" },
    },
    ["phrases"] = {
      nom = "proverbes et phrases toutes faites",
      niveau = 4,
      parent = "type de mot",
    },
    ["quasi-synonymes"] = {
      nom = "quasi-synonymes",
      niveau = 4,
      parent = "type de mot",
      alias = { "q-syn", "quasi-syn" },
    },
    ["synonymes"] = {
      nom = "synonymes",
      niveau = 4,
      class = "titresyno",
      parent = "type de mot",
      alias = { "syn" },
    },
    ["traductions"] = {
      nom = "traductions",
      niveau = 4,
      class = "titretrad",
      parent = "type de mot",
      alias = { "trad" },
    },
    ["traductions à trier"] = {
      nom = "traductions à trier",
      niveau = 5,
      parent = "trad",
      alias = { "trad-trier", "trad trier" },
      category = "Wiktionnaire:Traductions à trier",
    },
    ["transcriptions"] = {
      nom = "transcriptions dans diverses écritures",
      niveau = 4,
      class = "titretranscr",
      parent = "type de mot",
      alias = { "trans", "tran" },
    },
    ["translittérations"] = {
      nom = "translittérations dans diverses écritures",
      niveau = 4,
      parent = "type de mot",
      alias = { "translit" },
    },
    ["troponymes"] = {
      nom = "troponymes",
      niveau = 4,
      class = "titretropo",
      parent = "type de mot",
      alias = { "tropo" },
      infobulle = "Verbes précisant l’action de « {mot} »",
    },
    ["vocabulaire"] = {
      nom = "vocabulaire apparenté par le sens",
      niveau = 4,
      class = "titrevoc",
      parent = "type de mot",
      alias = { "voc", "vocabulaire apparenté", "vocabulaire proche" },
    },
    ["modification phonétique"] = {
      nom = "modification phonétique",
      niveau = 4,
      class = "titremodphon",
      parent = "type de mot",
      alias = { "modphon", "mutation" },
    },

    -- SECTIONS DE VARIANTES
    ["anciennes orthographes"] = {
      nom = "anciennes orthographes",
      niveau = 4,
      parent = "type de mot",
      alias = { "ortho-arch", "anciennes ortho" },
    },
    ["variantes"] = {
      nom = "variantes",
      niveau = 4,
      parent = "type de mot",
      alias = { "var" },
    },
    ["variantes dialectales"] = {
      nom = "variantes dialectales",
      niveau = 4,
      parent = "type de mot",
      alias = { "dial", "var-dial", "variantes dial", "variantes dialectes", "dialectes" },
    },
    ["variantes orthographiques"] = {
      nom = "variantes orthographiques",
      niveau = 4,
      parent = "type de mot",
      alias = { "var-ortho", "variantes ortho" },
    },

    -- SECTIONS DÉDIÉES AUX FLEXIONS
    ["conjugaison"] = {
      nom = "conjugaison",
      niveau = 4,
      parent = "type de mot",
      alias = { "conjug" },
    },
    ["déclinaison"] = {
      nom = "déclinaison",
      niveau = 4,
      parent = "type de mot",
      alias = { "décl" },
    },

    -- SOUS-TITRES DE SOUS-SECTIONS AUTRES QUE SOUS-SECTIONS DE TYPES DE MOTS
    ["attestations"] = {
      nom = "attestations historiques",
      niveau = 4,
      parent = "étym",
      alias = { "attest", "hist" },
    },
    ["homophones"] = {
      nom = "homophones",
      niveau = 4,
      parent = "pron",
      alias = { "homo" },
      category = "Mots ayant des homophones",
    },
    ["paronymes"] = {
      nom = "paronymes",
      niveau = 4,
      parent = "pron",
      alias = { "paro" },
      infobulle = "Mots dont la ressemblance entraîne de fréquentes confusions avec « {mot} »"
    },
    ["sources"] = {
      nom = "sources",
      niveau = 4,
      parent = "références",
      alias = { "src" },
      infobulle = "Liste des références cités dans l’article"
    },
    ["bibliographie"] = {
      nom = "bibliographie",
      niveau = 4,
      parent = "références",
      alias = { "bib" },
      infobulle = "Liste des ouvrages utilisés pour écrire l’article"
    },

    -- NIVEAU DÉFINI PAR SECTION PARENTE
    ["notes"] = {
      nom = "notes",
      niveau = "tous",
      parent = "toutes sections",
      alias = { "note" },
    },
  }
}

-- Put alias redirections into t["alias"]
t["alias"] = {}
for code, data in pairs(t["texte"]) do
  if data["alias"] then
    for _, alias in ipairs(data["alias"]) do
      t["alias"][alias] = code
    end
  end
end

return t
