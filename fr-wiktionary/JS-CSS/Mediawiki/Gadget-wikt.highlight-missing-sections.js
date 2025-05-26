/**
 * (en)
 * This gadget highlights all blue links that feature an anchor which
 * corresponds to a language code but the pointed page does not
 * contain a section for this language code.
 **********************************************************************
 * (fr)
 * Ce gadget surligne tout les liens bleus possédant une ancre
 * correspondant à un code de langue mais dont la page pointée ne
 * contient pas de section pour le code en question.
 **********************************************************************
 * v1.0 2020-09-18 Initial version
 * v1.1 2021-10-17 Gadget now goes through redirections
 * v1.2 2025-05-23 Refactor; use new [[MediaWiki:Gadget-langues.json]]
 * v1.3 2025-05-26 Conversion into a module.
 **********************************************************************
 * [[Catégorie:JavaScript du Wiktionnaire|highlight missing sections]]
 */
// <nowiki>
"use strict";

const { getLanguages } = require("./languages.js");

console.log("Chargement de Gadget-wikt.highlight-missing-sections.js…");

window.wikt.gadgets.highlightMissingSections = {
  NAME: "Highlight Missing Sections",

  VERSION: "1.2",

  init: function () {
    this.api = new mw.Api({ userAgent: "Gadget-wikt.highlight-missing-sections/" + wikt.gadgets.highlightMissingSections.VERSION });
    const languagesData = getLanguages(true);
    this._onResponse(Array.from(languagesData.keys()));
  },

  /**
   * Callback function called when the GET query succeeds in init().
   * @param languages {Array<string>} The array containing language codes.
   * @private
   */
  _onResponse: function (languages) {
    const links = [];

    $(".mw-parser-output a:not(.new)").each((_, link) => {
      const $link = $(link);
      const match = /^https:\/\/fr\.wiktionary\.org\/wiki\/(.+?)#(.+)$/
          .exec($link.prop("href"));

      if (match) {
        const pageTitle = decodeURIComponent(match[1]);
        const namespace = pageTitle.substring(0, pageTitle.indexOf(":")).toLowerCase();
        const anchor = match[2];
        const namespaces = mw.config.get("wgNamespaceIds");

        // Vérifie que le lien pointe vers l’espace principal, pas vers un autre wiki et que l’ancre est un code de langue
        if (languages.includes(anchor) && !namespaces[namespace] && !languages.includes(namespace)) {
          links.push({
            $link: $link,
            pageTitle: pageTitle,
            langCode: anchor,
          });
        }
      }
    });

    // Cache pages’ code in case same page is linked several times
    const pageCodes = {};
    links.forEach((item) => {
      if (!pageCodes[item.pageTitle])
        this._getPageContent(item.pageTitle, content => {
          pageCodes[item.pageTitle] = content;
          this._highlightLink(item.$link, item.langCode, pageCodes[item.pageTitle]);
        });
      else this._highlightLink(item.$link, item.langCode, pageCodes[item.pageTitle]);
    });
  },

  /**
   * Retrieve the content of the given page, following redirections.
   * Does not check for redirection loops.
   * @param pageTitle {string} Page’s title.
   * @param callback {function} Function to call at the end of the asynchronous call.
   * Takes in the content of the page.
   * @private
   */
  _getPageContent: function (pageTitle, callback) {
    this.api.get({
      action: "query",
      prop: "revisions",
      titles: pageTitle,
      rvslots: "main",
      rvprop: "content",
    }).then((queryResult) => {
      let pageID;
      for (pageID in queryResult.query.pages)
        if (queryResult.query.pages.hasOwnProperty(pageID))
          break;
      const content = queryResult.query.pages[pageID]["revisions"][0]["slots"]["main"]["*"];
      const match = /^#REDIRECT\[\[([^\[]+)]]$/.exec(content.trim());
      if (match) this._getPageContent(match[1], callback);
      else callback(content);
    });
  },

  /**
   * Highlights the given link if the target page doesn’t
   * feature a section for the given language code.
   * @param $link {Object} The jQuery link object.
   * @param langCode {string} The language code.
   * @param pageCode {string} The code of the page the link points to.
   * @private
   */
  _highlightLink: function ($link, langCode, pageCode) {
    if (!pageCode.includes(`{{langue|${langCode}}}`)) {
      $link.addClass(["wikt-missing-entry", `wikt-missing-entry-${langCode}`]);
      $link.attr("title", $link.attr("title") + ` (section « ${langCode} » manquante)`);
    }
  },
};

wikt.gadgets.highlightMissingSections.init();
// </nowiki>
