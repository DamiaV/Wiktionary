/**
 * Ce gadget permet de gérer les [[WT:PàS]] sans avoir à modifier le code de la page à la main.
 * [[Catégorie:JavaScript du Wiktionnaire|manage-page-deletions]]
 */
// <nowiki>
"use strict";
$(() => {
  console.log("Chargement de Gadget-wikt.manage-page-deletions.js…");

  const pageDeletionsPage = "Wiktionnaire:Pages proposées à la suppression";
  const pageTitle = mw.config.get("wgPageName");
  if (!pageTitle.startsWith(pageDeletionsPage.replaceAll(" ", "_") + "/")) {
    console.log(`Pas sur une sous-page de [[${pageDeletionsPage}]], désactivation du gadget.`);
    return;
  }

  const api = new mw.Api({userAgent: "Gadget-wikt.manage-page-deletions"});

  /**
   * @type {{[key: string]: {text: string, templateName: string, radio: HTMLInputElement}}}
   */
  const statuses = {
    waiting: {text: "En attente", templateName: "Élément en attente"},
    deleted: {text: "Supprimé", templateName: "Élément supprimé"},
    kept: {text: "Conservé", templateName: "Élément conservé"},
    renamed: {text: "Renommé", templateName: "Élément renommé"},
    merged: {text: "Fusionné", templateName: "Élément fusionné"},
    redirect: {text: "Transformé en redirection", templateName: "Élément transformé en redirection"},
  };

  const $dialog = $(`
<dialog>
  <h2 style="margin-top: 0">Statut à appliquer</h2>
  <form method="dialog">
    <label for="reason">Raison&nbsp;:</label>
    <input id="reason" type="text"><br>
    <button value="confirm">OK</button>
    <button value="cancel">Annuler</button>
  </form>
</dialog>`);
  {
    let i = 0;
    for (const [status, {text}] of Object.entries(statuses)) {
      const id = `status-choice-${i}`;
      const $choice = $(`<input id="${id}" name="status" type="radio" value="${status}">`);
      $dialog.find("form").prepend($choice, ` <label for="${id}">${text}</label><br>`);
      statuses[status].radio = $choice[0];
      i++;
    }
  }
  /** @type {HTMLDialogElement} */
  const dialog = $dialog[0];
  $dialog.on("close", () => {
    if (dialog.returnValue !== "confirm") return;
    // language=css
    const selection = $dialog.find("input[name='status']:checked").val();
    // language=css
    const reason = $dialog.find("#reason").val()
        .replaceAll(/~{3,5}/g, "")
        .trim();
    const selectedTemplateName = statuses[selection].templateName;

    api.edit(pageTitle, (revision) => {
      const requestIndex = $dialog.data("request-id");
      let requestI = -1;
      let ignoreLine = false;
      const lines = revision.content.split("\n");
      let targetPageTitle;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/<(nowiki|syntaxhighlight|pre|code)( [^>]*)?>/.test(line)) ignoreLine = true;
        // No else-if as it may be on the same line as the opening tag
        if (/<\/ *(nowiki|syntaxhighlight|pre|code)>/.test(line)) ignoreLine = false;
        if (ignoreLine) continue;

        if (line.startsWith("==")) console.log(line)
        const match = /^==\s*\[\[([^\[\]]+)(?:[#|][^\[\]]+)?]]\s*==$/.exec(line);
        if (match) targetPageTitle = match[1];

        if (!line.toLowerCase().startsWith("{{élément ")) continue;

        for (const {templateName} of Object.values(statuses)) {
          if (new RegExp(`^{{${templateName}.*}}$`, "i").exec(line)) {
            requestI++;
            if (requestI === requestIndex) {
              if (selectedTemplateName === statuses.waiting.templateName)
                lines[i] = `{{${selectedTemplateName}}}`;
              else {
                if (selectedTemplateName === statuses.kept.templateName) {
                  if (targetPageTitle) removeDeletionBanner(targetPageTitle);
                  else alert("La page cible n’a pas pu être extraite, veuillez retirer le bandeau de suppression à la main.");
                }
                lines[i] = `{{${selectedTemplateName}|${reason} ~~~~}}`;
              }
            }
            break;
          }
        }
      }
      return {
        text: lines.join("\n"),
        summary: "Mise à jour du status avec le gadget"
      };
    }).then(() => {
      window.location.reload();
    }).fail(() => {
      alert("Une erreur est survenue, veuillez ré-essayer.");
    });
  });
  document.body.append(dialog);

  $("*[data-tag^='status-']").each((index, element) => {
    const $banner = $(element);
    const $button = $(`
<button data-index="${index}" title="Modifier le status" style="margin-right: 1em; padding: 0.5em">
  <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/OOjs_UI_icon_edit-ltr-progressive.svg"
   alt="Pencil icon" style="width: 1em"/>
</button>`);
    $button.on("click", () => {
      const currentStatus = $banner.data("tag").substring(7);
      statuses[currentStatus].radio.checked = true;
      $dialog.data("request-id", index);
      dialog.showModal();
    });
    // language=css
    $banner.find("> div:first-child").prepend($button);
  });

  /**
   * Remove the deletion template in the target page.
   * @param targetPageTitle {string} The target page’s title.
   */
  function removeDeletionBanner(targetPageTitle) {
    api.edit(targetPageTitle, (revision) => {
      /** @type {string} */
      const text = revision.content;
      const regex = /\s*\{\{((à )?supprimer \?|suppr\?|suppression à débattre)(\|[^}]+)?}}\s*/g;
      if ((text.match(regex) || []).length > 1) throw new Error("multiple matches");
      const newText = text.replace(regex, "");
      return {
        text: newText,
        summary: "Retrait du bandeau de suppression avec le gadget"
      };
    }).fail((e) => {
      if (e instanceof Error && e.message === "multiple matches")
        alert(`Le bandeau n’a pas pu être retiré de la page « ${targetPageTitle} » car il y est présent plusieurs fois.`);
      else alert(`Le bandeau n’a pas pu être retiré de la page « ${targetPageTitle} ».`);
    });
  }
});
// </nowiki>
