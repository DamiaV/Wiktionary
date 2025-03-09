/**
 * [[Catégorie:JavaScript du Wiktionnaire|Formatage]]
 * <nowiki>
 */

(function () {
  console.log("Chargement de Gadget-Formatage.js…");

  function createFormatButton() {
    var button = [
      '<span id="codeFormatterWidget" class="oo-ui-widget oo-ui-widget-enabled oo-ui-buttonElement oo-ui-buttonElement-framed oo-ui-labelElement oo-ui-buttonInputWidget">',
      '<input id="codeFormatter" class="oo-ui-inputWidget-input oo-ui-buttonElement-button" aria-disabled="false" value="Formater" title="Formater le wikitexte" type="button">',
      '</span>'
    ].join("");
    $(button).insertAfter($("#wpDiffWidget"));
    $("#codeFormatter").attr(
        "tabindex",
        parseInt($("#wpDiffWidget input").attr("tabindex")) + 1
    ).click(function (event) {
      event.preventDefault();
      formatWikicode();
      return false;
    });
  }

  function formatWikicode() {
    disableWikEd();
    var changesCount = 0;
    var text = wikt.edit.getText();
    var res = formatSections(text); // Declared in [[MediaWiki:Gadget-Formatage/sections.js]]
    // fixTypography(); // Declared in [[MediaWiki:Gadget-Formatage/typographie.js]]
    var newText = res.newText;
    if (text !== newText) {
      wikt.edit.setText(newText);
      changesCount += res.changesCount;
    }
    logChanges(res.errors, changesCount);
    enableWikEd();
  }

  /**
   * @param errors {{invalidLine: string, lineNumber: number, error: string}[]}
   * @param changesCount {number}
   */
  function logChanges(errors, changesCount) {
    var $formattingLog = $("#log_formatage");
    var $changesCount = $("#nombre_modifs");
    var $errorsCount = $("#nombre_erreurs");

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
      var $errorMessage = $("<p>");

      // Indicateur de nombre
      if (errors.length === 1)
        $errorsCount.text("(1 erreur)");
      else
        $errorsCount.text("(" + errors.length + " erreurs)");

      var $table = $("<table>", {
        class: "wikitable"
      });
      var $header = $("<tr>");
      $header.append($("<th>", {text: "Ligne"}));
      $header.append($("<th>", {text: "Élément"}));
      $header.append($("<th>", {text: "Erreur"}));
      $table.append($header);

      for (var i = 0; i < errors.length; i++) {
        var $row = $("<tr>");
        $row.append($("<td>", {text: errors[i].lineNumber}));
        $row.append($("<td>", {text: errors[i].invalidLine}));
        $row.append($("<td>", {text: errors[i].error}));
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
    // noinspection JSUnresolvedReference
    if (typeof wikEdUseWikEd !== "undefined") {
      // noinspection JSUnresolvedReference
      if (wikEdUseWikEd) {
        // noinspection JSUnresolvedReference
        WikEdUpdateTextarea();
      }
    }
  }

  function enableWikEd() {
    // noinspection JSUnresolvedReference
    if (typeof wikEdUseWikEd !== "undefined") {
      // noinspection JSUnresolvedReference
      if (wikEdUseWikEd) {
        // noinspection JSUnresolvedReference
        WikEdUpdateFrame();
      }
    }
  }

  $(createFormatButton);
})();

// </nowiki>
