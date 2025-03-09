//===========================================================================
// Ce script fait apparaître les mots de CSS bkl-link dans un cadre rouge
//===========================================================================
// [[Catégorie:JavaScript du Wiktionnaire|bkl-check.js]]

window.bklCheck = {
  cat: {
    'Catégorie:Pages à vérifier': {
      className: 'bkl-link bkl-link-inner',
      titleAppend: ' (vérifier)',
      htmlAppend: '<sup class="bkl-link-sup">vérifier</sup>'
    },
    'Catégorie:Pages à vérifier en français': {
      className: 'bkl-link bkl-link-inner',
      titleAppend: ' (vérifier)',
      htmlAppend: '<sup class="bkl-link-sup">vérifier</sup>'
    },
    'Catégorie:Wiktionnaire:Flexions à vérifier': {
      className: 'bkl-link bkl-link-inner',
      titleAppend: ' (vérifier)',
      htmlAppend: '<sup class="bkl-link-sup">vérifier</sup>'
    },
    'Catégorie:Pages à vérifier car créées automatiquement en français': {
      className: 'bkl-link bkl-link-inner',
      titleAppend: ' (vérifier)',
      htmlAppend: '<sup class="bkl-link-sup">vérifier</sup>'
    },
    'Catégorie:Wiktionnaire:Pages à créer': {
      className: 'bkl-link bkl-link-inner',
      titleAppend: ' (vérifier)',
      htmlAppend: '<sup class="bkl-link-sup">séparer</sup>'
    },
    'Catégorie:Pages à formater': {
      className: 'bkl-link bkl-link-inner',
      titleAppend: ' (formater)',
      htmlAppend: '<sup class="bkl-link-sup">formater</sup>'
    },
    'Catégorie:Pages proposées à la suppression': {
      className: 'bkl-link bkl-link-inner',
      titleAppend: ' (vérifier)',
      htmlAppend: '<sup class="bkl-link-sup">supprimer</sup>'
    },
    'Catégorie:Genres manquants en français': {
      className: 'bkl-link bkl-link-inner',
      titleAppend: ' (genre)',
      htmlAppend: '<sup class="bkl-link-sup">genre</sup>'
    },
    'Catégorie:Pluriels non précisés en français': {
      className: 'bkl-link bkl-link-inner',
      titleAppend: ' (pluriel)',
      htmlAppend: '<sup class="bkl-link-sup">pluriel</sup>'
    }
  },

  queryParamsView: {
    action: 'query',
    prop: 'categories',
    pageids: mw.config.get('wgArticleId'),
    generator: 'links',
    redirects: '',
    gpllimit: 'max',
    gplnamespace: 0,
    cllimit: 'max',
    indexpageids: '',
    requestid: mw.config.get('wgCurRevisionId') // Break client caching, when page has been edited
  },
  queryParamsPreview: {
    action: 'query',
    prop: 'categories',
    cllimit: 'max',
    redirects: '',
    indexpageids: ''
  },
  titles: {},
  count: 0,
  previewQueryCount: 0,

  execute: mw.loader.using("mediawiki.api", function () {
        if (window.bklCheckOnlyCheckMainNS && mw.config.get('wgNamespaceNumber') !== 0) return;
        var api = new mw.Api;
        // Use &clcategories to reduce needed queries
        var cats = [];
        for (var name in bklCheck.cat) if (bklCheck.cat[name].className)
          cats.push(name);
        bklCheck.queryParamsView.clcategories = cats.join('|');
        bklCheck.queryParamsPreview.clcategories = cats.join('|');
        var action = mw.config.get('wgAction');
        if (action === 'submit') bklCheck.doPreviewQueries(api);
        else if (action === 'view' || action === 'historysubmit' || action === 'purge')
          bklCheck.doQuery(api, bklCheck.viewResultArrived, bklCheck.queryParamsView);
        else { // "Show preview on first edit" enabled?
          var prev = document.getElementById('wikiPreview');
          if (prev && prev.firstChild) bklCheck.doQuery(api, bklCheck.viewResultArrived, bklCheck.queryParamsView);
        }
      }
  ),

  storeTitles: function (res) {
    if (!res || !res.query || !res.query.pageids) return;
    var q = res.query;
    var redirects = {};
    for (var i = 0; q.redirects && i < q.redirects.length; i++) {
      var r = q.redirects[i];
      if (!redirects[r.to]) redirects[r.to] = [];
      redirects[r.to].push(r.from);
    }
    for (var i = 0; i < q.pageids.length; i++) {
      var page = q.pages[q.pageids[i]];
      if (page.missing === '' || page.ns !== 0 || !page.categories) continue;
      for (var j = 0; j < page.categories.length; j++) {
        var cat = bklCheck.cat[page.categories[j].title];
        if (!cat) continue;
        bklCheck.count++;
        bklCheck.titles[page.title] = cat;
        if (!redirects[page.title]) break;
        for (var k = 0; k < redirects[page.title].length; k++)
          bklCheck.titles[redirects[page.title][k]] = cat;
        break;
      }
    }
  },

  markLinks: function () {
    if (!bklCheck.count) return;
    var links = bklCheck.getLinks('wikiPreview') || bklCheck.getLinks('bodyContent')
        || bklCheck.getLinks('mw_contentholder') || bklCheck.getLinks('article');
    if (!links) return;
    for (var i = 0; i < links.length; i++) {
      if (links[i].className === 'imageName' || links[i].className.indexOf('external') !== -1) continue; // Don't mess with images or external links!
      var title = links[i].title || (links[i].childNodes[0] && links[i].childNodes[0].nodeValue);
      if (title) title = title.charAt(0).toUpperCase() + title.slice(1); // make first character uppercase
      var cat = bklCheck.titles[title];
      if (!cat) continue;
      links[i].innerHTML = '<span class="' + cat.className + '" title="' +
          mw.html.escape(title + cat.titleAppend) + '">' + links[i].innerHTML + cat.htmlAppend + '</span>';
    }
  },

  viewResultArrived: function (api, res) {
    bklCheck.storeTitles(res);
    if (res && res['continue']) {
      bklCheck.doQuery(api, bklCheck.viewResultArrived, bklCheck.queryParamsView, res['continue']);
    }
    else bklCheck.markLinks();
  },

  PreviewQuery: function (api, titles) {
    bklCheck.previewQueryCount++;
    //We have to keep the titles in memory in case we get a query-continue
    bklCheck.queryParamsPreview.titles = titles.join('|');
    this.doQuery(api, bklCheck.resultArrived, bklCheck.queryParamsPreview);
  },

  doPreviewQueries: function (api) {
    var links = bklCheck.getLinks('wikiPreview');
    if (!links) return;
    var titles = [];
    var m;
    var unique = {};
    var siteRegex = new RegExp(mw.RegExp.escape(mw.config.get('wgServer')) + mw.RegExp.escape(mw.config.get('wgArticlePath').replace(/\$1/, '')) + '([^#]*)');
    //We only care for main ns pages, so we can filter out the most common cases to save some requests
    var namespaceRegex = /^((Benutzer|Wikipedia|Datei|MediaWiki|Vorlage|Hilfe|Kategorie|Portal)(_Diskussion)?|Spe[cz]ial|Diskussion):/i;
    for (var i = 0; i < links.length; i++) {
      if (!(m = links[i].href.match(siteRegex))
          || m[1].match(namespaceRegex) || unique[m[1]]) continue;
      unique[m[1]] = true; // Avoid requesting same title multiple times
      titles.push(decodeURIComponent(m[1].replace(/_/g, '%20'))); // Avoid normalization of titles
      if (titles.length < 50) continue;
      bklCheck.PreviewQuery(api, titles);
      titles = [];
    }
    if (titles.length) bklCheck.PreviewQuery(api, titles);
  },

  getLinks: function (id) {
    var el = document.getElementById(id);
    return el && el.getElementsByTagName('a');
  }
};

bklCheck.doQuery = function (api, callback, queryParams, continueParams) {
  api.get(
      $.extend({}, queryParams, continueParams || {'continue': ''})
  ).then(function (data) {
    callback(api, data);
  }).fail(function (code, data) {
    var extraText;
    if (code === 'http' && data) {
      extraText = (data.xhr && data.xhr.status ? '[' + data.xhr.status + ']' : '')
          + (data.textStatus ? '' + data.textStatus + (data.exception ? ': ' : '') : '')
          + (data.exception ? '' + data.exception : '');
    }
    else {
      extraText = code + (data && data.error && data.error.info ? ': ' + data.error.info : '');
    }
    mw.notify(
        'BKL-Check: Fehler beim Ermitteln der Begriffsklärungen' +
        ' (' + extraText + ')',
        {tag: 'bklCheck-error'}
    );
  });
};

bklCheck.resultArrived = function (api, res) {
  bklCheck.storeTitles(res);
  if (res && res['continue']) {
    this.doQuery(api, bklCheck.resultArrived, bklCheck.queryParamsPreview, res['continue']);
  }
  else bklCheck.previewQueryCount--;
  if (!bklCheck.previewQueryCount) bklCheck.markLinks();
};

if (mw.config.get('wgNamespaceNumber') >= 0) $(bklCheck.execute);
