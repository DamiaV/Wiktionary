//[[Catégorie:JavaScript du Wiktionnaire|Common-Ajax.js]]
// Chargement asynchrone de pages

/*
 * Utilisation :
 *
 * Aucune
 */
function createXhrObject() {
  if (window.XMLHttpRequest)
    return new XMLHttpRequest();

  if (window.ActiveXObject) {
    var names = [
      "Msxml2.XMLHTTP.6.0",
      "Msxml2.XMLHTTP.3.0",
      "Msxml2.XMLHTTP",
      "Microsoft.XMLHTTP"
    ];
    for (var i in names) {
      try {
        return new ActiveXObject(names[i]);
      }
      catch (e) {
      }
    }
  }
  return null; // non supporté
}

/*
 * Utilisation :
 *
 * MediaWiki:Gadget-AjaxPatrol.js
 */
function async_call(url, f_ok, f_error, args) {
  var xhr = createXhrObject();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Pragma", "cache=no");
  xhr.setRequestHeader("Cache-Control", "no-transform");
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4) return;
    if (xhr.status != 200) f_error(xhr.status, xhr.statusText, args);
    else f_ok(xhr.responseText, args);
  };
  xhr.send();
}
