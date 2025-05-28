/**
 * Add a button in the wiki tools menu to reload the current page in debug mode.
 * [[Catégorie:JavaScript du Wiktionnaire|ShowMessageNames.js]]
 */
// <nowiki>
console.log("Chargement de Gadget-ShowMessageNames.js…");
mw.util.addPortletLink(
    "p-tb",
    location.href.replace(location.hash, "") + (location.search ? "&" : "?") + "uselang=qqx",
    "Noms des messages",
    "t-messagenames",
    "Afficher les noms des messages à la place de leur texte"
);
// </nowiki>
