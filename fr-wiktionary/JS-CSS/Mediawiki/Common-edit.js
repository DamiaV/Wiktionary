/**
 * Ajoute un menu sous la zone d’édition pour choisir des sous-ensembles de caractères spéciaux.
 * [[Catégorie:JavaScript du Wiktionnaire|common edit]]
 */
// <nowiki>
"use strict";

(() => {
  /*
   * Ajoute un menu déroulant permettant de choisir un jeu de caractères spéciaux
   * Les caractères spéciaux sont définis dans Mediawiki:Edittools
   */
  if (mw.config.get("wgAction") === "edit" || mw.config.get("wgAction") === "submit")
    $(addCharSubsetMenu);

  function addCharSubsetMenu() {
    const specialchars = $("#specialcharsets");
    if (specialchars.length === 0) return;

    // Construction du menu de selection
    const $select = $("<select>")
        .css("display", "inline")
        .click(function () {
          chooseCharSubset($(this).val());
        });

    // Ajout des options au menu
    $(specialchars)
        .find("p")
        .each(function () {
          const $opt = $("<option>")
              .val($(this).attr("title"))
              .text($(this).attr("title"));
          $($select).append($opt);
        });

    $(specialchars).prepend($select);
    $(specialchars).show();

    let defaultsub = $("#specialcharsets p").first().attr("title");
    if ($.cookie("Commonedit_selected")) {
      defaultsub = $.cookie("Commonedit_selected");
      $(`#specialcharsets select option[value='${defaultsub}']`).attr("selected", true);
    }
    chooseCharSubset(defaultsub);
  }

  /**
   * Affichage du jeu de caractères sélectionné
   */
  function chooseCharSubset(name) {
    $.cookie("Commonedit_selected", name, { path: "/;SameSite=Lax" });
    $(`#specialcharsets p[title='${name}']`).each(function () {
      initializeCharSubset(this);
    }).css("display", "inline").show();
    $("#specialcharsets p").not(`[title='${name}']`).hide();
  }

  /**
   * Initialisation du jeu de caractères sélectionné
   * Paramètre : paragraphe contenant le jeu à initialiser. Initialise tous les
   * caractères contenus dans les sous-spans du paragraphe
   */
  function initializeCharSubset(p) {
    // recherche des sous-elements de type span à traiter
    const spans = $(p).find("span");
    if (!spans.length) return;

    const quoteAndBackslashRegex = /([\\'])/g;
    const escapeBackslashRegex = /[^\\](\\\\)*\\$/g;
    const unescapeBackslashRegex = /\\\\/g;

    // traitement des spans du paragraphe
    for (const span of spans) {
      // span deja traité
      if (span.childNodes.length === 0 || span.childNodes[0].nodeType !== 3) continue;

      // On parse le contenu du span
      const chars = span.childNodes[0].nodeValue.split(" ");
      for (let k = 0; k < chars.length; k++) {
        const a = document.createElement("a");
        const charset = chars[k];
        let tags = charset;

        // regroupement des mots se terminant par un espace protégé par un \
        while (k < chars.length && charset.match(escapeBackslashRegex)) {
          k++;
          tags = tags.substring(0, tags.length - 1) + " " + charset;
        }

        tags = tags.replace(unescapeBackslashRegex, "\\").split("+");
        const tagBegin = tags[0].replace(quoteAndBackslashRegex, "\\$1");
        const tagEnd = tags.length > 1 ? tags[1].replace(quoteAndBackslashRegex, "\\$1") : "";
        const defaultValue = tags.length > 2 ? tags[2].replace(quoteAndBackslashRegex, "\\$1") : "";
        a.href = "javascript:insertTags('" + tagBegin + "','" + tagEnd + "', '" + defaultValue + "')";

        a.appendChild(document.createTextNode((tagBegin + tagEnd).replace(unescapeBackslashRegex, "\\")));
        span.appendChild(a);
        span.appendChild(document.createTextNode(" "));
      }
      span.removeChild(span.firstChild);
    }
  }
})();
// </nowiki>
