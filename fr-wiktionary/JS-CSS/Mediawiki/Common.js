/**
 * Cette page contient des fonctions JavaScript qui sont utilisées ou exécutées
 * à chaque chargement de page pour tous les utilisateurs.
 * Elle est donc à modifier avec précaution !
 * --
 * [[Catégorie:JavaScript du Wiktionnaire]]
 */

/*
 * Applique le style des pages de discussion à des pages qui n’en sont
 * techniquement pas, comme la Wikidémie (cas spécial).
 */
$(() => {
  const pages = [
    "Bulletin_des_administrateurs",
    "Bulletin_des_bureaucrates",
    "Bulletin_de_la_patrouille",
    "Demandes_aux_administrateurs",
    "Demandes_aux_bureaucrates",
    "Gestion_des_catégories",
    "Gestion_des_modèles",
    "Pages_proposées_à_la_suppression",
    "Pages_proposées_au_renommage",
    "Proposer_un_mot",
    "Questions_sur_les_mots",
    "Questions_techniques",
    "Wikidémie",
    "Boîte_à_idées",
  ];

  if (
      new RegExp("^Wiktionnaire:(" + pages.join("|") + ")").test(mw.config.get("wgPageName")) ||
      $("#transformeEnPageDeDiscussion").length
  ) {
    const $body = $("body");

    $body.removeClass("ns-4").addClass("ns-1");
    $body.removeClass("ns-subject").addClass("ns-talk");
  }
});

/*
 * Repositionne la page sur l’ancre avec laquelle elle a été appelée
 * après le repli de la table des matières, ou le coloriage des discussions, entre autres.
 */
if (window.location.hash) {
  // execute on window.load to try to get the best accuracy
  $(window).on("load", () => {
    const currentTarget = document.getElementById(window.location.hash.substring(1));
    if (currentTarget) {
      currentTarget.scrollIntoView();
    }
  });
}

/*
 * Ajoute un style particulier aux liens interlangues vers un bon article ou
 * un article de qualité.
 * (Copié depuis [[w:MediaWiki:Common.js]])
 */
$(() => {
  // links are only replaced in p-lang
  if (typeof window.disableFeaturedInterwikiLinks !== "undefined") {
    return;
  }
  const pLang = document.getElementById("p-lang");
  if (!pLang) {
    return;
  }
  const listItems = pLang.getElementsByTagName("li");
  const listLength = listItems.length;

  if (mw.config.get("wgNamespaceNumber") === 0) {
    for (let i = 0; i < listLength; i++) {
      // ADQ- est intentionnel pour correspondre au modèle Lien AdQ, on
      // ne doit pas le corriger.
      if (document.getElementById("ADQ-" + listItems[i].className)) {
        listItems[i].className += " AdQ";
        listItems[i].title = "Lien vers un article de qualité";
      }
    }
  }
});

/*
 * Change le titre de la page tel que spécifié par le modèle
 * [[Modèle:titre incorrect]]. La fonction cherche un bandeau de la forme :
 *
 * <div id="RealTitleBanner">
 *  <span id="RealTitle">titre</span>
 * </div>
 *
 * Un élément comportant id="DisableRealTitle" désactive la fonction.
 * (Copié de Wikipédia)
 */
$(() => {
  const $titleBanner = $("#RealTitleBanner");

  if ($titleBanner && !$("#DisableRealTitle").length) {
    const $realTitle = $("#RealTitle");
    const realTitle = $realTitle.html();
    const $h1 = $("h1")[0];

    if (realTitle && $h1) {
      if (realTitle === "") {
        $($h1).hide();
      } else {
        $($h1).html(realTitle);
        // noinspection JSValidateTypes
        if (mw.config.get("wgAction") === "view" && $realTitle.children().length === 0) {
          document.title = $realTitle.text() + " — Wiktionnaire";
        }
      }
      $titleBanner.hide();
    }
  }
});

/*
 * Change le lien d’import en lien vers la page [[Aide:Importer un fichier]].
 * Copié depuis Wikipédia.
 */
$(() => {
  $("#t-upload a").attr("href", "/wiki/Aide:Importer_un_fichier");
});

/*
 * Permet d’afficher/cacher les illustrations cachées.
 */
$(() => {
  $(".show-illus-btn").each(function () {
    const $showBtn = $(this);
    const $div = $showBtn.parent().parent();
    const $illusDiv = $div.next();
    // Hide button
    $illusDiv.find(".hide-illus-btn").on("click", () => {
      $div.show();
      $illusDiv.hide();
    });
    // Show div
    $showBtn.on("click", () => {
      $illusDiv.show();
      $div.hide();
    });
  });
});

/*
 * Cette fonction remplace le lien des modèles d’ébauche (.stubedit) par le lien
 * de modification de la section supérieure la plus proche, pour éviter de
 * modifier toute la page.
 * Auteur : [[Utilisateur:Darkdadaah]].
 */
// FIXME code dupliqué dans [[MediaWiki:Gadget-Section links.js]]
$(function stubeditLink() {
  $(".stubedit a").attr("href", function () {
    let $ol = $(this);
    let lim = 0;
    // Remonte en haut de la hiérarchie
    while ($ol.parent().attr("id") !== "mw-content-text" && lim < 50) {
      $ol = $ol.parent();
      lim++;
    }
    // On remonte et on récupère le premier titre venu
    const $hall = $ol.prevAll("h2, h3, h4");
    if ($hall.length > 0) {
      let href = "";
      $hall.each(function () {
        const $modif = $(this).find(".mw-editsection a");
        href = $modif.attr("href");
        return false;	// break each loop
      });
      return href;	// Nouveau lien
    }
    return $(this).attr("href");	// Défaut : lien normal
  });
});

/*
 * Ajoute deux paramètres d’URL en mode édition
 * qui permettent de définir le contenu de la zone
 * d’édition (preload-edit-text) et/ou le résumé de
 * modification (preload-edit-summary).
 */
$(() => {
  if (["edit", "submit"].includes(mw.config.get("wgAction"))) {
    const searchParams = new URL(location.href).searchParams;
    const content = (searchParams.get("preload-edit-text") || "").trim();
    const summary = (searchParams.get("preload-edit-summary") || "").trim();

    if (content) {
      $("#wpTextbox1").val(content);
    }
    if (summary) {
      $("#wpSummary").val(summary);
    }
  }
});
