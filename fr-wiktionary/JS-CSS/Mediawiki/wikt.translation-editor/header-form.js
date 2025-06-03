// [[Catégorie:JavaScript du Wiktionnaire|translation-editor/header-form.js]]
// <nowiki>
"use strict";

class EditHeaderForm {
  /**
   * Create a new form to edit the given translation box header.
   * @param index {number} The box’s index.
   * @param headerDiv {HTMLDivElement} The header to edit.
   * @param api {mw.Api} The gadget’s API instance.
   */
  constructor(index, headerDiv, api) {
    /**
     * @type {number}
     * @private
     */
    this._index = index;
    /**
     * @type {mw.Api}
     * @private
     */
    this._api = api;
    /**
     * @type {HTMLElement}
     * @private
     */
    this._headerTitle = headerDiv.querySelector(".nav-head-title > b > i");
    /**
     * @type {HTMLElement}
     * @private
     */
    this._headerNumber = headerDiv.querySelector(".nav-head-number");

    const form = document.createElement("form");
    form.classList.add("trans-box-title-editor");

    const toggleButton = document.createElement("a");
    toggleButton.textContent = "±";
    toggleButton.title = "Modifier le titre de la boite";

    /**
     * @type {HTMLSpanElement}
     * @private
     */
    this._wrapper = document.createElement("span");
    this._wrapper.style.display = "none"; // Hidden by default

    /**
     * @type {HTMLInputElement}
     * @private
     */
    this._titleInput = document.createElement("input");
    this._titleInput.type = "text";
    this._titleInput.placeholder = "Titre";
    this._titleInput.name = "title"
    this._titleInput.size = 40;
    this._titleInput.value = this._headerTitle.textContent.trim();
    this._titleInput.onclick = (e) => e.stopPropagation();
    this._titleInput.onchange = () => this._updateSubmitButton();

    /**
     * @type {HTMLInputElement}
     * @private
     */
    this._numberInput = document.createElement("input");
    this._numberInput.type = "text";
    this._numberInput.placeholder = "Numéro";
    this._numberInput.name = "number";
    this._numberInput.size = 5;
    this._numberInput.value = this._headerNumber.textContent.trim().slice(1, -1); // Remove enclosing ( )
    this._numberInput.onclick = (e) => e.stopPropagation();
    this._numberInput.onchange = () => this._updateSubmitButton();

    /**
     * @type {HTMLInputElement}
     * @private
     */
    this._submitButton = document.createElement("input");
    this._submitButton.type = "submit";
    this._submitButton.value = "Valider";
    this._submitButton.onclick = (e) => e.stopPropagation();

    /**
     * @type {HTMLImageElement}
     * @private
     */
    this._spinner = document.createElement("img");
    this._spinner.src = "https://upload.wikimedia.org/wikipedia/commons/7/7a/Ajax_loader_metal_512.gif";
    this._spinner.alt = "loading";
    this._spinner.classList.add("trans-spinner");
    this._spinner.style.display = "none";

    form.onsubmit = (e) => {
      e.preventDefault();
      this._submit();
    };

    toggleButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._setVisible(this._wrapper.style.display === "none");
    }

    this._wrapper.append(
        this._titleInput,
        " ",
        this._numberInput,
        " ",
        this._submitButton,
        " ",
        this._spinner
    );
    form.append(toggleButton, " ", this._wrapper);

    this._updateSubmitButton();

    this._html = form;
  }

  /**
   * The HTML element for this form.
   * @returns {HTMLFormElement}
   */
  get html() {
    return this._html;
  }

  /**
   * Edit the page using the form’s data.
   * @private
   */
  _submit() {
    const title = this._titleInput.value.trim();
    const number = this._numberInput.value.trim();

    this._setDisabled(true);
    this._api.edit(mw.config.get("wgPageName"), (revision) => {
      const index = this._index + 1;
      let message;
      if (!title && !number) message = `/* Traductions */ Suppression du titre de la boite nº${index}`
      else {
        const s = number ? `${title} (${number})` : title;
        message = `/* Traductions */ Modification du titre de la boite nº${index}\u00a0: «\u00a0${s}\u00a0»`;
      }
      return {
        text: this._replaceTitle(title, number, revision.content),
        summary: message,
      }
    }).then(() => {
      this._headerTitle.textContent = title;
      this._headerNumber.textContent = number ? `(${number})` : "";
      this._setDisabled(false);
      this._setVisible(false);
      mw.notify("Titre modifié avec succès.", {
        type: "success",
      });
    }).catch((error) => {
      console.warn(error);
      this._setDisabled(false);
      const message = error instanceof Error && error.message === "not_found"
          ? "La boite de traductions n’a pas été trouvée, impossible de modifier la page."
          : "Une erreur est survenue, veuillez réessayer.";
      mw.notify(message, {
        type: "error",
      });
    });
  }

  /**
   * Replace the title and number of the translation box associated to this form.
   * @param title {string} The new title.
   * @param number {string} The new number.
   * @param content {string} The page’s wikicode.
   * @return {string} The new wikicode.
   * @private
   */
  _replaceTitle(title, number, content) {
    const lines = content.split("\n");
    let boxIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = /{{trad-début(\|[^{}]*)?}}/.exec(line);
      if (match) {
        boxIndex++;
        if (boxIndex === this._index) {
          // slice because capture group has a leading |
          const args = this._replaceArgs(match[0].split("|").slice(1), title, number);
          const s = args.join("|").replace(/\|+$/, "");
          lines[i] = s ? `{{trad-début|${s}}}` : "{{trad-début}}";
          break;
        }
      }
    }
    if (boxIndex > this._index) throw new Error("not_found");
    return lines.join("\n");
  }

  /**
   * Replace the first and second positional arguments in the given list.
   * @param args {string[]} The arguments list.
   * @param title {string} The title to set as the first positional argument.
   * @param number {string} The number to set as the second positional argument.
   * @returns {string[]} The updated arguments list.
   * @private
   */
  _replaceArgs(args, title, number) {
    let argI = 0, firstArgI = 0;

    // Try to replace the first an second positional arguments
    for (let i = 0; i < args.length; i++) {
      if (!args[i].includes("=")) {
        if (argI === 0) {
          args[i] = title;
          firstArgI = i;
          argI++;
        } else if (argI === 1) {
          args[i] = number;
          argI++;
          break; // We found both, no need to continue
        }
      }
    }

    // There were no positional arguments, insert the title at the start
    if (argI === 0) {
      args.splice(0, 0, title);
      argI++;
    }
    // There was only one positional argument, insert the number right after it
    if (argI === 1) args.splice(firstArgI + 1, 0, number);

    return args;
  }

  /**
   * Disable this form’s controls.
   * @param disabled {boolean} True to disable, false to re-enable.
   * @private
   */
  _setDisabled(disabled) {
    this._titleInput.disabled = disabled;
    this._numberInput.disabled = disabled;
    if (disabled) this._submitButton.disabled = true;
    else this._updateSubmitButton();
    this._spinner.style.display = disabled ? "inline" : "none";
  }

  /**
   * Set the visibility of this form.
   * @param visible {boolean} True to set visible, false to hide.
   * @private
   */
  _setVisible(visible) {
    if (visible) {
      this._wrapper.style.display = "inline";
      this._headerTitle.style.display = "none";
      this._headerNumber.style.display = "none";
    } else {
      this._wrapper.style.display = "none";
      this._headerTitle.style.display = "inline";
      this._headerNumber.style.display = "inline";
    }
  }

  /**
   * Disable the submit button if both the new title and number are the same as the current ones.
   * @private
   */
  _updateSubmitButton() {
    const title = this._titleInput.value.trim();
    const number = this._numberInput.value.trim();
    const currentTitle = this._headerTitle.textContent.trim();
    const currentNumber = this._headerNumber.textContent.trim();
    const invalidRexeg = /[\[\]{}#|=]/;
    this._submitButton.disabled = title === currentTitle && number === currentNumber ||
        invalidRexeg.test(title) || invalidRexeg.test(number);
  }
}

module.exports = { EditHeaderForm };
// </nowiki>
