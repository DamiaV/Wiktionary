/**
 * Add a button in the wiki tools menu to list the subpages of the current page.
 * [[Catégorie:JavaScript du Wiktionnaire|SousPages.js]]
 */
// <nowiki>
console.log("Chargement de Gadget-SousPages.js…");
mw.util.addPortletLink(
    "p-tb",
    `/wiki/Special:PrefixIndex/${mw.config.get("wgPageName")}/`,
    "Sous-pages",
    "t-subpages",
    "Sous-pages de cette page"
);
// </nowiki>
