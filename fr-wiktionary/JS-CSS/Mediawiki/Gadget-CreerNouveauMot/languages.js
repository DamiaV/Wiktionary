/**
 * This object contains the data for languages needed by the gadget.
 */
// <nowiki>
window.languages = {
  /**
   * All available grammatical genders.
   * @type {Record<string, GrammaticalProperty>}
   */
  GENDERS: {
    MASCULINE: new GrammaticalProperty("masculin", "{{m}}"),
    FEMININE: new GrammaticalProperty("féminin", "{{f}}"),
    FEMININE_MASCULINE_DIFF: new GrammaticalProperty("masc. et fém. différents"),
    FEMININE_MASCULINE: new GrammaticalProperty("masc. et fém. identiques", "{{mf}}"),
  },
  /**
   * All available grammatical numbers.
   * @type {Record<string, GrammaticalProperty>}
   */
  NUMBERS: {
    DIFF_SINGULAR_PLURAL: new GrammaticalProperty("sing. et plur. différents"),
    SAME_SINGULAR_PLURAL: new GrammaticalProperty("sing. et plur. identiques", "{{sp}}"),
    SINGULAR_ONLY: new GrammaticalProperty("singulier uniquement", "{{au singulier uniquement|{0}}}"),
    PLURAL_ONLY: new GrammaticalProperty("pluriel uniquement", "{{au pluriel uniquement|{0}}}"),
    INVARIABLE: new GrammaticalProperty("invariable", "{{invariable}}"),
    COLLECTIVE_SINGULATIVE: new GrammaticalProperty("collectif et singulatif", "{{collectif}}"),
    COLLECTIVE_SINGULATIVE_PLURAL: new GrammaticalProperty("collectif, singulatif, et pluriel du singulatif", "{{collectif}}"),
    SINGULATIVE_DUAL_PLURAL: new GrammaticalProperty("singulier, duel, et pluriel"),
  },
  /**
   * All available verb groups and types.
   * @type {Record<string, GrammaticalProperty>}
   */
  VERBS: {
    GROUP1: new GrammaticalProperty("1<sup>er</sup> groupe", "{{type|{0}}} {{conjugaison|{0}|groupe=1}}"),
    GROUP2: new GrammaticalProperty("2<sup>ème</sup> groupe", "{{type|{0}}} {{conjugaison|{0}|groupe=2}}"),
    GROUP3: new GrammaticalProperty("3<sup>ème</sup> groupe", "{{type|{0}}} {{conjugaison|{0}|groupe=3}}"),
    REGULAR_VERB: new GrammaticalProperty("régulier", "{{type|{0}}}"),
    IRREGULAR_VERB: new GrammaticalProperty("irrégulier", "{{type|{0}}}"),
  },
  /**
   * All available grammatical classes.
   * @type {Record<string, GrammaticalClass>}
   */
  GRAMMATICAL_CLASSES: {
    SYMBOL: new GrammaticalClass("symbole", "symbole"),
    LETTER: new GrammaticalClass("lettre", "lettre"),

    SCIENTIFIC_NAME: new GrammaticalClass("nom scientifique", "nom scientifique"),

    // Nouns
    NOUN: new GrammaticalClass("nom commun", "nom"),
    PROPER_NOUN: new GrammaticalClass("nom propre", "nom propre"),
    FIRST_NAME: new GrammaticalClass("prénom", "prénom"),
    LAST_NAME: new GrammaticalClass("nom de famille", "nom de famille"),

    // Adjectives
    ADJECTIVE: new GrammaticalClass("adjectif", "adjectif"),
    INTERROGATIVE_ADJECTIVE: new GrammaticalClass("adjectif interrogatif", "adjectif interrogatif"),
    NUMERAL_ADJECTIVE: new GrammaticalClass("adjectif numéral", "adjectif numéral"),
    POSSESSIVE_ADJECTIVE: new GrammaticalClass("adjectif possessif", "adjectif possessif"),

    // Adverbs
    ADVERB: new GrammaticalClass("adverbe", "adverbe"),
    INTERROGATIVE_ADVERB: new GrammaticalClass("adverbe interrogatif", "adverbe interrogatif"),

    // Pronouns
    PRONOUN: new GrammaticalClass("pronom", "pronom"),
    DEMONSTRATIVE_PRONOUN: new GrammaticalClass("pronom démonstratif", "pronom démonstratif"),
    INDEFINITE_PRONOUN: new GrammaticalClass("pronom indéfini", "pronom indéfini"),
    INTERROGATIVE_PRONOUN: new GrammaticalClass("pronom interrogatif", "pronom interrogatif"),
    PERSONAL_PRONOUN: new GrammaticalClass("pronom personnel", "pronom personnel"),
    POSSESSIVE_PRONOUN: new GrammaticalClass("pronom possessif", "pronom possessif"),
    RELATIVE_PRONOUN: new GrammaticalClass("pronom relatif", "pronom relatif"),

    // Conjunctions
    CONJUNCTION: new GrammaticalClass("conjonction", "conjonction"),
    COORDINATION_CONJUNCTION: new GrammaticalClass("conjonction de coordination", "conjonction de coordination"),

    // Articles
    ARTICLE: new GrammaticalClass("article", "article"),
    INDEFINITE_ARTICLE: new GrammaticalClass("article indéfini", "article indéfini"),
    DEFINITE_ARTICLE: new GrammaticalClass("article défini", "article défini"),
    PARTITIVE_ARTICLE: new GrammaticalClass("article partitif", "article partitif"),

    // Affixes
    PREFIX: new GrammaticalClass("préfixe", "préfixe"),
    SUFFIX: new GrammaticalClass("suffixe", "suffixe"),
    CIRCUMFIX: new GrammaticalClass("circonfixe", "circonfixe"),
    INFIX: new GrammaticalClass("infixe", "infixe"),

    VERB: new GrammaticalClass("verbe", "verbe"),
    PREPOSITION: new GrammaticalClass("préposition", "préposition"),
    POSTPOSITION: new GrammaticalClass("postposition", "postposition"),
    PARTICLE: new GrammaticalClass("particule", "particule"),
    INTERJECTION: new GrammaticalClass("interjection", "interjection"),

    PHRASE: new GrammaticalClass("locution/phrase", "locution-phrase"),
  },
  /**
   * Load all languages into the gadget.
   * @param gadget {GadgetCreerNouveauMot} The gadget.
   */
  load: function (gadget) {
    /*
     * French language definition.
     */

    const getFrenchModel = (word, grammarClass, properties, pron, simple) => {
      const [gender, number] = properties.length >= 2 ? properties : [null, this.NUMBERS.INVARIABLE.label];
      if (number === this.NUMBERS.INVARIABLE.label)
        return `{{fr-inv|${pron}|inv_titre=${grammarClass}}}`;
      if (number === this.NUMBERS.SAME_SINGULAR_PLURAL.label)
        return `{{fr-inv|${pron}|sp=oui}}`;
      if (number === this.NUMBERS.SINGULAR_ONLY.label)
        return `{{fr-inv|${pron}|inv_titre=Singulier}}`;
      if (number === this.NUMBERS.PLURAL_ONLY.label)
        return `{{fr-inv|${pron}|inv_titre=Pluriel}}`;

      if (gender === this.GENDERS.FEMININE_MASCULINE.label)
        return `{{fr-rég|${pron}|mf=oui}}`;

      return simple ? `{{fr-rég|${pron}}}` : `{{fr-accord-rég|${pron}}}`;
    };

    gadget.addLanguage(new Language(
        "fr",
        "fr",
        "fra",
        "français",
        [
          ["a", "ɑ", "ɑ̃", "ə", "œ", "œ̃", "ø", "e", "ɛ", "ɛ̃", "i", "o", "ɔ", "ɔ̃", "y", "u"],
          ["b", "d", "f", "ɡ", "k", "l", "m", "n", "ɲ", "ŋ", "p", "ʁ", "s", "ʃ", "t", "v", "z", "ʒ"],
          ["j", "w", "ɥ"],
          [".", "‿"],
        ],
        [
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.ADJECTIVE, [[this.GENDERS.FEMININE_MASCULINE_DIFF, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.ADVERB, [], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.NOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], (word, grammarClass, properties, pron) => getFrenchModel(word, grammarClass, properties, pron, true)),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PROPER_NOUN, [[this.GENDERS.FEMININE, this.GENDERS.MASCULINE, this.GENDERS.FEMININE_MASCULINE]]),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.VERB, [[this.VERBS.GROUP1, this.VERBS.GROUP2, this.VERBS.GROUP3]]),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PHRASE),

          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB, [], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.DEFINITE_ARTICLE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.CONJUNCTION, [], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION, [], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERJECTION, [], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.LAST_NAME, []),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PARTICLE, [], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSTPOSITION, [], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PREFIX),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.FIRST_NAME, []),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PREPOSITION, [], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getFrenchModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], (word, grammarClass, properties, pron) => getFrenchModel(word, grammarClass, properties, pron, true)),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], (word, grammarClass, properties, pron) => getFrenchModel(word, grammarClass, properties, pron, true)),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], (word, grammarClass, properties, pron) => getFrenchModel(word, grammarClass, properties, pron, true)),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PERSONAL_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], (word, grammarClass, properties, pron) => getFrenchModel(word, grammarClass, properties, pron, true)),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], (word, grammarClass, properties, pron) => getFrenchModel(word, grammarClass, properties, pron, true)),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.RELATIVE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], (word, grammarClass, properties, pron) => getFrenchModel(word, grammarClass, properties, pron, true)),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.SUFFIX),
        ]
    )); // fr

    /*
     * English language definition.
     */

    const getEnglishModel = (_, grammarClass, properties, pron) => {
      const number = properties[0];
      if (number === this.NUMBERS.SAME_SINGULAR_PLURAL.label)
        return `{{en-inv|${pron}|sp=oui}}`;
      if (number === this.NUMBERS.SINGULAR_ONLY.label)
        return `{{en-inv|${pron}|inv_titre=Singulier}}`;
      if (number === this.NUMBERS.PLURAL_ONLY.label)
        return `{{en-inv|${pron}|inv_titre=Pluriel}}`;
      return `{{en-inv|${pron}|inv_titre=${grammarClass}}}`;
    };

    gadget.addLanguage(new Language(
        "en",
        "en",
        "eng",
        "anglais",
        [
          ["i", "iː", "ɪ", "ɛ", "æ", "ə", "ɚ", "ɜː", "ɝ", "uː", "u", "ʊ", "ʌ", "ɔː", "ɑː", "ɒ"],
          ["aɪ", "aʊ", "eə", "eɪ", "əʊ", "oʊ", "ɔə", "ɔɪ", "ɪə", "ʊə", "uə"],
          ["b", "d", "f", "ɡ", "h", "k", "l", "m", "n", "ŋ", "ɲ", "p", "ɹ", "ɻ", "s", "ʃ", "t", "θ", "ð", "v", "z", "ʒ"],
          ["j", "w"],
          [".", "ˈ", "ˌ", "ː"],
        ],
        [
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.ADJECTIVE, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.ADVERB, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.NOUN, [[this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], (word, grammarClass, properties, pron) => properties[0] !== this.NUMBERS.DIFF_SINGULAR_PLURAL.label ? getEnglishModel(grammarClass, properties, pron) : `{{en-nom-rég|${pron}}}`),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PROPER_NOUN, [[this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.VERB, [[this.VERBS.REGULAR_VERB, this.VERBS.IRREGULAR_VERB]], (word, grammarClass, properties, pron) => properties[0] === this.VERBS.REGULAR_VERB.label ? `{{en-conj-rég|inf.pron=${pron}}}` : `{{en-conj-irrég|inf=${word}|inf.pron=${pron}|<!-- Compléter -->}}`),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PHRASE),

          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.DEFINITE_ARTICLE, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.CONJUNCTION, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERJECTION, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.LAST_NAME, [[this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], (word, grammarClass, properties, pron) => properties[0] !== this.NUMBERS.DIFF_SINGULAR_PLURAL.label ? getEnglishModel(grammarClass, properties, pron) : `{{en-nom-rég|${pron}}}`),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PARTICLE, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSTPOSITION, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PREFIX),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.FIRST_NAME, [[this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], (word, grammarClass, properties, pron) => properties[0] !== this.NUMBERS.DIFF_SINGULAR_PLURAL.label ? getEnglishModel(grammarClass, properties, pron) : `{{en-nom-rég|${pron}}}`),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PREPOSITION, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PRONOUN, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PERSONAL_PRONOUN, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.RELATIVE_PRONOUN, [], getEnglishModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.SUFFIX),
        ]
    )); // en

    /*
     * Italian language definition.
     */

    const getItalianModel = (word, grammarClass, properties, pron) => {
      const [gender, number] = properties.length >= 2 ? properties : [null, this.NUMBERS.INVARIABLE.label];
      if (number === this.NUMBERS.INVARIABLE.label)
        return `{{it-inv|${pron}|inv_titre=${grammarClass}}}`;
      if (number === this.NUMBERS.SAME_SINGULAR_PLURAL.label)
        return `{{it-inv|${pron}|sp=oui}}`;
      if (number === this.NUMBERS.SINGULAR_ONLY.label)
        return `{{it-inv|${pron}|inv_titre=Singulier}}`;
      if (number === this.NUMBERS.PLURAL_ONLY.label)
        return `{{it-inv|${pron}|inv_titre=Pluriel}}`;

      if (gender === this.GENDERS.FEMININE_MASCULINE.label)
        return `{{it-flexion|${pron}|mf=oui}}`;

      return `{{it-flexion|${pron}}}`;
    };

    gadget.addLanguage(new Language(
        "it",
        "it",
        "ita",
        "italien",
        [
          ["a", "e", "ɛ", "i", "o", "ɔ", "u"],
          ["b", "d", "d͡z", "d͡ʒ", "f", "ɡ", "k", "l", "ʎ", "m", "ɱ", "n", "ŋ", "ɲ", "p", "r", "s", "ʃ", "t", "t͡s", "t͡ʃ", "v", "z"],
          ["j", "w"],
          [".", "ˈ", "ː"],
        ],
        [
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.ADJECTIVE, [[this.GENDERS.FEMININE_MASCULINE_DIFF, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.ADVERB, [], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.NOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PROPER_NOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE]]),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.VERB, [[this.VERBS.GROUP1, this.VERBS.GROUP2, this.VERBS.GROUP3]]),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PHRASE),

          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB, [], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.DEFINITE_ARTICLE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.CONJUNCTION, [], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION, [], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERJECTION, [], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.LAST_NAME, []),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PARTICLE, [], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSTPOSITION, [], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PREFIX),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.FIRST_NAME, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE]]),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PREPOSITION, [], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PERSONAL_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.RELATIVE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getItalianModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.SUFFIX),
        ]
    )); // it

    /*
     * Portuguese language definition.
     */

    const getPortugueseModel = (word, grammarClass, properties, pron) => {
      const [gender, number] = properties.length >= 2 ? properties : [null, this.NUMBERS.INVARIABLE.label];
      if (number === this.NUMBERS.INVARIABLE.label)
        return `{{pt-inv|${pron}|inv_titre=${grammarClass}}}`;
      if (number === this.NUMBERS.SAME_SINGULAR_PLURAL.label)
        return `{{pt-inv|${pron}|sp=oui}}`;
      if (number === this.NUMBERS.SINGULAR_ONLY.label)
        return `{{pt-inv|${pron}|inv_titre=Singulier}}`;
      if (number === this.NUMBERS.PLURAL_ONLY.label)
        return `{{pt-inv|${pron}|inv_titre=Pluriel}}`;

      if (gender === this.GENDERS.FEMININE_MASCULINE.label)
        return `{{pt-rég|${pron}|mf=oui}}`;

      return `{{pt-rég|${pron}}}`;
    };

    gadget.addLanguage(new Language(
        "pt",
        "pt",
        "por",
        "portugais",
        [
          ["ɐ", "a", "e", "ɛ", "ɨ", "i", "u", "o", "ɔ"],
          ["ɐ̃", "ɐ̃w̃", "ẽ", "ẽj̃", "ĩ", "ĩɰ̃", "õ", "õj̃", "õw̃", "ũ"],
          ["b", "s", "k", "ʃ", "d", "f", "ʒ", "ɡ", "w", "l", "ʎ", "m", "n", "ɲ", "p", "ɦ", "ɣ", "x", "ɾ", "r", "ħ", "ɹ", "ɦ", "z", "t", "v"]
        ],
        [
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.ADJECTIVE, [[this.GENDERS.FEMININE_MASCULINE_DIFF, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.ADVERB, [], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.NOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PROPER_NOUN, []),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.VERB, [[this.VERBS.GROUP1, this.VERBS.GROUP2, this.VERBS.GROUP3]]),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PHRASE),

          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB, [], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.DEFINITE_ARTICLE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.CONJUNCTION, [], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION, [], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERJECTION, [], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.LAST_NAME, []),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PARTICLE, [], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSTPOSITION, [], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PREFIX),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.FIRST_NAME, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE]]),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PREPOSITION, [], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PERSONAL_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.RELATIVE_PRONOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.SAME_SINGULAR_PLURAL, this.NUMBERS.SINGULAR_ONLY, this.NUMBERS.PLURAL_ONLY, this.NUMBERS.INVARIABLE]], getPortugueseModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.SUFFIX),
        ]
    )); // pt

    /*
     * Esperanto language definition.
     */

    const getEsperantoModel = (_, grammarClass, properties, pron) => {
      if (properties[0] === this.NUMBERS.DIFF_SINGULAR_PLURAL.label)
        return `{{eo-flexions|${pron}}}`;
      if (grammarClass.toLowerCase() === this.GRAMMATICAL_CLASSES.VERB.label)
        return "{{eo-verbe}} {{type|eo}}";
      return "";
    };

    gadget.addLanguage(new Language(
        "eo",
        "eo",
        "epo",
        "espéranto",
        [
          ["a", "e", "i", "o", "u"],
          ["b", "d", "d͡ʒ", "f", "ɡ", "h", "k", "l", "m", "n", "p", "r", "s", "t", "t͡s", "t͡ʃ", "v", "x", "z", "ʃ", "ʒ"],
          ["j", "w"],
          [".", "ˈ"],
        ],
        [
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.ADJECTIVE, [[this.NUMBERS.DIFF_SINGULAR_PLURAL]], getEsperantoModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.ADVERB, [[this.NUMBERS.INVARIABLE]], getEsperantoModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.NOUN, [[this.NUMBERS.DIFF_SINGULAR_PLURAL]], getEsperantoModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PROPER_NOUN, [[this.NUMBERS.DIFF_SINGULAR_PLURAL]], getEsperantoModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.VERB, [], getEsperantoModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PHRASE),

          new GrammaticalItem(this.GRAMMATICAL_CLASSES.CONJUNCTION, [[this.NUMBERS.DIFF_SINGULAR_PLURAL]], getEsperantoModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERJECTION, [[this.NUMBERS.INVARIABLE]], getEsperantoModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.FIRST_NAME, [[this.NUMBERS.DIFF_SINGULAR_PLURAL]], getEsperantoModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PREPOSITION, [[this.NUMBERS.INVARIABLE]], getEsperantoModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PRONOUN, [[this.NUMBERS.INVARIABLE]], getEsperantoModel),
        ],
        word => word.toLowerCase()
            .replace(/c/g, "t͡s")
            .replace(/ĉ/g, "t͡ʃ")
            .replace(/g/g, "ɡ")
            .replace(/ĝ/g, "d͡ʒ")
            .replace(/ĥ/g, "x")
            .replace(/ĵ/g, "ʒ")
            .replace(/ŝ/g, "ʃ")
            .replace(/ŭ/g, "w")
    )); // eo

    /*
     * Breton language definition.
     */

    const getBretonModel = (word, grammarClass, properties) => {
      const number = properties[1];
      if (number === this.NUMBERS.DIFF_SINGULAR_PLURAL.label)
        return `{{br-nom|${word}}}`;
      if (number === this.NUMBERS.COLLECTIVE_SINGULATIVE.label)
        return `{{br-nom-cs|${word}}}`;
      if (number === this.NUMBERS.COLLECTIVE_SINGULATIVE_PLURAL.label)
        return `{{br-nom-csp|${word}}}`;
      if (number === this.NUMBERS.SINGULATIVE_DUAL_PLURAL.label)
        return `{{br-nom-duel|${word}|<!-- DUEL À COMPLÉTER -->}}`;
      const grammarClass_ = grammarClass.toLowerCase();
      if (grammarClass_ === this.GRAMMATICAL_CLASSES.PROPER_NOUN.label)
        return `{{br-nom-pr}}`;
      if (grammarClass_ === this.GRAMMATICAL_CLASSES.FIRST_NAME.label)
        return `{{br-nom-pr|forme=Prénom}}`;
      if (grammarClass_ === this.GRAMMATICAL_CLASSES.LAST_NAME.label)
        return `{{br-nom-pr|forme=Nom de famille}}`;
      if (grammarClass_ === this.GRAMMATICAL_CLASSES.ADJECTIVE.label)
        return `{{br-flex-adj}}`;
      if (grammarClass_ === this.GRAMMATICAL_CLASSES.VERB.label)
        return `{{br-forme-mut|${word}}}`;
      if (grammarClass_ === this.GRAMMATICAL_CLASSES.PREPOSITION.label)
        return `{{br-prép|${word}|<!-- TYPE À COMPLÉTER -->}}`;
      return "";
    };

    gadget.addLanguage(new Language(
        "br",
        "br",
        "bre",
        "breton",
        [
          ["a", "ɑ", "ɒ", "e", "ɛ", "i", "o", "ɔ", "y"],
          ["ã", "ẽ", "ɛ̃", "ĩ", "õ", "ɔ̃", "ỹ"],
          ["k", "ɡ", "t", "d", "d͡ʒ", "p", "b", "ʃ", "ʒ", "f", "v", "ʋ", "f̬", "v̝", "s", "z",
            "\u03c7", "x", "ɣ", "h", "ɦ", "t͡ʃ", "c", "l", "r", "r̥", "ʁ", "ʀ", "ɾ", "m", "n"],
          ["j", "ɥ", "w"],
          [".", "ˈ", "ˑ", "ː"],
        ],
        [
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.ADJECTIVE, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.ADVERB, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.NOUN, [[this.GENDERS.MASCULINE, this.GENDERS.FEMININE, this.GENDERS.FEMININE_MASCULINE], [this.NUMBERS.DIFF_SINGULAR_PLURAL, this.NUMBERS.COLLECTIVE_SINGULATIVE, this.NUMBERS.COLLECTIVE_SINGULATIVE_PLURAL, this.NUMBERS.SINGULATIVE_DUAL_PLURAL]], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PROPER_NOUN),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.VERB, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PHRASE),

          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.DEFINITE_ARTICLE, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.CONJUNCTION, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERJECTION, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.LAST_NAME),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PARTICLE, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSTPOSITION, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PREFIX),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.FIRST_NAME),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PREPOSITION, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PRONOUN, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PERSONAL_PRONOUN, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.RELATIVE_PRONOUN, [], getBretonModel),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.SUFFIX),
        ]
    )); // br

    /*
     * International conventions "language" definition.
     */

    gadget.addLanguage(new Language(
        "conv",
        null,
        null,
        "conventions internationales",
        [],
        [
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.SCIENTIFIC_NAME),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.PROPER_NOUN),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.SYMBOL),
          new GrammaticalItem(this.GRAMMATICAL_CLASSES.ADVERB),
        ]
    )); // conv
  },
  /**
   * Return a default Language object for the given code and name.
   * @param code {string} The language’s code.
   * @param name {string} The language’s name.
   * @returns {Language} A new Language object.
   */
  getDefaultLanguage: function (code, name) {
    // Add most common classes on top
    const topClasses = ["ADJECTIVE", "ADVERB", "NOUN", "VERB", "PRONOUN", "PROPER_NOUN", "INTERJECTION"];
    const items = topClasses.map(key => new GrammaticalItem(this.GRAMMATICAL_CLASSES[key]));
    // Add all remaining classes
    for (const [k, v] of Object.entries(this.GRAMMATICAL_CLASSES)) {
      if (!topClasses.includes(k)) {
        items.push(new GrammaticalItem(v));
        topClasses.push(k);
      }
    }
    return new Language(code, null, null, name, [], items);
  }
};
// </nowiki>
