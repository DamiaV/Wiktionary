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
$(function () {
  "use strict";

  if (!["edit", "submit"].includes(mw.config.get("wgAction"))) {
    return;
  }

  console.log("Chargement de Gadget-wikt.auto-complete.js…");

  class GadgetAutoComplete {
    static NAME = "Auto-complétion de modèles";
    static VERSION = "1.1.1";

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
      $(document.body).keydown(event => {
        if (this.#suggestMode) {
          if (["ArrowUp", "ArrowDown", "Tab"].includes(event.code)) {
            // Prevent caret from moving and focus from changing
            event.preventDefault();
          }
        }
      });

      $(document.body).keyup(event => {
        // Register cursor position for insertion
        this.#cursorPosition = wikt.edit.getCursorLocation();

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
            var text = this.#insertSuggestion();
            cursorPos += text.length;
          } else if (!this.#suggest()) {
            this.#enableSuggestions(false);
          }

          if (["ArrowUp", "ArrowDown", "Tab"].includes(event.code)) {
            wikt.edit.setCursorLocation(cursorPos);
          }
        }
      });

      $(document.body).click(event => {
        // Check if click target is inside the suggestions box.
        if ($(event.target).closest(this.#$suggestionBox).length) {
          let editBox;
          if (wikt.edit.isCodeMirrorEnabled()) {
            editBox = wikt.edit.getCodeMirror();
          } else {
            editBox = wikt.edit.getEditBox();
          }
          if (editBox) {
            editBox.focus();
          }
          wikt.edit.setCursorLocation(this.#cursorPosition);
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
      const cursorPosition = wikt.edit.getCursorLocation();
      const text = wikt.edit.getText().substring(0, cursorPosition);
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

      var filteredValues = values.filter(function (v) {
        // noinspection JSUnresolvedFunction
        return v.toLowerCase().startsWith(value.toLowerCase());
      });

      filteredValues.forEach((v, i) => {
        if (i >= GadgetAutoComplete.#MAX_SUGGESTIONS) {
          return;
        }

        var prefix = v.substr(0, value.length);
        var rest = v.substr(value.length);
        var $item = $(`<li><span class="autocomplete-highlight">${prefix}</span>${rest}</li>`);

        $item.click(() => {
          this.#selectSuggestion(i);
          this.#insertSuggestion();
        });
        $list.append($item);
        this.#suggestions.push([prefix, rest]);
      });

      var $message = this.#$suggestionBox.find("span:not(.autocomplete-highlight)");
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
        const cursorPosition = wikt.edit.getCursorLocation();
        const suggestionPrefix = this.#suggestions[this.#suggestionIndex][0];
        const suggestionSuffix = this.#suggestions[this.#suggestionIndex][1];

        // Replace already typed text by the start of the selected suggestion.
        wikt.edit.replaceText(this.#cursorPosition - suggestionPrefix.length, this.#cursorPosition, suggestionPrefix);
        // Insert the rest of the suggestion on the right of the cursor.
        wikt.edit.insertText(cursorPosition, suggestionSuffix);
        this.#cursorPosition += suggestionSuffix.length;
        this.#enableSuggestions(false);

        return suggestionSuffix;
      }

      return "";
    }
  }

  const ac = new GadgetAutoComplete();
  window.gadget_autoComplete = ac;

  /**
   * Converts the given string representing a LUA table to a JSON object.
   * @param rawLua {string} The string containing the LUA table.
   * @return {Object} The corresponding JSON object.
   */
  function luaDataPageToJson(rawLua) {
    const startToken = "-- $Table start$\n";
    const startIndex = rawLua.indexOf(startToken);
    const endIndex = rawLua.indexOf("-- $Table end$");
    const rawParams = rawLua.substring(startIndex === -1 ? 0 : startIndex + startToken.length, endIndex === -1 ? rawLua.length : endIndex)
        .replaceAll(/--.+$/gm, "") // Remove comments
        .replaceAll(/^local\s+.+?=\s*(?={)/gm, "") // Remove assignment
        .replaceAll(/^(\s*)\[(['"])(.+?)\2]\s*=/gm, '$1"$3":') // Convert Lua keys syntax to JS
        .replaceAll(/(')(.*?[^\\])\1/g, '"$2"') // Convert ' to "
        .replaceAll(/\\'/g, "'") // Unescape single quotes
        .replaceAll(/(\w+)\s*=/g, '"$1":') // Add quotes on unquoted keys
        .replaceAll(/,(?=\s*})/gm, "") // Remove trailing commas
        .replaceAll(/{([^:]*?)}/gm, "[$1]") // Convert Lua lists to JS
        .replaceAll(/^\s*return.+$/gm, ""); // Remove "return" statement
    return JSON.parse(rawParams);
  }

  /**
   * Utility function that adds support to the given template that uses a single data module.
   * @param templateName {string} Template’s name without "Template:".
   * @param moduleName {string} Name of the module used by the template without "Module:".
   *                   Must have a /data subpage returning a table holding the authorized values.
   */
  function addTemplate(templateName, moduleName) {
    $.get(
        `https://fr.wiktionary.org/wiki/Module:${encodeURIComponent(moduleName)}/data?action=raw`,
        data => {
          try {
            ac.addTemplateParameters(templateName, Object.keys(luaDataPageToJson(data)));
          } catch (e) {
            console.log(`An error occured while parsing LUA table for [[Module:${moduleName}/data]] ([[Template:${templateName}]])`);
          }
        }
    );
  }

  // [[Modèle:langue]], [[Module:langues/data]]
  $.get(
      "https://fr.wiktionary.org/wiki/MediaWiki:Gadget-translation editor.js/langues.json?action=raw",
      data => {
        try {
          ac.addTemplateParameters("langue", Object.keys(JSON.parse(data)));
        } catch (e) {
          console.log("An error occured while parsing JSON for [[MediaWiki:Gadget-translation editor.js/langues.json]] ([[Template:langue]]): " + e);
        }
      }
  );
  // [[Modèle:lexique]], [[Module:lexique/data]]
  addTemplate("lexique", "lexique");
  // [[Modèle:info lex]], [[Module:lexique/data]]
  addTemplate("info lex", "lexique");
  // [[Modèle:S]], [[Module:section article/data]], [[Module:types de mots/data]]
  $.get(
      "https://fr.wiktionary.org/wiki/Module:section_article/data?action=raw",
      data => {
        try {
          const sectionIds = Object.keys(luaDataPageToJson(data)["texte"]);
          $.get(
              "https://fr.wiktionary.org/wiki/Module:types_de_mots/data?action=raw",
              data => {
                try {
                  const wordTypes = Object.keys(luaDataPageToJson(data)["texte"]);
                  ac.addTemplateParameters("S", sectionIds.concat(wordTypes));
                } catch (e) {
                  console.log("An error occured while parsing LUA table for [[Module:types de mots/data]] ([[Template:S]]): " + e);
                }
              }
          );
        } catch (e) {
          console.log("An error occured while parsing LUA table for [[Module:section article/data]] ([[Template:S]]): " + e);
        }
      }
  );
});
// </nowiki>
