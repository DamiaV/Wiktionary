// [[Catégorie:JavaScript du Wiktionnaire|translation-editor/form.js]]
// <nowiki>

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
const LANGS_NAME_TO_CODE = getLanguageToCodeMap();
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
const API = new mw.Api({ userAgent: "Gadget-wikt.translation-editor" });

class EditForm {
  /**
   * Create a new form for the translations box at the given index.
   * @param index {number} The index of the associated translations box.
   * @param translationsDiv {HTMLDivElement} The DIV tag containing the list of translations.
   * @param dialog {EditDialog} The global edit dialog.
   */
  constructor(index, translationsDiv, dialog) {
    /** @type {LangProperties} */
    this.selectedLanguage = {};
    /** @type {string|null} */
    this.selectedLangCode = null;
    this.fullView = false;
    this.dialog = dialog;

    /** @type {HTMLUListElement|null} */
    let list = translationsDiv.querySelector("ul");
    if (!list) {
      list = document.createElement("ul");
      translationsDiv.append(list);
    }
    // Assign to a new constant to avoid accidental re-assignment
    /** @type {HTMLUListElement} */
    this.translationsList = list;

    const $form = $(`<form class="translation-editor" data-trans-form-index="${index}">`);
    this.$langInput = $(`<input type="text" size="12" id="lang-input-${index}" placeholder="Langues">`);
    const $translationInput = $(`<input type="text" id="trans-input-${index}" placeholder="Traduction">`);
    const $transliterationInput = $(`<input type="text" id="translit-input-${index}" placeholder="ex : khimera pour химера">`);
    const $traditionalInput = $(`<input type="text" id="tradit-input-${index}" placeholder="ex : 軍團 pour 군단">`);
    const $pageNameInput = $(`<input type="text" id="page-name-input-${index}" placeholder="ex : amo pour amō">`);
    this.$submitButton = $(`<button type="submit">Ajouter</button>`);
    const $showMoreButton = $(`<a href="#">Plus</a>`);
    /** @type {Record<string, Object>} */
    this.radioButtons = {};

    // TODO autosuggestions
    this.$langInput.on("focusout", () => {
      this._setLanguage(this.$langInput.val().trim());
    });

    $showMoreButton.on("click", (e) => {
      e.preventDefault();
      this._toggleFullView();
    });

    const $translationLine = $("<p>");
    $translationLine.append(
        `<label for="lang-input-${index}">Ajouter une traduction en</label> `,
        this.$langInput,
        "&nbsp;: ",
        $translationInput,
        " ",
        this.$submitButton,
        " ",
        $showMoreButton
    );

    const $grammarPropsLine = $("<p>");
    let firstEntry = true;
    for (const [code, label] of Object.entries(GRAMMATICAL_PROPERTIES)) {
      const id = `grammar-prop-${code}-${index}`;
      const $button = $(`<input id="${id}" type="radio" name="grammar-prop">`);
      this.radioButtons[code] = $button;
      if (!firstEntry) $grammarPropsLine.append(" ");
      else firstEntry = false;
      const $container = $('<span>');
      $container.append($button, ` <label for="${id}">${label}</label>`);
      $grammarPropsLine.append($container);
    }

    this.$transliterationLine = $("<p>");
    this.$transliterationLine.append(
        `<label for="translit-input-${index}">Translittération&nbsp;:</label> `,
        $transliterationInput
    );

    this.$traditionalLine = $("<p>");
    this.$traditionalLine.append(
        `<label for="tradit-input-${index}">Écriture traditionnelle&nbsp;:</label> `,
        $traditionalInput
    );

    this.$pageNameLine = $("<p>");
    const helpText = "Si la traduction ne correspond pas à un nom de page valide sur le Wiktionnaire, " +
        "il est possible de préciser le nom de page à utiliser ici (le lien sur la traduction visera alors cette page).";
    this.$pageNameLine.append(
        `<label for="page-name-${index}">Nom de la page&nbsp;:</label> `,
        `<sup class="trans-form-help" title="${helpText}">(?)</sup> `,
        $pageNameInput
    );

    $form.append(
        $translationLine,
        $grammarPropsLine,
        this.$transliterationLine,
        this.$traditionalLine,
        this.$pageNameLine
    );

    $form.submit((e) => {
      e.preventDefault();

      const translation = $translationInput.val().trim();
      if (!this.selectedLanguage.expectsUpperCase) {
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
      for (const [code, $button] of Object.entries(this.radioButtons)) {
        if ($button.is(":visible") && $button.prop("checked")) {
          grammarProperty = code;
          break;
        }
      }

      /** @type {Translation} */
      const edit = {
        boxIndex: index,
        langCode: this.selectedLangCode,
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

    this._html = $form;
  }

  /**
   * The HTML element for this form.
   * @return {HTMLFormElement}
   */
  get html() {
    return this._html[0];
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
    this.dialog.pushEdit(translation);
    if (!this.dialog.isVisible()) this.dialog.show();
  }

  /**
   * Find the LI element corresponding to the given language code from the managed HTML list.
   * @param langCode {string} A language code.
   * @return {HTMLLIElement|null} The corresponding LI element, or null if none matched.
   * @private
   */
  _findTranslationLineInHTML(langCode) {
    for (const childNode of this.translationsList.children)
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
    else if (langCode = LANGS_NAME_TO_CODE.get(langNameOrCode))
      langName = langNameOrCode;

    if (!langCode) {
      this.$langInput.prop("disabled", true);
      return;
    } else if (this.$langInput.is(":disabled"))
      this.$langInput.prop("disabled", false);

    this.selectedLanguage = LANG_PROPERTIES[langCode] || {};
    this.selectedLangCode = langCode;
    this.$langInput.val(langName || "");

    if (window.localStorage.getItem(LAST_LANG_CODE_KEY) !== langCode)
      window.localStorage.setItem(LAST_LANG_CODE_KEY, langCode);

    if (this.fullView) return;

    /** @type {string[]} */
    const properties = this.selectedLanguage.properties || [];
    for (const [code, $button] of Object.entries(this.radioButtons))
      if (properties.includes(code)) $button.parent().show();
      else $button.parent().hide();

    if (this.selectedLanguage.hasTransliteration) this.$transliterationLine.show();
    else this.$transliterationLine.hide();

    if (this.selectedLanguage.hasTraditional) this.$traditionalLine.show();
    else this.$traditionalLine.hide();
  }

  /**
   * Toggle the full form view.
   * @param fullView {boolean?} If not undefined, force the full view state.
   * @private
   */
  _toggleFullView(fullView) {
    this.fullView = typeof fullView === "boolean" ? fullView : !this.fullView;
    if (this.fullView) {
      for (const $button of Object.values(this.radioButtons))
        $button.parent().show();
      this.$transliterationLine.show();
      this.$traditionalLine.show();
      this.$pageNameLine.show();
    } else {
      const properties = this.selectedLanguage.properties || [];
      for (const [code, $button] of Object.entries(this.radioButtons))
        if (!properties.includes(code))
          $button.parent().hide();
      if (!this.selectedLanguage.hasTransliteration)
        this.$transliterationLine.hide();
      if (!this.selectedLanguage.hasTraditional)
        this.$traditionalLine.hide();
      this.$pageNameLine.hide();
    }
  }

  /**
   * Render the given wikicode.
   * @param wikicode {string} The wikicode to render.
   * @return {Promise<NodeListOf<ChildNode>>} A Promise that returns the rendered HTML elements.
   * @private
   */
  _renderWikicode(wikicode) {
    return API.get({
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
