// [[Catégorie:JavaScript du Wiktionnaire|Formatage.js]]
// <nowiki>
"use strict";

const { formatSections } = require("./Formatage/sections.js");
const { fixTypography } = require("./Formatage/typography.js");
const { getEditAreaText, setEditAreaText } = require("./wikt.core.edit.js");

console.log("Chargement de Gadget-Formatage.js…");

function createFormatButton() {
  $(`
<span id="codeFormatterWidget"
      class="oo-ui-widget oo-ui-widget-enabled oo-ui-buttonElement oo-ui-buttonElement-framed oo-ui-labelElement oo-ui-buttonInputWidget">
  <input id="codeFormatter" class="oo-ui-inputWidget-input oo-ui-buttonElement-button"
         aria-disabled="false" value="Formater" title="Formater le wikitexte" type="button">
</span>
`).insertAfter($("#wpDiffWidget"));
  $("#codeFormatter").attr(
      "tabindex",
      parseInt($("#wpDiffWidget input").attr("tabindex")) + 1
  ).click((event) => {
    event.preventDefault();
    formatWikicode();
    return false;
  });
}

function formatWikicode() {
  disableWikEd();
  const text = getEditAreaText();
  const res = formatSections(text);
  const newText = fixTypography(res.newText);
  let changesCount = 0;
  if (text !== newText) {
    setEditAreaText(newText);
    changesCount = res.changesCount;
  }
  logChanges(res.errors, changesCount);
  enableWikEd();
}

/**
 * @param errors {LineError[]}
 * @param changesCount {number}
 */
function logChanges(errors, changesCount) {
  let $formattingLog = $("#log_formatage");
  let $changesCount = $("#nombre_modifs");
  let $errorsCount = $("#nombre_erreurs");

  if ($formattingLog.length === 0) {
    $formattingLog = $("<div>", {
      id: "log_formatage",
    });
    $formattingLog.appendTo(".editButtons");
    $formattingLog.hide();
  }

  if ($changesCount.length === 0) {
    $changesCount = $("<span>", {
      id: "nombre_modifs",
      class: "form_message_info"
    });
    $changesCount.insertAfter("#codeFormatterWidget");
    $changesCount.hide();
  }

  if ($errorsCount.length === 0) {
    $errorsCount = $("<span>", {
      id: "nombre_erreurs",
      class: "form_message_info"
    });
    $errorsCount.insertAfter("#codeFormatterWidget");
    $errorsCount.hide();
  }

  if (changesCount === 0)
    $changesCount.text("Aucun formatage");
  else if (changesCount === 1)
    $changesCount.text("1 changement");
  else
    $changesCount.text(changesCount + " changements");
  $changesCount.show("fast");

  if (errors.length) {
    const $errorMessage = $("<p>");

    // Indicateur de nombre
    if (errors.length === 1)
      $errorsCount.text("(1 erreur)");
    else
      $errorsCount.text("(" + errors.length + " erreurs)");

    const $table = $("<table>", {
      class: "wikitable"
    });
    const $header = $("<tr>");
    $header.append($("<th>", { text: "Ligne" }));
    $header.append($("<th>", { text: "Élément" }));
    $header.append($("<th>", { text: "Erreur" }));
    $table.append($header);

    for (const error of errors) {
      const $row = $("<tr>");
      $row.append($("<td>", { text: error.lineNumber }));
      $row.append($("<td>", { text: error.invalidLine }));
      $row.append($("<td>", { text: error.error }));
      $table.append($row);
    }
    $errorMessage.append($table);
    $formattingLog.html($errorMessage);
    $errorsCount.show("fast");
    $formattingLog.show("fast");
  } else {
    $errorsCount.hide("fast");
    $formattingLog.hide("fast");
  }
}

function disableWikEd() {
  if (window.wikEdUseWikEd) {
    window.WikEdUpdateTextarea();
  }
}

function enableWikEd() {
  if (window.wikEdUseWikEd) {
    window.WikEdUpdateFrame();
  }
}

createFormatButton();

// </nowiki>
