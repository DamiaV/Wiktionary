mw.loader.using(["jquery.ui"], function () {
  // Gadget activé uniquement sur les pages de l’espace principal (0).
  if (mw.config.get("wgNamespaceNumber") === 0) {
    var item = mw.config.get("wgRelevantPageName");
    var variable = "l";
    var limit = 10;

    // Envoi d’une requête get asynchrone vers le serveur de requêtage de Wikidata
    $.get(
        // Requête HTTP
        "https://query.wikidata.org/sparql",
        // Données de la requête HTTP
        {
          // Requête SPARQL
          "query": (
              'SELECT ?{0} WHERE {' +
              '?{0} a ontolex:LexicalEntry;' +
              'wikibase:lemma ?lemma . FILTER regex (?lemma, "^{1}$")' +
              '} LIMIT {2}').format(variable, item, limit),
          // Format des données du résultat
          "format": "json",
        },
        // Fonction appelée à la réception de la réponse du serveur
        function (result) {
          // On teste si la requête SPARQL a retourné un résultat
          if (result.results.bindings.length) {
            var list, timeless = false;

            // Timeless
            var timelessSection = $("#p-pagemisc");
            if (timelessSection.length) {
              var section = $(
                  '<div role="navigation" class="mw-portlet" id="p-lexemes" aria-labelledby="p-lexemes-label">' +
                  '<h3 id="p-lexemes-label" lang="fr" dir="ltr">Lexèmes</h3>' +
                  '<div class="mw-portlet-body">' +
                  '<ul lang="fr" dir="ltr"></ul>' +
                  '</div>' +
                  '</div>'
              );
              timelessSection.after(section);
              list = $("#p-lexemes ul");
              timeless = true;
            } // Autres
            else if ($("#p-tb").length) {
              list = $("#p-tb ul");
            }

            // On parcours les lexèmes
            for (var i = 0; i < result.results.bindings.length; i++) {
              var item = result.results.bindings[i];
              var href = item[variable].value;
              var lexeme = href.substring(href.lastIndexOf("/") + 1);
              var id = "t-lexeme-{0}".format(lexeme);
              var text;

              if (timeless) {
                text = "<span>{0}</span>".format(lexeme);
              }
              else {
                text = "Lexème ({0})".format(lexeme);
              }
              if (list) {
                // Ajout de l’item dans la liste du menu
                // noinspection HtmlUnknownTarget
                list.append('<li><a id="{0}" href="{1}">{2}</a></li>'.format(id, href, text));
              }
            }
          }
        },
        // Type des données retournées par le serveur
        "json"
    );
  }
});
