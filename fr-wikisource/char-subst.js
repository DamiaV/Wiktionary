/**
 * Substitution à la volée de caractères pour [[Livre:De la Ramée - Grammaire de P. de la Ramée, 1572.pdf]].
 *
 * Appuyer deux fois sur `ControlLeft` pour activer/désactiver.
 * Le texte se colore en orange lorsque le mode est activé.
 */
$(() => {
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
    const substs = [
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

    for (const [needle, subst] of substs) {
      const len = needle.length;
      const s = text.substring(cursorPos - len, cursorPos);
      if (s === needle) return [subst, len];
    }

    return [null, 0];
  }
});
