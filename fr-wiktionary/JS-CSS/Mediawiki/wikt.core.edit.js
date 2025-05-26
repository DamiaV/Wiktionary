/**
 * Returns the edit box as a jQuery object.
 * @return {{wikiEditor?: function}|null} The jQuery element corresponding
 * to the edit box or null if it could not be found.
 */
function getEditBox() {
  const $editBox = $("#wpTextbox1");
  return $editBox.length ? $editBox : null;
}

/**
 * Gets the text from the edit textarea.
 * Supports syntax coloring.
 * @param $textInput {*?} The text input or textarea to use instead of the main edit box.
 * @return {string|null}
 */
function getEditAreaText($textInput) {
  const $editBox = $textInput || getEditBox();
  return $editBox ? $editBox.val() : null;
}

/**
 * Sets the text in the edit textarea.
 * Supports syntax coloring.
 * @param text {string} The text to set.
 * @param $textInput {*?} The text input or textarea to use instead of the main edit box.
 */
function setEditAreaText(text, $textInput) {
  const $editBox = $textInput || getEditBox();
  if ($editBox) $editBox.val(text);
}

/**
 * Inserts the given text at the specified position in the edit area.
 * Supports syntax coloring.
 * @param index {number} The index at which the text is to be inserted.
 * @param text {string} The text to insert.
 * @param $textInput {*?} The text input or textarea to use instead of the main edit box.
 */
function insertTextInEditArea(index, text, $textInput) {
  const $editBox = $textInput || getEditBox();
  if ($editBox) {
    const currentText = $editBox.val();
    const newText = currentText.substring(0, index) + text + currentText.substring(index);
    $editBox.val(newText);
  }
}

/**
 * Replaces the text between the given positions in the edit area.
 * Supports syntax coloring.
 * @param startIndex {number} The start index at which the text is to be inserted.
 * @param endIndex {number} The end index at which the text is to be inserted.
 * @param text {string} The text to insert.
 * @param $textInput {*?} The text input or textarea to use instead of the main edit box.
 */
function replaceEditAreaText(startIndex, endIndex, text, $textInput) {
  const $editBox = $textInput || getEditBox();
  if ($editBox) {
    // noinspection JSUnresolvedFunction
    const currentText = $editBox.val();
    const newText = currentText.substring(0, startIndex) + text + currentText.substring(endIndex);
    // noinspection JSUnresolvedFunction
    $editBox.val(newText);
  }
}

/**
 * Fetches then returns the current location of the text cursor inside the edit box.
 * @param $textInput {*?} The text input or textarea to use instead of the main edit box.
 * @return {number} The index from the start of the text or -1 if it could not be determined.
 */
function getCursorLocation($textInput) {
  const $editBox = $textInput || getEditBox();
  if ($editBox) {
    if (isCodeMirrorInput($editBox) && isCodeMirrorEnabled())
        // noinspection JSUnresolvedFunction
      return getCodeMirror().indexFromPos(getCodeMirror().getCursor());
    // noinspection JSUnresolvedFunction
    return $editBox.get(0).selectionStart;
  }
  return -1;
}

/**
 * Sets the location of the text cursor inside the edit box.
 * @param position {number} The location.
 * @param $textInput {*?} The text input or textarea to use instead of the main edit box.
 */
function setCursorLocation(position, $textInput) {
  const $editBox = $textInput || getEditBox();
  if ($editBox) {
    if (isCodeMirrorInput($editBox) && isCodeMirrorEnabled())
        // noinspection JSUnresolvedFunction
      getCodeMirror().setCursor(getCodeMirror().posFromIndex(position));
    else {
      // noinspection JSUnresolvedFunction
      $editBox.get(0).selectionStart = position;
      // noinspection JSUnresolvedFunction
      $editBox.get(0).selectionEnd = position;
    }
  }
}

/**
 * Selects text the edit box between start and end positions.
 * @param start {number} The start location.
 * @param end {number} The end location.
 * @param $textInput {*?} The text input or textarea to use instead of the main edit box.
 */
function setSelection(start, end, $textInput) {
  const $editBox = $textInput || getEditBox();
  if ($editBox) {
    if (isCodeMirrorInput($editBox) && isCodeMirrorEnabled()) {
      // noinspection JSUnresolvedFunction
      getCodeMirror().setSelection(
          getCodeMirror().posFromIndex(start),
          getCodeMirror().posFromIndex(end)
      );
    } else {
      // noinspection JSUnresolvedFunction
      $editBox.get(0).selectionStart = start;
      // noinspection JSUnresolvedFunction
      $editBox.get(0).selectionEnd = end;
    }
  }
}

/**
 * Returns the indices of currently selected lines in the edit box.
 * @param $textInput {*?} The text input or textarea to use instead of the main edit box.
 * @return {[number, number]} An array containing line start and end indices for the current selection.
 */
function getSelectedLineNumbers($textInput) {
  const $editBox = $textInput || getEditBox();
  let start, end;

  if (isCodeMirrorInput($editBox) && isCodeMirrorEnabled()) {
    // noinspection JSUnresolvedFunction
    start = getCodeMirror().getCursor("from").line;
    // noinspection JSUnresolvedFunction
    end = getCodeMirror().getCursor("to").line;
  } else {
    const text = getEditAreaText($editBox);
    // noinspection JSUnresolvedFunction
    start = text.substring(0, $editBox.get(0).selectionStart).split("\n").length - 1;
    // noinspection JSUnresolvedFunction
    end = text.substring(0, $editBox.get(0).selectionEnd).split("\n").length - 1;
  }

  return [start, end];
}

/**
 * Selects the lines between start and end indices.
 * @param start {number} Start line index.
 * @param end {number?} End line index.
 * @param $textInput {*?} The text input or textarea to use instead of the main edit box.
 */
function selectLines(start, end, $textInput) {
  const $editBox = $textInput || getEditBox();
  if (!end) end = start;
  let s, e;

  if (isCodeMirrorInput($editBox) && isCodeMirrorEnabled()) {
    // noinspection JSUnresolvedFunction
    s = getCodeMirror().indexFromPos({ line: start, ch: 0 });
    // noinspection JSUnresolvedFunction
    e = getCodeMirror().indexFromPos({ line: end, ch: getCodeMirror().getLine(end).length });
  } else {
    const text = getEditAreaText();
    s = text.split("\n").slice(0, start).join("\n").length + 1;
    e = text.split("\n").slice(0, end + 1).join("\n").length;
  }

  setSelection(s, e);
}

/**
 * Returns the currently selected text in the edit box.
 * @param $textInput {*?} The text input or textarea to use instead of the main edit box.
 * @return {string} The selected text.
 */
function getSelectedText($textInput) {
  const $editBox = $textInput || getEditBox();

  if (isCodeMirrorInput($editBox) && isCodeMirrorEnabled())
    return getCodeMirror().getSelection();

  const start = $editBox.get(0).selectionStart;
  const end = $editBox.get(0).selectionEnd;
  return $editBox.val().substring(start, end);
}

/**
 * Replaces the currently selected text in the edit box by the given one.
 * @param replacement {string} The replacement text.
 * @param $textInput {*?} The text input or textarea to use instead of the main edit box.
 */
function replaceSelectedText(replacement, $textInput) {
  const $editBox = $textInput || getEditBox();

  if (isCodeMirrorInput($editBox) && isCodeMirrorEnabled()) {
    // noinspection JSUnresolvedFunction
    getCodeMirror().replaceSelection(replacement);
  } else {
    const start = $editBox.get(0).selectionStart;
    const end = $editBox.get(0).selectionEnd;
    const text = $editBox.val();
    $editBox.val(text.substring(0, start) + replacement + text.substring(end));
  }
}

/**
 * Indicates whether the toolbar is enabled.
 * @return {boolean} True if the toolbar is enabled.
 */
function isEditToolbarEnabled() {
  return !!getEditBox().wikiEditor;
}

/**
 * Returns the toolbar if enabled.
 * @return {*|null} The toolbar or null if it is disabled.
 */
function getToolbar() {
  return isEditToolbarEnabled() ? getEditBox().wikiEditor() : null;
}

/**
 * Indicates whether syntax coloring is enabled.
 * @return {boolean} True if syntax coloring is enabled.
 */
function isCodeMirrorEnabled() {
  return $(".CodeMirror").length !== 0;
}

let codeMirrorSingleton = null;

/**
 * Returns the handle to CodeMirror.
 * @return {*} CodeMirror handle.
 */
function getCodeMirror() {
  // Caching CodeMirror for quicker repeated access.
  if (!codeMirrorSingleton)
    codeMirrorSingleton = $(".CodeMirror").prop("CodeMirror");
  return codeMirrorSingleton;
}

/**
 * Indicates whether the given element is the edit box used by CodeMirror.
 * @param {*} $elem The element to check.
 * @return {boolean} True if the element is used by CodeMirror.
 */
function isCodeMirrorInput($elem) {
  const $editBox = getEditBox();
  // noinspection JSUnresolvedFunction
  return $elem && $editBox && $elem.attr("id") === $editBox.attr("id");
}

/**
 * Returns the edit summary field.
 * @return {*} The edit summary field.
 */
function getEditSummaryField() {
  return $("#wpSummary");
}

/**
 * This module defines function to interact with the edit form’s fields.
 * [[Catégorie:JavaScript du Wiktionnaire|core.edit.js]]
 */
module.exports = {
  getEditBox,
  getEditAreaText,
  setEditAreaText,
  insertTextInEditArea,
  replaceEditAreaText,
  getCursorLocation,
  setCursorLocation,
  setSelection,
  getSelectedLineNumbers,
  selectLines,
  getSelectedText,
  replaceSelectedText,
  isEditToolbarEnabled,
  getToolbar,
  isCodeMirrorEnabled,
  getCodeMirror,
  getEditSummaryField,
};
