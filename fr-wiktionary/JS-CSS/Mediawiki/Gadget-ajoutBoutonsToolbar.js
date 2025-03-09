/*[[Catégorie:JavaScript du Wiktionnaire|ajoutBoutonsToolbar.js]]*/
//<source lang="javascript" line>
/*
* Fonction
*
* Ajoute un bouton ou plusieurs boutons dans la barre d'outils (voir http://fr.wikipedia.org/wiki/MediaWiki:Gadget-AjoutBoutonSource.js pour un exemple d'utilisation de cette fonction)
* @param messages_debut Tableau Javascript contenant le texte devant être inséré au début du texte sélectionné
* @param messages_fin Tableau Javascript contenant le texte devant être inséré à la fin du texte sélectionné
* @param commentaires Tableau Javascript contenant le commentaire affiché dans l'infobulle lorsque l'on passe le curseur sur le bouton de la barre d'outil
* @param images Tableau Javascript contenant l'URL de l'image qui servira pour le bouton
* @param id_images Tableau Javascript contenant l'ID de l'image
* Auteur : Sanao
* Dernière révision : 22 novembre 2007
*/
function ajoutBoutonsToolbar(messages_debut, messages_fin, commentaires, images, id_images) {
  if (document.createTextNode) {
    if (document.getElementById("toolbar")) {
      for (var cpt = 0; cpt < messages_fin.length; cpt++) {
        if (getVarValue(id_images[cpt], "show") != "hide") {
          addButton(images[cpt], commentaires[cpt], messages_debut[cpt], messages_fin[cpt], "", "mw-editbutton-" + id_images[cpt]);
        }
      }
    }
  }
}

//</source>
