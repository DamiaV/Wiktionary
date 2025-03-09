// [[Catégorie:JavaScript du Wiktionnaire|panliens.js]]
function changeliens(itanodes, element) {
  for (var m = 0; m < itanodes.length; m++) {
    var itanode = itanodes[m];
    // Text node?
    if (itanode.nodeType == 3) {
      // Split words
      var words = itanode.nodeValue.split(" ");
      var newlinear = [];
      for (w = 0; w < words.length; w++) {
        var word = words[w];

        if (word.match("[0-9]") || word == '' || word.match(/^[•\.,\?;:!…—\(\)\[\]\{\}=\+«»\"\r\n\s]+$/)) {
          newlinear[w] = word;
          continue;
        }

        // Strip useless punctuation characters
        var patt = /[•\.,\?;:!…—\(\)\[\]\{\}=\+«»\"\r\n\s]/;

        // At start
        var s = 0;
        var e = 0;
        for (s = 0; s < word.length; s++) {
          if (!word[s].match(patt)) {
            break;
          }
        }

        // At the end
        for (e = 0; e < word.length; e++) {
          var eend = word.length - e - 1;
          if (!word[eend].match(patt)) {
            break;
          }
        }

        // Finally
        string = word.substr(s, (word.length - e - s));
        var start = word.substr(0, s);
        var end = word.substr(word.length - e);

        // Joined punctuation
        if (string.match(/[´’']/)) {
          comp = string.split(/['´’]/);

          complete = [];
          for (var c = 0; c < comp.length - 1; c++) {
            complete[c] = lienmot(comp[c] + "’");
          }
          complete[c] = lienmot(comp[c]);
          newlinear[w] = start + complete.join('') + end;

        }
        else {
          newlinear[w] = start + lienmot(string) + end;
        }
      }
      var newline = newlinear.join(' ');

      var newi = document.createElement(element);
      newi.innerHTML = newline;
      itanode.parentNode.replaceChild(newi, itanode);
    }
  }
}

function lienmot(mot) {
  return '<a href="/wiki/' + mot + '" title="' + mot + '" class="pseudolink">' + mot + '</a>';
}

function panliens() {
  // Limitation aux pages d'article
  if (mw.config.get('wgNamespaceNumber') != 0) {
    return;
  }

  var types = ['dd', 'p', 'li', 'i', 'div'];

  for (var t = 0; t < types.length; t++) {
    var phrases = document.getElementsByTagName(types[t]);
    for (var i = 0; i < phrases.length; i++) {
      var mots = phrases[i].childNodes;
      changeliens(mots, 'text');
    }
  }
}

jQuery(document).ready(panliens);
