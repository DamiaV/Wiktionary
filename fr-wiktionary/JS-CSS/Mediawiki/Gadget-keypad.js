// [[Catégorie:JavaScript du Wiktionnaire|keypad.js]]
var html;

// Returns a new XMLHttpRequest object, except in IE, where it returns the
// equivalent.
function newXMLHttpRequest() {
  var reqObj = false;
  /*@cc_on @*/
  /*@if (@_jscript_version >= 5)
     try {
      reqObj = new ActiveXObject("Msxml2.XMLHTTP");
     } catch (e) {
      try {
        reqObj = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (E) {
       reqObj = false;
      }
     }
  @else
     reqObj = false;
  @end @*/
  if (!reqObj) {
    try {
      reqObj = new XMLHttpRequest();
    }
    catch (e) {
      reqObj = false;
    }
  }
  return reqObj;
}

function keyPadSelection(keyBoardNumber) {
  var q = '"';
  var sq = "'";
  var txt = html.split('<p ')[keyBoardNumber + 2];
  var tbl = document.getElementById('searchKeyboard');
  var kW = tbl.parentNode;
  kW.removeChild(tbl);
  tbl = document.createElement('table');
  tbl.id = 'searchKeyboard';
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  var link = document.createElement('a');
  var selected = keyBoardNumber;
  txt = txt.replace(/<span\s[^>]*class=["'][^"']*\bcharinsert\b[^"']*["'][^>]*>/g, '<charinsert>');
  kybs = txt.split('<charinsert>')[0].split(' ');
  var onthisline = 0;
  for (i = 0; i < kybs.length; i++) {
    var line = kybs[i].replace(/\//g, " ");
    var chars = line.replace(/</g, " ").split(' ');
    var needBr = false;
    for (j = 0; j < chars.length; j++) {
      if ((chars[j].length == 1) && (chars[j] != ' ') && (chars[j] != 'p') && (chars[j] != '>') && (chars[j] != "'") && (chars[j] != ":") && (chars[j] !== ";") && (chars[j] != "'") && (chars[j] != '"')) {
        onthisline++;
        cell = document.createElement('td');
        cell.bgcolor = 'gray';
        cell.align = 'center';
        link = document.createElement('a');
        link.href = '#' + chars[j];
        link.innerHTML = '<a href="#' + chars[j] + '" onclick="document.getElementById(' + sq + 'searchform' + sq + ').search.value+=' + sq + chars[j] + sq + ';return false;">' + chars[j] + '</a>';
        cell.appendChild(link);
        row.appendChild(cell);
        needBr = true;
        if (onthisline > 7) {
          tbl.appendChild(row);
          row = document.createElement('tr');
          onthisline = 0;
        }
      }
      else {
        if (chars[j].search(/special/g) != -1) {
          tbl.appendChild(row);
          row = document.createElement('tr');
          onthisline = 0;
        }
      }
    }
  }
  tbl.appendChild(row);
  kW.insertBefore(tbl, kW.firstChild);
  return true;
}

function keyPad() {
  var q = '"';
  var sq = "'";
  var selected = parseInt(mw.cookie.get('edittoolscharsubset'));
  if (isNaN(selected)) selected = 1;
  if (selected < 1) selected = 1; //skip zero, as that is the "templates" thing.
  var sF = document.getElementById("searchform");
  var searchBox = document.getElementById('searchBody');
  var kW = document.createElement('div');
  var tbl = document.createElement('table');
  tbl.bgcolor = 'black';
  tbl.id = 'searchKeyboard';
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  var link = document.createElement('a');
  var func;
  link.appendChild(document.createTextNode('testing'));
  cell.appendChild(link);
  cell.bgcolor = 'gray';
  cell.align = 'center';

  var req = newXMLHttpRequest();
  req.open('GET', mw.config.get('wgServer') + mw.config.get('wgScript') + '?title=MediaWiki:Edittools&action=raw', true);
  req.send(null);
  req.onreadystatechange = function () {
    if (req.readyState == 4) {
      html = req.responseText;
      //TODO: get all of them, extract name, add combobox, all loop thing that makes them visible=flase/visible=true.
      var menus = html.split('<p ');
      var menu = document.createElement('select');
      menu.style.display = 'inline';
      for (j = 2; j < menus.length; j++) {
        var lin = menus[j].split('title=')[1];
        if (!lin) lin = '';
        if (lin.indexOf('"') > -1) lin = lin.split('"')[1];
        if (lin.indexOf('edittools-') == 0) lin = lin.split('edittools-')[1];
        if (lin == '') {
          lin = 'Unnamed ' + j;
        }
        ;
        menu.options[menu.options.length] = new Option(lin);
      }
      menu.options[selected - 1].selected = true;
      menu.onchange = function () {
        keyPadSelection(this.selectedIndex);
      };
      var txt = html.split('<p ')[selected + 1];
      //TODO: add namespaces?  Most common shortcuts?  perhaps a separate button for them?
      kybs = txt.split('<charinsert>');
      var onthisline = 0;
      for (i = 1; i < kybs.length; i++) {
        var line = kybs[i].replace(/\//g, " ");
        var chars = line.replace(/</g, " ").split(' ');
        var needBr = false;
        for (j = 0; j < chars.length; j++) {
          if ((chars[j].length == 1) && (chars[j] != ' ') && (chars[j] != ":") && (chars[j] !== ";") && (chars[j] != 'p') && (chars[j] != '>') && (chars[j] != "'") && (chars[j] != '"')) {
            onthisline++;
            cell = document.createElement('td');
            cell.bgcolor = 'gray';
            cell.align = 'center';
            link = document.createElement('a');
            link.href = '#' + chars[j];
            link.innerHTML = '<a href="#' + chars[j] + '" onclick="document.getElementById(' + sq + 'searchform' + sq + ').search.value+=' + sq + chars[j] + sq + ';return false;">' + chars[j] + '</a>';
            cell.appendChild(link);
            row.appendChild(cell);
            needBr = true;
            if (onthisline > 7) {
              tbl.appendChild(row);
              row = document.createElement('tr');
              onthisline = 0;
            }
          }
          else {
            if (chars[j].search(/special/g) != -1) {
              tbl.appendChild(row);
              row = document.createElement('tr');
              onthisline = 0;
            }
          }
        }
      }
      tbl.appendChild(row);
      kW.appendChild(tbl);
      searchBox.appendChild(kW);
      kW.appendChild(menu);
    }
  }

  return;
}

function addKeyPadTimer() {
  setTimeout('keyPad()', 200); //wait 1/5th of one second.
}

function addKeyPadIcon() {
  var searchform = document.getElementById("searchform");
  if (!searchform) return; //not possible
  var keyPadButton = document.createElement('input');
  keyPadButton.type = 'imageName';
  keyPadButton.src = '//upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Keyboard-gray-old.jpg/60px-Keyboard-gray-old.jpg';
  keyPadButton.value = 'Keyboard';
  keyPadButton.title = 'Open keyboard window for entering special characters';
  keyPadButton.onclick = function () {
    keyPadButton.src = '';
    keyPadButton.value = '';
    keyPad();
    return false;
  };
  searchform.appendChild(keyPadButton);
}

jQuery(document).ready(addKeyPadTimer);
