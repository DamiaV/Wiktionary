//Ajoute des boutons à la barre d'outils
(() => {
  if (!["edit", "submit"].includes(mw.config.get("wgAction"))) return;
  if (Number(mw.user.options.get("usebetatoolbar")) === 0) {
    alert("Vous devez utiliser la barre d'outil de modification aussi appelée " +
        "« éditeur de wikicode 2010 » pour profiter du gadget " +
        "« Ajouts à la nouvelle barre d’outils améliorée ». " +
        "Activez la dans vos préférences d'édition ou désactivez ce gadget.");
    return;
  }

  mw.loader.using('ext.wikiEditor', () => {
    $(() => {
      const $textBox = $('#wpTextbox1');

      //Boutons de formatage : poem et changement de casse
      $textBox.wikiEditor('addToToolbar', {
        section: 'advanced',
        group: 'format',
        tools: {
          'poem': {
            label: 'Poème',
            type: 'button',
            icon: '//upload.wikimedia.org/wikipedia/commons/thumb/d/dd/P_writing_icon.svg/23px-P_writing_icon.svg.png',
            action: {
              type: 'encapsulate',
              options: {
                pre: '<poem>',
                peri: 'Texte du poème',
                post: '</poem>',
                ownline: true
              }
            }
          },
          'toggleCase': {
            label: 'Modifier la casse',
            type: 'button',
            icon: '//upload.wikimedia.org/wikipedia/commons/thumb/d/de/Wynn.svg/23px-Wynn.svg.png',
            action: {
              type: 'callback',
              execute: function () {
                const context = $('a[rel="toggleCase"]').data('context');
                const selection = context.$textarea.textSelection('getSelection');
                if (!selection.collapsed) {
                  let str = selection.toString();
                  if (str === str.toUpperCase()) str = str.toLowerCase();
                  else str = str.toUpperCase();
                  context.$textarea.textSelection('encapsulateSelection', {
                    'pre': '',
                    'peri': str,
                    'post': '',
                    'replace': true
                  });
                }
              }
            }
          }
        }
      });

      //Boutons d’insertion : modèle et guillemets
      $textBox.wikiEditor('addToToolbar', {
        section: 'advanced',
        group: 'insert',
        tools: {
          'template': {
            label: 'Modèle à insérer',
            type: 'button',
            icon: '//upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Toolbar_Template_A.svg/22px-Toolbar_Template_A.svg.png',
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{',
                peri: 'Nom du modèle',
                post: '|}}'
              }
            }
          },
          'template2': {
            label: 'Texte à modéliser',
            type: 'button',
            icon: '//upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Toolbar_Template_B.svg/22px-Toolbar_Template_B.svg.png',
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{|',
                peri: 'Nom du modèle',
                post: '}}'
              }
            }
          },
          'quote': {
            label: 'Citation',
            type: 'button',
            icon: '//upload.wikimedia.org/wikipedia/commons/a/ac/Norwegian_quote_sign.png',
            action: {
              type: 'encapsulate',
              options: {
                pre: '« ',
                peri: 'Texte',
                post: ' »'
              }
            }
          }
        }
      });

      //Ajoute une section wikisource avec le contenu de l'editool
      const wsCharacters = [];
      $('.mw-edittools-section').eq(0).find('a').each(function () {
        const link = $(this);
        wsCharacters.push({
          label: link.text(),
          action: {
            type: 'encapsulate',
            options: {
              pre: link.data('mw-charinsert-start'),
              post: link.data('mw-charinsert-end')
            }
          }
        });
      });

      $textBox.wikiEditor('addToToolbar', {
        sections: {
          'wikisource': {
            type: 'booklet',
            label: 'Wikisource',
            pages: {
              'wiki': {
                layout: 'characters',
                label: 'Syntaxe wiki',
                characters: wsCharacters
              }
            }
          }
        }
      });

      //Ajoute un bouton index dans l'espace principal
      if (mw.config.get('wgNamespaceNumber') === 0) {
        $textBox.wikiEditor('addToToolbar', {
          section: 'advanced',
          group: 'insert',
          tools: {
            'pages': {
              label: 'Pages',
              type: 'button',
              icon: '//upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Nuvola_apps_icons.png/22px-Nuvola_apps_icons.png',
              action: {
                type: 'encapsulate',
                options: {
                  pre: '<pages index="',
                  peri: 'Nom du fac-similé',
                  post: '" from="" to="" header=1 />',
                  ownline: true
                }
              }
            }
          }
        });
      }

      /**
       * @type {HTMLAnchorElement}
       */
      const caseButton = document.querySelector("#wikiEditor-section-advanced a.tool-button[rel='toggleCase']");
      document.addEventListener("keydown", (e) => {
        switch (e.key.toLowerCase()) {
          case "m":
            if (e.ctrlKey && e.altKey) {
              e.preventDefault();
              if (caseButton) caseButton.click();
            }
        }
      });
    });
  });
})();
