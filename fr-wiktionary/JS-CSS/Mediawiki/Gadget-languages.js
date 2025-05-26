window.wikt = window.wikt || {};

/**
 * @typedef {{
 *  name: string,
 *  sortKey?: string,
 *  isGroup?: boolean,
 *  isSpecial?: boolean,
 *  wiktionaryExists?: boolean,
 *  hasPortal?: boolean,
 *  aliasOf?: string,
 * }} LangData
 */

/**
 * This module declares functions to get data about languages defined in the Wiktionnaire.
 */
window.wikt.languages = {
  /**
   * Initialize this module’s data by querying the languages’ data from [[MediaWiki:Gadget-langues.json]].
   * @param onReady {() => void} A function to be called when the data has been loaded.
   */
  init: function (onReady) {
    /**
     * @type {Map<string, LangData>}
     */
    this.languagesData = new Map();

    return $.getJSON(
        "/wiki/MediaWiki:Gadget-langues.json",
        {
          action: "raw",
        }
    ).then(
        /** @param data {{codes: {[key: string]: LangData}, redirects: {[key: string]: string}}} */
        (data) => {
          for (const [code, langData] of Object.entries(data.codes))
            this.languagesData.set(code, langData);

          for (const [code, targetCode] of Object.entries(data.redirects)) {
            const langData = this.languagesData.get(targetCode);
            if (langData) {
              const copy = Object.assign({}, langData, {aliasOf: targetCode});
              this.languagesData.set(code, copy);
            }
          }

          onReady();
        }
    );
  },

  /**
   * Return a map of all defined languages’ data.
   * @param allowAliases {boolean} If true, code aliases will also be returned.
   * @param allowSpecial {boolean} If true, languages marked as `isGroup` or `isSpecial` will also be returned.
   * @returns {Map<string, LangData>} The data for all defined languages.
   */
  getLanguages: function (allowAliases = false, allowSpecial = false) {
    const copy = new Map();
    for (const [code, data] of this.languagesData)
      if ((allowAliases || !data.aliasOf) && (allowSpecial || !data.isGroup && !data.isSpecial))
        copy.set(code, data);
    return copy;
  },

  /**
   * Return a map of all defined languages’ names.
   * @param allowAliases {boolean} If true, code aliases will also be returned.
   * @param allowSpecial {boolean} If true, languages marked as `isGroup` or `isSpecial` will also be returned.
   * @returns {Map<string, string>} The names for all defined languages.
   */
  getLanguagesNames: function (allowAliases = false, allowSpecial = false) {
    const names = new Map();
    for (const [code, data] of this.getLanguages(allowAliases, allowSpecial))
      names.set(code, data.name);
    return names;
  },

  /**
   * Return the language data for the given code.
   * @param code {string} The language code to get the data of.
   * @param allowAliases {boolean} If true, code aliases will also be considered.
   * @param allowSpecial {boolean} If true, languages marked as `isGroup` or `isSpecial` will also be considered.
   * @return {LangData|null} The language data for the given code, or `null` if it is invalid.
   */
  getLanguage: function (code, allowAliases = false, allowSpecial = false) {
    const data = this.languagesData.get(code);
    return data && (allowAliases || !data.aliasOf) && (allowSpecial || !data.isGroup && !data.isSpecial) ? data : null;
  },

  /**
   * Return the language name for the given code.
   * @param code {string} The language code to get the name of.
   * @param allowAliases {boolean} If true, code aliases will also be considered.
   * @param allowSpecial {boolean} If true, languages marked as `isGroup` or `isSpecial` will also be considered.
   * @return {string|null} The language name for the given code, or `null` if it is invalid.
   */
  getLanguageName: function (code, allowAliases = false, allowSpecial = false) {
    const languageData = this.getLanguage(code, allowAliases, allowSpecial);
    return languageData ? languageData.name : null;
  },
};
