// [[Catégorie:JavaScript du Wiktionnaire|RenommageCategorie.js]]

function RenommageCategorie_SiteCustom() {
  // Résumé de modification : lien vers la documentation
  RenommageCategorie_Text_Script = '[[w:Projet:JavaScript/Notices/RenommageCategorie|Renommage de catégorie]] : ';
  // Commentaire de renommage de la catégorie elle-même.
  RenommageCategorie_Text_MoveReason = '[[w:Projet:JavaScript/Notices/RenommageCategorie|Renommage de catégorie]]';
  // Modèle pour crédit des auteurs en page de discussion
  RenommageCategorie_Text_HistTemplate = "{{Catégorie renommée|$1|contributeurs=$2}}\n";
  // Modèle User
  RenommageCategorie_Text_UserTemplate = "{{U|$1}}";
  RenommageCategorie_CaseSensitive = true;
}

window.RenommageCategorie_SiteCustom = RenommageCategorie_SiteCustom;

mw.loader.load("//fr.wikipedia.org/w/index.php?title=MediaWiki:Gadget-CatRename.js&action=raw&ctype=text/javascript");
