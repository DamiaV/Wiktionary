//[[Catégorie:JavaScript du Wiktionnaire|LastContrib.js]]
/**
 * '''Dernière contribution'''
 *
 * Indique au chargement de la page si la page a été édité depuis moins de xx temps
 * (sert à éviter les conflits de modification éventuels)
 *
 * Auteur : Seb35
 * Date de la dernière révision : 18 mai 2007
 * [[Catégorie:JavaScript du Wiktionnaire|LastContrib.js]]
 */

////////////////////// ZONE PERSONNALISABLE //////////////////////

// Les temps sont en secondes
var lastContribNiveau1 = 100;   // Niveau d'alerte très fort
var lastContribNiveau2 = 8 * 60;  // Niveau d'alerte fort
var lastContribNiveau3 = 40 * 60; // Niveau d'alerte moyen

///////////////// FIN DE LA ZONE PERSONNALISABLE /////////////////

function lastContrib() {
  var tit = document.getElementById('contentSub');
  if (!tit) return;

  var texte = document.getElementById('lastmod');                      // Monobook et affiliés, Modern
  if (!texte) texte = document.getElementById('footer-info-lastmod');   // Vector
  if (!texte) return;

  texte = texte.innerHTML.toString();
  var resultat = texte.match(/page le ([0-9]{1,2}) ([a-zéû]*) ([0-9]{4}) à (([0-9]{2}):([0-9]{2}))/);
  if (resultat == null) return;

  function moisFromMot(mot) {
    var d = new Array('janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre');
    for (var i = 0; i < 12; i++)
      if (mot == d[i]) return i;
  }

  var last = new Date(Number(resultat[3]), Number(moisFromMot(resultat[2])), Number(resultat[1]), Number(resultat[5]), Number(resultat[6]));
  var now = new Date();
  var diff = Math.round((now - last) / 1000);
  if (diff <= lastContribNiveau3) {
    if (diff < -600) {
      tit.innerHTML = 'Erreur probable dans la concordance des horloges : heure serveur = ' + last + ' >> heure client = ' + now + ' - ' + tit.innerHTML;
      return;
    }
    if (diff < 0) diff = 0;
    var diffHeures = Math.floor(diff / 3600);
    var diffMinutes = Math.floor((diff - diffHeures * 3600) / 60);
    var diffSecondes = diff - diffHeures * 3600 - diffMinutes * 60;
    tit.innerHTML = '<span style="font-size:8pt;">' + resultat[4] + ' (<a href="//fr.wiktionary.org/wiki/' + mw.config.get('wgPageName') + '?action=history"><span style="' + (diff <= lastContribNiveau2 ? 'color:red;' : 'color:black;') + (diff <= lastContribNiveau1 ? ' text-decoration:underline overline;">' : '">') + (diffHeures > 0 ? diffHeures + 'h' : '') + (diffMinutes > 0 ? diffMinutes + 'm' : '') + diffSecondes + 's</span></a>)</span> ' + tit.innerHTML;
  }
}

jQuery(document).ready(lastContrib);
