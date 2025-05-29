/**
 * Cet éditeur est une copie traduite de
 * https://sv.wiktionary.org/w/index.php?title=MediaWiki:Gadget-editor.js&oldid=1704366
 * de [[sv:User:Skalman]]
 * qui est elle-même est une adaptation de https://en.wiktionary.org/wiki/User:Conrad.Irwin/editor.js
 * de [[en:User:Conrad.Irwin]]
 *
 * [[Catégorie:JavaScript du Wiktionnaire|editor]]
 */

// Singleton editor
window.editor = (function () {
  /* global $, mw */

  if (mw.config.get('wgRevisionId') !== mw.config.get('wgCurRevisionId')) {
    return {};
  }

  // private variables and functions
  var ed = { enabled: true },
      api,
      elem,
      history,
      // Points at the action that has been carried out
      cursor;

  function update_disabled() {
    elem.find('.ed-undo').prop('disabled', cursor === 0);
    elem.find('.ed-redo').prop('disabled', cursor === history.length - 1);
    elem.find('.ed-save').prop('disabled', history[cursor].save !== 'yes');
  }

  function show() {
    elem.show();
    if (elem.hasClass('ed-highlight')) {
      setTimeout(function () {
        elem.removeClass('ed-highlight');
        if (!silentFailStorage.getItem('ed-noinfo')) {
          elem.find('.ed-info').show();
        }
      }, 500);
    }
  }

  // public methods
  ed.edit = edit;

  function edit(rev) {
    init();
    history.length = cursor + 1;
    if (!rev.save) {
      rev.save = 'yes';
    } else if (rev.save === 'ifprev') {
      rev.save = history[cursor].save;
    }
    history.push(rev);
    redo();
    show();
  }

  ed.undo = undo;

  function undo() {
    history[cursor].undo();
    cursor--;
    update_disabled();
  }

  ed.undo_all = undo_all;

  function undo_all() {
    while (cursor) {
      undo();
    }
    elem.hide();
  }

  ed.redo = redo;

  function redo() {
    history[cursor + 1].redo();
    cursor++;
    update_disabled();
  }

  ed.save = save;

  function save() {
    var wikitext = history[cursor].wikitext;

    // Allow callbacks to make last-minute modifications before saving
    for (var i = cursor; i; i--) {
      if (history[i].onsave) {
        wikitext = history[i].onsave(wikitext);
      }
    }

    elem.find('.ed-info').hide();
    var log = $('<div>', { 'class': 'ed-save' })
        .append(
            $('<small>', { text: summary() }),
            ' ',
            $('<b>', { text: 'Sauvegarde en cours…' })
        ).appendTo(elem.find('.ed-inner'));

    api.post({
      action: 'edit',
      title: mw.config.get('wgPageName'),
      text: wikitext,
      summary: summary(true),
      notminor: '',
      token: mw.user.tokens.get('csrfToken')
    }).done(function (data) {
      if (!data.edit || data.edit.result !== 'Success') {
        log.addClass('error').find('b').text('Impossible d’enregistrer');
        return;
      }

      $('.ed-added').removeClass('ed-added');

      history.length = 1;
      cursor = 0;
      log.find('b').text('Enregistré');
      log.append(
          ' ',
          $('<a>', {
            text: 'Voir les changements',
            href: mw.config.get('wgScript') +
                '?title=' + encodeURIComponent(mw.config.get('wgPageName')) +
                '&diff=' + data.edit.newrevid +
                '&oldid=' + data.edit.oldrevid
          })
      );
      history[0].wikitext = wikitext;
      update_disabled();
    }).fail(function (error) {
      log.find('b').addClass('error').text('Enregistrement impossible');
      return;
    });
  }

  ed.wikitext = wikitext;

  function wikitext() {
    return init() ||
        new $.Deferred()
            .resolve(history[cursor].wikitext)
            .promise();
  }

  ed.summary = summary;

  function summary(add_assisted) {
    var parts = {},
        // Au cas où on utilise l'éditeur pour autre chose que des traductions
        // On n'affichera 'Traductions :' que si seules les traductions ont été modifiées
        only_traductions = true;
    for (var i = 1; i <= cursor; i++) {
      var h = history[i];
      if (!h.summary) {
        only_traductions = false;
        continue;
      }
      if (h.summary_type) {
        if (!/gloss/.test(h.summary_type) && h.summary_type !== 'trad') {
          only_traductions = false;
        }
        if (parts[h.summary_type] === undefined) {
          parts[h.summary_type] = h.summary;
        } else {
          parts[h.summary_type] += ' ; ' + h.summary;
        }
      } else if (!parts._) {
        only_traductions = false;
        parts._ = h.summary;
      } else {
        parts._ += ' ; ' + h.summary;
      }
    }
    return (only_traductions ? 'Traductions : ' : '') +
        $.map(parts, function (x) {
          return x;
        }).join(' ; ') +
        (add_assisted ? ' (assisté)' : '');
  }

  ed.init = init;

  function init() {
    if (elem) {
      return;
    }
    // Warn before leaving the page if there are unsaved changes.
    $(window).on('beforeunload', function (e) {
      if (cursor)
        return 'Vous avez des modifications non enregistrées.';
    });
    history = [{
      redo: null,
      undo: null,
      wikitext: null,
      save: 'no'
    }];
    cursor = 0;

    // Expérimental : infobulle expliquant que plusieurs modifications sont possibles
    var infobulle = $('<div>', {
      'class': 'ed-info',
      html: 'Vous pouvez continuer d’ajouter des traductions. ' +
          'Quand vous aurez réalisé toutes les modifications désirées, merci d’enregistrer.' +
          '<span class="ed-info-leave">Ne plus afficher ce message</span>' +
          '<span class="ed-info-close">×</span>'
    });
    infobulle.find('.ed-info-close').click(function () {
      infobulle.fadeOut();
    });
    infobulle.find('.ed-info-leave').click(function () {
      silentFailStorage.setItem('ed-noinfo', 'true');
      infobulle.fadeOut();
    });

    elem = $('<div>', { 'class': 'ed-box ed-highlight' })
        .append(
            '<a class="ed-close" href="#">&times;</a>' +
            '<div class="ed-inner">' +
            '<button class="ed-save" accesskey="s">Enregistrer les modifications</button><br>' +
            '<button class="ed-undo">Annuler</button>' +
            '<button class="ed-redo" disabled>Rétablir</button>' +
            '</div>')
        .append(infobulle);
    elem.find('.ed-close').click(function (e) {
      undo_all();
      e.preventDefault();
    });
    elem.find('.ed-save').click(save);
    elem.find('.ed-undo').click(undo);
    elem.find('.ed-redo').click(redo);
    elem.appendTo('body');

    api = new mw.Api({ userAgent: "Gadget-editor" });
    return api.get({
      action: 'query',
      prop: 'revisions',
      titles: mw.config.get('wgPageName'),
      rvprop: 'content',
    }).then(function (data) {
      var wikitext = data.query.pages[mw.config.get('wgArticleId')].revisions[0]['*'];

      // Some scripts are strict, so remove trailing whitespace on non-empty lines
      wikitext = wikitext.replace(/(\S)[ \t]+(\n|$)/g, '$1$2');

      history[0].wikitext = wikitext;
      return wikitext;
    });
  }

  return ed;
})();
