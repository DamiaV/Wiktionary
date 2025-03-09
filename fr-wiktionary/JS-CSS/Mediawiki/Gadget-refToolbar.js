//[[Catégorie:JavaScript du Wiktionnaire|refToolbar.js]]
if (typeof wgWikiEditorPreferences != 'undefined' && wgWikiEditorPreferences.toolbar) {
  mw.loader.load('//fr.wiktionary.org/wiki/Utilisateur:JackPotte/refToolbar_2.0/base.js&action=raw&ctype=text/javascript');
  if (wgWikiEditorPreferences.toolbar.enable && wgWikiEditorPreferences.toolbar.dialogs /*&& navigator.userAgent.indexOf('MSIE') == -1*/) {
    mw.loader.load('//en.wikipedia.org/w/index.php?title=User:Mr.Z-man/refToolbar 2.0.js&action=raw&ctype=text/javascript');
  }
  else if (wgWikiEditorPreferences.toolbar.enable) {
    mw.loader.load('//en.wikipedia.org/w/index.php?title=User:Mr.Z-man/refToolbarIE.js&action=raw&ctype=text/javascript');
  }
}
else if mw.config.get('wgAction') == 'edit' || mw.config.get('wgAction') == 'submit') {
  mw.loader.load('//fr.wiktionary.org/wiki/Utilisateur:JackPotte/refToolbarPlus.js&action=raw&ctype=text/javascript');
}
