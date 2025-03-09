/*[[Catégorie:JavaScript du Wiktionnaire|WikEd.js]]*/
// Installe wikEd pour l'édition des pages (pour tous)

// Ne pas afficher la différence pas défaut
var wikEdDiffPreset = false;

// install the French translation for [[en:User:Cacycle/wikEd]]
mw.loader.load('//en.wikipedia.org/w/index.php?title=User:Leag/wikEd-fr.js&action=raw&ctype=text/javascript&dontcountme=s');

// install [[User:Cacycle/diff]] text diff code
mw.loader.load('//en.wikipedia.org/w/index.php?title=User:Cacycle/diff.js&action=raw&ctype=text/javascript&dontcountme=s');

// install [[User:Pilaf/Live_Preview]] page preview tool
mw.loader.load('//en.wikipedia.org/w/index.php?title=User:Pilaf/livepreview.js&action=raw&ctype=text/javascript&dontcountme=s');

// install [[User:Cacycle/wikEd]] editing page extension
mw.loader.load('//en.wikipedia.org/w/index.php?title=User:Cacycle/wikEd.js&action=raw&ctype=text/javascript&dontcountme=s');
