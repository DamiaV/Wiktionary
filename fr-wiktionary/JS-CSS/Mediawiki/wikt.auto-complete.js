/**
 * (en)
 * This gadget adds template value suggestion when pressing Ctrl+Space.
 * Upon pressing the keys, if the cursor is inside a supported template,
 * a list of values suggestions will pop up. If some text has already
 * been typed, only values that start with this text will be suggested.
 * The list is updated whenever a key is pressed.
 * ----------------------------------------------------------------------
 * (fr)
 * Ce gadget ajoute la suggestion de valeurs pour certains modèles
 * lorsque l’utilisateur appuie sur Ctrl+Espace. Après avoir appuyé sur
 * ces touches, si le curseur est dans un modèle pris en charge, une liste de
 * suggestions de valeurs apparait. Si du texte a déjà été entré, seules
 * les valeurs commençant par le texte en question seront suggérées. La
 * liste est mise à jour à chaque fois que l’utilisateur appuie sur une
 * touche.
 * ----------------------------------------------------------------------
 * [[Catégorie:JavaScript du Wiktionnaire|auto-complete]]
 * <nowiki>
 */
"use strict";

const { getLanguagesNames } = require("./wikt.core.languages.js");
const {
  getCursorLocation,
  setCursorLocation,
  isCodeMirrorEnabled,
  getCodeMirror,
  getEditBox,
  getEditAreaText,
  replaceEditAreaText,
  insertTextInEditArea,
} = require("./wikt.core.edit.js");
const { getSectionCodes, getWordTypeCodes } = require("./wikt.core.sections.js");
const { getLexiconCodes } = require("./wikt.core.lexicons.js");

console.log("Chargement de Gadget-wikt.auto-complete.js…");

class GadgetAutoComplete {
  static NAME = "Auto-complétion de modèles";
  static VERSION = "1.5";

  /** Maximum number of suggestions to display. */
  static #MAX_SUGGESTIONS = 100;

  /**
   * Associates templates to a list of values to suggest.
   * @type {Object<string, string[]>}
   */
  #templates = {};
  /** Indicates whether the gadget is making suggestions to the user. */
  #suggestMode = false;
  /** The suggestions jQuery component. */
  #$suggestionBox = null;
  /**
   * The list of suggestions for the current value.
   * @type {string[][]}
   */
  #suggestions = [];
  /** The index of the selected suggestion in the list. */
  #suggestionIndex = 1;
  /** The position the cursor is supposed to be at after inserting a suggestion. */
  #cursorPosition = -1;

  /**
   * Initializes this gadget by registering callbacks on
   * the document body and inserting the suggestions box.
   */
  constructor() {
    $(document.body).on("keydown", (event) => {
      if (this.#suggestMode) {
        if (["ArrowUp", "ArrowDown", "Tab"].includes(event.code)) {
          // Prevent caret from moving and focus from changing
          event.preventDefault();
        }
      }
    });

    $(document.body).on("keyup", (event) => {
      // Register cursor position for insertion
      this.#cursorPosition = getCursorLocation();

      if (!this.#suggestMode) {
        if (event.ctrlKey && event.code === "Space") {
          if (this.#suggest()) {
            this.#enableSuggestions(true);
          }
        }
      } else {
        let cursorPos = this.#cursorPosition;

        if (event.code === "Escape" || event.key === "}") {
          this.#enableSuggestions(false);
        } else if (event.code === "ArrowUp") { // FIXME fait nimp avec CodeMirror
          this.#selectSuggestion(this.#suggestionIndex - 1);
        } else if (event.code === "ArrowDown") { // FIXME fait nimp avec CodeMirror
          this.#selectSuggestion(this.#suggestionIndex + 1);
        } else if (event.code === "Tab") {
          cursorPos += this.#insertSuggestion().length;
        } else if (!this.#suggest()) {
          this.#enableSuggestions(false);
        }

        if (["ArrowUp", "ArrowDown", "Tab"].includes(event.code)) {
          setCursorLocation(cursorPos);
        }
      }
    });

    $(document.body).on("click", (event) => {
      // Check if click target is inside the suggestions box.
      if ($(event.target).closest(this.#$suggestionBox).length) {
        let editBox;
        if (isCodeMirrorEnabled()) {
          editBox = getCodeMirror();
        } else {
          editBox = getEditBox();
        }
        if (editBox) {
          editBox.focus();
        }
        setCursorLocation(this.#cursorPosition);
      } else {
        this.#enableSuggestions(false);
      }
    });

    this.#$suggestionBox = $('<div id="autocomplete-suggestion-box"><span class="autocomplete-no-suggestions">Aucune suggestion</span><ul></ul></div>');
    $("body").append(this.#$suggestionBox);
    this.#$suggestionBox.hide();
  }

  /**
   * Declares parameter values for the given template.
   * @param templateName {string} Template’s name.
   * @param templateParameters {string[]} Template’s parameter values.
   */
  addTemplateParameters(templateName, templateParameters) {
    this.#templates[templateName] = templateParameters;
  }

  /**
   * Enables/disables suggestions.
   * @param enable {boolean} True to enable; false to disable.
   */
  #enableSuggestions(enable) {
    this.#suggestMode = enable;
    if (this.#suggestMode) {
      this.#$suggestionBox.show();
    } else {
      this.#$suggestionBox.hide();
    }
  }

  /**
   * Fetches the current template the cursor is in then adds the relevent suggestions to the list.
   * @return {boolean} True if the cursor is in a template and there are suggestions for it.
   */
  #suggest() {
    const cursorPosition = getCursorLocation();
    const text = getEditAreaText().substring(0, cursorPosition);
    const templateStart = text.lastIndexOf("{{");
    const templateEnd = text.lastIndexOf("}}");

    if (templateStart > templateEnd || templateStart >= 0 && templateEnd === -1) {
      const template = text.substring(templateStart + 2);
      const templateName = template.substring(0, template.indexOf("|"));

      if (templateName && this.#templates[templateName]) {
        this.#updateSuggestions(
            templateName,
            template.substring(template.lastIndexOf("|") + 1),
            this.#templates[templateName]
        );
        return true;
      }
    }

    return false;
  }

  /**
   * Adds to the list the available suggestions for the current template and value.
   * @param templateName {string} The template the cursor is in.
   * @param value {string} The value on the left of the cursor.
   * @param values {string[]} The available values for the template and the given value.
   */
  #updateSuggestions(templateName, value, values) {
    const $list = this.#$suggestionBox.find("ul");
    $list.empty();
    this.#suggestions.splice(0, this.#suggestions.length); // Clear array

    const filteredValues = values.filter(function (v) {
      // noinspection JSUnresolvedFunction
      return v.toLowerCase().startsWith(value.toLowerCase());
    });

    filteredValues.forEach((v, i) => {
      if (i >= GadgetAutoComplete.#MAX_SUGGESTIONS) {
        return;
      }

      const prefix = v.substring(0, value.length);
      const rest = v.substring(value.length);
      const $item = $(`<li><span class="autocomplete-highlight">${prefix}</span>${rest}</li>`);

      $item.on("click", () => {
        this.#selectSuggestion(i);
        this.#insertSuggestion();
      });
      $list.append($item);
      this.#suggestions.push([prefix, rest]);
    });

    const $message = this.#$suggestionBox.find("span:not(.autocomplete-highlight)");
    if (filteredValues.length) {
      this.#selectSuggestion(0);
      $message.hide();
    } else {
      this.#suggestionIndex = -1;
      $message.show();
    }
  }

  #selectSuggestion(i) {
    if (this.#suggestions.length !== 0) {
      const m = this.#suggestions.length;
      this.#suggestionIndex = ((i % m) + m) % m; // True modulo operation
      this.#$suggestionBox.find("ul li").removeClass("autocomplete-selected");
      this.#$suggestionBox.find(`ul li:nth-child(${this.#suggestionIndex + 1})`)
          .addClass("autocomplete-selected");
    }
  }

  #insertSuggestion() {
    if (this.#suggestionIndex !== -1) {
      const cursorPosition = getCursorLocation();
      const suggestionPrefix = this.#suggestions[this.#suggestionIndex][0];
      const suggestionSuffix = this.#suggestions[this.#suggestionIndex][1];

      // Replace already typed text by the start of the selected suggestion.
      replaceEditAreaText(this.#cursorPosition - suggestionPrefix.length, this.#cursorPosition, suggestionPrefix);
      // Insert the rest of the suggestion on the right of the cursor.
      insertTextInEditArea(cursorPosition, suggestionSuffix);
      this.#cursorPosition += suggestionSuffix.length;
      this.#enableSuggestions(false);

      return suggestionSuffix;
    }

    return "";
  }
}

const gadget = new GadgetAutoComplete();
gadget.addTemplateParameters("langue", Array.from(getLanguagesNames().values()));
gadget.addTemplateParameters("S", getSectionCodes().concat(getWordTypeCodes()));
gadget.addTemplateParameters("lexique", getLexiconCodes());
gadget.addTemplateParameters("info lex", getLexiconCodes());
// </nowiki>
