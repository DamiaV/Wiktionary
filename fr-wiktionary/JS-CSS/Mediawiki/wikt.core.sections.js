// <nowiki>
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

// </nowiki>
/**
 * This module declares functions to get data about article sections
 * defined in [[MediaWiki:Gadget-wikt.core.sections.json]].
 * [[Catégorie:JavaScript du Wiktionnaire|!wikt.core.sections.json]]
 */
module.exports = {
  getSectionData,
};
