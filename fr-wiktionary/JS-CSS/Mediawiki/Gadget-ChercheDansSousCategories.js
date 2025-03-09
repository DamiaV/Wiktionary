/*************************************************************************************
 Recherche de mots (de titres de pages, en fait)
 dans une catégorie et ses sous-catégories
 **************************************************************************************
 Code en partie inspiré de w:MediaWiki:Gadget-RenommageCategorie.js, par Dr Brains
 Le reste est fait par ArséniureDeGallium, Darkdadaah, et d'autres, sous CC-BY-SA.
 v1.0, juillet 2012.
 v2.0, ne refait pas les requêtes à chaque fois, juillet 2012.
 v2.1, option wikicode, juillet 2012.
 v2.2, option Ignorer les sous-catégories, novembre 2012.
 v2.3, conversion en jQuery, août 2014.
 v2.4, ajout lien dans l'encadré CatégorieTDM, janvier 2015.
 **************************************************************************************
 [[Catégorie:JavaScript du Wiktionnaire|ChercheDansSousCatégories.js]]
 **************************************************************************************/

// Libellé de l'onglet
var CherCats_Text_Onglet = "Chercher dans la catégorie";

// --------------------------------------------------------------------------------------------
// Variables globales

var CherCats_CategMere = mw.config.get('wgPageName'); // page en cours, non modifiable
var CherCats_Stop = 1;	//arrêt du traitement
var CherCats_Scanned = 0;
var CherCats_TooMuch = 0;

if (mw.config.get('wgUserName') !== null) { // tous les utilistaurs sauf ceux sous IP
  var CherCats_Pause = 10; //millisecondes entre 2 cats
  var CherCats_MaxRq = 25000; //maximum de requêtes autorisées
  var CherCats_MaxRep = 4999; //maximum de réponses par requête
}
else { // limites pour ceux sous IP (afin d'éviter les bots et autres moyens de faire un déni de service)
  var CherCats_Pause = 50; //millisecondes entre 2 cats
  var CherCats_MaxRq = 250; //maximum de requêtes autorisées
  var CherCats_MaxRep = 499; //maximum de réponses par requête
}

var CherCats_ResultTxt = "Cherchez dans cette catégorie : un mot qui commence par certaines lettres, " +
    "finit par certaines lettres, ou comporte n’importe quelle séquence de lettres avec des trous. " +
    "C’est l’idéal pour trouver des mots pour les mots-croisés !\n\n" +
    "Dans le champ de recherche, utilisez le caractère « * » pour toute suite quelconque de caractères que vous ne connaissez pas, " +
    "en combinaison avec les lettres que vous connaissez.";

// --------------------------------------------------------------------------------------------
// Ajout du lien dans les onglets après "renommer" & cie
// et, si trouvé, dans CatégorieTDM
if (mw.config.get('wgNamespaceNumber') == 14) { //limiter aux catégories
  jQuery(CherCats_AddLink);
}

jQuery(document).ready(function ($) {
  var tspan = document.getElementById("TDM_CDSC");
  if (tspan) {
    var puce = '<span style="white-space:nowrap"> <b>·</b> </span>';
    if (mw.config.get('wgNamespaceNumber') == 14) { //lien seulement dans les catégories
      tspan.innerHTML = puce + '<a href="#"  title="Rechercher des mots dans cette catégorie" id="LIEN_CDSC">rechercher</a>';
      $('#LIEN_CDSC').click(CherCats_OpenMenu);
    }
    else { //il s'agit sans doute d'une page de doc
      tspan.innerHTML = puce + '<span title="Ce lien ne fonctionne que sur les pages de catégories" style="color:darkred">rechercher</span>';
    }
  }
});

function CherCats_AddLink() {
  // (documenté dans [[mw:ResourceLoader/Default_modules#addPortletLink]])
  var portletLink = mw.util.addPortletLink('p-cactions', '#',
      CherCats_Text_Onglet, 'chercher-categories', 'Cliquez ici pour faire des recherches dans les sous-catégories'
  );
  $(portletLink).click(function () {
    CherCats_OpenMenu();
  });
}

/***********************************************************************************
 BOITE DE DIALOGUE
 ************************************************************************************/
// ----------------------------------------
// Création de la boite de dialogue

function CherCats_OpenMenu() {
  if (document.getElementById('CherCats_IdMenu')) return; // boiboite déjà ouverte
  var ResultTxt = CherCats_ResultTxt;
  var CategName = CherCats_CategMere.substr(10).replace(/_/g, " ");

  // création boiboite en html
  var Menu = document.createElement('div');
  Menu.id = 'CherCats_IdMenu';
  Menu.className = 'CherCats_IdMenu';
  Menu.style.position = 'fixed';
  Menu.style.zIndex = 500;
  Menu.style.padding = '5px';
  Menu.style.backgroundColor = 'white';
  Menu.style.border = '3px double black';
  Menu.style.width = '450px';
  Menu.style.height = '280px';
  document.body.appendChild(Menu);
  PositionGauche = parseInt(($(window).width() - Menu.clientWidth) / 2);
  PositionHaut = parseInt(($(window).height() - Menu.clientHeight) / 10);
  Menu.style.left = PositionGauche + 'px';
  Menu.style.top = PositionHaut + 'px';
  var MenuContent = '' +
      '<label for="IdCategMere">Catégorie : </label>' +
      '<input type="text" id="IdCategMere" value="' + CategName + '" disabled="disabled" size="46"/>' +
      '<br />' +
      '<label for="IdJokers">Chercher : </label>' +
      '<input type="text" id="IdJokers" value="*" size="46"/>' +
      '<br />' +
      '<input type="checkbox" id="IdWikiCode" style="cursor:pointer;" />' +
      '<label for="IdWikiCode" style="font-size: 80%">Résultat en code wiki</label>' +
      '&nbsp;' +
      '<input type="checkbox" id="IdPasSousCat" style="cursor:pointer;" onchange="CherCats_Scanned=0;" />' +
      '<label for="IdPasSousCat" style="font-size: 80%">Ignorer les sous-catégories</label>' +
      '<br />' +
      '<textarea id="IdResult" name="Résultat" rows="10" cols="30" readonly="readonly">' +
      ResultTxt + '</textarea>' +
      '<br />' +
      '<center>' +
      '<input type="button" id="OKbutton_CDSC" style="cursor:pointer;" value="Chercher" />' +
      '&nbsp;&nbsp;' +
      '<input type="button" id="Cancel_CDSC" style="cursor:pointer;" value="Quitter" title="Quitter" />' +
      '&nbsp;&nbsp;' +
      '<input type="button" id="Help_CDSC" style="cursor:pointer;" value="Aide" title="Aide" />' +
      '</center>';
  Menu.innerHTML = MenuContent;
  $('#OKbutton_CDSC').click(CherCats_CheckMenu);
  $('#Cancel_CDSC').click(CherCats_CloseMenu);
  $('#Help_CDSC').click(CherCats_HelpMenu);

  // initialisations de la boiboite
  document.getElementById("IdJokers").focus();
}

// ------------------------------------------
// Traitement du bouton "arrêter"
// ------------------------------------------
function CherCats_StopMenu() {
  CherCats_Stop = 1; //pour arrêter le script s'il est en cours
  document.getElementById('IdResult').value = "Traitement arrêté par l'utilisateur";
  setTimeout(CherCats_ListCat99, 10);
}

// ------------------------------------------
// Traitement du bouton "fermer"
// * ferme la boite de dialogue
// ------------------------------------------
function CherCats_CloseMenu() {
  CherCats_Stop = 1; //pour arrêter le script s'il est en cours
  var Menu = document.getElementById('CherCats_IdMenu');
  if (Menu) $(Menu).remove();
}

// ------------------------------------------
// Traitement du bouton "aide"
// ------------------------------------------
function CherCats_HelpMenu() {
  window.open("http://fr.wiktionary.org/wiki/Aide:Gadget-ChercheDansSousCategories");
}

// ------------------------------------------
// Traitement du bouton "lancer"
// ------------------------------------------
function CherCats_CheckMenu() {

  // récupération de la regexp
  var riri = document.getElementById('IdJokers').value;
  if (riri === "") riri = "*";
  CherCats_RegExp = new RegExp("^" + riri.replace(/\*/g, ".*").replace(/\?/g, ".") + "$", "g");

  // bouton transformé en "arrêter"
  var OKb = document.getElementById("OKbutton_CDSC");
  OKb.value = "Stop";
  OKb.onclick = CherCats_StopMenu;

  // recherche des mots
  if (CherCats_Scanned) {
    setTimeout(CherCats_ListCat4, 10);
  }
  else {
    CherCats_Stop = 0;
    setTimeout(CherCats_ListCat0, 10);
  }
}

/***********************************************************************************************
 recherche dans toutes les sous-catégories
 ***********************************************************************************************/

// --------------------------------------------------------
// 0 : initialisation, création des vars globales,
// puis aller en (1) pour la cat mère
// --------------------------------------------------------
function CherCats_ListCat0() {

  //initialisation fifo des sous-cats
  SousCatFifo = [];
  SousCatFifo.push(CherCats_CategMere);
  SousCatFifoPtrOut = 0;

  //initialisation liste des mots
  SousCatListeMots = [];

  //lancement listage à partir de la racine
  CherCats_NbRq = 0;
  SousCatEnCours = CherCats_CategMere;
  setTimeout(CherCats_ListCat1, 10);
}

// ------------------------------------------------------------------
// 1 : requête api du contenu de la cat en cours
// la fonction ajax ira normalement en (2) lorsqu'elle aura fini
// ------------------------------------------------------------------
function CherCats_ListCat1(CatArray, category, categorycontinue) {
  if (CherCats_Stop) return; //arrêt demandé par l'utilisateur

  if (!CatArray) CatArray = [];
  if (!category) {
    category = SousCatEnCours;
    document.getElementById('IdResult').value = "Traitement en cours, veuillez patienter (cela peut être un peu long).\n>" +
        SousCatFifoPtrOut + " : " +
        category + "...";
  }
  if (!categorycontinue) categorycontinue = '';
  var URL = mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/api.php?format=xml&action=query&list=categorymembers' +
      '&cmtitle=' + encodeURIComponent(category) +
      '&cmlimit=' + CherCats_MaxRep +
      '&cmnamespace=' +
      categorycontinue;

  //pour être gentil avec les serveurs...
  CherCats_NbRq += 1;
  if (CherCats_NbRq > CherCats_MaxRq) {
    document.getElementById('IdResult').value = "Trop de requêtes au serveur : programme arrêté.";
    CherCats_Scanned = 1; //valable jusqu'à changement de page ou purge du cache
    CherCats_TooMuch = 1;
    setTimeout(CherCats_ListCat4, 10);
    return;
  }

  $.get(URL, function (data) {
    CherCats_ListCat2(data, category, CatArray);
  }, 'xml');
}

// --------------------------------------------------------------------------------------------
// 2 : récupération des résultats de la requête api
// s'il reste encore des résultats à récupérer sur la même cat, alors retour en (1)
// sinon passage en (3) pour traiter une autre cat
// --------------------------------------------------------------------------------------------
function CherCats_ListCat2(ElementTraitement, category, CatArray) {
  if (CherCats_Stop) return; //arrêt demandé par l'utilisateur

  var Pages = ElementTraitement.getElementsByTagName('cm');

  for (a = 0; a < Pages.length; a++) {
    var TitrePage = Pages[a].getAttribute('title');
    var SpacePage = Pages[a].getAttribute('ns');
    if ((SpacePage == 14) && (!document.getElementById('IdPasSousCat').checked)) {
      //mise dans la fifo des cats en évitant les doublons (ce qui doit permettre d'éviter la bcle infinie)
      if (SousCatFifo.indexOf(TitrePage) == -1) {
        SousCatFifo.push(TitrePage);
      }
    }
    else if (SpacePage === '0') {
      //mise dans la liste des mots en évitant les doublons
      if (SousCatListeMots.indexOf(TitrePage) == -1) {
        SousCatListeMots.push(TitrePage);
      }
    }
  }

  var CatContinue = ElementTraitement.getElementsByTagName('query-continue')[0];
  if (CatContinue) {
    //suite de la requête api
    document.getElementById('IdResult').value += ".";
    var AutreRequeteContinue = '&cmcontinue=' + encodeURIComponent(CatContinue.firstChild.getAttribute("cmcontinue"));
    CherCats_ListCat1(CatArray, category, AutreRequeteContinue);

  }
  else {
    //requête finie pour la catégorie
    setTimeout(CherCats_ListCat3, 10);
  }
}

// --------------------------------------------------------------------------------------------
// 3 : s'il reste des cats à traiter, aller en (1) pour cat suivante,
// sinon aller en (4) pour afficher la liste de mots.
// --------------------------------------------------------------------------------------------
function CherCats_ListCat3() {
  if (CherCats_Stop) return; //arrêt demandé par l'utilisateur

  SousCatFifoPtrOut += 1;
  if (SousCatFifoPtrOut < SousCatFifo.length) {
    SousCatEnCours = SousCatFifo[SousCatFifoPtrOut];
    setTimeout(CherCats_ListCat1, CherCats_Pause);
  }
  else {
    document.getElementById('IdResult').value = "Le résultat va être affiché.\n>";
    CherCats_Scanned = 1; //valable jusqu'à changement de page ou purge du cache
    setTimeout(CherCats_ListCat4, 10);
  }
}

// --------------------------------------------------------------------------------------------
// 4 : affichage du résultat
// --------------------------------------------------------------------------------------------
function CherCats_ListCat4() {
  var nbsc = SousCatFifo.length - 1;
  var wiki = document.getElementById('IdWikiCode').checked;
  var sscat = !document.getElementById('IdPasSousCat').checked;
  var ResultTxt = "";
  var nbmots = 0;
  var k;

  for (k = 0; k < SousCatListeMots.length; k++) {
    var fifi = new RegExp(CherCats_RegExp);
    var TitrePage = SousCatListeMots[k];
    if (fifi.test(TitrePage)) {
      if (wiki) {
        ResultTxt += "* [[" + TitrePage + "]]\n";
      }
      else {
        ResultTxt += TitrePage + "\n";
      }
      nbmots += 1;
    }
  }

  var ch1 = "";
  if (sscat) {
    ch1 = " et ses " + nbsc + " sous-catégories";
  }
  else {
    ch1 = ", sans les sous-catégories";
  }
  if (CherCats_TooMuch) {
    ch1 += " (arrêté avant la fin, trop de requêtes)";
  }

  ResultTxt = nbmots + " terme(s) trouvé(s) pour  «\u00a0" + document.getElementById('IdJokers').value + "\u00a0» dans «\u00a0" +
      CherCats_CategMere.substr(10) + "\u00a0»" +
      ch1 + " :\n\n" +
      ResultTxt +
      "\n-------------------\nCatégories analysées :\n";
  for (k = 0; k < nbsc + 1; k++) {
    ResultTxt += "∙ " + SousCatFifo[k] + "\n";
  }

  document.getElementById('IdResult').value = ResultTxt;

  setTimeout(CherCats_ListCat99, 10);
}

// --------------------------------------------------------------------------------------------
// 99 : bouton rétabli en "lancer"
// --------------------------------------------------------------------------------------------
function CherCats_ListCat99() {
  var OKb = document.getElementById("OKbutton_CDSC");
  OKb.value = "Chercher";
  OKb.onclick = CherCats_CheckMenu;
}
