//[[Catégorie:JavaScript du Wiktionnaire|SommaireDeveloppable.js]]
/* -----------------------------------------------------------------------------------------------------
Sommaire qui ne montre par défaut que les titres de niveau 1 (afin de ne pas trop encombrer l’écran)
mais dont les niveaux de profondeur supérieurs sont affichables (ou masquables)
en cliquant sur un bouton [+] (ou [-]),
d’une façon similaire à ce que font les explorateurs de fichiers classiques.
--------------------------------------------------------------------------------------------------------
Auteurs :
* Eiku 25 avril 2012 pour l’essentiel du code.
* ArséniureDeGallium pour les détails et les ajouts divers.
* Inspiré de WikiTravel (http://files.wikitravel.org/mw/skins/common/wikibits.js?0.1), mais réalisé de façon différente
--------------------------------------------------------------------------------------------------------
Pour l’aide, voir la page de discussion
Voir aussi le modèle : {{SommaireDéveloppable}}
--------------------------------------------------------------------------------------------------------*/

/*----------------- variables de config ------------------------------------------*/

// Sur quelles pages pré-ouvrir la première section de niveau 1 ?
var SommaireDeveloppable_PreDevelop = (mw.config.get('wgNamespaceNumber') === 0); // uniquement dans (principal)

// Faut-il numéroter les sections dans la tdm ?
var SommaireDeveloppable_Numerote = mw.user.options.get('numberheadings'); // utilise les préférences de l’utilisateur

// Quels caractères utiliser pour le développement/repli de la tdm ?
var SommaireDeveloppable_CarDevelop = '[+]';
var SommaireDeveloppable_CarEnvelop = '[-]';
var SommaireDeveloppable_CarZevelop = '[×]';

// Bulles d’aide
var SommaireDeveloppable_BulDevelop = 'Cette section a des sous-sections, cliquez pour les voir';
var SommaireDeveloppable_BulEnvelop = 'Cliquez pour cacher les sous-sections';
var SommaireDeveloppable_BulZevelop = 'Cette section n’a pas de sous-sections';

/*------------------- hooke la fonction ----------------------------------------------*/
// C’est ici qu’est gérée la présence éventuelle du modèle {{SommaireDéveloppable}} dans la page
// * SommaireDeveloppable_NON est prioritaire
// * SommaireDeveloppable_OUI ensuite
// * sinon (cas de 99,999% des pages) c’est le namespace qui décide
var NonAff = document.getElementById('SommaireDeveloppable_NON');
var OuiAff = document.getElementById('SommaireDeveloppable_OUI') || (mw.config.get('wgNamespaceNumber') === 0);
if ((!NonAff) && (OuiAff)) {
  $(SommaireDeveloppable_Main);
}

/*----------------- fonction principale ------------------------------------------*/
function SommaireDeveloppable_Main() {

// pour chaque niveau raisonnable de profondeur de table des matières
  for (var level = 1; level < 7; level++) {
    // récupérer la liste des éléments <li> de classe "toclevel-n"
    var lis = $('.toclevel-' + level);
    if (lis.length === 0) break; //inutile de continuer, il n’y a plus de niveau plus profond

    // pour chacun :
    for (var _i = 0; _i < lis.length; _i++) {
      var li = lis[_i];
      // vérifier que c’est bien un <li>
      if (li.tagName.toLowerCase() != 'li') continue;

      var plus;
      if (li.children.length >= 2) {
        var ul = li.children[1];
        // vérifier que son 2ème enfant est un <ul>
        if (ul.tagName.toLowerCase() != 'ul') continue;
        // lui ajouter (plus tard) un élément cliquable
        plus = document.createElement('a');
        // faire que si on clique dessus et que ul est visible, ça le cache, et vice versa
        plus.onclick = (function (ul, plus) {
          return function () {
            if (ul.style.display == 'none') {
              ul.style.display = 'block';
              plus.title = SommaireDeveloppable_BulEnvelop;
              plus.innerHTML = SommaireDeveloppable_CarEnvelop;
            }
            else {
              ul.style.display = 'none';
              plus.title = SommaireDeveloppable_BulDevelop;
              plus.innerHTML = SommaireDeveloppable_CarDevelop;
            }
          };
        })(ul, plus);
        // cacher par défaut, sauf pour le premier (pour faire la pub)
        if ((level == 1) && (_i === 0) && SommaireDeveloppable_PreDevelop) {
          ul.style.display = 'block';
          plus.title = SommaireDeveloppable_BulEnvelop;
          plus.innerHTML = SommaireDeveloppable_CarEnvelop;
        }
        else {
          ul.style.display = 'none';
          plus.title = SommaireDeveloppable_BulDevelop;
          plus.innerHTML = SommaireDeveloppable_CarDevelop;
        }

      }
      else {
        //sinon élément visuel qui prend autant d’espaces pour même largeur que + et -
        plus = document.createElement('span');
        plus.title = SommaireDeveloppable_BulZevelop;
        plus.innerHTML = SommaireDeveloppable_CarZevelop;
      }

      // mettre cet élément en monoespacé pour que o - + aient la même largeur
      plus.style.fontFamily = 'courier, monospace, mono';
      plus.style.color = '#000';
      plus.style.fontWeight = 'bold';
      plus.style.textDecoration = 'none';
      plus.style.cursor = 'pointer'; // curseur comme sur un hyperlien, puisque ça fait qqch
      // insérer le lien comme 1er nœud du <li> courant
      $(li).children().first().before(plus);

    }//end "for _i"
  }//end "for level"

//---- visibilité numérotation dans le sommaire ----
  var spans = $('.tocnumber');
  if (SommaireDeveloppable_Numerote) {
    for (var _i = 0; _i < spans.length; _i++) {
      spans[_i].style.display = "inline";
    }
  }
  else {
    for (var _i = 0; _i < spans.length; _i++) {
      spans[_i].style.display = "none";
    }
    // sous Chrome, si on laisse le display:table-cell par défaut, un passage à la
    // ligne s’insère entre le [+] ajouté et le <a> qui suit
    // cf. [[Wiktionnaire:Questions techniques/novembre 2015#MediaWiki:Gadget-SommaireDeveloppable.js merde sous Chrome]]
    $('.toctext').css('display', 'inline');
  }

}// end function SommaireDeveloppable_Main
