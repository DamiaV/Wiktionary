// <nowiki>
"use strict";

/**
 * @typedef {{
 *  level: number,
 *  name: string,
 *  requiresLanguageCode?: boolean,
 *  class?: string,
 *  parent?: string,
 *  title?: string,
 *  category?: string,
 *  aliasOf?: string,
 * }} SectionData
 */
/**
 * @typedef {{
 *   codes: Record<string, SectionData>,
 *   aliases: Record<string, string>,
 * }} SectionsData
 */
/**
 * @typedef {{
 *  name: string,
 *  namePlural: string,
 *  locution?: string,
 *  locutionPlural?: string,
 *  abbreviation?: string,
 *  aliasOf?: string,
 * }} WordTypeData
 */
/**
 * @typedef {{
 *  codes: Record<string, WordTypeData>,
 *  aliases: Record<string, string>,
 * }} WordTypesData
 */

/** @type {SectionsData} */
const sectionsData = require("./wikt.core.sections.json");
/** @type {WordTypesData} */
const wordTypesData = require("./wikt.core.word-types.json");

/** @type {Map<string, SectionData>} */
const sectionsDataMap = new Map();
/** @type {Map<string, WordTypeData>} */
const wordTypesDataMap = new Map();

for (const [code, sectionData] of Object.entries(sectionsData.codes))
  sectionsDataMap.set(code, sectionData);

for (const [code, targetCode] of Object.entries(sectionsData.aliases)) {
  const sectionData = sectionsDataMap.get(targetCode);
  if (sectionData) {
    const copy = Object.assign({}, sectionData, { aliasOf: targetCode });
    sectionsDataMap.set(code, copy);
  }
}

for (const [code, wordTypeData] of Object.entries(wordTypesData.codes))
  wordTypesDataMap.set(code, wordTypeData);

for (const [code, targetCode] of Object.entries(wordTypesData.aliases)) {
  const wordTypeData = wordTypesDataMap.get(targetCode);
  if (wordTypeData) {
    const copy = Object.assign({}, wordTypeData, { aliasOf: targetCode });
    wordTypesDataMap.set(code, copy);
  }
}

/**
 * Checks if aliases are allowed.
 * @param allowAliases {boolean} Whether to allow aliases.
 * @param data {{aliasOf: any}} The data object to check.
 * @returns {boolean} True if aliases are allowed or if data is not an alias.
 */
function checkAllowAliases(allowAliases, data) {
  return allowAliases || !data.aliasOf;
}

/**
 * Return the data for the given section code.
 * @param code {string} A section code.
 * @param allowAliases {boolean} If true, code aliases will also be considered.
 * @return {SectionData|null} The corresponding section’s data, or null if the code does not exist.
 */
function getSectionData(code, allowAliases = false) {
  const data = sectionsDataMap.get(code);
  return data && checkAllowAliases(allowAliases, data) ? data : null;
}

/**
 * Return all available section codes.
 * @return {string[]} The list of section codes in no particular order.
 */
function getSectionCodes(allowAliases = false) {
  return Array.from(
      sectionsDataMap.entries()
          .filter(([_, data]) => checkAllowAliases(allowAliases, data))
          .map(([code, _]) => code)
  );
}

/**
 * Return the data for the given word type code.
 * @param code {string} A word type code.
 * @param allowAliases {boolean} If true, code aliases will also be considered.
 * @return {WordTypeData|null} The corresponding word type’s data, or null if the code does not exist.
 */
function getWordTypeData(code, allowAliases = false) {
  const data = wordTypesDataMap.get(code);
  return data && checkAllowAliases(allowAliases, data) ? data : null;
}

/**
 * Return all available section codes.
 * @return {string[]} The list of section codes in no particular order.
 */
function getWordTypeCodes(allowAliases = false) {
  return Array.from(
      wordTypesDataMap.entries()
          .filter(([_, data]) => checkAllowAliases(allowAliases, data))
          .map(([code, _]) => code)
  );
}

// </nowiki>
/**
 * This module declares functions to get data about article sections
 * defined in [[MediaWiki:Gadget-wikt.core.sections.json]] and [[MediaWiki:Gadget-wikt.core.word-types.json]].
 * [[Catégorie:JavaScript du Wiktionnaire|!wikt.core.sections.json]]
 */
module.exports = {
  getSectionData,
  getSectionCodes,
  getWordTypeData,
  getWordTypeCodes,
};
