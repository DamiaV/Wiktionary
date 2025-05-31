// [[Catégorie:JavaScript du Wiktionnaire|translation-editor/form.js]]
// <nowiki>
"use strict";

/**
 * @typedef {{
 *  boxIndex: number,
 *  langCode: string,
 *  word: string,
 *  transliteration?: string,
 *  traditional?: string,
 *  grammarProperty?: string,
 *  pageName?: string,
 *  externalExists?: boolean,
 * }} Translation
 */
/**
 * @typedef {{
 *  properties?: string[],
 *  hasTransliteration?: boolean,
 *  hasTraditional?: boolean,
 *  expectsUpperCase?: boolean
 * }} LangProperties
 */

const { getLanguageToCodeMap, getLanguageName, getLanguage } = require("../wikt.core.languages.js");
const LANG_NAME_TO_CODE = getLanguageToCodeMap();
/** @type {{[code: string]: LangProperties}} */
const LANG_PROPERTIES = require("./lang-properties.json");

const LAST_LANG_CODE_KEY = "trans-editor-lang";
const GRAMMATICAL_PROPERTIES = {
  m: "masc.",
  f: "fém.",
  mf: "masc. & fém.",
  n: "neutre",
  c: "commun",
  s: "singulier",
  d: "duel",
  p: "pluriel",
  mp: "masc. pluriel",
  fp: "fém. pluriel",
  np: "neutre pluriel",
  mfp: "masc. & fém. pluriel",
  a: "animé",
  i: "inanimé",
  fa: "fém. animé",
  fi: "fém. inanimé",
  ma: "masc. animé",
  mi: "masc. inanimé",
  na: "neutre animé",
  ni: "neutre inanimé",
};
/**
 * Name of the "conv" language (International Conventions).
 * Cached to avoid multiple queries.
 * @type {string}
 */
const CONV_LANG_NAME = getLanguageName("conv");
/**
 * The list of possible mistake characters and their name.
 * @type {Record<string, string>}
 */
const POSSIBLE_MISTAKES = {
  ",": "une virgule",
  "،": "une virgule",
  ";": "un point-virgule",
  "/": "une barre oblique (slash)",
};

class EditForm {
  /**
   * Create a new form for the translations box at the given index.
   * @param index {number} The index of the associated translations box.
   * @param translationsDiv {HTMLDivElement} The DIV tag containing the list of translations.
   * @param dialog {EditDialog} The global edit dialog.
   * @param api {mw.Api} The gadget’s API instance.
   */
  constructor(index, translationsDiv, dialog, api) {
    /**
     * @type {LangProperties}
     * @private
     */
    this._selectedLanguage = {};
    /**
     * @type {string|null}
     * @private
     */
    this._selectedLangCode = null;
    /**
     * @type {boolean}
     * @private
     */
    this._fullView = false;
    /**
     * @type {boolean}
     * @private
     */
    this._disabled = false;
    /**
     * @type {EditDialog}
     * @private
     */
    this._dialog = dialog;
    /**
     * @type {mw.Api}
     * @private
     */
    this._api = api;
    /**
     * @type {HTMLUListElement}
     * @private
     */
    this._translationsList = this._getOrCreateList(translationsDiv);

    const $form = $(`<form class="translation-editor" data-trans-form-index="${index}">`);
    /**
     * @private
     */
    this._$langInput = $(`<input type="text" size="12" id="lang-input-${index}" placeholder="Langues">`);
    const $translationInput = $(`<input type="text" id="trans-input-${index}" placeholder="Traduction">`);
    const $transliterationInput = $(`<input type="text" id="translit-input-${index}" placeholder="ex : khimera pour химера">`);
    const $traditionalInput = $(`<input type="text" id="tradit-input-${index}" placeholder="ex : 軍團 pour 군단">`);
    const $pageNameInput = $(`<input type="text" id="page-name-input-${index}" placeholder="ex : amo pour amō">`);
    /**
     * @private
     */
    this._$submitButton = $(`<button type="submit">Ajouter</button>`);
    const $showMoreButton = $(`<a href="#">Plus</a>`);
    this._$spinner = $('<img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Ajax_loader_metal_512.gif" alt="loading" style="width: 1.5em">');
    this._$spinner.hide();
    /**
     * @type {Record<string, any>}
     * @private
     */
    this._radioButtons = {};

    // TODO autosuggestions
    this._$langInput.on("focusout", () => {
      this._setLanguage(this._$langInput.val().trim());
    });

    $showMoreButton.on("click", (e) => {
      e.preventDefault();
      this._toggleFullView();
      $showMoreButton.text(this._fullView ? "Moins" : "Plus");
    });

    const $translationLine = $("<p>");
    $translationLine.append(
        `<label for="lang-input-${index}">Ajouter une traduction en</label> `,
        this._$langInput,
        "&nbsp;: ",
        $translationInput,
        " ",
        this._$submitButton,
        " ",
        $showMoreButton,
        " ",
        this._$spinner
    );

    const $grammarPropsLine = $("<p>");
    let firstEntry = true;
    for (const [code, label] of Object.entries(GRAMMATICAL_PROPERTIES)) {
      const id = `grammar-prop-${code}-${index}`;
      const $button = $(`<input id="${id}" type="radio" name="grammar-prop">`);
      this._radioButtons[code] = $button;
      if (!firstEntry) $grammarPropsLine.append(" ");
      else firstEntry = false;
      const $container = $('<span>');
      $container.append($button, ` <label for="${id}">${label}</label>`);
      $grammarPropsLine.append($container);
    }

    /**
     * @private
     */
    this._$messageLine = $('<p class="trans-form-error">');
    this._$messageLine.hide();

    /**
     * @private
     */
    this._$transliterationLine = $("<p>");
    this._$transliterationLine.append(
        `<label for="translit-input-${index}">Translittération&nbsp;:</label> `,
        $transliterationInput
    );

    /**
     * @private
     */
    this._$traditionalLine = $("<p>");
    this._$traditionalLine.append(
        `<label for="tradit-input-${index}">Écriture traditionnelle&nbsp;:</label> `,
        $traditionalInput
    );

    /**
     * @private
     */
    this._$pageNameLine = $("<p>");
    const helpText = "Si la traduction ne correspond pas à un nom de page valide sur le Wiktionnaire, " +
        "il est possible de préciser le nom de page à utiliser ici (le lien sur la traduction visera alors cette page).";
    this._$pageNameLine.append(
        `<label for="page-name-${index}">Nom de la page&nbsp;:</label> `,
        `<sup class="trans-form-help" title="${helpText}">(?)</sup> `,
        $pageNameInput
    );

    $form.append(
        $translationLine,
        this._$messageLine,
        $grammarPropsLine,
        this._$transliterationLine,
        this._$traditionalLine,
        this._$pageNameLine
    );

    $form.submit((e) => {
      e.preventDefault();
      if (this._disabled) return;

      /** @type {string} */
      const title = mw.config.get("wgPageName");
      const translation = $translationInput.val().trim();

      if (!translation) {
        this._showError("Veuillez renseigner une traduction.");
        return;
      }
      if (/[\[\]{}#|=]/.test(translation)) {
        this._showError("La traduction n’est pas dans un format correct, elle contient du wikicode ([]{}#|=).");
        return;
      }
      this._hideError();

      if (!this._selectedLanguage.expectsUpperCase) {
        const firstChar = translation.charAt(0);
        if (firstChar !== firstChar.toLowerCase() && title.charAt(0) === title.charAt(0).toLowerCase()) {
          const proceed = confirm("Êtes vous sûr·e que le mot commence bien par une majuscule\u00a0?\n" +
              "Si ce n’est pas le cas, veuillez corriger avant de valider.");
          if (!proceed) return;
        }
      }

      for (const [char, name] of Object.entries(POSSIBLE_MISTAKES)) {
        if (!title.includes(char) && translation.includes(char)) {
          const proceed = confirm(`Êtes vous sûr·e que la traduction contient bien ${name}\u00a0?\n` +
              "Si ce n’est pas le cas, veuillez insérer les traductions une par une, " +
              "en cliquant sur le bouton «\u00a0Ajouter\u00a0» après chaque insertion de traduction.");
          if (!proceed) return;
        }
      }

      /** @type {string|null} */
      let grammarProperty = null;
      for (const [code, $button] of Object.entries(this._radioButtons)) {
        if ($button.is(":visible") && $button.prop("checked")) {
          grammarProperty = code;
          break;
        }
      }

      /** @type {Translation} */
      const edit = {
        boxIndex: index,
        langCode: this._selectedLangCode,
        word: translation,
      };

      if (grammarProperty)
        edit.grammarProperty = grammarProperty;
      if ($transliterationInput.is(":visible"))
        edit.transliteration = $transliterationInput.val().trim();
      if ($traditionalInput.is(":visible"))
        edit.traditional = $traditionalInput.val().trim();
      if ($pageNameInput.is(":visible"))
        edit.pageName = $pageNameInput.val().trim();

      this.insertTranslation(edit, true);
    });

    this._toggleFullView(false);
    const storedLangCode = window.localStorage.getItem(LAST_LANG_CODE_KEY);
    if (storedLangCode) this._setLanguage(storedLangCode.trim());

    /**
     * @type {HTMLFormElement}
     * @private
     */
    this._html = $form[0];
  }

  /**
   * The HTML element for this form.
   * @return {HTMLFormElement}
   */
  get html() {
    return this._html;
  }

  /**
   * Insert the given translation into the managed HTML list.
   * @param translation {Translation} The translation to insert.
   * @param updateDialog {boolean} Indicate whether the dialog should be updated.
   */
  insertTranslation(translation, updateDialog = false) {
    this.setDisabled(true);
    this._externalPageExists(
        translation.langCode,
        translation.word,
        (exists) => {
          translation.externalExists = exists;
          this._insertTranslation(translation, updateDialog);
        },
        () => {
          translation.externalExists = undefined;
          this._insertTranslation(translation, updateDialog);
        }
    );
  }

  /**
   * Remove the given translation from the HTML list.
   * If this form cannot find the translation, nothing happens.
   * @param translation {Translation} The translation to remove.
   */
  removeTranslation(translation) {
    const line = this._findTranslationLineInHTML(translation.langCode);
    if (!line) return;
    const word = this._escapeHTML(translation.word);
    const element = line.querySelector(`.trans-new-item[data-trans-word="${word}"]`);
    if (element) {
      element.remove();
      // Line ends up empty, delete it
      if (!line.querySelector(".translation")) line.remove();
    }
  }

  /**
   * Clear all edit markers created by this form.
   */
  clearFlags() {
    this._translationsList.querySelectorAll(".trans-new-item")
        .forEach((e) => {
          e.classList.remove("trans-new-item");
          e.removeAttribute("data-trans-word");
        });
    this._translationsList.querySelectorAll(".trans-new-line")
        .forEach((e) => e.classList.remove("trans-new-line"));
  }

  /**
   * Clear all edits made by this form.
   */
  clear() {
    this._translationsList.querySelectorAll(".trans-new-line, .trans-new-item")
        .forEach((e) => e.remove());
  }

  /**
   * Disable form submission.
   * @param disabled {boolean} True to disable, false to enable.
   */
  setDisabled(disabled) {
    if (this._disabled === disabled) return;

    this._disabled = disabled;

    if (disabled) {
      // Save the button’s state to be restored when form is re-enabled
      this._submitState = this._$submitButton.prop("disabled");
      this._$submitButton.prop("disabled", true);
      this._$spinner.show();
    } else {
      this._$submitButton.prop("disabled", !!this._submitState);
      this._$spinner.hide();
    }
    this._dialog.setDisabled(disabled);
  }

  /**
   * Return the UL list contained in the given DIV element.
   * If no UL element is found, a new one is created and inserted into the DIV before being returned.
   * @param translationsDiv {HTMLDivElement} The DIV element to search into.
   * @return {HTMLUListElement} The found or created UL element.
   * @private
   */
  _getOrCreateList(translationsDiv) {
    /** @type {HTMLUListElement|null} */
    let list = translationsDiv.querySelector("ul");
    if (!list) {
      list = document.createElement("ul");
      translationsDiv.append(list);
    }
    return list;
  }

  /**
   * Insert the given translation into the HTML list.
   * @param translation {Translation} The translation to insert.
   * @param updateHistory {boolean?} Indicate whether the edit history should be updated.
   * @private
   */
  _insertTranslation(translation, updateHistory) {
    const wrapper = document.createElement("span");
    wrapper.classList.add("trans-new-item");
    wrapper.setAttribute("data-trans-word", this._escapeHTML(translation.word));

    const onDone = () => {
      this.setDisabled(false);
      if (updateHistory) this._pushTranslationToDialog(translation);
    }

    this._renderWikicode(generateTranslationWikicode(translation))
        .then((elements) => {
          Array.from(elements).forEach((element) => {
            wrapper.append(element);
          });

          const line = this._findTranslationLineInHTML(translation.langCode);
          if (line) {
            line.append(wrapper);
            onDone();
          } else {
            const newLine = document.createElement("li");
            newLine.classList.add("trans-new-line");

            this._renderWikicode(generateTranslationHeaderWikicode(translation.langCode))
                .then((elements) => {
                  Array.from(elements).forEach((element) => {
                    newLine.append(element);
                  });
                  wrapper.childNodes[0].textContent = ""; // Remove leading comma
                  newLine.append(wrapper);
                  this._insertLineInHTML(newLine, translation.langCode);
                  onDone();
                })
                .catch((e) => {
                  console.error(e);
                  alert("Une erreur est survenue, veuillez réessayer.");
                });
          }
        })
        .catch((e) => {
          console.error(e);
          alert("Une erreur est survenue, veuillez réessayer.");
        });
  }

  /**
   * Push a translation onto the edit dialog’s history.
   * @param translation {Translation}
   * @private
   */
  _pushTranslationToDialog(translation) {
    this._dialog.pushEdit(translation);
    if (!this._dialog.isVisible()) this._dialog.show();
  }

  /**
   * Find the LI element corresponding to the given language code from the managed HTML list.
   * @param langCode {string} A language code.
   * @return {HTMLLIElement|null} The corresponding LI element, or null if none matched.
   * @private
   */
  _findTranslationLineInHTML(langCode) {
    for (const childNode of this._translationsList.children)
      if (childNode.tagName === "LI" && childNode.querySelector(`span[data-translation-lang='${langCode}']`))
        return childNode;
    return null;
  }

  /**
   * Insert the given translation line into the managed list.
   * @param line {HTMLLIElement} The line to insert.
   * @param langCode {string} The language code for the line, used to find where to insert it.
   * @private
   */
  _insertLineInHTML(line, langCode) {
    const langName = getLanguageName(langCode);
    for (const childNode of this._translationsList.children) {
      if (childNode.tagName === "LI") {
        const lineLangCode = childNode.querySelector("span:first-child")
            .getAttribute("data-translation-lang");
        const lineLangName = getLanguageName(lineLangCode);
        if (compareLanguages(langName, lineLangName) < 0) {
          this._translationsList.insertBefore(line, childNode);
          return;
        }
      }
    }
    this._translationsList.append(line);
  }

  /**
   * Update the currently selected language.
   * @param langNameOrCode {string} The name or code of the requested language.
   * @private
   */
  _setLanguage(langNameOrCode) {
    if (!langNameOrCode) {
      this._$submitButton.prop("disabled", true);
      this._showError("Veuillez renseigner une langue.");
      return;
    }

    let langCode, langName;

    if (langName = getLanguageName(langNameOrCode))
      langCode = langNameOrCode;
    else if (langCode = LANG_NAME_TO_CODE.get(langNameOrCode))
      langName = langNameOrCode;

    if (!langCode) {
      this._$submitButton.prop("disabled", true);
      this._showError(`La langue «\u00a0${langNameOrCode}\u00a0» n’est pas définie.`);
      return;
    } else if (langCode === "fr") {
      this._$submitButton.prop("disabled", true);
      this._showError("Il n’est pas possible d’ajouter une traduction en français. " +
          "À la place, veuillez utiliser la section «\u00a0Synonymes\u00a0» ou «\u00a0Variantes dialectales\u00a0».");
      return;
    } else if (this._$submitButton.is(":disabled")) {
      this._$submitButton.prop("disabled", false);
      this._hideError();
    }

    this._selectedLanguage = LANG_PROPERTIES[langCode] || {};
    this._selectedLangCode = langCode;
    this._$langInput.val(langName || "");

    if (window.localStorage.getItem(LAST_LANG_CODE_KEY) !== langCode)
      window.localStorage.setItem(LAST_LANG_CODE_KEY, langCode);

    if (this._fullView) return;

    /** @type {string[]} */
    const properties = this._selectedLanguage.properties || [];
    for (const [code, $button] of Object.entries(this._radioButtons))
      if (properties.includes(code)) $button.parent().show();
      else $button.parent().hide();

    if (this._selectedLanguage.hasTransliteration) this._$transliterationLine.show();
    else this._$transliterationLine.hide();

    if (this._selectedLanguage.hasTraditional) this._$traditionalLine.show();
    else this._$traditionalLine.hide();
  }

  /**
   * Toggle the full form view.
   * @param fullView {boolean?} If not undefined, force the full view state.
   * @private
   */
  _toggleFullView(fullView) {
    this._fullView = typeof fullView === "boolean" ? fullView : !this._fullView;
    if (this._fullView) {
      for (const $button of Object.values(this._radioButtons))
        $button.parent().show();
      this._$transliterationLine.show();
      this._$traditionalLine.show();
      this._$pageNameLine.show();
    } else {
      const properties = this._selectedLanguage.properties || [];
      for (const [code, $button] of Object.entries(this._radioButtons))
        if (!properties.includes(code))
          $button.parent().hide();
      if (!this._selectedLanguage.hasTransliteration)
        this._$transliterationLine.hide();
      if (!this._selectedLanguage.hasTraditional)
        this._$traditionalLine.hide();
      this._$pageNameLine.hide();
    }
  }

  /**
   * Render the given wikicode.
   * @param wikicode {string} The wikicode to render.
   * @return {Promise<NodeListOf<ChildNode>>} A Promise that returns the rendered HTML elements.
   * @private
   */
  _renderWikicode(wikicode) {
    return this._api.get({
      action: "parse",
      text: `<div id="trans-editor-wrapper">${wikicode}</div>`
    }).then(data => {
      const html = data.parse.text["*"];
      // Convert the parsed wikicode into DOM objects with jQuery then return the wrapping div’s contents
      return $(html)[0].querySelector("#trans-editor-wrapper").childNodes;
    });
  }

  /**
   * Escape HTML special characters.
   * @param word {string} The word to escape.
   * @returns {string} The escaped word.
   * @private
   */
  _escapeHTML(word) {
    return word
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("&", "&amp;");
  }

  /**
   * Check whether the given page exists in the wiki for the given language code.
   * @param langCode {string} The wiki’s language coded.
   * @param page {string} The page’s title.
   * @param onSuccess {(boolean) => void} A function called when the request succeeds.
   * It takes a boolean indicating whether the page exists on the wiki.
   * @param onFail {(string) => void} A function called when the request fails. It takes the error message.
   * @private
   */
  _externalPageExists(langCode, page, onSuccess, onFail) {
    // List of Wiktionaries that keep the "’" apostrophy.
    const keepApos = [
      "fr", "de",
    ];

    const langData = getLanguage(langCode);
    if (!langData) {
      onFail(`Code ${langCode} not found`);
      return;
    }

    let domain;
    if (langData.wiktionaryExists)
      domain = (langData.wikimediaCode || langCode) + '.wiktionary';
    else if (langCode === "conv")
      domain = "species.wikimedia";
    else {
      onFail(`No Wiktionary for code ${langCode}`);
      return;
    }

    if (keepApos.includes(langCode)) {
      page = page.replace("’", "'");
      page = page.replace("ʼ", "'");
    }

    const url = `https://${domain}.org/w/api.php?` + new URLSearchParams({
      origin: `https://${location.host}`,
      action: "query",
      titles: page,
      format: "json",
    });
    fetch(url)
        .then((response) => response.json()
            .then((data) => onSuccess(!data.query.pages["-1"]))
            .catch(onFail))
        .catch(onFail);
  }

  /**
   * Show an error message.
   * @param message {string} The message to show.
   * @private
   */
  _showError(message) {
    this._$messageLine.text(message);
    this._$messageLine.show();
  }

  /**
   * Hide the error message.
   * @private
   */
  _hideError() {
    this._$messageLine.hide();
    this._$messageLine.text("");
  }
}

/**
 * Generate the {{T}} template wikicode for the given language code.
 * @param langCode {string} A language code.
 * @returns {string} The generated wikicode.
 */
function generateTranslationHeaderWikicode(langCode) {
  return `{{T|${langCode}}} : `;
}

/**
 * Generate the {{trad}} template wikicode for the given translation.
 * @param translation {Translation} A translation.
 * @returns {string} The generated wikicode.
 */
function generateTranslationWikicode(translation) {
  const {
    word,
    langCode,
    transliteration,
    traditional,
    grammarProperty,
    pageName,
    externalExists,
  } = translation;

  const plusMinus = externalExists === undefined ? "" : externalExists ? "+" : "-";
  let transWikicode = `, {{trad${plusMinus}|${langCode}|${word}`;
  if (grammarProperty) transWikicode += `|${grammarProperty}`;
  if (transliteration) transWikicode += `|tr=${transliteration}`;
  if (traditional) transWikicode += `|tradi=${traditional}`;
  if (pageName) transWikicode += `|dif=${pageName}`;
  transWikicode += "}}";

  return transWikicode;
}

/**
 * Compare two language names according to Wiktionnaire’s rules.
 * @param langName1 {string} A language name.
 * @param langName2 {string} Another language name.
 * @returns {number} -1 if the first name is before the second one, 0 if they are equal, 1 otherwise.
 */
function compareLanguages(langName1, langName2) {
  if (langName1 === langName2) return 0;
  if (langName1 === CONV_LANG_NAME) return -1;
  if (langName2 === CONV_LANG_NAME) return 1;
  return langName1.localeCompare(langName2, "fr");
}

module.exports = {
  EditForm,
  compareLanguages,
  generateTranslationWikicode,
  generateTranslationHeaderWikicode,
};
// </nowiki>
