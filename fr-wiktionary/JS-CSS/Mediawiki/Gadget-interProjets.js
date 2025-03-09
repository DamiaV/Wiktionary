//[[Catégorie:JavaScript du Wiktionnaire|interProjets.js]]
/**
 * Extrait et affiche la liste
 * des liens interprojets présents dans la page.
 * auteur : http://fr.wikipedia.org/wiki/Utilisateur:Lgd
 * licence : MIT
 *
 * Utilise : http://fr.wikipedia.org/wiki/MediaWiki:Gadget-interProjets.css
 *
 * Paramétrage: ajouter var interprojetsPosition = 'left'; dans le common.js personnel
 * pour afficher la liste dans le menu de gauche,
 * ou var interprojetsPosition = 'bottom'; pour l'afficher en pied de page
 *
 */

var interProjects = function ($) {
  var nameSpace = mw.config.get('wgNamespaceNumber');
  if (nameSpace == -1 || nameSpace == 6) {
    return
  }
  ;

  var $list = $('<ul></ul>');
  var kill = $('#content .autres-projets');

  var $commons = $('#content a[href*="commons.wikimedia.org"]').data('name', 'Commons');
  var $wiktionary = $('#content a[href*="wiktionary.org"]').data('name', 'Wiktionary');
  var $wikinews = $('#content a[href*="wikinews.org"]').data('name', 'Wikinews');
  var $wikibooks = $('#content a[href*="wikibooks.org"]').data('name', 'Wikibooks');
  var $wikiquote = $('#content a[href*="wikiquote.org"]').data('name', 'Wikiquote');
  var $wikisource = $('#content a[href*="wikisource.org"]').data('name', 'Wikisource');
  var $wikiversity = $('#content a[href*="wikiversity.org"]').data('name', 'Wikiversity');
  var $species = $('#content a[href*="species.wikimedia.org"]').data('name', 'Wikipecies');

  var check = 0;

  if (typeof interprojetsPosition !== 'undefined' && interprojetsPosition) {
    var position = interprojetsPosition;
  }
  else {
    var position = 'top';
  }

  function makeList(links) {
    links = links.filter(function () {
      if ($(this).closest('.js-no-interprojets').length == 0) {
        return $(this)
      }
    });
    if (links.length !== 0) {
      var $item;
      var text = links.data('name');
      var duplicatesTable = [];
      // removeDuplicates améliorable
      links.clone().each(function () {
        if (jQuery.inArray($(this).attr('href'), duplicatesTable) == -1) {
          var $link = $(this);
          var title = $(this).text() + ' sur ' + text;
          $link.attr('title', title);
          if (position == 'left') {
            $link.text(text);
          }
          $link.removeClass()
          $item = $('<li></li>').prepend($link);
          $list.append($item);
          duplicatesTable.push($(this).attr('href'));
        }
        check++;
      });
    }
  }

  function displayList() {
    if (position == 'left') {
      var $portal = $('<div id="p-coll-interprojects" class="portal"><h5>Autres projets</h5><div class="body"><ul>' + $list.html() + '</ul></div></div>');
      $('#p-tb').after($portal);
      var state = $.cookie('vector-nav-p-coll-interprojects');
      if (state == 'true' || state == null) {
        $('#p-coll-interprojects').addClass('expanded').find('div.body').show();
      }
      else {
        $('#p-coll-interprojects').addClass('collapsed');
      }
      if (state != null) {
        $.cookie('vector-nav-p-coll-interprojects', state, {'expires': 30, 'path': '/'});
      }
    }
    else if (position == 'bottom') {
      var $portal = $('<div class="mw-js-message-interprojets interprojets-bottom">' + $list.html() + '</ul></div>');
      $('#content').append($portal);
    }
    else {
      mw.notify($list);
    }
  }

  function killThemAll() {
    $(kill).remove();
  }

  makeList($commons);
  makeList($wiktionary);
  makeList($wikibooks);
  makeList($wikiquote);
  makeList($wikisource);
  makeList($wikinews);
  makeList($wikiversity);
  makeList($species);

  if (check !== 0) {
    displayList();
    killThemAll();
  }
}
$(interProjects);
