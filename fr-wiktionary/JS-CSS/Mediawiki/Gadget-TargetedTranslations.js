// [[Catégorie:JavaScript du Wiktionnaire|TargetedTranslations.js]]
// This is a modified version of [[:en:User:Atelaes/TargetedTranslations.js]]

function clarifyTransTable() {

  function setStartVars() {
    targetedTranslationsCookie = mw.cookie.get('TargetedTranslations') || "|";
    targetLanguages = targetedTranslationsCookie.split('|')[0].split(';');
    targetSubLanguages = targetedTranslationsCookie.split('|')[1].split(";");
    targetLanguagesParents = {};
    while (targetSubLanguages[0]) {
      (targetLanguagesParents[c = targetSubLanguages[0].split("/")[1]] = targetLanguagesParents[c] || []).push(targetSubLanguages.shift().split("/")[0]);
    }
  }

  var targetLanguages, targetSubLanguages, targetLanguagesParents, c, targetedTranslationsCookie;
  setStartVars();

  var targetTrans, targetTransEmpty;
  var tables = $(".translations").get();
  var lis, li, dls, dl, dds, dd;
  var NavFrame, NavHead, temp;

  // For lis, check if language is targeted
  function isRight(node) {
    for (var l = 0, ll = targetLanguages.length, t = node.innerText || node.textContent; l < ll; l++) {
      if (t.indexOf(targetLanguages[l] + ':') === 0) {
        return true;
      }
    }
  }

  // For dds, check if sub-language is targeted
  function isRight2(node) {
    if (temp == targetLanguagesParents[(node.innerText || node.textContent).split(":")[0]]) {
      node = node.parentNode.parentNode;
      node = (node.innerText || node.textContent).split(":")[0];
      for (var l = 0; l < temp.length; l++) {
        if (temp[l] == node) {
          return true;
        }
      }
    }
  }

  for (var i = 0, tableslength = tables.length; i < tableslength; i++) {
    if (tables[i].className == 'translations') {
      addTargetedTranslationsButton(tables[i]);
      if (targetedTranslationsCookie != "|") {
        if (!targetTransEmpty) {
          targetTrans = document.createElement('span');
          targetTransEmpty = true;
        }
        lis = tables[i].getElementsByTagName('li');
        for (var j = 0, lislength = lis.length; j < lislength; j++) {
          dls = (li = lis[j]).getElementsByTagName('dl');
          //If we have subelements in the li....
          if (dls.length == 1) {
            if (isRight(li) && li.childNodes[1].nodeName != 'DL') {
              temp = document.createElement('span');
              for (var k = 0; k < li.childNodes.length; k++) {
                if (li.childNodes[k].nodeName != 'DL') {
                  temp.appendChild(li.childNodes[k].cloneNode(true));
                }
              }
              if (!targetTransEmpty) {
                targetTrans.appendChild(document.createTextNode('; '));
              }
              targetTransEmpty = false;
              targetTrans.appendChild(temp);
            }
            dds = dls[0].getElementsByTagName('dd');
            for (var k = 0; k < dds.length; k++) {
              if (isRight2(dds[k])) {
                temp = document.createElement('span');
                temp.innerHTML = (dds[k].parentNode.parentNode.innerText || dds[k].parentNode.parentNode.textContent).split(":")[0] + ": " + dds[k].innerHTML;
                if (!targetTransEmpty) {
                  targetTrans.appendChild(document.createTextNode('; '));
                }
                targetTransEmpty = false;
                targetTrans.appendChild(temp);
              }
            }
          }
          else if (isRight(li)) {
            temp = document.createElement('span');
            temp.innerHTML = li.innerHTML;
            if (!targetTransEmpty) {
              targetTrans.appendChild(document.createTextNode('; '));
            }
            targetTransEmpty = false;
            targetTrans.appendChild(temp);
          }
        }
        if (!targetTransEmpty) {
          NavHead = $(tables[i].parentNode.parentNode).find(".NavHead")[0];
          NavHead.appendChild(document.createTextNode(' - '));
          NavHead.appendChild(targetTrans);
        }
      }
    }
  }


  function addTargetedTranslationsButton(node) {
    var button = node.parentNode.insertBefore(document.createElement('div'), node).appendChild(newNode('a',
        'Sélectionner les langues désirées',
        {
          'style': 'font-size:85%;', 'href': 'javascript:', 'click': function () {
            addtargetlangfavoriteicons(button.parentNode.nextSibling.getElementsByTagName('tr')[0].getElementsByTagName('li'));
            for (var i = 0; i++ < 4;) {
              button.parentNode.nextSibling.getElementsByTagName('ul')[i % 2].style[i < 3 ? 'listStyleImage' : 'listStyleType'] = 'none'
            }
            button.parentNode.replaceChild(newNode('a', 'Sauvegarder', {
              'style': 'font-size:85%;',
              'href': "javascript:location.reload(true)"
            }), button)
          }
        }));
  }

  function addtargetlangfavoriteicons(q) {

    function w(x, xx) {
      x.insertBefore(newNode('a', {
        'class': "translationtargetstar", click: function () {
          selecttargetlangfavorite(x.firstChild, xx)
        }
      }), x.firstChild);
      if ((xx && isRight2(x)) || ((!xx) && isRight(x))) {
        x.firstChild.className += "checked"
      }
    }

    for (var i = 0; i < q.length; i++) {
      w(q[i]);
      for (var ii = 0, xx = q[i].getElementsByTagName('dd'); ii < xx.length; ii++) {
        w(xx[ii], true)
      }
    }
  }

  function selecttargetlangfavorite(qq, xx) {
    if ((xx && isRight2(qq.parentNode)) || ((!xx) && isRight(qq.parentNode))) {
      temp = targetedTranslationsCookie;
      qq.className = "translationtargetstar";
      if (!xx) { // rm li pref
        temp = (';' + temp.split("|")[0].replace(/;/g, ';;') + ';').replace(';' + (qq.parentNode.innerText || qq.parentNode.textContent).split(":")[0] + ';', '').replace(/;(?=;)|;$|^;/g, "") + "|" + temp.split("|")[1];
      }
      else { // rm dd pref
        temp = temp.split("|")[0] + "|" + temp.split("|")[1].replace((qq.parentNode.parentNode.parentNode.innerText || qq.parentNode.parentNode.parentNode.textContent).split(":")[0] + "/" + (qq.parentNode.innerText || qq.parentNode.textContent).split(":")[0], '').replace(/;(?=;)|;$|^;/, "");
      }
    }
    else {
      temp = targetedTranslationsCookie;
      if (!xx) { // add li pref
        temp = temp.replace(/\|/, (temp.charAt(0) == "|" ? "" : ";") + (qq.parentNode.innerText || qq.parentNode.textContent).split(":")[0] + "|");
      }
      else { // add dd pref
        temp += (temp.split("|")[1] === "" ? "" : ";") + (qq.parentNode.parentNode.parentNode.innerText || qq.parentNode.parentNode.parentNode.textContent).split(":")[0] + "/" + (qq.parentNode.innerText || qq.parentNode.textContent).split(":")[0];
      }
      qq.className = "translationtargetstarchecked";
    }
    if ('localStorage' in window) {
      localStorage.TargetedTranslations = temp;
    }
    else {
      mw.cookie.set('TargetedTranslations', temp);
    }
    setStartVars();
  }
}

// Chargement si page d'article
if (mw.config.get('wgNamespaceNumber') > 0 && !window.suppressTargetedTranslations) {
  jQuery(clarifyTransTable);
}
