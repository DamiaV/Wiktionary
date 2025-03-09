/*
[[Catégorie:JavaScript du Wiktionnaire|doublewiki.js]]
Liens bilingues
Fonctionne avec l'extension DoubleWiki.
Auteur: ThomasV
*/


function BilingualLink() {
  if (mw.config.get('wgNamespaceNumber') != 0) return;
  var doc_url = document.URL;
  var url = '';
  // iterate over all <li>-elements
  for (var j = 0; b = document.getElementsByTagName("li")[j]; j++) {
    if (b.className.substring(0, 10) == "interwiki-") {
      var lang = b.className.substring(10, b.className.length);
      if (doc_url.indexOf('?title=') != -1) {
        var qm = doc_url.indexOf('&match=');
        if (qm != -1) url = doc_url.substring(0, qm) + "&match=" + lang;
        else url = doc_url + "&match=" + lang;
      }
      else {
        var qm = doc_url.indexOf('?');
        if (qm != -1) url = doc_url.substring(0, qm) + "?match=" + lang;
        else url = doc_url + "?match=" + lang;
      }
      b.innerHTML = b.innerHTML + "<a href='" + url + "'> &hArr;</a>";
    }
  }
}

jQuery(document).ready(BilingualLink);
