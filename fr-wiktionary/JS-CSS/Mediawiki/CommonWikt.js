/*******************************************************************************
 * (en)
 * Various utility functions personal scripts.
 *******************************************************************************
 * (fr)
 * Différentes fonctions utiles pour scripts personnels.
 *******************************************************************************
 * [[Catégorie:JavaScript du Wiktionnaire|CommonWikt.js]]
 *******************************************************************************/

/**
 * Computes the sort key for the given word.
 * French words only need to take apostrophies into account.
 * @param word {string} The word.
 * @return {string} The sort key.
 * @deprecated Use `sortKey()` function from [[MediaWiki:Gadget-wikt.core.page.js]]
 */
function CommonWikt_CleTri(word) {
  let key = word;

  key = key.replaceAll("ĉ", "cx");
  key = key.replaceAll("ĝ", "gx");
  key = key.replaceAll("ĥ", "hx");
  key = key.replaceAll("ĵ", "jx");
  key = key.replaceAll("ŝ", "sx");
  key = key.replaceAll("ŭ", "ux");
  key = key.replaceAll(/['’]/g, "");
  key = key.replaceAll(/[-/]/g, " ");

  return key;
}

/**
 * Ajoute un menu dans les onglets.
 * @param link {string} L’URL.
 * @param title {string} Le titre de la page.
 * @deprecated Préférer utiliser mw.util.addPortletLink()
 *             (cf. [[mw:ResourceLoader/Default_modules#addPortletLink]])
 */
function CommonWikt_AddTabMenu(link, title) {
  $(() => {
    const cactionsTab = document.getElementById('p-cactions');
    if (cactionsTab) {
      const tabList = cactionsTab.getElementsByTagName('ul')[0];
      tabList.innerHTML += '<li><a href="' + link + '">' + title + '</a></li>';
      if (cactionsTab.className)
        cactionsTab.className = cactionsTab.className.replace(/\s*emptyPortlet\s*/, " ");
    }
  });
}

/*
 * AJAX
 */

/**
 * Objet permettant d’envoyer une requête AJAX aux serveurs WikiMedia.
 * - soit via l’interface standard (index.php)
 * - soit via l’API (api.php)
 * - soit via les requêtes POST et GET
 * @deprecated Utiliser $.get() à la place.
 */
var CommonWikt_ajax = {
  http: (bundle) => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4)
        CommonWikt_ajax.httpComplete(xmlhttp, bundle);
    };
    xmlhttp.open(bundle.method ? bundle.method : "GET", bundle.url);
    if (bundle.headers)
      for (const field of bundle.headers)
        xmlhttp.setRequestHeader(field, bundle.headers[field]);
    xmlhttp.send(bundle.data ? bundle.data : null);
    return xmlhttp;
  },
  httpComplete: (xmlhttp, bundle) => {
    if (xmlhttp.status === 200 || xmlhttp.status === 302) {
      if (bundle.onSuccess)
        bundle.onSuccess(xmlhttp, bundle);
    } else if (bundle.onFailure)
      bundle.onFailure(xmlhttp, bundle);
  }
};
