// History of this file is in [[Utilisateur:Acer11/Trévoux.js]]
"use strict";

if (!window.CorrectLongS) window.CorrectLongS = {};

(() => {
  /**
   * @param {string} text
   */
  function escapeBracedBlocks(text) {
    /**
     * @type {number[]}
     */
    const stack = [];
    /**
     * @type {string[]}
     */
    const placeholders = [];
    let output = '';
    let i = 0;

    while (i < text.length) {
      if (text.substring(i, i + 2) === '{{') {
        stack.push(i);
        i += 2;
      } else if (text.substring(i, i + 2) === '}}' && stack.length) {
        const start = stack.pop();
        // Reached end of current block
        if (!stack.length) {
          const block = text.substring(start, i + 2);
          placeholders.push(block);
          output += `%%BLOC${placeholders.length}%%`;
        }
        i += 2;
      } else {
        if (!stack.length) output += text[i];
        i++;
      }
    }

    return { protectedText: output, placeholders };
  }

  /**
   * @param {string} text
   * @param {string[]} placeholders
   */
  function restorePlaceholders(text, placeholders) {
    for (let i = 0; i < placeholders.length; i++)
      text = text.replace(`%%BLOC${i}%%`, placeholders[i]);
    return text;
  }

  /**
   * @param {string} regex
   * @param {string} substitution
   * @param {string} text
   */
  function substitute(regex, substitution, text) {
    try {
      return text.replaceAll(new RegExp(regex, "g"), substitution);
    } catch (err) {
      alert(`Erreur de syntaxe\u00a0? "${regex}", "${substitution}"\n${err}`);
      return null;
    }
  }

  /**
   * Applique les transformations typographiques sur portions textes sûres.
   * @param {string[]} defs
   * @param {string} text
   */
  function applyRegex(defs, text) {
    const length = defs.length;
    if (length % 2 !== 0) {
      alert("Le nombre de regexp doit être pair");
      return text;
    }
    for (let i = 0; i < length; i += 2) {
      const new_text = substitute(defs[i], defs[i + 1], text);
      if (new_text === null)
        break;
      text = new_text;
    }
    return text;
  }

  /**
   * @param {string} text
   */
  function fixLongSInText(text) {
    let { protectedText, placeholders } = escapeBracedBlocks(text);

    const ls = window.CorrectLongS;
    protectedText = applyRegex(ls.typo_def_long_s_1, protectedText);
    protectedText = applyRegex(ls.typo_def_long_s_2, protectedText);
    protectedText = applyRegex(ls.typo_def_long_s_3, protectedText);
    protectedText = applyRegex(ls.typo_def_long_s_4, protectedText);
    protectedText = applyRegex(ls.typo_def_long_s_5, protectedText);
    if (window.typo_def_long_s_user)
      protectedText = applyRegex(window.typo_def_long_s_user, protectedText);
    protectedText = applyRegex(ls.typo_def_long_s_last, protectedText);

    return restorePlaceholders(protectedText, placeholders);
  }

  function fixLongS() {
    /**
     * @type {HTMLTextAreaElement | null}
     */
    const editBox = document.getElementById('wpTextbox1');
    if (editBox) {
      const text = editBox.value;
      const splitter = /##.*##|<math>.*<\/math>|<[a-zA-z0-9 ="']+>|<\/[a-zA-z0-9 ="']+>|style=".*"|&nbsp;|&mdash;|<!--.*-->|\n:+|\n;+|\[\[.*]]/gm;
      let newText = '';
      let lastMatchIndex = 0;
      /**
       * @type {RegExpExecArray | null}
       */
      let match = null;

      while ((match = splitter.exec(text)) !== null) {
        const separator = match[0];
        newText += fixLongSInText(text.slice(lastMatchIndex, splitter.lastIndex - separator.length));
        newText += separator;
        lastMatchIndex = splitter.lastIndex;
      }
      newText += fixLongSInText(text.slice(lastMatchIndex));
      editBox.value = newText;
    }
  }

  $(() => {
    $('#wpTextbox1').wikiEditor('addToToolbar', {
      section: 'main',
      group: 'insert',
      tools: {
        'wpRep': {
          label: 'Remplacement auto',
          type: 'button',
          icon: '//upload.wikimedia.org/wikipedia/commons/a/af/Button_Fractur_OCR.png',
          action: {
            type: 'callback',
            execute: fixLongS
          }
        }
      }
    });
    $('[rel="wpRep"]').width(36);
  });
})();
