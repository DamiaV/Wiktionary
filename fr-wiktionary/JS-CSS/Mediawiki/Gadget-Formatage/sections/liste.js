// List created via [[Discussion module:section/analyse/test]]

/**
 * List of all section types.
 *
 * Structure of each entry:
 * * name: Correct section name.
 * * level: Correct section level.
 * * hasCode: Whether the section should have a language code parameter.
 * @type {{[sectionName: string]: {name: string, level: number, hasCode?: boolean}}}
 */
sections = (function () {
  var etymologie = {level: 3, name: "étymologie"};
  var ecriture = {level: 3, name: "écriture"};
  var dicoSino = {level: 3, name: "dico sinogrammes"};
  var pron = {level: 3, name: "prononciation"};
  var voirAussi = {level: 3, name: "voir aussi"};
  var references = {level: 3, name: "références"};
  var anagrammes = {level: 3, name: "anagrammes"};
  var symbole = {level: 3, name: "symbole", hasCode: true};
  var advInter = {level: 3, name: "adverbe interrogatif", hasCode: true};
  var prefixe = {level: 3, name: "préfixe", hasCode: true};
  var adjPosses = {level: 3, name: "adjectif possessif", hasCode: true};
  var circonfixe = {level: 3, name: "circonfixe", hasCode: true};
  var locution = {level: 3, name: "locution", hasCode: true};
  var sinogramme = {level: 3, name: "sinogramme", hasCode: true};
  var onomatopée = {level: 3, name: "onomatopée", hasCode: true};
  var radical = {level: 3, name: "radical", hasCode: true};
  var artIndef = {level: 3, name: "article indéfini", hasCode: true};
  var numeral = {level: 3, name: "numéral", hasCode: true};
  var nomScient = {level: 3, name: "nom scientifique", hasCode: true};
  var classificateur = {level: 3, name: "classificateur", hasCode: true};
  var interjection = {level: 3, name: "interjection", hasCode: true};
  var verbeProno = {level: 3, name: "verbe pronominal", hasCode: true};
  var varTypo = {level: 3, name: "variante typographique", hasCode: true};
  var adj = {level: 3, name: "adjectif", hasCode: true};
  var artDef = {level: 3, name: "article défini", hasCode: true};
  var quantificateur = {level: 3, name: "quantificateur", hasCode: true};
  var proverbe = {level: 3, name: "proverbe", hasCode: true};
  var nom = {level: 3, name: "nom", hasCode: true};
  var pronomPers = {level: 3, name: "pronom personnel", hasCode: true};
  var pronomRel = {level: 3, name: "pronom relatif", hasCode: true};
  var postposition = {level: 3, name: "postposition", hasCode: true};
  var pronomInter = {level: 3, name: "pronom interrogatif", hasCode: true};
  var suffixe = {level: 3, name: "suffixe", hasCode: true};
  var part = {level: 3, name: "particule", hasCode: true};
  var artPart = {level: 3, name: "article partitif", hasCode: true};
  var partNum = {level: 3, name: "particule numérale", hasCode: true};
  var conjonction = {level: 3, name: "conjonction", hasCode: true};
  var nomFamille = {level: 3, name: "nom de famille", hasCode: true};
  var interfixe = {level: 3, name: "interfixe", hasCode: true};
  var advRel = {level: 3, name: "adverbe relatif", hasCode: true};
  var pronomDem = {level: 3, name: "pronom démonstratif", hasCode: true};
  var advProno = {level: 3, name: "adverbe pronominal", hasCode: true};
  var adjDem = {level: 3, name: "adjectif démonstratif", hasCode: true};
  var verbe = {level: 3, name: "verbe", hasCode: true};
  var adjNum = {level: 3, name: "adjectif numéral", hasCode: true};
  var adjIndef = {level: 3, name: "adjectif indéfini", hasCode: true};
  var infixe = {level: 3, name: "infixe", hasCode: true};
  var nomPropre = {level: 3, name: "nom propre", hasCode: true};
  var pronomPos = {level: 3, name: "pronom possessif", hasCode: true};
  var pronomIndef = {level: 3, name: "pronom indéfini", hasCode: true};
  var adjExcl = {level: 3, name: "adjectif exclamatif", hasCode: true};
  var preposition = {level: 3, name: "préposition", hasCode: true};
  var affixe = {level: 3, name: "affixe", hasCode: true};
  var locPhrase = {level: 3, name: "locution-phrase", hasCode: true};
  var conjCoord = {level: 3, name: "conjonction de coordination", hasCode: true};
  var adjInter = {level: 3, name: "adjectif interrogatif", hasCode: true};
  var determinant = {level: 3, name: "déterminant", hasCode: true};
  var adv = {level: 3, name: "adverbe", hasCode: true};
  var article = {level: 3, name: "article", hasCode: true};

  var vocabulaire = {level: 4, name: "vocabulaire"};
  var troponymes = {level: 4, name: "troponymes"};
  var paronymes = {level: 4, name: "paronymes"};
  var traductions = {level: 4, name: "traductions"};
  var quasiSynonymes = {level: 4, name: "quasi-synonymes"};
  var derivesAutresLangues = {level: 4, name: "dérivés autres langues"};
  var expressions = {level: 4, name: "expressions"};
  var antonymes = {level: 4, name: "antonymes"};
  var augmentatif = {level: 4, name: "augmentatifs"};
  var homophones = {level: 4, name: "homophones", hasCode: true};
  var hyperonymes = {level: 4, name: "hyperonymes"};
  var declinaison = {level: 4, name: "déclinaison"};
  var composes = {level: 4, name: "composés"};
  var variantes = {level: 4, name: "variantes"};
  var holonymes = {level: 4, name: "holonymes"};
  var gentiles = {level: 4, name: "gentilés"};
  var translitterations = {level: 4, name: "translittérations"};
  var transcriptions = {level: 4, name: "transcriptions"};
  var derives = {level: 4, name: "dérivés"};
  var apparentes = {level: 4, name: "apparentés"};
  var conjugaison = {level: 4, name: "conjugaison"};
  var attestations = {level: 4, name: "attestations"};
  var synonymes = {level: 4, name: "synonymes"};
  var abreviations = {level: 4, name: "abréviations"};
  var varOrtho = {level: 4, name: "variantes orthographiques"};
  var varDialec = {level: 4, name: "variantes dialectales"};
  var meronymes = {level: 4, name: "méronymes"};
  var nomsVerna = {level: 4, name: "noms vernaculaires"};
  var hyponymes = {level: 4, name: "hyponymes"};
  var citations = {level: 4, name: "citations"};
  var anciennesOrtho = {level: 4, name: "anciennes orthographes"};
  var diminutifs = {level: 4, name: "diminutifs"};
  var sources = {level: 4, name: "sources"};
  var bibliographie = {level: 4, name: "bibliographie"};

  var tradATrier = {level: 5, name: "traductions à trier"};

  return {
    "note": {level: 5, name: "note"},
    "vocabulaire proche": vocabulaire,
    "vocabulaire apparenté": vocabulaire,
    "champ lexical": vocabulaire,
    "voc": vocabulaire,
    "vocabulaires": vocabulaire,
    "vocabulaire": vocabulaire,
    "étym": etymologie,
    "etym": etymologie,
    "étymologie": etymologie,
    "étymologies": etymologie,
    "vidéos": {level: 4, name: "vidéos"},
    "tropo": troponymes,
    "troponymes": troponymes,
    "écrit": ecriture,
    "écriture": ecriture,
    "dico-sino": dicoSino,
    "sino-dico": dicoSino,
    "dico sinogrammes": dicoSino,
    "paro": paronymes,
    "paronymes": paronymes,
    "trad": traductions,
    "traductions": traductions,
    "q-syn": quasiSynonymes,
    "quasi-syn": quasiSynonymes,
    "quasi-synonymes": quasiSynonymes,
    "drv-int": derivesAutresLangues,
    "dérivés int": derivesAutresLangues,
    "dérivés-int": derivesAutresLangues,
    "dérivés en d'autres langues": derivesAutresLangues,
    "dérivés en d’autres langues": derivesAutresLangues,
    "dérivés autres langues": derivesAutresLangues,
    "expr": expressions,
    "exp": expressions,
    "expressions": expressions,
    "anto": antonymes,
    "ant": antonymes,
    "antonyme": antonymes,
    "antonymes": antonymes,
    "augm": augmentatif,
    "augmentatifs": augmentatif,
    "homo": homophones,
    "homophone": homophones,
    "homophones": homophones,
    "pron": pron,
    "prononciations": pron,
    "prononciation": pron,
    "hyper": hyperonymes,
    "hyperonymes": hyperonymes,
    "décl": declinaison,
    "déclinaison": declinaison,
    "voir": voirAussi,
    "voir aussi": voirAussi,
    "compos": composes,
    "composés": composes,
    "var": variantes,
    "variante": variantes,
    "variantes": variantes,
    "holo": holonymes,
    "holonymes": holonymes,
    "gent": gentiles,
    "gentilés": gentiles,
    "translit": translitterations,
    "translittérations": translitterations,
    "tran": transcriptions,
    "trans": transcriptions,
    "transcriptions": transcriptions,
    "drv": derives,
    "dérivé": derives,
    "dérivés": derives,
    "apr": apparentes,
    "app": apparentes,
    "apparentés étymologiques": apparentes,
    "apparentés": apparentes,
    "notes": {level: 5, name: "notes"},
    "conjug": conjugaison,
    "conjugaison": conjugaison,
    "référence": references,
    "réf": references,
    "ref": references,
    "références": references,
    "hist": attestations,
    "attest": attestations,
    "attestations": attestations,
    "syn": synonymes,
    "synonyme": synonymes,
    "synonymes": synonymes,
    "abrév": abreviations,
    "abréviation": abreviations,
    "abréviations": abreviations,
    "variantes orthographiques": varOrtho,
    "variante orthographique": varOrtho,
    "var-ortho": varOrtho,
    "variantes ortho": varOrtho,
    "autres orthographes": varOrtho,
    "autres graphies": varOrtho,
    "graphies alternatives": varOrtho,
    "orthographes alternative": varOrtho,
    "dial": varDialec,
    "variantes dialectes": varDialec,
    "variantes dial": varDialec,
    "dialectes": varDialec,
    "var-dial": varDialec,
    "variantes dialectales": varDialec,
    "faux-amis": {level: 4, name: "faux-amis"},
    "méro": meronymes,
    "méronymes": meronymes,
    "trad trier": tradATrier,
    "trad-trier": tradATrier,
    "traductions à trier": tradATrier,
    "noms-vern": nomsVerna,
    "noms vernaculaires": nomsVerna,
    "hypo": hyponymes,
    "hyponymes": hyponymes,
    "cit": citations,
    "citations": citations,
    "anciennes ortho": anciennesOrtho,
    "ortho-arch": anciennesOrtho,
    "anciennes orthographes": anciennesOrtho,
    "dimin": diminutifs,
    "diminutifs": diminutifs,
    "anagr": anagrammes,
    "anagramme": anagrammes,
    "anagrammes": anagrammes,
    "source": sources,
    "src": sources,
    "bibliographie": bibliographie,
    "bib": bibliographie,
    "biblio": bibliographie,
    "phrases": {level: 4, name: "phrases"},

    // Grammatical section types
    "pronom": {level: 3, name: "pronom", hasCode: true},
    "pronom-adjectif": {level: 3, name: "pronom-adjectif", hasCode: true},
    "copule": {level: 3, name: "copule", hasCode: true},
    "symb": symbole,
    "symbole": symbole,
    "adverbe int": advInter,
    "adv-int": advInter,
    "adverbe interrogatif": advInter,
    "préf": prefixe,
    "préfixe": prefixe,
    "adjectif pos": adjPosses,
    "adj-pos": adjPosses,
    "adjectif possessif": adjPosses,
    "circon": circonfixe,
    "circonf": circonfixe,
    "circonfixe": circonfixe,
    "loc": locution,
    "locution": locution,
    "sino": sinogramme,
    "sinog": sinogramme,
    "sinogramme": sinogramme,
    "onoma": onomatopée,
    "onom": onomatopée,
    "onomatopée": onomatopée,
    "rad": radical,
    "radical": radical,
    "art-indéf": artIndef,
    "article ind": artIndef,
    "article indéfini": artIndef,
    "numér": numeral,
    "num": numeral,
    "numéral": numeral,
    "nom-sciences": nomScient,
    "nom scient": nomScient,
    "nom science": nomScient,
    "nom scientifique": nomScient,
    "class": classificateur,
    "classif": classificateur,
    "classificateur": classificateur,
    "interj": interjection,
    "interjection": interjection,
    "verb-pr": verbeProno,
    "verbe pr": verbeProno,
    "verbe pronominal": verbeProno,
    "variante typo": varTypo,
    "var-typo": varTypo,
    "variante par contrainte typographique": varTypo,
    "variante typographique": varTypo,
    "adjectif qualificatif": adj,
    "adj": adj,
    "adjectif": adj,
    "article déf": artDef,
    "art-déf": artDef,
    "article défini": artDef,
    "lettre": {level: 3, name: "lettre", hasCode: true},
    "quantif": quantificateur,
    "quantifieur": quantificateur,
    "quantificateur": quantificateur,
    "prov": proverbe,
    "proverbe": proverbe,
    "nom commun": nom,
    "substantif": nom,
    "nom": nom,
    "locution nominale": nom,
    "locution-nominale": nom,
    "loc-nom": nom,
    "pronom réf": pronomPers,
    "pronom-pers": pronomPers,
    "pronom-per": pronomPers,
    "pronom réfléchi": pronomPers,
    "pronom-réfl": pronomPers,
    "pronom personnel": pronomPers,
    "pronom-rel": pronomRel,
    "pronom rel": pronomRel,
    "pronom relatif": pronomRel,
    "post": postposition,
    "postpos": postposition,
    "postposition": postposition,
    "pronom int": pronomInter,
    "pronom-int": pronomInter,
    "pronom interrogatif": pronomInter,
    "rafsi": {level: 3, name: "rafsi", hasCode: true},
    "pré-nom": {level: 3, name: "pré-nom", hasCode: true},
    "pré-verbe": {level: 3, name: "pré-verbe", hasCode: true},
    "suf": suffixe,
    "suff": suffixe,
    "suffixe": suffixe,
    "part": part,
    "particule": part,
    "gismu": {level: 3, name: "gismu", hasCode: true},
    "art-part": artPart,
    "article par": artPart,
    "article partitif": artPart,
    "part-num": partNum,
    "particule num": partNum,
    "particule numérale": partNum,
    "conj": conjonction,
    "conjonction": conjonction,
    "nom-fam": nomFamille,
    "nom de famille": nomFamille,
    "interf": interfixe,
    "interfixe": interfixe,
    "adv-rel": advRel,
    "adverbe rel": advRel,
    "adverbe relatif": advRel,
    "pronom dém": pronomDem,
    "pronom-dém": pronomDem,
    "pronom démonstratif": pronomDem,
    "adv-pron": advProno,
    "adverbe pro": advProno,
    "adverbe pronominal": advProno,
    "adj-dém": adjDem,
    "adjectif dém": adjDem,
    "adjectif démonstratif": adjDem,
    "verb": verbe,
    "verbe": verbe,
    "adj-num": adjNum,
    "adjectif num": adjNum,
    "adjectif numéral": adjNum,
    "adjectif ind": adjIndef,
    "adj-indéf": adjIndef,
    "adjectif indéfini": adjIndef,
    "inf": infixe,
    "infixe": infixe,
    "nom-pr": nomPropre,
    "nom propre": nomPropre,
    "pronom pos": pronomPos,
    "pronom-pos": pronomPos,
    "pronom possessif": pronomPos,
    "pronom ind": pronomIndef,
    "pronom-indéf": pronomIndef,
    "pronom indéfini": pronomIndef,
    "adj-excl": adjExcl,
    "adjectif exc": adjExcl,
    "adjectif exclamatif": adjExcl,
    "patronyme": {level: 3, name: "patronyme", hasCode: true},
    "prép": preposition,
    "préposition": preposition,
    "prénom": {level: 3, name: "prénom", hasCode: true},
    "aff": affixe,
    "affixe": affixe,
    "loc-phr": locPhrase,
    "locution-phrase": locPhrase,
    "phrase": locPhrase,
    "conj-coord": conjCoord,
    "conjonction coo": conjCoord,
    "conjonction de coordination": conjCoord,
    "adj-int": adjInter,
    "adjectif int": adjInter,
    "adjectif interrogatif": adjInter,
    "dét": determinant,
    "déterminant": determinant,
    "adv": adv,
    "adverbe": adv,
    "art": article,
    "article": article,
  };
})();
