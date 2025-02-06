/**
 * (fr)
 * Ce gadget permet de facilement créer une entrée dans une langue donnée en
 * remplissant quelques champs de texte.
 * ------------------------------------------------------------------------------------
 * (en)
 * This gadget helps create new entries for a given language by filling out some
 * text fields.
 * ------------------------------------------------------------------------------------
 * v2.0 2012-12-10
 * v2.1 2012-12-26
 * v2.2 2013-01-01
 * v2.3 2013-01-04 dialog box functions restructuration
 * v2.4 2013-01-29 cookies to store preferences
 * v3.0 2013-02-28 tool integration into pages
 * v4.0 2014-01-22 support for new editable sections syntax
 * v5.0 2020-07-29 full rewrite, migration to OOUI
 * v5.0.1 2020-08-01 using {{lien}} for links, reworked toolbar
 * v5.0.2 2020-08-02 added missing sections
 * v5.0.3 2020-08-05 added date template in etymology section
 * v5.0.4 2020-08-05 reordering level 4 sections
 * v5.0.5 2020-08-10 sister projects search links now update on language selection
 * v5.0.6 2020-08-11 inserting : and # if missing
 * v5.0.7 2020-08-20 added default grammatical classes for undefined languages
 * v5.0.8 2020-08-25 added {{type}} template to verbs, fields to insert an image,
 *                   field to add categories; removed lang parameter for some
 *                   interwiki templates
 * v5.1 2020-09-20 added pronunciation section field; added ISO 639-3 code to Language
 *                 class; removed sources section; added help bubbles to some fields
 * v5.1.1 2021-05-08 Edit notice is no longer overwritten by the button
 * v5.1.2 2021-06-15 Merged language definitions into main file
 * v5.1.3 2021-06-28 Moved dependencies to [[MediaWiki:Gadgets-definition]]
 * v5.2 2021-07-07 Non-predefined languages now show actual name instead of code if
 *                 defined in [[MediaWiki:Gadget-translation editor.js/langues.json]].
 *                 Clearer indication of currently selected language.
 *                 Not using wikt.gadgets object that was causing bugs.
 * v5.3 2021-07-07 Prevent code from being inserted if definition field is empty.
 *                 Word type, gender and number are not selected by default anymore
 *                 (except if there is only one choice).
 * v5.4 2022-11-26 Separate fields for each definition and their associated examples.
 * v5.4.1 2022-11-28 Convert to ES6.
 * v5.4.2 2024-03-09 Add buttons to format text in some fields (bold and italic).
 * v5.4.3 2024-08-30 Add option to hide additional sections fields from a user’s [[Special:MyPage/common.js]].
 * v5.4.4 2025-01-22 Add Breton language.
 * -----------------------------------------------------------------------------------------------------------
 * [[Catégorie:JavaScript du Wiktionnaire|CreerNouveauMot.js]]
 * <nowiki>
 */

$(function () {
  // Activate only in main namespace when in edit/submit mode.
  if (wikt.page.hasNamespaceIn([""]) && ["edit", "submit"].includes(mw.config.get("wgAction"))) {
    console.log("Chargement de Gadget-CreerNouveauMot.js…");

    /**
     * Wrapper object for a single definition and its examples.
     */
    class Definition {
      /** @type {string} */
      #text;
      /** @type {Example[]} */
      #examples;

      /**
       * @param text {string} Definition’s text.
       * @param examples {Example[]} Definition’s examples.
       */
      constructor(text, examples) {
        this.#text = text;
        this.#examples = examples;
      }

      /**
       * @return {string} This definition’s text.
       */
      get text() {
        return this.#text;
      }

      /**
       * @return {Example[]} This definition’s examples.
       */
      get examples() {
        return this.#examples;
      }
    }

    /**
     * A definition example features some text, a translation, a transcription and a language.
     */
    class Example {
      /** @type {string} */
      #text;
      /** @type {string|null} */
      #translation;
      /** @type {string|null} */
      #transcription;
      /** @type {string|null} */
      #source;
      /** @type {string|null} */
      #link;
      /** @type {boolean} */
      #disableTranslation;

      /**
       * @param text {string?} Example’s text.
       * @param translation {string|null?} Example’s translation.
       * @param transcription {string|null?} Example’s transcription.
       * @param source {string|null?} Example’s source.
       * @param link {string|null?} Example’s link.
       * @param disableTranslation {boolean?} Whether to disable the translation.
       */
      constructor(text, translation, transcription, source, link, disableTranslation) {
        this.#text = text || "";
        this.#translation = translation;
        this.#transcription = transcription;
        this.#source = source;
        this.#link = link;
        this.#disableTranslation = disableTranslation;
      }

      /**
       * @return {string} This example’s text.
       */
      get text() {
        return this.#text;
      }

      /**
       * @return {string|null} This example’s translation or null if none is available.
       */
      get translation() {
        return this.#translation;
      }

      /**
       * @return {string|null} This example’s transcription or null if none is available.
       */
      get transcription() {
        return this.#transcription;
      }

      /**
       * @return {string|null} This example’s source or null if none is available.
       */
      get source() {
        return this.#source;
      }

      /**
       * @return {string|null} This example’s link or null if none is available.
       */
      get link() {
        return this.#link;
      }

      /**
       * @return {boolean} Whether the translation should be disabled.
       */
      get disableTranslation() {
        return this.#disableTranslation;
      }
    }

    /**
     * This class represents a grammatical property with a name and an associated template.
     * @abstract
     */
    class GrammaticalProperty {
      /** @type {string} */
      #label;
      /** @type {string} */
      #template;

      /**
       * @param label {string} Property’s label.
       * @param template {string?} Property’s template if any.
       */
      constructor(label, template) {
        if (new.target === GrammaticalProperty) {
          throw TypeError("new of abstract class GrammaticalProperty");
        }
        this.#label = label;
        this.#template = template || "";
      }

      /**
       * @return {string} The label.
       */
      get label() {
        return this.#label;
      }

      /**
       * @return {string} The template if any.
       */
      get template() {
        return this.#template;
      }
    }

    /**
     * This class represents a grammatical number (singular, plural, etc.).
     */
    class GrammaticalNumber extends GrammaticalProperty {
      /**
       * @param label {string} Number’s label.
       * @param template {string?} Number’s template if any.
       */
      constructor(label, template) {
        super(label, template);
      }
    }

    /**
     * This class represents a grammatical gender (feminine, masculine, etc.).
     */
    class GrammaticalGender extends GrammaticalProperty {
      /**
       * @param label {string} Gender’s label.
       * @param template {string?} Gender’s template if any.
       */
      constructor(label, template) {
        super(label, template);
      }
    }

    /**
     * This class represents a grammatical class.
     */
    class GrammaticalClass {
      /** @type {string} */
      #label;
      /** @type {string} */
      #sectionCode;

      /**
       * @param label {string} Class’ label.
       * @param sectionCode {string} Class’ section code.
       * (as defined in [[Wiktionnaire:Structure_des_pages#Résumé_des_sections]] 2,1 onwards).
       */
      constructor(label, sectionCode) {
        this.#label = label;
        this.#sectionCode = sectionCode;
      }

      /**
       * @return {string} Class’ label.
       */
      get label() {
        return this.#label;
      }

      /**
       * @return {string} Class’ section code.
       */
      get sectionCode() {
        return this.#sectionCode;
      }
    }

    /**
     * A grammatical item associates a grammatical class to genders and numbers.
     */
    class GrammaticalItem {
      /** @type {GrammaticalClass} */
      #grammaticalClass;
      /** @type {GrammaticalGender[]} */
      #availableGenders;
      /** @type {GrammaticalNumber[]} */
      #availableNumbers;
      /** @type {Function} */
      #generateInflections;

      /**
       * @param grammaticalClass {GrammaticalClass} The grammatical class.
       * @param availableGenders {GrammaticalGender[]?} Associated genders.
       * @param availableNumbers {GrammaticalNumber[]?} Associated numbers.
       * @param generateInflections {Function?} Optional function that generates inflections template.
       */
      constructor(grammaticalClass, availableGenders, availableNumbers, generateInflections) {
        this.#grammaticalClass = grammaticalClass;
        this.#availableGenders = availableGenders || [];
        this.#availableNumbers = availableNumbers || [];
        this.#generateInflections = generateInflections || (() => "");
      }

      /**
       * @return {GrammaticalClass} The grammatical class.
       */
      get grammaticalClass() {
        return this.#grammaticalClass;
      }

      /**
       * @return {GrammaticalGender[]} Associated genders.
       */
      get availableGenders() {
        return this.#availableGenders;
      }

      /**
       * @return {GrammaticalNumber[]} Associated numbers.
       */
      get availableNumbers() {
        return this.#availableNumbers;
      }

      /**
       * Fetches the gender with the given label.
       * @param genderLabel {string} Gender’s label.
       * @return {GrammaticalGender|null} The gender object or null if none were found.
       */
      getGender(genderLabel) {
        for (const gender of this.#availableGenders) {
          if (gender.label === genderLabel) {
            return gender;
          }
        }
        return null;
      }

      /**
       * Fetches the number with the given label.
       * @param numberLabel {string} Number’s label
       * @return {GrammaticalNumber|null} The number object or null if none were found.
       */
      getNumber(numberLabel) {
        for (const number of this.#availableNumbers) {
          if (number.label === numberLabel) {
            return number;
          }
        }
        return null;
      }

      /**
       * Generates the inflections template.
       * @param word {string} The base word.
       * @param genderLabel {string} Gender’s label.
       * @param numberLabel {string} Number’s label.
       * @param pronunciation {string} IPA pronunciation.
       * @return {string} Template’s wikicode.
       */
      getInflectionsTemplate(word, genderLabel, numberLabel, pronunciation) {
        let grammarClass = this.#grammaticalClass.label;
        grammarClass = grammarClass.charAt(0).toUpperCase() + grammarClass.substring(1);
        return this.#generateInflections(word, grammarClass, genderLabel, numberLabel, pronunciation);
      }
    }

    /**
     * This class encapsulates data and behaviors specific to a specific language.
     */
    class Language {
      /** @type {string} */
      #code;
      /** @type {string} */
      #wikimediaCode;
      /** @type {string} */
      #iso6393Code;
      /** @type {string} */
      #name;
      /** @type {string[][]} */
      #ipaSymbols;
      /** @type {Object<string, GrammaticalItem>} */
      #grammarItems = {};
      /** @type {function} */
      #pronGenerator;

      /**
       * @param code {string} Language code defined in [[Module:langues/data]].
       * @param wikimediaCode {string|null} Language code used by WikiMedia projects.
       * @param iso6393Code {string|null} ISO 639-3 language code.
       * @param name {string} Language’s name (in French).
       * @param ipaSymbols {string[][]?} An optional list of common IPA symbols for the language.
       * @param grammarItems {GrammaticalItem[]?} An optional list of grammatical items.
       * @param pronGenerator {function?} An optional function that generates an approximate pronunciation based on the word.
       */
      constructor(code, wikimediaCode, iso6393Code, name, ipaSymbols, grammarItems, pronGenerator) {
        this.#code = code;
        this.#wikimediaCode = wikimediaCode;
        this.#iso6393Code = iso6393Code;
        this.#name = name;
        this.#ipaSymbols = ipaSymbols || [];
        this.#pronGenerator = pronGenerator || (() => "");
        for (const grammarItem of (grammarItems || [])) {
          this.#grammarItems[grammarItem.grammaticalClass.sectionCode] = grammarItem;
        }
      }

      /**
       * @return {string} This language’s code.
       */
      get code() {
        return this.#code;
      }

      /**
       * @return {string} This language’s WikiMedia code.
       */
      get wikimediaCode() {
        return this.#wikimediaCode;
      }

      /**
       * @return {string} This language’s ISO 639-3 code.
       */
      get iso6393Code() {
        return this.#iso6393Code;
      }

      /**
       * @return {string} This language’s name.
       */
      get name() {
        return this.#name;
      }

      /**
       * @return {string[][]} The IPA symbols for this language.
       */
      get ipaSymbols() {
        return this.#ipaSymbols;
      }

      /**
       * @return {Object<string, GrammaticalItem>} The grammatical items for this language.
       */
      get grammarItems() {
        return this.#grammarItems;
      }

      /**
       * Fetches the grammatical item that has the given section title.
       * @param sectionName {string} Section’s title.
       * @return {GrammaticalItem} The grammatical item if found or undefined otherwise.
       */
      getGrammarItem(sectionName) {
        return this.#grammarItems[sectionName];
      }

      /**
       * Generates the pronunciation of the given word for this language.
       * @param word {string} The word.
       * @return {string} The pronunciation or an empty string if no function was defined in the constructor.
       */
      generatePronunciation(word) {
        return this.#pronGenerator(word);
      }
    }

    /**
     * A simple class that defines useful properties of sister wikis.
     */
    class Wiki {
      /** @type {string} */
      name;
      /** @type {string} */
      templateName;
      /** @type {string} */
      urlDomain;
      /** @type {string} */
      urlBase;
      /** @type {string[]} */
      showOnlyForLangs;

      /**
       * Create a new Wiki object.
       * @param label {string} Wiki’s French name.
       * @param templateName {string} Wiki’s link template.
       * @param urlDomain {string} Wiki’s URL pattern.
       * @param urlBase {string|null?} Wiki’s search URL.
       * @param showOnlyForLangs {string[]?} A list of language code for which to enable this wiki.
       */
      constructor(label, templateName, urlDomain, urlBase, showOnlyForLangs) {
        this.name = label;
        this.templateName = templateName;
        this.urlDomain = urlDomain;
        this.urlBase = urlBase || "w/index.php?search=";
        this.showOnlyForLangs = showOnlyForLangs || [];
      }
    }

    /**
     * A simple class that defines properties of an article’s section.
     */
    class ArticleSection {
      /** @type {string} */
      label;
      /** @type {string} */
      code;
      /** @type {string} */
      help;
      /** @type {number} */
      level;
      /** @type {boolean} */
      hidden;

      /**
       * Creates a new article section object.
       * @param label {string} Section’s label.
       * @param code {string} Section’s template code.
       * @param level {number} Section’s level.
       * @param help {string|null?} Section’s help page name.
       * @param hidden {boolean?} Whether this section should be hidden from the form (used for generated sections).
       */
      constructor(label, code, level, help, hidden) {
        this.label = label;
        this.code = code;
        this.help = help;
        this.level = level;
        this.hidden = hidden;
      }
    }

    /**
     * Gadget’s class.
     */
    class GadgetCreerNouveauMot {
      static NAME = "Créer nouveau mot";
      static VERSION = "5.4.4";

      static #COOKIE_NAME = "cnm_last_lang";
      /** Cookie duration in days. */
      static #COOKIE_DURATION = 30;
      /**
       * List of sister projects and associated templates and domain names.
       * @type {Object<string, Wiki>}
       */
      static #OTHER_PROJECTS = {
        "multi-project": new Wiki("QID pour le modèle « liste projets »", "liste projets", ""),
        w: new Wiki("Wikipédia", "WP", "{0}.wikipedia.org"),
        s: new Wiki("Wikisource", "WS", "{0}.wikisource.org"),
        q: new Wiki("Wikiquote", "WQ", "{0}.wikiquote.org"),
        v: new Wiki("Wikiversité", "WV", "{0}.wikiversity.org"),
        l: new Wiki("Wikilivres", "WL", "{0}.wikibooks.org"),
        species: new Wiki("Wikispecies", "WSP", "wikispecies.org"),
        voy: new Wiki("Wikivoyage", "VOY", "{0}.wikivoyage.org"),
        n: new Wiki("Wikinews", "WN", "{0}.wikinews.org"),
        d: new Wiki("Wikidata", "WD", "wikidata.org"),
        c: new Wiki("Wikimedia Commons", "Commons", "commons.wikimedia.org"),
        vikidia: new Wiki("Vikidia", "Vikidia", "{0}.vikidia.org", null,
            ["fr", "ca", "de", "el", "en", "es", "eu", "it", "ru", "scn", "hy"]),
        dicoado: new Wiki("Le Dico des Ados", "Dicoado", "dicoado.org",
            "wiki/index.php?search=", ["fr"]),
      };
      /**
       * List of word type subsections.
       * @type {ArticleSection[]}
       */
      static #SECTIONS = [
        new ArticleSection("Autre alphabet ou système d’écriture", "écriture", 4),
        new ArticleSection("Variantes orthographiques", "variantes orthographiques", 4),
        new ArticleSection("Variantes", "variantes", 4),
        new ArticleSection("Transcriptions", "transcriptions", 4),
        new ArticleSection("Abréviations", "abréviations", 4, "Aide:Abréviations, sigles et acronymes"),
        new ArticleSection("Augmentatifs", "augmentatifs", 4),
        new ArticleSection("Diminutifs", "diminutifs", 4),
        new ArticleSection("Synonymes", "synonymes", 4, "Aide:Synonymes et antonymes"),
        new ArticleSection("Quasi-synonymes", "quasi-synonymes", 4, "Aide:Synonymes et antonymes"),
        new ArticleSection("Antonymes", "antonymes", 4, "Aide:Synonymes et antonymes"),
        new ArticleSection("Gentilés", "gentilés", 4),
        new ArticleSection("Composés", "composés", 4),
        new ArticleSection("Dérivés", "dérivés", 4, "Aide:Mots et locutions dérivés"),
        new ArticleSection("Apparentés étymologiques", "apparentés", 4, "Aide:Mots apparentés"),
        new ArticleSection("Vocabulaire", "vocabulaire", 4, "Aide:Vocabulaire apparenté"),
        new ArticleSection("Phrases et expressions", "phrases", 4, "Aide:Expressions du mot vedette"),
        new ArticleSection("Variantes dialectales", "variantes dialectales", 4),
        new ArticleSection("Hyperonymes", "hyperonymes", 4, "Aide:Hyperonymes et hyponymes"),
        new ArticleSection("Hyponymes", "hyponymes", 4, "Aide:Hyperonymes et hyponymes"),
        new ArticleSection("Holonymes", "holonymes", 4, "Aide:Méronymes et holonymes"),
        new ArticleSection("Méronymes", "méronymes", 4, "Aide:Méronymes et holonymes"),
        new ArticleSection("Hyper-verbes", "hyper-verbes", 4),
        new ArticleSection("Troponymes", "troponymes", 4),
        new ArticleSection("Traductions", "traductions", 4, null, true),
        new ArticleSection("Dérivés dans d’autres langues", "dérivés autres langues", 4),
        new ArticleSection("Faux-amis", "faux-amis", 4),
        new ArticleSection("Anagrammes", "anagrammes", 3, "Aide:Anagrammes"),
      ];
      /**
       * Edit comment.
       */
      static #EDIT_COMMENT =
          `Ajout d’un mot assisté par [[Aide:Gadget-CreerNouveauMot|${GadgetCreerNouveauMot.NAME}]] (v${GadgetCreerNouveauMot.VERSION})`;

      /**
       * Main word.
       * @type {string}
       */
      #word = mw.config.get("wgTitle").replace("_", " ");
      /**
       * Currently selected language.
       * @type {Language}
       */
      #selectedLanguage = null;
      /**
       * List of available languages.
       * @type {Language[]}
       */
      #languages = [];
      /**
       * Object mapping language codes to their respective names.
       * @type {Object<string, string>}
       */
      #languageNames = {};
      /**
       * Start up GUI.
       * @type {StartGUI}
       */
      #startGUI = null;
      /**
       * Main GUI.
       * @type {MainGUI}
       */
      #mainGUI = null;
      /**
       * API hook.
       */
      #api = new mw.Api();

      constructor() {
        // Sorting languages: french first,
        // then all remaining in lexicographical order.
        this.#languages.sort((l1, l2) => {
          if (l1.code === "fr") {
            return -1;
          } else if (l2.code === "fr") {
            return 1;
          } else {
            return l1.name.localeCompare(l2.name);
          }
        });

        this.#api.get({
          action: "query",
          format: "json",
          titles: "MediaWiki:Gadget-translation editor.js/langues.json",
          prop: "revisions",
          rvprop: "content",
          rvslots: "main",
        }).then(data => {
          for (const page of Object.values(data.query.pages)) { // Get first entry
            // noinspection JSUnresolvedVariable
            this.#languageNames = JSON.parse(page.revisions[0].slots.main["*"]);
          }
          if ($(GUI.TARGET_ELEMENT)) {
            this.#generateStartUI();
          }
        });
      }

      /**
       * Adds a language to the list of available languages.
       * @param language {Language} The language to add.
       */
      addLanguage(language) {
        this.#languages.push(language);
      }

      /**
       * Fecthes the language with the given code.
       * @param languageCode {string} Language code.
       * @returns {Language|null} The language object or null if none were found.
       */
      getLanguage(languageCode) {
        for (const language of this.#languages) {
          if (language.code === languageCode) {
            return language;
          }
        }
        return null;
      }

      /**
       * Generates the start up GUI.
       */
      #generateStartUI() {
        this.#startGUI = new StartGUI(GadgetCreerNouveauMot.NAME, () => this.#generateMainUI());
      }

      /**
       * Generates the main GUI.
       */
      #generateMainUI() {
        this.#startGUI.remove();
        this.#startGUI = null;
        this.#mainGUI = new MainGUI(
            this.#word,
            this.#languages,
            GadgetCreerNouveauMot.#SECTIONS,
            lc => this.#onLanguageSelect(lc),
            lc => this.#onClassSelect(lc),
            () => this.#insertWikicode(),
            GadgetCreerNouveauMot.#OTHER_PROJECTS
        );

        const previousLang = wikt.cookie.read(GadgetCreerNouveauMot.#COOKIE_NAME);
        this.#onLanguageSelect(previousLang || this.#languages[0].code);
        this.#mainGUI.sortingKey = wikt.page.getSortingKey(this.#word);
        this.#mainGUI.isDraft = false;
        // Display alert if the page does not exist yet and its title starts with an upper case letter
        if (this.#word && this.#word[0].toUpperCase() === this.#word[0] && $(".mw-newarticletext").length) {
          alert("Êtes-vous certain·e que la majuscule fait partie du mot\u00a0?\n" +
              "Si tel n’est pas le cas, merci de corriger cela.");
        }
      }

      /**
       * Function called whenever the user selects a language.
       * @param languageCode {string} Code of the selected language.
       */
      #onLanguageSelect(languageCode) {
        languageCode = languageCode.trim();

        if (languageCode) {
          let language = this.getLanguage(languageCode);

          if (!language) {
            if (!this.#languageNames[languageCode]) {
              alert("Code de langue invalide\u00a0!");
              return;
            }
            // Add most common classes on top
            const items = [
              new GrammaticalItem(GRAMMATICAL_CLASSES.ADJECTIVE),
              new GrammaticalItem(GRAMMATICAL_CLASSES.ADVERB),
              new GrammaticalItem(GRAMMATICAL_CLASSES.NOUN),
              new GrammaticalItem(GRAMMATICAL_CLASSES.VERB),
              new GrammaticalItem(GRAMMATICAL_CLASSES.PRONOUN),
              new GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN),
              new GrammaticalItem(GRAMMATICAL_CLASSES.INTERJECTION),
            ];
            const treated = ["ADJECTIVE", "ADVERB", "NOUN", "VERB", "PRONOUN", "PROPER_NOUN", "INTERJECTION"];
            // Add all remaining classes
            for (const [k, v] of Object.entries(GRAMMATICAL_CLASSES)) {
              if (!treated.includes(k)) {
                items.push(new GrammaticalItem(v));
                treated.push(k);
              }
            }
            language = new Language(languageCode, null, null, this.#languageNames[languageCode], [], items);
          }
          this.#selectedLanguage = language;
          wikt.cookie.create(GadgetCreerNouveauMot.#COOKIE_NAME, language.code, GadgetCreerNouveauMot.#COOKIE_DURATION);
          this.#mainGUI.selectLanguage(this.#selectedLanguage);

          this.#mainGUI.pronunciation = language.generatePronunciation(this.#word);
        }
      }

      /**
       * Function called whenever the user selects a grammatical class.
       * @param className {string} Code of the selected grammatical class.
       */
      #onClassSelect(className) {
        if (className) {
          const grammarItem = this.#selectedLanguage.getGrammarItem(className);
          this.#mainGUI.setAvailableGenders(grammarItem.availableGenders);
          this.#mainGUI.setAvailableNumbers(grammarItem.availableNumbers);
        } else {
          this.#mainGUI.setAvailableGenders([]);
          this.#mainGUI.setAvailableNumbers([]);
        }
      }

      /**
       * Generates the wikicode then inserts it into the edit box.
       */
      #insertWikicode() {
        const word = this.#word;
        const langCode = this.#selectedLanguage.code;
        const isDraft = this.#mainGUI.isDraft;
        const pron = this.#mainGUI.pronunciation;
        const isConv = langCode === "conv";
        let etymology = this.#mainGUI.etymology || `: {{date|lang=${langCode}}} {{ébauche-étym|${langCode}}}`;

        if (!this.#mainGUI.grammarClass) {
          alert("Veuillez sélectionner une classe grammaticale (adjectif, nom, etc.).");
          return;
        }
        if (!this.#mainGUI.gender) {
          alert("Veuillez sélectionner un genre grammatical (masculin, féminin, etc.).");
          return;
        }
        if (!this.#mainGUI.number) {
          alert("Veuillez sélectionner un nombre grammatical (singulier, pluriel, etc.).");
          return;
        }
        const grammarItem = this.#selectedLanguage.getGrammarItem(this.#mainGUI.grammarClass);
        const gender = grammarItem.getGender(this.#mainGUI.gender) || new GrammaticalGender("");
        const number = grammarItem.getNumber(this.#mainGUI.number) || new GrammaticalNumber("");
        const grammarClass = grammarItem.grammaticalClass;
        const inflectionsTemplate = grammarItem.getInflectionsTemplate(word, gender.label, number.label, pron);
        const imageName = this.#mainGUI.imageName;
        const imageDescription = this.#mainGUI.imageDescription;

        if (!this.#mainGUI.definitions_number) {
          alert("Définition manquante\u00a0! Veuillez en renseigner au moins une avant de charger le wikicode.");
          return;
        }

        let definitions = [];
        for (let i = 0; i < this.#mainGUI.definitions_number; i++) {
          definitions.push(this.#mainGUI.getDefinition(i))
        }

        const references = this.#mainGUI.references;
        const bibliography = this.#mainGUI.bibliography;
        const sortingKey = this.#mainGUI.sortingKey;

        // Add : at the beginning of each line
        etymology = etymology.replace(/(^|\n)(?!:)/g, "$1: ");

        let wikicode = `== {{langue|${langCode}}} ==\n`
            + (isDraft ? `{{ébauche|${langCode}}}\n` : "")
            + "=== {{S|étymologie}} ===\n"
            + etymology + "\n\n"
            + `=== {{S|${grammarClass.sectionCode}|${langCode}}} ===\n`
            + (inflectionsTemplate ? inflectionsTemplate + "\n" : "");
        if (imageName) {
          wikicode += `[[Image:${imageName}|vignette|${imageDescription}]]\n`;
        }
        wikicode += `'''${word}'''`;
        if (isConv) {
          wikicode += "\n";
        } else {
          // trim() to remove trailing space(s) if no gender or number template.
          wikicode += " " + `{{pron|${pron}|${langCode}}} ${gender.template.format(langCode)} ${number.template.format(langCode)}`
              .replace(/\s+/g, " ").trim() + "\n";
        }

        /**
         * @param example {Example}
         * @return {string}
         */
        function formatExample(example) {
          if (!example.text)
            return `#* {{exemple|lang=${langCode}}}`;
          let template = `#* {{exemple|lang=${langCode}\n | ${example.text}`;
          if (example.translation) template += "\n | " + example.translation;
          if (example.transcription) template += "\n | tr=" + example.transcription;
          if (example.source) template += "\n | source=" + example.source;
          if (example.link) template += "\n | lien=" + example.link;
          if (example.disableTranslation) template += "\n | pas-trad=1";
          return template + "\n}}";
        }

        for (const [i, definition] of definitions.entries()) {
          if (!definition.text) {
            let message = `Définition n°${i + 1} vide\u00a0! Veuillez la renseigner `;
            if (i > 0) {
              message += "ou la supprimer ";
            }
            message += "avant de charger le wikicode.";
            alert(message);
            return;
          }
          wikicode += `# ${definition.text}\n`;
          for (const [j, example] of definition.examples.entries()) {
            if (!example.text) {
              alert(`Exemple n°${j + 1} vide pour la définition ${i + 1}\u00a0!`
                  + " Veuillez le renseigner ou supprimer l’exemple avant d’insérer le wikicode.");
              return;
            }
            wikicode += formatExample(example) + "\n";
          }
          if (!definition.examples.length) {
            wikicode += formatExample(new Example("")) + "\n";
          }
        }
        wikicode += "\n"

        function linkify(content) {
          const lines = content.split("\n");

          for (const [i, line] of lines.entries()) {
            if (/^[^=#:;\[{\s]\S*/.test(line)) {
              lines[i] = `* {{lien|${line.trim()}|${langCode}}}`;
            } else if (/^\*\s*\S+/.test(line)) {
              lines[i] = `* {{lien|${line.substring(1).trim()}|${langCode}}}`;
            }
          }

          return lines.join("\n").trim();
        }

        let anagramsSection = "";

        for (const section of GadgetCreerNouveauMot.#SECTIONS) {
          const sectionCode = section.code;
          const sectionLevel = section.level;

          if (sectionCode !== "traductions" || langCode === "fr") {
            const content = sectionCode !== "traductions"
                ? this.#mainGUI.getSectionContent(sectionCode)
                : "{{trad-début}}\n{{trad-fin}}\n\n";
            if (content) {
              const titleLevel = Array(sectionLevel + 1).join("=");
              const section = `${titleLevel} {{S|${sectionCode}}} ${titleLevel}\n${linkify(content)}\n\n`;
              if (sectionCode === "anagrammes") {
                anagramsSection = section;
              } else {
                wikicode += section;
              }
            }
          }
        }

        let pronSection = "";
        const pronunciationContent = this.#mainGUI.pronunciationSection || `{{ébauche-pron-audio|${langCode}}}`;
        const homophones = this.#mainGUI.homophones;
        const paronyms = this.#mainGUI.paronyms;

        if (pronunciationContent || homophones || paronyms) {
          pronSection = "=== {{S|prononciation}} ===\n";
          if (pronunciationContent) {
            pronSection += pronunciationContent + "\n\n";
          }
          if (homophones) {
            pronSection += `==== {{S|homophones|${langCode}}} ====\n${linkify(homophones)}\n\n`;
          }
          if (paronyms) {
            pronSection += `==== {{S|paronymes}} ====\n${linkify(paronyms)}\n\n`;
          }
        }
        wikicode += pronSection;

        wikicode += anagramsSection;

        let seeAlsoSection = "";
        for (const [projectCode, projectData] of Object.entries(GadgetCreerNouveauMot.#OTHER_PROJECTS)) {
          if (this.#mainGUI.hasAddLinkToProject(projectCode)) {
            let projectModelParams = this.#mainGUI.getProjectLinkParams(projectCode);
            projectModelParams = projectModelParams ? "|" + projectModelParams : "";
            const templateName = projectData.templateName;
            if (seeAlsoSection === "") {
              seeAlsoSection = "=== {{S|voir aussi}} ===\n";
            }
            if (projectCode === "multi-project") {
              seeAlsoSection += `{{${templateName}|${langCode}${projectModelParams}}}\n`;
            } else {
              const langParam = projectData.urlDomain.includes("{0}") ? "|lang=" + langCode : "";
              seeAlsoSection += `* {{${templateName}${projectModelParams}${langParam}}}\n`;
            }
          }
        }
        if (seeAlsoSection) {
          seeAlsoSection += "\n";
        }
        wikicode += seeAlsoSection;

        const containsRefTemplates = /{{(R|RÉF|réf)\||<ref>.+<\/ref>/gm.test(wikicode);

        if (containsRefTemplates || references || bibliography) {
          const insertSourcesSection = containsRefTemplates;

          if (references || insertSourcesSection || bibliography) {
            wikicode += "=== {{S|références}} ===\n";
            if (references) {
              wikicode += references + "\n\n";
            }
          }
          if (insertSourcesSection) {
            wikicode += "==== {{S|sources}} ====\n{{Références}}\n\n";
          }
          if (bibliography) {
            wikicode += `==== {{S|bibliographie}} ====\n${bibliography}\n\n`;
          }
        }

        wikicode += sortingKey !== word ? `{{clé de tri|${sortingKey}}}\n` : "";

        this.#mainGUI.categories.forEach(category => wikicode += `[[Catégorie:${category}]]\n`);

        wikt.edit.insertText(wikt.edit.getCursorLocation(), wikicode);

        const $summaryFld = wikt.edit.getEditSummaryField();
        const summary = $summaryFld.val();
        const comment = GadgetCreerNouveauMot.#EDIT_COMMENT;
        if (!summary.includes(comment)) {
          $summaryFld.val(comment + " " + summary);
        }

        // Collapse gadget after inserting wikicode.
        // $(".oo-ui-tool-name-hide > a")[0].click(); // FIXME not triggered
      }
    }

    /**
     * Returns the link for the given page name.
     * @param pageName {string} Page’s name.
     * @return {OO.ui.HtmlSnippet|string} The HtmlSnippet object
     * for the link or an empty string if the argument evaluates to false.
     */
    function getPageLink(pageName) {
      if (pageName) {
        const title = pageName.includes("#") ? pageName.substring(0, pageName.indexOf("#")) : pageName;
        // noinspection HtmlUnknownTarget
        return new OO.ui.HtmlSnippet(
            `<a href="/wiki/${encodeURIComponent(pageName)}" target="_blank" title="${title} (s’ouvre dans un nouvel onglet)">Page d’aide</a>`
        );
      }
      return "";
    }

    /**
     * Format the selected text using the given effect.
     * @param effect {string} The effect to apply (either "bold" or "italic").
     * @param $textInput {jQuery} The text input to format the text of.
     */
    function formatText(effect, $textInput) {
      const selectedText = wikt.edit.getSelectedText($textInput);
      let replText;
      switch (effect) {
        case "bold":
          replText = "'''" + selectedText + "'''";
          break;
        case "italic":
          replText = "''" + selectedText + "''";
          break;
        default:
          throw new Error("Invalid effect: " + effect);
      }
      wikt.edit.replaceSelectedText(replText, $textInput);
    }

    /**
     * Creates an HTML links sequence that will insert text into a text field when clicked.
     * @param list {string[]} The list of strings to convert into links.
     * @param textField {Object} The text field to insert the text into.
     * @param cssClass {string|null?} Optional additonnal CSS classes.
     * @param text {(string|null)?} Some text that will be appended before the links.
     * @param insertFormatButtons {boolean?} Whether to insert formatting buttons before the list. Defaults to false.
     * @return {jQuery|HTMLElement} A jQuery object.
     */
    function createLinks(
        list,
        textField,
        cssClass = null,
        text = null,
        insertFormatButtons = false
    ) {
      const $links = $("<span>");

      if (text) {
        $links.append(text + " &mdash; ");
      }

      if (insertFormatButtons) {
        const $element = textField.$element;
        let $textInput = $element.find("textarea");
        if (!$textInput.length) {
          $textInput = $element.find('input[type="text"]');
        }
        const $bold = $('<a href="#" style="font-weight: bold">Gras</a>');
        $bold.on("click", () => {
          formatText("bold", $textInput);
          textField.focus();
          // Return false to disable default event from triggering.
          return false;
        });
        const $italic = $('<a href="#" style="font-style: italic">Italique</a>');
        $italic.on("click", () => {
          formatText("italic", $textInput);
          textField.focus();
          // Return false to disable default event from triggering.
          return false;
        });
        $links.append($bold, " ", $italic, " &mdash; ");
      }

      for (const [i, item] of list.entries()) {
        const dataValue = item.replace("&", "&amp;");
        const $link = $(`<a href="#" class="${cssClass || ''}" data-value="${dataValue}">${item.trim()}</a>`);
        $link.on("click", e => {
          textField.insertContent($(e.target).data("value"));
          textField.focus();
          // Return false to disable default event from triggering.
          return false;
        });
        $links.append($link);
        if (i < list.length - 1) {
          $links.append("\u00a0");
        }
      }

      return $links;
    }

    const SPECIAL_CHARS = [
      "’", "à", "À", "â", "Â", "æ", "Æ", "ç", "Ç", "é", "É", "è", "È", "ê", "Ê", "ë", "Ë", "î", "Î", "ï", "Ï",
      "ô", "Ô", "œ", "Œ", "ù", "Ù", "û", "Û", "ü", "Ü", "ÿ", "Ÿ", "«\u00a0", "\u00a0»",
    ];

    /**
     * Wrapper class for OO.ui.TabPanelLayout.
     * @param name {string} Tab’s name.
     * @param options {Object} OOUI tab’s options.
     * @constructor
     */
    function Tab(name, options) {
      OO.ui.TabPanelLayout.call(this, name, options);
    }

    // Inherit from OOUI TabPanelLayout’s prototype.
    Tab.prototype = Object.create(OO.ui.TabPanelLayout.prototype);

    /**
     * Sets this tab as active.
     */
    Tab.prototype.select = function () {
      // noinspection JSUnresolvedFunction
      this.setActive(true);
    };

    /**
     * Create a definition form.
     * @param definitionID ID of the definition.
     * @param langCode {string} Language code.
     * @constructor
     */
    function DefinitionForm(definitionID, langCode) {
      this._langCode = langCode;
      this._definitionFld = new OO.ui.MultilineTextInputWidget({
        rows: 1,
      });
      this._examplesFlds = [];
      this._addExampleBtn = new OO.ui.ButtonWidget({
        label: "Ajouter un exemple",
      });
      this._addExampleBtn.on("click", () => this.addExample());
      this._removeExampleBtn = new OO.ui.ButtonWidget({
        label: "Retirer le dernier exemple",
      });
      this._removeExampleBtn.on("click", () => this.removeExample(this.examples_number - 1));
      this._removeExampleBtn.toggle(false); // Hide by default

      OO.ui.FieldsetLayout.call(this, {
        label: "Définition n°" + definitionID,
        items: [
          new OO.ui.FieldLayout(this._definitionFld, {
            label: createLinks(SPECIAL_CHARS, this._definitionFld, null, null, true),
            align: "inline",
            help: getPageLink("Aide:Définitions"),
          }),
          new OO.ui.HorizontalLayout({
            items: [
              this._addExampleBtn,
              this._removeExampleBtn,
            ],
          }),
        ],
      })
    }

    DefinitionForm.prototype = Object.create(OO.ui.FieldsetLayout.prototype);

    /**
     * Called when the user selects a language.
     * @param langCode The new language code.
     */
    DefinitionForm.prototype.onLanguageUpdate = function (langCode) {
      this._langCode = langCode;
      this._examplesFlds.forEach(f => f.onLanguageUpdate(langCode))
    };

    /**
     * Adds an example form.
     */
    DefinitionForm.prototype.addExample = function () {
      const exampleForm = new ExampleForm(this.examples_number + 1, this._langCode);
      this._examplesFlds.push(exampleForm);
      // noinspection JSUnresolvedFunction,JSUnresolvedVariable
      this.addItems([exampleForm], this.items.length - 1);
      this._removeExampleBtn.toggle(this.examples_number !== 0);
    };

    /**
     * Removes an example form.
     * @param index {number} Example form’s index.
     */
    DefinitionForm.prototype.removeExample = function (index) {
      const exampleForm = this._examplesFlds[index];
      this._examplesFlds.splice(index, 1);
      // noinspection JSUnresolvedFunction
      this.removeItems([exampleForm]);
      this._removeExampleBtn.toggle(this.examples_number !== 0);
    };

    /**
     * @return {string} Definition’s text.
     */
    DefinitionForm.prototype.getText = function () {
      return this._definitionFld.getValue().trim().replace(/^#\s*/, "");
    };

    Object.defineProperty(DefinitionForm.prototype, "examples_number", {
      /**
       * @return {number} The number of examples.
       */
      get: function () {
        return this._examplesFlds.length;
      },
    });

    /**
     * @param index {number} Example’s index.
     * @return {Example}
     */
    DefinitionForm.prototype.getExample = function (index) {
      const exampleForm = this._examplesFlds[index];
      return new Example(
          exampleForm.getText(),
          exampleForm.getTranslation(),
          exampleForm.getTranscription(),
          exampleForm.getSource(),
          exampleForm.getLink(),
          exampleForm.isTranslationDisabled()
      );
    };

    /**
     * Creates a definition example form.
     * @param exampleID {number} ID of the example.
     * @param langCode {string} Language code.
     * @constructor
     */
    function ExampleForm(exampleID, langCode) {
      this._textFld = new OO.ui.MultilineTextInputWidget({
        rows: 1,
      });
      this._translationFld = new OO.ui.MultilineTextInputWidget({
        rows: 1,
      });
      this._transcriptionFld = new OO.ui.MultilineTextInputWidget({
        rows: 1,
      });
      this._sourceFld = new OO.ui.MultilineTextInputWidget({
        rows: 1,
      });
      this._linkFld = new OO.ui.TextInputWidget();
      this._disableTranslationChk = new OO.ui.CheckboxInputWidget();

      this._translationFieldLayout = new OO.ui.FieldLayout(this._translationFld, {
        label: createLinks(SPECIAL_CHARS, this._translationFld, null, "Traduction en français", true),
        align: "inline",
      });
      this._transcriptionFieldLayout = new OO.ui.FieldLayout(this._transcriptionFld, {
        label: createLinks(SPECIAL_CHARS, this._transcriptionFld, null, "Transcription latine", true),
        align: "inline",
      });

      OO.ui.FieldsetLayout.call(this, {
        label: "Exemple n°" + exampleID,
        items: [
          new OO.ui.FieldLayout(this._textFld, {
            label: createLinks(SPECIAL_CHARS, this._textFld, null, null, true),
            align: "inline",
            help: getPageLink("Aide:Exemples"),
          }),
          this._translationFieldLayout,
          this._transcriptionFieldLayout,
          new OO.ui.FieldLayout(this._sourceFld, {
            label: createLinks(SPECIAL_CHARS, this._sourceFld, null, "Source", true),
            align: "inline",
          }),
          new OO.ui.FieldLayout(this._linkFld, {
            label: createLinks(SPECIAL_CHARS, this._linkFld, null, "Lien"),
            align: "inline",
          }),
          new OO.ui.FieldLayout(this._disableTranslationChk, {
            label: "Désactiver la traduction",
            align: "inline",
            help: "Permet d’indiquer que la traduction n’est pas nécessaire, pour une langue autre que le français (ex\u00a0: moyen français).",
            helpInline: true,
          }),
        ],
      });

      this.onLanguageUpdate(langCode);
    }

    ExampleForm.prototype = Object.create(OO.ui.FieldsetLayout.prototype);

    /**
     * Called when the user selects a language.
     * @param langCode The new language code.
     */
    ExampleForm.prototype.onLanguageUpdate = function (langCode) {
      var isFrench = langCode === "fr";
      this._translationFieldLayout.toggle(!isFrench);
      this._transcriptionFieldLayout.toggle(!isFrench);
      this._disableTranslationChk.setDisabled(isFrench);
    };

    /**
     * @return {string} Example’s text.
     */
    ExampleForm.prototype.getText = function () {
      return this._textFld.getValue().trim();
    };

    /**
     * @return {string|null} Example’s French translation.
     */
    ExampleForm.prototype.getTranslation = function () {
      return !this.isTranslationDisabled() && this._translationFld.getValue().trim() || null;
    };

    /**
     * @return {string|null} Example’s latin transcription.
     */
    ExampleForm.prototype.getTranscription = function () {
      return this._transcriptionFld.getValue().trim() || null;
    };

    /**
     * @return {string|null} Example’s source.
     */
    ExampleForm.prototype.getSource = function () {
      return this._sourceFld.getValue().trim() || null;
    };

    /**
     * @return {string|null} Example’s link.
     */
    ExampleForm.prototype.getLink = function () {
      return this._linkFld.getValue().trim() || null;
    };

    /**
     * @return {boolean} Whether the translation should be disabled.
     */
    ExampleForm.prototype.isTranslationDisabled = function () {
      return this._disableTranslationChk.isSelected() && !this._disableTranslationChk.isDisabled();
    };

    /**
     * Base class for the gadget’s GUIs.
     */
    class GUI {
      /** jQuery selector of the HTML element GUIs will be inserted into. */
      static TARGET_ELEMENT = "#Editnotice-0";
    }

    /**
     * Gadget’s start GUI consists of a simple button that will open the actual GUI upon being clicked.
     */
    class StartGUI extends GUI {
      static #ELEMENT_ID = "cnm-open-ui";

      /**
       * @param gadgetName {string}
       * @param onActivateGadget {function}
       */
      constructor(gadgetName, onActivateGadget) {
        super();
        const $target = $(GUI.TARGET_ELEMENT);
        const headerText = `
<div class="center" style="margin-bottom: 5px">
  <span id="${StartGUI.#ELEMENT_ID}" class="mw-ui-button mw-ui-progressive">Ouvrir le gadget ${gadgetName}</span>
</div>`.trim();
        $target.append(headerText);
        $target.find("#" + StartGUI.#ELEMENT_ID).on("click", onActivateGadget);
      }

      /**
       * Removes this GUI from the DOM.
       */
      remove() {
        $("#" + StartGUI.#ELEMENT_ID).remove();
      }
    }

    /**
     * Gadget’s main GUI.
     */
    class MainGUI extends GUI {
      /** @type {string} */
      #word;
      /** @type {Tab[]} */
      #tabs = [];

      #languageSelectFld = null;
      #grammarClassSelectFld = null;
      #gendersFld = null;
      #numbersFld = null;
      #imageFld = null;
      #imageDescriptionFld = null;
      #pronunciationFld = null;
      #pronunciationPnl = null;
      #addDefinitionBtn = null;
      #removeDefinitionBtn = null;
      #definitionsLayout = null;
      #definitionFlds = [];
      #categoriesWidget = null;
      #etymologyFld = null;
      #pronunciationSectionFld = null;
      #homophonesFld = null;
      #paronymsFld = null;
      #referencesFld = null;
      #bibliographyFld = null;
      /** @type {Object<string, Object>} */
      #otherSectionFields = {};
      #seeOtherProjectsChk = {};
      #draftChk = null;
      #sortKeyFld = null;
      /** @type {Object<string, Wiki>} */
      #otherProjects = {};
      /**
       * Language span tag in gadget’s title.
       * @type {jQuery|HTMLElement}
       */
      #$titleLangSpan = null;

      /**
       * @param word {string} The word.
       * @param languages {Language[]} The language.
       * @param sections {ArticleSection[]} The list of word type sub-sections.
       * @param onLanguageSelect {Function} Callback function for when a language is selected.
       * @param onClassSelect {Function} Callback function for when a grammatical class is selected.
       * @param onInsertWikicode {Function} Callback function for when “insert wikicode” button is clicked.
       * @param otherProjects {Object<string, Wiki>} Object containing data for sister projects.
       */
      constructor(word, languages, sections, onLanguageSelect, onClassSelect, onInsertWikicode, otherProjects) {
        super();
        this.#word = word;
        this.#otherProjects = otherProjects;

        // Tabs declaration
        const tabs = [
          {
            title: "Langue, type, définitions",
            content: () => {
              const languageFld = new OO.ui.TextInputWidget({
                placeholder: "Code de langue",
              });
              const languageBnt = new OO.ui.ButtonWidget({
                label: "Passer à cette langue",
              });
              // noinspection JSValidateTypes
              languageBnt.on("click", () => onLanguageSelect(languageFld.getValue()));

              const languageOptions = [];
              for (const lang of languages) {
                languageOptions.push(new OO.ui.MenuOptionWidget({
                  data: lang.code,
                  label: lang.name,
                }));
              }
              this.#languageSelectFld = new OO.ui.DropdownWidget({
                label: "— Veuillez choisir —",
                menu: {
                  items: languageOptions,
                },
              });
              // noinspection JSCheckFunctionSignatures,JSValidateTypes
              this.#languageSelectFld.getMenu().on("select", e => onLanguageSelect(e.getData()));

              this.#grammarClassSelectFld = new OO.ui.DropdownWidget({
                label: "— Veuillez choisir —",
              });
              // noinspection JSCheckFunctionSignatures
              this.#grammarClassSelectFld.getMenu().on("select", e => onClassSelect(e.getData()));
              this.#gendersFld = new OO.ui.DropdownWidget({
                label: "— Veuillez choisir —",
              });
              this.#numbersFld = new OO.ui.DropdownWidget({
                label: "— Veuillez choisir —",
              });

              const imageSectionLabel = new OO.ui.HtmlSnippet(
                  `Image &mdash; <a href="https://commons.wikimedia.org/w/index.php?search=${word}" ` +
                  'target="_blank" title="S’ouvre dans un nouvel onglet">Rechercher sur Commons</a>'
              );
              this.#imageFld = new OO.ui.TextInputWidget({
                id: "cnm-image-field",
                placeholder: "Nom du fichier",
              });
              this.#imageDescriptionFld = new OO.ui.TextInputWidget({
                id: "cnm-image-description-field",
                placeholder: "Légende",
              });

              this.#pronunciationFld = new OO.ui.TextInputWidget({
                id: "cnm-pronunciation-field",
              });
              this.#pronunciationPnl = new OO.ui.FieldLayout(this.#pronunciationFld, {
                align: "inline",
                help: getPageLink("Aide:Prononciation"),
              });

              this.#addDefinitionBtn = new OO.ui.ButtonWidget({
                label: "Ajouter une définition",
              });
              this.#addDefinitionBtn.on("click", () => this.addDefinition());
              this.#removeDefinitionBtn = new OO.ui.ButtonWidget({
                label: "Retirer la dernière définition",
              });
              this.#removeDefinitionBtn.on("click", () => this.removeDefinition(this.definitions_number - 1));
              this.#removeDefinitionBtn.toggle(false); // Hide by default

              this.#definitionsLayout = new OO.ui.FieldsetLayout({
                label: "Définition(s)",
                items: [
                  new OO.ui.HorizontalLayout({
                    items: [
                      this.#addDefinitionBtn,
                      this.#removeDefinitionBtn,
                    ],
                  }),
                ],
              });

              this.#categoriesWidget = new OO.ui.TagMultiselectWidget({
                inputPosition: "inline",
                allowArbitrary: true,
              });

              return new OO.ui.FieldsetLayout({
                items: [
                  new OO.ui.FieldsetLayout({
                    label: "Langue",
                    items: [
                      new OO.ui.HorizontalLayout({
                        items: [
                          new OO.ui.FieldLayout(this.#languageSelectFld, {
                            align: "inline",
                          }),
                          new OO.ui.ActionFieldLayout(languageFld, languageBnt, {
                            align: "inline",
                          }),
                        ],
                      }),
                    ],
                    help: "Pour passer à une langue indisponible dans le menu déroulant, "
                        + "entrez son code dans le champ ci-dessous puis appuyez sur le bouton «\u00a0Passer à cette langue\u00a0».",
                    helpInline: true,
                  }),
                  new OO.ui.FieldsetLayout({
                    label: "Informations grammaticales",
                    items: [
                      new OO.ui.HorizontalLayout({
                        items: [
                          new OO.ui.FieldLayout(this.#grammarClassSelectFld, {
                            align: "inline",
                          }),
                          new OO.ui.FieldLayout(this.#gendersFld, {
                            align: "inline",
                          }),
                          new OO.ui.FieldLayout(this.#numbersFld, {
                            align: "inline",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new OO.ui.FieldsetLayout({
                    label: imageSectionLabel,
                    items: [
                      this.#imageFld,
                      this.#imageDescriptionFld,
                    ],
                    help: "Indiquer seulement le nom de l’image, " +
                        "sans «\u00a0File:\u00a0», «\u00a0Fichier:\u00a0» ni «\u00a0Image:\u00a0».",
                    helpInline: true,
                  }),
                  new OO.ui.FieldsetLayout({
                    label: "Prononciation",
                    items: [
                      this.#pronunciationPnl,
                    ],
                  }),
                  this.#definitionsLayout,
                  new OO.ui.FieldsetLayout({
                    label: "Catégories",
                    items: [
                      this.#categoriesWidget,
                    ],
                    help: "Indiquer seulement les noms des catégories (sans «\u00a0Catégorie:\u00a0»), " +
                        "en respectant la casse (majuscules/minuscules).",
                    helpInline: true,
                  }),
                ],
              });
            },
          },
          {
            title: "Sections supplémentaires",
            content: () => {
              this.#etymologyFld = new OO.ui.MultilineTextInputWidget({
                rows: 4,
                autofocus: true,
              });
              const pronSectionLabel = new OO.ui.HtmlSnippet(
                  'Prononciation (section)<span> &mdash; <a id="cnm-commons-audio-link" href="#" ' +
                  'target="_blank" title="S’ouvre dans un nouvel onglet">Rechercher des fichiers audio sur Commons</a></span>'
              );
              this.#pronunciationSectionFld = new OO.ui.MultilineTextInputWidget({
                rows: 4,
              });
              this.#homophonesFld = new OO.ui.MultilineTextInputWidget({
                rows: 4,
              });
              this.#paronymsFld = new OO.ui.MultilineTextInputWidget({
                rows: 4,
              });
              this.#referencesFld = new OO.ui.MultilineTextInputWidget({
                rows: 4,
              });
              this.#bibliographyFld = new OO.ui.MultilineTextInputWidget({
                rows: 4,
              });

              // noinspection JSUnresolvedReference
              /**
               * `cnmFilter` may be defined in a user’s [[Special:MyPage/common.js]] page
               * and should contain the IDs of the sections they wish to keep.
               * @type {string[]}
               */
              const filter = typeof cnmFilter !== "undefined" && cnmFilter instanceof Array ? cnmFilter : [];
              const fields = [];
              for (const section of sections) {
                if (!section.hidden && (filter.length === 0 || filter.includes(section.code))) {
                  const field = new OO.ui.MultilineTextInputWidget({
                    rows: 4,
                    columns: 20,
                  });
                  this.#otherSectionFields[section.code] = field;
                  fields.push(new OO.ui.FieldLayout(field, {
                    label: section.label,
                    align: "inline",
                    help: getPageLink(section.help),
                  }));
                }
              }

              return new OO.ui.FieldsetLayout({
                items: [
                  new OO.ui.FieldsetLayout({
                    label: "Étymologie",
                    items: [
                      new OO.ui.FieldLayout(this.#etymologyFld, {
                        label: createLinks(SPECIAL_CHARS, this.#etymologyFld, null, null, true),
                        align: "inline",
                        help: getPageLink("Aide:Étymologies"),
                      }),
                    ],
                    help: new OO.ui.HtmlSnippet(wikt.page.renderWikicode(
                        "Laisser le champ de texte vide ajoutera le modèle {{M|ébauche-étym}}.",
                        true
                    )),
                    helpInline: true,
                  }),
                  new OO.ui.FieldsetLayout({
                    label: pronSectionLabel,
                    items: [
                      new OO.ui.FieldLayout(this.#pronunciationSectionFld, {
                        label: createLinks(SPECIAL_CHARS, this.#pronunciationSectionFld, null, null, true),
                        align: "inline",
                        help: getPageLink("Aide:Prononciation"),
                      }),
                      new OO.ui.FieldLayout(this.#homophonesFld, {
                        label: createLinks(SPECIAL_CHARS, this.#homophonesFld, null, "Homophones", true),
                        align: "inline",
                        help: getPageLink("Aide:Homophones et paronymes"),
                      }),
                      new OO.ui.FieldLayout(this.#paronymsFld, {
                        label: createLinks(SPECIAL_CHARS, this.#paronymsFld, null, "Paronymes", true),
                        align: "inline",
                        help: getPageLink("Aide:Homophones et paronymes"),
                      }),
                    ],
                  }),
                  new OO.ui.FieldsetLayout({
                    label: "Références",
                    items: [
                      new OO.ui.FieldLayout(this.#referencesFld, {
                        label: createLinks(SPECIAL_CHARS, this.#referencesFld, null, null, true),
                        align: "inline",
                        help: getPageLink("Aide:Références#Le_format_développé"),
                      }),
                      new OO.ui.FieldLayout(this.#bibliographyFld, {
                        label: createLinks(SPECIAL_CHARS, this.#bibliographyFld, null, "Bibliographie", true),
                        align: "inline",
                        help: getPageLink("Aide:Références#Le_format_développé"),
                      }),
                    ],
                    help: new OO.ui.HtmlSnippet(wikt.page.renderWikicode(
                        "La section «&nbsp;Sources&nbsp;» contenant le modèle {{M|Références}} " +
                        "est insérée automatiquement si le modèle {{M|R}}, {{M|RÉF}} ou {{M|réf}} ou la balise <code>&lt;ref></code> " +
                        "sont présentes dans les autres champs.",
                        true
                    )),
                    helpInline: true,
                  }),
                  new OO.ui.FieldsetLayout({
                    label: "Autres sections",
                    items: [
                      new OO.ui.HorizontalLayout({
                        items: fields,
                      }),
                    ],
                  }),
                ],
              });
            },
          },
          {
            title: "Options avancées",
            content: () => {
              const otherProjectsFields = [];

              for (const [projectCode, projectData] of Object.entries(this.#otherProjects)) {
                const projectName = projectData.name;
                const checkbox = new OO.ui.CheckboxInputWidget({
                  value: projectCode,
                  selected: false,
                });
                const textFld = new OO.ui.TextInputWidget({
                  label: projectName,
                  disabled: true,
                });

                checkbox.on("change", selected => textFld.setDisabled(!selected));

                this.#seeOtherProjectsChk[projectCode] = {
                  checkbox: checkbox,
                  textfield: textFld,
                };

                otherProjectsFields.push(new OO.ui.ActionFieldLayout(
                    checkbox,
                    textFld,
                    {
                      align: "inline",
                      id: `cnm-sister-project-${projectCode}`,
                      label: projectCode === "multi-project" ? "" : new OO.ui.HtmlSnippet('<a href="#" target="_blank">Rechercher</a>'),
                    }
                ));
              }

              this.#draftChk = new OO.ui.CheckboxInputWidget();
              this.#sortKeyFld = new OO.ui.TextInputWidget();

              return new OO.ui.FieldsetLayout({
                items: [
                  new OO.ui.FieldsetLayout({
                    label: "Liens vers les autres projets",
                    items: otherProjectsFields,
                    help: "Les champs de texte permettent de renseigner des paramètres" +
                        " supplémentaire aux modèles de liens interwiki.",
                    helpInline: true,
                  }),
                  new OO.ui.FieldsetLayout({
                    label: "Autres options",
                    items: [
                      new OO.ui.FieldLayout(this.#draftChk, {
                        label: "Ébauche",
                        align: "inline",
                      }),
                      new OO.ui.FieldLayout(this.#sortKeyFld, {
                        label: "Clé de tri",
                        help: "Permet de trier les pages dans les catégories.",
                        align: "inline",
                        helpInline: true,
                      }),
                    ],
                  }),
                ],
              });
            },
          },
        ];

        /*
         * Insert tabs
         */

        const tabsWidget = new OO.ui.IndexLayout({
          expanded: false,
          id: "cnm-tabs-widget",
        });
        for (const [i, tabData] of tabs.entries()) {
          const tab = new Tab(`cnm-tab${i}`, {
            label: tabData.title,
            expanded: false,
          });
          const content = tabData.content();
          tab.$element.append(typeof content === "string" ? content : content.$element);
          tabsWidget.addTabPanels([tab]);
          this.#tabs.push(tab);
        }

        /*
         * Construct GUI
         */

        // TODO display this text somewhere
        // const popup = new OO.ui.PopupWidget({
        //   // $autoCloseIgnore: button.$element,
        //   $content: $("<p>Le code a été inséré dans la boite d’édition ci-dessous. " +
        //       "Vous devriez <strong>vérifier</strong> que le résultat est conforme à vos souhaits, " +
        //       "et en particulier utiliser le bouton «&nbsp;Prévisualer&nbsp;» avant de publier.</p>"),
        //   padded: true,
        //   width: 300,
        //   anchor: false,
        // });

        const toolFactory = new OO.ui.ToolFactory();
        const toolGroupFactory = new OO.ui.ToolGroupFactory();
        const toolbar = new OO.ui.Toolbar(toolFactory, toolGroupFactory, {actions: true});

        /**
         * Adds a custom button to the tool factory.
         * @param toolFactory The tool factory into which the tool will be registered.
         * @param name {string} Button’s name.
         * @param icon {string|null} Buttons’s icon name.
         * @param progressive {boolean} Wether the icon should be marked as progressive.
         * @param title {string} Button’s tooltip text.
         * @param onSelect {function} Callback for when the button is clicked.
         * @param onUpdateState {function?} Callback for when the button changes state (optional).
         * @param displayBothIconAndLabel {boolean?} Whether both the icon and label should be displayed.
         */
        function generateButton(toolFactory, name, icon, progressive, title, onSelect, onUpdateState, displayBothIconAndLabel) {
          /** @constructor */
          function CustomTool() {
            CustomTool.super.apply(this, arguments);
          }

          OO.inheritClass(CustomTool, OO.ui.Tool);
          CustomTool.static.name = name;
          CustomTool.static.icon = icon;
          CustomTool.static.title = title;
          if (progressive) {
            CustomTool.static.flags = ["primary", "progressive"];
          }
          CustomTool.static.displayBothIconAndLabel = !!displayBothIconAndLabel;
          CustomTool.prototype.onSelect = onSelect;
          // noinspection JSUnusedGlobalSymbols
          CustomTool.prototype.onUpdateState = onUpdateState || function () {
            this.setActive(false);
          };

          toolFactory.register(CustomTool);
        }

        const hideBtn = "hide";
        generateButton(toolFactory, hideBtn, "collapse", false, "Masquer", function () {
          // noinspection JSCheckFunctionSignatures
          tabsWidget.toggle();
          this.setTitle(tabsWidget.isVisible() ? "Masquer" : "Afficher");
          this.setIcon(tabsWidget.isVisible() ? "collapse" : "expand");
        });

        const helpBtn = "help";
        generateButton(toolFactory, helpBtn, "help", false, "Aide (s’ouvre dans un nouvel onglet)", function () {
          window.open("/wiki/Aide:Gadget-CreerNouveauMot");
        });

        const actionsToolbar = new OO.ui.Toolbar(toolFactory, toolGroupFactory);

        const insertWikicodeBtn = "insert";
        generateButton(toolFactory, insertWikicodeBtn, null, true, "Insérer le code", onInsertWikicode, null, true);

        actionsToolbar.setup([
          {
            type: "bar",
            include: [insertWikicodeBtn],
          },
        ]);
        toolbar.setup([
          {
            type: "bar",
            include: [hideBtn, helpBtn],
          },
        ]);
        toolbar.$actions.append(actionsToolbar.$element);

        const gadgetBox = new OO.ui.PanelLayout({
          expanded: false,
          framed: true,
        });
        const contentFrame = new OO.ui.PanelLayout({
          expanded: false,
        });

        gadgetBox.$element.append(
            toolbar.$element,
            contentFrame.$element.append(tabsWidget.$element)
        );

        toolbar.initialize();
        toolbar.emit("updateState");

        /*
         * Insert elements into DOM
         */

        const $tedit = $(GUI.TARGET_ELEMENT);
        $tedit.append('<h1 id="cnm-title">Ajout d’un mot en <span id="cnm-title-lang">…</span></h1>');
        this.#$titleLangSpan = $("#cnm-title-lang");
        $tedit.append(gadgetBox.$element);

        for (const projectCode of Object.keys(this.#otherProjects)) {
          $(`#cnm-sister-project-${projectCode} span.oo-ui-actionFieldLayout-button`).attr("style", "width: 100%");
          $(`#cnm-sister-project-${projectCode} span.oo-ui-fieldLayout-field`).attr("style", "width: 100%");
        }

        // Enforce fonts for pronunciation text input.
        $("#cnm-pronunciation-field > input")
            .attr("style", 'font-family: "DejaVu Sans", "Segoe UI", "Lucida Grande", "Charis SIL", ' +
                '"Gentium Plus", "Doulos SIL", sans-serif !important');
      }

      /**
       * Selects the tab at the given index.
       * @param index {number} The index.
       */
      selectTab(index) {
        this.#tabs[index].select();
      }

      /**
       * Selects the given language. All external links are modified appropriatly.
       * If the language is not in the dropdown menu, it is added to it.
       * @param language {Language} The language object.
       */
      selectLanguage(language) {
        this.#$titleLangSpan.text(language.name);
        if (!this.#languageSelectFld.getMenu().findItemFromData(language.code)) {
          this.#languageSelectFld.getMenu().addItems([new OO.ui.MenuOptionWidget({
            data: language.code,
            label: language.name,
          })], 0);
        }
        this.#updateFields(language);
        this.#updateSisterProjectsLinks(language);
        const $link = $("#cnm-commons-audio-link");
        const $span = $link.parent();
        let commonsAudioUrl = "#";
        if (language.iso6393Code) {
          const w = this.#word.replace(" ", "_");
          commonsAudioUrl =
              `https://commons.wikimedia.org/w/index.php?search=${w}.wav+incategory:"Lingua+Libre+pronunciation-${language.iso6393Code}"`;
          $span.show();
        } else {
          $span.hide();
        }
        $link.attr("href", commonsAudioUrl);
        this.#languageSelectFld.getMenu().selectItemByData(language.code);
        this.#pronunciationPnl.setLabel(this.#formatApi(language.ipaSymbols));
        if (this.definitions_number === 0) {
          // No definition is added until the user selects a language or its cookie has been read
          this.addDefinition();
        }
        this.#definitionFlds.forEach(f => f.onLanguageUpdate(language.code));
      }

      /**
       * Sets the available genders widget.
       * @param genders {GrammaticalGender[]} The list of genders.
       */
      setAvailableGenders(genders) {
        MainGUI.#setListValues(genders, this.#gendersFld);
      }

      /**
       * Sets the available grammatical numbers widget.
       * @param numbers {GrammaticalNumber[]} The list of grammatical numbers.
       */
      setAvailableNumbers(numbers) {
        MainGUI.#setListValues(numbers, this.#numbersFld);
      }

      /**
       * Updates all language-related fields.
       * @param language {Language} The selected language.
       */
      #updateFields(language) {
        this.#grammarClassSelectFld.getMenu().clearItems();
        const items = [];
        items.push(new OO.ui.MenuOptionWidget({
          data: "",
          label: new OO.ui.HtmlSnippet("— Veuillez choisir —"),
        }));

        for (const [key, grammarItem] of Object.entries(language.grammarItems)) {
          items.push(new OO.ui.MenuOptionWidget({
            data: key,
            label: new OO.ui.HtmlSnippet(grammarItem.grammaticalClass.label),
          }));
        }

        this.#grammarClassSelectFld.getMenu().addItems(items);
        this.#grammarClassSelectFld.getMenu().selectItem(items[0]);
        this.#pronunciationFld.setDisabled(language.code === "conv");
      }

      /**
       * Updates the link search links to sister projects based on the selected language.
       * @param language {Language} The selected language.
       */
      #updateSisterProjectsLinks(language) {
        for (const [projectCode, projectData] of Object.entries(this.#otherProjects)) {
          if (projectCode === "multi-project")
            continue;
          const forLangs = projectData.showOnlyForLangs;
          const disabled = forLangs.length !== 0 && !forLangs.includes(language.code);
          const checkbox = this.#seeOtherProjectsChk[projectCode]["checkbox"];

          const projectDomain = projectData.urlDomain;
          const urlBase = projectData.urlBase;

          const $link = $(`#cnm-sister-project-${projectCode} a`);
          const url = MainGUI.#generateProjectLink(projectDomain, urlBase, language.wikimediaCode, this.#word);

          checkbox.setDisabled(disabled);
          // Unselect if disabled
          checkbox.setSelected(checkbox.isSelected() && !disabled);
          $link.attr("href", url);
          if (url === "#" || disabled) {
            $link.hide();
          } else {
            $link.show();
          }
        }
      }

      /**
       * Creates an HTML list of IPA symbols from an array of symbols.
       * @param ipaSymbols {string[][]} The list of IPA symbols.
       * @return {Object} A jQuery object.
       */
      #formatApi(ipaSymbols) {
        const $label = $("<span>");

        for (const [i, ipaSymbol] of ipaSymbols.entries()) {
          $label.append(createLinks(ipaSymbol, this.#pronunciationFld, "API"));
          if (i < ipaSymbols.length - 1) {
            $label.append(" &mdash; ");
          }
        }

        return $label;
      }

      /**
       * Sets the values of the given OOUI dropdown widget.
       * @param values {(GrammaticalGender|GrammaticalNumber)[]} The list of values.
       * @param field {OO.ui.DropdownWidget} The OOUI widget.
       */
      static #setListValues(values, field) {
        // noinspection JSUnresolvedFunction
        field.getMenu().clearItems();
        const items = [];
        if (values.length) {
          if (values.length !== 1) { // No need to add an extra step when there’s only one choice
            items.push(new OO.ui.MenuOptionWidget({
              data: "",
              label: new OO.ui.HtmlSnippet("— Veuillez choisir —"),
            }));
          }
          for (const value of values) {
            items.push(new OO.ui.MenuOptionWidget({
              data: value.label,
              label: new OO.ui.HtmlSnippet(value.label),
            }));
          }
        } else {
          items.push(new OO.ui.MenuOptionWidget({
            data: "*",
            label: new OO.ui.HtmlSnippet("<em>indisponible</em>"),
          }));
        }
        // noinspection JSUnresolvedFunction
        field.getMenu().addItems(items);
        // noinspection JSUnresolvedFunction
        field.getMenu().selectItem(items[0]);
      }

      /**
       * Generates the URL to the given sister project’s search page.
       * @param projectDomain {string} Project’s domain name.
       * @param urlBase {string} The base URL (usually wiki).
       * @param langCode {string} Project’s domain language code.
       * @param word {string} The word to search for.
       * @return {string} The search URL.
       */
      static #generateProjectLink(projectDomain, urlBase, langCode, word) {
        return langCode ? `https://${projectDomain.format(langCode)}/${urlBase}${encodeURI(word)}` : "#";
      }

      /**
       * Returns the contents of the given section.
       * @param sectionCode {string} Sections’s code.
       * @return {string} The section’s contents.
       */
      getSectionContent(sectionCode) {
        return this.#otherSectionFields[sectionCode] ? this.#otherSectionFields[sectionCode].getValue().trim() : "";
      }

      /**
       * Sets the contents of the given section.
       * @param sectionCode {string} Sections’s code.
       * @param content {string} The section’s contents.
       */
      setSectionContent(sectionCode, content) {
        this.#otherSectionFields[sectionCode].setValue(content.trim());
      }

      /**
       * Indicates whether a link to the given sister project has to be inserted.
       * @param projectCode {string} Project’s code.
       * @return {boolean} True if a link has to be inserted.
       */
      hasAddLinkToProject(projectCode) {
        return this.#seeOtherProjectsChk[projectCode]["checkbox"].isSelected();
      }

      /**
       * Sets whether a link to the given sister project has to be inserted.
       * @param projectCode {string} Project’s code.
       * @param link {boolean} True if a link has to be inserted.
       */
      setAddLinkToProject(projectCode, link) {
        this.#seeOtherProjectsChk[projectCode]["checkbox"].setSelected(link);
      }

      /**
       * Returns the template parameters for the given sister project link.
       * @param projectCode {string} Project’s code.
       * @return {string} Template’s parameters.
       */
      getProjectLinkParams(projectCode) {
        return this.#seeOtherProjectsChk[projectCode]["textfield"].getValue().trim();
      }

      /**
       * Sets template parameters for the given sister project link.
       * @param projectCode {string} Project’s code.
       * @param params {string} Template’s parameters.
       */
      setProjectLinkParams(projectCode, params) {
        this.#seeOtherProjectsChk[projectCode]["textfield"].setValue(params.trim());
      }

      /**
       * @return {number} The number of tabs.
       */
      get tabsNumber() {
        return this.#tabs.length;
      }

      /**
       * @return {string} Selected language’s code.
       */
      get selectedLanguage() {
        return this.#languageSelectFld.getMenu().findSelectedItem().getData();
      }

      /**
       * @return {string} Selected gender’s code.
       */
      get gender() {
        return this.#gendersFld.getMenu().findSelectedItem().getData();
      }

      /**
       * @return {string} Selected grammatical number’s code.
       */
      get number() {
        return this.#numbersFld.getMenu().findSelectedItem().getData();
      }

      /**
       * @return {string} Selected grammatical class.
       */
      get grammarClass() {
        return this.#grammarClassSelectFld.getMenu().findSelectedItem().getData();
      }

      /**
       * @return {string} The image name.
       */
      get imageName() {
        return this.#imageFld.getValue().trim();
      }

      /**
       * Sets the image name.
       * @param imageName {string} The image name.
       */
      set imageName(imageName) {
        this.#imageFld.setValue(imageName.trim());
      }

      /**
       * @return {string} The image description.
       */
      get imageDescription() {
        return this.#imageDescriptionFld.getValue().trim();
      }

      /**
       * Sets the image description.
       * @param imageDesc {string} The image description.
       */
      set imageDescription(imageDesc) {
        this.#imageDescriptionFld.setValue(imageDesc.trim());
      }

      /**
       * @return {string} The pronunciation.
       */
      get pronunciation() {
        return this.#pronunciationFld.getValue().trim();
      }

      /**
       * Sets the pronunciation.
       * @param pron {string} The pronunciation.
       */
      set pronunciation(pron) {
        this.#pronunciationFld.setValue(pron.trim());
      }

      /**
       * Returns the definition with the given number.
       * @param index {number} Definition’s index.
       * @return {Definition} A definition object.
       */
      getDefinition(index) {
        const definitionForm = this.#definitionFlds[index];
        const examples = [];
        for (let i = 0; i < definitionForm.examples_number; i++) {
          examples.push(definitionForm.getExample(i));
        }
        return new Definition(definitionForm.getText(), examples);
      }

      /**
       * @return {number} The number of definitions.
       */
      get definitions_number() {
        return this.#definitionFlds.length;
      }

      /**
       * Adds a definition form.
       */
      addDefinition() {
        const definitionForm = new DefinitionForm(this.definitions_number + 1, this.selectedLanguage);
        this.#definitionFlds.push(definitionForm);
        this.#definitionsLayout.addItems([definitionForm], this.#definitionsLayout.items.length - 1);
        this.#removeDefinitionBtn.toggle(this.definitions_number > 1);
      }

      /**
       * Removes a definition form.
       * @param index {number} The definition’s index.
       */
      removeDefinition(index) {
        const definitionForm = this.#definitionFlds[index];
        this.#definitionFlds.splice(index, 1);
        this.#definitionsLayout.removeItems([definitionForm]);
        this.#removeDefinitionBtn.toggle(this.definitions_number > 1);
      }

      /**
       * @return {string[]} The categories.
       */
      get categories() {
        return this.#categoriesWidget.getValue();
      }

      /**
       * Sets the categories.
       * @param categories {string[]} The image categories.
       */
      set categories(categories) {
        this.#categoriesWidget.setValue(categories);
      }

      /**
       * @return {string} The etymology.
       */
      get etymology() {
        return this.#etymologyFld.getValue().trim();
      }

      /**
       * Sets the etymology.
       * @param etym {string} The etymology.
       */
      set etymology(etym) {
        this.#etymologyFld.setValue(etym.trim());
      }

      /**
       * @return {string} The pronunciation section.
       */
      get pronunciationSection() {
        return this.#pronunciationSectionFld.getValue().trim();
      }

      /**
       * Sets the pronunciation section content.
       * @param pronunciationSection {string} The pronunciation section content.
       */
      set pronunciationSection(pronunciationSection) {
        this.#pronunciationSectionFld.setValue(pronunciationSection.trim());
      }

      /**
       * @return {string} The homophones.
       */
      get homophones() {
        return this.#homophonesFld.getValue().trim();
      }

      /**
       * Sets the homophones.
       * @param homophones {string} The homophones.
       */
      set homophones(homophones) {
        this.#homophonesFld.setValue(homophones.trim());
      }

      /**
       * @return {string} The paronyms.
       */
      get paronyms() {
        return this.#paronymsFld.getValue().trim();
      }

      /**
       * Sets the paronyms.
       * @param paronyms {string} The paronyms.
       */
      set paronyms(paronyms) {
        this.#paronymsFld.setValue(paronyms.trim());
      }

      /**
       * @return {string} The references.
       */
      get references() {
        return this.#referencesFld.getValue().trim();
      }

      /**
       * Sets the references.
       * @param references {string} The references.
       */
      set references(references) {
        this.#referencesFld.setValue(references.trim());
      }

      /**
       * @return {string} The bibliography.
       */
      get bibliography() {
        return this.#bibliographyFld.getValue().trim();
      }

      /**
       * Sets the bibliography.
       * @param bibliography {string} The bibliography.
       */
      set bibliography(bibliography) {
        this.#bibliographyFld.setValue(bibliography.trim());
      }

      /**
       * Indicates whether the article is a draft.
       * @return {boolean} True if it is a draft.
       */
      get isDraft() {
        return this.#draftChk.isSelected();
      }

      /**
       * Sets whether the article is a draft.
       * @param draft {boolean} True if it is a draft.
       */
      set isDraft(draft) {
        this.#draftChk.setSelected(draft);
      }

      /**
       * @return {string} The sorting key.
       */
      get sortingKey() {
        return this.#sortKeyFld.getValue().trim();
      }

      /**
       * Defines the sorting key.
       * @param key {string} The sorting key.
       */
      set sortingKey(key) {
        this.#sortKeyFld.setValue(key.trim());
      }
    }

    /*
     * Grammatical data definition
     */

    /**
     * Defines all available grammatical genders/verb groups.
     * @type {Object<string, GrammaticalGender>}
     */
    const GENDERS = {
      MASCULINE: new GrammaticalGender("masculin", "{{m}}"),
      FEMININE: new GrammaticalGender("féminin", "{{f}}"),
      FEMININE_MASCULINE_DIFF: new GrammaticalGender("masc. et fém. différents"),
      FEMININE_MASCULINE: new GrammaticalGender("masc. et fém. identiques", "{{mf}}"),
      NO_GENDER: new GrammaticalGender("pas de genre"),
      VERB_GROUP1: new GrammaticalGender("1<sup>er</sup> groupe", "{{type|{0}}} {{conjugaison|{0}|groupe=1}}"),
      VERB_GROUP2: new GrammaticalGender("2<sup>ème</sup> groupe", "{{type|{0}}} {{conjugaison|{0}|groupe=2}}"),
      VERB_GROUP3: new GrammaticalGender("3<sup>ème</sup> groupe", "{{type|{0}}} {{conjugaison|{0}|groupe=3}}"),
      VERB: new GrammaticalGender("verbe", "{{type|{0}}} {{conjugaison|{0}}}"),
      VERB_NO_TEMPLATE: new GrammaticalGender("verbe", "{{type|{0}}}"),
      REGULAR_VERB: new GrammaticalGender("régulier", "{{type|{0}}}"),
      IRREGULAR_VERB: new GrammaticalGender("irrégulier", "{{type|{0}}}"),
    };
    /**
     * Defines all available grammatical numbers.
     * @type {Object<string, GrammaticalNumber>}
     */
    const NUMBERS = {
      DIFF_SINGULAR_PLURAL: new GrammaticalNumber("sing. et plur. différents"),
      SAME_SINGULAR_PLURAL: new GrammaticalNumber("sing. et plur. identiques", "{{sp}}"),
      SINGULAR_ONLY: new GrammaticalNumber("singulier uniquement", "{{au singulier uniquement|{0}}}"),
      PLURAL_ONLY: new GrammaticalNumber("pluriel uniquement", "{{au pluriel uniquement|{0}}}"),
      INVARIABLE: new GrammaticalNumber("invariable", "{{invariable}}"),
      COLLECTIVE_SINGULATIVE: new GrammaticalNumber("collectif et singulatif", "{{collectif}}"),
      COLLECTIVE_SINGULATIVE_PLURAL: new GrammaticalNumber("collectif, singulatif, et pluriel du singulatif", "{{collectif}}"),
      SINGULATIVE_DUAL_PLURAL: new GrammaticalNumber("singulier, duel, et pluriel"),
    };
    /**
     * Defines all available grammatical classes.
     * @type {Object<string, GrammaticalClass>}
     */
    const GRAMMATICAL_CLASSES = {
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
    };

    const gadget = new GadgetCreerNouveauMot();
    window.gadget_creerNouveauMot = gadget; // Expose to global scope

    /*
     * French language definition.
     */

    function getFrenchModel(word, grammarClass, gender, number, pron, simple) {
      if (number === NUMBERS.INVARIABLE.label) {
        return `{{fr-inv|${pron}|inv_titre=${grammarClass}}}`;
      }
      if (number === NUMBERS.SAME_SINGULAR_PLURAL.label) {
        return `{{fr-inv|${pron}|sp=oui}}`;
      }
      if (number === NUMBERS.SINGULAR_ONLY.label) {
        return `{{fr-inv|${pron}|inv_titre=Singulier}}`;
      }
      if (number === NUMBERS.PLURAL_ONLY.label) {
        return `{{fr-inv|${pron}|inv_titre=Pluriel}}`;
      }

      if (gender === GENDERS.FEMININE_MASCULINE.label) {
        return `{{fr-rég|${pron}|mf=oui}}`;
      }

      if (simple) {
        return `{{fr-rég|${pron}}}`;
      } else {
        return `{{fr-accord-rég|${pron}}}`;
      }
    }

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
          new GrammaticalItem(GRAMMATICAL_CLASSES.ADJECTIVE, [GENDERS.FEMININE_MASCULINE_DIFF, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.ADVERB, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.NOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getFrenchModel(word, grammarClass, gender, number, pron, true)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.VERB, [GENDERS.VERB_GROUP1, GENDERS.VERB_GROUP2, GENDERS.VERB_GROUP3]),

          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.DEFINITE_ARTICLE, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.CONJUNCTION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERJECTION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.LAST_NAME, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PARTICLE, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.POSTPOSITION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX, [GENDERS.NO_GENDER]),
          new GrammaticalItem(GRAMMATICAL_CLASSES.FIRST_NAME, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PREPOSITION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PRONOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], getFrenchModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getFrenchModel(word, grammarClass, gender, number, pron, true)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getFrenchModel(word, grammarClass, gender, number, pron, true)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getFrenchModel(word, grammarClass, gender, number, pron, true)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PERSONAL_PRONOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getFrenchModel(word, grammarClass, gender, number, pron, true)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getFrenchModel(word, grammarClass, gender, number, pron, true)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.RELATIVE_PRONOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getFrenchModel(word, grammarClass, gender, number, pron, true)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX, [GENDERS.NO_GENDER]),
        ]
    )); // fr

    /*
     * English language definition.
     */

    function getEnglishModel(grammarClass, number, pron) {
      if (number === NUMBERS.SAME_SINGULAR_PLURAL.label) {
        return `{{en-inv|${pron}|sp=oui}}`;
      }
      if (number === NUMBERS.SINGULAR_ONLY.label) {
        return `{{en-inv|${pron}|inv_titre=Singulier}}`;
      }
      if (number === NUMBERS.PLURAL_ONLY.label) {
        return `{{en-inv|${pron}|inv_titre=Pluriel}}`;
      }
      return `{{en-inv|${pron}|inv_titre=${grammarClass}}}`;
    }

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
          new GrammaticalItem(GRAMMATICAL_CLASSES.ADJECTIVE, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.ADVERB, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.NOUN, [GENDERS.NO_GENDER], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => number !== NUMBERS.DIFF_SINGULAR_PLURAL.label ? getEnglishModel(grammarClass, number, pron) : `{{en-nom-rég|${pron}}}`),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.VERB, [GENDERS.REGULAR_VERB, GENDERS.IRREGULAR_VERB], null, (word, grammarClass, gender, number, pron) => gender === GENDERS.REGULAR_VERB.label ? `{{en-conj-rég|inf.pron=${pron}}}` : `{{en-conj-irrég|inf=${word}|inf.pron=${pron}|<!-- Compléter -->}}`),

          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.DEFINITE_ARTICLE, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.CONJUNCTION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERJECTION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.LAST_NAME, [GENDERS.NO_GENDER], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => number !== NUMBERS.DIFF_SINGULAR_PLURAL.label ? getEnglishModel(grammarClass, number, pron) : `{{en-nom-rég|${pron}}}`),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PARTICLE, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.POSTPOSITION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX, [GENDERS.NO_GENDER]),
          new GrammaticalItem(GRAMMATICAL_CLASSES.FIRST_NAME, [GENDERS.NO_GENDER], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => number !== NUMBERS.DIFF_SINGULAR_PLURAL.label ? getEnglishModel(grammarClass, number, pron) : `{{en-nom-rég|${pron}}}`),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PREPOSITION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PRONOUN, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PERSONAL_PRONOUN, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.RELATIVE_PRONOUN, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getEnglishModel(grammarClass, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX, [GENDERS.NO_GENDER]),
        ]
    )); // en

    /*
     * Italian language definition.
     */

    function getItalianModel(word, grammarClass, gender, number, pron) {
      if (number === NUMBERS.INVARIABLE.label) {
        return `{{it-inv|${pron}|inv_titre=${grammarClass}}}`;
      }
      if (number === NUMBERS.SAME_SINGULAR_PLURAL.label) {
        return `{{it-inv|${pron}|sp=oui}}`;
      }
      if (number === NUMBERS.SINGULAR_ONLY.label) {
        return `{{it-inv|${pron}|inv_titre=Singulier}}`;
      }
      if (number === NUMBERS.PLURAL_ONLY.label) {
        return `{{it-inv|${pron}|inv_titre=Pluriel}}`;
      }

      if (gender === GENDERS.FEMININE_MASCULINE.label) {
        return `{{it-flexion|${pron}|mf=oui}}`;
      }

      return `{{it-flexion|${pron}}}`;
    }

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
          new GrammaticalItem(GRAMMATICAL_CLASSES.ADJECTIVE, [GENDERS.FEMININE_MASCULINE_DIFF, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.ADVERB, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.NOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getItalianModel(word, grammarClass, gender, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.VERB, [GENDERS.VERB_GROUP1, GENDERS.VERB_GROUP2, GENDERS.VERB_GROUP3]),

          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.DEFINITE_ARTICLE, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.CONJUNCTION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERJECTION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.LAST_NAME, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PARTICLE, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.POSTPOSITION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX, [GENDERS.NO_GENDER]),
          new GrammaticalItem(GRAMMATICAL_CLASSES.FIRST_NAME, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PREPOSITION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PRONOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], getItalianModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getItalianModel(word, grammarClass, gender, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getItalianModel(word, grammarClass, gender, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getItalianModel(word, grammarClass, gender, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PERSONAL_PRONOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getItalianModel(word, grammarClass, gender, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getItalianModel(word, grammarClass, gender, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.RELATIVE_PRONOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.SAME_SINGULAR_PLURAL, NUMBERS.SINGULAR_ONLY, NUMBERS.PLURAL_ONLY, NUMBERS.INVARIABLE], (word, grammarClass, gender, number, pron) => getItalianModel(word, grammarClass, gender, number, pron)),
          new GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX, [GENDERS.NO_GENDER]),
        ]
    )); // it

    /*
     * Esperanto language definition.
     */

    function getEsperantoModel(_, grammarClass, gender, number, pron) {
      if (number === NUMBERS.DIFF_SINGULAR_PLURAL.label) {
        return `{{eo-flexions|${pron}}}`;
      }
      if (grammarClass.toLowerCase() === GRAMMATICAL_CLASSES.VERB.label) {
        return "{{eo-verbe}}";
      }
      return "";
    }

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
          new GrammaticalItem(GRAMMATICAL_CLASSES.ADJECTIVE, [GENDERS.NO_GENDER], [NUMBERS.DIFF_SINGULAR_PLURAL], getEsperantoModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.ADVERB, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getEsperantoModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.NOUN, [GENDERS.NO_GENDER], [NUMBERS.DIFF_SINGULAR_PLURAL], getEsperantoModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN, [GENDERS.NO_GENDER], [NUMBERS.DIFF_SINGULAR_PLURAL], getEsperantoModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.VERB, [GENDERS.VERB_NO_TEMPLATE], null, getEsperantoModel),

          new GrammaticalItem(GRAMMATICAL_CLASSES.CONJUNCTION, [GENDERS.NO_GENDER], [NUMBERS.DIFF_SINGULAR_PLURAL], getEsperantoModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERJECTION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getEsperantoModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.FIRST_NAME, [GENDERS.NO_GENDER], [NUMBERS.DIFF_SINGULAR_PLURAL], getEsperantoModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PREPOSITION, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getEsperantoModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PRONOUN, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE], getEsperantoModel),
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

    function getBretonModel(word, grammarClass, gender, number) {
      if (number === NUMBERS.DIFF_SINGULAR_PLURAL.label)
        return `{{br-nom|${word}}}`;
      if (number === NUMBERS.COLLECTIVE_SINGULATIVE.label)
        return `{{br-nom-cs|${word}}}`;
      if (number === NUMBERS.COLLECTIVE_SINGULATIVE_PLURAL.label)
        return `{{br-nom-csp|${word}}}`;
      if (number === NUMBERS.SINGULATIVE_DUAL_PLURAL.label)
        return `{{br-nom-duel|${word}|<!-- DUEL À COMPLÉTER -->}}`;
      const grammarClass_ = grammarClass.toLowerCase();
      if (grammarClass_ === GRAMMATICAL_CLASSES.PROPER_NOUN.label)
        return `{{br-nom-pr}}`;
      if (grammarClass_ === GRAMMATICAL_CLASSES.FIRST_NAME.label)
        return `{{br-nom-pr|forme=Prénom}}`;
      if (grammarClass_ === GRAMMATICAL_CLASSES.LAST_NAME.label)
        return `{{br-nom-pr|forme=Nom de famille}}`;
      if (grammarClass_ === GRAMMATICAL_CLASSES.ADJECTIVE.label)
        return `{{br-flex-adj}}`;
      if (grammarClass_ === GRAMMATICAL_CLASSES.VERB.label)
        return `{{br-forme-mut|${word}}}`;
      if (grammarClass_ === GRAMMATICAL_CLASSES.PREPOSITION.label)
        return `{{br-prép|${word}|<!-- TYPE À COMPLÉTER -->}}`;
      return "";
    }

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
          new GrammaticalItem(GRAMMATICAL_CLASSES.ADJECTIVE, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.ADVERB, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.NOUN, [GENDERS.MASCULINE, GENDERS.FEMININE, GENDERS.FEMININE_MASCULINE], [NUMBERS.DIFF_SINGULAR_PLURAL, NUMBERS.COLLECTIVE_SINGULATIVE, NUMBERS.COLLECTIVE_SINGULATIVE_PLURAL, NUMBERS.SINGULATIVE_DUAL_PLURAL], getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.VERB, null, getBretonModel),

          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.DEFINITE_ARTICLE, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.CONJUNCTION, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERJECTION, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.LAST_NAME, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PARTICLE, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.POSTPOSITION, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX, null),
          new GrammaticalItem(GRAMMATICAL_CLASSES.FIRST_NAME, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PREPOSITION, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PRONOUN, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PERSONAL_PRONOUN, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.RELATIVE_PRONOUN, null, null, getBretonModel),
          new GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX, null),
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
          new GrammaticalItem(GRAMMATICAL_CLASSES.SCIENTIFIC_NAME, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE]),
          new GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE]),
          new GrammaticalItem(GRAMMATICAL_CLASSES.SYMBOL, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE]),
          new GrammaticalItem(GRAMMATICAL_CLASSES.ADVERB, [GENDERS.NO_GENDER], [NUMBERS.INVARIABLE]),
        ]
    )); // conv
  }
});
// </nowiki>
