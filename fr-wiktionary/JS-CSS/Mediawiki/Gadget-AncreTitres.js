/**[[Catégorie:JavaScript du Wiktionnaire|AncreTitres]]
 * AncreTitres
 *
 * Cette fonction fournit un lien vers une section de page en cliquant
 * sur le lien [URL] ou [[lien]] à droite du titre de section.
 *
 * Auteurs : Pabix, Phe, Bayo, Chphe et Arkanosis
 * {{Projet:JavaScript/Script|AncreTitres}}
 */

/*global alert, jQuery, mediaWiki, window */
/*jslint vars: true, plusplus: true */

// <nowiki>

mw.loader.using(['mediawiki.util', 'user'], function () {
  'use strict';

  $(function ($) {

    var _option = {
      nom_ancre: '[URL]',
      nom_lien_interne: '[[lien]]',
      description: 'Obtenir une URL vers cette section',
      descinterne: 'Obtenir un [[Lien#interne]]',
      linkcolor: '',
      fontSize: 'xx-small',
      fontWeight: 'normal',
      afficheE: true,
      afficheI: true
    };

    if (typeof window.AncreTitres !== 'undefined') {
      $.extend(_option, window.AncreTitres);
    }

    if (!$('#content').length ||
        (!_option.afficheI && !_option.afficheE)) {
      return;
    }

    $('#bodyContent h2, #bodyContent h3, #bodyContent h4, #bodyContent h5, #bodyContent h6').each(function () {
      var $this = $(this);
      var anchor = $this.attr("id")

      var $span = $('<span class="noprint ancretitres" style="' +
          'font-size: ' + _option.fontSize + '; ' +
          'font-weight: ' + _option.fontWeight + '; ' +
          (_option.linkcolor !== '' ? 'color: ' + _option.linkcolor + ';' : '') +
          '-moz-user-select:none; -webkit-user-select:none; -ms-user-select:none; user-select:none;' +
          '"></span>');

      if (_option.afficheE) {
        $span.append(' ');
        $('<a href="#" title="' + _option.description + '">' + _option.nom_ancre + '</a>').click(function () {
          window.prompt(
              'Lien :',
              'https:' + mw.config.get('wgServer') + mw.util.getUrl() + '#' + anchor
          );
          return false;
        }).appendTo($span);
      }

      if (_option.afficheI) {
        $span.append(' ');
        $('<a href="#" title="' + _option.descinterne + '">' + _option.nom_lien_interne + '</a>').click(function () {
          var escapedAnchor =
              anchor
                  // escaping caractères spéciaux HTML
                  // (partiel, '"& ne sont pas escapés pour ne pas dégrader inutilement la lisibilité du lien)
                  .replace(/</g, '&#lt;')
                  .replace(/>/g, '&#gt;')
                  // escaping caractères spéciaux MediaWiki
                  .replace(/\[/g, '&#91;')
                  .replace(/]/g, '&#93;')
                  .replace(/\{/g, '&#123;')
                  .replace(/\|/g, '&#124;')
                  .replace(/}/g, '&#125;');
          window.prompt(
              'Lien :',
              '[[' + (mw.config.get('wgPageName') + '#' + escapedAnchor).replace(/_/g, ' ') + ']]'
          );
          return false;
        }).appendTo($span);
      }

      $this.append($span);
    });

  });

});

// </nowiki>
