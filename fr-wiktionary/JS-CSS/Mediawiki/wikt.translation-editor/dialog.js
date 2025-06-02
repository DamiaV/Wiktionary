// [[Catégorie:JavaScript du Wiktionnaire|translation-editor/dialog.js]]
// <nowiki>
"use strict";

/**
 * The edit dialog for [[MediaWiki:Gadget-wikt.translation-editor.js]].
 */
class EditDialog {
  /**
   * Create a new edit dialog.
   * @param onSubmit {function(Translation[]): void} The function to call when the submit button is clicked.
   * @param onUndo {(Translation) => void} The function to call when the undo button is clicked.
   * @param onRedo {(Translation) => void} The function to call when the redo button is clicked.
   * @param onCancel {() => void} The function to call when the cancel button is clicked and this dialog has closed.
   */
  constructor(onSubmit, onUndo, onRedo, onCancel) {
    /**
     * @type {Translation[]}
     * @private
     */
    this._editHistory = [];
    /**
     * @private
     */
    this._editCursor = -1;
    /**
     * @private
     */
    this._disabled = false;

    const _HIDE_MESSAGE_KEY = "trans-editor-hide-message";

    const box = document.createElement("div");
    box.id = "trans-dialog";

    const closeButton = document.createElement("a");
    closeButton.id = "td-close-button";
    closeButton.href = "#";
    closeButton.textContent = "×";
    closeButton.title = "Fermer et annuler toutes les modifications";
    closeButton.onclick = (e) => {
      e.preventDefault();
      if (this._disabled) return;
      this.hide();
      onCancel();
    };
    box.append(closeButton);

    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.id = "td-buttons";
    box.append(buttonsWrapper);

    /**
     * @private
     */
    this._submitButton = document.createElement("button");
    this._submitButton.textContent = "Enregistrer les modifications";
    this._submitButton.onclick = () => {
      onSubmit(this._editHistory.slice(0, this._editCursor + 1));
    };
    buttonsWrapper.append(this._submitButton);

    buttonsWrapper.append(document.createElement("br"));

    /**
     * @private
     */
    this._undoButton = document.createElement("button");
    this._undoButton.textContent = "← Annuler";
    this._undoButton.onclick = () => {
      const edit = this._editHistory[this._editCursor--];
      this._updateButtons();
      onUndo(edit);
    };
    buttonsWrapper.append(this._undoButton);

    buttonsWrapper.append(" ");

    /**
     * @private
     */
    this._redoButton = document.createElement("button");
    this._redoButton.textContent = "Rétablir →";
    this._redoButton.onclick = () => {
      const edit = this._editHistory[++this._editCursor];
      this._updateButtons();
      onRedo(edit);
    };
    buttonsWrapper.append(this._redoButton);

    const shouldHideMessage = window.localStorage.getItem(_HIDE_MESSAGE_KEY);
    if (!shouldHideMessage) {
      const messageBox = document.createElement("div");
      messageBox.id = "td-message-box";
      box.append(messageBox);

      const messageWrapper = document.createElement("div");
      messageWrapper.id = "td-message";
      messageWrapper.append("Vous pouvez continuer d’ajouter des traductions. " +
          "Quand vous aurez réalisé toutes les modifications désirées, pensez à les enregistrer.")

      const hideMessagePermanentlyButton = document.createElement("a");
      hideMessagePermanentlyButton.id = "td-hide-message-permanently-button";
      hideMessagePermanentlyButton.href = "#";
      hideMessagePermanentlyButton.textContent = "Ne plus afficher ce message";
      hideMessagePermanentlyButton.onclick = (e) => {
        e.preventDefault();
        messageBox.style.display = "none";
        window.localStorage.setItem(_HIDE_MESSAGE_KEY, "true");
      };

      const hideMessageButton = document.createElement("a");
      hideMessageButton.id = "td-hide-message-button";
      hideMessageButton.href = "#";
      hideMessageButton.textContent = "×";
      hideMessageButton.title = "Cacher ce message";
      hideMessageButton.onclick = (e) => {
        e.preventDefault();
        messageBox.style.display = "none";
      };

      messageBox.append(hideMessageButton, messageWrapper, hideMessagePermanentlyButton);
    }

    /**
     * @private
     */
    this._html = box;

    window.onbeforeunload = (e) => {
      if (this.isVisible()) e.preventDefault();
    };

    this.hide();
  }

  /**
   * The HTML element for this dialog.
   * @return {HTMLElement}
   */
  get html() {
    return this._html;
  }

  /**
   * Push a new edit onto the history after the cursor’s current position.
   * All edits after the cursor’s current position are discarded before the new edit is pushed.
   * @param edit {Translation} The edit to push onto the history.
   */
  pushEdit(edit) {
    if (this._editCursor < this._editHistory.length - 1)
      this._editHistory.splice(this._editCursor + 1);
    this._editHistory.push(edit);
    this._editCursor++;
    this._updateButtons();
  }

  /**
   * Show this dialog.
   */
  show() {
    this._html.style.display = "block";
  }

  /**
   * Hide this dialog.
   * This resets the edit history.
   */
  hide() {
    this._html.style.display = "none";
    this._editHistory = [];
    this._editCursor = -1;
    this._updateButtons();
  }

  /**
   * Check whether this dialog is visible.
   * @return {boolean} True if it is visible, false otherwise.
   */
  isVisible() {
    return this._html.style.display !== "none";
  }

  /**
   * Disable the buttons of this dialog.
   * @param disabled {boolean} True to disable, false to re-enable.
   */
  setDisabled(disabled) {
    if (this._disabled === disabled) return;

    this._disabled = disabled;

    if (disabled) {
      this._submitButton.disabled = true;
      this._undoButton.disabled = true;
      this._redoButton.disabled = true;
    } else this._updateButtons();
  }

  /**
   * Update the state of the submit, undo, and redo buttons.
   * @private
   */
  _updateButtons() {
    const empty = this._editCursor === -1;
    this._submitButton.disabled = empty;
    this._undoButton.disabled = empty;
    this._redoButton.disabled = this._editCursor === this._editHistory.length - 1;
  }
}

module.exports = { EditDialog };
// </nowiki>
