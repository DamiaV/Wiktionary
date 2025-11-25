/**
 * On-the-fly character substitution for various books.
 *
 * Press the left control key twice to toggle.
 * The text is colored in orange when the mode is active.
 */
// <nowiki>
$(() => {
  /** @type {{titlePrefix: string, substitutions: [string, string][]}[]} */
  const SUBSTS = [
    // For [[Livre:De la Ramée - Grammaire de P. de la Ramée, 1572.pdf]]
    {
      titlePrefix: "De la Ramée - Grammaire de P. de la Ramée, 1572.pdf",
      substitutions: [
        // 3 chars
        ["g̛n", "ņ"],
        ["G̛n", "Ņ"],
        ["G̛N", "Ņ"],
        // 2 chars
        ["au", "ꜷ"],
        ["Au", "Ꜷ"],
        ["AU", "Ꜷ"],
        ["ou", "ȣ"],
        ["Ou", "Ȣ"],
        ["OU", "Ȣ"],
        ["eu", "{{x|eu}}"],
        ["Eu", "{{x|EU}}"],
        ["EU", "{{x|EU}}"],
        ["ll", "ļ"],
        ["Ll", "Ļ"],
        ["LL", "Ļ"],
        ["nn", "ņ"],
        ["Nn", "Ņ"],
        ["NN", "Ņ"],
        ["gn", "ņ"],
        ["Gn", "Ņ"],
        ["GN", "Ņ"],
        // 1 char
        ["g", "g̛"],
        ["G", "G̛"],
        ["è", "e̛"],
        ["È", "E̛"],
        ["é", "ȩ"],
        ["É", "Ȩ"],
      ]
    },
    // For [[Livre:Féline - Dictionnaire de la prononciation de la langue française, 1851.pdf]]
    {
      titlePrefix: "Féline - Dictionnaire de la prononciation de la langue française, 1851.pdf",
      substitutions: [
        // 2 chars
        ["aa", "â"],
        ["Aa", "Â"],
        ["AA", "Â"],
        ["a_", "a̱"],
        ["A_", "A̱"],
        ["ee", "ê"],
        ["Ee", "Ê"],
        ["EE", "Ê"],
        ["èè", "ɛ"],
        ["Èè", "Ɛ"],
        ["ÈÈ", "Ɛ"],
        ["ɛè", "ɛ̂"],
        ["Ɛè", "Ɛ̂"],
        ["ƐÈ", "Ɛ̂"],
        ["ii", "î"],
        ["Ii", "Î"],
        ["II", "Î"],
        ["i_", "i̱"],
        ["I_", "I̱"],
        ["oo", "ô"],
        ["Oo", "Ô"],
        ["OO", "Ô"],
        ["o_", "o̱"],
        ["O_", "O̱"],
        ["uu", "û"],
        ["Uu", "Û"],
        ["UU", "Û"],
        ["u_", "u̱"],
        ["U_", "U̱"],
        ["g_", "ḡ"],
        ["G_", "Ḡ"],
        ["l_", "ḻ"],
        ["L_", "Ḻ"],
        ["..", ".\n\n{{sc|"], // End current line and begin next
        [",,", "}}, "], // Close "{{sc|" before pronunciation
      ]
    },
    // For [[Livre:Vaudelin - Nouvelle manière d’écrire comme on parle en France, 1713.pdf]]
    {
      titlePrefix: "Vaudelin - Nouvelle manière d’écrire comme on parle en France, 1713.pdf",
      substitutions: [
        // 3 chars
        ["_AN", "{{X|Vaudelin AN}}"],
        ["_An", "{{X|Vaudelin AN}}"],
        ["_an", "ą"],
        ["_EU", "{{X|Vaudelin EU}}"],
        ["_Eu", "{{X|Vaudelin EU}}"],
        ["_eu", "ę"],
        ["_IN", "Ɩ"],
        ["_In", "Ɩ"],
        ["_in", "ɩ̇"],
        ["_OU", "{{X|Vaudelin OU}}"],
        ["_Ou", "{{X|Vaudelin OU}}"],
        ["_ou", "o̍"],
        ["_ON", "{{X|Vaudelin ON}}"],
        ["_On", "{{X|Vaudelin ON}}"],
        ["_on", "o̩"],
        ["_Un", "{{X|Vaudelin UN}}"],
        ["_UN", "{{X|Vaudelin UN}}"],
        ["_un", "ų"],
        ["_la", "{{Lang|la|"],
        ["_10", "{{Espaces|10}}"],
        // 2 chars
        ["_3", "{{Espaces|3}}"],
        ["_4", "{{Espaces|4}}"],
        ["AA", "Ā"],
        ["Aa", "Ā"],
        ["aa", "ā"],
        ["EE", "Ē"],
        ["Ee", "Ē"],
        ["ee", "ē"],
        ["II", "Ī"],
        ["Ii", "Ī"],
        ["ii", "ī"],
        ["OO", "Ō"],
        ["Oo", "Ō"],
        ["oo", "ō"],
        ["UU", "Ū"],
        ["Uu", "Ū"],
        ["uu", "ū"],
        ["_E", "{{X|Vaudelin Ə}}"],
        ["_e", "{{X|Vaudelin ə}}"],
        ["ꜷè", "ꜷ̄"],
        ["èè", "ꜷ̄"],
        ["_V", "℣. "],
        ["_v", "℣. "],
        ["_R", "℟. "],
        ["_r", "℟. "],
        // 1 char
        ["È", "{{X|Vaudelin AI}}"],
        ["è", "ꜷ"],
        ["y", "{{X|Vaudelin i-ə}}"],
        ["©", "ſ"],
        ["¨", "i"],
        ["`", "\u0314"], // Esprit rude (aspiration)
        ["%", "\u1dc5"], // Grave-macron (aspiration & allongement)
      ]
    },
  ];
  // Upper-case letters precedeed by "{{sc|"
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(97 + i);
    SUBSTS[1].substitutions.push([`{{sc|${letter}`, `{{sc|${letter.toUpperCase()}`]);
  }

  let substs;
  for (const { titlePrefix, substitutions } of SUBSTS) {
    if (String(mw.config.get("wgPageName")).replaceAll("_", " ").startsWith("Page:" + titlePrefix)) {
      substs = substitutions;
      break;
    }
  }
  if (!substs) return;

  let substMode = false;
  let pressedOnce = false;

  /** @type {JQuery<HTMLTextAreaElement>} */
  const $textBox = $("#wpTextbox1");
  $textBox.on("keyup", (event) => {
    if (event.originalEvent.code === "ControlLeft") {
      if (!pressedOnce) {
        pressedOnce = true;
        setTimeout(() => {
          pressedOnce = false;
        }, 500);
      } else {
        substMode = !substMode;
        pressedOnce = false;
        $textBox.css("color", substMode ? "orange" : "inherit");
      }
    } else if (substMode) {
      const text = $textBox.val();
      const cursorPos = $textBox.prop("selectionStart");
      const [subst, len] = getSubst(text, cursorPos, substs);
      if (subst) {
        $textBox.val(text.substring(0, cursorPos - len) + subst + text.substring(cursorPos));
        const newPos = cursorPos - len + subst.length;
        $textBox.prop("selectionStart", newPos);
        $textBox.prop("selectionEnd", newPos);
      }
    }
  });

  /**
   * @param {string} text
   * @param {number} cursorPos
   * @param {[string, string][]} substs
   * @returns {[string | null, number]}
   */
  function getSubst(text, cursorPos, substs) {
    for (const [needle, subst] of substs) {
      const len = needle.length;
      const s = text.substring(cursorPos - len, cursorPos);
      if (s === needle) return [subst, len];
    }
    return [null, 0];
  }
});
// </nowiki>
