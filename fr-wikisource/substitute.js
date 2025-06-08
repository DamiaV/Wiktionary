/**
 * On-the-fly character substitution for various books.
 *
 * Press the left control key twice to toggle.
 * The text is colored in orange when the mode is active.
 */
// <nowiki>
$(() => {
  const Modes = Object.freeze({
    // For [[Livre:De la Ramée - Grammaire de P. de la Ramée, 1572.pdf]]
    LA_RAMEE: "La Ramée",
    // For [[Livre:Féline - Dictionnaire de la prononciation de la langue française, 1851.pdf]]
    FELINE: "Féline",
  });
  const MODE = Modes.FELINE;

  let substMode = false;
  let pressedOnce = false;

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
      const [subst, len] = getSubst(text, cursorPos);
      if (subst) {
        $textBox.val(text.substring(0, cursorPos - len) + subst + text.substring(cursorPos));
        const newPos = cursorPos - len + subst.length;
        $textBox.prop("selectionStart", newPos);
        $textBox.prop("selectionEnd", newPos);
      }
    }
  });

  /**
   * @param text {string}
   * @param cursorPos {number}
   * @returns {[string|null, number]}
   */
  function getSubst(text, cursorPos) {
    /** @type {[string, string][]} */
    let substs = [];
    if (MODE === Modes.LA_RAMEE) {
      substs = [
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
      ];
    } else if (MODE === Modes.FELINE) {
      substs = [
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
      ];
      // Upper-case letters precedeed by "{{sc|"
      for (let i = 0; i < 26; i++) {
        const letter = String.fromCharCode(97 + i);
        substs.push([`{{sc|${letter}`, `{{sc|${letter.toUpperCase()}`]);
      }
    }

    for (const [needle, subst] of substs) {
      const len = needle.length;
      const s = text.substring(cursorPos - len, cursorPos);
      if (s === needle) return [subst, len];
    }

    return [null, 0];
  }
});
// </nowiki>
