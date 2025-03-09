/***
 [[Catégorie:JavaScript du Wiktionnaire|{{SUBPAGENAME}}]]
 COPIÉ DEPUIS WIKILIVRE: [[b:MediaWiki:Common.js]]

 *Expressions régulières
 *Auteur: ThomasV, Pathoschild
 *Note : cet outil utilise la syntaxe javascript : on utilise $ (et pas \) pour appeler un groupe dans la chaîne de remplacement.
 *Tutoriel : http://www.regular-expressions.info/tutorial.html
 ****/

/* create form */
function custom() {

  /* if already open */
  if (document.getElementById('regexform')) customremove()
  else {
    var editbox = document.getElementById('wpTextbox1');
    /* container */
    var regexform = document.createElement('div');
    regexform.setAttribute('id', 'regexform');
    editbox.parentNode.insertBefore(regexform, editbox.parentNode.firstChild);

    /* form tag */
    var formform = document.createElement('form');
    formform.setAttribute('id', 'regexformform');
    formform.setAttribute('onSubmit', 'customgo(); return false;');
    regexform.appendChild(formform);

    // add input boxes
    var newinput = document.createElement('input');
    newinput.setAttribute('id', 'formsearch');
    var newlabel = document.createElement('label');
    newlabel.setAttribute('for', 'formsearch');
    newlabel.appendChild(document.createTextNode("Remplacer "));

    formform.appendChild(newlabel);
    formform.appendChild(newinput);

    var newinput = document.createElement('input');
    newinput.setAttribute('id', 'formreplace');
    var newlabel = document.createElement('label');
    newlabel.setAttribute('for', 'formreplace');
    newlabel.appendChild(document.createTextNode(' par '));

    formform.appendChild(newlabel);
    formform.appendChild(newinput);

    // go! link
    var go_button = document.createElement('input');
    go_button.setAttribute('type', "submit");
    go_button.setAttribute('title', "go!");
    go_button.setAttribute('value', ">");
    formform.appendChild(go_button);
  }
}


/* run patterns */
function customgo() {
  /* get search and replace strings */

  search = document.getElementById('formsearch').value;
  search = search.replace(/\\n/g, '\n');

  replace = document.getElementById('formreplace').value;
  replace = replace.replace(/\\n/g, '\n');

  /* convert input to regex */

  // without delimiters
  if (!search.match(/^\s*\/[\s\S]*\/[a-z]*\s*$/i)) {
    search = new RegExp(search, 'g');
  }
  // with delimiters
  else {
    // break into parts
    var regpattern = search.replace(/^\s*\/([\s\S]*)\/[a-z]*\s*$/i, '$1');
    var regmodifiers = search.replace(/^\s*\/[\s\S]*\/([a-z]*)\s*$/, '$1');
    // filter invalid flags
    regmodifiers = regmodifiers.replace(/[^gim]/ig, '');

    search = new RegExp(regpattern, regmodifiers);
  }

  /* perform */
  var editbox = document.getElementById('wpTextbox1');
  editbox.value = editbox.value.replace(search, replace);

}

/* remove form */
function customremove() {
  var regexform = document.getElementById('regexform');
  regexform.parentNode.removeChild(regexform);
  patterncount = -1;
}


/*******************
 *** create button
 ********************/
function add_regexp_button() {

  var toolbar = document.getElementById("toolbar");
  if (toolbar) {
    var image = document.createElement("img");
    image.width = 23;
    image.height = 22;
    image.border = 0;
    image.className = "mw-toolbar-editbutton";
    image.style.cursor = "pointer";
    image.alt = "regexp";
    image.title = "Expression rationnelles";
    image.src = "//upload.wikimedia.org/wikipedia/commons/a/a0/Button_references_alt.png";
    image.onclick = custom;
    toolbar.appendChild(image);
  }
}

jQuery(document).ready(add_regexp_button);
