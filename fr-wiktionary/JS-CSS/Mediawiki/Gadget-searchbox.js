// [[Catégorie:JavaScript du Wiktionnaire|searchbox.js]]
/*
Ce gadget provient de https://pl.wikipedia.org/wiki/MediaWiki:Gadget-searchbox.js
Auteurs : [[:en:User:Zocky]], Maciej Jaros [[:pl:User:Nux]]
Ce script dépend de [[MediaWiki:Gadget-lib-beau.js]], qui définit les fonctions
importScriptFromWikipedia et importStylesheetFromWikipedia
(la dépendance est indiquée dans [[MediaWiki:Gadgets-definition]]).
*/

// test, line#0

// EOC@line#24
var tmp_VERSION = '2.2.2';
// EOC@line#30
// EOC@line#42
// EOC@line#48
var tmp_nuxsr_lang = {
  '_': ''
  , '_num_ ocurrences of _str_ replaced with _str_': 'Remplacement de $1 [$2] par [$3].'
  , 'searching from the beginning': 'Recherche depuis le début'
  , 'name conflict error': 'Erreur fatale : conflit de nom.'
};
// EOC@line#58
var nuxsr = new Object();
window.nuxsr = nuxsr;
nuxsr.ver = nuxsr.version = tmp_VERSION;
nuxsr.lang = tmp_nuxsr_lang;


nuxsr.btns =
    {
      sr:
          {
            attrs:
                {
                  title: 'Rechercher et remplacer',
                  alt: "Boite",
                  style: "width:auto;height:auto",
                  id: 'SearchIcon'
                },
            icons:
                {
                  oldbar: '//upload.wikimedia.org/wikipedia/commons/1/12/Button_find.png',
                  newbar: '//commons.wikimedia.org/w/thumb.php?f=Crystal_Clear_action_viewmag.png&width=21px'
                }
          },
      tc:
          {
            attrs:
                {
                  title: 'Modifier la casse',
                  alt: "Casse",
                  style: "width:auto;height:auto"
                },
            icons:
                {
                  oldbar: '//upload.wikimedia.org/wikipedia/commons/1/12/Button_case.png',
                  newbar: '//commons.wikimedia.org/w/thumb.php?f=Wynn.svg&width=23px'
                }
          },
      so1:
          {
            attrs:
                {
                  title: 'Trier dans l\'ordre alphabétique',
                  alt: "Trier haut",
                  style: "width:auto;height:auto"
                },
            icons:
                {
                  oldbar: '//upload.wikimedia.org/wikipedia/commons/6/6f/Button_arrow_up.PNG',
                  newbar: '//commons.wikimedia.org/w/thumb.php?f=Wynn.svg&width=23px'
                }
          },
      so2:
          {
            attrs:
                {
                  title: 'Trier dans l\'ordre décroissant',
                  alt: "Trier bas",
                  style: "width:auto;height:auto"
                },
            icons:
                {
                  oldbar: '//upload.wikimedia.org/wikipedia/commons/2/2b/Button_arrow_down.PNG',
                  newbar: '//commons.wikimedia.org/w/thumb.php?f=Wynn.svg&width=23px'
                }
          }
    }


nuxsr.boxHTML =
    '<form name="nuxsr_form"><div id="srBox" style="line-height: 1.5em;">'
    + '<div>'
    + '<span style="float:left;padding-top:0px;">'
    + '<span class="label">Rechercher</span><br />'
    + '<input size="25" type="text" name="nuxsr_search" id="nuxsr_search" accesskey="F" tabindex="8" onkeypress="event.which == 13 && nuxsr.next()"; value="" />'
    + '</span>'
    + '<span style="float:left;padding-top:0px;">'
    + '<span class="label">Remplacer</span><br />'
    + '<input size="25" type="text" name="nuxsr_replace" id="nuxsr_replace" accesskey="G" tabindex="9" onkeypress="event.which == 13 && nuxsr.next()"; value="" />'
    + '</span>'
    + '<span>'
    + '<label><input type="checkbox" name="nuxsr_case" onclick="nuxsr.t.focus()" tabindex="10" />Respecter la casse</label>'
    + '<label><input type="checkbox" name="nuxsr_regexp" onclick="nuxsr.t.focus()" tabindex="11" />RegEx</label>'
    + '<br />'
    + '<a href="javascript:nuxsr.back()" title="rechercher le précédent [alt-2]" accesskey="2">&lt;</a>&nbsp;'
    + '<a href="javascript:nuxsr.next()" title="rechercher le suivant [alt-3]" accesskey="3">suivant</a> &nbsp; '
    + '<a href="javascript:nuxsr.replace();nuxsr.back()" title="Remplacer le précédent [alt-4]" accesskey="4">&lt;</a>&nbsp;'
    + '<a href="javascript:nuxsr.replace()" title="Remplacer le courant">remplacer</a>&nbsp;'
    + '<a href="javascript:nuxsr.replace();nuxsr.next()" title="Remplacer le suivant [alt-5]" accesskey="5">&gt;</a> &nbsp; '
    + '<a href="javascript:nuxsr.replaceAll()" title="Remplacer dans toute la page [alt-7]" accesskey="7">tout remplacer</a> &nbsp; '
    + '</span>'
    + '</div>'
    + '<div style="clear:both;padding-top:3px;">'
    + '<span>'
    + '<a href="javascript:nuxsr.mem.remind()" style="background:inherit">Regex prédéfini</a>'
    //		+' <a href="javascript:nuxsr.mass_rep(nuxsr.mass_rep_htmlspecialchars)" title="Zamień specjalne znaki HTML na encje HTML">HTMLSpecialChars</a>'
    + '</span>'
    + ' &nbsp; '
    + '<span>'
    + '<a href="javascript:nuxsr.gotoLine()" style="background:inherit" title="Aller à la ligne n°">Ligne n°</a>'
    + ' <input type="text" name="nuxsr_goto_line" tabindex="12" style="width:55px" />'
    + '</span>'
    + '</div>'
    + '<div style="clear:both"></div>'
    + '</div></form>'
;


// nuxsr.i=document.getElementById('SearchIcon');
// EOC@line#154
nuxsr.getSearchString = function () {
  var str = nuxsr.s.value;
  if (!nuxsr.f.nuxsr_regexp.checked) {
    str = str.replace(/([\[\]\{\}\|\.\*\?\(\)\$\^\\])/g, '\\$1')
  }
  return str;
}
nuxsr.getReplaceString = function () {
  var str = nuxsr.r.value;
  if (!nuxsr.f.nuxsr_regexp.checked) {

    //str=str.replace(/([\$\\])/g,'\\$1');
  }
  else {
    //str=str.replace(/\\n/g,"\n").replace(/\\t/g,"\t").replace(/&backslash;/g,"\\").replace(/&dollar;/g,"\$")
    str = str.replace(/'/g, "\\'");
    eval("str='" + str + "'");
  }
  return str;
}
// EOC@line#183
nuxsr.back = function () {
  if (nuxsr.s.value == '') {
    nuxsr.t.focus();
    return;
  }

  var searchString = nuxsr.getSearchString();
  var selBB = sel_t.getSelBound(nuxsr.t);


  searchString = "^([\\s\\S]*)(" + searchString + ")";
  var re = new RegExp(searchString, (nuxsr.f.nuxsr_case.checked ? "" : "i"));
  var res = re.exec(nuxsr.t.value.substring(0, selBB.start));
  if (!res) {
    var res = re.exec(nuxsr.t.value)
  }


  if (res) {
    sel_t.setSelRange(nuxsr.t, res[1].length, res[1].length + res[2].length)
  }
  else {
    selBB.start = selBB.end;
    sel_t.setSelBound(nuxsr.t, selBB, false);
  }


  nuxsr.sync();
}

nuxsr.next = function (norev) {
  if (nuxsr.s.value == '') {
    nuxsr.t.focus();
    return
  }

  var searchString = nuxsr.getSearchString();
  var selBB = sel_t.getSelBound(nuxsr.t);


  var re = new RegExp(searchString, (nuxsr.f.nuxsr_case.checked ? "g" : "gi"));
  re.lastIndex = selBB.end;
  var res = re.exec(nuxsr.t.value)
  if (!res && !norev) {
    nuxsr.msg(nuxsr.lang['searching from the beginning'])
    re.lastIndex = 0;
    var res = re.exec(nuxsr.t.value)
  }


  if (res) {
    sel_t.setSelRange(nuxsr.t, res.index, res.index + res[0].length)
  }
  else {
    selBB.start = selBB.end;
    sel_t.setSelBound(nuxsr.t, selBB, false);
  }


  nuxsr.sync();
}
// EOC@line#258
nuxsr.replace = function () {
  //

  var str = sel_t.getSelStr(nuxsr.t, true);

  //

  var searchString = nuxsr.getSearchString();
  var replaceString = nuxsr.getReplaceString();
  var selBB = sel_t.getSelBound(nuxsr.t);

  var re = new RegExp(searchString, (nuxsr.f.nuxsr_case.checked ? "g" : "gi"));

  //

  var matchesArr = re.exec(str);

  if (matchesArr && matchesArr[0].length == str.length) {

    str = str.replace(re, replaceString);


    var sel_tmp = {
      start: selBB.start,
      strlen_post: str.length
    }


    sel_t.qsetSelStr(nuxsr.t, str, true);


    sel_t.setSelRange(nuxsr.t, sel_tmp.start, sel_tmp.start + sel_tmp.strlen_post);
  }

  //

  nuxsr.t.focus();
}

nuxsr.replaceAll = function () {
  //

  var str = sel_t.getSelStr(nuxsr.t, true);

  //

  var searchString = nuxsr.getSearchString();
  var replaceString = nuxsr.getReplaceString();

  var re = new RegExp(searchString, (nuxsr.f.nuxsr_case.checked ? "g" : "gi"));

  //

  var matchesArr = str.match(re);

  //

  str = str.replace(re, replaceString);

  //

  sel_t.qsetSelStr(nuxsr.t, str, true);

  nuxsr.t.focus();

  //

  if (matchesArr && matchesArr.length) {
    nuxsr.msg(nuxsr.lang['_num_ ocurrences of _str_ replaced with _str_'].replace(/\$1/, matchesArr.length).replace(/\$2/, nuxsr.s.value).replace(/\$3/, nuxsr.r.value));
  }

  return;
}
// EOC@line#339
nuxsr.toggleCase = function () {
  var selBB = sel_t.getSelBound(nuxsr.t);
  if (selBB.end > selBB.start) {
    var str = sel_t.getSelStr(nuxsr.t);
    if (str == str.toUpperCase()) {
      str = str.toLowerCase()
    }
    else if (str == str.toLowerCase() && selBB.end - selBB.start > 1) {
      str = str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()
    }
    else {
      str = str.toUpperCase()
    }


    sel_t.setSelStr(nuxsr.t, str, false);
  }
  nuxsr.sync();
}

// Les 2 fonctions qui suivent permettent le tri alphabétique en français
function sortkey(word) {
  var key = word.toLowerCase();
  key = key.replace(/[àáâãäå]/g, "a");
  key = key.replace(/[æ]/g, "ae");
  key = key.replace(/[çćċč]/g, "c");
  key = key.replace(/[ĉ]/g, "cx");
  key = key.replace(/[èéêë]/g, "e");
  key = key.replace(/[ĝ]/g, "gx");
  key = key.replace(/[ĥ]/g, "hx");
  key = key.replace(/[ìíîï]/g, "i");
  key = key.replace(/[ĵ]/g, "jx");
  key = key.replace(/[ñ]/g, "n");
  key = key.replace(/[òóôõö]/g, "o");
  key = key.replace(/[œ]/g, "oe");
  key = key.replace(/[òóôõö]/g, "o");
  key = key.replace(/[ŝ]/g, "sx");
  key = key.replace(/[ùúûü]/g, "u");
  key = key.replace(/[ŭ]/g, "ux");
  key = key.replace(/[ýÿ]/g, "y");
  key = key.replace(/['’)(]/g, "");
  key = key.replace(/[-\/]/g, " ");
  return key;
}

function sort_in_French(a, b) {
  a = sortkey(a);
  b = sortkey(b);
  if (a == b) return 0;
  c = [a, b];
  c.sort();
  if (c[0] == a) {
    return -1;
  }
  return 1;
}

nuxsr.sort1 = function () {
  var selBB = sel_t.getSelBound(nuxsr.t);
  if (selBB.end > selBB.start) {
    var str = sel_t.getSelStr(nuxsr.t);
    blackboard = str.split("\n")
    blackboard = blackboard.sort(sort_in_French)
    sel_t.setSelStr(nuxsr.t, blackboard.join("\n"), false);
  }
  nuxsr.sync();
}

nuxsr.sort2 = function () {
  var selBB = sel_t.getSelBound(nuxsr.t);
  if (selBB.end > selBB.start) {
    var str = sel_t.getSelStr(nuxsr.t);
    blackboard = str.split("\n")
    blackboard = blackboard.reverse()
    sel_t.setSelStr(nuxsr.t, blackboard.join("\n"), false);
  }
  nuxsr.sync();
}

// EOC@line#368
nuxsr.sync = function () {
  nuxsr.t.focus();
}
// EOC@line#376
nuxsr.init = function () {
  if (document.getElementById('wpTextbox1')) {
    //

    nuxsr.t = document.editform.wpTextbox1;


    //

    nuxedtoolkit.prepare();
    var group_el = nuxedtoolkit.addGroup();
    nuxedtoolkit.addBtn(
        group_el, 'nuxsr.showHide()',
        nuxsr.btns.sr.icons, nuxsr.btns.sr.attrs
    );
    nuxedtoolkit.addBtn(
        group_el, 'nuxsr.toggleCase()',
        nuxsr.btns.tc.icons, nuxsr.btns.tc.attrs
    );
    nuxedtoolkit.addBtn(
        group_el, 'nuxsr.sort1()',
        nuxsr.btns.so1.icons, nuxsr.btns.so1.attrs
    );
    nuxedtoolkit.addBtn(
        group_el, 'nuxsr.sort2()',
        nuxsr.btns.so2.icons, nuxsr.btns.so2.attrs
    );

    nuxsr.i = document.getElementById('SearchIcon');
    nuxsr.i.accessKey = "F";

    //

    var srbox = document.createElement('div');
    srbox.innerHTML = nuxsr.boxHTML;
    srbox.firstChild.style.display = 'none';

    //el=document.getElementById('editform');
    el = document.getElementById('wpTextbox1');
    el.parentNode.insertBefore(srbox, el);
    nuxsr.srbox = srbox;

    nuxsr.f = document.nuxsr_form;
    nuxsr.s = document.nuxsr_form.nuxsr_search;
    nuxsr.r = document.nuxsr_form.nuxsr_replace;

    //

    if (document.editform.messages == undefined) {
      el = document.createElement('textarea');
      el.cols = nuxsr.t.cols;
      el.style.cssText = nuxsr.t.style.cssText;
      el.rows = 5;
      el.id = 'messages';
      el.style.display = 'none';
      el.style.width = 'auto';
      nuxsr.t.parentNode.insertBefore(el, nuxsr.t.nextSibling);
    }
  }


}
// EOC@line#440
nuxsr.showHide = function () {
  if (nuxsr.f.style.display == 'none') {

    document.editform.messages.style.display = 'block';
    nuxsr.f.style.display = 'block';
    nuxsr.i.accessKey = "none";
    //nuxsr.t.style.width='auto';
    nuxsr.s.focus();
// EOC@line#457
  }
  else {
    document.editform.messages.style.display = 'none';
    nuxsr.f.style.display = 'none';

    nuxsr.i.accessKey = "F";
  }
}
// EOC@line#470
nuxsr.gotoLine = function () {
  if (nuxsr.f.nuxsr_goto_line.value == '') {
    nuxsr.t.focus();
    return;
  }

  var lineno = parseInt(nuxsr.f.nuxsr_goto_line.value);


  var index = (lineno == 1) ? 0 : nuxsr.indexOfNthMatch(nuxsr.t.value, '\n', lineno - 1);


  if (index >= 0) {
    if (index > 0) {
      index++;
    }
    sel_t.setSelRange(nuxsr.t, index, index)
  }


  nuxsr.sync();
}

nuxsr.indexOfNthMatch = function (haystack, needle, n) {
  var index = -1;

  for (var i = 1; i <= n && ((index = haystack.indexOf(needle, index + 1)) != -1); i++) {
    if (i == n) {
      return index;
    }
  }

  return -1;
}

// EOC@line#516


function importStylesheetFromWikipedia(page) {
  mw.loader.load('//pl.wikipedia.org/w/index.php?action=raw&ctype=text/css&title=' + encodeURIComponent(page), 'text/css');
}

importStylesheetFromWikipedia('MediaWiki:Gadget-searchbox.css');

var searchboxModules = [
  '//pl.wikipedia.org/w/index.php?action=raw&ctype=text/javascript&title=MediaWiki:Gadget-sel_t.js',
  '//pl.wikipedia.org/w/index.php?action=raw&ctype=text/javascript&title=MediaWiki:Gadget-nuxedtoolkit.js'
];

mw.loader.implement("searchboxModules", searchboxModules, {}, {}, {});
mw.loader.using("searchboxModules", function () {
  $(nuxsr.init);
  $(function () {
    var el = document.getElementById('wpTextbox1');
    if (el) el.parentNode.insertBefore(nuxsr.srbox, el);
  });
});


// EOC@line#528
nuxsr.mem = {
  s: [
    ' - ',
    '"(.*?)"([^>])'
  ],
  r: [
    ' – ',
    '„$1”$2'
  ]
};
nuxsr.mem.index = -1;
nuxsr.mem.remind = function () {
  nuxsr.mem.index++;
  nuxsr.mem.index %= nuxsr.mem.s.length;
  nuxsr.s.value = nuxsr.mem.s[nuxsr.mem.index];
  nuxsr.r.value = nuxsr.mem.r[nuxsr.mem.index];
}
// EOC@line#573
nuxsr.mass_rep_htmlspecialchars = {
  s: ['&', '>', '<'],
  r: ['&amp;', '&gt;', '&lt;']
};

nuxsr.mass_rep = function (obj) {
  //

  //
  var prev_ser_RE = nuxsr.f.nuxsr_regexp.checked;
  nuxsr.f.nuxsr_regexp.checked = true;
// EOC@line#593
  //

  //
  var selBB = sel_t.getSelBound(nuxsr.t);
  var field_len = nuxsr.t.value.length;
  var field_len_diff = 0;

  //

  //
  for (var i = 0; i < obj.s.length; i++) {
    nuxsr.s.value = obj.s[i];
    nuxsr.r.value = obj.r[i];
    nuxsr.replaceAll();

    // recalculate end of the user's selection
    if (selBB.start != selBB.end) {
      field_len_diff = nuxsr.t.value.length - field_len;
      selBB.end += field_len_diff;
      field_len = nuxsr.t.value.length;
    }

    sel_t.setSelBound(nuxsr.t, selBB, false);
  }

  //

  //
  nuxsr.f.nuxsr_regexp.checked = prev_ser_RE;
}


nuxsr.msg = function (str) {
  document.editform.messages.value = str + '\n' + document.editform.messages.value;
}

// test, EOF
