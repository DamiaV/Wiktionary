// [[Catégorie:JavaScript du Wiktionnaire|CategoryAboveAll.js]]
//* by [[Commons:User:Ianezz|Ianezz]] ([[Commons:Commons:Village_pump/Archive/2009Sep#CSS_placement_of_categories]]), based on [[:wikinews:Help:User_style#Moving_categories_to_top]]

function catsattop() {
  if (mw.config.get('wgCanonicalNamespace') == "Special") return;
  var cats = document.getElementById('catlinks');
  var bc = document.getElementById('bodyContent');
  bc.insertBefore(cats, bc.childNodes[0]);
}

$(catsattop);
