(function () {
  /**
   * Ajoute les boutons donnés à coté du titre de la page courante.
   */
  function addButtons(buttons) {
    var heading = $("#firstHeading");
    buttons.forEach(function (button) {
      var text = button["text"];
      var title = button["title"];
      var span = $("<span>");
      span.addClass("noprint ancretitres");
      span.attr("style", "font-size: small; font-weight: normal; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; user-select: none; margin-left: 5px;");
      var link = $("<a>");
      link.text(text);
      link.attr("href", "#");
      link.attr("title", title);
      link.on("click", button["callback"]);
      span.append(link);

      heading.append(span);
    });
  }

  /**
   * Bouton pour afficher la page courante dans une autre langue dans une colonne à droite.
   */
  function match() {
    var language = prompt("Code de langue");
    if (language && language !== "fr") {
      window.location.href = "?match=" + language;
    }
  }

  /**
   * Bouton pour ouvrir le raccourcisseur d’URL pour la page courante.
   */
  function openShortener() {
    var pageName = window.location.href;
    window.open("https://meta.wikimedia.org/wiki/Special:UrlShortener?url=" + pageName, "_blank");
  }

  /**
   * Bouton pour purger le cache de la page courante.
   */
  function purgeCache() {
    window.location.href = "?action=purge";
  }

  addButtons([
    {
      "text": "Match",
      "title": "Afficher la page dans une autre langue dans une colonne",
      "callback": match,
    },
    {
      "text": "Shorten",
      "title": "URL shortener",
      "callback": openShortener,
    },
    {
      "text": "Purge",
      "title": "Purge le cache de la page.",
      "callback": purgeCache,
    },
  ]);
})();
