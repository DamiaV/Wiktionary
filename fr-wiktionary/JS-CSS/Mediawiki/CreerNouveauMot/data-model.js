/**
 * This file defines the data model for the gadget.
 */

// <nowiki>
"use strict";

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
 * This class represents a grammatical class.
 */
class GrammaticalClass {
  /** @type {string} */
  #label;
  /** @type {string} */
  #sectionCode;

  /**
   * @param label {string} Class’ label.
   * @param sectionCode {string?} Class’ section code. If left empty, the label will be used.
   * (as defined in [[Convention:Structure des pages#Résumé des sections]] 2,1 onwards).
   */
  constructor(label, sectionCode) {
    this.#label = label;
    this.#sectionCode = sectionCode || label;
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
 * A grammatical item associates a grammatical class to properties.
 */
class GrammaticalItem {
  /** @type {GrammaticalClass} */
  #grammaticalClass;
  /** @type {GrammaticalProperty[][]} */
  #properties;
  /** @type {function(string, string, string[], string): string} */
  #generateInflections;

  /**
   * @param grammaticalClass {GrammaticalClass} The grammatical class.
   * @param properties {GrammaticalProperty[][]?} Associated grammatical properties.
   * @param generateInflections {(function(string, string, string[], string): string)?} Optional function that generates inflections template.
   */
  constructor(grammaticalClass, properties, generateInflections) {
    this.#grammaticalClass = grammaticalClass;
    this.#properties = properties || [];
    this.#generateInflections = generateInflections || (() => "");
  }

  /**
   * @return {GrammaticalClass} The grammatical class.
   */
  get grammaticalClass() {
    return this.#grammaticalClass;
  }

  /**
   * @return {GrammaticalProperty[][]} The available grammatical properties.
   */
  get properties() {
    return this.#properties;
  }

  /**
   * Fetches the grammatical property with the given index and label.
   * @return {GrammaticalProperty|null}
   */
  getProperty(index, label) {
    const props = this.#properties[index];
    if (!props) return null;
    for (const prop of props)
      if (prop.label === label)
        return prop;
    return null;
  }

  /**
   * Generates the inflections template.
   * @param word {string} The base word.
   * @param labels {string[]} Grammatical properties’ labels.
   * @param pronunciation {string} IPA pronunciation.
   * @return {string} Template’s wikicode.
   */
  getInflectionsTemplate(word, labels, pronunciation) {
    let grammarClass = this.#grammaticalClass.label;
    grammarClass = grammarClass.charAt(0).toUpperCase() + grammarClass.substring(1);
    return this.#generateInflections(word, grammarClass, labels, pronunciation);
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
  /** @type {Record<string, GrammaticalItem>} */
  #grammarItems = {};
  /** @type {function} */
  #pronGenerator;

  /**
   * @param code {string} Language code defined in [[Module:langues/data]].
   * @param wikimediaCode {string|null} Language code used by WikiMedia projects.
   * @param iso6393Code {string|null} ISO 639-3 language code for Lingua Libre’s files.
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

module.exports = {
  Definition,
  Example,
  GrammaticalProperty,
  GrammaticalClass,
  GrammaticalItem,
  Language,
  Wiki,
  ArticleSection,
};

// </nowiki>
