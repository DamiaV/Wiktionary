//[[Catégorie:JavaScript du Wiktionnaire|AjaxPatrol.js]]
// Marquer comme patrouillé en mode asynchrone
// Auteur : DavidL

/*
  Erreur lors du marquage comme patrouillé.
  @param code Code d'erreur (<0 si non HTTP)
  @param message Message d'erreur optionnel.
*/
function patrol_error(code, message, olink) {
  if (code >= 0) alert("Erreur HTTP " + code + "\n" + message);
  else if (message != null) alert("Échec du marquage comme patrouillé :\n" + message);
  else alert("Échec du marquage comme patrouillé.");
}

/*
  Pas d'erreur HTTP lors du marquage comme patrouillé.
  @param text Contenu de la page à vérifier.
*/
function patrol_ok(text, olink) {
  if (text.indexOf(
      //" a été marquée comme patrouillée."
      " a été marquée comme relue."
  ) < 0) patrol_error(-1, null);
  else removePatrolLinks(olink);
}

/*
  Supprimer les liens "Marqué comme patrouillé" une fois patrouillé.
*/
function removePatrolLinks(myself) {
  var links = $(".patrollink").get();
  for (var k = 0; k < links.length; k++) {
    if (myself != links[k])
      links[k].parentNode.removeChild(links[k]);
  }
  myself.parentNode.removeChild(myself);
}

/*
  Remplacer les liens "Marqué comme patrouillé" par un appel asynchrone (AJAX).
*/
function asyncPatrolLink() {
  var links = $(".patrollink").get();
  if (links == null) return;
  for (var k = 0; k < links.length; k++) {
    var orig_link = links[k];
    var alink = orig_link.getElementsByTagName("a")[0];
    href = alink.getAttribute("href");
    alink.setAttribute("href", "#");
    alink.setAttribute("title", "Marquer comme patrouillé, mode asynchrone");
    alink.onclick = function () {
      async_call(href, patrol_ok, patrol_error, orig_link);
      return false;
    };
  }
}

jQuery(asyncPatrolLink);
