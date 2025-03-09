// [[Catégorie:JavaScript du Wiktionnaire|searchFocus.js]]
// Imported from http://en.wikipedia.org/wiki/MediaWiki:Gadget-searchFocus.js as of June 4, 2009

if (mw.config.get('wgPageName') == "Wiktionary:Main_Page") {
  jQuery(document).ready(function () {
    document.getElementById("searchInput").focus();
  });
}
