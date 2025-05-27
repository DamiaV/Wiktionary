// [[Catégorie:JavaScript du Wiktionnaire|core.sections.json]]
"use strict";

/**
 * @typedef {{level: number, name: string, requiresLanguageCode?: boolean}} SectionData
 */

/**
 * @type {{[code: string]: SectionData}}
 */
const sectionsData = require("./wikt.core.sections.json"); // TODO generate with bot

/**
 * Return the data for the given section code.
 * @param code {string} A section code.
 * @return {SectionData|null} The corresponding section’s data, or null if the code does not exist.
 */
function getSectionData(code) {
  return sectionsData[code] || null;
}

module.exports = {
  getSectionData,
};
