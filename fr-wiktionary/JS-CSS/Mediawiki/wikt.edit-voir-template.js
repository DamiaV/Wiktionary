// [[Catégorie:JavaScript du Wiktionnaire|edit-voir-template.js]]
"use strict";

$(() => {
  const API = new mw.Api({ userAgent: "Gadget-wikt.edit-voir-template" });
  const INPAGE_REGEX = /{{voir\|([^}]+)}}/;
  const OUTPAGE_REGEX = /{{voir\/([^}]+)}}/;

  /**
   * Fetch the wikicode of the given page.
   * @param title {string} The page’s title.
   * @param onSuccess {(string) => void} A function to call when the given page’s text has been fetched.
   */
  function getPageWikicode(title, onSuccess) {
    $.get("/wiki/" + encodeURIComponent(title), { "action": "raw" }, onSuccess);
  }

  /**
   * Cherche le modèle voir dans la page, identifie s'il est dans la page ou
   * dans un sous-modèle et lance la bonne fonction en conséquence.
   * @param title Titre de la page courante.
   * @param data Contenu de la page courante.
   */
  function searchVoir(title, data) {
    const inPageMatch = INPAGE_REGEX.exec(data);
    const outPageMatch = OUTPAGE_REGEX.exec(data);

    if (inPageMatch && outPageMatch)
      alert("Plusieurs modèles voir cohabitent. Traitement impossible.");
    else if (outPageMatch) {
      const name = outPageMatch[1];
      getPageWikicode("Modèle:voir/" + name, (data) => {
        const m = INPAGE_REGEX.exec(data);
        if (m) editVoir("Modèle:voir/" + name, m);
      });
    } else if (inPageMatch)
      editVoir(title, inPageMatch);
  }

  function editVoir(title, m) {
    const elements = m[1].split("|");
    const value = prompt("Liste des éléments (à séparer par des barres verticales) :", elements.join("|"));
    if (value) {
      API.edit(title, (revision) => ({
        text: revision.content.replace(m[1], value),
        summary: "Modification des éléments par le gadget Modifier-voir."
      })).then(() => {
        location.reload();
      });
    }
  }

  /**
   * @param title {string}
   * @param inPageMatch {RegExpExecArray}
   */
  function merge(title, inPageMatch) {
    console.debug("Début");
    var toSee = [];
    var seen = [];

    // Initialise la recherche
    seen.push(title);
    inPageMatch[1].split("|").forEach((name) => {
      if (!toSee.includes(name.trim()) && title !== name.trim())
        toSee.push(name.trim());
    });

    console.debug("Exploration");
    // Recherche de tous les mots
    let i = 0;
    while (toSee.length !== 0 && i < 15) {
      console.debug("toSee", toSee);
      console.debug("seen", seen);
      const name = toSee.pop();
      if (!seen.includes(name)) seen.push(name);

      getPageWikicode(name, (data) => {
        const inPageMatch = INPAGE_REGEX.exec(data);
        if (!inPageMatch) return;
        inPageMatch[1].split("|").forEach((name) => {
          const trimmedName = name.trim();
          if (!(seen.includes(trimmedName) && toSee.includes(trimmedName)))
            toSee.push(trimmedName);
        });
      });
      i++;
    }

    // Création du modèle
    const value = prompt("Nom du modèle à utiliser (uniquement la partie après le /)", seen.join('|'));
    if (value) {
      API.create(
          "Modèle:voir/" + value,
          {
            summary: "Fusion des modèles voir."
          },
          `{{voir|${seen.join('|')}}}<noinclude>[[Catégorie:Modèles de désambiguïsation|${value}]]</noinclude>`
      ).then(
          () => {
            seen.forEach((title) => {
              // Remplacement du modèle
              API.edit(title, (revision) => ({
                text: revision.content.replace(INPAGE_REGEX, `{{voir/${value}}}`),
                summary: "Fusion des modèles voir."
              })).then(console.log);
            });
            mw.notify("Fusion effectuée.");
          },
          (error) => {
            if (error === "articleexists") {
              mw.notify("Modèle existant. Fusion automatique impossible. Remplacement local uniquement.");
              API.edit(title,
                  (revision) => ({
                    text: revision.content.replace(INPAGE_REGEX, `{{voir/${value}}}`),
                    summary: "Utilisation du modèle voir existant."
                  })
              ).then(() => {
                location.reload();
              });
            }
          }
      );
    }
  }

  function addMergeButton(title, data) {
    const match = INPAGE_REGEX.exec(data);
    if (!match) return;
    const portletLink = mw.util.addPortletLink("p-cactions", "#", "Fusionner les modèles voir");
    $(portletLink).click(() => {
      merge(title, match);
    });
  }

  const templates = $(".modele-voir");
  if (templates.length) {
    const title = mw.config.get("wgPageName");

    getPageWikicode(title, (data) => {
      addMergeButton(title, data)
    });

    const $editLink = $('<a style="float:right" href="#">(modifier)</a>');
    $editLink.click(() => {
      getPageWikicode(title, (data) => {
        searchVoir(title, data);
      });
    });

    templates.append($editLink);
  }
});
