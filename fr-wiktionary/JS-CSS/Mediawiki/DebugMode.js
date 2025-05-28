/**
 * Add a button in the wiki tools menu to reload the current page in debug mode.
 * [[Catégorie:JavaScript du Wiktionnaire|DebugMode.js]]
 */
// <nowiki>
console.log("Chargement de Gadget-DebugMode.js…");
mw.util.addPortletLink(
    "p-cactions",
    location.href.replace(location.hash, "") + (location.search ? "&" : "?") + "debug=true",
    "Mode debug",
    "t-debugmode",
    "Recharger la page en mode debug"
);
// </nowiki>
