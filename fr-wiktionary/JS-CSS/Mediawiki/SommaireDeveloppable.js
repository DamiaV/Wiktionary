/**
 * (en)
 * This gadget makes the table of content collapsible.
 * In the main namespace the first item of level 1 is always open by default.
 *
 * For help, see the talk page.
 * See also the template {{SommaireDéveloppable}}
 * -----------------------------------------------------------------------------------
 * (fr)
 * Ce gadget rend les tables des matières repliables.
 * Dans l’espace principal le premier item de niveau 1 est toujours ouvert par défaut.
 *
 * Pour l’aide, voir la page de discussion.
 * Voir aussi le modèle {{SommaireDéveloppable}}
 * -----------------------------------------------------------------------------------
 * [[Catégorie:JavaScript du Wiktionnaire|SommaireDeveloppable.js]]
 */
// <nowiki>
(() => {
  const inMainNamespace = mw.config.get("wgNamespaceNumber") === 0;
  // Check if the {{SommaireDéveloppable}} template is present in the page and what setting it’s on.
  const disable = !!document.getElementById("SommaireDeveloppable_NON");
  const enable = inMainNamespace || !!document.getElementById("SommaireDeveloppable_OUI");
  if (disable || !enable) return;

  const showNumbers = mw.user.options.get("numberheadings");

  const unfoldLabel = "[+]";
  const foldLabel = "[-]";
  const leafLabel = "[×]";

  const unfoldTitle = "Cette section a des sous-sections, cliquez pour les voir";
  const foldTitle = "Cliquez pour cacher les sous-sections";
  const leafTitle = "Cette section n’a pas de sous-sections";

  for (let level = 1; level < 7; level++) {
    const item = document.querySelectorAll(`li.toclevel-${level}`);
    // We reached the deepest level, no need to continue
    if (item.length === 0) break;

    for (let i = 0; i < item.length; i++) {
      const li = item[i];
      if (li.tagName !== "LI") continue;

      let button;
      if (li.children.length >= 2) {
        const ul = li.children[1];
        if (ul.tagName !== "UL") continue;

        button = document.createElement("a");
        button.style.cursor = "pointer";
        button.onclick = onClickGenerator(ul, button);

        // In the main namespace, always unfold the first item of the first level
        if (inMainNamespace && level === 1 && i === 0) {
          ul.style.display = "block";
          button.title = foldTitle;
          button.innerHTML = foldLabel;
        } else {
          ul.style.display = "none";
          button.title = unfoldTitle;
          button.innerHTML = unfoldLabel;
        }
      } else {
        button = document.createElement("span");
        button.title = leafTitle;
        button.innerHTML = leafLabel;
      }

      button.style.fontFamily = "courier, monospace, mono";
      button.style.color = "black";
      button.style.fontWeight = "bold";
      button.style.textDecoration = "none";
      li.insertBefore(button, li.firstChild);
    }
  }

  const numbers = document.querySelectorAll(".tocnumber");
  if (showNumbers)
    for (const number of numbers)
      number.style.display = "inline";
  else {
    for (const number of numbers)
      number.style.display = "none";
    // When using Chrome, if "dislay: table-cell" is kept, a new line is inserted after the buttons
    // cf. [[Wiktionnaire:Questions techniques/novembre 2015#MediaWiki:Gadget-SommaireDeveloppable.js merde sous Chrome]]
    $(".toctext").css("display", "inline");
  }

  /**
   * Generate a callback that toggles the visibility of the given list when the given button is clicked.
   * @param target {HTMLUListElement}
   * @param button {HTMLElement}
   * @returns {() => void}
   */
  function onClickGenerator(target, button) {
    return () => {
      if (target.style.display === "none") {
        target.style.display = "block";
        button.title = foldTitle;
        button.innerHTML = foldLabel;
      } else {
        target.style.display = "none";
        button.title = unfoldTitle;
        button.innerHTML = unfoldLabel;
      }
    };
  }
})();
// </nowiki>
