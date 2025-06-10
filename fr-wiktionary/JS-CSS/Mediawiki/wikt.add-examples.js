/**
 * (fr)
 * Ce gadget permet l’ajout d’exemples sans passer en mode édition. Un bouton pour
 * ouvrir le formulaire devrait apparaitre à la fin de chaque série d’exemples pour
 * chaque définition (seulement si le modèle [[Modèle:exemple]] est utilisé).
 * ------------------------------------------------------------------------------------
 * (en)
 * This gadget allows to add examples without entering edit mode. A button to open the
 * form should appear at the end of each series of examples for each definition
 * (only if [[Modèle:exemple]] template is used).
 * ------------------------------------------------------------------------------------
 * v1.0 2021-09-12 Initial version
 * v1.1 2021-09-16 Added input field for "lien" parameter.
 * v1.1.1 2021-09-17 Fixed bug when text or translation contained the "=" sign.
 * v1.1.2 2021-09-20 Restricted to main and “Reconstruction” namespaces.
 * v1.2 2022-11-29 Better handling of multiline examples. Added checkbox to disable
 *                 the translation. Link instead of button to show the form.
 * v1.3 2024-03-04 Add buttons to format text (bold and italic).
 * v1.3.1 2024-05-18 Add counter to avoid adding "Add Example" button when there are too many examples.
 * v1.3.2 2025-02-25 Fix "é" character causing crashes when present in section IDs.
 * v1.3.3 2025-02-25 Rejected edits now show an error message.
 * v1.4 2025-05-23 Use new [[MediaWiki:Gadget-wikt.core.languages.json]].
 * v1.5 2025-05-26 Conversion into a module.
 * ------------------------------------------------------------------------------------
 * [[Catégorie:JavaScript du Wiktionnaire|add-examples.js]]
 * <nowiki>
 */
"use strict";

const { getLanguagesNames } = require("./wikt.core.languages.js");
const { getSelectedText, replaceSelectedText } = require("./wikt.core.edit.js")
const {
  getCookie,
  setCookie,
  deleteCookie
} = require("./wikt.core.cookies.js");

console.log("Chargement de Gadget-wikt.add-examples.js…");

const NAME = "Ajouter des exemples";
const VERSION = "1.5";

const COOKIE_KEY_TEXT = "add_examples_text";
const COOKIE_KEY_SOURCE = "add_examples_source";
const COOKIE_KEY_SOURCE_URL = "add_examples_source_url";
const COOKIE_KEY_TRANSLATION = "add_examples_translation";
const COOKIE_KEY_TRANSCRIPTION = "add_examples_transcription";

let MAX_NUMBER_OF_EXAMPLES = 5;
// noinspection JSUnresolvedReference
if (!window.max_number_of_examples && window.max_number_of_examples instanceof Number) {
  // noinspection JSUnresolvedReference
  MAX_NUMBER_OF_EXAMPLES = window.max_number_of_examples;
  console.log("Using preferred maximum number of examples: " + MAX_NUMBER_OF_EXAMPLES);
}

const api = new mw.Api({ userAgent: "Gadget-wikt.add-examples/" + VERSION });
const languagesNames = getLanguagesNames(true);
const sectionNames = {
  "adj": ["adj", "adjectif", "adjectif qualificatif"],
  "adv": ["adv", "adverbe"],
  "adv-ind": ["adv-ind", "adverbe ind", "adverbe indéfini"],
  "adv-int": ["adv-int", "adverbe int", "adverbe interrogatif"],
  "adv-pron": ["adv-pron", "adverbe pro", "adverbe pronominal"],
  "adv-rel": ["adv-rel", "adverbe rel", "adverbe relatif"],
  "conj": ["conj", "conjonction"],
  "conj-coord": ["conj-coord", "conjonction coo", "conjonction de coordination"],
  "copule": ["copule"],
  "adj-dém": ["adj-dém", "adjectif dém", "adjectif démonstratif"],
  "dét": ["dét", "déterminant"],
  "adj-excl": ["adj-excl", "adjectif exc", "adjectif exclamatif"],
  "adj-indéf": ["adj-indéf", "adjectif ind", "adjectif indéfini"],
  "adj-int": ["adj-int", "adjectif int", "adjectif interrogatif"],
  "adj-num": ["adj-num", "adjectif num", "adjectif numéral"],
  "adj-pos": ["adj-pos", "adjectif pos", "adjectif possessif"],
  "adj-rel": ["adj-rel", "adjectif rel", "adjectif relatif"],
  "art": ["art", "article"],
  "art-déf": ["art-déf", "article déf", "article défini"],
  "art-indéf": ["art-indéf", "article ind", "article indéfini"],
  "art-part": ["art-part", "article par", "article partitif"],
  "nom": ["nom", "substantif", "nom commun"],
  "nom-fam": ["nom-fam", "nom de famille"],
  "patronyme": ["patronyme"],
  "nom-pr": ["nom-pr", "nom propre"],
  "nom-sciences": ["nom-sciences", "nom science", "nom scient", "nom scientifique"],
  "prénom": ["prénom"],
  "prép": ["prép", "préposition"],
  "pronom": ["pronom"],
  "pronom-adj": ["pronom-adj", "pronom-adjectif"],
  "pronom-dém": ["pronom-dém", "pronom dém", "pronom démonstratif"],
  "pronom-indéf": ["pronom-indéf", "pronom ind", "pronom indéfini"],
  "pronom-int": ["pronom-int", "pronom int", "pronom interrogatif"],
  "pronom-pers": ["pronom-pers", "pronom-per", "pronom personnel", "pronom réf", "pronom-réfl", "pronom réfléchi"],
  "pronom-pos": ["pronom-pos", "pronom pos", "pronom possessif"],
  "pronom-rel": ["pronom-rel", "pronom rel", "pronom relatif"],
  "racine": ["racine"],
  "verb": ["verb", "verbe"],
  "verb-pr": ["verb-pr", "verbe pr", "verbe pronominal"],
  "interj": ["interj", "interjection"],
  "onoma": ["onoma", "onom", "onomatopée"],
  "aff": ["aff", "affixe"],
  "circon": ["circon", "circonf", "circonfixe"],
  "inf": ["inf", "infixe"],
  "interf": ["interf", "interfixe"],
  "part": ["part", "particule"],
  "part-num": ["part-num", "particule num", "particule numérale"],
  "post": ["post", "postpos", "postposition"],
  "préf": ["préf", "préfixe"],
  "rad": ["rad", "radical"],
  "suf": ["suf", "suff", "suffixe"],
  "pré-verb": ["pré-verb", "pré-verbe"],
  "pré-nom": ["pré-nom"],
  "procl": ["procl", "proclitique"],
  "loc": ["loc", "locution"],
  "phr": ["loc-phr", "locution-phrase", "locution phrase", "phrase"],
  "prov": ["prov", "proverbe"],
  "quantif": ["quantif", "quantificateur"],
  "var-typo": ["var-typo", "variante typo", "variante par contrainte typographique"],
  "lettre": ["lettre"],
  "symb": ["symb", "symbole"],
  "class": ["class", "classif", "classificateur"],
  "numeral": ["numér", "num", "numéral"],
  "sinogramme": ["sinog", "sino", "sinogramme"],
  "gismu": ["gismu"],
  "rafsi": ["rafsi"],
};

let exampleCounter = 0;
$("ul > li > .example").each(function () {
  const $element = $(this);
  const $item = $element.parent();
  exampleCounter++;

  if (!$item.next().length) {
    if (exampleCounter >= MAX_NUMBER_OF_EXAMPLES) {
      exampleCounter = 0;
      return;
    }
    // Get example’s language
    const language = $item.find("bdi[lang]")[0].lang;

    // Get section and indices of associated definition
    const definitionLevel = [];
    let $definitionItem = $item.parent().parent();
    let $topItem;
    do {
      definitionLevel.splice(0, 0, $definitionItem.index());
      $topItem = $definitionItem;
      $definitionItem = $definitionItem.parent().parent();
    } while ($definitionItem.prop("tagName") === "LI");
    // Keep h3 for skins that do not yet use the new Mediawiki headings structure
    const $section = $($topItem.parent().prevAll(".mw-heading3, h3").get(0)).find(".titredef");
    definitionLevel.splice(0, 0, $section.attr("id"));

    // Remove default edit link if present
    const $defaultEditLink = $item.find("span.example > span.stubedit");
    if ($defaultEditLink.length) {
      $defaultEditLink.remove();
    }

    // Add a nice button to open the form
    const $formItem = $("<li>");
    const $button = $("<a href='#'>Ajouter un exemple</a>");
    $button.on("click", () => {
      if (!$button.form)
        $formItem.append(new Form($item, $button, language, definitionLevel).$element);
      $button.form.setVisible(true);
      return false;
    });
    $item.after($formItem.append($button));
    exampleCounter = 0;
  }
});

/**
 * Constructor for the edit form.
 * @param $lastExample {JQuery} The element corresponding to the example right above the button.
 * @param $button {JQuery} The button that shows this form.
 * @param language {string} Language for the example.
 * @param definitionLevel {(string|number)[]} Indices of the associated definition.
 * @constructor
 */
function Form($lastExample, $button, language, definitionLevel) {
  this._language = language;
  this._definitionLevel = definitionLevel;
  this._$lastExample = $lastExample;
  this._$button = $button;
  this._$button.form = this;

  /**
   * Create a toolbar for the given text input.
   * @param $textInput {JQueryTextInput} The text input to associate the toolbar to.
   * @return {OO.ui.Toolbar} A new toolbar.
   */
  const createToolbar = ($textInput) => {
    const toolFactory = new OO.ui.ToolFactory();
    const toolGroupFactory = new OO.ui.ToolGroupFactory();
    const toolbar = new OO.ui.Toolbar(toolFactory, toolGroupFactory, { actions: true });

    /**
     * Adds a custom button to the tool factory.
     * @param name {string} Button’s name.
     * @param icon {string|null} Buttons’s icon name.
     * @param progressive {boolean} Wether the icon should be marked as progressive.
     * @param title {string} Button’s tooltip text.
     * @param onSelect {function} Callback for when the button is clicked.
     * @param onUpdateState {function?} Callback for when the button changes state (optional).
     * @param displayBothIconAndLabel {boolean?} Whether both the icon and label should be displayed.
     */
    function generateButton(name, icon, progressive, title, onSelect, onUpdateState, displayBothIconAndLabel) {
      /** @constructor */
      function CustomTool() {
        CustomTool.super.apply(this, arguments);
      }

      OO.inheritClass(CustomTool, OO.ui.Tool);
      CustomTool.static.name = name;
      CustomTool.static.icon = icon;
      CustomTool.static.title = title;
      if (progressive) CustomTool.static.flags = ["primary", "progressive"];
      CustomTool.static.displayBothIconAndLabel = !!displayBothIconAndLabel;
      CustomTool.prototype.onSelect = onSelect;
      CustomTool.prototype.onUpdateState = onUpdateState || (function () {
        this.setActive(false);
      });

      toolFactory.register(CustomTool);
    }

    generateButton("bold", "bold", false, "Gras", () => {
      this.applyTextEffect("bold", $textInput);
    });
    generateButton("italic", "italic", false, "Italique", () => {
      this.applyTextEffect("italic", $textInput);
    });

    toolbar.setup([
      {
        type: "bar",
        include: ["bold", "italic"],
      },
    ]);
    return toolbar;
  }

  this._textInput = new OO.ui.MultilineTextInputWidget();
  const textInputLayout = new OO.ui.FieldLayout(this._textInput, {
    label: "Texte de l’exemple",
    align: "top",
  });
  this._textInput.on("change", (value) => {
    this._applyButton.setDisabled(!value);
  })

  this._sourceInput = new OO.ui.MultilineTextInputWidget();
  const sourceInputLayout = new OO.ui.FieldLayout(this._sourceInput, {
    label: "Source de l’exemple",
    align: "top",
  });

  this._sourceURLInput = new OO.ui.TextInputWidget();
  const sourceURLInputLayout = new OO.ui.FieldLayout(this._sourceURLInput, {
    label: "Adresse web de l’exemple",
    align: "top",
    help: "Ne renseigner que dans le cas où le lien n’est pas déjà présent dans la référence de la source.",
    helpInline: true,
  });

  this._translationInput = new OO.ui.MultilineTextInputWidget();
  const translationInputLayout = new OO.ui.FieldLayout(this._translationInput, {
    label: "Traduction en français de l’exemple",
    align: "top",
  });

  this._transcriptionInput = new OO.ui.MultilineTextInputWidget();
  const transcriptionInputLayout = new OO.ui.FieldLayout(this._transcriptionInput, {
    label: "Transcription de l’exemple",
    align: "top",
    help: "Ne renseigner que dans le cas où le texte de l’exemple n’est pas écrit avec l’alphabet latin.",
    helpInline: true,
  });

  this._disableTranslationChk = new OO.ui.CheckboxInputWidget();
  const disableTranslationChkLayout = new OO.ui.FieldLayout(this._disableTranslationChk, {
    label: "Désactiver la traduction",
    align: "inline",
    help: "Permet d’indiquer que la traduction n’est pas nécessaire (ex\u00a0: moyen français).",
    helpInline: true,
  });
  this._disableTranslationChk.on("change", (selected) => {
    this._translationInput.setDisabled(selected);
  });

  this._applyButton = new OO.ui.ButtonWidget({
    label: "Publier",
    title: "Publier l’exemple pour cette définition",
    flags: ["progressive", "primary"],
    disabled: true,
  });
  this._applyButton.on("click", this.submit.bind(this));
  this._cancelButton = new OO.ui.ButtonWidget({
    label: "Annuler",
    title: "Refermer le formulaire",
    flags: ["destructive"],
  });
  this._cancelButton.on("click", () => {
    this.setVisible(false);
  });

  this._loadingImage = new OO.ui.LabelWidget({
    label: $('<img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Ajax_loader_metal_512.gif" alt="loading" style="width: 1.5em">'),
  });
  this._loadingImage.toggle(false);

  const textToolbar = createToolbar(this._textInput.$element.find("textarea"));
  const sourceToolbar = createToolbar(this._sourceInput.$element.find("textarea"));
  const translationToolbar = createToolbar(this._translationInput.$element.find("textarea"));
  const transcriptionToolbar = createToolbar(this._transcriptionInput.$element.find("textarea"));

  const content = [textToolbar, textInputLayout, sourceToolbar, sourceInputLayout, sourceURLInputLayout];
  if (language !== "fr") {
    content.push(translationToolbar, translationInputLayout, transcriptionToolbar, transcriptionInputLayout, disableTranslationChkLayout);
  }
  const fieldsLayout = new OO.ui.FieldsetLayout({
    label: "Ajout d’un exemple en " + (languagesNames.get(this._language) || "langue inconnue"),
    items: content,
    classes: ["add-example-fieldset"],
  });

  const buttonsLayout = new OO.ui.HorizontalLayout({
    items: [
      this._applyButton,
      this._cancelButton,
      this._loadingImage,
    ]
  });

  this._frame = new OO.ui.PanelLayout({
    id: `add-example-definition-${this._definitionLevel.join("-")}-form`,
    classes: ["add-example-form"],
    expanded: false,
    content: [
      fieldsLayout,
      buttonsLayout,
    ],
  });

  textToolbar.initialize();
  textToolbar.emit("updateState");
  sourceToolbar.initialize();
  sourceToolbar.emit("updateState");
}

Form.prototype = {
  /**
   * Returns the jQuery object for this form.
   * @return {JQuery}
   */
  get $element() {
    return this._frame.$element;
  },

  /**
   * Toggles the visibility of this form.
   * @param visible {boolean}
   */
  setVisible: function (visible) {
    this._$button.toggle(!visible);
    this._frame.toggle(visible);
    if (visible) {
      if (!this._textInput.getValue() && getCookie(COOKIE_KEY_TEXT)) {
        this._textInput.setValue(getCookie(COOKIE_KEY_TEXT));
      }
      if (!this._sourceInput.getValue() && getCookie(COOKIE_KEY_SOURCE)) {
        this._sourceInput.setValue(getCookie(COOKIE_KEY_SOURCE));
      }
      if (!this._sourceURLInput.getValue() && getCookie(COOKIE_KEY_SOURCE_URL)) {
        this._sourceURLInput.setValue(getCookie(COOKIE_KEY_SOURCE_URL));
      }
      if (!this._translationInput.getValue() && getCookie(COOKIE_KEY_TRANSLATION)) {
        this._translationInput.setValue(getCookie(COOKIE_KEY_TRANSLATION));
      }
      if (!this._transcriptionInput.getValue() && getCookie(COOKIE_KEY_TRANSCRIPTION)) {
        this._transcriptionInput.setValue(getCookie(COOKIE_KEY_TRANSCRIPTION));
      }
    }
  },

  /**
   * Format the selected text using the given effect.
   * @param effect {string} The effect to apply (either "bold" or "italic").
   * @param $textInput {JQueryTextInput} The text input to format the text of.
   */
  applyTextEffect: function (effect, $textInput) {
    const selectedText = getSelectedText($textInput);
    let replText;
    switch (effect) {
      case "bold":
        replText = "'''" + selectedText + "'''";
        break;
      case "italic":
        replText = "''" + selectedText + "''";
        break;
      default:
        throw new Error("Invalid effect: " + effect);
    }
    replaceSelectedText(replText, $textInput);
  },

  /**
   * Clears all fields contained in this forms.
   */
  clear: function () {
    this._textInput.setValue("");
    this._sourceInput.setValue("");
    this._sourceURLInput.setValue("");
    this._translationInput.setValue("");
    this._transcriptionInput.setValue("");
  },

  /**
   * Generates and submits the wikicode then inserts the resulting HTML element if no errors occured.
   */
  submit: function () {
    this._textInput.setDisabled(true);
    this._sourceInput.setDisabled(true);
    this._sourceURLInput.setDisabled(true);
    this._translationInput.setDisabled(true);
    this._transcriptionInput.setDisabled(true);
    this._disableTranslationChk.setDisabled(true);
    this._applyButton.setDisabled(true);
    this._loadingImage.toggle(true);

    // noinspection JSUnresolvedFunction
    const listMarker = "".padStart(this._definitionLevel.length - 1, "#") + "*";

    let text = this._textInput.getValue().trim();
    if (text.includes("=")) text = "1=" + text;
    let code = listMarker + " {{exemple|" + text;

    if (this._language !== "fr") {
      let translation = this._translationInput.getValue().trim();
      const transcription = this._transcriptionInput.getValue().trim();
      if (translation) {
        if (translation.includes("="))
          translation = "sens=" + translation;
        code += "\n|" + translation;
      }
      if (transcription)
        code += "\n|tr=" + transcription;
    }

    const source = this._sourceInput.getValue().trim();
    if (source)
      code += "\n|source=" + source;

    const sourceURL = this._sourceURLInput.getValue().trim();
    if (sourceURL)
      code += "\n|lien=" + sourceURL;

    if (this._definitionLevel.length > 2)
      code += "\n|tête=" + listMarker;

    if (this._disableTranslationChk.isSelected())
      code += "\n|pas-trad=1";

    code += `\n|lang=${this._language}}}`;

    const escapedLangCode = this._language.replaceAll(" ", "_"); // Language codes may contain spaces
    const sectionIDPattern = new RegExp(`^${escapedLangCode}-(?:(flex)-)?([\\wéè-]+)-(\\d+)$`);
    const match = sectionIDPattern.exec(this._definitionLevel[0]);
    const isInflection = match[1] === "flex";
    const sectionType = match[2];
    const sectionNum = parseInt(match[3]);

    // Insert new example into page’s code
    api.get({
      action: "query",
      titles: mw.config.get("wgPageName"),
      prop: "revisions",
      rvprop: "content",
      rvslots: "main",
    }).then((data) => {
      let pageContent;
      for (const pageID in data.query.pages) {
        if (data.query.pages.hasOwnProperty(pageID)) {
          // noinspection JSUnresolvedVariable
          pageContent = data.query.pages[pageID].revisions[0].slots.main["*"];
          break;
        }
      }

      // Look for correct language section
      const langSectionRegex = new RegExp(`==\\s*{{langue\\|${this._language}}}\\s*==`);
      const langSectionIndex = pageContent.search(langSectionRegex);

      if (langSectionIndex === -1) {
        error();
        return;
      }

      // Look for correct word type section
      const lines = pageContent.slice(langSectionIndex).split("\n");
      const sectionRegex = /^===\s*{{S\|([\wéèà -]+)\|/;

      let targetLineIndex;
      for (targetLineIndex = 0; targetLineIndex < lines.length; targetLineIndex++) {
        const line = lines[targetLineIndex];
        const match = sectionRegex.exec(line);
        if (match && sectionNames[sectionType].includes(match[1])
            // Parameter "num" is absent if there is only one section for this type
            && (line.includes("|num=" + sectionNum) || sectionNum === 1)
            // Check whether the section is an inflection if required
            && (isInflection === line.includes("|flexion")))
          break;
      }

      if (targetLineIndex === lines.length) {
        error();
        return;
      }

      // Look for correct definition
      let defIndex = -1;
      let level = 1;
      for (; targetLineIndex < lines.length; targetLineIndex++) {
        const m = /^(#+)[^*#]/.exec(lines[targetLineIndex]);
        if (m) {
          if (level === m[1].length) {
            defIndex++;
            if (this._definitionLevel[level] === defIndex) {
              if (level === this._definitionLevel.length - 1) {
                break;
              } else {
                level++;
                defIndex = -1;
              }
            }
          }
        }
      }

      // Look for last example of current definition
      let inExample = false;
      let stack = 0;
      for (targetLineIndex += 1; targetLineIndex < lines.length; targetLineIndex++) {
        const line_ = lines[targetLineIndex];
        if (line_.startsWith(listMarker) && line_.includes("{{exemple")) {
          inExample = true;
          stack = 0;
        }
        if (inExample) {
          // "exemple" template’s arguments may span several lines
          // use a stack to detect on which line the template ends
          for (let ic = 0; ic < line_.length - 1; ic++) {
            const c = line_.charAt(ic) + line_.charAt(ic + 1);
            if (c === "{{") {
              stack++;
            } else if (c === "}}") {
              stack--;
            }
          }
          if (stack === 0) {
            inExample = false;
          }
        }
        // There should be no empty line between examples
        if (!inExample && (!lines[targetLineIndex + 1] || !lines[targetLineIndex + 1].startsWith(listMarker))) {
          targetLineIndex++;
          break;
        }
      }

      // Insert new example into page content
      const emptyTemplate = /#+\*\s*{{exemple\s*\|\s*\|?\s*lang\s*=[^|}]+}}/.test(lines[targetLineIndex - 1]);
      if (emptyTemplate) {
        // Replace empty template with new example
        lines.splice(targetLineIndex - 1, 1, code);
      } else {
        // Insert new example
        lines.splice(targetLineIndex, 0, code);
      }

      // Submit new page content
      api.edit(mw.config.get("wgPageName"), () => {
        return {
          text: pageContent.slice(0, langSectionIndex) + lines.join("\n"),
          summary: `Ajout d’un exemple avec le gadget «\u00a0${NAME}\u00a0» (v${VERSION}).`,
        };
      }).then(() => {
            api.parse(code).done((data) => {
              const $renderedExample = $(data).find("ul > li").html();
              /** @type {JQuery} */
              let $item;
              // Insert rendered example into page
              if (emptyTemplate) {
                this._$lastExample.html($renderedExample);
                $item = this._$lastExample;
              } else {
                this._$lastExample.after($item = $("<li>").append($renderedExample));
              }
              $item.addClass("new-example");
              setTimeout(() => {
                $item.removeClass("new-example");
              }, 1000);
              this._$lastExample = $item;
            });
            this.setVisible(false);
            this.clear();
            deleteCookie(COOKIE_KEY_TEXT);
            deleteCookie(COOKIE_KEY_SOURCE);
            deleteCookie(COOKIE_KEY_SOURCE_URL);
            deleteCookie(COOKIE_KEY_TRANSLATION);
            deleteCookie(COOKIE_KEY_TRANSCRIPTION);
            reenable();
          },
          // On fail
          () => error("une erreur de réseau est survenue ou vous n’avez pas le droit de modifier la page.")
      );
    });

    const self = this;

    /**
     * Show an error message alert then reset the cookies and re-enable the form.
     * @param reason {string?} A custom reason.
     */
    function error(reason) {
      const msg = reason || "la page a probablement été modifiée entre temps. Veuillez recharger la page et réessayer."
      alert(`L’exemple n’a pas pu être publié car ${msg}`);
      const days = 2;
      setCookie(COOKIE_KEY_TEXT, self._textInput.getValue(), days);
      setCookie(COOKIE_KEY_SOURCE, self._sourceInput.getValue(), days);
      setCookie(COOKIE_KEY_SOURCE_URL, self._sourceURLInput.getValue(), days);
      setCookie(COOKIE_KEY_TRANSLATION, self._translationInput.getValue(), days);
      setCookie(COOKIE_KEY_TRANSCRIPTION, self._transcriptionInput.getValue(), days);
      reenable();
    }

    function reenable() {
      self._textInput.setDisabled(false);
      self._sourceInput.setDisabled(false);
      self._sourceURLInput.setDisabled(false);
      self._translationInput.setDisabled(false);
      self._transcriptionInput.setDisabled(false);
      self._disableTranslationChk.setDisabled(false);
      self._applyButton.setDisabled(false);
      self._cancelButton.setDisabled(false);
      self._loadingImage.toggle(false);
    }
  },
};
// </nowiki>
