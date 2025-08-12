// [[Catégorie:JavaScript du Wiktionnaire|Formatage/sections.js]]
// <nowiki>
"use strict";

/**
 * @typedef {{invalidLine: string, lineNumber: number, error: string}} LineError
 */

const { getSectionData, getWordTypeData } = require("../wikt.core.sections.js");

/**
 * Format the sections in the given text.
 * @param text {string} The text to format.
 * @return {{newText: string, changesCount: number, errors: LineError[]}}
 */
function formatSections(text) {
  /** @type {LineError[]} */
  const errors = [];

  /**
   * Format the given section.
   * @param sectionText {string} The section to format.
   * @param lineNumber {number} The line number of the text to format.
   * @returns {string} The formatted section text.
   */
  function formatSection(sectionText, lineNumber) {
    // Special case
    if (/^{{trad-trier}}\s*$/.test(sectionText))
      return "===== {{S|traductions à trier}} =====";

    sectionText = sectionText.replaceAll(/\s+$/g, "");

    let isTemplateS = false;
    // Get the section name using the old syntax
    let sectionCode = /{{-([^|}]+)-/.exec(sectionText);

    if (!sectionCode) {
      // Not found, use the new syntax
      sectionCode = /{{S\|\s*([^|}]+)\s*[|}]/.exec(sectionText);
      if (sectionCode !== null)
        isTemplateS = true;
      else {
        errors.push({
          invalidLine: sectionText,
          lineNumber: lineNumber,
          error: "Pas de nom de section reconnu",
        });
        return sectionText;
      }
    }

    // Formatting
    sectionCode = sectionCode[1].trim();
    sectionCode = sectionCode.charAt(0).toLowerCase() + sectionCode.substring(1);

    let flexion = false;
    // Check if the section is a flexion (old syntax)
    if (sectionCode.length >= 6 && sectionCode.indexOf("flex-") === 0) {
      sectionCode = sectionCode.substring(5);
      flexion = true;
    }

    // Remove "loc-" from the old section name
    if (sectionCode !== "loc-phr" && sectionCode.length >= 5 && sectionCode.indexOf("loc-") === 0)
      sectionCode = sectionCode.substring(4);

    // Handle old "s" parameter for "note" section type
    if (sectionCode === "note" && /\|s=[^|}]/.test(sectionText))
      sectionCode = "notes";

    /** @type {SectionData|WordTypeData} */
    let sectionData = getSectionData(sectionCode, true);
    // Section not recognized, push an error and return
    if (!sectionData) {
      sectionData = getWordTypeData(sectionCode, true);
      if (!sectionData) {
        errors.push({
          invalidLine: sectionText,
          lineNumber: lineNumber,
          error: "Nom de section inconnu : " + sectionCode
        });
        return sectionText;
      }
    }

    let langCode = null;
    if (sectionData.requiresLanguageCode) {
      if (isTemplateS) langCode = /{{S\|[^|}]+?\|([^|}=]+?)[|}]/.exec(sectionText);
      else langCode = /\|([^|}=]+?)[|}]/.exec(sectionText);
      if (langCode !== null) langCode = langCode[1].trim();
      else {
        errors.push({
          invalidLine: sectionText,
          lineNumber: lineNumber,
          error: "Code langue manquant"
        });
        return sectionText;
      }
    }

    let locution = null;
    if (isTemplateS) {
      if (/\|flexion[|}]/.test(sectionText))
        flexion = true;
      let match = /locution\s*=([^|}]+?)[|}]/.exec(sectionText);
      locution = match ? match[1].trim() : null;
    }

    let match = /num\s*=([^|}]+?)[|}]/.exec(sectionText);
    const num = match ? match[1].trim() : null;

    match = /clé\s*=([^|}]+?)[|}]/.exec(sectionText);
    const sortKey = match ? match[1].trim() : null;

    let gender = null;
    // Get "genre" parameter of {{-prénom-}}
    if (sectionCode === "prénom") {
      match = /genre\s*=([^|}]+?)[|}]/.exec(sectionText);
      gender = match ? match[1].trim() : null;
    }

    // Generate final text
    let formattedText = "{{S|" + (sectionData.aliasOf || sectionCode);
    if (langCode)
      formattedText += "|" + langCode;
    if (flexion)
      formattedText += "|flexion";
    if (locution)
      formattedText += "|locution=" + locution;
    if (gender)
      formattedText += "|genre=" + gender;
    if (sortKey)
      formattedText += "|clé=" + sortKey;
    if (num)
      formattedText += "|num=" + num;
    formattedText += "}}";
    const headerEquals = "=".repeat(sectionData.level);
    return `${headerEquals} ${formattedText} ${headerEquals}`;
  }

  let formattedText = text;
  let changesCount = 0;

  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/^{{-[^|}]+-[^}]*?}} *$/.test(lines[i]) // old templates
        || /^{{trad-trier}} *$/.test(lines[i])  // non-conventional old template
        || /^{{n-vern}} *$/.test(lines[i])			// idem
        || /^\s*=+\s*{{S\|[^|}]+[^}]*?}} *=+ *$/.test(lines[i])	// "S" template
    ) {
      const newText = formattedText.replace(lines[i], formatSection(lines[i], i + 1));
      if (newText !== text) {
        changesCount++;
        formattedText = newText;
      }
    }
  }

  // Remove blank lines before and after each section
  const t = formattedText
      .replaceAll(/[\r\n]+==/g, "\n\n==")
      .replaceAll(/==[\r\n]+/g, "==\n");
  if (t !== formattedText) {
    changesCount++;
    formattedText = t;
  }

  return {
    newText: formattedText,
    changesCount: changesCount,
    errors: errors,
  };
}

module.exports = {
  formatSections,
};

// </nowiki>
