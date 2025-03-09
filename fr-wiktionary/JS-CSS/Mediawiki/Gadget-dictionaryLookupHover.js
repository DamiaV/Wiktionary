/*[[Catégorie:JavaScript du Wiktionnaire|dictionaryLookupHover.js]]*/
//Stolen from fr wikiquote and fr wikinews.

jQuery(document).ready(function () {
  var goInline = false;
  var validLangs = {en: "en", fr: "fr", frc: "fr", fra: "fr", fre: "fr"};
  var wiktDomain = 'fr'; //default
  var stripAfterDash = /-.*$/;
  if (validLangs[wgUserLanguage]) {
    wiktDomain = validLangs[wgUserLanguage];
  }
  else if (validLangs[wgUserLanguage.replace(stripAfterDash)]) {
    wiktDomain = validLangs[wgUserLanguage.replace(stripAfterDash)];
  }
  else if (validLangs[wgContentLanguage]) {
    wiktDomain = validLangs[wgContentLanguage];
  }
  else if (validLangs[wgContentLanguage.replace(stripAfterDash)]) {
    wiktDomain = validLangs[wgContentLanguage.replace(stripAfterDash)];
  }
  var mozilla = false;
  if (document.all == null && document.getElementById != null && document.layers == null) {
    mozilla = true;
  }

  function rangeToWord(selection) {
//includes apostraphes
//fixme: if at begin of container.
    var finalText = selection.toString();
    try {
      var range = selection.getRangeAt(0);
      var rangeBefore = range.cloneRange();
      if (rangeBefore.startOffset !== 0) {
        rangeBefore.setStart(rangeBefore.startContainer, rangeBefore.startOffset - 1);
        var textNode = rangeBefore.cloneContents().firstChild;
        if (textNode.nodeType === 3 && textNode.data.charAt(0) === "'") {
          for (var i = 0; i < 30 /*to stop run-away*/; i++) {
            rangeBefore.setStart(rangeBefore.startContainer, rangeBefore.startOffset - 1);
            textNode = rangeBefore.cloneContents().firstChild;
            if ((textNode.nodeType !== 3) || (textNode.nodeType === 3 && textNode.data.match(/^\s/))) {
              rangeBefore.setStart(rangeBefore.startContainer, rangeBefore.startOffset + 1);
              finalText = rangeBefore.toString();
              rangeBefore.detach();
              range.detach();
              return finalText;
            }
          }
        }
      }
      var rangeAfter = range.cloneRange();
      rangeAfter.setEnd(rangeAfter.endContainer, rangeAfter.endOffset + 1);
      var textNode = rangeAfter.cloneContents().firstChild; //double var...
      if (textNode.nodeType === 3 && textNode.data.charAt(0) === "'") {
        for (var i = 0; i < 30 /*to stop run-away*/; i++) {
          rangeAfter.setEnd(rangeAfter.endContainer, rangeAfter.endOffset + 1);
          textNode = rangeAfter.cloneContents().firstChild;
          if ((textNode.nodeType !== 3) || (textNode.nodeType === 3 && textNode.data.match(/\s$/))) {
            rangeAfter.setEnd(rangeAfter.endContainer, rangeAfter.endOffset - 1);
            finalText = rangeAfter.toString();
            rangeAfter.detach();
            range.detach()
            return finalText;
          }
        }
      }
    }
    catch (e) {
      if (range) {
        range.detach();
      }
      return finalText;
    }
    return finalText;
  }

  function FindWord(e) {
    if (!e) {
      e = window.event;
    }
    if (e.shiftKey) {
      return true; //don't do anything if shift is pressed down. for compat with other things.
    }
    // stolen from http://www.codetoad.com/javascript_get_selected_text.asp
    var text;
    if (window.getSelection) {
      text = rangeToWord(window.getSelection());
    }
    else if (document.getSelection) {
      text = rangeToWord(document.getSelection());
    }
    /***
     else if (document.selection && document.selection.createRange ) {
          text = document.selection.createRange().text;
        } ***/
    if (text && text.length < 32) {
      return LookupWord(text, e.clientX, e.clientY);
    }
    if (!mozilla && window.event && document && document.body) {
      if (document.readyState != "complete") return false;
      //IE
      var my_range = document.selection.createRange();
      my_range.collapse();
      my_range.expand("word");

      LookupWord(my_range.text);

      e.returnValue = false;
      return false;
    }
    else if (e.rangeParent && e.rangeParent.nodeType == document.TEXT_NODE) {
      //mozilla part
      var rangeOffset = e.rangeOffset;
      var my_rangestr = e.rangeParent.data; //the event is dynamic!


      // which word the rangeOffset is in
      var wordlist1 = my_rangestr.substring(0, rangeOffset).split(/\s+/);
      var wordlist2 = my_rangestr.substring(rangeOffset, my_rangestr.length).split(/\s+/);

      if (my_rangestr.length > 0) {
        LookupWord(wordlist1[wordlist1.length - 1] + wordlist2[0], e.clientX, e.clientY);
      }
      e.preventDefault();
      e.stopPropagation();
    }

  }

  function getScrollX() {
    var scroll = 0; //default
    //standard
    if (window.pageXOffset !== undefined) {
      return window.pageXOffset;
    }
    //IE 6 in standards mode
    if (document.documentElement && document.documentElement.scrollLeft !== undefined) {
      return document.documentElement.scrollLeft;
    }
    //other IE
    if (document.body && document.body.scrollLeft !== undefined) {
      return document.body.scrollLeft;
    }
  }

  function getScrollY() {
    var scroll = 0; //default
    //standard
    if (window.pageYOffset !== undefined) {
      return window.pageYOffset;
    }
    //IE 6 in standards mode
    if (document.documentElement && document.documentElement.scrollTop !== undefined) {
      return document.documentElement.scrollTop;
    }
    //other IE
    if (document.body && document.body.scrollTop !== undefined) {
      return document.body.scrollTop;
    }
  }

  function getInnerWidth() {
    var scroll = 1024; //default
    //standard
    if (window.innerWidth !== undefined) {
      return window.innerWidth;
    }
    //IE 6 in standards mode
    if (document.documentElement && document.documentElement.clientWidth !== undefined) {
      return document.documentElement.clientWidth;
    }
    //other IE
    if (document.body && document.body.clientWidth !== undefined) {
      return document.body.clientWidth;
    }
  }

  function LookupWord(word, x, y) {
    if (!word.match(/(?:^[àâçéèêëîïôûùüÿÀÂÇÉÈÊËÎÏÔÛÙÜŸ]|[àâçéèêëîïôûùüÿÀÂÇÉÈÊËÎÏÔÛÙÜŸ]$)/)) {
      //this regex doesn't work if word starts or ends with accents.
      //is this regex even needed?
      var word2 = word.match(/\b(?:[\S]|(?!\.\s)\.)*\b/); //strip quotation marks
    }
    s = word2 ? word2[0] : word //if regex failed, fall back to word
    if (!s) {
      return false;
    } // test if null or empty.
    s = encodeURIComponent(s);

    if (window.clientInformation && window.clientInformation.macth(/MSIE/)) {
      //due to mediawiki bug
      var newwin = window.open('//' + wgUserLanguage + '.wiktionary.org/wiki/' + s + '?uselang=' + wgUserLanguage, 'temp', 'height=450,width=800,location,menubar,toolbar,status,resizable,scrollbars');
      if (newwin)
        newwin.focus();
      return true;
    }

    var frame = document.getElementById('dict-popup-frame');
    frame.style.display = 'block';
    frame.src = '//' + wiktDomain + '.wiktionary.org/w/api.php?action=parse&prop=text&format=xml&xslt=MediaWiki:extractFirst.xsl&page=' + s + '&lang=' + wgContentLanguage;
    var left = x + getScrollX();
    if (left + 420 > getInnerWidth() && left - 420 > 0) {
      left -= 420
    }
    frame.style.top = (y + getScrollY() + 10) + 'px';
    frame.style.left = left + 'px';

  }


  if (document.addEventListener) {
    document.addEventListener("dblclick", FindWord, true);
  }
  else if (document.all) {
    document.ondblclick = FindWord;
  }

});
jQuery(document).ready(function () {
  var frame = document.createElement('iframe');
  frame.style.border = 'none';
  frame.style.position = 'absolute';
  frame.style.display = 'none';
  frame.style.zIndex = '102';
  frame.style.width = '420px'; //default 300
  frame.style.height = '180px'; //default 150
  frame.id = 'dict-popup-frame';
  document.body.appendChild(frame);
//frame.src ='//en.wiktionary.org/w/api.php?action=parse&prop=text&format=xml&xslt=MediaWiki:extractFirst.xsl&page=' + s;

});

jQuery('click', function () {
  try {
    document.getElementById('dict-popup-frame').style.display = 'none';
  }
  catch (e) {
  }
});
