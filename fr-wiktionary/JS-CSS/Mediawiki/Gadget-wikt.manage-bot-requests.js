/**
 * Ce gadget permet de gérer les requêtes aux bots sans avoir à modifier le code de la page à la main.
 * [[Catégorie:JavaScript du Wiktionnaire|manage-bot-requests]]
 */
// <nowiki>
"use strict";
$(() => {
  console.log("Chargement de Gadget-wikt.manage-bot-requests.js…");

  const botRequestsPage = "Wiktionnaire:Bots/Requêtes";
  if (mw.config.get("wgPageName") !== botRequestsPage) {
    console.log(`Pas sur [[${botRequestsPage}]], désactivation du gadget.`);
    return;
  }

  const api = new mw.Api({userAgent: "Gadget-wikt.manage-bot-requests"});

  /**
   * @type {{[key: string]: {text: string, templateName?: string, radio: HTMLInputElement}}}
   */
  const statuses = {
    none: {text: "Aucun"},
    doing: {text: "En cours", templateName: "Requête en cours"},
    done: {text: "Traitée", templateName: "Requête fait"},
    refused: {text: "Refusée", templateName: "Requête refus"},
    info: {text: "Demande d’informations", templateName: "Requête info"},
    pause: {text: "En pause", templateName: "Requête pause"},
    noFollowUp: {text: "Sans suite", templateName: "Requête sans suite"},
  };

  const $dialog = $(`
<dialog>
  <h2 style="margin-top: 0">Statut à appliquer</h2>
  <form method="dialog">
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
    const templateName = statuses[selection].templateName;
    const template = templateName ? `{{${templateName}}} ` : "";

    api.edit(botRequestsPage, (revision) => {
      const requestIndex = $dialog.data("request-id");
      let requestI = -1;
      let ignoreLine = false;
      const lines = revision.content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/<(nowiki|syntaxhighlight|pre|code)( [^>]*)?>/.test(line)) ignoreLine = true;
        // No else-if as it may be on the same line as the opening tag
        if (/<\/ *(nowiki|syntaxhighlight|pre|code)>/.test(line)) ignoreLine = false;
        if (ignoreLine) continue;

        const match = /^==([^=].*?)==$/.exec(line);
        if (match) {
          requestI++;
          if (requestI === requestIndex) {
            const match2 = /^==\s*\{\{Requête [^}]+}}\s*(.*?)\s*==$/.exec(line);
            const text = match2 ? match2[1].trim() : match[1].trim();
            lines[i] = `== ${template}${text} ==`;
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

  $(".mw-parser-output .mw-heading2 h2").each((index, element) => {
    const $title = $(element);
    const $button = $(`
<button data-index="${index}" title="Modifier le status" style="margin-right: 1em; padding: 0.5em">
  <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/OOjs_UI_icon_edit-ltr-progressive.svg"
   alt="Pencil icon" style="width: 1em"/>
</button>`);
    $button.on("click", () => {
      // language=css
      const $currentStatus = $title.find("span[data-request-status]");
      if ($currentStatus.length !== 0)
        statuses[$currentStatus.data("request-status")].radio.checked = true;
      else statuses.none.radio.checked = true;
      $dialog.data("request-id", index);
      dialog.showModal();
    });
    $button.insertBefore($title);
  });
});
// </nowiki>
