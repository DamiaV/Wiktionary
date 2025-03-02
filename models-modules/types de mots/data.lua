-- Check list at [[Discussion module:types de mots/analyse/test]]
local t = {
  -- NOMS STANDARDISÉS DES TYPES DE MOT
  ["texte"] = {
    -- ADJECTIFS
    ["adjectif"] = {
      mot = "adjectif",
      mot_pl = "adjectifs",
      locution = "locution adjectivale",
      locution_pl = "locutions adjectivales",
      abrev = "adj",
      alias = { "adj", "adjectif qualificatif" },
    },

    -- ADVERBES
    ["adverbe"] = {
      mot = "adverbe",
      mot_pl = "adverbes",
      locution = "locution adverbiale",
      locution_pl = "locutions adverbiales",
      abrev = "adv",
      alias = { "adv" },
    },
    ["adverbe indéfini"] = {
      mot = "adverbe indéfini",
      mot_pl = "adverbes indéfinis",
      abrev = "adv-ind",
      alias = { "adv-ind", "adverbe ind" },
    },
    ["adverbe interrogatif"] = {
      mot = "adverbe interrogatif",
      mot_pl = "adverbes interrogatifs",
      abrev = "adv-int",
      alias = { "adv-int", "adverbe int" },
    },
    ["adverbe pronominal"] = {
      mot = "adverbe pronominal",
      mot_pl = "adverbes pronominaux",
      abrev = "adv-pron",
      alias = { "adv-pron", "adverbe pro" },
    },
    ["adverbe relatif"] = {
      mot = "adverbe relatif",
      mot_pl = "adverbes relatifs",
      abrev = "adv-rel",
      alias = { "adv-rel", "adverbe rel" },
    },

    -- CONJONCTIONS
    ["conjonction"] = {
      mot = "conjonction",
      mot_pl = "conjonctions",
      locution = "locution conjonctive",
      locution_pl = "locutions conjonctives",
      abrev = "conj",
      alias = { "conj" },
    },
    ["conjonction de coordination"] = {
      mot = "conjonction de coordination",
      mot_pl = "conjonctions de coordination",
      abrev = "conj-coord",
      alias = { "conj-coord", "conjonction coo" },
    },

    ["copule"] = {
      mot = "copule",
      mot_pl = "copules",
      abrev = "copule",
    },

    -- DÉTERMINANTS
    ["adjectif démonstratif"] = {
      mot = "adjectif démonstratif",
      mot_pl = "adjectifs démonstratifs",
      abrev = "adj-dém",
      alias = { "adj-dém", "adjectif dém" },
    },
    ["déterminant"] = {
      mot = "déterminant",
      mot_pl = "déterminants",
      abrev = "dét",
      alias = { "dét" },
    },
    ["adjectif exclamatif"] = {
      mot = "adjectif exclamatif",
      mot_pl = "adjectifs exclamatifs",
      abrev = "adj-excl",
      alias = { "adj-excl", "adjectif exc" },
    },
    ["adjectif indéfini"] = {
      mot = "adjectif indéfini",
      mot_pl = "adjectifs indéfinis",
      abrev = "adj-indéf",
      alias = { "adj-indéf", "adjectif ind" },
    },
    ["adjectif interrogatif"] = {
      mot = "adjectif interrogatif",
      mot_pl = "adjectifs interrogatifs",
      abrev = "adj-int",
      alias = { "adj-int", "adjectif int" },
    },
    ["adjectif numéral"] = {
      mot = "adjectif numéral",
      mot_pl = "adjectifs numéraux",
      abrev = "adj-num",
      alias = { "adj-num", "adjectif num" },
    },
    ["adjectif possessif"] = {
      mot = "adjectif possessif",
      mot_pl = "adjectifs possessifs",
      abrev = "adj-pos",
      alias = { "adj-pos", "adjectif pos" },
    },
    ["adjectif relatif"] = {
      mot = "adjectif relatif",
      mot_pl = "adjectifs relatifs",
      abrev = "adj-rel",
      alias = { "adj-rel", "adjectif rel" },
    },

    ["article"] = {
      mot = "article",
      mot_pl = "articles",
      abrev = "art",
      alias = { "art" },
    },
    ["article défini"] = {
      mot = "article défini",
      mot_pl = "articles définis",
      abrev = "art-déf",
      alias = { "art-déf", "article déf" },
    },
    ["article indéfini"] = {
      mot = "article indéfini",
      mot_pl = "articles indéfinis",
      abrev = "art-indéf",
      alias = { "art-indéf", "article ind" },
    },
    ["article partitif"] = {
      mot = "article partitif",
      mot_pl = "articles partitifs",
      abrev = "art-part",
      alias = { "art-part", "article par" },
    },
    ["déterminant possessif"] = {
      mot = "déterminant possessif",
      mot_pl = "déterminants possessifs",
      abrev = "dét-pos",
      alias = { "dét pos", "déterminant pos" },
    },
    ["déterminant démonstratif"] = {
      mot = "déterminant démonstratif",
      mot_pl = "déterminants démonstratifs",
      abrev = "dét-dém",
      alias = { "dét-dém", "déterminant dém", "dét-dem" },
    },

    -- NOMS
    ["nom"] = {
      mot = "nom commun",
      mot_pl = "noms communs",
      locution = "locution nominale",
      locution_pl = "locutions nominales",
      abrev = "nom",
      alias = { "substantif", "nom commun" },
    },
    ["nom de famille"] = {
      mot = "nom de famille",
      mot_pl = "noms de famille",
      abrev = "nom-fam",
      alias = { "nom-fam" },
    },
    ["patronyme"] = {
      mot = "patronyme",
      mot_pl = "patronymes",
      abrev = "patronyme",
    },
    ["nom propre"] = {
      mot = "nom propre",
      mot_pl = "noms propres",
      abrev = "nom-pr",
      alias = { "nom-pr" },
    },
    ["nom scientifique"] = {
      mot = "nom scientifique",
      mot_pl = "noms scientifiques",
      abrev = "nom-sciences",
      alias = { "nom-sciences", "nom science", "nom scient" },
    },
    ["prénom"] = {
      mot = "prénom",
      mot_pl = "prénoms",
      abrev = "prénom",
    },
    -- nom-ni ?
    -- nom-nu ?
    -- nom-nn ?
    -- nom-npl ?

    -- PRÉPOSITION
    ["préposition"] = {
      mot = "préposition",
      mot_pl = "prépositions",
      locution = "locution prépositive",
      locution_pl = "locutions prépositives",
      abrev = "prép",
      alias = { "prép" },
    },

    -- PRONOMS
    ["pronom"] = {
      mot = "pronom",
      mot_pl = "pronoms",
      locution = "locution pronominale",
      locution_pl = "locutions pronominales",
      abrev = "pronom",
    },
    ["pronom-adjectif"] = {
      mot = "pronom-adjectif",
      mot_pl = "pronoms-adjectifs",
      abrev = "pronom-adj",
    },
    ["pronom démonstratif"] = {
      mot = "pronom démonstratif",
      mot_pl = "pronoms démonstratifs",
      --locution = "locution pronominale",
      --locution_pl = "locutions pronominales",
      abrev = "pronom-dém",
      alias = { "pronom-dém", "pronom dém" },
    },
    ["pronom indéfini"] = {
      mot = "pronom indéfini",
      mot_pl = "pronoms indéfinis",
      --locution = "locution pronominale",
      --locution_pl = "locutions pronominales",
      abrev = "pronom-indéf",
      alias = { "pronom-indéf", "pronom ind" },
    },
    ["pronom interrogatif"] = {
      mot = "pronom interrogatif",
      mot_pl = "pronoms interrogatifs",
      --locution = "locution pronominale",
      --locution_pl = "locutions pronominales",
      abrev = "pronom-int",
      alias = { "pronom-int", "pronom int" },
    },
    ["pronom personnel"] = {
      mot = "pronom personnel",
      mot_pl = "pronoms personnels",
      --locution = "locution pronominale",
      --locution_pl = "locutions pronominales",
      abrev = "pronom-pers",
      alias = { "pronom-pers", "pronom-per", "pronom réf", "pronom-réfl", "pronom réfléchi" }, -- Les pronoms réfléchis sont rangés dans les pronoms personnels
    },
    ["pronom possessif"] = {
      mot = "pronom possessif",
      mot_pl = "pronoms possessifs",
      --locution = "locution pronominale",
      --locution_pl = "locutions pronominales",
      abrev = "pronom-pos",
      alias = { "pronom-pos", "pronom pos" },
    },
    ["pronom relatif"] = {
      mot = "pronom relatif",
      mot_pl = "pronoms relatifs",
      --locution = "locution pronominale",
      --locution_pl = "locutions pronominales",
      abrev = "pronom-rel",
      alias = { "pronom-rel", "pronom rel" },
    },

    -- RACINES
    ["racine"] = {
      mot = "racine",
      mot_pl = "racines",
    },


    -- VERBES
    ["verbe"] = {
      mot = "verbe",
      mot_pl = "verbes",
      locution = "locution verbale",
      locution_pl = "locutions verbales",
      abrev = "verb",
      alias = { "verb" },
    },
    ["verbe pronominal"] = {
      mot = "verbe",
      mot_pl = "verbes",
      locution = "locution verbale",
      locution_pl = "locutions verbales",
      abrev = "verb",
      alias = { "verb-pr", "verbe pr" },
    },

    -- EXCLAMATIONS
    ["interjection"] = {
      mot = "interjection",
      mot_pl = "interjections",
      locution = "locution interjective",
      locution_pl = "locutions interjectives",
      abrev = "interj",
      alias = { "interj" },
    },
    ["onomatopée"] = {
      mot = "onomatopée",
      mot_pl = "onomatopées",
      abrev = "onoma",
      alias = { "onoma", "onom" },
    },

    -- PARTIES
    ["affixe"] = {
      mot = "affixe",
      mot_pl = "affixes",
      abrev = "aff",
      alias = { "aff" },
    },
    ["circonfixe"] = {
      mot = "circonfixe",
      mot_pl = "circonfixes",
      abrev = "circon",
      alias = { "circonf", "circon" },
    },
    ["infixe"] = {
      mot = "infixe",
      mot_pl = "infixes",
      abrev = "inf",
      alias = { "inf" },
    },
    ["interfixe"] = {
      mot = "interfixe",
      mot_pl = "interfixes",
      abrev = "interf",
      alias = { "interf" },
    },
    ["particule"] = {
      mot = "particule",
      mot_pl = "particules",
      abrev = "part",
      alias = { "part" },
    },
    ["particule numérale"] = {
      mot = "particule numérale",
      mot_pl = "particules numérales",
      abrev = "part-num",
      alias = { "part-num", "particule num" },
    },
    ["postposition"] = {
      mot = "postposition",
      mot_pl = "postpositions",
      abrev = "post",
      alias = { "post", "postpos" },
    },
    ["préfixe"] = {
      mot = "préfixe",
      mot_pl = "préfixes",
      abrev = "préf",
      alias = { "préf" },
    },
    ["radical"] = {
      mot = "radical",
      mot_pl = "radicaux",
      abrev = "radical",
      alias = { "rad" },
    },
    ["suffixe"] = {
      mot = "suffixe",
      mot_pl = "suffixes",
      abrev = "suf",
      alias = { "suff", "suf" },
    },

    ["pré-verbe"] = {
      mot = "pré-verbe",
      mot_pl = "pré-verbes",
      abrev = "pré-verb",
    },
    ["pré-nom"] = {
      mot = "pré-nom",
      mot_pl = "pré-noms",
      abrev = "pré-nom",
    },
    ["enclitique"] = {
      mot = "enclitique",
      mot_pl = "enclitiques",
      abrev = "encl",
      alias = { "encl" },
    },
    ["proclitique"] = {
      mot = "proclitique",
      mot_pl = "proclitiques",
      abrev = "procl",
      alias = { "procl" },
    },

    -- PHRASES
    ["locution"] = {
      mot = "locution",
      mot_pl = "locutions",
      locution = "locution",
      locution_pl = "locutions",
      abrev = "loc",
      alias = { "loc" },
    },
    ["locution-phrase"] = {
      mot = "locution-phrase",
      mot_pl = "locutions-phrases",
      locution = "locution-phrase",
      locution_pl = "locutions-phrases",
      abrev = "phr",
      alias = { "loc-phr", "locution phrase", "phrase" },
    },
    ["proverbe"] = {
      mot = "proverbe",
      mot_pl = "proverbes",
      locution = "proverbe",
      locution_pl = "proverbes",
      abrev = "prov",
      alias = { "prov" },
    },

    -- DIVERS
    ["idéophone"] = {
      mot = "idéophone",
      mot_pl = "idéophones",
    },
    ["quantificateur"] = {
      mot = "quantificateur",
      mot_pl = "quantificateurs",
      abrev = "quantif",
      alias = { "quantif" },
    },
    ["variante typographique"] = {
      mot = "variante par contrainte typographique",
      mot_pl = "variantes par contrainte typographique",
      abrev = "var-typo",
      alias = { "var-typo", "variante typo", "variante par contrainte typographique" },
    },

    -- CARACTÈRES
    ["lettre"] = {
      mot = "lettre",
      mot_pl = "lettres",
      abrev = "lettre",

    },
    ["symbole"] = {
      mot = "symbole",
      mot_pl = "symboles",
      abrev = "symb",
      alias = { "symb" },
    },
    ["classificateur"] = {
      mot = "classificateur",
      mot_pl = "classificateurs",
      abrev = "class",
      alias = { "class", "classif" },
    },
    ["numéral"] = {
      mot = "numéral",
      mot_pl = "numéraux",
      abrev = "numeral",
      alias = { "numér", "num" },
    },
    ["sinogramme"] = {
      mot = "sinogramme",
      mot_pl = "sinogrammes",
      abrev = "sinogramme",
      alias = { "sinog", "sino" },
    },

    -- Spéciaux
    ["gismu"] = {
      mot = "gismu",
      mot_pl = "gismu",
      abrev = "gismu",
    },
    ["rafsi"] = {
      mot = "rafsi",
      mot_pl = "rafsi",
      abrev = "rafsi",
    },
  }
}

-- Put alias redirections into t["alias"]
t["alias"] = {}
for code, data in pairs(t["texte"]) do
  if data["alias"] ~= nil then
    for _, alias in ipairs(data["alias"]) do
      t["alias"][alias] = code
    end
  end
end

return t
