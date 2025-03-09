//[[Catégorie:JavaScript du Wiktionnaire|OldSearchBox.js]]
// Remplace la nouvelle barre de recherche de vector par la barre "classique" : [Lire][Rechercher] [[
// [[Catégorie:JavaScript du Wiktionnaire|OldSearchBox.js]]

if (skin == "vector") {
  var OldSearchBox_InputTxtTitle = 'Rechercher dans le Wiktionnaire';
  var OldSearchBox_InputGoTitle = 'Aller vers une page portant exactement ce nom si elle existe';
  var OldSearchBox_InputSearchTitle = 'Rechercher les pages comportant ce texte';
  var OldSearchBox_InputGoText = 'Lire';
  var OldSearchBox_InputSearchText = 'Rechercher';
  jQuery(document).ready(function () {
    var SearchForm = document.getElementById('searchform');
    if (!SearchForm) return;
    while (SearchForm.firstChild) {
      SearchForm.removeChild(SearchForm.firstChild);
    }
    SearchForm.innerHTML = '<input name="search" title="' + OldSearchBox_InputTxtTitle + '" '
        + 'id="searchInput2" accessKey="C" autocomplete="off" />'
        + '<input name="go" title="' + OldSearchBox_InputGoTitle + '" class="searchButton" '
        + 'id="searchGoButton2" type="submit" value="' + OldSearchBox_InputGoText + '"/>'
        + '<input name="fulltext" title="' + OldSearchBox_InputSearchTitle + '" class="searchButton" '
        + 'id="mw-searchButton2" type="submit" value="' + OldSearchBox_InputSearchText + '"/>';
  });
}
