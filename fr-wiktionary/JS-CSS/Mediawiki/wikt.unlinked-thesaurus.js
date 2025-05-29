// [[Catégorie:JavaScript du Wiktionnaire|unlinked-thesaurus.js]]
"use strict";

const { getLanguageToCodeMap } = require("./wikt.core.languages.js");

console.log("Chargement de Gadget-wikt.unlinked-thesaurus.js…");

const api = new mw.Api({ userAgent: "Gadget-wikt.unlinked-thesaurus.js" });

/**
 * @param data1 {{query: {pages: {[key: string]: {title: string}}}}}
 * @param data2 {{query: {backlinks: {title: string}[]}}}
 * @returns {string[]}
 */
function getMissingTitles(data1, data2) {
  /** @type {string[]} */
  const links = (Object.values(data1.query.pages)[0].links || []).map(x => x.title);
  const backlinks = data2.query.backlinks.map(x => x.title);
  return backlinks.filter(x => !links.includes(x));
}

Promise.all([
  api.get({
    action: 'query',
    prop: 'links',
    titles: mw.config.get('wgTitle'),
    plnamespace: '106'
  }), api.get({
    action: 'query',
    list: 'backlinks',
    bltitle: mw.config.get('wgTitle'),
    blnamespace: '106'
  })
]).then(([data1, data2]) => {
  const languageToCodeMap = getLanguageToCodeMap();
  const missingTitles = getMissingTitles(data1, data2);

  if (missingTitles.length === 0) return;

  const languages = {};
  for (const title of missingTitles) {
    const language = title.split('/')[1];
    if (!language) continue;
    if (!languages.hasOwnProperty(language)) languages[language] = [];
    languages[language].push(title);
  }

  const thesaurusList = $('<ul></ul>');
  $('#bodyContent').prepend(thesaurusList);
  const generateLink = title => $(`<a rel="mw:WikiLink" href="/wiki/${title}"><i>${title}</i></a>`)[0].outerHTML;
  for (const [language, missingLinks] of Object.entries(languages)) {
    const code = `{{voir thésaurus|${languageToCodeMap.get(language)}|${missingLinks.map(title => title.split(':')[1].split('/')[0]).join("|")}}}`;
    thesaurusList.append(`<li>Cette page est présente dans ${missingLinks.length} thésaurus en ${language} qui ${missingLinks.length > 1 ? "ne sont pas présents" : "n’est pas présent"} sur cette page : ${missingLinks.map(generateLink).join(", ")}. Utilisez <code>${code}</code> (<a href="#" class="copy-link" data-code="${code}">copier</a> ; <a href="#" class="copy-link-with-header" data-code="${code}">copier avec l’entête de section</a>).</li>`);
  }

  $('.copy-link').on('click', function (event) {
    event.preventDefault();
    const $link = $(this);
    const code = $link.data('code');
    $link.text("copié !");
    navigator.clipboard.writeText(code);
    setTimeout(() => $link.text("copier"), 1000);
  });

  $('.copy-link-with-header').on('click', function (event) {
    event.preventDefault();
    const $link = $(this);
    const code = $link.data('code');
    $link.text("copié !");
    console.log("copié !");
    navigator.clipboard.writeText('==== {{S|vocabulaire}} ====\n' + code);
    setTimeout(() => $link.text("copier avec l’entête de section"), 1000);
  });
});
