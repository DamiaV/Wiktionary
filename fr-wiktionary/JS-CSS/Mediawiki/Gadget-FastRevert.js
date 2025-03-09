// [[Catégorie:JavaScript du Wiktionnaire|FastRevert.js]]
/*
 ************* FastRevert *******************
 * Permet de rétablir une ancienne version. *
 *                                          *
 * Auteur : Quentinv57, pour Wikimedia      *
 *          -- 06 feb. 2010 --              *
 ********************************************
 */
// ********************************************************************
// Ce gadget a été modifié sur Wikibooks :
//   - DavidL : Utilisation de l'API DOM pour générer les balises
//              HTML au lieu de innerHtml qui supprime les
//              gestionnaires d'évènements.
// ********************************************************************
// TOUTE MISE À JOUR DOIT PRENDRE EN COMPTE LES MODIFICATIONS CI-DESSUS
// ********************************************************************

if (location.href.match(/&action=history/))
  jQuery(function () {
    function set() {
      this.arr = [];
      this.add1 = function (e) {
        if (this.arr.indexOf(e) < 0) this.arr.push(e);
      };
      this.add = function () {
        for (var i = 0; i < arguments.length; i++) this.add1(arguments[i]);
      };
      for (var i = 0; i < arguments.length; i++) this.add1(arguments[i]);
      this.toString = function () {
        return this.arr.toString();
      };
    }

    var chemin = mw.config.get('wgScript') + '?action=edit&retablir';
    var pagehistory = document.getElementById('pagehistory');
    if (!pagehistory) return;
    pagehistory = pagehistory.getElementsByTagName('li');
    var user2 = new set();
    for (x = 0; x < pagehistory.length; x++) {
      var elem = pagehistory[x];
      if (!elem || !elem.getElementsByTagName) continue;
      var links = elem.getElementsByTagName('a');
      if (!links || links.length < 3) continue;
      if (x === 0) {
        user2.add($(links[2]).text());
      }
      else if (links.length > 3 && links[2].href) {
        var iu = ($(links[1]).text() == 'diff') ? 3 : 2;
        var user = $(links[iu]).text(), loc = links[iu - 1].href;
        var mres = loc.match('&oldid=([0-9]+)');
        if (mres && mres.length > 1) {
          var oldid = mres[1];
          // Création du contenu du noeud avec document.createTextNode()
          // car une création avec .innerHTML (ou jQuery() qui l'utilise)
          // supprimerait les évènements (cf. en-tête du script), et obligerait
          // à valider les changements deux fois
          var lien_retablir = document.createElement('a');
          lien_retablir.setAttribute('href', chemin + '&oldid=' + oldid + '&user=' + encodeURIComponent(user) + '&user2=' + encodeURIComponent(user2.toString()));
          lien_retablir.appendChild(document.createTextNode('rétablir'));
          $(elem).append(' (', lien_retablir, ')');
        }
        user2.add(user);
      }
    }
  });
else if (location.href.match(/&retablir&/))
  jQuery(function () {
    // _GET code from NoGray JS Library http://www.nogray.com/new_site/
    var _GET = [];
    var _uri = location.href;
    var _temp_get_arr = _uri.substring(_uri.indexOf('?') + 1, _uri.length).split("&");
    var _temp_get_arr_1 = [];
    for (_get_arr_i = 0; _get_arr_i < _temp_get_arr.length; _get_arr_i++) {
      _temp_get_arr_1 = _temp_get_arr[_get_arr_i].split("=");
      _GET[decodeURI(_temp_get_arr_1[0])] = decodeURI(_temp_get_arr_1[1]);
    }
    var user_revoked = decodeURIComponent(_GET.user2).split(',');
    var contribs_link_user_revoked = '';
    // On ne met des liens vers la liste des contributions de l'utilisateur
    // que s'il n'y a pas + de 2 utilisateurs révoqués
    if (user_revoked.length > 2) {
      contribs_link_user_revoked = user_revoked.join(', ');
    }
    else {
      var i;
      for (i = 0; i < user_revoked.length; i++) {
        contribs_link_user_revoked += '[[Special:Contribs/' + user_revoked[i] +
            '|' + user_revoked[i] + ']]';
        if (i + 1 < user_revoked.length) {
          contribs_link_user_revoked += ', ';
        }
      }
    }

    var message = prompt('Quel message faut-il laisser ?', 'Révocation des modifications de ' + contribs_link_user_revoked);
    if (message) {
      document.getElementById('wpSummary').value = message + ' ; Retour à la version ' + _GET.oldid + ' de [[Special:Contributions/' + _GET.user + '|' + _GET.user + ']]';
      document.getElementById('editform').submit();
    }
    else window.history.back();
  });
