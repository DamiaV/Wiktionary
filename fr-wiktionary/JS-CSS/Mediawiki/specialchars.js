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
 * [[Catégorie:JavaScript du Wiktionnaire|specialchars.js]]
 ********************************************************************/
// <nowiki>
"use strict";

const {
  isCodeMirrorEnabled,
  getCodeMirror,
  getEditBox,
  getEditAreaText,
  getCursorLocation,
  getSelectedText,
  setEditAreaText,
  setCursorLocation,
} = require("./wikt.core.edit.js");
const { onDOMChanges } = require("./wikt.core.page.js");

(() => {
  if (["css", "javascript", "json", "Scribunto"].includes(mw.config.get("wgPageContentModel"))) return;

  console.log("Chargement de Gadget-specialchars.js…");

  const TAGS = {
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
    "$s_": "ſ",
    "$ss": "ß",
    "$SS": "ẞ",
    "$.": "·",
    "$-": "–", // En dash
    "$_": "—", // Em dash
    "$,": "ʻ",
    "...": "…",
    "<<": "«\u00a0",
    ">>": "\u00a0»",
  };

// noinspection JSUnresolvedReference
  if (typeof window.specialCharsCustom === "object") {
    // noinspection JSUnresolvedReference
    for (const [from, to] of Object.entries(window.specialCharsCustom))
      TAGS[from] = to;
  }

  /** @type {Record<JQueryTextInput, string>} */
  const previousText = {};
  let codeMirrorActive = false;

  /**
   * @param e {JQuery.KeyUpEvent<HTMLInputElement, any, HTMLInputElement, HTMLInputElement>}
   */
  const onKeyUp = (e) => parse($(e.target));

  function mark($element) {
    $element.data("sc-marked", true);
  }

  $("input[type='text'], input[type='search'], textarea")
      .on("keyup", onKeyUp)
      .each((_, element) => mark($(element)));
  onDOMChanges((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList") {
        $(mutation.target)
            .find("input[type='text']:not([data-sc-marked]), input[type='search']:not([data-sc-marked]), textarea:not([data-sc-marked])")
            .each((_, element) => {
              const $element = $(element);
              $element.on("keyup", onKeyUp);
              mark($element);
            });

        if (!codeMirrorActive && isCodeMirrorEnabled()) {
          getCodeMirror().on("keyup", () => parse(getEditBox()));
          codeMirrorActive = true;
        }
      }
    });
  }, document.body, { subtree: true, childList: true });

  /**
   * Parses the text of the given text input.
   * @param $input {JQueryTextInput} The input element.
   */
  function parse($input) {
    let text = getEditAreaText($input);

    if (text !== previousText[$input]) {
      const cursorPos = getCursorLocation($input);
      let newPos = -1;
      let start, end;

      if (!getSelectedText($input)) {
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
            if (quotes === "’’" || quotes === "'’")
              quotes = "''";
            newPos = cursorPos;
          }
          text = text.substring(0, start) + quotes + text.substring(end);
        } else {
          for (const [tag, repl] of Object.entries(TAGS)) {
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
          setEditAreaText(text, $input);
          setCursorLocation(newPos, $input);
        }
      }

      previousText[$input] = text;
    }
  }
})();
// </nowiki>
