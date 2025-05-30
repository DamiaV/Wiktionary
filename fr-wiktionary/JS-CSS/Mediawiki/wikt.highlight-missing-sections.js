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
 * v1.0 2020-09-18 Initial version.
 * v1.1 2021-10-17 Gadget now goes through redirections.
 * v1.2 2025-05-23 Refactor; use new [[MediaWiki:Gadget-wikt.core.languages.json]].
 * v1.3 2025-05-26 Conversion into a module.
 * v1.4 2025-05-30 Refactor: flatten structure.
 **********************************************************************
 * [[Catégorie:JavaScript du Wiktionnaire|highlight missing sections]]
 */
// <nowiki>
"use strict";

const { getLanguages } = require("./wikt.core.languages.js");

console.log("Chargement de Gadget-wikt.highlight-missing-sections.js…");

const VERSION = "1.4";
const api = new mw.Api({ userAgent: "Gadget-wikt.highlight-missing-sections/" + VERSION });
const languages = getLanguages(true);

/**
 * Retrieve the content of the given page, following redirections.
 * Does not check for redirection loops.
 * @param pageTitle {string} Page’s title.
 * @param callback {function} Function to call at the end of the asynchronous call.
 * Takes in the content of the page.
 */
function getPageContent(pageTitle, callback) {
  api.get({
    action: "query",
    prop: "revisions",
    titles: pageTitle,
    rvslots: "main",
    rvprop: "content",
  }).then((queryResult) => {
    let page;
    // Get first (and only) entry
    // noinspection LoopStatementThatDoesntLoopJS
    for (page of Object.values(queryResult.query.pages))
      break;
    const content = page["revisions"][0]["slots"]["main"]["*"];
    const match = /^#REDIRECT\[\[([^\[]+)]]$/.exec(content.trim());
    if (match) getPageContent(match[1], callback);
    else callback(content);
  });
}

/**
 * Highlights the given link if the target page doesn’t
 * feature a section for the given language code.
 * @param $link {Object} The jQuery link object.
 * @param langCode {string} The language code.
 * @param pageCode {string} The code of the page the link points to.
 */
function highlightLink($link, langCode, pageCode) {
  if (!pageCode.includes(`{{langue|${langCode}}}`)) {
    $link.addClass(["wikt-missing-entry", `wikt-missing-entry-${langCode}`]);
    $link.attr("title", `${$link.attr("title")} (section « ${langCode} » manquante)`);
  }
}

/** @type {{$link: any, pageTitle: string, langCode: string}[]} */
const links = [];
const serverName = mw.config.get("wgServerName");
const namespaces = mw.config.get("wgNamespaceIds");

$(".mw-parser-output a:not(.new)").each((_, link) => {
  const $link = $(link);
  const href = $link.prop("href");
  if (!href) return;
  const url = new URL(href);
  const hash = decodeURIComponent(url.hash.substring(1)); // Strip #

  if (url.hostname === serverName &&
      url.pathname.startsWith("/wiki/") &&
      languages.has(hash)) {
    const pageTitle = decodeURIComponent(url.pathname.substring(6));
    const namespace = pageTitle.substring(0, pageTitle.indexOf(":")).toLowerCase();

    // Check that the link points to the main namespace, and that the namespace is not a language code.
    if (!namespaces[namespace] && !languages.has(namespace)) {
      links.push({
        $link: $link,
        pageTitle: pageTitle,
        langCode: hash,
      });
    }
  }
});

// Cache pages’ code in case same page is linked several times
const pageCodes = {};
links.forEach((item) => {
  if (!pageCodes[item.pageTitle])
    getPageContent(item.pageTitle, content => {
      pageCodes[item.pageTitle] = content;
      highlightLink(item.$link, item.langCode, pageCodes[item.pageTitle]);
    });
  else highlightLink(item.$link, item.langCode, pageCodes[item.pageTitle]);
});
// </nowiki>
