"use strict";

/**
 * @typedef {{
 *  boxIndex: number,
 *  langCode: string,
 *  text: string,
 *  transliteration?: string,
 *  traditional?: string,
 *  grammaticalProperty?: string,
 * }} Translation
 *
 * @typedef {{[lang: string]: string}} LangProperties
 */


const { getLanguages } = require("./wikt.core.languages");
/** @type {LangProperties} */
const langProperties = require("./wikt.translation-editor/lang-properties.json");

const grammaticalProperties = {
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
  mfp: "masc. & fém. pluriel"
};
const expectFirstLetterUpperCase = [
  "allemand",
  "alémanique alsacien",
  "vieux-francique",
  "francique mosellan",
  "francique rhénan",
  "francique ripuaire",
  "luxembourgeois"
];

/** @type {Translation[]} */
const editHistory = [];

$(".translations").each((i, div) => {
  const $container = $(div).parents(".NavContent");
  $container.append(createForm(i));
});

/**
 * Create a new form for the translations box at the given index.
 * @param index {number} The index of the associated translations box.
 * @returns {jQuery} The newly created form.
 */
function createForm(index) {
  const $form = $(`<form class="translation-editor" data-trans-form-index="${index}">`);

  const $langInput = $(`<input type="text" size="12" id="lang-input-${index}">`);
  const $translationInput = $(`<input type="text" id="lang-input-${index}">`);
  const $submitButton = $(`<button type="submit">Ajouter</button>`);
  const $showMoreButton = $(`<a href="#">Plus</a>`);
  const $radioButtons = {};

  const $firstLine = $("<p>");

  $firstLine.append(
      `<label for="lang-input-${index}">Ajouter une traduction en </label>`,
      $langInput,
      "\u00a0: ",
      $translationInput,
      " ",
      $submitButton,
      " ",
      $showMoreButton
  );

  const $secondLine = $("<p>");
  let firstEntry = true;
  for (const [code, label] of Object.entries(grammaticalProperties)) {
    const id = `grammar-prop-${code}-${index}`;
    const $button = $(`<input id="${id}" type="radio" name="grammar-prop">`);
    $radioButtons[code] = $button;
    if (!firstEntry) {
      $secondLine.append(" ");
      firstEntry = false;
    }
    $secondLine.append($button, ` <label for="${id}">${label}</label>`);
  }

  $form.append($firstLine, $secondLine);

  $form.submit((e) => {
    e.preventDefault();
    // TODO
  });

  return $form;
}
