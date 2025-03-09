//[[Catégorie:JavaScript du Wiktionnaire|OptimizedSuivi.js]]
/**
 * Suivi Deluxe
 *
 * Retirer des pages de sa liste de suivi plus facilement
 *
 * Auteur : Dake
 * Dernière révision : 10 mai 2008
 * {{Projet:JavaScript/Script|OptimizedSuivi}}
 */

window.svmAllPages = new Array();

function SuiviManagerRegexp(regexp) {
  var match = new RegExp(regexp);

  for (var i = 0; i < svmAllPages.length; i++) {
    if (match.test(svmAllPages[i].target)) {
      svmAllPages[i].checkBox.checked = true;
    }
  }
}

window.SuiviManagerRegexp = SuiviManagerRegexp;

function SuiviManagerLiensRouges() {
  for (var i = 0; i < svmAllPages.length; i++) {
    if (svmAllPages[i].isNew
        && ((svmAllPages[i].target.indexOf('/') == -1 && svmAllPages[i].target.indexOf(':') == -1)
            || svmAllPages[i].isTalkNew)) {
      svmAllPages[i].checkBox.checked = true;
    }
  }
}

window.SuiviManagerLiensRouges = SuiviManagerLiensRouges;

function SuiviManagerRedirects() {
  for (var i = 0; i < svmAllPages.length; i++) {
    if (svmAllPages[i].isRedirect
        && (svmAllPages[i].isTalkRedirect
            || svmAllPages[i].isTalkNew)) {
      svmAllPages[i].checkBox.checked = true;
    }
  }
}

window.SuiviManagerRedirects = SuiviManagerRedirects;

function SuiviManagerDeselect() {
  for (var i = 0; i < svmAllPages.length; i++) {
    svmAllPages[i].checkBox.checked = false;
  }
}

window.SuiviManagerDeselect = SuiviManagerDeselect;

function SuiviManager() {
  var a = 0;
  var b = 0;
  var interfaceMsg = new Array();
  var regexpList = new Array();

  //////////////////////////////////////////////////
  // Expressions régulières et liens de l'interface
  //
  // besoin d'aide pour les regexp ?
  // http://www.commentcamarche.net/javascript/jsregexp.php3
  //////////////////////////////////////////////////

  interfaceMsg[a++] = "<b>Tout cocher</b>";
  regexpList[b++] = "^.*";

  interfaceMsg[a++] = "Utilisateurs IP";
  regexpList[b++] = "^Utilisateur:[0-9]\\.";

  interfaceMsg[a++] = "Sous-pages PàS";
  regexpList[b++] = "/Suppression$";

  interfaceMsg[a++] = "Sous-pages bistro";
  regexpList[b++] = "^Wiktionnaire:Wikidémie/";

  //////////////////////////////////////////////////
  var topTag = document.getElementById("contentSub")

  // récupère toutes les pages
  var bc = document.getElementById("content");            // Monobook, Vector, Chick, MySkin, Simple
  if (!bc) bc = document.getElementById("article");          // Cologneblue, Nostalgia, Standard
  if (!bc) bc = document.getElementById("mw_contentholder"); // Modern
  var wlElements = bc.getElementsByTagName("div");

  for (var i = 0; i < wlElements.length; i++) {
    if (!$(wlElements[i]).hasClass("mw-htmlform-flatlist-item")) continue;
    var wlItem = new Object();
    wlItem.checkBox = wlElements[i].getElementsByTagName("input")[0];
    if (!wlItem.checkBox) continue;
    var label = wlElements[i].getElementsByTagName("label")[0];
    var labelSpan = label.getElementsByTagName("span")[0];
    var links = label.getElementsByTagName("a");
    wlItem.isRedirect = labelSpan ? $(labelSpan).hasClass("watchlistredir") : false;
    wlItem.isNew = $(links[0]).hasClass("new");
    wlItem.isTalkRedirect = $(links[1]).hasClass("mw-redirect");
    wlItem.isTalkNew = $(links[1]).hasClass("new");
    wlItem.target = wlItem.checkBox.value;
    svmAllPages.push(wlItem);
  }
  if (svmAllPages.length == 0) return; // si on est dans EditWatchlist/raw

  // prépare la mini-interface
  var str = "<div style=\"background-color:#8ecfe4;font-size:1px;height:8px;border:1px solid #AAAAAA;-moz-border-radius-topright:0.5em;-moz-border-radius-topleft:0.5em;\"></div>"
      + "<div style=\"border:1px solid #6ac1de;border-top:0px solid white;padding:5px 5px 0 5px;margin-bottom:3ex;\"><p>"
      + "<div style=\"float: left; text-align: left; white-space: nowrap;\"></div>";

  for (var cpt = 0; cpt < interfaceMsg.length; cpt++) {
    str += "<a href=\"#\" onClick=\"SuiviManagerRegexp('" + regexpList[cpt] + "');return false;\">"
        + interfaceMsg[cpt]
        + "</a> · ";
  }

  str += "<a href=\"#\" onClick=\"SuiviManagerLiensRouges();return false;\">"
      + "Retirer les liens rouges"
      + "</a> · ";

  str += "<a href=\"#\" onClick=\"SuiviManagerRedirects();return false;\">"
      + "Retirer les redirections"
      + "</a> · ";

  str += "<a href=\"#\" onClick=\"SuiviManagerDeselect();return false;\">"
      + "<b>Enlever toutes les coches</b>"
      + "</a>";

  topTag.innerHTML = topTag.innerHTML + "<br clear=all />" + str + "<p></div>"
}

window.SuiviManager = SuiviManager;

if (mw.config.get('wgCanonicalSpecialPageName') == "EditWatchlist") $(SuiviManager);
