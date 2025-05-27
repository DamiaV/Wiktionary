/**
 * (fr)
 * Ce gadget ajoute de nouveaux boutons à la barre d’outils.
 * Page d’aide : [[Aide:Gadget-Barre de luxe]]
 * Icones (OOUI): https://commons.wikimedia.org/wiki/OOUI_icons
 * Icones (Monobook): http://commons.wikimedia.org/wiki/Category:MediaWiki_edit_toolbar
 * ----
 * (en)
 * This gadget adds new buttons for the edit toolbar.
 * Help page: [[Aide:Gadget-Barre de luxe]] (fr)
 * Icons (OOUI): https://commons.wikimedia.org/wiki/OOUI_icons
 * Icons (Monobook): http://commons.wikimedia.org/wiki/Category:MediaWiki_edit_toolbar
 * ----
 * [[Catégorie:JavaScript du Wiktionnaire|Barre de luxe.js]]
 * <nowiki>
 */
"use strict";

const {
  getEditBox,
  getSelectedLineNumbers,
  selectLines,
  getSelectedText,
  replaceSelectedText,
} = require("./wikt.core.edit.js");

$(() => {
  console.log("Chargement de Gadget-Barre_de_luxe.js…");

  class GadgetBarreDeLuxe {
    /**
     * Additional 2010 toolbar groups.
     * @type {{id: string, label: string}[]}
     */
    groups = [
      { id: "misc_templates", label: "Modèles" },
      { id: "links", label: "Liens" },
      { id: "section_templates", label: "Patrons" },
      { id: "messages", label: "Messages" },
      { id: "headers", label: "Bandeaux" },
      { id: "html_tags", label: "Balises" },
      { id: "default", label: "" },
    ];

    sectionId = "advanced";

    defaultButtons = [
      {
        tagOpen: "’",
        imageFileName: "5/57/Apostrophe.png",
        imageFileNameOOUI: "8/88/Upper_single_apostrophe_toolbar_symbol.png",
        tooltip: "Apostrophe typographique",
        buttonId: "apos",
        group: "format",
      },
      {
        tagOpen: "\u00a0",
        imageFileName: "5/55/Button_nbsp_1.png",
        tooltip: "Espace insécable",
        buttonId: "nbsp",
        group: "format",
      },
      {
        tagOpen: "«\u00a0",
        tagClose: "\u00a0»",
        imageFileName: "2/26/Button_latinas.png",
        imageFileNameOOUI: "a/ac/Norwegian_quote_sign.png",
        tooltip: "Guillemets français",
        buttonId: "fr-quotes",
        group: "format",
      },
      {
        tagOpen: "#REDIRECT[[",
        tagClose: "]]",
        imageFileName: "4/47/Button_redir.png",
        tooltip: "Redirection",
        buttonId: "redirect",
        toolbarIgnore: true,
      },
      {
        tagOpen: "{{w|",
        tagClose: "}}",
        imageFileName: "c/cb/Button_wikipedia.png",
        imageFileNameOOUI: "thumb/1/14/OOjs_UI_icon_logo-wikipedia.svg/24px-OOjs_UI_icon_logo-wikipedia.svg.png",
        tooltip: "Lien vers Wikipédia",
        buttonId: "link-wp",
        group: "links",
      },
      {
        tagOpen: "{{subst:" + "Merci IP|",
        tagClose: "}}~~" + "~~",
        imageFileName: "1/12/Button_accueilA.png",
        imageFileNameOOUI: "thumb/b/bf/Twemoji12_1f603.svg/24px-Twemoji12_1f603.svg.png",
        tooltip: "Merci IP",
        buttonId: "thanks-ip",
        group: "messages",
      },
      {
        tagOpen: "{{subst:" + "Bienvenue}}~~" + "~~",
        imageFileName: "e/eb/Button_accueilB.png",
        imageFileNameOOUI: "thumb/a/aa/Twemoji12_1f642.svg/24px-Twemoji12_1f642.svg.png",
        tooltip: "Bienvenue",
        buttonId: "welcome",
        group: "messages",
      },
      {
        tagOpen: "{{subst:" + "Débutant}}~~" + "~~",
        imageFileName: "a/a7/Button_smiley3.png",
        imageFileNameOOUI: "thumb/d/db/OOjs_UI_icon_error.svg/24px-OOjs_UI_icon_error.svg.png",
        tooltip: "Débutant",
        buttonId: "beginner",
        group: "messages",
      },
      {
        tagOpen: "{{subst:" + "Vandale}}~~" + "~~",
        imageFileName: "3/3b/Button_crocs.png",
        imageFileNameOOUI: "thumb/c/ca/OOjs_UI_icon_error-progressive.svg/24px-OOjs_UI_icon_error-progressive.svg.png",
        tooltip: "Vandale",
        buttonId: "vandal",
        group: "messages",
      },
      {
        tagOpen: "{{subst:" + "Vandale2}}~~" + "~~",
        imageFileName: "e/ec/Button_aviso.png",
        imageFileNameOOUI: "thumb/4/4e/OOjs_UI_icon_error-destructive.svg/24px-OOjs_UI_icon_error-destructive.svg.png",
        tooltip: "Vandale 2",
        buttonId: "vandal2",
        group: "messages",
      },
      {
        tagOpen: "{{subst:" + "Bloqué|2 ",
        tagClose: "h|Vandalisme}}~~" + "~~",
        imageFileName: "3/3f/Button_attendre.png",
        imageFileNameOOUI: "thumb/5/53/OOjs_UI_icon_cancel-destructive.svg/24px-OOjs_UI_icon_cancel-destructive.svg.png",
        tooltip: "Bloqué",
        buttonId: "vandal3",
        group: "messages",
      },
      {
        tagOpen: "{{subst:" + "Spam}}~~" + "~~",
        imageFileName: "6/6d/Button_exclamation_1.png",
        imageFileNameOOUI: "thumb/3/3b/OOjs_UI_icon_alert-warning.svg/24px-OOjs_UI_icon_alert-warning.svg.png",
        tooltip: "Spam",
        buttonId: "spam",
        group: "messages",
      },
      {
        tagOpen: "{{subst:" + "Spam2}}~~" + "~~",
        imageFileName: "3/33/Button_exclamation.png",
        imageFileNameOOUI: "thumb/f/f6/OOjs_UI_icon_alert-destructive.svg/24px-OOjs_UI_icon_alert-destructive.svg.png",
        tooltip: "Spam 2",
        buttonId: "spam2",
        group: "messages",
      },
      {
        tagOpen: "{{subst:" + "Copyvio}}~~" + "~~",
        imageFileName: "c/c9/Button_copy_vio.png",
        imageFileNameOOUI: "thumb/7/7e/Orange_copyright.svg/24px-Orange_copyright.svg.png",
        tooltip: "Copyvio",
        buttonId: "copyvio",
        group: "messages",
      },
      {
        tagOpen: "{{subst:" + "Copyvio2}}~~" + "~~",
        imageFileName: "7/72/Button_copy_vio_plagio.png",
        imageFileNameOOUI: "thumb/1/1d/Red_copyright.svg/24px-Red_copyright.svg.png",
        tooltip: "Copyvio 2",
        buttonId: "copyvio2",
        group: "messages",
      },
      {
        tagOpen: "{{supp|",
        tagClose: "}}",
        imageFileName: "f/f3/Button_broom2.png",
        imageFileNameOOUI: "thumb/d/de/OOjs_UI_icon_trash-destructive.svg/24px-OOjs_UI_icon_trash-destructive.svg.png",
        tooltip: "Suppression rapide",
        buttonId: "delete",
        group: "headers",
      },
      {
        tagOpen: "{{subst:" + "suppression à débattre|",
        tagClose: "}}~~" + "~~",
        imageFileName: "9/9f/Button_broom3.png",
        imageFileNameOOUI: "thumb/3/3f/OOjs_UI_icon_trash.svg/24px-OOjs_UI_icon_trash.svg.png",
        tooltip: "Proposition de suppression",
        buttonId: "delete-proposition",
        group: "headers",
      },
      {
        tagOpen: "== {{langue|fr}} ==\n=== {{S|étymologie}} ===\n{{ébauche-étym|fr}}\n:",
        tagClose: " {{date|?|lang=fr}}/{{siècle|?|lang=fr}}\n=== {{S|nom|fr}} ===\n{{fr-rég|}}\n'''{{subst:" + "PAGENAME}}''' {{pron||fr}} {{genre ?}}\n#\n#* ''''\n==== {{S|variantes orthographiques}} ====\n==== {{S|synonymes}} ====\n==== {{S|antonymes}} ====\n==== {{S|dérivés}} ====\n==== {{S|apparentés}} ====\n==== {{S|vocabulaire}} ====\n==== {{S|hyperonymes}} ====\n==== {{S|hyponymes}} ====\n==== {{S|méronymes}} ====\n==== {{S|holonymes}} ====\n==== {{S|traductions}} ====\n{{trad-début}}\n{{trad-fin}}\n=== {{S|prononciation}} ===\n* {{pron||fr}}\n* {{écouter|<!--  précisez svp la ville ou la région -->||audio=|lang=}}\n==== {{S|homophones|fr}} ====\n==== {{S|paronymes}} ====\n=== {{S|anagrammes}} ===\n=== {{S|voir aussi}} ===\n* {{WP}}\n=== {{S|références}} ===\n{{clé de tri}}",
        imageFileName: "3/32/Button_anular_voto.png",
        imageFileNameOOUI: "thumb/8/81/OOjs_UI_icon_stripeFlow-ltr.svg/24px-OOjs_UI_icon_stripeFlow-ltr.svg.png",
        tooltip: "Patron long",
        buttonId: "long-template",
        group: "section_templates",
      },
      {
        tagOpen: "== {{langue|fr}} ==\n=== {{S|étymologie}} ===\n{{ébauche-étym" + "\|fr}}\n\n=== {{S|nom|fr}} ===\n{{fr-rég\|}}\n\'\'\'{{subst:" + "PAGENAME}}\'\'\' {{m}}\n# ",
        tagClose: "\n\n==== {{S|traductions}} ====\n{{trad-début}}\n* {{T|en}}\u00a0: {{trad|en|}}\n{{trad-fin}}\n\n=== {{S|voir aussi}} ===\n* {{WP}}",
        imageFileName: "a/a7/Francefilm.png",
        imageFileNameOOUI: "thumb/7/71/OOjs_UI_icon_stripeSummary-ltr.svg/24px-OOjs_UI_icon_stripeSummary-ltr.svg.png",
        tooltip: "Patron court",
        buttonId: "short-template",
        group: "section_templates",
      },
      {
        tagOpen: "=== {{S|références}} ===\n==== {{S|sources}} ====\n{{Références}}\n\n==== {{S|bibliographie}} ====\n",
        imageFileName: "6/64/Buttonrefvs8.png",
        imageFileNameOOUI: "thumb/9/9c/OOjs_UI_icon_reference.svg/24px-OOjs_UI_icon_reference.svg.png",
        tooltip: "Références",
        buttonId: "references",
        group: "section_templates",
      },
      {
        tagOpen: "{{source| {{ouvrage| url= | titre= | prénom1= | nom1= | éditeur= | année= }} }}",
        imageFileName: "e/ef/Button_cite_book.png",
        imageFileNameOOUI: "thumb/5/5b/OOjs_UI_icon_quotesAdd-ltr.svg/24px-OOjs_UI_icon_quotesAdd-ltr.svg.png",
        tooltip: "Source d’exemple",
        buttonId: "source",
        group: "insert",
      },
      {
        tagOpen: "{{Autres projets\n|w=",
        tagClose: "\n|b=\n|v=\n|n=\n|s=\n|q=\n|commons=\n|wikispecies=\n|m=\n}}",
        imageFileName: "4/4c/Button_interprojet.png",
        imageFileNameOOUI: "thumb/4/40/Network_sans.svg/24px-Network_sans.svg.png",
        tooltip: "Autres projets",
        buttonId: "other-projects",
        group: "links",
      },
      {
        action: (selectedText, language) => `{{refnec|${selectedText}|lang=${language}}}`,
        promptText: "Langue",
        promptDefault: "fr",
        imageFileName: "0/0b/Button_fuente.png",
        imageFileNameOOUI: "thumb/6/69/OOjs_UI_icon_help.svg/24px-OOjs_UI_icon_help.svg.png",
        tooltip: "Référence nécessaire",
        buttonId: "refnec",
        group: "misc_templates",
      },
      {
        action: (selectedText, language) => `{{?|${selectedText}|lang=${language}}}`,
        promptText: "Langue",
        promptDefault: "fr",
        imageFileName: "8/89/Button_nosense.png",
        imageFileNameOOUI: "thumb/b/b2/OOjs_UI_icon_help-ltr.svg/24px-OOjs_UI_icon_help-ltr.svg.png",
        tooltip: "À vérifier",
        buttonId: "to-check",
        group: "misc_templates",
      },
      {
        action: selectedText => selectedText.toUpperCase(),
        imageFileName: "1/12/Button_case.png",
        imageFileNameOOUI: "thumb/3/32/Icon_-_To_upper_case.svg/24px-Icon_-_To_upper_case.svg.png",
        tooltip: "Majuscules",
        buttonId: "uppercase",
        group: "size",
      },
      {
        action: selectedText => selectedText.toLowerCase(),
        imageFileName: "7/7a/Button_case_swapped.png",
        imageFileNameOOUI: "thumb/e/ee/Icon_-_To_lower_case.svg/24px-Icon_-_To_lower_case.svg.png",
        tooltip: "Minuscules",
        buttonId: "lowercase",
        group: "size",
      },
      {
        action: selectedText => {
          const lines = selectedText.split("\n");
          lines.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
          return lines.join("\n");
        },
        wholeLines: true,
        imageFileName: "2/2b/Button_arrow_down.PNG",
        imageFileNameOOUI: "thumb/0/0c/OOjs_UI_icon_downTriangle.svg/20px-OOjs_UI_icon_downTriangle.svg.png",
        tooltip: "Tri croissant",
        buttonId: "asc-sort",
        group: "format",
      },
      {
        action: selectedText => {
          const lines = selectedText.split("\n");
          lines.sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()));
          return lines.join("\n");
        },
        wholeLines: true,
        imageFileName: "6/6f/Button_arrow_up.PNG",
        imageFileNameOOUI: "thumb/c/ca/OOjs_UI_icon_upTriangle.svg/20px-OOjs_UI_icon_upTriangle.svg.png",
        tooltip: "Tri décroissant",
        buttonId: "desc-sort",
        group: "format",
      },
      {
        action: (selectedText, language) => {
          const regex = /\[\[([^\[\]|#]+)(?:#([^\[\]|]*))?(?:\|([^\[\]]*))?]]/g;
          language = language.trim();
          return selectedText.replaceAll(regex, (match, title, anchor, text) => {
            if (!anchor) anchor = language;
            if (text && text !== title) return `{{lien|${title}|${anchor}|dif=${text}}}`;
            return `{{lien|${title}|${anchor}}}`;
          });
        },
        promptText: "Langue",
        promptDefault: "",
        imageFileName: "8/8d/Btn_toolbar_link_simplify.png",
        imageFileNameOOUI: "thumb/9/90/VisualEditor_icon_page-redirect-ltr.svg/24px-VisualEditor_icon_page-redirect-ltr.svg.png",
        tooltip: "Remplacer les liens",
        buttonId: "replace-links",
        group: "links",
      },
    ];

    /**
     * Creates the Deluxe bar with the default buttons if the edit toolbar is disabled,
     * or adds the default buttons to the edit toolbar if enabled.
     */
    constructor() {
      // 2010 edit toolbar
      if (mw.user.options.get("usebetatoolbar")) {
        $.when(
            mw.loader.using("ext.wikiEditor")
        ).then(() => {
          const groups = {};
          for (const group of this.groups) {
            groups[group.id] = {
              label: group.label,
            };
          }
          getEditBox().wikiEditor("addToToolbar", {
            section: this.sectionId,
            groups: groups,
          });
        });
      }
      console.log(`Found ${this.defaultButtons.length} default buttons.`);
      // noinspection JSCheckFunctionSignatures
      this.addButtons(this.defaultButtons);
    }

    /**
     * Adds the given list of buttons to the toolbar or Deluxe bar.
     * @param buttons {string[][]|Record<string,string|boolean>[]} The buttons.
     */
    addButtons(buttons) {
      /**
       * Converts legacy array format to current object format.
       * @param arrayButton The button as an array.
       * @return {Object} The button object.
       */
      function toObject(arrayButton) {
        return {
          tagOpen: arrayButton[0],
          tagClose: arrayButton[1],
          imageFileName: arrayButton[2],
          tooltip: arrayButton[3],
          buttonId: arrayButton[4],
        };
      }

      // 2010 edit toolbar
      if (mw.user.options.get("usebetatoolbar")) {
        $.when(
            mw.loader.using("ext.wikiEditor")
        ).then(() => {
          buttons.forEach(button => {
            const buttonObject = {};
            // Array button definition is still maintained for legacy purposes
            const b = GadgetBarreDeLuxe.#getButtonObject(Array.isArray(button) ? toObject(button) : button);
            if (b.toolbarIgnore) return;

            let action;
            if (b.onClick) {
              action = {
                type: "callback",
                execute: b.onClick,
              };
            } else {
              action = {
                type: "encapsulate",
                options: {
                  pre: b.tagOpen,
                  post: b.tagClose,
                },
              };
            }

            buttonObject[b.imageId] = {
              label: b.speedTip,
              type: "button",
              icon: b.imageFileOOUI || b.imageFile,
              action: action,
            };

            getEditBox().wikiEditor("addToToolbar", {
              section: this.sectionId,
              group: b.group,
              tools: buttonObject,
            });
          });
        });
      } else { // MW toolbar
        buttons.forEach(button =>
            mw.toolbar.addButton(GadgetBarreDeLuxe.#getButtonObject(Array.isArray(button) ? toObject(button) : button)));
      }
    }

    /**
     * Returns a standard button object.
     * @param button The button definition object.
     * @return {Object} The full button object.
     */
    static #getButtonObject(button) {
      const b = {
        imageFile: GadgetBarreDeLuxe.#getFileName(button.imageFileName),
        imageId: "mw-editbutton-" + button.buttonId,
        speedTip: button.tooltip,
        toolbarIgnore: button.toolbarIgnore,
        group: button.group || "default",
      };

      if (button.imageFileNameOOUI)
        b.imageFileOOUI = GadgetBarreDeLuxe.#getFileName(button.imageFileNameOOUI);
      if (button.action) {
        b.onClick = () => {
          // Change selection to full lines if button requires
          if (button.wholeLines) {
            const [start, end] = getSelectedLineNumbers();
            selectLines(start, end);
          }

          const selectedText = getSelectedText();
          if (button.promptText) {
            // Prompt returns null only if the user cancels the dialog
            const inputText = prompt(button.promptText, button.promptDefault).trim();
            if (inputText !== null)
              replaceSelectedText(button.action(selectedText, inputText));
          } else replaceSelectedText(button.action(selectedText));
        };
      } else {
        b.tagOpen = button.tagOpen;
        b.tagClose = button.tagClose || "";
      }

      return b;
    }

    /**
     * Returns the full URL to the given button sub-URL.
     * If the sub-URL doesn’t feature an extension, .png is used.
     * @param urlEnd {string} The end of the URL.
     * @return {string} The full URL.
     */
    static #getFileName(urlEnd) {
      let fullUrl = `//upload.wikimedia.org/wikipedia/commons/${urlEnd}`;
      if (!/\.\w+$/.test(fullUrl)) fullUrl += ".png";
      return fullUrl;
    }
  }

  const bdl = new GadgetBarreDeLuxe();
  // Variable 'bdl_buttons' should be declared in user page.
  if (Array.isArray(window.bdl_buttons)) {
    console.log(`Found ${window.bdl_buttons.length} custom user button(s).`);
    bdl.addButtons(window.bdl_buttons);
  }
});
// </nowiki>
