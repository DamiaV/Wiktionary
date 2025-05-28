// <nowiki>
"use strict";

/**
 * TemplateScript adds configurable templates and scripts to the sidebar, and adds an example regex editor.
 * @see [[meta:TemplateScript]]
 * @update-token [[File:Pathoschild/templatescript.js]]
 */
mw.loader.load("https://tools-static.wmflabs.org/meta/scripts/pathoschild.templatescript.js");
// Améliore la liste des pages liées.
mw.loader.load("https://fr.wiktionary.org/wiki/User:Sebleouf/linksheredeluxe.js?action=raw&ctype=text/javascript");

if (mw.config.get("skin") === "vector-2022")
  $("#ca-more-edit a").removeAttr("accesskey"); // Remove duplicate "e" access key

const blacklist = [
  "fr.wiktionary.org",
];

if (!blacklist.includes(window.location.hostname)) {
  mw.loader.using(["mediawiki.util", "mediawiki.api"], () => {
    mw.loader.load("https://fr.wiktionary.org/wiki/MediaWiki:Gadget-AncreTitres.js?action=raw&ctype=text/javascript");
    mw.loader.load("https://fr.wiktionary.org/wiki/MediaWiki:Gadget-DebugMode.js?action=raw&ctype=text/javascript");
    mw.loader.load("https://fr.wiktionary.org/wiki/MediaWiki:Gadget-OngletPurge.js?action=raw&ctype=text/javascript");
    mw.loader.load("https://fr.wiktionary.org/wiki/MediaWiki:Gadget-ShowMessageNames.js?action=raw&ctype=text/javascript");
    mw.loader.load("https://fr.wiktionary.org/wiki/MediaWiki:Gadget-SousPages.js?action=raw&ctype=text/javascript");
  });
}
// </nowiki>
