// [[Catégorie:JavaScript du Wiktionnaire|remove-pronunciation-links.js]]
"use strict";

console.log("Chargement de Gadget-wikt.remove-pronunciation-links.js…");

$("a span[class='API']").each((_, e) => {
  const $link = $(e).parent();
  if ($link.attr("href").includes("Annexe:Prononciation")) {
    $link.attr("href", null);
    $link.addClass("disabled-pron-link");
  }
});
