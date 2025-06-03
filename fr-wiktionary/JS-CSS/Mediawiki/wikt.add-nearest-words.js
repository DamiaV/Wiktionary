// [[Catégorie:JavaScript du Wiktionnaire|add-nearest-words.js]]
"use strict";

const { getLanguagesNames } = require("./wikt.core.languages.js");

console.log("Chargement de Gadget-wikt.add-nearest-words.js…");

const api = new mw.Api({ userAgent: "Gadget-wikt.add-nearest-words.js" });

/**
 * @param title {string}
 * @returns {JQuery}
 */
function createCurrentNode(title) {
  return $(`<bdi style="font-style: italic; font-weight: bold;">${title}</bdi>`);
}

/**
 * @param title {string}
 * @param text {string}
 * @param languageCode {string}
 * @returns {JQuery}
 */
function createWikiLink(title, text, languageCode) {
  return $(`<a rel="mw:WikiLink" href="/wiki/${title}#${languageCode}" title="${title}"><i>${text}</i></a>`);
}

/**
 * @param category {string}
 * @param limit {number}
 * @param word {string}
 * @param key {string}
 * @returns {Promise}
 */
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
    api.get(Object.assign({}, commonParams, { cmdir: "descending" })),
    api.get(commonParams)
  ]).then(([beforeData, afterData]) => {
    const beforeMembers = beforeData.query.categorymembers.reverse().map(m => m.title);
    const afterMembers = afterData.query.categorymembers.map(m => m.title);

    beforeMembers.pop();

    return beforeMembers.concat(afterMembers);
  }).catch(error => console.log("[Gadget-wikt.add-nearest-word.js]", "[list=categorymembers]", error));
}

/**
 * @param languageCode {string}
 * @param category {string}
 * @param word {string}
 * @param key {string}
 * @param limit {number}
 */
function generateNavigationWordList(languageCode, category, word, key, limit = 3) {
  limit++;
  fetchNearWords(category, limit, word, key).then((titles) => {
    const $header = $('div > h2 > #' + languageCode).parent().parent();
    const $navDiv = $('<div class="nav-wordlist"></div>');
    if (titles.length > 1) {
      $header.after($navDiv);
      titles.forEach((title, index) => {
        const text = title.includes("/") ? title.substring(title.lastIndexOf("/") + 1) : title;
        if (title !== word) $navDiv.append(createWikiLink(title, text, languageCode));
        else $navDiv.append(createCurrentNode(text));
        if (index < titles.length - 1) $navDiv.append(' · ');
      });
    }
  });
}

const languagesNames = getLanguagesNames(true);
const langCodes = $('div.mw-heading2 > h2 > span.sectionlangue')
    .map((_, e) => e.id).get();

const pageName = String(mw.config.get("wgPageName")).replaceAll("_", " ");
api.get({
  action: "query",
  prop: "categories",
  titles: pageName,
  clprop: "sortkey",
  cllimit: "max"
}).then(data => {
  const categories = data.query.pages[mw.config.get("wgArticleId")].categories;
  langCodes.forEach((languageCode) => {
    const languageCodeClean = languageCode.replaceAll(/_/g, " ");
    const categoryName = languagesNames.get(languageCodeClean);
    if (!categoryName) return;

    const filteredCategories = categories.filter(c => c.title === `Catégorie:${categoryName}`);

    if (filteredCategories.length === 0) return;

    // noinspection JSUnresolvedReference
    generateNavigationWordList(
        languageCode,
        categoryName,
        pageName,
        filteredCategories[0]["sortkey"],
        window.nearWordsLimit || 3
    );
  });
}).catch(error => console.log("[Gadget-wikt.add-nearest-word.js]", "[prop=categories]", error));
