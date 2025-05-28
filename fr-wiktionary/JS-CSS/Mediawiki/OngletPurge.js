/**
 * Adds a button in the page tools menu to purge the current page.
 *
 * @see https://www.mediawiki.org/wiki/API:Purge
 * [[Catégorie:JavaScript du Wiktionnaire|OngletPurge.js]]
 */
// <nowiki>
(() => {
  if (mw.config.get("wgNamespaceNumber") < 0 || $("#ca-purge").length)
    return;

  const skin = mw.config.get("skin");
  const node = mw.util.addPortletLink(
      "p-cactions",
      mw.util.getUrl(null, { action: "purge" }),
      ["monobook", "modern"].includes(skin) ? "purger" : "Purger",
      "ca-purge",
      "Purger le cache de la page",
      "*"
  );
  $(node).click((e) => {
    new mw.Api({ userAgent: "Gadget-OngletPurge" })
        .post({
          action: "purge",
          titles: mw.config.get("wgPageName"),
          forcelinkupdate: 1
        })
        .done(() => {
          location.reload();
        })
        .fail(() => {
          mw.notify("Échec de la purge", { type: "error" });
        });
    e.preventDefault();
  });
})();
// </nowiki>
