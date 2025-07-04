/**
 * (en)
 * This gadgets adds a form inside all translation boxes
 * which allows adding translations without having to edit the page.
 * --
 * (fr)
 * Ce gadget ajoute une formulaire dans chaque boite de traductions
 * qui permet d’ajouter des traductions sans avoir à éditer la page.
 * --
 * v2.0 2025-06-01 Full rewrite of [[MediaWiki:Gadget-translation editor.js]].
 * v2.1 2025-06-03 Re-implement the editing of translation boxes’ titles.
 * v2.1.1 2025-06-21 Revert sort algorithm to use sort keys.
 * v2.2 2025-06-26 Add grammatical properties to Manx language;
 *                 fix transliteration and traditional writing fields not appearing.
 * v2.2.1 2025-07-04 Fix crash when {{T}} template has the `trier` option;
 *                   insert `trier` option when box in ”Traductions à trier” section.
 * --
 * [[Catégorie:JavaScript du Wiktionnaire|translation-editor.js]]
 */
// <nowiki>
"use strict";

/**
 * @typedef {Record<string, Translation[]>[]} GroupedEdits
 */

const { getLanguage, getLanguageName } = require("./wikt.core.languages.js");
const { EditDialog } = require("./wikt.translation-editor/dialog.js");
const {
  EditForm,
  compareLanguages,
  generateTranslationWikicode,
  generateTranslationHeaderWikicode,
} = require("./wikt.translation-editor/form.js");
const { EditHeaderForm } = require("./wikt.translation-editor/header-form.js");

console.log("Chargement de Gadget-wikt.translation-editor.js…");

const VERSION = "2.2.1";

const api = new mw.Api({ userAgent: `Gadget-wikt.translation-editor/${VERSION}` });
const dialog = new EditDialog(onSubmit, onUndo, onRedo, onCancel);
/** @type {EditForm[]} */
const forms = [];

/**
 * Called when the user clicks the button to save all edits they made.
 * @param edits {Translation[]} The edits to save.
 */
function onSubmit(edits) {
  dialog.setDisabled(true);
  forms.forEach(form => form.setDisabled(true));

  api.edit(mw.config.get("wgPageName"), (revision) => {
    const [text, summary] = applyChanges(revision.content, groupEdits(edits));
    return {
      text: text,
      summary: `Traductions\u00a0: ${summary.join("\u00a0; ")} (gadget v${VERSION})`,
    };
  }).then(() => {
    mw.notify(" Traduction(s) ajoutée(s) avec succès.", {
      type: "success",
    });
    dialog.setDisabled(false);
    forms.forEach((form) => {
      form.clearFlags();
      form.setDisabled(false);
    });
    dialog.hide();
  }).catch((error) => {
    console.warn(error);
    const message = error instanceof Error && error.message === "not_found"
        ? "Une des boites de traductions n’a pas pu être trouvée, impossible de modifier la page."
        : "Une erreur est survenue, veuillez réessayer.";
    mw.notify(message, {
      type: "error",
    });
    dialog.setDisabled(false);
    forms.forEach(form => form.setDisabled(false));
  });
}

/**
 * Group the given edits by translation box index and language code.
 * @param edits {Translation[]} The edits to group.
 * @return {GroupedEdits} The group edits.
 */
function groupEdits(edits) {
  /** @type {GroupedEdits} */
  const sortedEdits = [];

  for (const edit of edits) {
    const i = edit.boxIndex;
    if (i >= sortedEdits.length)
      for (let j = (i - sortedEdits.length); j >= 0; j--)
        sortedEdits.push({});
    const langCode = edit.langCode;
    const entries = sortedEdits[i];
    if (!entries[langCode]) entries[langCode] = [edit];
    else entries[langCode].push(edit);
  }

  return sortedEdits;
}

/**
 * Apply the given edits to the given text.
 * @param wikicode {string} The text to edit.
 * @param edits {GroupedEdits} The edits to apply.
 * @return {[string, string[]]} The edited text and an array containing the summaries of each edit.
 */
function applyChanges(wikicode, edits) {
  const lines = wikicode.split("\n");
  const summary = [];
  let boxIndex = -1;
  let isInToSortSection = false;
  let match;

  // We use an indexed for-loop as the array size may change if new lines are inserted
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("{{trad-début")) {
      boxIndex++;
      if (boxIndex >= edits.length) break;

      for (const [langCode, translations] of Object.entries(edits[boxIndex]))
        insertTranslations(i + 1, isInToSortSection, lines, langCode, translations, summary);
    } else if (match = /(=+)([^\n]+?)\1/.exec(lines[i]))
      isInToSortSection = /{{\s*S\s*\|\s*(traductions à trier|trad[ -]trier)\s*}}/.test(match[2].trim());
  }

  if (boxIndex < edits.length - 1) throw new Error("not_found");

  return [lines.join("\n"), summary];
}

/**
 * Insert the given translations in the box starting at the given index.
 * @param start {number} The index of the first line of the box’s content.
 * @param isInToSortSection {boolean} Whether the translations are in a “Traductions à trier” (translations to sort) section.
 * @param lines {string[]} The page’s lines.
 * @param langCode {string} The translations’ language code.
 * @param translations {Translation[]} The translations to insert.
 * @param summary {string[]} An array to update with the edit summary.
 */
function insertTranslations(start, isInToSortSection, lines, langCode, translations, summary) {
  let i = start;

  function insertLine() {
    const header = generateTranslationHeaderWikicode(langCode, isInToSortSection);
    const transWithoutComma = buildTranslationsLine(translations, summary).substring(2);
    lines.splice(i, 0, `* ${header}${transWithoutComma}`);
  }

  while (!lines[i].startsWith("{{trad-fin")) {
    const match = /{{T\|([^|}]+)(?:\|[^}]*)?}}/.exec(lines[i]);
    if (!match) continue;

    const lineLangCode = match[1].trim();
    if (lineLangCode === langCode) {
      lines[i] += buildTranslationsLine(translations, summary);
      return;
    } else {
      const lang1 = getLanguage(langCode);
      const lang2 = getLanguage(lineLangCode);
      const langName1 = lang1.sortKey || lang1.name;
      const langName2 = lang2.sortKey || lang2.name;
      if (compareLanguages(langName1, langName2) < 0) {
        insertLine();
        return;
      }
    }

    i++;
  }

  insertLine();
}

/**
 * Generate the wikicode for the given list of translations.
 * @param translations {Translation[]} A list of translations.
 * @param summary {string[]} An array to update with the edit summary.
 * @return {string} The generated wikicode.
 */
function buildTranslationsLine(translations, summary) {
  let line = "";
  for (const translation of translations) {
    const { word, langCode } = translation;
    line += generateTranslationWikicode(translation);
    summary.push(`+ ${getLanguageName(langCode)} [[${word}#${langCode}|${word}]]`);
  }
  return line;
}

/**
 * Called when the user clicks the undo button.
 * @param edit {Translation} The edit to undo.
 */
function onUndo(edit) {
  forms[edit.boxIndex].removeTranslation(edit);
}

/**
 * Called when the user clicks the redo button.
 * @param edit {Translation} The edit to redo.
 */
function onRedo(edit) {
  forms[edit.boxIndex].insertTranslation(edit);
}

/**
 * Called when the user clicks the cancel button.
 */
function onCancel() {
  forms.forEach((form) => form.clear());
}

document.body.append(dialog.html);
document.querySelectorAll(".translations").forEach((div, i) => {
  const $div = $(div);
  const frame = $div.parents(".NavFrame")[0];
  const header = frame.querySelector(".NavHead");
  const headerForm = new EditHeaderForm(i, header, api);
  header.prepend(headerForm.html, " ");
  const form = new EditForm(i, div, dialog, api);
  forms.push(form);
  const container = $div.parents(".NavContent")[0];
  container.append(form.html);
});
// </nowiki>
