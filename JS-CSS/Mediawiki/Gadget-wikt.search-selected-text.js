/**
 * (fr)
 * Ce gadget affiche un popup à côté du texte sélectionné dans la page
 * qui permet de rechercher le texte en question sur le Wiktionnaire.
 * ---
 * (en)
 * This gadget shows a popup next to the selected text in the page
 * which allows searching for that texte in the Wiktionnaire.
 */
"use strict";

$(() => {
  const POPUP_OFFSET = 10;

  console.log("Chargement de Gadget-wikt.search-selected-text.js…");

  const $popup = $('<div id="search-popup" style="display: none"></div>');
  const $link = $('<a href="#" target="_blank" title="S’ouvre dans un nouvel onglet">Rechercher</a>');
  $popup.append($link);
  $("body").append($popup);

  let selectedText, selectionRect;

  document.addEventListener("selectionchange", () => {
    $popup.hide();
    const selection = window.getSelection();
    selectedText = selection.toString();
    $link.attr(
        "href",
        `https://fr.wiktionary.org/w/index.php?go=Lire&search=${encodeURIComponent(selectedText)}&title=Spécial:Recherche`
    );
    if (selection.rangeCount)
      selectionRect = selection.getRangeAt(0).getBoundingClientRect();
  });

  document.addEventListener("mouseup", () => {
    if (selectedText) {
      $popup.show();
      const popupRect = $popup[0].getBoundingClientRect();
      $popup.css({
        top: (window.scrollY + selectionRect.top - popupRect.height - POPUP_OFFSET) + "px",
        left: (window.scrollX + selectionRect.left + selectionRect.width + POPUP_OFFSET) + "px"
      });
    } else $popup.hide();
  })
});
