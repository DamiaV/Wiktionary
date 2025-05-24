(() => {
  console.log("Chargement de Gadget-wikt.add-nearest-words.js…");
  const api = new mw.Api({userAgent: "Gadget-wikt.add-nearest-words.js"});

  function createCurrentNode(title) {
    return $(`<bdi><i><b>${title}</b></i></bdi>`);
  }

  function createWikiLink(title, languageCode) {
    return $(`<a rel="mw:WikiLink" href="/wiki/${title}#${languageCode}" title="${title}"><i>${title}</i></a>`);
  }

  function fetchNearWords(category, limit, word, key) {
    const commonParams = {
      action: 'query',
      list: 'categorymembers',
      cmtitle: 'Category:' + category,
      cmlimit: limit,
      cmprop: 'title',
      cmstarthexsortkey: key,
      cmtype: 'page'
    };

    return Promise.all([
      api.get($.extend({}, commonParams, {cmdir: 'descending'})),
      api.get(commonParams)
    ]).then(([beforeData, afterData]) => {
      const beforeMembers = beforeData.query.categorymembers.reverse().map(m => m.title);
      const afterMembers = afterData.query.categorymembers.map(m => m.title);

      beforeMembers.pop();

      return beforeMembers.concat(afterMembers);
    });
  }

  function generateNavigationWordList(languageCode, category, word, key, limit = 6) {
    fetchNearWords(category, limit, word, key).then((titles) => {
      const $header = $('div > h2 > #' + languageCode).parent().parent();
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
    return $.getJSON(
        "/wiki/MediaWiki:Gadget-langues.json",
        {
          action: "raw"
        }
    );
  }

  loadLanguageMap().then((languageMap) => {
    const langCodes = $('div.mw-heading2 > h2 > span.sectionlangue')
        .map((_, e) => e.id).get();

    const pageName = mw.config.get("wgTitle");
    api.get({
      action: 'query',
      prop: 'categories',
      titles: pageName,
      clprop: 'sortkey',
      cllimit: 'max'
    }).then(data => {
      const categories = data.query.pages[mw.config.get("wgArticleId")].categories;
      langCodes.forEach((languageCode) => {
        const languageCodeClean = languageCode.replaceAll(/_/g, " ");
        const languageData = languageMap.codes[languageCodeClean];
        if (!languageData) return;

        const categoryName = languageData.name;
        const filteredCategories = categories.filter(c => c.title === `Catégorie:${categoryName}`);

        if (filteredCategories.length === 0) return;

        generateNavigationWordList(
            languageCode,
            categoryName,
            pageName,
            filteredCategories[0].sortkey,
            4
        );
      });
    });
  });
})();
