/*************************************************************************
 * (en)
 * This gadget lets users create inflection pages for lemmas in
 * several languages from red links within inflection tables.
 *************************************************************************
 * (fr)
 * Ce gadget permet de créer les flexions pour les lemmes dans
 * diverses langues à partir des liens rouges dans les tables de
 * flexions.
 *************************************************************************
 * v1.0 2021-??-?? First version; full rewrite from gadget CreerFlexionFr. TODO màj date à la sortie
 *************************************************************************
 * [[Catégorie:JavaScript du Wiktionnaire|create-inflection-dev.js]]
 * <nowiki>
 *************************************************************************/

$(function () {
  // Activate only in main namespace.
  if (wikt.page.hasNamespaceIn([""])) {
    console.log("Chargement de Gadget-wikt.create-inflection-dev.js…");

    window.wikt.gadgets.createInflection = {
      NAME: "Créer flexion",

      VERSION: "1.0",

      _baseWord: "",

      _inflectionToCreate: "",

      /** @type {wikt.gadgets.createInflection.LanguageData} */
      _language: null,

      /** @type {Array<wikt.gadgets.createInflection.LanguageData>} */
      _languages: [],

      /** @type {Array<string>} */
      _activatedLanguages: ["fr"],

      /**
       * Initializes the gadget by adding a callback function to
       * this gadget to red links inside the first table with the
       * "flextable-fr-mfsp" CSS class.
       *
       * @param userLanguages {Array<string>} List of additional languages for the current user.
       */
      init: function (userLanguages) {
        if (userLanguages) {
          this._activatedLanguages = this._activatedLanguages.concat(userLanguages);
        }
        var self = this;

        $.grep(this._languages, function (language) {
          return self._activatedLanguages.indexOf(language.code);
        }).forEach(function (language) {
          var flexTableClass = "." + language.inflectionTableClass;

          var gender = null;
          var $flextableSelfLink = $(flexTableClass + " .selflink");

          if ($flextableSelfLink.length) {
            language.genderClasses.forEach(function (genderClass) {
              if ($flextableSelfLink.first().parents("." + genderClass.class).length) {
                gender = genderClass.code;
              }
            });
          }

          $(flexTableClass + " .new").each(function (_, e) {
            var $redLink = $(e);
            var inflection = $redLink.text();

            // Une boite de flexions pour noms communs en français peuvent parfois contenir deux lemmes différents :
            // celui au masculin et au féminin : on ne colore dans ce cas que les formes
            // du genre correspondant au nom de la page
            var isNoun = false;
            // Get word type from section title
            var wordType = $redLink.parents(flexTableClass)
                .prevAll("h3").first().find(".titredef").text();

            if (wordType === "Nom commun" || wordType === "Locution nominale") {
              isNoun = true;
            }

            // gender of the red link
            var redLinkGender = null;
            language.genderClasses.forEach(function (genderClass) {
              if ($redLink.parents("." + genderClass.class).length) {
                redLinkGender = genderClass.code;
              }
            });
            console.log(isNoun, redLinkGender, gender); // DEBUG

            // On ne surligne pas les liens qui ne sont pas des flexions du mot courant
            // redLinkGender est null dans le cas de fr-rég (entre autres), où le genre n’est pas
            // indiqué dans le tableau de flexions.
            if (isNoun && redLinkGender && redLinkGender !== gender) {
              return;
            }

            $redLink.css("background-color", "#0f0");
            $redLink.attr("title", "Cliquez pour créer « {0} » avec le gadget CréerFlexion".format(inflection));
            $redLink.click(function (e) {
              e.preventDefault();
              self._baseWord = mw.config.get("wgPageName").replace(/_/g, " ");
              self._inflectionToCreate = inflection.replace(/&nbsp;/g, " ");
              self._language = language;
              self._onClick();
            });
          });
        });
      },

      /**
       * Called when the user clicks on an inflection.
       * Sends an AJAX request to get the HTML code of
       * the current page then proceeds to the rest of
       * the procedure.
       * @private
       */
      _onClick: function () {
        $.get(
            mw.config.get("wgServer") + mw.config.get("wgScript"),
            {
              "title": this._baseWord,
              "action": "raw"
            },
            this._onSuccess.bind(this)
        );
      },

      /**
       * Gets the wikicode for the current page, generates the wikicode for the
       * inflection then sends a request to open the edit page.
       * @param wikicode {string} The wikicode for the current page.
       * @private
       */
      _onSuccess: function (wikicode) {
        console.log(this._baseWord, this._inflectionToCreate, this._language.languageCode); // DEBUG
        var self = this;
        var wikicodeLines = wikicode.split("\n");
        var newWikicode = "";

        // Générer le code wiki de la nouvelle page en ne conservant que les lignes utiles
        // de l’ancienne (la page principale du mot).
        // Le principe est qu’on doit trouver dans l’ordre :
        // * une section dans la langue
        // ** une section de type de mot
        // *** éventuellement une boite de flexions
        // *** une ligne de forme
        // ** éventuellement une autre section de type de mot (retour étape 2)
        // * Une autre section de langue arrête tout

        newWikicode = wikicodeLines.join("\n"); // TEMP

        // TODO reprendre tout les modèles de flexion pour ajouter des classe CSS pour les genres/nombres

        $.get(
            mw.config.get("wgServer") + mw.config.get("wgScript"),
            {
              "title": this._inflectionToCreate,
              "action": "edit",
            },
            function (data) {
              self._loadEditPage(data, newWikicode);
            }
        );
      },

      /**
       * Replaces the current page content by the inflection edit page.
       * @param pageData {string} Edit page HTML content.
       * @param newWikicode {string} Inflection wikicode.
       */
      _loadEditPage: function (pageData, newWikicode) {
        var summary = "Création avec [[Aide:Gadget-wikt.create-inflection|{0} (v{1})]] depuis [[{2}]]."
            .format(this.NAME, this.VERSION, this._baseWord);
        // Go to inflection’s page.
        location.href = mw.config.get("wgServer") + mw.config.get("wgScript")
            + "?title={0}&action=edit&preload-edit-text={1}&preload-edit-summary={2}".format(
                encodeURIComponent(this._inflectionToCreate),
                encodeURIComponent(newWikicode),
                encodeURIComponent(summary)
            );
      },

      /**
       * Adds the given language data to this gadget.
       * @param languageData {wikt.gadgets.createInflection.LanguageData}
       */
      addLanguageData: function (languageData) {
        this._languages.push(languageData);
      },
    };

    /**
     * Data structure defining language specific values and parsing functions.
     * @param languageCode {string} Language’s code.
     * @param inflectionTableClass {string} List of inflection table classes to hook the gadget to.
     * @param genderClasses {Array<{class: string, code: string}>}
     * @constructor
     */
    wikt.gadgets.createInflection.LanguageData = function (languageCode, inflectionTableClass, genderClasses) {
      this._languageCode = languageCode;
      this._inflectionTableClass = inflectionTableClass;
      this._genderClasses = genderClasses;
    };

    wikt.gadgets.createInflection.LanguageData.prototype = {};

    Object.defineProperty(wikt.gadgets.createInflection.LanguageData.prototype, "languageCode", {
      /**
       * @return {string} The language code.
       */
      get: function () {
        return this._languageCode;
      }
    });

    Object.defineProperty(wikt.gadgets.createInflection.LanguageData.prototype, "inflectionTableClass", {
      /**
       * @return {string} The inflection table class.
       */
      get: function () {
        return this._inflectionTableClass;
      }
    });

    Object.defineProperty(wikt.gadgets.createInflection.LanguageData.prototype, "genderClasses", {
      /**
       * @return {Array<{class: string, code: string}>} The list of CSS classes for each gender.
       */
      get: function () {
        return this._genderClasses;
      }
    });

    // French/français
    wikt.gadgets.createInflection.addLanguageData(new wikt.gadgets.createInflection.LanguageData(
        "fr",
        "flextable-fr-mfsp",
        [
          {class: "flextable-fr-m", code: "m"},
          {class: "flextable-fr-f", code: "f"},
        ]
    ));

    var userLangs = [];
    // Variable should be declared in user page.
    if (typeof createInflectionLangs !== "undefined" && createInflectionLangs instanceof Array) {
      userLangs = createInflectionLangs;
    }
    wikt.gadgets.createInflection.init(userLangs);
  }
});
// </nowiki>
