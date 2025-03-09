/********************************************************************
 * (en)
 * On-the-fly character substitution when in edit mode.
 * Enables typing characters that are missing from the French AZERTY
 * keyboard.
 ********************************************************************
 * (fr)
 * Remplacement à la volée de certains caractères lors de l’édition.
 * Pensé pour les caractères absents du clavier AZERTY français pour
 * écrire le français.
 ********************************************************************
 * [[Catégorie:JavaScript du Wiktionnaire|specialchars-dev.js]]
 ********************************************************************/
// <nowiki>
$(function () {
  if (!window.wikt) {
    return;
  }
  console.log("Chargement de Gadget-specialchars-dev.js…");

  class GadgetSpecialChars {
    static NAME = "Caractères spéciaux";
    static VERSION = "2.1.1";

    /** @type {Object<string, string>} */
    static #TAGS = {
      "$ae": "æ",
      "$AE": "Æ",
      "$oe": "œ",
      "$OE": "Œ",
      "$aa": "ā",
      "$AA": "Ā",
      "$ii": "ī",
      "$II": "Ī",
      "$ee": "ē",
      "$EE": "Ē",
      "$oo": "ō",
      "$OO": "Ō",
      "$uu": "ū",
      "$UU": "Ū",
      "$à": "À",
      "$ç": "Ç",
      "$é": "É",
      "$è": "È",
      "$ù": "Ù",
      "$ss": "ß",
      "$SS": "ẞ",
      "$s": "ſ",
      "$.": "·",
      "$-": "–", // En dash
      "$_": "—", // Em dash
      "$,": "ʻ",
      "...": "…",
      "<<": "«\u00a0",
      ">>": "\u00a0»",
    };

    /** @type {Object<jQuery, string>} */
    #previousText;
    #codeMirrorActive = false;

    constructor() {
      const onKeyUp = e => this.#parse($(e.target));

      function mark($element) {
        $element.data("sc-marked", true);
      }

      $("input[type='text'], input[type='search'], textarea").keyup(onKeyUp).each((_, element) => mark($(element)));
      wikt.page.onDOMChanges(mutationsList => {
        mutationsList.forEach(mutation => {
          if (mutation.type === "childList") {
            $(mutation.target)
                .find("input[type='text']:not([data-sc-marked]), input[type='search']:not([data-sc-marked]), textarea:not([data-sc-marked])")
                .each((_, element) => {
                  var $element = $(element);
                  $element.keyup(onKeyUp);
                  mark($element);
                });

            if (!this.#codeMirrorActive && wikt.edit.isCodeMirrorEnabled()) {
              // noinspection JSCheckFunctionSignatures
              wikt.edit.getCodeMirror().on("keyup", () => this.#parse(wikt.edit.getEditBox()));
              this.#codeMirrorActive = true;
            }
          }
        });
      }, document.body, {subtree: true, childList: true});
      this.#previousText = {};
    }

    /**
     * Parses the text of the given text input.
     * @param $input {jQuery} The input element.
     */
    #parse($input) {
      let text = wikt.edit.getText($input);

      if (text !== this.#previousText[$input]) {
        const cursorPos = wikt.edit.getCursorLocation($input);
        let newPos = -1;
        let start, end;

        if (!wikt.edit.getSelectedText($input)) {
          // Do not replace apostrophes when in file name.
          const inMedia = /\[\[(Fichier|File|Image|Média|Media):[^|\]]+?$/i
              .test(text.substring(0, cursorPos));

          if (!inMedia && text.charAt(cursorPos - 1) === "'") {
            start = cursorPos - 2;
            end = cursorPos;
            const before = text.charAt(start);
            let quotes;

            if (before === "\\") {
              quotes = "'";
              newPos = cursorPos - 1;
            } else {
              quotes = before + "’";
              if (quotes === "’’" || quotes === "'’") {
                quotes = "''";
              }
              newPos = cursorPos;
            }
            text = text.substring(0, start) + quotes + text.substring(end);
          } else {
            for (const [tag, repl] of Object.entries(GadgetSpecialChars.#TAGS)) {
              start = cursorPos - tag.length;
              end = cursorPos;
              if (text.substring(start, end) === tag) {
                text = text.substring(0, start) + repl + text.substring(end);
                newPos = start + repl.length;
                break;
              }
            }
          }

          if (newPos >= 0) {
            // noinspection JSCheckFunctionSignatures
            wikt.edit.setText(text, $input);
            wikt.edit.setCursorLocation(newPos, $input);
          }
        }

        this.#previousText[$input] = text;
      }
    }
  }

  window.gadget_specialChars = new GadgetSpecialChars();
});
// </nowiki>
