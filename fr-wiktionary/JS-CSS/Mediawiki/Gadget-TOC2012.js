//[[Catégorie:JavaScript du Wiktionnaire|TOC2012.js]]
/* Auteur : Eiku. */
/*
 Pour replier les sous-listes de la table des matières.

 Le code n’est pas aussi joli que chez Wikitravel, mais il fonctionne bien.

 La table des matières est, en très simplifié, comme ça :
<li class="tabletoc-1">
  <a>1 blablabla</a>
  <ul>
    <li class="tabletoc-2>
      <a>1.1 blablabla</a>
    </li>
    <li class="tabletoc-2>
      <a>1.2 blablabla</a>
      <ul>
        <li class="tabletoc-3>
          <a>1.2.1</a>
        </li>
      </ul>
    </li>
  </ul>
</li>
etc.
Donc pour chaque ul contenu en 2ème position dans un li ayant une classe en "tabletoc-*",
on ajoute un bouton à son parent. À ce bouton, on lie une fonction qui masque ou affiche
le ul en question.

*/


var foldToc = function () {
  // pour chaque niveau raisonnable de profondeur de table des matières
  for (var level = 1; level < 7; level++) {
    // récupérer la liste des éléments <li> de classe "toclevel-n"
    var lis = $('.toclevel-' + level).get();
    // pour chacun :
    for (var _i = 0; _i < lis.length; _i++) {
      var li = lis[_i];
      // vérifier que c’est bien un <li>
      if (li.tagName.toLowerCase() != 'li') continue;
      if (li.children.length >= 2) {
        var ul = li.children[1];
        // vérifier que son 2ème enfant est un <ul>
        if (ul.tagName.toLowerCase() != 'ul') continue;
        // lui ajouter (plus tard) un élément cliquable
        var plus = document.createElement('a');
        // faire que si on clique dessus et que ul est visible,
        // ça le cache, et vice versa
        plus.onclick = (function (ul, plus) {
          return function () {
            console.log('onclick');
            console.log(ul.style.display);
            if (ul.style.display == 'none') {
              ul.style.display = 'block';
              plus.innerHTML = '[-]';
            }
            else {
              ul.style.display = 'none';
              plus.innerHTML = '[+]';
            }
          };
        })(ul, plus);
        // cliquer virtuellement dessus (pour cacher par défaut)
        plus.onclick();
        // mettre ce lien en couleur noir et monoespacé
        // pour que - et + aient la même largeur
        plus.style.fontFamily = 'courier, monospace, mono';
        plus.style.color = '#000';
        plus.style.fontWeight = 'bold';
        plus.style.textDecoration = 'none';
        plus.style.cursor = 'pointer';
        plus.style.marginLeft = '-3em';
        // insérer le lien comme 1er nœud du <li> courant
        li.insertBefore(plus, li.firstChild);
      }
    }
  }
};
jQuery(document).ready(foldToc);
