/**
 * (fr)
 * Ce gadget masque les traductions qui ne sont pas dans la liste définie
 * dans le filterTranslations.js de l’utilisateur. Voir [[Aide:Gadget-FilterTranslations]].
 * ----
 * (en)
 * This gadget filters out translations that are not listed in the user’s
 * filterTranslations.js. See [[Aide:Gadget-FilterTranslations]] (fr).
 * ----
 * [[Catégorie:JavaScript du Wiktionnaire|FilterTranslations.js]]
 */
"use strict";

console.log("Chargement de Gadget-FilterTranslations.js…");

(() => {
  const translations = [];
  let hidden = false;
  let $button = null;

  // Variable should be declared in user page.
  // noinspection JSUnresolvedReference
  if (Array.isArray(window.ft_whitelist)) {
    // noinspection JSUnresolvedReference
    /** @type {string[]} */
    const whitelist = window.ft_whitelist;
    console.log(`Found ${whitelist.length} languages in whitelist.`);

    $button = $('<button style="position:fixed;bottom:0;left:0"></button>');
    $button.click(() => {
      if (hidden) show();
      else hide();
    });
    $(document.body).append($button);

    $(".translations > ul > li").each((_, e) => {
      const $item = $(e);
      const match = /trad-([\w-]+)/.exec($item.find("span").prop("class"));
      if (match && !whitelist.includes(match[1]))
        translations.push($item);
    });
    hide();
  }

  function hide() {
    translations.forEach(($item) => {
      $item.hide();
    });
    $button.text("Afficher toutes les traductions");
    hidden = true;
  }

  function show() {
    translations.forEach(($item) => {
      $item.show();
    });
    $button.text("Filtrer les traductions");
    hidden = false;
  }
})();
