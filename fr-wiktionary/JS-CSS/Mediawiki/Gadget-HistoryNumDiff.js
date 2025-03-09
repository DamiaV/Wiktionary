/**
 [[Catégorie:JavaScript du Wiktionnaire|HistoryNumDiff.js]]
 * Historique amélioré
 *
 * Indique le nombre de caractères ajoutés/supprimés à la place de la taille de la version,
 * comme pour la Liste de suivi ou les Modifications récentes.
 *
 * Auteur : The RedBurn
 */

function getNumFromString(i, eltsByTag) {
  var regString = /\((.*) bytes?\)/;
  var resultString;
  var string = eltsByTag.item(i).innerHTML;
  var separator = /[^0-9]/g;
  var empty = "(empty)";

  if (wgUserLanguage == "fr") {
    regString = /\((.*) octets?\)/;
    empty = "(vide)";
  }

  if (string == empty)
    string = 0;
  else {
    resultString = regString.exec(string);
    string = resultString[1].replace(separator, "");
    string = parseInt(string);
  }
  return string;
}

function makeNumDiff() {
  var string;
  var resultPrevString = 0; // précédent dans l'ordre chronologique
  var resultNextString = 0;
  var className;
  var lastI = 0;
  var i = 0;
  var eltsByTag = document.getElementsByTagName("span");
  var length = eltsByTag.length;

  while (i < length && eltsByTag.item(i).className != "history-size")
    i++;

  if (i < length) {
    resultNextString = getNumFromString(i, eltsByTag);
    lastI = i;
    i++;

    while (i < length) {
      if (eltsByTag.item(i).className == "history-size") {

        resultPrevString = getNumFromString(i, eltsByTag);

        string = resultNextString - resultPrevString;

        if (string > 0) {
          className = "mw-plusminus-pos";
          string = "+" + string;
        }
        else if (string < 0)
          className = "mw-plusminus-neg";
        else
          className = "mw-plusminus-null";

        if (string < -500 || string > 500)
          string = "<strong>" + "(" + string + ")" + "</strong>";
        else
          string = "(" + string + ")";

        eltsByTag.item(lastI).innerHTML += string;
        eltsByTag.item(lastI).className = className;

        resultNextString = resultPrevString;
        lastI = i;
      }
      i++;
    }
  }
}

if mw.config.get('wgAction') && mw.config.get('wgAction') == "history")
  jQuery(document).ready(makeNumDiff);
