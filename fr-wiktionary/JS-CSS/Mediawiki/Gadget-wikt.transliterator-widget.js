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
 *************************************************************************
 * [[Catégorie:JavaScript du Wiktionnaire|transliterator-widget.js]]
 * <nowiki>
 *************************************************************************/

$(function () {
  console.log("Chargement de Gadget-wikt.transliterator-widget.js…");

  wikt.gadgets.translatorWidget = {
    /**
     * Maps each available language code to the template when transliterating.
     * @type {Object<string, string>}
     * @private
     */
    _langToTemplate: {
      "ar": "ar-mot",
    },

    /**
     * API hook.
     * @type {mw.Api}
     * @private
     */
    _api: new mw.Api(),

    /**
     * Initializes this gadget.
     * Creates all transliteration boxes found in the page.
     */
    init: function () {
      var self = this;
      this._api.get({
        action: "query",
        format: "json",
        titles: "MediaWiki:Gadget-translation editor.js/langues.json",
        prop: "revisions",
        rvprop: "content",
        rvslots: "main",
      }).then(function (data) {
        var languages = {};
        for (var pageID in data.query.pages) {
          if (data.query.pages.hasOwnProperty(pageID)) {
            // noinspection JSUnresolvedVariable
            languages = JSON.parse(data.query.pages[pageID].revisions[0].slots.main["*"]);
            break;
          }
        }
        var $transBox = $(".transliterator");
        var langCode = $transBox.attr("lang");
        $transBox.each(function () {
          self._initBox($(this), langCode, languages[langCode]);
        });
      });
    },

    /**
     * Initializes the given transliteration box.
     * @param $box {Object} The box to initialize.
     * @param langCode {string} Language code for the box.
     * @param langName {string} Language’s name.
     * @private
     */
    _initBox: function ($box, langCode, langName) {
      var input = new OO.ui.TextInputWidget({
        placeholder: "Texte à translittérer",
      });
      var button = new OO.ui.ButtonWidget({
        label: "Translittérer en {0}".format(langName),
      });
      var self = this;
      button.on("click", function () {
        var value = input.getValue().trim();
        if (value) {
          self.transliterate(langCode, value, $transOutput);
        }
      });
      var layout = new OO.ui.ActionFieldLayout(input, button);
      var $transOutput = $("<p>");

      $box.removeAttr("lang");
      $box.append(layout.$element, $transOutput);
    },

    /**
     * Transliterates the given text in the specified language.
     * The generated text is displayed as HTML in the given element.
     * @param langCode {string} Language code to fetch the correct template.
     * @param text {string} The text to transliterate.
     * @param $output {Object} The jQuery element to use as output.
     */
    transliterate: function (langCode, text, $output) {
      var templateName = this._langToTemplate[langCode];
      if (templateName) {
        // noinspection JSUnresolvedFunction
        this._api.parse("{{{0}|{1}}}".format(templateName, text)).then(function (renderedHTML) {
          var renderedText = $(renderedHTML).find("p:first-child").html();
          $output.html("Résultat : " + renderedText);
        });
      }
    },
  };

  wikt.gadgets.translatorWidget.init();
});
// </nowiki>
