/**
 * Fix the typography of the given text.
 * @param text {string} The text to fix.
 * @returns {string} The fixed text.
 */
function fixTypography(text) {
  /**
   * Correct the typography of the given line.
   * @param line {string} The line to correct.
   * @returns {string} The corrected line.
   */
  function correctTypo(line) {
    // Enforce a single space after list bullets
    line = line.replace(/^([#:*])\s*([^#:*\s])/, "$1 $2");
    // line = line.replace(/^(#\s*\[\[)([a-zéçè][^|\]]+)(]])/, function (a, b, c) {
    //   var s = b.charAt(0).toUpperCase() + b.substring(1);
    //   return a + b + "|" + s + c;
    // });
    return line;
  }

  var lines = text.split("\n");
  // Parcours des lignes : changements seulement sur les lignes de déf, exemples, listes à puces
  for (var i = 0; i < lines.length; i++)
    if (/^[*#:].*$/.test(lines[i]))
      text = text.replace(lines[i], correctTypo(lines[i]));

  return text;
}
