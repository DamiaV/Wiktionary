// [[Catégorie:JavaScript du Wiktionnaire|CategoryAboveAll.js]]
//* by [[Commons:User:Ianezz|Ianezz]] ([[Commons:Commons:Village_pump/Archive/2009Sep#CSS_placement_of_categories]]), based on [[:wikinews:Help:User_style#Moving_categories_to_top]]
"use strict";

function catsattop() {
  if (mw.config.get("wgCanonicalNamespace") === "Special") return;
  const catLinks = document.getElementById("catlinks");
  const bodyContent = document.getElementById("bodyContent");
  bodyContent.insertBefore(catLinks, bodyContent.childNodes[0]);
}

$(catsattop);
