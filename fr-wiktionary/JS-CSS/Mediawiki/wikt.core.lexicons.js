// <nowiki>
"use strict";

/**
 * @typedef {{
 *  description: string,
 *  determiner: string,
 *  parents?: string[],
 * }} LexiconData
 */

/** @type {Record<string, LexiconData>} */
const lexiconsData = require("./wikt.core.lexicons.json");
/** @type {Map<string, LexiconData>} */
const lexiconsDataMap = new Map(Object.entries(lexiconsData));

/**
 * Return the data for the given lexicon code.
 * @param code {string} A lexicon code.
 * @returns {LexiconData|null} The corresponding lexicon’s data, or null if the code does not exist.
 */
function getLexiconData(code) {
  return lexiconsDataMap.get(code);
}

/**
 * Return all available lexicon codes.
 * @return {string[]} The list of lexicon codes in no particular order.
 */
function getLexiconCodes() {
  return Array.from(lexiconsDataMap.keys());
}

// </nowki>

/**
 * This module declares functions to get data about lexicons
 * defined in [[MediaWiki:Gadget-wikt.core.lexicons.json]].
 * [[Catégorie:JavaScript du Wiktionnaire|!wikt.core.lexicons.json]]
 */
module.exports = {
  getLexiconData,
  getLexiconCodes,
};
