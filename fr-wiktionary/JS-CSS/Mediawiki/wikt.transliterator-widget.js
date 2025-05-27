/*************************************************************************
 * (en)
 * This gadget adds small forms to transliterate text in the specified
 * language. To define a form, simply define a DIV tag in the wikicode
 * with the class .transliterator and the lang attribute specifying the
 * language code.
 *************************************************************************
 * (fr)
 * Ce gadget ajoute des petits formulaires pour translittérer du texte
 * dans la langue donnée. Pour définir un formulaire, définir une balise
 * DIV dans le wikicode avec la classe .transliterator et l’attribut lang
 * contenant le code de la langue.
 *************************************************************************
 * v1.0 2021-06-28 First version.
 * v1.1 2025-05-27 Conversion into a module.
 *************************************************************************
 * [[Catégorie:JavaScript du Wiktionnaire|transliterator-widget.js]]
 * <nowiki>
 *************************************************************************/
"use strict";

const { getLanguageName } = require("./wikt.core.languages.js");

console.log("Chargement de Gadget-wikt.transliterator-widget.js…");

/**
 * Maps each available language code to the template when transliterating.
 * @type {{[code: string]: string}}
 */
const LANG_TEMPLATE_NAMES = {
  ar: "ar-mot",
};
const API = new mw.Api({ userAgent: "Gadget-wikt.transliterator-widget" });

/**
 * Initializes the given transliteration box.
 * @param $box {Object} The box to initialize.
 * @param langCode {string} Language code for the box.
 * @param langName {string} Language’s name.
 * @private
 */
function initBox($box, langCode, langName) {
  const input = new OO.ui.TextInputWidget({
    placeholder: "Texte à translittérer",
  });
  const button = new OO.ui.ButtonWidget({
    label: `Translittérer en ${langName}`,
  });
  button.on("click", function () {
    const value = input.getValue().trim();
    if (value) transliterate(langCode, value, $transOutput);
  });
  const layout = new OO.ui.ActionFieldLayout(input, button);
  const $transOutput = $("<p>");

  $box.removeAttr("lang");
  $box.append(layout.$element, $transOutput);
}

/**
 * Transliterates the given text in the specified language.
 * The generated text is displayed as HTML in the given element.
 * @param langCode {string} Language code to fetch the correct template.
 * @param text {string} The text to transliterate.
 * @param $output {Object} The jQuery element to use as output.
 */
function transliterate(langCode, text, $output) {
  const templateName = LANG_TEMPLATE_NAMES[langCode];
  if (templateName) {
    API.parse(`{{${templateName}|${text}}}`)
        .then((renderedHTML) => {
          const renderedText = $(renderedHTML).find("p:first-child").html();
          $output.html("Résultat&nbsp;: " + renderedText);
        });
  }
}

$(".transliterator").each(function () {
  const $box = $(this);
  const langCode = $box.attr("lang");
  initBox($box, langCode, getLanguageName(langCode));
});
// </nowiki>
