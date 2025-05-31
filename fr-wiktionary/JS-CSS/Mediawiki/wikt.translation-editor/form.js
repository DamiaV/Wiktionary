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
        $showMoreButton
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
        $grammarPropsLine,
        this._$transliterationLine,
        this._$traditionalLine,
        this._$pageNameLine
    );

    $form.submit((e) => {
      e.preventDefault();

      const translation = $translationInput.val().trim();
      if (!this._selectedLanguage.expectsUpperCase) {
        const firstChar = translation.charAt(0);
        if (firstChar.toUpperCase() === firstChar) {
          const proceed = confirm("Êtes vous sûr·e que le mot commence bien par une majuscule\u00a0? " +
              "Si ce n’est pas le cas, veuillez corriger avant de valider.");
          if (!proceed) return;
        }
      }
      if (translation.includes(",")) {
        const proceed = confirm("Êtes vous sûr·e que la traduction contient bien une virgule\u00a0? " +
            "Si ce n’est pas le cas, veuillez corriger avant de valider.");
        if (!proceed) return;
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

      this.insertTranslation(edit);
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
   */
  insertTranslation(translation) {
    this._externalPageExists(
        translation.langCode,
        translation.word,
        (exists) => this._insertTranslation(translation, exists),
        () => this._insertTranslation(translation)
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
    const element = line.querySelector(`.trans-item[data-trans-word="${word}"]`);
    if (element) {
      element.remove();
      // Line ends up empty, deleted it
      if (!line.querySelector(".trans-item")) line.remove();
    }
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
   * @param exists {boolean?} Indicate whether the page exists on the target wiki (true) or not (false).
   * If undefined, no wiki exists for the language code.
   * @private
   */
  _insertTranslation(translation, exists) {
    let plusMinus = exists === undefined ? "" : exists ? "+" : "-";
    let transWikicode = `, {{trad${plusMinus}|${translation.langCode}|${translation.word}`;
    if (translation.grammarProperty) transWikicode += `|${translation.grammarProperty}`;
    if (translation.transliteration) transWikicode += `|tr=${translation.transliteration}`;
    if (translation.traditional) transWikicode += `|tradi=${translation.traditional}`;
    if (translation.pageName) transWikicode += `|dif=${translation.pageName}`;
    transWikicode += "}}";

    const wrapper = document.createElement("span");
    wrapper.classList.add("trans-new-item");
    wrapper.setAttribute("data-trans-word", this._escapeHTML(translation.word));

    this._renderWikicode(transWikicode)
        .then((elements) => {
          Array.from(elements).forEach((element) => {
            wrapper.append(element);
          });

          const line = this._findTranslationLineInHTML(translation.langCode);
          if (line) {
            line.append(wrapper);
            this._pushTranslationToDialog(translation);
          } else {
            const newLine = document.createElement("li");
            newLine.classList.add("trans-new-line");

            this._renderWikicode(`{{T|${translation.langCode}}} : `)
                .then((elements) => {
                  Array.from(elements).forEach((element) => {
                    newLine.append(element);
                  });
                  newLine.append(wrapper);
                  // TODO insert newLine
                  this._pushTranslationToDialog(translation);
                })
                .catch(() => alert("Une erreur est survenue, veuillez réessayer."));
          }
        })
        .catch(() => alert("Une erreur est survenue, veuillez réessayer."));
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
      if (childNode.tagName === "LI" && childNode.querySelector(`.trad-${langCode}`))
        return childNode;
    return null;
  }

  /**
   * Update the currently selected language.
   * @param langNameOrCode {string} The name or code of the requested language.
   * @private
   */
  _setLanguage(langNameOrCode) {
    let langCode, langName;

    if (langName = getLanguageName(langNameOrCode))
      langCode = langNameOrCode;
    else if (langCode = LANG_NAME_TO_CODE.get(langNameOrCode))
      langName = langNameOrCode;

    if (!langCode) {
      this._$submitButton.prop("disabled", true);
      return;
    } else if (this._$submitButton.is(":disabled"))
      this._$submitButton.prop("disabled", false);

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
}

module.exports = { EditForm };
// </nowiki>
