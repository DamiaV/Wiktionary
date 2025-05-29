/**
 * Assistant pour l’ajout de traductions
 *
 * Adapté de la version suédoise du gadget
 * [[sv:MediaWiki:Gadget-translation editor.js]] (oldid=1687182) - auteur : [[sv:User:Skalman]]
 *
 * elle-même inspirée de la version anglaise
 * [[en:User:Conrad.Irwin/editor.js]]
 *
 * Auteur : [[fr:User:Automatik]] ([[Utilisateur:Automatik/translation editor.js/Adaptation]])
 *
 * [[Catégorie:JavaScript du Wiktionnaire|translation editor]]
 */

/* global jQuery, mediaWiki, editor, silentFailStorage, gadget_createTranslation */

console.log("Chargement de Gadget-translation editor.js…");

(function (mw, $) { // Closure (fermée à la toute fin du script)
  'use strict';

  var
      // Tableau de correspondance langue <-> code langue
      // que l’on va charger à la prise de focus sur un formulaire
      tab_langues,
      // Id récupéré par la fonction add_heading_updater() pour
      // typer correctement les résumés d'édition
      heading_id_counter = 0;

  if (editor.enabled) {
    $('div.translations')
        .each(function (i) {
          add_translation_form(this, i);
          add_heading_updater(this);
        });
    // Cache les liens d'ébauche traductions s'il y en a
    var $tradStub = $('.trad-stub');
    $tradStub.hide();
    $tradStub.parent('li').hide();
  }

// Ce qu'on appelle 'table' est en fait un 'div' sur fr.wikt
// mais peu importe (ça a l'apparence d'un tableau de valeurs)
  function get_translation_table_index(table) {
    return $.inArray(table, $('div.translations'));
  }

  function get_error_html(message) {
    return '<img src="//upload.wikimedia.org/wikipedia/commons/4/4e/MW-Icon-AlertMark.png" alt="Alerte"> ' + message;
  }

  function get_info_html(message) {
    return '<img src="//upload.wikimedia.org/wikipedia/commons/f/f8/Farm-Fresh_information.png" alt="Info"> ' + message;
  }

  function add_heading_updater(table) {
    var id = heading_id_counter++;

    var self = $(table).parent().parent('.NavContent').prev('.NavHead');

    var edit_head = $('<a>', {
      href: '#',
      text: '±',
      'class': 'ed-edit-head',
      title: 'Changer la description'
    }).prependTo(self);

    function remove_gloss_nodes() {
      var nodes = [];
      $.each(self[0].childNodes, function (i, node) {
        if (node.className !== 'ed-edit-head' && node.className !== 'NavToggle') {
          nodes.push(node);
        }
      });
      $(nodes).detach();
      return nodes;
    }

    var gloss_nodes;
    edit_head.click(function (e) {
      e.preventDefault();
      if (self.find('form').length) {
        self.find('form').remove();
        self.append(gloss_nodes);
        return;
      }

      edit_head.text('Chargement…');

      editor.wikitext()
          .then(function (wikitext) {
            edit_head.text('±');
            gloss_nodes = remove_gloss_nodes();
            var prev_gloss_nodes = gloss_nodes;

            var gloss = translation.get_gloss(wikitext, get_translation_table_index(table));
            var gloss_to_handle = gloss.standard ? gloss.text : gloss.trans_top;

            var form = $('<form>', {
              html:
                  '<label>Définition: <input name="gloss"></label>' +
                  '<button type="submit">Prévisualiser</button> ' +
                  '<span class="ed-loading">Chargement…</span>' +
                  '<span class="ed-errors"></span>'
            });

            function error(msg) {
              form.find('.ed-errors')
                  .html(get_error_html(msg));
            }

            self.append(form);

            form.find('input')
                .val(gloss_to_handle)
                .focus();
            form.click(function (e) {
              e.stopPropagation();
            }).submit(function (e) {
              e.preventDefault();
              // noinspection JSUnresolvedVariable
              if (this.gloss.value === gloss_to_handle) {
                error('La description n\'a pas changé');
                return;
              }
              // noinspection JSUnresolvedVariable
              var gloss_wikitext = $.trim(this.gloss.value);
              if (!translation.is_trans_top(gloss_wikitext) &&
                  translation.contains_wikitext(gloss_wikitext)) {
                error('La description n\'a pas un format correct : elle' +
                    ' contient du wikitexte ([]{}#|)' +
                    ' (alors que {{trad-début}} est absent)');
                return;
              }
              form.find('.ed-loading').show();

              $.when(
                  parse_wikitext(translation.make_trans_top(gloss_wikitext)),

                  // get wikitext again in case it has changed since last time
                  editor.wikitext()
              ).done(function (gloss_html, wikitext) {
                gloss_html = $(gloss_html);
                var prev_class = self.parent('.NavFrame').attr('class');
                var new_class = gloss_html.filter('.NavFrame').attr('class');

                gloss_html = gloss_html.find('.NavHead').contents();

                form.remove();
                wikitext = translation.set_gloss(
                    wikitext,
                    get_translation_table_index(table),
                    gloss_wikitext
                );
                editor.edit({
                  wikitext: wikitext,
                  summary: 'en-tête : "' + gloss_wikitext + '"',
                  summary_type: 'gloss' + id,
                  redo: function () {
                    remove_gloss_nodes();
                    $('<span>', {
                      'class': 'ed-added',
                      html: gloss_html
                    }).appendTo(self);
                    if (prev_class !== new_class) {
                      self.parent('.NavFrame').attr('class', new_class);
                    }
                  },
                  undo: function () {
                    remove_gloss_nodes();
                    self.append(prev_gloss_nodes);
                    if (prev_class !== new_class) {
                      self.parent('.NavFrame').attr('class', prev_class);
                    }
                  }
                });
              });
            });
          });
    });
  }

  function add_translation_form(table) {
    var
        self = $(table),
        nav_content = self.parent().parent();

    // s'il n'y a aucune traduction dans la boite, on rajoute le 'ul'
    // pour pouvoir y attacher le formulaire
    if (self.children().length === 0 ||
        self.children().first().prop('nodeName').toLowerCase() !== 'ul') {
      self.append($('<ul></ul>'));
    }

    // Options de langues
    var lang_meta = {
      '': '', // par défaut, ni genre ni nombre à cocher
      'aïnou (Japon)': 'trans',
      'allemand': 'm f n p',
      'arabe': 'm f d p trans',
      'arabe égyptien': 'm f d p trans',
      'arabe marocain': 'm f d p trans',
      'aragonais': 'm f p',
      'arménien': 'trans',
      'arménien ancien': 'trans',
      'asturien': 'm f n p',
      'bachkir': 'trans',
      'bengali': 'trans',
      'biélorusse': 'm f n p trans',
      'birman': 'trans',
      'breton': 'm f p',
      'bulgare': 'm f n p trans',
      'calabrais centro-méridional': 'm f mf p',
      'catalan': 'm f p',
      'chinois': 'trans tradi',
      'cilentain méridional': 'm f mf p',
      'copte': 'm f trans',
      'coréen': 'trans tradi',
      'corse': 'm f p',
      'danois': 'c n p',
      'dzongkha': 'trans',
      'erza': 'trans',
      'espagnol': 'm f p',
      'féroïen': 'm f n',
      'frioulan': 'm f p',
      'frison occidental': 'c n',
      'gallo-italique de Sicile': 'm f p mf',
      'géorgien': 'trans',
      'gaélique écossais': 'm f d p',
      'gaélique irlandais': 'm f p',
      'galicien': 'm f p',
      'gallois': 'm f p',
      'gotique': 'm f n p trans',
      'gujarati': 'm f n trans',
      'grec': 'trans m f n p',
      'grec ancien': 'trans m f n d p',
      'grec byzantin': 'trans',
      'hébreu': 'm f trans',
      'hébreu ancien': 'm f trans',
      'hindi': 'm f trans',
      'inuktitut': 'trans',
      'islandais': 'm f n p',
      'italien': 'm f mf p',
      'japonais': 'trans',
      'kazakh': 'trans',
      'khmer': 'trans',
      'kurde': 'm f',
      'laotien': 'trans',
      'latin': 'm f n p',
      'letton': 'm f p',
      'ligure': 'm f p',
      'lituanien': 'm f p',
      'lorrain': 'm f',
      'luxembourgeois': 'm f n p',
      'macédonien': 'm f n p trans',
      'malayalam': 'trans',
      'mandarin': 'trans tradi',
      'marathe': 'trans',
      'minnan': 'tradi',
      'mirandais': 'm f p',
      'mongol': 'trans',
      'néerlandais': 'm f n p',
      'népalais': 'trans',
      'norvégien (bokmål)': 'm f n p mfp',
      'norvégien (nynorsk)': 'm f n p mfp',
      'ossète': 'trans',
      'persan': 'trans',
      'piémontais': 'm f p',
      'plodarisch': 'm f n p',
      'polonais': 'm f n p',
      'portugais': 'm f p',
      'romanche': 'm f p',
      'roumain': 'm f n p',
      'russe': 'm f n trans',
      'salentin': 'm f mf p',
      'sanskrit': 'm f n d p trans',
      'sarde': 'm f p',
      'serbe': 'm f n p trans',
      'sherpa': 'trans',
      'sicilien': 'm f mf p',
      'slovaque': 'm f n',
      'slovène': 'm f n',
      'suédois': 'c n',
      'tamoul': 'trans',
      'tadjik': 'trans',
      'tatare': 'trans',
      'tchèque': 'm f n',
      'tchouvache': 'trans',
      'télougou': 'trans',
      'thaï': 'trans',
      'tibétain': 'trans',
      'ukrainien': 'm f n p trans',
      'vénitien': 'm f p',
      'vieil irlandais': 'm f n d p',
      'vieux norrois': 'm f n p',
      'vieux slave': 'm f n d p',
      'yiddish': 'm f n p trans',
    };

    // Les traductions dans ces langues peuvent contenir une majuscule
    // sans que cela ne produise d'erreur quand le titre de la page n'en a pas
    var expected_case = [
      'allemand',
      'alémanique alsacien',
      'vieux-francique',
      'francique mosellan',
      'francique rhénan',
      'francique ripuaire',
      'luxembourgeois'
    ];
    var options = $.map({
          gender: {
            m: 'masc.',
            f: 'fém.',
            mf: 'masc. & fém.',
            n: 'neutre',
            c: 'commun',
            s: 'singulier',
            d: 'duel',
            p: 'pluriel',
            mp: 'masc. plur.',
            fp: 'fém. plur.',
            np: 'neutre plur.',
            mfp: 'masc. & fém. plur.'
          }
        }, function (items, name) {
          items = $.map(items, function (text, value) {
            return '<label class="ed-' + value + '">' +
                '<input type="radio" name="' + name + '" value="' + value + '">' +
                text +
                '</label>';
          });
          return '<p class="ed-options ed-' + name + '">' + items.join(' ') + '</p>';
        }).join('') +
        '<p class="ed-options"><label class="ed-trans">Translittération : ' +
        '<input name="trans" placeholder="ex : khimera pour химера"></label></p>' +
        '<p class="ed-options"><label class="ed-tradi">Écriture traditionnelle : ' +
        '<input name="tradi" placeholder="ex : 軍團 pour 군단"></label></p>' +
        '<p class="ed-options"><label class="ed-pagename">Nom de page<span title="' +
        'Si la traduction ne correspond pas à un nom de page valide sur le ' +
        'Wiktionnaire, il est possible de préciser le nom de page à utiliser ici ' +
        '(le lien sur la traduction visera alors cette page)">(?)</span> : ' +
        '<input name="pagename" placeholder="ex : amo pour amō"></label></p>';

    var form = $($.parseHTML('<form>' +
        '<p><label><span class="txt-label">Ajouter une traduction en </span>' +
        '<input class="ed-lang-name" name="lang_name" size="13" title="' +
        'Nom de langue (anglais,…)" placeholder="langue à choisir"></label> : ' +
        '<input class="ed-word" name="word" size="20" title="traduction" placeholder="traduction"> ' +
        '<button type="submit">Ajouter</button> ' +
        '<a href="#" class="ed-more">Plus</a></p>' +
        options +
        '<p><span class="ed-feedback">Signaler une anomalie avec l’outil d’ajout de traduction – Suggérer une amélioration sur l’outil</span></p>' +
        '<div class="ed-errors"></div>' +
        '<div class="ed-info-msg"></div>' +
        '</form>'));

    // Make radio buttons deselectable
    form.find(':radio').click(function last_click() {
      if (last_click[this.name] === this) {
        last_click[this.name] = null;
        this.checked = false;
      } else {
        last_click[this.name] = this;
      }
    });

    var show_all_opts = false;
    form.find('.ed-lang-name')
        // remplacement - si nécessaire - du code langue en nom de langue
        .blur(remplace_code_langue)
        .blur(update_options_visibility)
        // If the item exists, the value will be used as the value,
        // otherwise it's 'null', which empties (the already empty)
        // text field.
        .val(silentFailStorage.getItem('trans-lang'));

    form.find('.ed-more').click(function (e) {
      e.preventDefault();
      show_all_opts = !show_all_opts;
      $(this).text(show_all_opts ? 'Moins' : 'Plus');
      update_options_visibility();
    });
    form.find('.ed-feedback').click(function () {
      mw.loader.using('mediawiki.feedback', function () {
        var mwTitle = new mw.Title('Discussion_MediaWiki:Gadget-translation_editor.js');
        var feedback = new mw.Feedback({
          title: mwTitle
        });
        feedback.launch({ subject: 'Traductions dans \"' + mw.config.get('wgPageName').replace(/_/g, ' ') + '\"' });
        // Afficher un placeholder pour le message
        var placeholder_feedback = 'Veuillez entrer votre message ici';
        var $textarea = $('.mw-feedbackDialog-feedback-form textarea');
        if ($textarea.length) {
          $textarea.get(0).placeholder = placeholder_feedback;
        }
        // Cacher le bouton "Signaler un bogue technique"
        $('.oo-ui-processDialog-actions-other').hide();
      });
    });
    update_options_visibility();

    function update_options_visibility() {
      var elems = form.find('.ed-options label');
      if (show_all_opts) {
        elems.show();
        form.find('.ed-feedback').show();

        // On affiche le champ pour l'écriture traditionnelle
        // uniquement en chinois et en coréen
        var lang_name = form.find('.ed-lang-name').val();
        if ($.inArray(lang_name, ['chinois', 'coréen']) === -1) {
          form.find('.ed-tradi').hide();
        }
      } else {
        var opts = lang_meta[form[0].lang_name.value] || lang_meta[''];
        elems
            .hide()
            .filter('.ed-' + opts.replace(/ /g, ', .ed-')).show();
        form.find('.ed-feedback').hide();
      }
    }

    // fonction pour déterminer si une chaine
    // correspond à un nom de langue dans le tableau
    function is_lang_name(str) {
      if (!tab_langues) {
        return undefined;
      }
      for (var code in tab_langues) {
        if (tab_langues[code] === str) {
          return true;
        }
      }
      return false;
    }

    // fonction de remplacement code langue -> nom de langue
    // lancée à la perte de focus du champ du code langue
    function remplace_code_langue() {
      var elem = form.find('.ed-lang-name');
      var val = elem.val();
      if (val === '') {
        elem.attr('title', 'Nom de langue (ex : anglais)');
        return;
      }
      // Si le nom de langue est donné avec une majuscule initiale, on l'enlève
      if (val.charAt(0).toLowerCase() !== val.charAt(0)) {
        val = val.charAt(0).toLowerCase() + val.substr(1);
        elem.val(val);
      }
      // Parfois, le code hu est utilisé pour le hongrois
      // (or c'est aussi un nom de langue et les noms de langue sont gardés comme tels)
      // On le remplace donc par hongrois (aucune traduction en hu n'a jamais été ajoutée via le gadget),
      // en prévenant l'utilisateur
      if (val === 'hu') {
        elem.val('hongrois');
        var msg = 'Il a été supposé que vous voulez ajouter une traduction en hongrois.<br>' +
            'Si vous vouliez en fait ajouter une traduction en hu, <span class="ed-info-case ed-click">cliquer ici</span>.';
        form.find('.ed-info-msg').html(get_info_html(msg));
        $('.ed-info-case').click(function () {
          elem.val('hu');
          form.find('.ed-info-msg').empty();
        });
        return;
      }
      if (is_lang_name(val)) {
        return;
      }
      if (tab_langues !== undefined && tab_langues.hasOwnProperty(val)) {
        elem.val(tab_langues[val]);
        return;
      }
      elem.attr('title', 'Nom de langue (ex : anglais)');
    }

    form.appendTo(nav_content);

    nav_content.find('input').focus(function () {
      editor.init();
      // On charge le tableau de correspondance langues <-> codes langue
      // si ce n'est pas déjà fait
      if (tab_langues === undefined) {
        var api = new mw.Api({ userAgent: "Gadget-translation editor" });
        return api.get({
          action: 'query',
          format: 'json',
          titles: 'MediaWiki:Gadget-wikt.core.languages.json',
          prop: 'revisions',
          rvprop: 'content',
          rvslots: 'main'
        }).then(function (data) {
          // Get the first (and only) page from data.query.pages
          // noinspection LoopStatementThatDoesntLoopJS
          for (var pageid in data.query.pages) {
            break;
          }
          // noinspection JSUnresolvedVariable
          const codes = JSON.parse(data.query.pages[pageid].revisions[0].slots.main['*']).codes;
          tab_langues = [];
          // On crée le tableau des noms de langues pour l'autocomplétion
          var tab_lang_names = [];
          for (const [code, data] of Object.entries(codes)) {
            tab_langues[code] = data.name;
            tab_lang_names.push(data.name);
          }

          // Autocomplétion du nom de langue
          mw.loader.using('jquery.ui', function () {
            $('.ed-lang-name').autocomplete({
              source: function (request, response) {
                // noinspection JSUnresolvedFunction,JSUnresolvedVariable
                var matcher = new RegExp(
                    $.ui.autocomplete.escapeRegex(request.term),
                    "i");
                response($.grep(tab_lang_names, function (item) {
                  return matcher.test(item);
                }));
              },
              minLength: 2
            });
          });
        });
      }
    });

    form.submit(function (e) {
      e.preventDefault();
      // On épure les valeurs afin d'enlever les éventuels espaces superflus
      // autour de la chaine (copiée-collée depuis un texte…)
      var lang_name = $.trim(this.lang_name.value);
      var word = $.trim(this.word.value);
      var gender = form.find('.ed-gender input:checked').prop('checked', false).val();
      var trans = $.trim(this.trans.value) !== $.trim(this.trans.getAttribute('placeholder')) ?
          $.trim(this.trans.value) : '';
      var tradi = $.trim(this.tradi.value) !== $.trim(this.tradi.getAttribute('placeholder')) ?
          $.trim(this.tradi.value) : '';
      var pagename = $.trim(this.pagename.value) !== $.trim(this.pagename.getAttribute('placeholder')) ?
          $.trim(this.pagename.value) : '';

      silentFailStorage.setItem('trans-lang', lang_name);

      var title = mw.config.get('wgTitle');

      if (!lang_name) {
        show_error(new NoInputError('lang-name'));
        return;
      } else if (!word) {
        show_error(new NoInputError('word'));
        return;
      }
          // Virgule ou point-virgule dans la traduction alors que le titre
      // n'en contient pas
      else if (word.indexOf(',') !== -1 &&
          title.indexOf(',') === -1 &&
          silentFailStorage.getItem('comma-knowledge') !== 'ok'
      ) {
        show_error(new CommaWordError('une virgule'));
        return;
      } else if (word.indexOf('،') !== -1 &&
          title.indexOf('،') === -1 &&
          silentFailStorage.getItem('comma-knowledge') !== 'ok'
      ) {
        show_error(new CommaWordError('une virgule'));
        return;
      } else if (word.indexOf(';') !== -1 &&
          title.indexOf(';') === -1 &&
          silentFailStorage.getItem('comma-knowledge') !== 'ok'
      ) {
        show_error(new CommaWordError('un point-virgule'));
        return;
      } else if (word.indexOf('/') !== -1 &&
          title.indexOf('/') === -1 &&
          silentFailStorage.getItem('comma-knowledge') !== 'ok'
      ) {
        show_error(new CommaWordError('une barre oblique'));
        return;
      } else if (word.charAt(0) !== word.charAt(0).toLowerCase() &&
          title.charAt(0) === title.charAt(0).toLowerCase() &&
          expected_case.indexOf(lang_name) === -1 &&
          silentFailStorage.getItem('case-knowledge') !== 'ok'
      ) {
        // noinspection JSCheckFunctionSignatures
        show_error(new CaseWordError());
        return;
      } else if (lang_name === 'français') {
        // noinspection JSCheckFunctionSignatures
        show_error(new BadLangNameError());
        return;
      } else if (translation.re_wikitext.test(word)) {
        // noinspection JSCheckFunctionSignatures
        show_error(new BadFormatError());
        return;
      }

      var word_options = {
        lang_name: lang_name,
        lang_code: null,
        word: word,
        exists: null,
        gender: gender,
        trans: trans,
        tradi: tradi,
        pagename: pagename
      };

      function show_error(e) {
        form.find('.ed-error').removeClass('ed-error');
        if (!e) {
          form.find('.ed-errors').empty();
          return;
        }
        if (e instanceof NoLangTplError) {
          form.find('.ed-lang-name').addClass('ed-error').focus();
          e = 'La langue « ' + e.lang_name + ' » n’est pas définie.';
        } else if (e instanceof NoInputError) {
          form.find('.ed-' + e.input).addClass('ed-error').focus();
          if (e.input === 'lang-name') {
            e = 'Entrez le nom de langue (anglais, suédois,…)';
          } else if (e.input === 'word') {
            e = 'Entrez la traduction';
          }
        } else if (e instanceof BadLangNameError) {
          form.find('.ed-lang-name').addClass('ed-error').focus();
          e = 'Il n\'est pas possible d\'ajouter une traduction en français. ' +
              'À la place, veuillez utiliser la section « Synonymes » ou ' +
              '« Variantes dialectales ».';
        } else if (e instanceof CommaWordError) {
          form.find('.ed-word').addClass('ed-error').focus();
          e = 'Êtes-vous certain que la traduction contient ' + e.message + ' ? ' +
              'Si tel n\'est pas le cas, <br />veuillez insérer les traductions une par une, ' +
              'en cliquant sur le bouton « Ajouter » après chaque insertion de traduction.<br />' +
              'Si vous êtes sûr de votre coup, veuillez <span class="ed-error-comma ed-click">cliquer ici</span>.';
        } else if (e instanceof CaseWordError) {
          form.find('.ed-word').addClass('ed-error').focus();
          e = 'Êtes-vous certain que la majuscule fait partie de la traduction ?<br />' +
              'Si tel n\'est pas le cas, merci de corriger cela.<br />' +
              'Sinon, veuillez <span class="ed-error-case ed-click">cliquer ici</span>.';
        } else if (e instanceof BadFormatError) {
          form.find('.ed-word').addClass('ed-error').focus();
          e = 'La traduction n’est pas dans un format correct : ' +
              'elle contient du wikitexte ([]{}|=)';
        } else if (e instanceof HttpError) {
          e = 'Vous ne pouvez pas charger la traduction. Êtes-vous en ligne ?';
        }
        form.find('.ed-errors').html(get_error_html(e));
        // En cas de virgule détectée
        $('.ed-error-comma')
            .click(function () {
              silentFailStorage.setItem('comma-knowledge', 'ok');
              form.find(':submit').click();
            });
        // En cas de majuscule détectée
        $('.ed-error-case')
            .click(function () {
              silentFailStorage.setItem('case-knowledge', 'ok');
              form.find(':submit').click();
            });
      }

      var lang_code;
      // on convertit le nom de langue en code
      if (tab_langues) {
        // Le tableau des langues contient-il le nom de langues donné ?
        for (var code in tab_langues) {
          if (tab_langues[code] === lang_name) {
            lang_code = code;
            break;
          }
        }
        // Si le nom de langue donné n'est pas répertorié
        // on regarde si ce n'est pas un code langue
        if (!lang_code) {
          if (tab_langues[lang_name]) {
            lang_code = lang_name;
            lang_name = tab_langues[lang_code];
            word_options.lang_name = lang_name;
          } else {
            show_error(new NoLangTplError(lang_name));
            return;
          }
        }
      } else {
        throw new Error('Le tableau des langues n’est pas défini.');
      }

      word_options.lang_code = lang_code;

      $.when(
          // word_html
          page_exists(lang_code, pagename ? pagename : word)
              .then(function (page_exists) {
                word_options.exists = page_exists;
                return parse_wikitext(translation.get_formatted_word(word_options))
                    .then(function (html) {
                      return html;
                    });
              }),
          // wikitext
          editor.wikitext()
      ).fail(function (error) {
        if (error === 'http') {
          // jQuery HTTP error
          // noinspection JSCheckFunctionSignatures
          show_error(new HttpError());
        } else {
          show_error(error);
        }
      }).done(function (word_html, wikitext) {
        show_error(false);
        form.find('.ed-info-msg').empty();

        silentFailStorage.setItem('trans-lang', lang_name);

        form[0].word.value = '';
        form[0].trans.value = '';
        form[0].tradi.value = '';
        form[0].pagename.value = '';

        var added_elem;
        var index = get_translation_table_index(table);

        wikitext = translation.add(wikitext, index, word_options);

        editor.edit({
          summary: '+' + lang_name + ' : [[' + (pagename ? pagename : word) + ']]',
          summary_type: 'trad',
          wikitext: wikitext,
          redo: function () {
            var translations = self.find('ul > li');
            translation.add_to_list({
              items: translations,
              add_only_item: function () {
                added_elem = $('<li>', {
                  html: '<span class="trad-' + lang_code +
                      '">' + lang_name.charAt(0).toUpperCase() + lang_name.substr(1) +
                      '</span> : ' + word_html
                });
                self.find('ul').prepend(added_elem);
              },
              equal_or_before: function (item) {
                var match = /^\s*(.+)/.exec($(item).children().first().text());
                if (match) {
                  // conventions internationales en premier
                  if (match[1] === 'Conventions internationales' &&
                      lang_name !== 'conventions internationales') {
                    return 'before';
                  }
                  if (lang_name === 'conventions internationales' &&
                      match[1] !== 'Conventions internationales') {
                    return false;
                  }
                  // on ignore les {{ébauche-trad}}
                  if (match[1] === 'Traductions manquantes.') {
                    return false;
                  }
                  if (sortkey(match[1].toLowerCase()) === sortkey(lang_name)) {
                    if ($(item).children('dl').length) { // si la langue
                      // a des dialectes à des niveaux différents
                      // (en wikicode, avec une ligne commençant par *:),
                      // l'ajout de langue n'est pas géré
                      mw.notify('Il n\'est pas possible d\'ajouter' +
                          ' une traduction dans cette langue,' +
                          ' car le format est inhabituel.');
                      throw new Error('Format incorrect : le wikicode' +
                          ' des traductions dans cette langue ' +
                          'est inhabituel et la traduction ne peut' +
                          ' donc pas être ajoutée par le gadget.');
                    }
                    return 'equal';
                  } else if (sortkey(match[1].toLowerCase()) < sortkey(lang_name)) {
                    return 'before';
                  }
                }
                return false;
              },
              add_to_item: function (item) {
                added_elem = $('<span>', { html: ', ' + word_html })
                    .appendTo(item);
              },
              add_after: function (item) {
                added_elem = $('<li>', {
                  html: '<span class="trad-' +
                      lang_code + '">' + lang_name.charAt(0).toUpperCase() +
                      lang_name.substr(1) + '</span> : ' + word_html
                })
                    .insertAfter(item);
              },
              add_before: function (item) {
                added_elem = $('<li>', {
                  html: '<span class="trad-' +
                      lang_code + '">' + lang_name.charAt(0).toUpperCase() +
                      lang_name.substr(1) + '</span> : ' + word_html
                });
                added_elem.insertBefore(item);
              },
            });
            added_elem.addClass('ed-added');
            // Si le gadget de création de traductions est activé,
            // on colore directement en bleu les traductions à créer
            // pour éviter d'avoir à recharger la page
            if (window.gadget_createTranslation) {
              // noinspection JSCheckFunctionSignatures
              window.gadget_createTranslation.init();
            }
          },
          undo: function () {
            added_elem.remove();
          }
        });
      });
    });
  }

  function parse_wikitext(wikitext) {
    return new mw.Api({ userAgent: "Gadget-translation editor" }).get({
      action: 'parse',
      text: '<div>' + wikitext + '</div>',
      title: mw.config.get('wgPageName')
    }).then(function (data) {
      var html = data.parse.text['*'];
      // Get only the parts between <div> and </div>
      html = html.substring(
          html.indexOf('<div>') + '<div>'.length,
          html.lastIndexOf('</div>')
      );
      return $.trim(html);
    });
  }

  function page_exists(lang_code, page) {
    var domain;
    var wm_liens = {
      'cmn': 'zh',
      'fra-nor': 'nrm',
      'gsw': 'als',
      'ko-Hani': 'ko',
      'lzh': 'zh-classical',
      'nan': 'zh-min-nan',
      'nb': 'no',
      'nn': 'no',
      'rup': 'roa-rup',
      'yue': 'zh-yue',
    };
    var wiktios = [
      'en', 'mg', 'fr', 'zh', 'lt', 'ru', 'es', 'el', 'pl', 'sv', 'ko',
      'nl', 'de', 'tr', 'ku', 'ta', 'io', 'kn', 'fi', 'vi', 'hu', 'pt',
      'chr', 'no', 'ml', 'my', 'id', 'it', 'li', 'ro', 'et', 'ja', 'te',
      'jv', 'fa', 'cs', 'ca', 'ar', 'eu', 'gl', 'lo', 'uk', 'br', 'fj',
      'eo', 'bg', 'hr', 'th', 'oc', 'is', 'vo', 'ps', 'zh-min-nan',
      'simple', 'cy', 'uz', 'scn', 'sr', 'af', 'ast', 'az', 'da', 'sw',
      'fy', 'tl', 'he', 'nn', 'wa', 'ur', 'la', 'sq', 'hy', 'sm', 'sl',
      'ka', 'pnb', 'nah', 'hi', 'tt', 'bs', 'lb', 'lv', 'tk', 'sk', 'hsb',
      'nds', 'kk', 'ky', 'be', 'km', 'mk', 'ga', 'wo', 'ms', 'ang', 'co',
      'sa', 'gn', 'mr', 'csb', 'ug', 'st', 'ia', 'sd', 'sh', 'si', 'mn',
      'tg', 'or', 'kl', 'vec', 'jbo', 'an', 'ln', 'fo', 'zu', 'gu', 'kw',
      'gv', 'rw', 'qu', 'ss', 'ie', 'mt', 'om', 'bn', 'pa', 'roa-rup',
      'iu', 'so', 'am', 'su', 'za', 'gd', 'mi', 'tpi', 'ne', 'yi', 'ti',
      'sg', 'na', 'dv', 'tn', 'ts', 'ha', 'ks', 'ay',
    ]
    var keepApos = [
      'fr', 'de',
    ];

    if (wm_liens.hasOwnProperty(lang_code)) {
      domain = wm_liens[lang_code] + '.wiktionary';
    } else if (lang_code === 'conv') {
      domain = 'species.wikimedia';
    } else if ($.inArray(lang_code, wiktios) !== -1) {
      domain = lang_code + '.wiktionary';
    }

    // Si le Wiktionnaire n'existe pas, inutile de faire une requête HTTP
    if (!domain) {
      return $.Deferred().resolve('trad').promise();
    }

    // traiter l'apostrophe typographique comme une apostrophe dactylographique
    // dans les liens interwikis, les autres wiktionnaires privilégiant la seconde
    if ($.inArray(lang_code, keepApos) === -1) {
      page = page.replace('’', "'");
      page = page.replace('ʼ', "'");
    }

    var def = $.Deferred();
    $.ajax({
      url: '//' + domain + '.org/w/api.php?origin=' + location.protocol + '//' + location.host,
      data: {
        action: 'query',
        titles: page,
        format: 'json'
      },
      dataType: 'json'
    }).fail(function () {
      def.resolve('trad');
    }).then(function (data) {
      def.resolve(data.query.pages[-1] ? 'trad-' : 'trad+');
    });
    return def.promise();
  }

// Ajout pour le Wiktionnaire francophone,
// adapté de [[MediaWiki:Gadget-CommonWikt.js]], fonction CleDeTri
  function sortkey(word) {
    var key = word.toLowerCase();
    key = key.replace(/[àáâãäå]/g, "a");
    key = key.replace(/[æ]/g, "ae");
    key = key.replace(/[çćċč]/g, "c");
    key = key.replace(/[ĉ]/g, "cx");
    key = key.replace(/[èéêë]/g, "e");
    key = key.replace(/[ĝ]/g, "gx");
    key = key.replace(/[ĥ]/g, "hx");
    key = key.replace(/[ìíîï]/g, "i");
    key = key.replace(/[ĵ]/g, "jx");
    key = key.replace(/[ñ]/g, "n");
    key = key.replace(/[òóôõö]/g, "o");
    key = key.replace(/[œ]/g, "oe");
    key = key.replace(/[òóôõö]/g, "o");
    key = key.replace(/[ŝ]/g, "sx");
    key = key.replace(/[ùúûü]/g, "u");
    key = key.replace(/[ŭ]/g, "ux");
    key = key.replace(/[ýÿ]/g, "y");
    key = key.replace(/['’)(]/g, "");
    key = key.replace(/[-\/]/g, " ");
    return key;
  }

  var translation = {
    re_wikitext: /[\[\]{}#|=]/,

    contains_wikitext: function (str) {
      return translation.re_wikitext.test(str);
    },

    re_gloss: /{{trad-début(.*)}}/g,

    re_section: /({{trad-début.*}})([\s\S]*?)({{trad-fin}})/g,

    is_trans_top: function (gloss) {
      return gloss.replace(translation.re_gloss, '-') === '-';
    },

    make_trans_top: function (gloss) {
      if (translation.is_trans_top(gloss)) {
        return gloss;
      } else {
        return '{{trad-début|' + gloss + '}}';
      }
    },

    get_gloss: function (wikitext, index) {
      // s'il y a un commentaire, l'analyse ne va pas être possible
      if (/{{trad-début\|.*?(?:<!--|-->)/.test(wikitext)) {
        mw.notify('Le wikitexte contient un commentaire "<!--". ' +
            'La page doit être modifiée manuellement.');
        throw new Error('Le wikitexte contient un commentaire "<!--". ' +
            'La page doit être modifiée manuellement.');
      }
      translation.re_gloss.lastIndex = 0;

      for (var i = 0; i <= index; i++) {
        var match = translation.re_gloss.exec(wikitext);
        if (i === index && match) {
          var standard = /^(|\|[^|=]*)$/.test(match[1]);
          return {
            trans_top: match[0],
            text: standard ? match[1].substr(1) : void 0,
            standard: standard
          };
        }
      }
      throw new Error('Le ' + (index + 1) + '-ème {{trad-début}} n’a pas été trouvé dans le wikitexte.');
    },
    set_gloss: function (wikitext, index, gloss) {
      index++;
      var count = 0;
      return wikitext.replace(translation.re_gloss, function (match) {
        count++;
        if (count !== index) {
          return match;
        }
        return translation.make_trans_top(gloss);
      });
    },
    get_formatted_word: function (opts) {
      var tpl = [
        opts.exists,
        opts.lang_code,
        opts.pagename ? opts.pagename : opts.word
      ];
      opts.gender && tpl.push(opts.gender);
      opts.trans && tpl.push('tr=' + opts.trans);
      opts.tradi && tpl.push('tradi=' + opts.tradi);
      opts.pagename && tpl.push('dif=' + opts.word);
      var res = '{{' + tpl.join('|') + '}}';
      opts.lang_code === 'conv' && (res = "''" + res + "''"); // Conventions internationales en italique
      return res;
    },
    // Options:
    // - items: Array of items
    // - equal_or_before: Function that returns either 'equal', 'before' or false
    // - add_to_item: Adds a word to an item
    // - add_after: Adds the item after an item
    // - add_before: Adds the item before an item
    add_to_list: function (opts) {
      var items = opts.items;
      if (!items.length) {
        items[0] = opts.add_only_item();
        return items;
      }
      for (var i = items.length - 1; i >= 0; i--) {
        var eq_or_bef = opts.equal_or_before(items[i]);
        if (eq_or_bef === 'equal') {
          items[i] = opts.add_to_item(items[i]);
          return items;
        } else if (eq_or_bef === 'before') {
          items[i] = opts.add_after(items[i]);
          return items;
        }
      }
      items[0] = opts.add_before(items[0]);
      return items;
    },
    add: function (wikitext, index, opts) {
      var match = wikitext.match(translation.re_section);
      if (match === null) {
        mw.notify('Il manque probablement un modèle {{trad-fin}} dans le wikicode.');
        throw new Error('Wikicode incorrect : la page doit être modifiée manuellement');
      }
      if (match[index].indexOf('<!--') !== -1) {
        mw.notify('Le wikitexte contient un commentaire "<!--". La page doit être' +
            ' modifiée manuellement.');
        throw new Error('Le wikitexte contient un commentaire "<!--". La page doit être' +
            ' modifiée manuellement.');
      }
      index++;
      var count = 0;
      return wikitext.replace(translation.re_section, function (match, p1, p2, p3) {
        count++;
        if (count !== index) {
          return match;
        }

        p2 = $.trim(p2);

        var formatted_word = translation.get_formatted_word(opts);

        var lines = translation.add_to_list({
          // split into lines
          items: p2 ? p2.split('\n') : [],
          add_only_item: function () {
            return '* {{T|' + opts.lang_code + '}} : ' + formatted_word;
          },
          equal_or_before: function (line) {
            // Le regex suivant contient [(:] car on peut avoir un dialecte
            // précisé entre parenthèses après le nom de langue
            var match_T = /^\*\s*{{T\|([^}|]+?)(?:\|trier)?}}\s*[(:]/.exec(line);
            // Il importe aussi de prendre en compte les cas rares comme les traductions en chinois
            // dans [[arrière-grand-mère]], qui sont indentées à la ligne via *: {{trad|...}}
            var match_trad_indente = /^\*:\s*{{trad[+-]{0,2}\|([^}|]+?)\|/.exec(line);
            if (match_T || match_trad_indente) {
              var match = match_T || match_trad_indente;
              var code_langue = match[1];
              // conventions internationales en premier
              if (code_langue === 'conv' && opts.lang_code !== 'conv') {
                return 'before';
              }
              if (opts.lang_code === 'conv' && code_langue !== 'conv') {
                return false;
              }
              // Le code langue contenu dans le modèle T est peut-être une redirection
              // vers un autre code, auquel cas on le remplace par cet autre code
              // On accède pour cela au champ "redirects" de la liste des langues
              // qui contient toutes les redirections de code langue (à la fin de la liste)
              if (tab_langues[code_langue] === undefined) {
                if (tab_langues.redirects[code_langue]) {
                  code_langue = tab_langues.redirects[code_langue];
                } else {
                  // sinon, c'est que le code est indéfini
                  return false;
                }
              }
              if (sortkey(tab_langues[code_langue]) === sortkey(opts.lang_name)) {
                // si une ligne de traduction finit brutalement par « : »
                // (et ne comporte donc que le nom de langue sans traduction à la suite),
                // c'est probablement qu'on a affaire à une langue
                // avec des dialectes qui seront introduits sur une
                // nouvelle ligne par « *: » → cas à gérer manuellement
                if (/^\*\s*{{T\|[^}|]+?(?:\|trier)?}}\s*:\s*$/.exec(line)) {
                  mw.notify('Il n\'est pas possible d\'ajouter une traduction' +
                      ' dans cette langue, car le format est inhabituel.');
                  throw new Error('Format incorrect : le wikicode des traductions' +
                      ' dans cette langue est inhabituel et la traduction' +
                      ' ne peut donc pas être ajoutée par le gadget.');
                }
                return 'equal';
              } else if (sortkey(tab_langues[code_langue]) < sortkey(opts.lang_name)) {
                return 'before';
              }
            }
            return false;
          },
          add_to_item: function (line) {
            return line + ', ' + formatted_word;
          },
          add_before: function (line) {
            return this.add_only_item() + '\n' + line;
          },
          add_after: function (line) {
            return line + '\n' + this.add_only_item();
          }
        });

        return p1 + '\n' + lines.join('\n') + '\n' + p3;
      });
    }
  };

  function extend_error(name, p1_name) {
    function E(p1) {
      this.message = p1;
      if (p1_name) {
        this[p1_name] = p1;
      }
    }

    E.prototype = new Error();
    E.prototype.constructor = E;
    E.prototype.name = name;
    return E;
  }

  var NoLangTplError = extend_error('NoLangTplError', 'lang_name');
  var NoInputError = extend_error('NoInputError', 'input');
  var BadLangNameError = extend_error('BadLangNameError');
  var CommaWordError = extend_error('CommaWordError');
  var CaseWordError = extend_error('CaseWordError');
  var BadFormatError = extend_error('BadFormatError');
  var HttpError = extend_error('HttpError');

// Export some useful components
  window.translation = translation;
  window.parse_wikitext = parse_wikitext;
  window.add_heading_updater = add_heading_updater;
  window.add_translation_form = add_translation_form;
}(mediaWiki, jQuery)); // Fin de la closure ouverte au tout début
