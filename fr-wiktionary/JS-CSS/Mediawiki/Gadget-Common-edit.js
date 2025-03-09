/**
 * [[Catégorie:JavaScript du Wiktionnaire|common edit]]
 * Outils spécifiques à la modification des pages
 */

/**
 * Objet contenant les fonctions et variables pour les gadgets du Wiktionnaire.
 */
window.wikt = window.wikt || {
  edit: {},
};

/************************************
 * Caractères spéciaux
 ************************************
 * Ajouter un menu pour choisir des sous-ensembles de caractères spéciaux.
 * Ecrit par Zelda, voir sur [[w:Utilisateur:Zelda/Edittools.js]].
 * Remplace l'ancienne fonction par une variante plus rapide.
 */

/**
 * Ajoute un menu déroulant permettant de choisir un jeu de caractères spéciaux
 * Les caractères spéciaux sont définis dans Mediawiki:Edittools
 */
if (mw.config.get('wgAction') === 'edit' || mw.config.get('wgAction') === 'submit') {
  $(addCharSubsetMenu);
}

/*
 * Utilisation :
 *
 * Utilisateur:Kiminou1/common.js
 * Utilisateur:Kiminou1/vector.js
 */
function addCharSubsetMenu() {
  var specialchars = $("#specialcharsets");
  if (specialchars.length === 0) {
    return;
  }

  // Construction du menu de selection
  var $select = $('<select>')
      .css('display', 'inline')
      .click(function () {
        chooseCharSubset($(this).val());
      });

  // Ajout des options au menu
  $(specialchars)
      .find("p")
      .each(function () {
        var $opt = $("<option>")
            .val($(this).attr("title"))
            .text($(this).attr("title"));
        $($select).append($opt);
      });

  $(specialchars).prepend($select);
  $(specialchars).show();

  /* default subset - try to use a cookie some day */
  var defaultsub = $("#specialcharsets p").first().attr('title');
  if ($.cookie('Commonedit_selected')) {
    defaultsub = $.cookie('Commonedit_selected');
    $("#specialcharsets select option[value='" + defaultsub + "']").attr("selected", true);
  }
  chooseCharSubset(defaultsub);
}

wikt.edit.addCharSubsetMenu = addCharSubsetMenu;

/*
 * Utilisation :
 *
 * Utilisateur:Kiminou1/common.js
 * Utilisateur:Kiminou1/vector.js
 */
/**
 * Affichage du jeu de caractères sélectionné
 */
function chooseCharSubset(name) {
  $.cookie('Commonedit_selected', name, {path: "/;SameSite=Lax"});
  $("#specialcharsets p[title='" + name + "']").each(function () {
    initializeCharSubset(this);
  }).css('display', 'inline').show();
  $("#specialcharsets p").not("[title='" + name + "']").hide();
}

wikt.edit.chooseCharSubset = chooseCharSubset;

/*
 * Utilisation :
 *
 * Aucune
 */
/**
 * Initialisation du jeu de caractères sélectionné
 * Paramètre : paragraphe contenant le jeu à initialiser. Initialise tous les
 * caractères contenus dans les sous-spans du paragraphe
 */
function initializeCharSubset(p) {
  // recherche des sous-elements de type span à traiter
  var spans = $(p).find("span");
  if (!spans) return;

  // regexp pour echapper les caractères JS spéciaux : \ et '
  var re = new RegExp("([\\\\'])", "g");
  // gestion du caractère d'échappement '\'
  var escapeRe = new RegExp("[^\\\\](\\\\\\\\)*\\\\$", "g");
  var unescapeRe = new RegExp("\\\\\\\\", "g");

  // traitement des spans du paragraphe
  for (var j = 0; j < spans.length; j++) {
    // span deja traité
    if (spans[j].childNodes.length === 0 || spans[j].childNodes[0].nodeType !== 3) continue;

    // On parse le contenu du span
    var chars = spans[j].childNodes[0].nodeValue.split(" ");
    for (var k = 0; k < chars.length; k++) {
      var a = document.createElement("a");
      var tags = chars[k];

      // regroupement des mots se terminant par un espace protégé par un \
      while (k < chars.length && chars[k].match(escapeRe)) {
        k++;
        tags = tags.substr(0, tags.length - 1) + " " + chars[k];
      }

      // création du lien insertTag(tagBegin, tagEnd, defaultValue) en protegeant les caractères JS \ et '
      tags = (tags.replace(unescapeRe, "\\")).split("+");
      var tagBegin = tags[0].replace(re, "\\$1");
      var tagEnd = tags.length > 1 ? tags[1].replace(re, "\\$1") : "";
      var defaultValue = tags.length > 2 ? tags[2].replace(re, "\\$1") : "";
      a.href = "javascript:insertTags('" + tagBegin + "','" + tagEnd + "', '" + defaultValue + "')";
      //a.href="#";
      //eval("a.onclick = function() { insertTags('" + tagBegin + "','" + tagEnd + "', '" + defaultValue + "'); return false; }");

      a.appendChild(document.createTextNode((tagBegin + tagEnd).replace(unescapeRe, "\\")));
      spans[j].appendChild(a);
      spans[j].appendChild(document.createTextNode(" "));
    }
    // suppression de l'ancien contenu
    spans[j].removeChild(spans[j].firstChild);
  }
}

/*
 * Utilisation :
 *
 * Aucune
 */
/**
 * Permet d'ajouter d'un jeu de caractères spéciaux dans le menu déroulant
 * paramètres :
 * - nom du jeu de caractères
 * - contenu HTML. Les caractères spéciaux doivent être dans des spans
 * exemple : "caractères : <span>â ê î ô û</span>"
 */
function addSpecialCharsetHTML(title, charsHTML) {
  var specialchars = document.getElementById('specialcharsets');
  if (!specialchars) return;

  // Ajout des caractères spéciaux. Les liens seront initialisé par initializeCharSubset()
  // lors de la sélection
  var specialcharsets = document.getElementById('specialcharsets');
  var p = document.createElement("p");
  p.style.display = "none";
  p.title = title;
  p.innerHTML = charsHTML;
  specialcharsets.appendChild(p);
}

/*
 * Utilisation :
 *
 * Aucune
 */
/**
 * Permet d'ajouter d'un jeu de caractères spéciaux dans le menu déroulant
 * paramètres :
 * - nom du jeu de caractères
 * - caractères spéciaux
 * exemple d'utilisation : addSpecialCharset("Français", "â ê î ô û");
 */
function addSpecialCharset(title, chars) {
  addSpecialCharsetHTML(title, "<span>" + chars + "</span>");
}
