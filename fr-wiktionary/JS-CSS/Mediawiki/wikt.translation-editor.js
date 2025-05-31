// [[Catégorie:JavaScript du Wiktionnaire|translation-editor.js]]
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

const { getLanguageToCodeMap, getLanguageName, getLanguage } = require("./wikt.core.languages.js");
const { EditDialog } = require("./wikt.translation-editor/dialog.js");
/** @type {{[code: string]: LangProperties}} */
const langProperties = require("./wikt.translation-editor/lang-properties.json");
const langsNameToCode = getLanguageToCodeMap();

console.log("Chargement de Gadget-wikt.translation-editor.js…");

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
const dialog = new EditDialog(onSubmit, onUndo, onRedo, onCancel);

/**
 * Create a new form for the translations box at the given index.
 * @param index {number} The index of the associated translations box.
 * @param translationsDiv {HTMLDivElement} The DIV tag containing the list of translations.
 * @return {jQuery} The newly created form.
 */
function createForm(index, translationsDiv) {
  /** @type {LangProperties} */
  let selectedLanguage = {};
  /** @type {string|null} */
  let selectedLangCode = null;
  let fullView = false;

  /** @type {HTMLUListElement|null} */
  let list = translationsDiv.querySelector("ul");
  if (!list) {
    list = document.createElement("ul");
    translationsDiv.append(list);
  }
  // Assign to a new constant to avoid accidental re-assignment
  const translationsList = list;

  const $form = $(`<form class="translation-editor" data-trans-form-index="${index}">`);
  const $langInput = $(`<input type="text" size="12" id="lang-input-${index}" placeholder="Langues">`);
  const $translationInput = $(`<input type="text" id="trans-input-${index}" placeholder="Traduction">`);
  const $transliterationInput = $(`<input type="text" id="translit-input-${index}" placeholder="ex : khimera pour химера">`);
  const $traditionalInput = $(`<input type="text" id="tradit-input-${index}" placeholder="ex : 軍團 pour 군단">`);
  const $pageNameInput = $(`<input type="text" id="page-name-input-${index}" placeholder="ex : amo pour amō">`);
  const $submitButton = $(`<button type="submit">Ajouter</button>`);
  const $showMoreButton = $(`<a href="#">Plus</a>`);
  /** @type {Record<string, Object>} */
  const radioButtons = {};

  // TODO autosuggestions
  $langInput.on("focusout", () => {
    onLanguageSelect($langInput.val().trim());
  });

  $showMoreButton.on("click", (e) => {
    e.preventDefault();
    toggleFullView();
  });

  const $translationLine = $("<p>");
  $translationLine.append(
      `<label for="lang-input-${index}">Ajouter une traduction en</label> `,
      $langInput,
      "&nbsp;: ",
      $translationInput,
      " ",
      $submitButton,
      " ",
      $showMoreButton
  );

  const $grammarPropsLine = $("<p>");
  let firstEntry = true;
  for (const [code, label] of Object.entries(GRAMMATICAL_PROPERTIES)) {
    const id = `grammar-prop-${code}-${index}`;
    const $button = $(`<input id="${id}" type="radio" name="grammar-prop">`);
    radioButtons[code] = $button;
    if (!firstEntry) $grammarPropsLine.append(" ");
    else firstEntry = false;
    const $container = $('<span>');
    $container.append($button, ` <label for="${id}">${label}</label>`);
    $grammarPropsLine.append($container);
  }

  const $transliterationLine = $("<p>");
  $transliterationLine.append(
      `<label for="translit-input-${index}">Translittération&nbsp;:</label> `,
      $transliterationInput
  );

  const $traditionalLine = $("<p>");
  $traditionalLine.append(
      `<label for="tradit-input-${index}">Écriture traditionnelle&nbsp;:</label> `,
      $traditionalInput
  );

  const $pageNameLine = $("<p>");
  const helpText = "Si la traduction ne correspond pas à un nom de page valide sur le Wiktionnaire, " +
      "il est possible de préciser le nom de page à utiliser ici (le lien sur la traduction visera alors cette page).";
  $pageNameLine.append(
      `<label for="page-name-${index}">Nom de la page&nbsp;:</label> `,
      `<sup class="trans-form-help" title="${helpText}">(?)</sup> `,
      $pageNameInput
  );

  $form.append($translationLine, $grammarPropsLine, $transliterationLine, $traditionalLine, $pageNameLine);

  $form.submit((e) => {
    e.preventDefault();

    const translation = $translationInput.val().trim();
    if (!selectedLanguage.expectsUpperCase) {
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
    for (const [code, $button] of Object.entries(radioButtons)) {
      if ($button.is(":visible") && $button.prop("checked")) {
        grammarProperty = code;
        break;
      }
    }

    /** @type {Translation} */
    const edit = {
      boxIndex: index,
      langCode: selectedLangCode,
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

    externalPageExists(
        edit.langCode,
        edit.word,
        (exists) => insertTranslation(edit, exists),
        () => insertTranslation(edit)
    );
  });

  /**
   * Insert the given translation into the HTML list.
   * @param translation {Translation} The translation to insert.
   * @param exists {boolean?} Indicate whether the page exists on the target wiki (true) or not (false).
   * If undefined, no wiki exists for the language code.
   */
  function insertTranslation(translation, exists) {
    let plusMinus = exists === undefined ? "" : exists ? "+" : "-";
    let transWikicode = `, {{trad${plusMinus}|${translation.langCode}|${translation.word}`;
    if (translation.grammarProperty) transWikicode += `|${translation.grammarProperty}`;
    if (translation.transliteration) transWikicode += `|tr=${translation.transliteration}`;
    if (translation.traditional) transWikicode += `|tradi=${translation.traditional}`;
    if (translation.pageName) transWikicode += `|dif=${translation.pageName}`;
    transWikicode += "}}";

    const wrapper = document.createElement("span");
    wrapper.classList.add("trans-new-item");
    wrapper.setAttribute("data-trans-word", escapeHTML(translation.word));

    renderWikicode(transWikicode)
        .then((elements) => {
          Array.from(elements).forEach((element) => {
            wrapper.append(element);
          });

          const line = findTranslationLineInHTML(translation.langCode);
          if (line) {
            line.append(wrapper);
            pushTranslation(translation);
          } else {
            const newLine = document.createElement("li");
            newLine.classList.add("trans-new-line");

            renderWikicode(`{{T|${translation.langCode}}} : `)
                .then((elements) => {
                  Array.from(elements).forEach((element) => {
                    newLine.append(element);
                  });
                  newLine.append(wrapper);
                  // TODO insert newLine
                  pushTranslation(translation);
                })
                .catch(() => alert("Une erreur est survenue, veuillez réessayer."));
          }
        })
        .catch(() => alert("Une erreur est survenue, veuillez réessayer."));
  }

  /**
   * Push a translation onto the edit dialog’s history.
   * @param translation {Translation}
   */
  function pushTranslation(translation) {
    dialog.pushEdit(translation);
    if (!dialog.isVisible()) dialog.show();
  }

  /**
   * Remove the given translation from the HTML list.
   * @param translation {Translation} The translation to insert.
   */
  function removeTranslation(translation) {
    const line = findTranslationLineInHTML(translation.langCode);
    if (!line) return;
    const word = escapeHTML(translation.word);
    const element = line.querySelector(`.trans-item[data-trans-word="${word}"]`);
    if (element) element.remove();
    // Line ends up empty, deleted it
    if (!line.querySelector(".trans-item")) line.remove();
  }

  /**
   * @param langCode {string}
   * @return {HTMLLIElement|null}
   */
  function findTranslationLineInHTML(langCode) {
    for (const childNode of translationsList.children)
      if (childNode.tagName === "LI" && childNode.querySelector(`.trad-${langCode}`))
        return childNode;
    return null;
  }

  /**
   * @param langNameOrCode {string}
   */
  function onLanguageSelect(langNameOrCode) {
    let langCode, langName;

    if (langName = getLanguageName(langNameOrCode))
      langCode = langNameOrCode;
    else if (langCode = langsNameToCode.get(langNameOrCode))
      langName = langNameOrCode;

    selectedLanguage = langProperties[langCode] || {};
    selectedLangCode = langCode;
    $langInput.val(langName || "");
    if (window.localStorage.getItem(LAST_LANG_CODE_KEY) !== langCode)
      window.localStorage.setItem(LAST_LANG_CODE_KEY, langCode);

    if (fullView) return;

    /** @type {string[]} */
    const properties = selectedLanguage.properties || [];
    for (const [code, $button] of Object.entries(radioButtons))
      if (properties.includes(code)) $button.parent().show();
      else $button.parent().hide();

    if (selectedLanguage.hasTransliteration) $transliterationLine.show();
    else $transliterationLine.hide();

    if (selectedLanguage.hasTraditional) $traditionalLine.show();
    else $traditionalLine.hide();
  }

  /**
   * @param show {boolean?}
   */
  function toggleFullView(show) {
    fullView = show !== undefined ? show : !fullView;
    if (fullView) {
      for (const $button of Object.values(radioButtons))
        $button.parent().show();
      $transliterationLine.show();
      $traditionalLine.show();
      $pageNameLine.show();
    } else {
      const properties = selectedLanguage.properties || [];
      for (const [code, $button] of Object.entries(radioButtons))
        if (!properties.includes(code))
          $button.parent().hide();
      if (!selectedLanguage.hasTransliteration)
        $transliterationLine.hide();
      if (!selectedLanguage.hasTraditional)
        $traditionalLine.hide();
      $pageNameLine.hide();
    }
  }

  toggleFullView(false);
  const storedLangCode = window.localStorage.getItem(LAST_LANG_CODE_KEY);
  if (storedLangCode) onLanguageSelect(storedLangCode.trim());

  return $form;
}

/**
 * Render the given wikicode.
 * @param wikicode {string} The wikicode to render.
 * @return {Promise<NodeListOf<ChildNode>>} A Promise that returns the rendered HTML elements.
 */
function renderWikicode(wikicode) {
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
 */
function escapeHTML(word) {
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
 */
function externalPageExists(langCode, page, onSuccess, onFail) {
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
 * Called when the user clicks the button to save all edits they made.
 * @param edits {Translation[]} The edits to save.
 */
function onSubmit(edits) {
  // TODO edit page’s wikicode
  // TODO remove all wrapper spans and tagging classes
  dialog.hide();
}

/**
 * Called when the user clicks the undo button.
 * @param edit {Translation} The edit to undo.
 */
function onUndo(edit) {
  // TODO
}

/**
 * Called when the user clicks the redo button.
 * @param edit {Translation} The edit to redo.
 */
function onRedo(edit) {
  // TODO
}

/**
 * Called when the user clicks the cancel button.
 */
function onCancel() {
  // TODO remove all wrapped elements
}

document.body.append(dialog.html);
document.querySelectorAll(".translations").forEach((div, i) => {
  const $container = $(div).parents(".NavContent");
  $container.append(createForm(i, div));
});
