// [[Catégorie:JavaScript du Wiktionnaire|Formatage/typography.js]]
"use strict";

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
    return line.replace(/^([#:*])\s*([^#:*\s])/, "$1 $2");
  }

  const lines = text.split("\n");
  // Only change lines that are definitions, examples, and bullet list items.
  for (const line of lines)
    if (/^[*#:].*$/.test(line))
      text = text.replace(line, correctTypo(line));
  return text;
}

module.exports = {
  fixTypography,
};
