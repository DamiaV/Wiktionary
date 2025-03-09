/**
 * Place un bouton "afficher les sous-pages" dans la boite à outils.
 * Auteur initial : Delhovlyn
 * [[Catégorie:JavaScript du Wiktionnaire|SousPages.js]]
 * <nowiki>
 */
mw.loader.using("mediawiki.util", () => {
  console.log("Chargement de Gadget-SousPages.js…");
  const lienSouspages = `/wiki/Special:PrefixIndex/${mw.config.get("wgPageName")}/`;
  mw.util.addPortletLink("p-tb", lienSouspages, "Sous-pages", "t-subpages", "Sous-pages de cette page");
});
// </nowiki>
