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
 * v5.4.5 2025-02-06 Add “locution-phrase” word type.
 * v5.5 2025-04-05 Add Portuguese language.
 * v5.6 2025-04-05 Make grammatical properties generic.
 * v5.6.1 2025-04-05 Split gadget into several files.
 * v5.7 2025-05-22 Use new [[MediaWiki:Gadget-wikt.core.languages.json]].
 * v5.8 2025-05-26 Conversion into a module.
 * v5.8.1 2025-06-04 Notification when the code is inserted.
 * v5.9 2025-06-25 Refactor to enable by default.
 * v5.9.1 2025-07-10 Better handling of English adjectives.
 * -----------------------------------------------------------------------------------------------------------
 * [[Catégorie:JavaScript du Wiktionnaire|CreerNouveauMot.js]]
 * <nowiki>
 */
"use strict";

const { getLanguagesNames } = require("./wikt.core.languages.js");
const { getSortingKey } = require("./wikt.core.page.js");
const {
  insertTextInEditArea,
  getCursorLocation,
  getEditSummaryField,
} = require("./wikt.core.edit.js");
const { setCookie, getCookie } = require("./wikt.core.cookies.js");
const { loadLanguages, getDefaultLanguage } = require("./CreerNouveauMot/languages.js");
const { Wiki, ArticleSection, GrammaticalProperty, Example } = require("./CreerNouveauMot/data-model.js");
const { TARGET_ELEMENT, StartGUI, MainGUI, interpolateString } = require("./CreerNouveauMot/ui.js");

// Activate only in main namespace when in edit/submit mode.
console.log("Chargement de Gadget-CreerNouveauMot.js…");

const NAME = "Créer nouveau mot";
const VERSION = "5.9.1";

const COOKIE_NAME = "cnm_last_lang";
/** Cookie duration in days. */
const COOKIE_DURATION = 30;
/**
 * List of sister projects and associated templates and domain names.
 * @type {Record<string, Wiki>}
 */
const OTHER_PROJECTS = {
  "multi-project": new Wiki("QID pour le modèle «\u00a0liste projets\u00a0»", "liste projets", "wikidata.org"),
  w: new Wiki("Wikipédia", "WP", "{0}.wikipedia.org"),
  s: new Wiki("Wikisource", "WS", "{0}.wikisource.org"),
  q: new Wiki("Wikiquote", "WQ", "{0}.wikiquote.org"),
  v: new Wiki("Wikiversité", "WV", "{0}.wikiversity.org"),
  l: new Wiki("Wikilivres", "WL", "{0}.wikibooks.org"),
  species: new Wiki("Wikispecies", "WSP", "wikispecies.org"),
  voy: new Wiki("Wikivoyage", "VOY", "{0}.wikivoyage.org"),
  n: new Wiki("Wikinews", "WN", "{0}.wikinews.org"),
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
const SECTIONS = [ // TODO utiliser wikt.core.sections.js
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
const EDIT_COMMENT = `Ajout d’un mot en {lang} assisté par [[Aide:Gadget-CreerNouveauMot|${NAME}]] (v${VERSION})`;

/**
 * Gadget’s class.
 */
class GadgetCreerNouveauMot {
  constructor() {
    /**
     * Main word.
     * @type {string}
     * @private
     */
    this._word = String(mw.config.get("wgTitle")).replace("_", " ");
    /**
     * Currently selected language.
     * @type {Language}
     * @private
     */
    this._selectedLanguage = null;
    /**
     * List of available languages.
     * @type {Language[]}
     * @private
     */
    this._languages = [];
    /**
     * Object mapping language codes to their respective names.
     * @type {Record<string, string>}
     * @private
     */
    this._languageNames = {};
    /**
     * Start up GUI.
     * @type {StartGUI}
     * @private
     */
    this._startGUI = null;
    /**
     * Main GUI.
     * @type {MainGUI}
     * @private
     */
    this._mainGUI = null;
    for (const [langCode, langName] of getLanguagesNames(true))
      this._languageNames[langCode] = langName;
    if ($(TARGET_ELEMENT)) this._generateStartUI();
  }

  /**
   * Adds a language to the list of available languages.
   * @param language {Language} The language to add.
   */
  addLanguage(language) {
    this._languages.push(language);
    // Sorting languages: french first,
    // then all remaining in lexicographical order.
    this._languages.sort((l1, l2) => {
      if (l1.code === "fr") return -1;
      if (l2.code === "fr") return 1;
      return l1.name.localeCompare(l2.name);
    });
  }

  /**
   * Fecthes the language with the given code.
   * @param languageCode {string} Language code.
   * @returns {Language|null} The language object or null if none were found.
   */
  getLanguage(languageCode) {
    for (const language of this._languages) {
      if (language.code === languageCode) {
        return language;
      }
    }
    return null;
  }

  /**
   * Generates the start up GUI.
   */
  _generateStartUI() {
    this._startGUI = new StartGUI(NAME, () => this._generateMainUI());
  }

  /**
   * Generates the main GUI.
   */
  _generateMainUI() {
    this._startGUI.remove();
    this._startGUI = null;
    this._mainGUI = new MainGUI(
        this._word,
        this._languages,
        SECTIONS,
        lc => this._onLanguageSelect(lc),
        lc => this._onClassSelect(lc),
        () => this._insertWikicode(),
        OTHER_PROJECTS
    );

    const previousLang = getCookie(COOKIE_NAME);
    this._onLanguageSelect(previousLang || this._languages[0].code);
    this._mainGUI.sortingKey = getSortingKey(this._word);
    this._mainGUI.isDraft = false;
    // Display alert if the page does not exist yet and its title starts with an upper case letter
    if (this._word && this._word[0].toUpperCase() === this._word[0] && $(".mw-newarticletext").length) {
      alert("Êtes-vous certain·e que la majuscule fait partie du mot\u00a0?\n" +
          "Si tel n’est pas le cas, merci de corriger cela.");
    }
  }

  /**
   * Function called whenever the user selects a language.
   * @param languageCode {string} Code of the selected language.
   */
  _onLanguageSelect(languageCode) {
    languageCode = languageCode.trim();

    if (languageCode) {
      let language = this.getLanguage(languageCode);

      if (!language) {
        if (!this._languageNames[languageCode]) {
          alert("Code de langue invalide\u00a0!");
          return;
        }
        language = getDefaultLanguage(languageCode, this._languageNames[languageCode]);
      }
      this._selectedLanguage = language;
      setCookie(COOKIE_NAME, language.code, COOKIE_DURATION);
      this._mainGUI.selectLanguage(this._selectedLanguage);

      this._mainGUI.pronunciation = language.generatePronunciation(this._word);
    }
  }

  /**
   * Function called whenever the user selects a grammatical class.
   * @param className {string} Code of the selected grammatical class.
   */
  _onClassSelect(className) {
    if (className) {
      const grammarItem = this._selectedLanguage.getGrammarItem(className);
      for (let i = 0; i < this._mainGUI.grammaticalPropertyFieldsCount; i++)
        this._mainGUI.setAvailableGrammaticalProperties(i, grammarItem.properties[i] || []);
    } else
      for (let i = 0; i < this._mainGUI.grammaticalPropertyFieldsCount; i++)
        this._mainGUI.setAvailableGrammaticalProperties(i, []);
  }

  /**
   * Generates the wikicode then inserts it into the edit box.
   */
  _insertWikicode() {
    const word = this._word;
    const langCode = this._selectedLanguage.code;
    const isDraft = this._mainGUI.isDraft;
    const pron = this._mainGUI.pronunciation;
    const isConv = langCode === "conv";
    let etymology = this._mainGUI.etymology || `: {{date|lang=${langCode}}} {{ébauche-étym|${langCode}}}`;

    if (!this._mainGUI.grammarClass) {
      alert("Veuillez sélectionner une classe grammaticale (adjectif, nom, etc.).");
      return;
    }
    const propertyCodes = this._mainGUI.grammaticalPropertyCodes;
    if (propertyCodes.some(p => !p)) {
      alert("Veuillez sélectionner les propriétés grammaticales.");
      return;
    }
    const grammarItem = this._selectedLanguage.getGrammarItem(this._mainGUI.grammarClass);
    const propertyLabels = [];
    const propertyTemplates = [];
    for (let i = 0; i < propertyCodes.length; i++) {
      const prop = grammarItem.getProperty(i, propertyCodes[i]) || new GrammaticalProperty("");
      propertyLabels.push(prop.label);
      propertyTemplates.push(interpolateString(prop.template, langCode));
    }
    const grammarClass = grammarItem.grammaticalClass;
    const inflectionsTemplate = grammarItem.getInflectionsTemplate(word, propertyLabels, pron);
    const imageName = this._mainGUI.imageName;
    const imageDescription = this._mainGUI.imageDescription;

    if (!this._mainGUI.definitionsCount) {
      alert("Définition manquante\u00a0! Veuillez en renseigner au moins une avant de charger le wikicode.");
      return;
    }

    let definitions = [];
    for (let i = 0; i < this._mainGUI.definitionsCount; i++) {
      definitions.push(this._mainGUI.getDefinition(i))
    }

    const references = this._mainGUI.references;
    const bibliography = this._mainGUI.bibliography;
    const sortingKey = this._mainGUI.sortingKey;

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
      // trim() to remove trailing space(s) if no grammatical template.
      wikicode += " " + `{{pron|${pron}|${langCode}}} ${propertyTemplates.join(" ")}`
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

    /**
     * Convert lines of text into a list of links.
     * @param content {string} The text to convert to a wikilist.
     * @returns {string} The formatted list.
     */
    function linkify(content) {
      const lines = content.split("\n");

      for (const [i, line] of lines.entries())
        if (/^[^=#:;\[{\s]\S*/.test(line))
          lines[i] = `* {{lien|${line.trim()}|${langCode}}}`;
        else if (/^\*\s*\S+/.test(line))
          lines[i] = `* {{lien|${line.substring(1).trim()}|${langCode}}}`;

      return lines.join("\n").trim();
    }

    let anagramsSection = "";

    for (const section of SECTIONS) {
      const sectionCode = section.code;
      const sectionLevel = section.level;

      if (sectionCode !== "traductions" || langCode === "fr") {
        const content = sectionCode !== "traductions"
            ? this._mainGUI.getSectionContent(sectionCode)
            : "{{trad-début}}\n{{trad-fin}}\n\n";
        if (content) {
          const titleLevel = "=".repeat(sectionLevel);
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
    const pronunciationContent = this._mainGUI.pronunciationSection || `{{ébauche-pron-audio|${langCode}}}`;
    const homophones = this._mainGUI.homophones;
    const paronyms = this._mainGUI.paronyms;

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
    for (const [projectCode, projectData] of Object.entries(OTHER_PROJECTS)) {
      if (this._mainGUI.hasAddLinkToProject(projectCode)) {
        let projectModelParams = this._mainGUI.getProjectLinkParams(projectCode);
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

    this._mainGUI.categories.forEach(category => wikicode += `[[Catégorie:${category}]]\n`);

    insertTextInEditArea(getCursorLocation(), wikicode);

    const $summaryFld = getEditSummaryField();
    const summary = $summaryFld.val();
    const comment = EDIT_COMMENT;
    if (!summary.includes(comment))
      $summaryFld.val(comment.replace("{lang}", this._selectedLanguage.name) + " " + summary);

    // Collapse gadget after inserting wikicode.
    // $(".oo-ui-tool-name-hide > a")[0].click(); // FIXME not triggered

    mw.notify("Le code a été inséré dans le champ de texte ci-dessous. " +
        "Avant de publier les modifications, veuillez vérifier que le code généré est correct.", {
      type: "success",
    });
  }
}

window.gadget_creerNouveauMot = new GadgetCreerNouveauMot(); // Expose to global scope
loadLanguages(gadget_creerNouveauMot);
// </nowiki>
