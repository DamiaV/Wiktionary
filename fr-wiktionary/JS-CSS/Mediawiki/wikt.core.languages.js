// <nowiki>
"use strict";

/**
 * @typedef {{
 *  name: string,
 *  sortKey?: string,
 *  isGroup?: boolean,
 *  isSpecial?: boolean,
 *  wiktionaryExists?: boolean,
 *  hasPortal?: boolean,
 *  aliasOf?: string,
 *  wikimediaCode?: string,
 * }} LanguageData
 */
/**
 * @typedef {{codes: {[code: string]: LanguageData}, redirects: {[code: string]: string}}} LanguagesData
 */

/** @type {LanguagesData} */
const languagesData = require("./wikt.core.languages.json");
/** @type {Map<string, LanguageData>} */
const langDataMap = new Map();

for (const [code, langData] of Object.entries(languagesData.codes))
  langDataMap.set(code, langData);

for (const [code, targetCode] of Object.entries(languagesData.redirects)) {
  const langData = langDataMap.get(targetCode);
  if (langData) {
    const copy = Object.assign({}, langData, { aliasOf: targetCode });
    langDataMap.set(code, copy);
  }
}

/**
 * Checks if aliases are allowed.
 * @returns {boolean} True if aliases are allowed or if data is not an alias.
 */
function checkAllowAliases(allowAliases, data) {
  return allowAliases || !data.aliasOf;
}

/**
 * Checks if group or special languages are allowed.
 * @returns {boolean} True if languages marked as `isGroup` or `isSpecial` are allowed.
 */
function checkAllowSpecial(allowSpecial, data) {
  return allowSpecial || !data.isGroup && !data.isSpecial;
}

/**
 * Return a map of all defined languages’ data.
 * @param allowAliases {boolean} If true, code aliases will also be returned.
 * @param allowSpecial {boolean} If true, languages marked as `isGroup` or `isSpecial` will also be returned.
 * @returns {Map<string, LanguageData>} The data for all defined languages.
 */
function getLanguages(allowAliases = false, allowSpecial = false) {
  const copy = new Map();
  for (const [code, data] of langDataMap)
    if (checkAllowAliases(allowAliases, data) && checkAllowSpecial(allowSpecial, data))
      copy.set(code, data);
  return copy;
}

/**
 * Return a map of language to code data.
 * @param allowSpecial {boolean} If true, languages marked as `isGroup` or `isSpecial` will also be returned.
 * @returns {Map<string, string>} The pairs <language, code>.
 */
function getLanguageToCodeMap(allowSpecial = false) {
  const copy = new Map();
  for (const [code, data] of Object.entries(languagesData.codes))
    if (checkAllowSpecial(allowSpecial, data))
      copy.set(data.name, code);
  return copy;
}

/**
 * Return a map of all defined languages’ names.
 * @param allowAliases {boolean} If true, code aliases will also be returned.
 * @param allowSpecial {boolean} If true, languages marked as `isGroup` or `isSpecial` will also be returned.
 * @returns {Map<string, string>} The names for all defined languages.
 */
function getLanguagesNames(allowAliases = false, allowSpecial = false) {
  const names = new Map();
  for (const [code, data] of getLanguages(allowAliases, allowSpecial))
    names.set(code, data.name);
  return names;
}

/**
 * Return the language data for the given code.
 * @param code {string} The language code to get the data of.
 * @param allowAliases {boolean} If true, code aliases will also be considered.
 * @param allowSpecial {boolean} If true, languages marked as `isGroup` or `isSpecial` will also be considered.
 * @return {LanguageData|null} The language data for the given code, or `null` if it is invalid.
 */
function getLanguage(code, allowAliases = false, allowSpecial = false) {
  const data = langDataMap.get(code);
  return data && checkAllowAliases(allowAliases, data) && checkAllowSpecial(allowSpecial, data) ? data : null;
}

/**
 * Return the language name for the given code.
 * @param code {string} The language code to get the name of.
 * @param allowAliases {boolean} If true, code aliases will also be considered.
 * @param allowSpecial {boolean} If true, languages marked as `isGroup` or `isSpecial` will also be considered.
 * @return {string|null} The language name for the given code, or `null` if it is invalid.
 */
function getLanguageName(code, allowAliases = false, allowSpecial = false) {
  const languageData = getLanguage(code, allowAliases, allowSpecial);
  return languageData ? languageData.name : null;
}

// </nowiki>
/**
 * This module declares functions to get data about languages
 * defined in [[MediaWiki:Gadget-wikt.core.languages.json]].
 * [[Catégorie:JavaScript du Wiktionnaire|!wikt.core.languages.js]]
 */
module.exports = {
  getLanguages,
  getLanguageToCodeMap,
  getLanguagesNames,
  getLanguage,
  getLanguageName,
};
