const substs = {
  // Longueur 4

  "’ ''": "’''",

  // Longueur 3

  // Ponctuation
  "...": "…",
  "---": "—",
  // Ligatures et lettres latines exotiques
  "a~e": "æ",
  "A~E": "Æ",
  "o~e": "œ",
  "O~E": "Œ",
  "s~s": "ß",
  "t~h": "þ",
  "T~H": "Þ",
  "d~h": "ð",
  "D~H": "Ð",
  // Barres horizontales inscrites
  "d~-": "đ",
  "D~-": "Đ",
  "h~-": "ħ",
  "H~-": "Ħ",
  // Barres obliques inscrites
  "o~/": "ø",
  "O~/": "Ø",
  "l~/": "ł",
  "L~/": "Ł",
  // Accents aigus
  "a^'": "á",
  "A^'": "Á",
  "c^'": "ć",
  "C^'": "Ć",
  "e^'": "é",
  "E^'": "É",
  "i^'": "í",
  "I^'": "Í",
  "n^'": "ń",
  "N^'": "Ń",
  "o^'": "ó",
  "O^'": "Ó",
  "s^'": "ś",
  "S^'": "Ś",
  "u^'": "ú",
  "U^'": "Ú",
  "z^'": "ź",
  "Z^'": "Ź",
  // Accents graves
  "a^`": "à",
  "A^`": "À",
  "e^`": "è",
  "E^`": "È",
  "i^`": "ì",
  "I^`": "Ì",
  "o^`": "ò",
  "O^`": "Ò",
  "u^`": "ù",
  "U^`": "Ù",
  // Trémas
  "a^:": "ä",
  "A^:": "Ä",
  "e^:": "ë",
  "E^:": "Ë",
  "i^:": "ï",
  "I^:": "Ï",
  "o^:": "ö",
  "O^:": "Ö",
  "u^:": "ü",
  "U^:": "Ü",
  "y^:": "ÿ",
  "Y^:": "Ÿ",
  // Tildes
  "a^~": "ã",
  "A^~": "Ã",
  "e^~": "ẽ",
  "E^~": "Ẽ",
  "i^~": "ĩ",
  "I^~": "Ĩ",
  "n^~": "ñ",
  "N^~": "Ñ",
  "o^~": "õ",
  "O^~": "Õ",
  "u^~": "ũ",
  "U^~": "Ũ",
  // Circonflexes
  "a^^": "â",
  "A^^": "Â",
  "c^^": "ĉ",
  "C^^": "Ĉ",
  "e^^": "ê",
  "E^^": "Ê",
  "g^^": "ĝ",
  "G^^": "Ĝ",
  "h^^": "ĥ",
  "H^^": "Ĥ",
  "i^^": "î",
  "I^^": "Î",
  "j^^": "ĵ",
  "J^^": "Ĵ",
  "o^^": "ô",
  "O^^": "Ô",
  "s^^": "ŝ",
  "S^^": "Ŝ",
  "u^^": "û",
  "U^^": "Û",
  // Carons
  "a^v": "ǎ",
  "A^v": "Ǎ",
  "c^v": "č",
  "C^v": "Č",
  "d^v": "ď",
  "D^v": "Ď",
  "e^v": "ě",
  "E^v": "Ě",
  "g^v": "ǧ",
  "G^v": "Ǧ",
  "i^v": "ǐ",
  "I^v": "Ǐ",
  "l^v": "ľ",
  "L^v": "Ľ",
  "n^v": "ň",
  "N^v": "Ň",
  "o^v": "ǒ",
  "O^v": "Ǒ",
  "r^v": "ř",
  "R^v": "Ř",
  "s^v": "š",
  "S^v": "Š",
  "t^v": "ť",
  "T^v": "Ť",
  "u^v": "ǔ",
  "U^v": "Ǔ",
  "z^v": "ž",
  "Z^v": "Ž",
  // Macrons
  "a^_": "ā",
  "A^_": "Ā",
  "e^_": "ē",
  "E^_": "Ē",
  "i^_": "ī",
  "I^_": "Ī",
  "o^_": "ō",
  "O^_": "Ō",
  "u^_": "ū",
  "U^_": "Ū",
  "y^_": "ȳ",
  "Y^_": "Ȳ",
  // Brèves
  "a^-": "ă",
  "A^-": "Ă",
  "e^-": "ĕ",
  "E^-": "Ĕ",
  "g^-": "ğ",
  "G^-": "Ğ",
  "i^-": "ĭ",
  "I^-": "Ĭ",
  "o^-": "ŏ",
  "O^-": "Ŏ",
  "u^-": "ŭ",
  "U^-": "Ŭ",
  // Double accent aigu
  "o^\"": "ő",
  "O^\"": "Ő",
  "u^\"": "ű",
  "U^\"": "Ű",
  // Ronds en chef
  "a^°": "å",
  "A^°": "Å",
  "u^°": "ů",
  "U^°": "Ů",
  // Points souscrits
  "d_.": "ḍ",
  "D_.": "Ḍ",
  "h_.": "ḥ",
  "H_.": "Ḥ",
  "l_.": "ḷ",
  "L_.": "Ḷ",
  "m_.": "ṃ",
  "M_.": "Ṃ",
  "n_.": "ṇ",
  "N_.": "Ṇ",
  "r_.": "ṛ",
  "R_.": "Ṛ",
  "s_.": "ṣ",
  "S_.": "Ṣ",
  "t_.": "ṭ",
  "T_.": "Ṭ",
  "z_.": "ẓ",
  "Z_.": "Ẓ",
  // Cédilles et virgules souscrites
  "c_z": "ç",
  "C_z": "Ç",
  "c_,": "ç",
  "C_,": "Ç",
  "d_,": "ḑ̦",
  "D_,": "Ḑ̦",
  "k_,": "ķ",
  "K_,": "Ķ",
  "l_,": "ļ",
  "L_,": "Ļ",
  "n_,": "ņ",
  "N_,": "Ņ",
  "r_,": "ŗ",
  "R_,": "Ŗ",
  "s_,": "ş",
  "S_,": "Ş",
  "t_,": "ţ",
  "T_,": "Ţ",
  // Ogoneks
  "a_;": "ą",
  "A_;": "Ą",
  "e_;": "ę",
  "E_;": "Ę",
  "i_;": "į",
  "I_;": "Į",
  "u_;": "ų",
  "U_;": "Ų",
  // Macrons souscrits
  "d__": "ḏ",
  "D__": "Ḏ",
  "t__": "ṯ",
  "T__": "Ṯ",
  // Brèves souscrites
  "h_-": "ḫ",
  "H_-": "Ḫ",

  // Versets
  "v~/": "℣",
  "V~/": "℣",
  "r~/": "℟",
  "R~/": "℟",

  // Longueur 2

  // Ponctuation
  "<<": "«",
  ">>": "»",
  // Lettres additionnelles
  "^s": "ſ",
  "^m": "☞",
  "^0": "⁰",
  "^1": "¹",
  "^2": "²",
  "^3": "³",
  "^4": "⁴",
  "^5": "⁵",
  "^6": "⁶",
  "^7": "⁷",
  "^8": "⁸",
  "^9": "⁹",
};

$(document).ready(() => {
  /**
   * @type {HTMLTextAreaElement}
   */
  const textBox = document.getElementById("wpTextbox1");
  if (!textBox || mw.config.get("wgNamespaceNumber") === 8) return;

  textBox.onkeyup = (e) => {
    const charCode = e.key.charCodeAt(0); // Pour compatibilité sur divers navigateurs
    const cursorPos = textBox.selectionStart;
    if (!(
        textBox.selectionEnd === cursorPos &&
        (charCode === 34 ||
            charCode === 39 ||
            (charCode >= 44 && charCode <= 47) ||
            (charCode >= 48 && charCode <= 62) ||
            (charCode >= 65 && charCode <= 90) ||
            charCode === 94 ||
            charCode === 95 ||
            (charCode >= 97 && charCode <= 122)
        )
    ))
      return;

    const text = textBox.value;
    let patternSize = 0;
    let replacement = "";
    let done = false;

    // Substitutions
    if (!done) {
      for (const [subst, repl] of Object.entries(substs)) {
        patternSize = subst.length;
        const selection = text.substring(cursorPos - patternSize, cursorPos);
        if (selection === subst) {
          replacement = repl;
          done = true;
          break;
        }
      }
    }

    // Gestion des apostrophes
    if (!done) {
      patternSize = 2;
      const selection = text.substring(cursorPos - patternSize, cursorPos);
      if (selection[1] === "'") {
        if (selection[0] === "’") {
          replacement = "''";
          done = true;
        } else if (selection[0] !== "'" &&
            selection[0] !== "^" &&
            selection[0] !== " " &&
            text.substring(cursorPos - 1, cursorPos + 1) !== "''") {
          replacement = selection[0] + "’";
          done = true;
        }
      } else if (selection === "’’") {
        replacement = "''";
        done = true;
      }
    }

    if (done) {
      const textScroll = textBox.scrollTop;
      const prefix = text.substring(0, cursorPos - patternSize);
      const suffix = text.substring(cursorPos);
      textBox.value = prefix + replacement + suffix;
      textBox.selectionStart = cursorPos - patternSize + replacement.length;
      textBox.selectionEnd = textBox.selectionStart;
      textBox.scrollTop = textScroll;
    }
  };
});
