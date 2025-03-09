/*******************************************************************************************
 * (en)
 * Lets the users create the page for a translation just by clicking its (red) link in the
 * French entry.
 *******************************************************************************************
 * (fr)
 * Permet aux utilisateurs de créer la page d’une traduction en cliquant juste sur son lien
 * (rouge) dans l’entrée en français.
 *******************************************************************************************
 * v1.0 2013-06-13
 * v2.0 2020-11-01 Full rewrite.
 * v2.1 2021-05-08 Smarter wikicode analysis;
 *                 page reloads instead of having its content replaced
 *******************************************************************************************
 * [[Catégorie:JavaScript du Wiktionnaire|CreerTrad-dev]]
 *******************************************************************************************/

$(function () {
  if (wikt.page.hasNamespaceIn(["", "Reconstruction"])
      && ["view", "edit", "submit"].includes(mw.config.get("wgAction"))) {
    console.log("Chargement de Gadget-CreerTrad-dev.js…");

    window.gadget_createTranslation = {
      NAME: "Créer traduction",

      VERSION: "2.1",

      /** @type {boolean} */
      _editMode: false,
      /** @type {string} */
      _word: "",
      /** @type {string} */
      _translation: "",
      /** @type {string} */
      _langCode: "",
      /**
       * Map that associates a language code to a
       * function that generates the code for it.
       * @type {Object<string, Function>}
       */
      _generators: {},

      /**
       * Initializes this gadget by hooking a callback to
       * every red links in the infoboxes with the "translations" class.
       * @param editMode {boolean?} Whether the gadget should be loaded in edit or view mode.
       */
      init: function (editMode) {
        this._editMode = !!editMode;
        console.log("Gadget CreerTrad-dev loaded in {0} mode.".format(this._editMode ? "editing" : "viewing"));
        var self = this;

        if (!this._editMode) {
          $(".translations .new").each(function () {
            var $link = $(this);
            var translation = $link.text();

            if (translation) {
              var langCode = $link.parent().attr("lang");
              $link.css("background-color", "#77b5fe");
              $link.attr("title", "Cliquez pour créer «\u00a0{0}\u00a0» avec le gadget".format(translation));
              $link.click(function (event) {
                event.preventDefault();
                self.createTrans(translation, langCode);
              });
            }
          });
        } else {
          this._edit();
        }
      },

      /**
       * Register a generator for the given language.
       * @param langCode {string} Language’s code.
       * @param generator {Function} The generator function.
       */
      registerGeneratorForLanguage: function (langCode, generator) {
        this._generators[langCode] = generator;
      },

      /**
       * Makes a GET request to get the wikicode for the current page.
       * Stores the word, translation and language code for use further down the line.
       * @param translation {string} The word to create.
       * @param lang {string} The word’s language code.
       */
      createTrans: function (translation, lang) {
        this._word = mw.config.get("wgTitle");
        this._translation = translation;
        switch (lang) {
          case "zh-Hant":
            this._langCode = "zh";
            break;
          case "ko-Hani":
            this._langCode = "ko";
            break;
          default:
            this._langCode = lang;
        }

        // Get current article’s wikicode
        $.get(
            mw.config.get("wgServer") + mw.config.get("wgScript"),
            {
              "title": this._word,
              "action": "raw",
            },
            this._generateWikicode.bind(this)
        );
      },

      /**
       * Extracts relevent data to generate translation’s wikicode from the given wikicode.
       * @param wikicode {string} Current article’s wikicode.
       * @private
       */
      _generateWikicode: function (wikicode) {
        var wikicodeLines = wikicode.split("\n");

        var translationLineIndex = 0;
        var translationLine = "";

        // Fetch line where the translation is.
        for (var i = 0; i < wikicodeLines.length && !translationLine; i++) {
          var line = wikicodeLines[i];
          var translationMatch = new RegExp(
              "{{trad(?:\\+|-|--)\\|" + this._langCode + "\\|(?:[^}]*?tradi=)?" + this._translation
          ).exec(line);
          if (translationMatch) {
            translationLineIndex = i;
            translationLine = line;
          }
        }

        if (!translationLine) {
          console.log("{0} could not find trad template for {1}".format(this.NAME, this._translation));
          return;
        }

        var self = this;
        var tradTemplateArgs = $.grep(translationLine.match(/{{trad(?:\+|-|--)\|[^}]+?}}/g), function (m) {
          return m.includes(self._translation);
        })[0];
        var templateArgsArray = $.map(
            tradTemplateArgs.substr(2, tradTemplateArgs.length - 4).split("|"),
            function (s) {
              return s.trim();
            }
        );

        var transcription = "";
        var dif = "";
        var gender = "";

        for (var i2 = 0; i2 < templateArgsArray.length; i2++) {
          var arg = templateArgsArray[i2];
          var m;

          // Get transcription if there is one.
          if (m = /^(?:tr|R)\s*=\s*(.+)$/.exec(arg)) {
            transcription = m[1];
            // Get dif parameter if it is defined.
            // Example : <nowiki>* {{T|he}} : {{trad+|he|מכלב|R=makhlev|dif=מַכְלֵב}}</nowiki>
          } else if (m = /^dif\s*=\s*(.+)$/.exec(arg)) {
            dif = m[1];
            // Get gender if there is one.
          } else if (/^(m|f|n|c|s|p|d|mf|mp|fp|mfp|np|ma|mi|fa|fi|na|ni)$/.test(arg)) {
            gender = arg;
          }
        }

        var sectionLineIndex = 0;
        var nature = "";
        var definitionNumber = [1];
        var definitionNumberFound = false;
        var definitionsLines = [];

        /*
         * We go through each line upwards from the translation until we encounter a level-2 (===) section.
         * This section is the nature of the word.
         * We also gather all encountered definitions and the definition number the translation refers to.
         */
        for (var i3 = translationLineIndex; i3 >= 0 && !nature; i3--) {
          var line2 = wikicodeLines[i3];

          // Fetch enclosing trad-début template to get definition number
          var tradStartTemplateMatch;
          if (!definitionNumberFound && (tradStartTemplateMatch = /{{trad-début\|[^|]*\|([^|}]+)/.exec(line2))) {
            definitionNumber = $.map(
                tradStartTemplateMatch[1].toLowerCase().split("."),
                function (s, i) {
                  s = s.trim();
                  var n = parseInt(s);
                  if (isNaN(n)) {
                    switch (i) {
                      case 0:
                        return NaN;
                      case 1:
                        return /^[a-z]$/.test(s) ? s.charCodeAt(0) - "a".charCodeAt(0) + 1 : NaN;
                      default:
                        return wikt.text.romanNumeralToInt(s);
                    }
                  } else {
                    return n;
                  }
                }
            );
            definitionNumberFound = true;
          }

          // Fetch word type
          var natureMatch;
          if (natureMatch = /^===\s*{{S\|([^|}]+)/.exec(line2)) {
            nature = natureMatch[1];
            sectionLineIndex = i3;
          }
        }

        // Fetch all definitions starting from the line after
        // the word type section line until the next encountered section
        for (var i4 = sectionLineIndex + 1; i4 < translationLineIndex && !/^(=+).+\1$/.test(wikicodeLines[i4]); i4++) {
          var line3 = wikicodeLines[i4];
          var defMatch;
          if ((defMatch = /^(#+)/.exec(line3)) && !/^#+\*/.test(line3)) {
            definitionsLines.push([defMatch[1].length, i4])
          }
        }

        // Recursively fetches the line for definitionNumber
        var getDefinitionLine = function (level, i) {
          var levelCounter = 0;

          for (var i5 = i; i5 < definitionsLines.length; i5++) {
            var item = definitionsLines[i5];
            if (item[0] === level + 1) {
              levelCounter++;
              if (levelCounter === definitionNumber[level]) {
                if (level === definitionNumber.length - 1) {
                  // We reached the end of definitionNumber array, return line number
                  return item[1];
                } else {
                  // Recursively handle the rest of the definitionNumber array
                  return getDefinitionLine(level + 1, i5 + 1);
                }
              }
            }
          }
          return NaN;
        };

        var definitionLineIndex = getDefinitionLine(0, 0) || definitionsLines[0][1];
        var domains = "";

        // We look for a template of the form <nowiki>{{lexique|boulangerie|fr}}</nowiki>.
        var domainMatch;
        if (domainMatch = /{{lexique\|([^}]+?)\|[^|}]+?}}/.exec(wikicodeLines[definitionLineIndex])) {
          domains = domainMatch[1];
        }

        // Wikicode generation.

        var newWikicode = "== {" + "{langue|{0}}} ==\n".format(this._langCode);
        newWikicode += "{" + "{ébauche|{0}}}\n".format(this._langCode);
        newWikicode += "=== {" + "{S|étymologie}} ===\n";
        newWikicode += ": {" + "{ébauche-étym|{0}}}\n\n".format(this._langCode);
        newWikicode += "=== {" + "{S|{0}|{1}}} ===\n".format(nature, this._langCode);

        var generator;
        if (generator = this._generators[this._langCode]) {
          newWikicode += generator(this._translation, nature, gender, transcription, dif).trim();
        } else {
          newWikicode += this._genericGenerator(nature, gender, transcription, dif).trim();
        }

        newWikicode += "\n# ";
        if (domains) {
          newWikicode += "{" + "{lexique|{0}|{1}}} ".format(domains, this._langCode);
        }
        newWikicode += "[[{0}#fr|{1}]].\n".format(this._word, this._word.charAt(0).toUpperCase() + this._word.substring(1));
        newWikicode += "#* {" + "{exemple|lang={0}}}\n\n".format(this._langCode);

        // Get HTML code of translation’s page.
        location.href = mw.config.get("wgServer") + mw.config.get("wgScript")
            + "?title={0}&action=edit&gadget-CreerTrad-content={1}".format(
                encodeURIComponent(this._translation),
                encodeURIComponent(newWikicode)
            );
      },

      /**
       * Replaces the content of the current page by that of the translation’s page in edit mode then loads the
       * generated wikicode in the edit field.
       * @private
       */
      _edit: function () {
        var content = new URL(location.href).searchParams.get("gadget-CreerTrad-content");
        if (content) {
          $("#wpTextbox1").val(content);
          $("#wpSummary").val("Création avec [[Aide:Gadget-CreerTrad|{0} v{1}]].".format(this.NAME, this.VERSION));
        }
      },

      /**
       * Fallback wikicode generator for languages not explicitly supported by the gadget.
       * @param nature {string} Word’s grammatical nature.
       * @param gender {string?} Word’s gender if any.
       * @param transcription {string?} Word’s latin transcription if any.
       * @param dif {string?} Text to show on the in place of the translation.
       * @return {string} The content of the main section.
       * @private
       */
      _genericGenerator: function (nature, gender, transcription, dif) {
        var wikicode = "";

        if (dif) {
          wikicode += "'''{0}'''".format(dif);
        } else {
          wikicode += "'''{0}'''".format(this._translation);
        }

        if (transcription) {
          wikicode += ", ''{0}''".format(transcription);
        }

        wikicode += (" {" + "{pron||{0}}}").format(this._langCode);

        if (nature === "nom" && gender) {
          wikicode += " {{{0}}}".format(gender);
        }

        return wikicode;
      }
    };

    /*
     * Generators registration
     */

    // Catalan/Catalan
    gadget_createTranslation.registerGeneratorForLanguage(
        "ca",
        function (translation, nature, gender) {
          var wikicode = "";

          if (nature === "nom") {
            wikicode += "{" + "{ca-rég|<!-- Compléter -->}}\n";
          }

          wikicode += ("'''{0}''' {" + "{pron||ca}}").format(translation);
          if (nature === "nom" && gender) {
            wikicode += " {{{0}}}".format(gender);
          }

          return wikicode;
        }
    );
    // Esperanto/Espéranto
    gadget_createTranslation.registerGeneratorForLanguage(
        "eo",
        function (translation, nature) {
          var wikicode = "";

          if (nature === "adjectif" || nature === "nom") {
            wikicode += "{" + "{eo-flexions|<!-- Compléter -->}}\n";
          } else if (nature === "verbe") {
            wikicode += "{" + "{eo-verbe}}\n";
          }

          wikicode += ("'''{0}''' {" + "{pron||eo}}").format(translation);
          if (nature === "verbe") {
            wikicode += " {" + "{valence ?|eo}} {" + "{conjugaison|eo}}";
          }

          return wikicode;
        }
    );
    // Spanish/Espagnol
    gadget_createTranslation.registerGeneratorForLanguage(
        "es",
        function (translation, nature, gender) {
          var wikicode = "";

          if (nature === "nom") {
            wikicode += "{" + "{es-rég|<!-- Compléter -->}}\n";
          }

          wikicode += ("'''{0}''' {" + "{pron||es}}").format(translation);
          if (nature === "nom" && gender) {
            wikicode += " {{{0}}}".format(gender);
          }

          return wikicode;
        }
    );
    // Italian/Italien
    gadget_createTranslation.registerGeneratorForLanguage(
        "it",
        function (translation, nature, gender) {
          var wikicode = "";

          if (nature === "nom") {
            wikicode += "{" + "{it-flexion|<!-- Compléter -->}}\n";
          }

          wikicode += ("'''{0}''' {" + "{pron||it}}").format(translation);
          if (nature === "nom" && gender) {
            wikicode += " {{{0}}}".format(gender);
          } else {
            wikicode += " {" + "{genre ?|it}}";
          }

          return wikicode;
        }
    );
    // Occitan/Occitan
    gadget_createTranslation.registerGeneratorForLanguage(
        "oc",
        function (translation, nature, gender) {
          var wikicode = "";

          if (nature === "adjectif") {
            wikicode += "{" + "{oc-accord-mixte|<!-- Compléter -->}}\n";
          } else if (nature === "nom") {
            wikicode += "{" + "{oc-rég|<!-- Compléter -->}}\n";
          }

          wikicode += ("'''{0}''' {" + "{pron||oc}}").format(translation);
          if (nature === "nom" && gender) {
            wikicode += " {{{0}}}".format(gender);
          }

          return wikicode;
        }
    );
    // Russian/Russe
    gadget_createTranslation.registerGeneratorForLanguage(
        "ru",
        function (translation, nature, gender) {
          var wikicode = "";

          if (nature === "nom" && gender) {
            wikicode += "{" + "{ru-décl{0}|<!-- Compléter -->}}\n".format(gender);
          }

          wikicode += ("'''{0}''', ''{" + "{transliterator|ru|{0}}}'' {" + "{pron||ru}}").format(translation);
          if (nature === "nom" && gender) {
            wikicode += " {{{0}}}".format(gender);
          }

          return wikicode;
        }
    );
    // Swedish/Suédois
    gadget_createTranslation.registerGeneratorForLanguage(
        "sv",
        function (translation, nature, gender) {
          var wikicode = "";

          if (nature === "adjectif") {
            wikicode += "{" + "{sv-adj}}\n";
          } else if (nature === "nom") {
            if (translation.endsWith("a")) {
              wikicode += "{" + "{sv-nom-c-or}}\n";
            } else if (translation.endsWith("ing")) {
              wikicode += "{" + "{sv-nom-c-ar}}\n";
            } else if (translation.endsWith("are")) {
              wikicode += "{" + "{sv-nom-c-ar|are=}}\n";
            } else if (translation.endsWith("ande")) {
              wikicode += "{" + "{sv-nom-n-n}}\n";
            } else if (translation.endsWith("ende")) {
              wikicode += "{" + "{sv-nom-n-n}}\n";
            } else if (translation.endsWith("um")) {
              wikicode += "{" + "{sv-nom-n-er|um=}}\n";
            } else if (translation.endsWith("tion")) {
              wikicode += "{" + "{sv-nom-c-er}}\n";
            } else if (translation.endsWith("tör")) {
              wikicode += "{" + "{sv-nom-c-er}}\n";
            } else if (translation.endsWith("ier")) {
              wikicode += "{" + "{sv-nom-c-er|r=}}\n";
            } else if (translation.endsWith("iker")) {
              wikicode += "{" + "{sv-nom-c-er|r=}}\n";
            } else if (translation.endsWith("else")) {
              wikicode += "{" + "{sv-nom-c-er|e=}}\n";
            } else if (gender === "neutre") {
              wikicode += "{" + "{sv-nom-n-0}}\n";
            } else {
              wikicode += "{" + "{sv-nom-c-er}}\n";
            }
          } else if (nature === "verbe") {
            wikicode += "{" + "{sv-conj-ar}}\n";
          }

          wikicode += ("'''{0}''' {" + "{pron||sv}}").format(translation);
          if (nature === "nom") {
            if (gender) {
              wikicode += " {{{0}}}".format(gender);
            } else if (translation.endsWith("ande") || translation.endsWith("ende") || translation.endsWith("um")) {
              wikicode += " {" + "{n|sv}}";
            } else {
              wikicode += " {" + "{c|sv}}";
            }
          }

          return wikicode;
        }
    );

    var editMode = ["edit", "submit"].includes(mw.config.get("wgAction"));
    gadget_createTranslation.init(editMode);
  }
});
