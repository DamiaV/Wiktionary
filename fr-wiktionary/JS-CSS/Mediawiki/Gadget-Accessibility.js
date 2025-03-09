/**[[Catégorie:JavaScript du Wiktionnaire|Accessibility.js]]
 * Outils de vérification de l'accessibilité des pages
 * Ajoute une palette de liens, classiquement à gauche
 * auteur : http://fr.wikipedia.org/wiki/Utilisateur:Lgd
 * {{Projet:JavaScript/Script|Accessibility}}
 */

/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

$.cookie = function (key, value, options) {

  // key and value given, set cookie...
  if (arguments.length > 1 && (value === null || typeof value !== "object")) {
    options = jQuery.extend({}, options);

    if (value === null) {
      options.expires = -1;
    }

    if (typeof options.expires === 'number') {
      var days = options.expires, t = options.expires = new Date();
      t.setDate(t.getDate() + days);
    }

    return (document.cookie = [
      encodeURIComponent(key), '=',
      options.raw ? String(value) : encodeURIComponent(String(value)),
      options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
      options.path ? '; path=' + options.path : '',
      options.domain ? '; domain=' + options.domain : '',
      options.secure ? '; secure' : ''
    ].join(''));
  }

  // key and possibly options given, get cookie...
  options = value || {};
  var result, decode = options.raw ? function (s) {
    return s;
  } : decodeURIComponent;
  return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};


jQuery(document).ready(function ($) {
  var link = $('<link>');
  link.attr({
    type: 'text/css',
    rel: 'stylesheet',
    media: 'screen',
    href: '//fr.wikipedia.org/w/index.php?title=MediaWiki:Gadget-Accessibility.css&action=raw&ctype=text/css'
  });
  $("head").append(link);

  if (skin == 'vector') {
    $('#p-Navigation').after('<div id="p-accessibility" class="portal"><h5><span>Accessibilité</span></h5><a title="Fixer le Gadget" id="acc_fixed" href="#"><img src="//upload.wikimedia.org/wikipedia/commons/d/d5/Show-handle-10.png" height="16" width="16" alt="Fixer le gadget" /></a><div class="body"><ul><li><a href="#" id="acc_table" title="Vérifier l\'accessibilité des tableaux">Tableaux</a></li><li><a href="#" id="acc_header" title="Vérifier l\'accessibilité des titres de section">Titres</a></li><li><a href="#" id="acc_list" title="Vérifier l\'accessibilité des listes de définition">Listes</a></li><li><a href="#" id="acc_quote" title="Vérifier l\'accessibilité des citations">Citations</a></li><li><a href="#" id="acc_lang" title="Vérifier la présence des changements de langue">Langues</a></li><li><a href="#" id="acc_alt" title="Vérifier la présence des alternatives textuelles">Alternatives</a></li><li><a href="#" id="acc_all">Tout désactiver</a></li><li><a href="//fr.wikipedia.org/wiki/Wikip%C3%A9dia:Atelier_accessibilit%C3%A9/Bonnes_pratiques" id="acc_bp" target="_blank" title="Bonnes pratiques d\'accessibilité (nouvelle fenêtre)">Bonnes pratiques</a></li><li><a href="//fr.wikipedia.org/wiki/Wikip%C3%A9dia:Atelier_accessibilit%C3%A9/Aide_gadget" id="acc_help" target="_blank" title="Aide pour l\'utilisation du gadget (nouvelle fenêtre)">Aide gadget</a></li></ul><p id="acc_disclaimer">Soyez prudent dans vos modifications et n\'hésitez pas à <a href="//fr.wikipedia.org/wiki/Discussion_Wikip%C3%A9dia:Atelier_accessibilit%C3%A9">demander conseil</a>.</p></div></div>');

    var state = $.cookie('vector-nav-p-accessibility');
    if (state == 'true' || state == null) {
      $('#p-accessibility').addClass('expanded').find('div.body').show();
    }
    else {
      $('#p-accessibility').addClass('collapsed');
    }
    if (state != null) {
      $.cookie('vector-nav-p-accessibility', state, {'expires': 30, 'path': '/'});
    }

  }
  else if (skin == 'monobook') {
    $('#p-search').after('<div id="p-accessibility" class="portlet"><h5>Accessibilité</h5><a title="Fixer le Gadget" id="acc_fixed" href="#"><img src="//upload.wikimedia.org/wikipedia/commons/d/d5/Show-handle-10.png" height="16" width="16" alt="Fixer le gadget" /></a><div class="pBody"><ul><li><a href="#" id="acc_table" title="Vérifier l\'accessibilité des tableaux">Tableaux</a></li><li><a href="#" id="acc_header" title="Vérifier l\'accessibilité des titres de section">Titres</a></li><li><a href="#" id="acc_list" title="Vérifier l\'accessibilité des listes de définition">Listes</a></li><li><a href="#" id="acc_quote" title="Vérifier l\'accessibilité des citations">Citations</a></li><li><a href="#" id="acc_lang" title="Vérifier la présence des changements de langue">Langues</a></li><li><a href="#" id="acc_alt" title="Vérifier la présence des alternatives textuelles">Alternatives</a></li><li><a href="#" id="acc_all">Tout désactiver</a></li><li><a href="//fr.wikipedia.org/wiki/Wikip%C3%A9dia:Atelier_accessibilit%C3%A9/Bonnes_pratiques" id="acc_bp" target="_blank" title="Bonnes pratiques d\'accessibilité (nouvelle fenêtre)">Bonnes pratiques</a></li><li><a href="//fr.wikipedia.org/wiki/Wikip%C3%A9dia:Atelier_accessibilit%C3%A9/Aide_gadget" id="acc_help" target="_blank" title="Aide pour l\'utilisation du gadget (nouvelle fenêtre)">Aide gadget</a></li></ul><p id="acc_disclaimer">Soyez prudent dans vos modifications et n\'hésitez pas à <a href="//fr.wikipedia.org/wiki/Discussion_Wikip%C3%A9dia:Atelier_accessibilit%C3%A9">demander conseil</a>.</p></div></div>');

  }


  /* fixed */
  var state = $.cookie('wp_acc_fixed');
  if (state == 'true') {
    $('#p-accessibility').addClass('acc_fixed');
    $('#p-accessibility #acc_fixed img').attr({
      alt: 'Détacher',
      src: '//upload.wikimedia.org/wikipedia/commons/3/3b/Hide-handle-10.png'
    });
    $('#p-accessibility #acc_fixed').attr({title: 'Détacher'});
  }
  if (state != null) {
    $.cookie('wp_acc_fixed', state, {'expires': 30, 'path': '/'});
  }

  $('#acc_fixed').click(function () {
    $('#p-accessibility').toggleClass('acc_fixed');
    var state = $('#p-accessibility').is('.acc_fixed');
    $.cookie('wp_acc_fixed', state, {'expires': 30, 'path': '/'});
    if (!state) {
      $('#p-accessibility #acc_fixed img').attr({
        alt: 'Fixer le gadget',
        src: '//upload.wikimedia.org/wikipedia/commons/d/d5/Show-handle-10.png'
      });
      $('#p-accessibility #acc_fixed').attr({title: 'Fixer le gadget'});
    }
    else {
      $('#p-accessibility #acc_fixed img').attr({
        alt: 'Détacher',
        src: '//upload.wikimedia.org/wikipedia/commons/3/3b/Hide-handle-10.png'
      });
      $('#p-accessibility #acc_fixed').attr({title: 'Détacher'});
    }
    return false;
  });


  /* Tout désactiver */
  $('#acc_all').click(function () {
    $('#content').removeClass('acc_table acc_header acc_list acc_quote acc_lang');
    $('#content span.acc_attr_show, #content caption.acc_caption_error').remove();
    $('#p-accessibility li a').removeClass('acc_on');
    $.cookie('wp_acc_table', false, {'expires': 30, 'path': '/'});
    $.cookie('wp_acc_header', false, {'expires': 30, 'path': '/'});
    $.cookie('wp_acc_list', false, {'expires': 30, 'path': '/'});
    $.cookie('wp_acc_quote', false, {'expires': 30, 'path': '/'});
    $.cookie('wp_acc_lang', false, {'expires': 30, 'path': '/'});
    $.cookie('wp_acc_alt', false, {'expires': 30, 'path': '/'});
    return false;
  });

  /* Tableaux */
  var state = $.cookie('wp_acc_table');
  if (state == 'true') {
    acc_table();
  }
  if (state != null) {
    $.cookie('wp_acc_table', state, {'expires': 30, 'path': '/'});
  }
  $('#acc_table').click(function () {
    acc_table();
    return false;
  });

  function acc_table() {
    $('#content').toggleClass('acc_table');
    $('#acc_table').toggleClass('acc_on');
    $.cookie('wp_acc_table', $('#acc_table').is('.acc_on'), {'expires': 30, 'path': '/'});
    if ($('#acc_table').attr('class') == 'acc_on') {
      $('#content table:has(th[scope])').not('#content table:has(caption)').prepend('<caption class="error acc_caption_error">Ce tableau devrait avoir un titre caption (code wiki |+)</caption>');
      $('#content table:has(caption)').not('#content table:has(th[scope])').prepend('<caption class="error acc_caption_error">Ce tableau ne devrait pas avoir de titre caption (code wiki |+)</caption>');
    }
    else {
      $('#content caption.acc_caption_error').remove();
    }
    return false;
  }

  /* Titres */
  var state = $.cookie('wp_acc_header');
  if (state == 'true') {
    acc_header();
  }
  if (state != null) {
    $.cookie('wp_acc_header', state, {'expires': 30, 'path': '/'});
  }
  $('#acc_header').click(function () {
    acc_header();
    return false;
  });

  function acc_header() {
    $('#content').toggleClass('acc_header');
    $('#acc_header').toggleClass('acc_on');
    $.cookie('wp_acc_header', $('#acc_header').is('.acc_on'), {'expires': 30, 'path': '/'});
    return false;
  }

  /* Listes */
  var state = $.cookie('wp_acc_list');
  if (state == 'true') {
    acc_list();
  }
  if (state != null) {
    $.cookie('wp_acc_list', state, {'expires': 30, 'path': '/'});
  }
  $('#acc_list').click(function () {
    acc_list();
    return false;
  });

  function acc_list() {
    $('#content').toggleClass('acc_list');
    $('#acc_list').toggleClass('acc_on');
    $.cookie('wp_acc_list', $('#acc_list').is('.acc_on'), {'expires': 30, 'path': '/'});
    return false;
  }

  /* Citations */
  var state = $.cookie('wp_acc_quote');
  if (state == 'true') {
    acc_quote();
  }
  if (state != null) {
    $.cookie('wp_acc_quote', state, {'expires': 30, 'path': '/'});
  }
  $('#acc_quote').click(function () {
    acc_quote();
    return false;
  });

  function acc_quote() {
    $('#content').toggleClass('acc_quote');
    $('#acc_quote').toggleClass('acc_on');
    $.cookie('wp_acc_quote', $('#acc_quote').is('.acc_on'), {'expires': 30, 'path': '/'});
    return false;
  }

  /* Langues */
  var state = $.cookie('wp_acc_lang');
  if (state == 'true') {
    acc_lang();
  }
  if (state != null) {
    $.cookie('wp_acc_lang', state, {'expires': 30, 'path': '/'});
  }
  $('#acc_lang').click(function () {
    acc_lang();
    return false;
  });

  function acc_lang() {
    $('#content').toggleClass('acc_lang');
    $('#acc_lang').toggleClass('acc_on');
    $.cookie('wp_acc_lang', $('#acc_lang').is('.acc_on'), {'expires': 30, 'path': '/'});
    return false;
  }

  /* Alternatives */
  var state = $.cookie('wp_acc_alt');
  if (state == 'true') {
    acc_alt();
  }

  if (state != null) {
    $.cookie('wp_acc_alt', state, {'expires': 30, 'path': '/'});
  }

  $('#acc_alt').click(function () {
    acc_alt();
    return false;
  });

  function acc_alt() {
    $('#acc_alt').toggleClass('acc_on');
    $.cookie('wp_acc_alt', $('#acc_alt').is('.acc_on'), {'expires': 30, 'path': '/'});
    if ($('#acc_alt').attr('class') == 'acc_on') {
      $('#content img').each(function () {
        var $alt = $(this).attr('alt');
        var $parent = $(this).parent();
        var $grandparent = $parent.parent();
        if (!$grandparent.is('.magnify')) {
          if ($alt == '') {
            if ($parent.is('a')) {
              $alt = '<span class="error">ALT MANQUANT</span>';
            }
            else {
              $alt = 'ALT VIDE';
            }
          }
          else {
            if ($alt.length > 120) {
              $alt = $alt + '<br /><span class="error">Vérifiez si cette alternative de ' + $alt.length + ' caractères pourrait être plus concise (environ 120 caractères au plus) et si l\'alternative actuelle pourrait être transférée dans la section description de la page de l\'image.</span>';
            }
          }
          if (!$(this).parents().is('.thumb')) {
            if ($(this).is('img[alt$=.png], img[alt$=.svg], img[alt$=.jpg], img[alt$=.gif], img[alt$=.PNG], img[alt$=.SVG], img[alt$=.JPG], img[alt$=.GIF]')) {
              $alt = '<span class="error">ALT MANQUANT</span>';
            }
            if ($parent.is('a.image') && !$grandparent.is('.smiley')) {
              if ($grandparent.is('.flagicon')) {
                if (!$(this).is('img[alt^=Drapeau], img[alt^=drapeau], img[alt^=Pavillon], img[alt^=pavillon]')) {
                  $alt = $alt + '<br /><span class="error">L\'alternative devrait commencer par « Drapeau... » ou « Pavillon... »</span>';
                }

              }
              else {
                $alt = $alt + '<br /><span class="error">Vérifiez si le lien sur l\'image peut être désactivé (LINK vide)<br />(ou si l\'image peut être transformée en thumb)</span>';
              }
            }
          }
          if ($parent.is('a')) {
            $parent.before('<span class="acc_attr_show">' + $alt + '</span>');
          }
          else {
            $(this).before('<span class="acc_attr_show">' + $alt + '</span>');
          }
        }
      });
      $('#content ul.gallery').before('<span class="acc_attr_show"><span class="error">Les alternatives des images ne peuvent pas être indiquées dans les galeries. (<a href="https://bugzilla.wikimedia.org/show_bug.cgi?id=18682" target="_blank" title="Demande de correction du bug des alternatives d\'images dans les galeries, sur Bugzilla, en anglais (nouvelle fenêtre)">Vous pouvez voter pour la résolution ce bug</a>).</span></span>');
      $('#content img[usemap]').before('<span class="acc_attr_show"><span class="error">Les alternatives nécessaires aux images de <span lang="en">timelines</span> ne peuvent pas être indiquées en l\'état actuel de cette extension.</span></span>');
    }
    else {
      $('#content span.acc_attr_show').remove();
    }
  }

});
