/**
 * This file defines the UI elements and functions for the gadget.
 */

// <nowiki>
"use strict";

const { Example, Definition } = require("./data-model.js");
const { getSelectedText, replaceSelectedText } = require("../wikt.core.edit.js");

/**
 * Format a string by replacing placeholders (e.g., "{0}", "{1}") with provided values.
 * @param str {string} The string containing placeholders.
 * @param values {*} The list of values to insert into the string.
 * @return {string} The formatted string.
 */
function interpolateString(str, ...values) {
  return str.replace(/{(\d+)}/g,
      (match, number) => typeof values[number] !== "undefined" ? values[number] : match);
}

/**
 * Returns the link for the given page name.
 * @param pageName {string} Page’s name.
 * @return {OO.ui.HtmlSnippet|string} The HtmlSnippet object
 * for the link or an empty string if the argument evaluates to false.
 */
function getPageLink(pageName) {
  if (pageName) {
    const title = pageName.includes("#") ? pageName.substring(0, pageName.indexOf("#")) : pageName;
    // noinspection HtmlUnknownTarget
    return new OO.ui.HtmlSnippet(
        `<a href="/wiki/${encodeURIComponent(pageName)}" target="_blank" title="${title} (s’ouvre dans un nouvel onglet)">Page d’aide</a>`
    );
  }
  return "";
}

/**
 * Applies the selected text formatting effect.
 * @param effect {string} The effect to apply (either "bold" or "italic").
 * @param $textInput {JQuery} The text input to format the text of.
 */
function applyTextEffect(effect, $textInput) {
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
}

/**
 * Creates an HTML links sequence that will insert text into a text field when clicked.
 * @param list {string[]} The list of strings to convert into links.
 * @param textField {Object} The text field to insert the text into.
 * @param cssClass {string|null?} Optional additonnal CSS classes.
 * @param text {(string|null)?} Some text that will be appended before the links.
 * @param insertFormatButtons {boolean?} Whether to insert formatting buttons before the list. Defaults to false.
 * @return {JQuery<HTMLElement>} A jQuery object.
 */
function createLinks(
    list,
    textField,
    cssClass = null,
    text = null,
    insertFormatButtons = false
) {
  const $links = $("<span>");

  if (text) {
    $links.append(text + " &mdash; ");
  }

  if (insertFormatButtons) {
    const $element = textField.$element;
    let $textInput = $element.find("textarea");
    if (!$textInput.length) {
      $textInput = $element.find('input[type="text"]');
    }
    const $bold = $('<a href="#" style="font-weight: bold">Gras</a>');
    $bold.on("click", () => {
      applyTextEffect("bold", $textInput);
      textField.focus();
      // Return false to disable default event from triggering.
      return false;
    });
    const $italic = $('<a href="#" style="font-style: italic">Italique</a>');
    $italic.on("click", () => {
      applyTextEffect("italic", $textInput);
      textField.focus();
      // Return false to disable default event from triggering.
      return false;
    });
    $links.append($bold, " ", $italic, " &mdash; ");
  }

  for (const [i, item] of list.entries()) {
    const dataValue = item.replace("&", "&amp;");
    const $link = $(`<a href="#" class="${cssClass || ''}" data-value="${dataValue}">${item.trim()}</a>`);
    $link.on("click", e => {
      textField.insertContent($(e.target).data("value"));
      textField.focus();
      // Return false to disable default event from triggering.
      return false;
    });
    $links.append($link);
    if (i < list.length - 1) {
      $links.append("\u00a0");
    }
  }

  return $links;
}

const SPECIAL_CHARS = [
  "’", "à", "À", "â", "Â", "æ", "Æ", "ç", "Ç", "é", "É", "è", "È", "ê", "Ê", "ë", "Ë", "î", "Î", "ï", "Ï",
  "ſ", "ô", "Ô", "œ", "Œ", "ù", "Ù", "û", "Û", "ü", "Ü", "ÿ", "Ÿ", "«\u00a0", "\u00a0»",
];

/**
 * Wrapper class for OO.ui.TabPanelLayout.
 * @param name {string} Tab’s name.
 * @param options {Object} OOUI tab’s options.
 * @constructor
 */
function Tab(name, options) {
  OO.ui.TabPanelLayout.call(this, name, options);
}

// Inherit from OOUI TabPanelLayout’s prototype.
Tab.prototype = Object.create(OO.ui.TabPanelLayout.prototype);

/**
 * Sets this tab as active.
 */
Tab.prototype.select = function () {
  // noinspection JSUnresolvedFunction
  this.setActive(true);
};

/**
 * Create a definition form.
 * @param definitionID ID of the definition.
 * @param langCode {string} Language code.
 * @constructor
 */
function DefinitionForm(definitionID, langCode) {
  this._langCode = langCode;
  this._definitionFld = new OO.ui.MultilineTextInputWidget({
    rows: 5,
  });
  this._examplesFlds = [];
  this._addExampleBtn = new OO.ui.ButtonWidget({
    label: "Ajouter un exemple",
  });
  this._addExampleBtn.on("click", () => this.addExample());
  this._removeExampleBtn = new OO.ui.ButtonWidget({
    label: "Retirer le dernier exemple",
  });
  this._removeExampleBtn.on("click", () => this.removeExample(this.examplesCount - 1));
  this._removeExampleBtn.toggle(false); // Hide by default

  OO.ui.FieldsetLayout.call(this, {
    label: "Définition n°" + definitionID,
    items: [
      new OO.ui.FieldLayout(this._definitionFld, {
        label: createLinks(SPECIAL_CHARS, this._definitionFld, null, null, true),
        align: "inline",
        help: getPageLink("Aide:Définitions"),
      }),
      new OO.ui.HorizontalLayout({
        items: [
          this._addExampleBtn,
          this._removeExampleBtn,
        ],
      }),
    ],
  });
}

DefinitionForm.prototype = Object.create(OO.ui.FieldsetLayout.prototype);

/**
 * Called when the user selects a language.
 * @param langCode The new language code.
 */
DefinitionForm.prototype.onLanguageUpdate = function (langCode) {
  this._langCode = langCode;
  this._examplesFlds.forEach(f => f.onLanguageUpdate(langCode))
};

/**
 * Adds an example form.
 */
DefinitionForm.prototype.addExample = function () {
  const exampleForm = new ExampleForm(this.examplesCount + 1, this._langCode);
  this._examplesFlds.push(exampleForm);
  // noinspection JSUnresolvedFunction,JSUnresolvedVariable
  this.addItems([exampleForm], this.items.length - 1);
  this._removeExampleBtn.toggle(this.examplesCount !== 0);
};

/**
 * Removes an example form.
 * @param index {number} Example form’s index.
 */
DefinitionForm.prototype.removeExample = function (index) {
  const exampleForm = this._examplesFlds[index];
  this._examplesFlds.splice(index, 1);
  // noinspection JSUnresolvedFunction
  this.removeItems([exampleForm]);
  this._removeExampleBtn.toggle(this.examplesCount !== 0);
};

/**
 * @return {string} Definition’s text.
 */
DefinitionForm.prototype.getText = function () {
  return this._definitionFld.getValue().trim().replace(/^#\s*/, "");
};

Object.defineProperty(DefinitionForm.prototype, "examplesCount", {
  /**
   * @return {number} The number of examples.
   */
  get: function () {
    return this._examplesFlds.length;
  },
});

/**
 * @param index {number} Example’s index.
 * @return {Example}
 */
DefinitionForm.prototype.getExample = function (index) {
  const exampleForm = this._examplesFlds[index];
  return new Example(
      exampleForm.getText(),
      exampleForm.getTranslation(),
      exampleForm.getTranscription(),
      exampleForm.getSource(),
      exampleForm.getLink(),
      exampleForm.isTranslationDisabled()
  );
};

/**
 * Creates a definition example form.
 * @param exampleID {number} ID of the example.
 * @param langCode {string} Language code.
 * @constructor
 */
function ExampleForm(exampleID, langCode) {
  this._textFld = new OO.ui.MultilineTextInputWidget({
    rows: 3,
  });
  this._translationFld = new OO.ui.MultilineTextInputWidget({
    rows: 3,
  });
  this._transcriptionFld = new OO.ui.MultilineTextInputWidget({
    rows: 3,
  });
  this._sourceFld = new OO.ui.MultilineTextInputWidget({
    rows: 3,
  });
  this._linkFld = new OO.ui.TextInputWidget();
  this._disableTranslationChk = new OO.ui.CheckboxInputWidget();

  this._translationFieldLayout = new OO.ui.FieldLayout(this._translationFld, {
    label: createLinks(SPECIAL_CHARS, this._translationFld, null, "Traduction en français", true),
    align: "inline",
  });
  this._transcriptionFieldLayout = new OO.ui.FieldLayout(this._transcriptionFld, {
    label: createLinks(SPECIAL_CHARS, this._transcriptionFld, null, "Transcription latine", true),
    align: "inline",
  });

  OO.ui.FieldsetLayout.call(this, {
    label: "Exemple n°" + exampleID,
    items: [
      new OO.ui.FieldLayout(this._textFld, {
        label: createLinks(SPECIAL_CHARS, this._textFld, null, "Texte", true),
        align: "inline",
        help: getPageLink("Aide:Exemples"),
      }),
      this._translationFieldLayout,
      this._transcriptionFieldLayout,
      new OO.ui.FieldLayout(this._sourceFld, {
        label: createLinks(SPECIAL_CHARS, this._sourceFld, null, "Source", true),
        align: "inline",
      }),
      new OO.ui.FieldLayout(this._linkFld, {
        label: createLinks(SPECIAL_CHARS, this._linkFld, null, "Lien"),
        align: "inline",
      }),
      new OO.ui.FieldLayout(this._disableTranslationChk, {
        label: "Désactiver la traduction",
        align: "inline",
        help: "Permet d’indiquer que la traduction n’est pas nécessaire, pour une langue autre que le français (ex\u00a0: moyen français).",
        helpInline: true,
      }),
    ],
  });

  this.onLanguageUpdate(langCode);
}

ExampleForm.prototype = Object.create(OO.ui.FieldsetLayout.prototype);

/**
 * Called when the user selects a language.
 * @param langCode The new language code.
 */
ExampleForm.prototype.onLanguageUpdate = function (langCode) {
  const isFrench = langCode === "fr";
  this._translationFieldLayout.toggle(!isFrench);
  this._transcriptionFieldLayout.toggle(!isFrench);
  this._disableTranslationChk.setDisabled(isFrench);
};

/**
 * @return {string} Example’s text.
 */
ExampleForm.prototype.getText = function () {
  return this._textFld.getValue().trim();
};

/**
 * @return {string|null} Example’s French translation.
 */
ExampleForm.prototype.getTranslation = function () {
  return !this.isTranslationDisabled() && this._translationFld.getValue().trim() || null;
};

/**
 * @return {string|null} Example’s latin transcription.
 */
ExampleForm.prototype.getTranscription = function () {
  return this._transcriptionFld.getValue().trim() || null;
};

/**
 * @return {string|null} Example’s source.
 */
ExampleForm.prototype.getSource = function () {
  return this._sourceFld.getValue().trim() || null;
};

/**
 * @return {string|null} Example’s link.
 */
ExampleForm.prototype.getLink = function () {
  return this._linkFld.getValue().trim() || null;
};

/**
 * @return {boolean} Whether the translation should be disabled.
 */
ExampleForm.prototype.isTranslationDisabled = function () {
  return this._disableTranslationChk.isSelected() && !this._disableTranslationChk.isDisabled();
};

/**
 * Base class for the gadget’s GUIs.
 */
class GUI {
  /** jQuery selector of the HTML element GUIs will be inserted into. */
  static TARGET_ELEMENT = "#Editnotice-0";
}

/**
 * Gadget’s start GUI consists of a simple button that will open the actual GUI upon being clicked.
 */
class StartGUI extends GUI {
  static #ELEMENT_ID = "cnm-open-ui";

  /**
   * @param gadgetName {string}
   * @param onActivateGadget {function}
   */
  constructor(gadgetName, onActivateGadget) {
    super();
    const $target = $(GUI.TARGET_ELEMENT);
    const headerText = `
<div class="center" style="margin-bottom: 5px">
  <span id="${StartGUI.#ELEMENT_ID}" class="mw-ui-button mw-ui-progressive">Ouvrir le gadget ${gadgetName}</span>
</div>`.trim();
    $target.append(headerText);
    $target.find("#" + StartGUI.#ELEMENT_ID).on("click", onActivateGadget);
  }

  /**
   * Removes this GUI from the DOM.
   */
  remove() {
    $("#" + StartGUI.#ELEMENT_ID).remove();
  }
}

/**
 * Gadget’s main GUI.
 */
class MainGUI extends GUI {
  /** @type {string} */
  #word;
  /** @type {Tab[]} */
  #tabs = [];

  #languageSelectFld = null;
  #grammarClassSelectFld = null;
  #grammaticalPropertyComboboxes = [null, null];
  #imageFld = null;
  #imageDescriptionFld = null;
  #pronunciationFld = null;
  #pronunciationPnl = null;
  #addDefinitionBtn = null;
  #removeDefinitionBtn = null;
  #definitionsLayout = null;
  #definitionFlds = [];
  #categoriesWidget = null;
  #etymologyFld = null;
  #pronunciationSectionFld = null;
  #homophonesFld = null;
  #paronymsFld = null;
  #referencesFld = null;
  #bibliographyFld = null;
  /** @type {Record<string, Object>} */
  #otherSectionFields = {};
  #seeOtherProjectsChk = {};
  #draftChk = null;
  #sortKeyFld = null;
  /** @type {Record<string, Wiki>} */
  #otherProjects = {};
  /**
   * Language span tag in gadget’s title.
   * @type {JQuery<HTMLElement>}
   */
  #$titleLangSpan = null;

  /**
   * @param word {string} The word.
   * @param languages {Language[]} The language.
   * @param sections {ArticleSection[]} The list of word type sub-sections.
   * @param onLanguageSelect {Function} Callback function for when a language is selected.
   * @param onClassSelect {Function} Callback function for when a grammatical class is selected.
   * @param onInsertWikicode {Function} Callback function for when “insert wikicode” button is clicked.
   * @param otherProjects {Record<string, Wiki>} Object containing data for sister projects.
   */
  constructor(word, languages, sections, onLanguageSelect, onClassSelect, onInsertWikicode, otherProjects) {
    super();
    this.#word = word;
    this.#otherProjects = otherProjects;

    // Tabs declaration
    const tabs = [
      {
        title: "Langue, type, définitions",
        content: () => {
          const languageFld = new OO.ui.TextInputWidget({
            placeholder: "Code de langue",
          });
          const languageBnt = new OO.ui.ButtonWidget({
            label: "Passer à cette langue",
          });
          // noinspection JSValidateTypes
          languageBnt.on("click", () => onLanguageSelect(languageFld.getValue()));

          const languageOptions = [];
          for (const lang of languages) {
            languageOptions.push(new OO.ui.MenuOptionWidget({
              data: lang.code,
              label: lang.name,
            }));
          }
          this.#languageSelectFld = new OO.ui.DropdownWidget({
            menu: {
              items: languageOptions,
            },
          });
          // noinspection JSCheckFunctionSignatures,JSValidateTypes
          this.#languageSelectFld.getMenu().on("select", e => onLanguageSelect(e.getData()));

          this.#grammarClassSelectFld = new OO.ui.DropdownWidget();
          // noinspection JSCheckFunctionSignatures
          this.#grammarClassSelectFld.getMenu().on("select", e => onClassSelect(e.getData()));
          this.#grammaticalPropertyComboboxes[0] = new OO.ui.DropdownWidget();
          this.#grammaticalPropertyComboboxes[1] = new OO.ui.DropdownWidget();

          const imageSectionLabel = new OO.ui.HtmlSnippet(
              `Image &mdash; <a href="https://commons.wikimedia.org/w/index.php?search=${word}" ` +
              'target="_blank" title="S’ouvre dans un nouvel onglet">Rechercher sur Commons</a>'
          );
          this.#imageFld = new OO.ui.TextInputWidget({
            id: "cnm-image-field",
            placeholder: "Nom du fichier",
          });
          this.#imageDescriptionFld = new OO.ui.TextInputWidget({
            id: "cnm-image-description-field",
            placeholder: "Légende",
          });

          this.#pronunciationFld = new OO.ui.TextInputWidget({
            id: "cnm-pronunciation-field",
          });
          this.#pronunciationPnl = new OO.ui.FieldLayout(this.#pronunciationFld, {
            align: "inline",
            help: getPageLink("Aide:Prononciation"),
          });

          this.#addDefinitionBtn = new OO.ui.ButtonWidget({
            label: "Ajouter une définition",
          });
          this.#addDefinitionBtn.on("click", () => this.addDefinition());
          this.#removeDefinitionBtn = new OO.ui.ButtonWidget({
            label: "Retirer la dernière définition",
          });
          this.#removeDefinitionBtn.on("click", () => this.removeDefinition(this.definitionsCount - 1));
          this.#removeDefinitionBtn.toggle(false); // Hide by default

          this.#definitionsLayout = new OO.ui.FieldsetLayout({
            label: "Définition(s)",
            items: [
              new OO.ui.HorizontalLayout({
                items: [
                  this.#addDefinitionBtn,
                  this.#removeDefinitionBtn,
                ],
              }),
            ],
          });

          this.#categoriesWidget = new OO.ui.TagMultiselectWidget({
            inputPosition: "inline",
            allowArbitrary: true,
          });

          return new OO.ui.FieldsetLayout({
            items: [
              new OO.ui.FieldsetLayout({
                label: "Langue",
                items: [
                  new OO.ui.HorizontalLayout({
                    items: [
                      new OO.ui.FieldLayout(this.#languageSelectFld, {
                        align: "inline",
                      }),
                      new OO.ui.ActionFieldLayout(languageFld, languageBnt, {
                        align: "inline",
                      }),
                    ],
                  }),
                ],
                help: "Pour passer à une langue indisponible dans le menu déroulant, "
                    + "entrez son code dans le champ ci-dessous puis appuyez sur le bouton «\u00a0Passer à cette langue\u00a0».",
                helpInline: true,
              }),
              new OO.ui.FieldsetLayout({
                label: "Informations grammaticales",
                items: [
                  new OO.ui.HorizontalLayout({
                    items: [
                      new OO.ui.FieldLayout(this.#grammarClassSelectFld, {
                        align: "inline",
                      }),
                      new OO.ui.FieldLayout(this.#grammaticalPropertyComboboxes[0], {
                        align: "inline",
                      }),
                      new OO.ui.FieldLayout(this.#grammaticalPropertyComboboxes[1], {
                        align: "inline",
                      }),
                    ],
                  }),
                ],
              }),
              new OO.ui.FieldsetLayout({
                label: imageSectionLabel,
                items: [
                  this.#imageFld,
                  new OO.ui.FieldLayout(this.#imageDescriptionFld, {
                    label: createLinks(SPECIAL_CHARS, this.#imageDescriptionFld, null, null, true),
                    align: "inline",
                  }),
                ],
                help: "Indiquer seulement le nom de l’image, " +
                    "sans «\u00a0File:\u00a0», «\u00a0Fichier:\u00a0» ni «\u00a0Image:\u00a0».",
                helpInline: true,
              }),
              new OO.ui.FieldsetLayout({
                label: "Prononciation",
                items: [
                  this.#pronunciationPnl,
                ],
              }),
              this.#definitionsLayout,
              new OO.ui.FieldsetLayout({
                label: "Catégories",
                items: [
                  this.#categoriesWidget,
                ],
                help: "Pour les cas où aucun modèle n’ajoute une catégorie spécifique, vous pouvez la renseigner ici. " +
                    "Indiquez seulement le nom de la catégorie (sans «\u00a0Catégorie:\u00a0»), " +
                    "en respectant la casse (majuscules/minuscules).",
                helpInline: true,
              }),
            ],
          });
        },
      },
      {
        title: "Sections supplémentaires",
        content: () => {
          this.#etymologyFld = new OO.ui.MultilineTextInputWidget({
            rows: 4,
            autofocus: true,
          });
          const pronSectionLabel = new OO.ui.HtmlSnippet(
              'Prononciation (section)<span> &mdash; <a id="cnm-commons-audio-link" href="#" ' +
              'target="_blank" title="S’ouvre dans un nouvel onglet">Rechercher des fichiers audio sur Commons</a></span>'
          );
          this.#pronunciationSectionFld = new OO.ui.MultilineTextInputWidget({
            rows: 4,
          });
          this.#homophonesFld = new OO.ui.MultilineTextInputWidget({
            rows: 4,
          });
          this.#paronymsFld = new OO.ui.MultilineTextInputWidget({
            rows: 4,
          });
          this.#referencesFld = new OO.ui.MultilineTextInputWidget({
            rows: 4,
          });
          this.#bibliographyFld = new OO.ui.MultilineTextInputWidget({
            rows: 4,
          });

          // noinspection JSUnresolvedReference
          /**
           * `cnmFilter` may be defined in a user’s [[Special:MyPage/common.js]] page
           * and should contain the IDs of the sections they wish to keep.
           * @type {string[]}
           */
          const filter = Array.isArray(window.cnmFilter) ? window.cnmFilter : [];
          const fields = [];
          for (const section of sections) {
            if (!section.hidden && (filter.length === 0 || filter.includes(section.code))) {
              const field = new OO.ui.MultilineTextInputWidget({
                rows: 4,
                columns: 20,
              });
              this.#otherSectionFields[section.code] = field;
              fields.push(new OO.ui.FieldLayout(field, {
                label: section.label,
                align: "inline",
                help: getPageLink(section.help),
              }));
            }
          }

          return new OO.ui.FieldsetLayout({
            items: [
              new OO.ui.FieldsetLayout({
                label: "Étymologie",
                items: [
                  new OO.ui.FieldLayout(this.#etymologyFld, {
                    label: createLinks(SPECIAL_CHARS, this.#etymologyFld, null, null, true),
                    align: "inline",
                    help: getPageLink("Aide:Étymologies"),
                  }),
                ],
                help: new OO.ui.HtmlSnippet("Laisser le champ de texte vide ajoutera le modèle <code>{{ébauche-étym}}</code>."),
                helpInline: true,
              }),
              new OO.ui.FieldsetLayout({
                label: pronSectionLabel,
                items: [
                  new OO.ui.FieldLayout(this.#pronunciationSectionFld, {
                    label: createLinks(SPECIAL_CHARS, this.#pronunciationSectionFld, null, null, true),
                    align: "inline",
                    help: getPageLink("Aide:Prononciation"),
                  }),
                  new OO.ui.FieldLayout(this.#homophonesFld, {
                    label: createLinks(SPECIAL_CHARS, this.#homophonesFld, null, "Homophones", true),
                    align: "inline",
                    help: getPageLink("Aide:Homophones et paronymes"),
                  }),
                  new OO.ui.FieldLayout(this.#paronymsFld, {
                    label: createLinks(SPECIAL_CHARS, this.#paronymsFld, null, "Paronymes", true),
                    align: "inline",
                    help: getPageLink("Aide:Homophones et paronymes"),
                  }),
                ],
              }),
              new OO.ui.FieldsetLayout({
                label: "Références",
                items: [
                  new OO.ui.FieldLayout(this.#referencesFld, {
                    label: createLinks(SPECIAL_CHARS, this.#referencesFld, null, null, true),
                    align: "inline",
                    help: getPageLink("Aide:Références#Le_format_développé"),
                  }),
                  new OO.ui.FieldLayout(this.#bibliographyFld, {
                    label: createLinks(SPECIAL_CHARS, this.#bibliographyFld, null, "Bibliographie", true),
                    align: "inline",
                    help: getPageLink("Aide:Références#Le_format_développé"),
                  }),
                ],
                help: new OO.ui.HtmlSnippet(
                    "La section «&nbsp;Sources&nbsp;» contenant le modèle <code>{{Références}}</code> " +
                    "est insérée automatiquement si le modèle <code>{{R}}</code>, <code>{{RÉF}}</code> ou " +
                    "<code>{{réf}}</code> ou la balise <code>&lt;ref></code> " +
                    "sont présentes dans les autres champs."
                ),
                helpInline: true,
              }),
              new OO.ui.FieldsetLayout({
                label: "Autres sections",
                help: new OO.ui.HtmlSnippet(
                    "Renseignez un mot/expression par ligne, en omettant la syntaxe pour créer " +
                    "un lien (<code>[[mot]]</code>, <code>{{lien|mot|…}}</code>) ou une liste (<code>* item</code>)."
                ),
                helpInline: true,
                items: [
                  new OO.ui.HorizontalLayout({
                    items: fields,
                  }),
                ],
              }),
            ],
          });
        },
      },
      {
        title: "Options avancées",
        content: () => {
          const otherProjectsFields = [];

          for (const [projectCode, projectData] of Object.entries(this.#otherProjects)) {
            const projectName = projectData.name;
            const checkbox = new OO.ui.CheckboxInputWidget({
              value: projectCode,
              selected: false,
            });
            const textFld = new OO.ui.TextInputWidget({
              label: projectName,
              disabled: true,
            });

            checkbox.on("change", selected => textFld.setDisabled(!selected));

            this.#seeOtherProjectsChk[projectCode] = {
              checkbox: checkbox,
              textfield: textFld,
            };

            otherProjectsFields.push(new OO.ui.ActionFieldLayout(
                checkbox,
                textFld,
                {
                  align: "inline",
                  id: `cnm-sister-project-${projectCode}`,
                  label: new OO.ui.HtmlSnippet('<a href="#" target="_blank">Rechercher</a>'),
                }
            ));
          }

          this.#draftChk = new OO.ui.CheckboxInputWidget();
          this.#sortKeyFld = new OO.ui.TextInputWidget();

          return new OO.ui.FieldsetLayout({
            items: [
              new OO.ui.FieldsetLayout({
                label: "Liens vers les autres projets",
                items: otherProjectsFields,
                help: "Les champs de texte permettent de renseigner des paramètres" +
                    " supplémentaire aux modèles de liens interwiki.",
                helpInline: true,
              }),
              new OO.ui.FieldsetLayout({
                label: "Autres options",
                items: [
                  new OO.ui.FieldLayout(this.#draftChk, {
                    label: "Ébauche",
                    align: "inline",
                  }),
                  new OO.ui.FieldLayout(this.#sortKeyFld, {
                    label: "Clé de tri",
                    help: "Permet de trier les pages dans les catégories.",
                    align: "inline",
                    helpInline: true,
                  }),
                ],
              }),
            ],
          });
        },
      },
    ];

    /*
     * Insert tabs
     */

    const tabsWidget = new OO.ui.IndexLayout({
      expanded: false,
      id: "cnm-tabs-widget",
    });
    for (const [i, tabData] of tabs.entries()) {
      const tab = new Tab(`cnm-tab${i}`, {
        label: tabData.title,
        expanded: false,
      });
      const content = tabData.content();
      tab.$element.append(typeof content === "string" ? content : content.$element);
      tabsWidget.addTabPanels([tab]);
      this.#tabs.push(tab);
    }

    /*
     * Construct GUI
     */

    const toolFactory = new OO.ui.ToolFactory();
    const toolGroupFactory = new OO.ui.ToolGroupFactory();
    const toolbar = new OO.ui.Toolbar(toolFactory, toolGroupFactory, { actions: true });

    /**
     * Adds a custom button to the tool factory.
     * @param toolFactory The tool factory into which the tool will be registered.
     * @param name {string} Button’s name.
     * @param icon {string|null} Buttons’s icon name.
     * @param progressive {boolean} Wether the icon should be marked as progressive.
     * @param title {string} Button’s tooltip text.
     * @param onSelect {function} Callback for when the button is clicked.
     * @param onUpdateState {function?} Callback for when the button changes state (optional).
     * @param displayBothIconAndLabel {boolean?} Whether both the icon and label should be displayed.
     */
    function generateButton(toolFactory, name, icon, progressive, title, onSelect, onUpdateState, displayBothIconAndLabel) {
      /** @constructor */
      function CustomTool() {
        CustomTool.super.apply(this, arguments);
      }

      OO.inheritClass(CustomTool, OO.ui.Tool);
      CustomTool.static.name = name;
      CustomTool.static.icon = icon;
      CustomTool.static.title = title;
      if (progressive) {
        CustomTool.static.flags = ["primary", "progressive"];
      }
      CustomTool.static.displayBothIconAndLabel = !!displayBothIconAndLabel;
      CustomTool.prototype.onSelect = onSelect;
      // noinspection JSUnusedGlobalSymbols
      CustomTool.prototype.onUpdateState = onUpdateState || function () {
        this.setActive(false);
      };

      toolFactory.register(CustomTool);
    }

    const hideBtn = "hide";
    generateButton(toolFactory, hideBtn, "collapse", false, "Masquer", function () {
      // noinspection JSCheckFunctionSignatures
      tabsWidget.toggle();
      this.setTitle(tabsWidget.isVisible() ? "Masquer" : "Afficher");
      this.setIcon(tabsWidget.isVisible() ? "collapse" : "expand");
    });

    const helpBtn = "help";
    generateButton(toolFactory, helpBtn, "help", false, "Aide (s’ouvre dans un nouvel onglet)", function () {
      window.open("/wiki/Aide:Gadget-CreerNouveauMot");
    });

    const actionsToolbar = new OO.ui.Toolbar(toolFactory, toolGroupFactory);

    const insertWikicodeBtn = "insert";
    generateButton(toolFactory, insertWikicodeBtn, null, true, "Insérer le code", onInsertWikicode, null, true);

    actionsToolbar.setup([
      {
        type: "bar",
        include: [insertWikicodeBtn],
      },
    ]);
    toolbar.setup([
      {
        type: "bar",
        include: [hideBtn, helpBtn],
      },
    ]);
    toolbar.$actions.append(actionsToolbar.$element);

    const gadgetBox = new OO.ui.PanelLayout({
      expanded: false,
      framed: true,
    });
    const contentFrame = new OO.ui.PanelLayout({
      expanded: false,
    });

    gadgetBox.$element.append(
        toolbar.$element,
        contentFrame.$element.append(tabsWidget.$element)
    );

    toolbar.initialize();
    toolbar.emit("updateState");

    /*
     * Insert elements into DOM
     */

    const $tedit = $(GUI.TARGET_ELEMENT);
    $tedit.append('<h1 id="cnm-title">Ajout d’un mot en <span id="cnm-title-lang">…</span></h1>');
    this.#$titleLangSpan = $("#cnm-title-lang");
    $tedit.append(gadgetBox.$element);

    for (const projectCode of Object.keys(this.#otherProjects)) {
      $(`#cnm-sister-project-${projectCode} span.oo-ui-actionFieldLayout-button`).attr("style", "width: 100%");
      $(`#cnm-sister-project-${projectCode} span.oo-ui-fieldLayout-field`).attr("style", "width: 100%");
    }

    // Enforce fonts for pronunciation text input.
    $("#cnm-pronunciation-field > input")
        .attr("style", 'font-family: "DejaVu Sans", "Segoe UI", "Lucida Grande", "Charis SIL", ' +
            '"Gentium Plus", "Doulos SIL", sans-serif !important');
  }

  /**
   * Selects the tab at the given index.
   * @param index {number} The index.
   */
  selectTab(index) {
    this.#tabs[index].select();
  }

  /**
   * Selects the given language. All external links are modified appropriatly.
   * If the language is not in the dropdown menu, it is added to it.
   * @param language {Language} The language object.
   */
  selectLanguage(language) {
    this.#$titleLangSpan.text(language.name);
    if (!this.#languageSelectFld.getMenu().findItemFromData(language.code)) {
      this.#languageSelectFld.getMenu().addItems([new OO.ui.MenuOptionWidget({
        data: language.code,
        label: language.name,
      })], 0);
    }
    this.#updateFields(language);
    this.#updateSisterProjectsLinks(language);
    const $link = $("#cnm-commons-audio-link");
    const $span = $link.parent();
    let commonsAudioUrl = "#";
    if (language.iso6393Code) {
      const w = this.#word.replace(" ", "_");
      commonsAudioUrl =
          `https://commons.wikimedia.org/w/index.php?search=${w}.wav+incategory:"Lingua+Libre+pronunciation-${language.iso6393Code}"`;
      $span.show();
    } else {
      $span.hide();
    }
    $link.attr("href", commonsAudioUrl);
    this.#languageSelectFld.getMenu().selectItemByData(language.code);
    this.#pronunciationPnl.setLabel(this.#formatApi(language.ipaSymbols));
    if (this.definitionsCount === 0) {
      // No definition is added until the user selects a language or its cookie has been read
      this.addDefinition();
    }
    this.#definitionFlds.forEach(f => f.onLanguageUpdate(language.code));
  }

  /**
   * @returns {number} The number of grammatical property comboboxes.
   */
  get grammaticalPropertyFieldsCount() {
    return this.#grammaticalPropertyComboboxes.length;
  }

  /**
   * Sets the values of the grammatical property combobox at the given index.
   * @param index {number} The combobox index.
   * @param properties {GrammaticalProperty[]} The list of values.
   */
  setAvailableGrammaticalProperties(index, properties) {
    MainGUI.#setListValues(properties, this.#grammaticalPropertyComboboxes[index]);
  }

  /**
   * Updates all language-related fields.
   * @param language {Language} The selected language.
   */
  #updateFields(language) {
    this.#grammarClassSelectFld.getMenu().clearItems();
    const items = [];
    items.push(new OO.ui.MenuOptionWidget({
      data: "",
      label: new OO.ui.HtmlSnippet("— Veuillez choisir —"),
    }));

    for (const [key, grammarItem] of Object.entries(language.grammarItems)) {
      items.push(new OO.ui.MenuOptionWidget({
        data: key,
        label: new OO.ui.HtmlSnippet(grammarItem.grammaticalClass.label),
      }));
    }

    this.#grammarClassSelectFld.getMenu().addItems(items);
    this.#grammarClassSelectFld.getMenu().selectItem(items[0]);
    this.#pronunciationFld.setDisabled(language.code === "conv");
  }

  /**
   * Updates the link search links to sister projects based on the selected language.
   * @param language {Language} The selected language.
   */
  #updateSisterProjectsLinks(language) {
    for (const [projectCode, projectData] of Object.entries(this.#otherProjects)) {
      const forLangs = projectData.showOnlyForLangs;
      const disabled = forLangs.length !== 0 && !forLangs.includes(language.code);
      const checkbox = this.#seeOtherProjectsChk[projectCode]["checkbox"];

      const projectDomain = projectData.urlDomain;
      const urlBase = projectData.urlBase;

      const $link = $(`#cnm-sister-project-${projectCode} a`);
      const url = MainGUI.#generateProjectLink(projectDomain, urlBase, language.wikimediaCode, this.#word);

      checkbox.setDisabled(disabled);
      // Unselect if disabled
      checkbox.setSelected(checkbox.isSelected() && !disabled);
      $link.attr("href", url);
      if (url === "#" || disabled) {
        $link.hide();
      } else {
        $link.show();
      }
    }
  }

  /**
   * Creates an HTML list of IPA symbols from an array of symbols.
   * @param ipaSymbols {string[][]} The list of IPA symbols.
   * @return {JQuery} A jQuery object.
   */
  #formatApi(ipaSymbols) {
    const $label = $("<span>");

    for (const [i, ipaSymbol] of ipaSymbols.entries()) {
      $label.append(createLinks(ipaSymbol, this.#pronunciationFld, "API"));
      if (i < ipaSymbols.length - 1) {
        $label.append(" &mdash; ");
      }
    }

    return $label;
  }

  /**
   * Sets the values of the given OOUI dropdown widget.
   * @param values {GrammaticalProperty[]} The list of values.
   * @param field {OO.ui.DropdownWidget} The OOUI widget.
   */
  static #setListValues(values, field) {
    // noinspection JSUnresolvedFunction
    field.getMenu().clearItems();
    const items = [];
    if (values.length) {
      if (values.length !== 1) { // No need to add an extra step when there’s only one choice
        items.push(new OO.ui.MenuOptionWidget({
          data: "",
          label: new OO.ui.HtmlSnippet("— Veuillez choisir —"),
        }));
      }
      for (const value of values) {
        items.push(new OO.ui.MenuOptionWidget({
          data: value.label,
          label: new OO.ui.HtmlSnippet(value.label),
        }));
      }
    } else {
      items.push(new OO.ui.MenuOptionWidget({
        data: "n/a",
        label: new OO.ui.HtmlSnippet("<em>indisponible</em>"),
      }));
    }
    // noinspection JSUnresolvedFunction
    field.getMenu().addItems(items);
    // noinspection JSUnresolvedFunction
    field.getMenu().selectItem(items[0]);
  }

  /**
   * Generates the URL to the given sister project’s search page.
   * @param projectDomain {string} Project’s domain name.
   * @param urlBase {string} The base URL (usually wiki).
   * @param langCode {string} Project’s domain language code.
   * @param word {string} The word to search for.
   * @return {string} The search URL.
   */
  static #generateProjectLink(projectDomain, urlBase, langCode, word) {
    if (!langCode) return "#";
    const domain = interpolateString(projectDomain, langCode);
    return `https://${domain}/${urlBase}${encodeURIComponent(word)}`;
  }

  /**
   * Returns the contents of the given section.
   * @param sectionCode {string} Sections’s code.
   * @return {string} The section’s contents.
   */
  getSectionContent(sectionCode) {
    return this.#otherSectionFields[sectionCode] ? this.#otherSectionFields[sectionCode].getValue().trim() : "";
  }

  /**
   * Sets the contents of the given section.
   * @param sectionCode {string} Sections’s code.
   * @param content {string} The section’s contents.
   */
  setSectionContent(sectionCode, content) {
    this.#otherSectionFields[sectionCode].setValue(content.trim());
  }

  /**
   * Indicates whether a link to the given sister project has to be inserted.
   * @param projectCode {string} Project’s code.
   * @return {boolean} True if a link has to be inserted.
   */
  hasAddLinkToProject(projectCode) {
    return this.#seeOtherProjectsChk[projectCode]["checkbox"].isSelected();
  }

  /**
   * Sets whether a link to the given sister project has to be inserted.
   * @param projectCode {string} Project’s code.
   * @param link {boolean} True if a link has to be inserted.
   */
  setAddLinkToProject(projectCode, link) {
    this.#seeOtherProjectsChk[projectCode]["checkbox"].setSelected(link);
  }

  /**
   * Returns the template parameters for the given sister project link.
   * @param projectCode {string} Project’s code.
   * @return {string} Template’s parameters.
   */
  getProjectLinkParams(projectCode) {
    return this.#seeOtherProjectsChk[projectCode]["textfield"].getValue().trim();
  }

  /**
   * Sets template parameters for the given sister project link.
   * @param projectCode {string} Project’s code.
   * @param params {string} Template’s parameters.
   */
  setProjectLinkParams(projectCode, params) {
    this.#seeOtherProjectsChk[projectCode]["textfield"].setValue(params.trim());
  }

  /**
   * @return {number} The number of tabs.
   */
  get tabsNumber() {
    return this.#tabs.length;
  }

  /**
   * @return {string} Selected language’s code.
   */
  get selectedLanguage() {
    return this.#languageSelectFld.getMenu().findSelectedItem().getData();
  }

  /**
   * @returns {string[]} Selected grammatical properties’ codes.
   */
  get grammaticalPropertyCodes() {
    return this.#grammaticalPropertyComboboxes.map(cb => cb.getMenu().findSelectedItem().getData())
  }

  /**
   * @return {string} Selected grammatical class.
   */
  get grammarClass() {
    return this.#grammarClassSelectFld.getMenu().findSelectedItem().getData();
  }

  /**
   * @return {string} The image name.
   */
  get imageName() {
    return this.#imageFld.getValue().trim();
  }

  /**
   * Sets the image name.
   * @param imageName {string} The image name.
   */
  set imageName(imageName) {
    this.#imageFld.setValue(imageName.trim());
  }

  /**
   * @return {string} The image description.
   */
  get imageDescription() {
    return this.#imageDescriptionFld.getValue().trim();
  }

  /**
   * Sets the image description.
   * @param imageDesc {string} The image description.
   */
  set imageDescription(imageDesc) {
    this.#imageDescriptionFld.setValue(imageDesc.trim());
  }

  /**
   * @return {string} The pronunciation.
   */
  get pronunciation() {
    return this.#pronunciationFld.getValue().trim();
  }

  /**
   * Sets the pronunciation.
   * @param pron {string} The pronunciation.
   */
  set pronunciation(pron) {
    this.#pronunciationFld.setValue(pron.trim());
  }

  /**
   * Returns the definition with the given number.
   * @param index {number} Definition’s index.
   * @return {Definition} A definition object.
   */
  getDefinition(index) {
    const definitionForm = this.#definitionFlds[index];
    const examples = [];
    for (let i = 0; i < definitionForm.examplesCount; i++) {
      examples.push(definitionForm.getExample(i));
    }
    return new Definition(definitionForm.getText(), examples);
  }

  /**
   * @return {number} The number of definitions.
   */
  get definitionsCount() {
    return this.#definitionFlds.length;
  }

  /**
   * Adds a definition form.
   */
  addDefinition() {
    const definitionForm = new DefinitionForm(this.definitionsCount + 1, this.selectedLanguage);
    this.#definitionFlds.push(definitionForm);
    this.#definitionsLayout.addItems([definitionForm], this.#definitionsLayout.items.length - 1);
    this.#removeDefinitionBtn.toggle(this.definitionsCount > 1);
  }

  /**
   * Removes a definition form.
   * @param index {number} The definition’s index.
   */
  removeDefinition(index) {
    const definitionForm = this.#definitionFlds[index];
    this.#definitionFlds.splice(index, 1);
    this.#definitionsLayout.removeItems([definitionForm]);
    this.#removeDefinitionBtn.toggle(this.definitionsCount > 1);
  }

  /**
   * @return {string[]} The categories.
   */
  get categories() {
    return this.#categoriesWidget.getValue();
  }

  /**
   * Sets the categories.
   * @param categories {string[]} The image categories.
   */
  set categories(categories) {
    this.#categoriesWidget.setValue(categories);
  }

  /**
   * @return {string} The etymology.
   */
  get etymology() {
    return this.#etymologyFld.getValue().trim();
  }

  /**
   * Sets the etymology.
   * @param etym {string} The etymology.
   */
  set etymology(etym) {
    this.#etymologyFld.setValue(etym.trim());
  }

  /**
   * @return {string} The pronunciation section.
   */
  get pronunciationSection() {
    return this.#pronunciationSectionFld.getValue().trim();
  }

  /**
   * Sets the pronunciation section content.
   * @param pronunciationSection {string} The pronunciation section content.
   */
  set pronunciationSection(pronunciationSection) {
    this.#pronunciationSectionFld.setValue(pronunciationSection.trim());
  }

  /**
   * @return {string} The homophones.
   */
  get homophones() {
    return this.#homophonesFld.getValue().trim();
  }

  /**
   * Sets the homophones.
   * @param homophones {string} The homophones.
   */
  set homophones(homophones) {
    this.#homophonesFld.setValue(homophones.trim());
  }

  /**
   * @return {string} The paronyms.
   */
  get paronyms() {
    return this.#paronymsFld.getValue().trim();
  }

  /**
   * Sets the paronyms.
   * @param paronyms {string} The paronyms.
   */
  set paronyms(paronyms) {
    this.#paronymsFld.setValue(paronyms.trim());
  }

  /**
   * @return {string} The references.
   */
  get references() {
    return this.#referencesFld.getValue().trim();
  }

  /**
   * Sets the references.
   * @param references {string} The references.
   */
  set references(references) {
    this.#referencesFld.setValue(references.trim());
  }

  /**
   * @return {string} The bibliography.
   */
  get bibliography() {
    return this.#bibliographyFld.getValue().trim();
  }

  /**
   * Sets the bibliography.
   * @param bibliography {string} The bibliography.
   */
  set bibliography(bibliography) {
    this.#bibliographyFld.setValue(bibliography.trim());
  }

  /**
   * Indicates whether the article is a draft.
   * @return {boolean} True if it is a draft.
   */
  get isDraft() {
    return this.#draftChk.isSelected();
  }

  /**
   * Sets whether the article is a draft.
   * @param draft {boolean} True if it is a draft.
   */
  set isDraft(draft) {
    this.#draftChk.setSelected(draft);
  }

  /**
   * @return {string} The sorting key.
   */
  get sortingKey() {
    return this.#sortKeyFld.getValue().trim();
  }

  /**
   * Defines the sorting key.
   * @param key {string} The sorting key.
   */
  set sortingKey(key) {
    this.#sortKeyFld.setValue(key.trim());
  }
}

module.exports = {
  interpolateString,
  Tab,
  DefinitionForm,
  ExampleForm,
  GUI,
  StartGUI,
  MainGUI,
};

// </nowiki>
