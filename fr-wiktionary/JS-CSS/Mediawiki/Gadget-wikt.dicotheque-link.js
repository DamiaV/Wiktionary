/**
 * (fr) Ajoute un lien vers la Dicothèque si la page contient
 * une section de langue parmi celles supportées par la Dicothèque.
 * ----------------------------------------------------------------
 * (en) Adds a link to the Dicothèque if the page contains at least
 * one language section among those supported by the Dicothèque.
 * ----------------------------------------------------------------
 * [[Catégorie:JavaScript du Wiktionnaire|dicotheque-link.js]]
 */
"use strict";

(() => {
  console.log("Chargement de Gadget-wikt.dicotheque-link.js…");

  const supportedLanguages = ["fr", "frm", "br", "lorrain", "wa"];
  if (supportedLanguages.every((code) => $(`#${code}`).length === 0)) {
    console.log("[Gadget-wikt.dicotheque-link.js] Aucune section de langue supportée n’a été trouvée.");
    return;
  }

  const entry = mw.config.get("wgTitle");
  $.get(
      "https://api.dicotheque.org/v1/entries/" + encodeURIComponent(entry),
      {
        strict: "true",
      },
      (data) => {
        if (!data.length) {
          console.log("[Gadget-wikt.dicotheque-link.js] Aucune entrée dans la dicothèque.");
          return;
        }
        const element = mw.util.addPortletLink(
            "p-tb",
            "https://dicotheque.org/search/" + encodeURIComponent(entry),
            "Dicothèque",
            "t-dicotheque",
            "Voir dans la Dicothèque (s’ouvre dans un nouvel onglet)"
        );
        if (element)
          $(element).find("a").attr("target", "_blank");
      },
      "json"
  );
})();
