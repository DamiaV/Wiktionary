/*
[[Catégorie:JavaScript du Wiktionnaire|FlecheHaut.js]]
 Auteur : Marc Mongenet */

jQuery(function PageHomeArrows() {
  for (var level = 2; level <= 6; ++level) {
    var h = document.getElementById('bodyContent').getElementsByTagName("h" + level);
    for (var i = 0; i < h.length; ++i) {
      var arrow = document.createElement("a");
      arrow.className = "noprint";
      arrow.appendChild(document.createTextNode(" ↑"));
      arrow.href = "javascript:window.scrollTo(0,0); void 0;";
      arrow.title = "Haut de page";
      h[i].appendChild(arrow);
    }
  }
});
