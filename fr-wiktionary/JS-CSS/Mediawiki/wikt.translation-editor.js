// [[Catégorie:JavaScript du Wiktionnaire|translation-editor.js]]
"use strict";

const { EditDialog } = require("./wikt.translation-editor/dialog.js");
const { EditForm } = require("./wikt.translation-editor/form.js");

console.log("Chargement de Gadget-wikt.translation-editor.js…");

const api = new mw.Api({ userAgent: "Gadget-wikt.translation-editor" });
const dialog = new EditDialog(onSubmit, onUndo, onRedo, onCancel);
/** @type {EditForm[]} */
const forms = [];

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
  const form = new EditForm(i, div, dialog, api);
  forms.push(form);
  /** @type {HTMLElement} */
  const container = $(div).parents(".NavContent")[0];
  container.append(form.html);
});
