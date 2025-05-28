// [[Catégorie:JavaScript du Wiktionnaire|FlecheHaut.js]]
// <nowiki>
(() => {
  for (var level = 2; level <= 6; ++level) {
    const headers = document.getElementById("bodyContent")
        .getElementsByTagName("h" + level);
    for (const header of headers) {
      const arrow = document.createElement("a");
      arrow.className = "noprint";
      arrow.style.userSelect = "none";
      arrow.appendChild(document.createTextNode(" ↑"));
      arrow.href = "#";
      arrow.title = "Haut de page";
      arrow.onclick = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        return false;
      }
      header.appendChild(arrow);
    }
  }
})();
// </nowiki>