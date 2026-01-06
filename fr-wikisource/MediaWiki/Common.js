/*jshint sub:true, scripturl:true, maxerr:1000*/
/************************************************************/
/* Fonctions générales (pallient les limites de javascript) */

/************************************************************/


/**
 * Traitement des classes
 * Javascript ne fournit actuellement que .className qui est extrêmement limité
 * Utiliser http://api.jquery.com/category/manipulation/class-attribute/
 */

function isClass(element, classe) {
  return hasClass(element, classe);
}

function whichClass(element, classes) {
  const s = " " + element.className + " ";
  for (let i = 0; i < classes.length; i++)
    if (s.indexOf(" " + classes[i] + " ") >= 0) return i;
  return -1;
}

function hasClass(node, className) {
  if (node.className === className) return true;
  const reg = new RegExp("(^| )" + className + "($| )");
  return reg.test(node.className);
}

function addClass(node, className) {
  if (hasClass(node, className)) return false;
  const cache = node.className;
  if (cache) node.className = cache + ' ' + className;
  else node.className = className;
  return true;
}

function removeClass(node, className) {
  if (!hasClass(node, className)) return false;
  node.className = eregReplace("(^|\\s+)" + className + "($|\\s+)", " ", node.className);
  return true;
}

function eregReplace(search, replace, subject) {
  return subject.replace(new RegExp(search, "g"), replace);
}

/*
 * Typographie : même lorsque l'on travaille en mode création de page
 * il n'est pas sur de changer aveuglément tout le texte, d'où le
 * le split du texte en fragment où les regexps sont appliqués
 */
function common_typographie_fragment(text, typo_def) {
  const lng = typo_def.length;
  if (lng % 2 !== 0)
    return text;  /* FIXME, il faut lever une exception ici ? */
  for (let i = 0; i < lng; i += 2) {
    const search = new RegExp(typo_def[i], "g");
    text = text.replace(search, typo_def[i + 1]);
  }
  return text;
}

function common_typographie(text, typo_def) {
  let new_text = '';
  let last_match = 0;
  // Split the text in part which are safe to transform, e.g we don't want
  // to apply common_typographie_fragment on a <math>.*</math> or a &nbsp; etc.
  const splitter = new RegExp("<math>.*</math>|<[a-zA-z0-9 =\"']>|[</[a-zA-z0-9 =\"']+>|style=\".*\"|&nbsp;|&mdash;|<!--.*-->|\n:[:]*|\n;[;]*|[[][[].*]]", "gm");
  while ((result = splitter.exec(text)) != null) {
    new_text += common_typographie_fragment(text.slice(last_match, splitter.lastIndex - result[0].length), typo_def);
    new_text += result;
    last_match = splitter.lastIndex;
  }
  new_text += common_typographie_fragment(text.slice(last_match), typo_def);
  return new_text;
}

function common_typographie_textbox(pagename_filter, typo_def) {
  if (mw.config.get('wgNamespaceNumber') !== 104)
    return;

  if (!$('.mw-newarticletext').length && !$('.mw-newarticletextanon').length) {
    return;
  }

  var wpTextbox1 = document.getElementById("wpTextbox1");
  if (!wpTextbox1)
    return;

  typo_def = [
    "([^'])'([^'])", "$1’$2",
    "([^ ])([;:?!])", "$1 $2",
    "\n\n- ", "\n\n— "
  ];

  wpTextbox1.value = common_typographie(wpTextbox1.value, typo_def);
}

$(common_typographie_textbox);


/* traduction des messages javascript*/
self.ws_messages = {
  'optlist': 'Options d’affichage',
  'hide_page_numbers': 'Liens vers les pages',
  'show_page_numbers': 'Liens vers les pages',
  'layout': 'Maquette',

  'author': 'Auteur',
  'translator': 'Traducteur',
  'editor': 'Editeur_scientifique',
  'publisher': 'Editeur',
  'place': 'Lieu',
  'volume': 'Volume',
  'school': 'School', /*ne pas traduire*/
  'book': 'Livre',
  'collection': 'Recueil',
  'journal': 'Journal ou revue',
  'phdthesis': 'Thèse, rapport',
  'dictionary': 'Dictionnaire, encyclopédie, ouvrage de référence',


  'progress': 'Avancement',
  'progress_T': 'Terminé',
  'progress_V': 'À valider',
  'progress_C': 'À corriger',
  'progress_MS': 'Texte prêt à être découpé (match & split)',
  'progress_OCR': 'Ajouter une couche texte OCR',
  'progress_X': 'Source incomplète (extrait) ou compilation de sources différentes',
  'progress_L': 'Fichier défectueux (lacunes, pages dans le désordre, etc)',
  'progress_D': 'Doublon, un autre fichier existe sur lequel il est préférable de travailler',

  'matching': 'appariement en cours',
  'splitting': 'découpage en cours',

  'corr_list': "Liste des corrections apportées à cette page",
  'corr_link': "Coquilles",
  'corr_one': "Une coquille </a> a été corrigée.",
  'corr_many': " coquilles</a> ont été corrigées.",
  'corr_close': 'Fermer.',

  'iwtrans': 'Son texte vient de',
  'iwtrans2': 'Son texte vient d’autres sous-domaines de Wikisource.'
};

/* attributs de style dynamiques */
self.ws_layouts = {
  'Maquette 1': {
    '#text-wrap': "margin-left:3em;margin-right:3em;",
    '#text-container': "position:relative;width:36em;margin:0px auto;",
    '#text': "text-align:justify;",
    '#box-right': "position:absolute; right:-20em;top:0em;",
    '#box-toc': "position:absolute; right:-23em;top:0em; width:22em;",
    '.sidenote-right': "position:absolute; left:37em;width:15em;text-indent:0em;text-align:left;",
    '.sidenote-left': "position:absolute; right:37em;width:15em;text-indent:0em;text-align:right;",
    '.editsection': "display:none",
    '.headerlabel': "display:none",
    '.headertemplate-author': "font-size:100%",
    '.headertemplate-title': "font-size:120%;",
    '.headertemplate-reference': "font-size:90%",
    '#headertemplate': ""
  },
  'Maquette 2': {
    '#text-wrap': "margin-left:3em",
    '#text-container': "",
    '#text': "text-align:justify;width:auto;",
    '#box-right': "float:right;",
    '#box-toc': "margin:auto;width:100%;",
    '.sidenote-right': "float:right;margin:0.5em;padding:3px;border:solid 1px gray;max-width:9em;text-indent:0em;text-align:left;",
    '.sidenote-left': "float:left;margin:0.5em;padding:3px;border:solid 1px gray;max-width:9em;text-indent:0em;text-align:left;",
    '.editsection': "display:none",
    '.headerlabel': "display:none",
    '.headertemplate-author': "font-size:100%",
    '.headertemplate-title': "font-size:120%;",
    '.headertemplate-reference': "font-size:90%",
    '#headertemplate': ""
  },
  'Maquette 3': {
    '#text-wrap': "margin-left:3em",
    '#text-container': "position:relative; min-width:60em; float:left; width:100%; margin-right:-23em;",
    '#text': "text-align:justify;margin-right:23em; text-indent:0em; padding-left:0px; padding-right:0px;width:auto;position:relative;",
    '#box-right': "float:right;",
    '#box-toc': "margin:auto;width:100%;",
    '.sidenote-right': "position:absolute; right:-16em; width:15em; background-color:#eeeeee;text-indent:0em;text-align:left;line-height:normal;",
    '.sidenote-left': "position:absolute; right:-16em; width:15em; background-color:#eeeeee;text-indent:0em;text-align:left;line-height:normal;",
    '.editsection': "display:none",
    '.headerlabel': "display:inline",
    '.headertemplate-author': "font-size:100%;",
    '.headertemplate-title': "font-size:100%;",
    '.headertemplate-reference': "font-size:100%;",
    '#headertemplate': "position:absolute; top:0em; right:-23em; width:21em;float:right; text-align:left;"
  }
};

function ws_msg(name) {
  var m = self.ws_messages[name];
  if (m) return m; else return name;
}

var old_wgserver = '//wikisource.org';
mw.loader.load(old_wgserver + '/w/index.php?title=MediaWiki:Base.js&action=raw&ctype=text/javascript');
//Maintenant fourni par l'extension Wikisource mw.loader.load(old_wgserver + '/w/index.php?title=MediaWiki:OCR.js&action=raw&ctype=text/javascript');
//TODO cassé par le nouveau système de Zoom mw.loader.load(old_wgserver + '/w/index.php?title=MediaWiki:Hocr.js&action=raw&ctype=text/javascript');
mw.loader.load(old_wgserver + '/w/index.php?title=MediaWiki:PageNumbers.js&action=raw&ctype=text/javascript');
mw.loader.load(old_wgserver + '/w/index.php?title=MediaWiki:Corrections.js&action=raw&ctype=text/javascript');
mw.loader.load(old_wgserver + '/w/index.php?title=MediaWiki:DisplayFooter.js&action=raw&ctype=text/javascript');
mw.loader.load(old_wgserver + '/w/index.php?title=MediaWiki:InterWikiTransclusion.js&action=raw&ctype=text/javascript');
mw.loader.load(old_wgserver + '/w/index.php?title=MediaWiki:Dictionary.js&action=raw&ctype=text/javascript');
mw.loader.load(old_wgserver + '/w/index.php?title=MediaWiki:RegexpButton.js&action=raw&ctype=text/javascript');

/* Réécriture des titres
 *
 * Fonction utilisée par Modèle:TitreModifié et Modèle:Statut
 *
 */
function rewritePageH1() {
  var realTitle = document.getElementById('RealTitle');
  var h1 = document.getElementsByTagName('h1')[0];
  if (realTitle && h1) {
    var titleText = realTitle.innerHTML;
    if (titleText === '') h1.style.display = 'none';
    else h1.innerHTML = titleText;
    realTitleBanner.style.display = 'none';
  }
}

$(rewritePageH1);


/*
Interwikiextra
Auteur:ThomasV et Tpt
*/
function menuExtra() {
  $(".interwiki-info").each(function (i, info) {
    var langLink = $("#p-lang .interwiki-" + info.id + " a");
    if (info.title === "(vo)") {
      langLink.after(' (<abbr title="Version originale">vo</abbr>)');
    } else {
      langLink.after(" " + info.title);
    }
  });

  //Autre versions
  if ($(".AutreVersion").length) {
    var data = {
      sections: {
        version: {
          expanded: true,
          label: 'Autres versions',
          links: {}
        }
      }
    };
    $(".AutreVersion").each(function (i, info) {
      var p = info.title.indexOf("|");
      data.sections.version.links['interwiki-' + i] = {
        label: info.title.substr(p + 1, this.title.length - 1),
        href: '/wiki/' + encodeURIComponent(info.title.substr(0, p))
      };
    });
    mw.panel(data);
  }

  //interprojets
  var interprojetsAAjouter = {};

  // extraction
  var interprojectNode = $("#interProject");
  if (interprojectNode.length !== 0) {
    interprojectNode.find('span').each(function (i, info) {
      //on cherche l'id du site
      var idParts = $(this).attr('id').split('-');
      if (idParts.length !== 2)
        return;
      var id = idParts[1];

      var link = $(this).find('a');
      interprojetsAAjouter['wb-otherproject-' + id + '-custom'] = {
        'label': link.text(),
        'href': link.attr('href'),
        'group': id,
        'class': 'wb-otherproject-link wb-otherproject-' + id
      };
    });
  }

  //Wikidata item
  if (mw.config.get('wgWikibaseItemId')) {
    interprojetsAAjouter['wb-otherproject-wikidata-item-custom'] = {
      'label': 'Élément Wikidata',
      'href': '//wikidata.org/wiki/' + mw.config.get('wgWikibaseItemId'),
      'group': 'wikidata-item',
      'class': 'wb-otherproject-link wb-otherproject-wikidata'
    };
  }

  //ajout
  if (!$.isEmptyObject(interprojetsAAjouter)) {
    var autresProjectsNode = $('#p-wikibase-otherprojects');
    if (autresProjectsNode.length !== 0) {
      //on supprime les doublons
      $.each(interprojetsAAjouter, function (id, parameters) {
        autresProjectsNode.find('.wb-otherproject-' + parameters.group).remove();
      });
      mw.panel({
        section: 'wikibase-otherprojects',
        links: interprojetsAAjouter
      });
    } else {
      mw.panel({
        sections: {
          'wikibase-otherprojects': {
            label: 'Autres projets',
            links: interprojetsAAjouter
          }
        }
      });
    }
  }
}

mw.loader.using(mw.config.get('wgServer') + '/w/index.php?title=MediaWiki:MediaWiki.panel.js&action=raw&ctype=text/javascript', menuExtra);


/*
Compatibilité du menu Option d’affichage avec Vector
Auteur : Tpt
*/
function VectorCompatibility() {
  if (document.getElementById("p-displayOptions")) {
    document.getElementById("p-displayOptions").childNodes[1].style.display = "block";
  }
}

$(VectorCompatibility);


// Remove "Auteur:" prefix in category, see https://fr.wikisource.org/wiki/Cat%C3%A9gorie:Philosophes
$(function () {
  if (mw.config.get('wgNamespaceNumber') === 14) {
    $("li a[href^='/wiki/Auteur:']").each(function () {
      $(this).text($(this).text().substr("Auteur:".length));
    });
  }
});

/**
 * Boîtes déroulantes
 *
 * Pour [[Modèle:Méta palette de navigation]]
 */
var autoCollapse = 2;
var collapseCaption = '[Enrouler]';
var expandCaption = '[Dérouler]';


function collapseTable(tableIndex) {
  var Button = document.getElementById("collapseButton" + tableIndex);
  var Table = document.getElementById("collapsibleTable" + tableIndex);
  if (!Table || !Button) return false;

  var Rows = Table.getElementsByTagName("tr");

  if (Button.firstChild.data === collapseCaption) {
    for (let i = 1; i < Rows.length; i++) {
      Rows[i].style.display = "none";
    }
    Button.firstChild.data = expandCaption;
  } else {
    for (let i = 1; i < Rows.length; i++) {
      Rows[i].style.display = Rows[0].style.display;
    }
    Button.firstChild.data = collapseCaption;
  }
}

function createCollapseButtons() {
  var tableIndex = 0;
  var NavigationBoxes = {};
  var Tables = document.getElementsByTagName("table");

  for (let i = 0; i < Tables.length; i++) {
    if (hasClass(Tables[i], "collapsible")) {
      NavigationBoxes[tableIndex] = Tables[i];
      Tables[i].setAttribute("id", "collapsibleTable" + tableIndex);

      var Button = document.createElement("span");
      var ButtonLink = document.createElement("a");
      var ButtonText = document.createTextNode(collapseCaption);

      Button.style.styleFloat = "right";
      Button.style.cssFloat = "right";
      Button.style.fontWeight = "normal";
      Button.style.textAlign = "right";
      Button.style.width = "6em";

      ButtonLink.setAttribute("id", "collapseButton" + tableIndex);
      ButtonLink.setAttribute("href", "javascript:collapseTable(" + tableIndex + ");");
      ButtonLink.appendChild(ButtonText);

      Button.appendChild(ButtonLink);

      var Header = Tables[i].getElementsByTagName("tr")[0].getElementsByTagName("th")[0];
      /* only add button and increment count if there is a header row to work with */
      if (Header) {
        Header.insertBefore(Button, Header.childNodes[0]);
        tableIndex++;
      }
    }
  }

  for (var i = 0; i < tableIndex; i++) {
    if (hasClass(NavigationBoxes[i], "collapsed") || (tableIndex >= autoCollapse && hasClass(NavigationBoxes[i], "autocollapse"))) collapseTable(i);
  }
}

$(createCollapseButtons);

/**
 * Pour [[Modèle:Boîte déroulante]]
 * TODO: migrate to https://www.mediawiki.org/wiki/Manual:Collapsible_elements
 */
var NavigationBarShowDefault = 0;

function toggleNavigationBar(indexNavigationBar) {
  var NavToggle = document.getElementById("NavToggle" + indexNavigationBar);
  var NavFrame = document.getElementById("NavFrame" + indexNavigationBar);

  if (!NavFrame || !NavToggle) return;

  // surcharge des libellés dérouler/enrouler grâce a l'attribut title
  // exemple : title="[déroulade]/[enroulade]"
  var caption = [expandCaption, collapseCaption];
  if (NavFrame.title && NavFrame.title.length > 0) {
    caption = NavFrame.title.split("/");
    if (caption.length < 2) caption.push(collapseCaption);
  }

  // if shown now
  if (NavToggle.firstChild.data === caption[1]) {
    for (let NavChild = NavFrame.firstChild; NavChild !== null; NavChild = NavChild.nextSibling) {
      if (hasClass(NavChild, 'NavPic')) NavChild.style.display = 'none';
      if (hasClass(NavChild, 'NavContent')) NavChild.style.display = 'none';
      if (hasClass(NavChild, 'NavToggle')) NavChild.firstChild.data = caption[0];
    }

    // if hidden now
  } else if (NavToggle.firstChild.data === caption[0]) {
    for (let NavChild = NavFrame.firstChild; NavChild !== null; NavChild = NavChild.nextSibling) {
      if (hasClass(NavChild, 'NavPic')) NavChild.style.display = 'block';
      if (hasClass(NavChild, 'NavContent')) NavChild.style.display = 'block';
      if (hasClass(NavChild, 'NavToggle')) NavChild.firstChild.data = caption[1];
    }
  }
}

// adds show/hide-button to navigation bars
function createNavigationBarToggleButton() {
  var indexNavigationBar = 0;
  var NavFrame;
  // iterate over all < div >-elements
  for (let i = 0; NavFrame = document.getElementsByTagName("div")[i]; i++) {
    // if found a navigation bar
    if (hasClass(NavFrame, "NavFrame")) {
      indexNavigationBar++;
      var NavToggle = document.createElement("a");
      NavToggle.className = 'NavToggle';
      NavToggle.setAttribute('id', 'NavToggle' + indexNavigationBar);
      NavToggle.setAttribute('href', 'javascript:toggleNavigationBar(' + indexNavigationBar + ');');

      // surcharge des libellés dérouler/enrouler grâce a l'attribut title
      var caption = collapseCaption;
      if (NavFrame.title && NavFrame.title.indexOf("/") > 0) {
        caption = NavFrame.title.split("/")[1];
      }

      var NavToggleText = document.createTextNode(caption);
      NavToggle.appendChild(NavToggleText);

      // add NavToggle-Button as first div-element
      // in <div class="NavFrame">
      NavFrame.insertBefore(NavToggle, NavFrame.firstChild);
      NavFrame.setAttribute('id', 'NavFrame' + indexNavigationBar);
    }
  }
  // if more Navigation Bars found than Default: hide all
  if (NavigationBarShowDefault < indexNavigationBar) {
    for (var i = 1; i <= indexNavigationBar; i++) {
      toggleNavigationBar(i);
    }
  }
}

$(createNavigationBarToggleButton);

/**
 * Menu de navigation, pour Modèle:Menu de navigation - user:Dodoïste
 */

$(function () {
  // On cache les sous-menus
  // sauf celui qui porte la classe "open_at_load" :
  $(".navigation ul.subMenu:not(.open_at_load)").hide();
  // On sélectionne tous les items de liste portant la classe "toggleSubMenu"

  // et on remplace l'élément span qu'ils contiennent par un lien :
  $(".navigation li.toggleSubMenu span").each(function () {
    // On stocke le contenu du span :
    var TexteSpan = $(this).text();
    $(this).replaceWith('<a href="" class="subMenuA" title="Afficher le sous-menu">' + TexteSpan + '<\/a>');
  });

  // On modifie l'évènement "click" sur les liens dans les items de liste
  // qui portent la classe "toggleSubMenu" :
  $(".navigation li.toggleSubMenu > a").click(function () {
    // Si le sous-menu était déjà ouvert, on le referme :
    if ($(this).next("ul.subMenu:visible").length !== 0) {
      $(this).next("ul.subMenu").slideUp("normal", function () {
        $(this).parent().removeClass("open");
      });
    }
    // Si le sous-menu est caché, on ferme les autres et on l'affiche :
    else {
      $(".navigation ul.subMenu").slideUp("normal", function () {
        $(this).parent().removeClass("open");
      });
      $(this).next("ul.subMenu").slideDown("normal", function () {
        $(this).parent().addClass("open");
      });
    }
    // On empêche le navigateur de suivre le lien :
    return false;
  });

});


// Cache le lien "Ajouter un sujet" dans les pages contenant le marqueur idoine,
// un <span id="suppression_lien_ajouter_un_sujet"></span> suffit.
$(function () {
  if ($('#suppression_lien_ajouter_un_sujet').length) {
    $('#ca-addsection').css('display', 'none');
    // Pas de raison de spliter sur ce type de page.
    $('#ca-split').css('display', 'none');
  }
});

/* Modèle:Titre sous-page */
$(function () {
  if ($('#titre-sous-page-seul').length) {
    var $titre = $('#firstHeading');
    $titre.text($titre.text().split('/').slice(-1)[0]);
  }
});

// RÉSULTATS DEPUIS WIKIDATA
// [[File:Wdsearch_script_screenshot.png]]
if (mw.config.get('wgCanonicalSpecialPageName') === 'Search' || (mw.config.get('wgArticleId') === 0 && mw.config.get('wgCanonicalSpecialPageName') === false)) {
  mw.loader.load("//en.wikipedia.org/w/index.php?title=MediaWiki:Wdsearch.js&action=raw&ctype=text/javascript");
}
//--[[m:User:Nemo_bis|Nemo]] 13 décembre 2013 à 18:52 (UTC) ([[w:en:MediaWiki talk:Wdsearch.js|comments, translations and last instructions]])
//<!-- EdwardsBot 0661 -->


/*
 * [[Modèle:Index]]
 */
$(function () {
  $('#pr_index').each(function () {
    $('#ca-nstab-main').after(
        $('<li>').attr('id', 'ca-index').append($(this))
    );
  });
});


/* Bouton d'export blanc pour les non "bon pour export" */
if (mw.config.get('wgNamespaceNumber') === 0 && $.inArray("Bon pour export", mw.config.get('wgCategories')) === -1) {
  $(function () {
    mw.loader.using(['ext.wikisource.download'], function () {
      $('.ext-wikisource-download-button').removeClass('oo-ui-flaggedElement-progressive').removeClass('oo-ui-flaggedElement-primary');
    });
  });
}

/* Add nocache to download links in the sidebar for logged in users */
if (mw.config.get('wgNamespaceNumber') === 0 && mw.config.get('wgUserId')) {
  $(function () {
    $("#p-coll-print_export a[href*='ws-export.wmcloud.org/']").attr('href', function () {
      return $(this).attr('href') + '&nocache=1';
    });
  });
}

if (["edit", "submit"].includes(mw.config.get("wgAction"))) {
  /**
   * @type {HTMLAnchorElement}
   */
  const caseButton = document.querySelector("#wikiEditor-section-advanced a.tool-button[rel='toggleCase']");

  document.addEventListener("keydown", (e) => {
    switch (e.key.toLowerCase()) {
      case "m":
        if (e.ctrlKey && e.altKey) {
          e.preventDefault();
          if (caseButton) caseButton.click();
        }
        break;
    }
  });
}
