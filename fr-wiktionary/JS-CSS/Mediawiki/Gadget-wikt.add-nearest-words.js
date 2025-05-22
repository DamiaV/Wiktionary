(() => {
  console.log("Chargement de Gadget-wikt.add-nearest-words.js…");
  const api = new mw.Api({userAgent: "Gadget-wikt.add-nearest-words.js"});

  function createCurrentNode(title) {
    return $(`<bdi><i><b>${title}</b></i></bdi>`);
  }

  function createWikiLink(title, languageCode) {
    return $(`<a rel="mw:WikiLink" href="//fr.wiktionary.org/wiki/${title}#${languageCode}" title="${title}"><i>${title}</i></a>`);
  }

  function fetchNearWords(category, limit, word) {
    const commonParams = {
      action: 'query',
      list: 'categorymembers',
      cmtitle: 'Category:' + category,
      cmlimit: limit,
      cmprop: 'title',
      cmstartsortkeyprefix: word,
      cmtype: 'page'
    };

    return Promise.all([
      api.get($.extend({}, commonParams, {cmdir: 'descending'})),
      api.get(commonParams)
    ]).then(([beforeData, afterData]) => {
      const beforeMembers = beforeData.query.categorymembers.reverse().map(m => m.title);
      const afterMembers = afterData.query.categorymembers.map(m => m.title);

      // Temporary fix because of a Mediawiki bug
      beforeMembers.filter(title => title !== word);
      if (beforeMembers.length === limit) beforeMembers.pop();

      return beforeMembers.concat(afterMembers);
    });
  }

  function generateNavigationWordList(languageName, languageCode, category, word, limit = 6) {
    fetchNearWords(category, limit, word).then(titles => {
      const $header = $('div > h2#' + languageName).parent();
      const $navDiv = $('<div class="nav-wordlist"></div>');
      if (titles.length > 1) {
        $header.after($navDiv);
        titles.forEach((title, index) => {
          if (title !== word) $navDiv.append(createWikiLink(title, languageCode));
          else $navDiv.append(createCurrentNode(title));
          if (index < titles.length - 1) $navDiv.append(' · ');
        });
      }
    });
  }

  function loadLanguageMap() {
    const url = mw.config.get("wgServer") + mw.config.get("wgScript");
    return $.getJSON(url, {
      title: "MediaWiki:Gadget-langues.json",
      action: "raw"
    }).then((codesToNamesMap) => {
      const namesToCodesMap = {};
      $.each(codesToNamesMap.codes, (code, data) => {
        if (data.isGroup || data.isSpecial) return;
        const name = data.name;
        if (typeof name === "string")
          namesToCodesMap[name.toLowerCase()] = code;
      });
      return namesToCodesMap;
    });
  }


  loadLanguageMap().then((languageMap) => {
    const ids = $('div.mw-heading2 > h2')
        .map((_, e) => e.id)
        .get()
        .filter(id => id !== 'Caractère');

    ids.forEach(id => {
      const idClean = id.replaceAll(/_/g, " ").toLowerCase();
      const languageCode = languageMap[idClean];
      if (!languageCode) return;

      generateNavigationWordList(
          id,
          languageCode,
          id.charAt(0).toLowerCase() + id.slice(1),
          mw.config.get("wgTitle"),
          4
      );
    });
  });
})();
