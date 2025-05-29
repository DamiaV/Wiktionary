/**
 * Variante du "local storage" : identique au local storage,
 * à la différence qu’aucune erreur n’est renvoyée si le local storage
 * n’est pas pris en charge
 *
 * Fichier copié de [[sv:MediaWiki:Gadget-silent fail storage.js]] (oldid=1663823)
 * Auteur : [[sv:User:Skalman]]
 */
window.silentFailStorage = (function () {
  try {
    // Will throw if localStorage isn’t supported or if it’s disabled
    var l = window.localStorage,
        val = l.getItem('a');
    l.setItem('a', 'b');
    if (l.getItem('a') === 'b') {
      // it works
      if (val !== null)
        l.setItem('a', val);
      else
        l.removeItem('a');
      return l;
    }
  } catch (e) {
  }

  function noop() {
  }

  function rnull() {
    return null;
  }

  return {
    getItem: rnull,
    setItem: noop,
    removeItem: noop,
    clear: noop,
    key: rnull,
    length: 0
  };
})();
