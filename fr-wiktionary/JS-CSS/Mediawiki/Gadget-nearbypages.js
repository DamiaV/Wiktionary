// [[Catégorie:JavaScript du Wiktionnaire|nearbypages.js]]
function WiktNearby() {
  this.alwaysLeftToRight = mw.cookie.get('WiktNearbyAlwaysLTR') == "true";
  this.counter = 0;
  this.pending = 0;

  // helper functions
  function mwEncodeURIComponent(term) {
    return encodeURIComponent(term).replace(/%2F/g, "/");
  }

  this.makeHeadingLink = function (term, langname, tagName) {
    var ele = document.createElement(tagName);
    if (tagName == "a") {
      var href = "/wiki/";
      if (mw.config.get('wgNamespaceNumber') != 0)
        href += mw.config.get('wgCanonicalNamespace') + ":";
      href += mwEncodeURIComponent(term);
      if (/^[^\*_]/.test(langname))
        href += "#" + langname;
      ele.href = href;
    }
    if (this.alwaysLeftToRight)
      term = "\u200e" + term;
    ele.appendChild(document.createTextNode(term));
    return ele;
  }

  this.doHeadings = function (nearby) {
    var arrows = ["«", "»"];

    // point to toward a and z or always point toward z?
    var larr = Math.floor(Math.random() * 2);

    var bc = document.getElementById("bodyContent");
    var h2s = bc.getElementsByTagName("h2");

    outer: for (var i = 0; i < h2s.length; ++i) {
      var spans = h2s[i].getElementsByTagName("span");
      inner: for (var j = 0; j < spans.length; ++j) {
        if (spans[j].className == "mw-headline") {
          langname = spans[j].textContent || spans[j].innerText;
          if (nearby.langname == langname) {
            // add in reverse order since we use insertBefore
            var div = document.createElement("div");
            div.className = "nearby-pages";
            div.title = "Alphabetical order";
            var bold = document.createElement("b");
            bold.appendChild(document.createTextNode("Pages proches : "));
            div.appendChild(bold);
            if ("prev" in nearby) {
              for (k = 0; k < nearby.prev.length; ++k) {
                div.appendChild(this.makeHeadingLink(nearby.prev[k], nearby.langname, "a"));
                div.appendChild(document.createTextNode("\xa0" + arrows[larr] + " "));
              }
            }
            div.appendChild(document.createTextNode(" "));
            div.appendChild(this.makeHeadingLink(mw.config.get('wgTitle'), nearby.langname, "b"));
            div.appendChild(document.createTextNode(" "));
            if ("next" in nearby) {
              for (k = 0; k < nearby.next.length; ++k) {
                div.appendChild(document.createTextNode(" " + arrows[1] + "\u00a0"));
                div.appendChild(this.makeHeadingLink(nearby.next[k], nearby.langname, "a"));
              }
            }
            h2s[i].parentNode.insertBefore(div, h2s[i].nextSibling);
          }
        }
      }
    }
  }

  this.doNavBar = function (nearby) {
    var terms = [];
    var mid = 0;

    if ("prev" in nearby) {
      for (i = 0; i < nearby.prev.length; ++i)
        terms.push(nearby.prev[i]);
      mid = nearby.prev.length;
    }
    terms.push(nearby.inputterm);
    if ("next" in nearby) {
      for (i = 0; i < nearby.next.length; ++i)
        terms.push(nearby.next[i]);
    }

    // language name or namespace name or "browse"
    var heading;
    var is_language = false;
    if (nearby.langname.substr(0, 1) == "_") {
      heading = nearby.langname.substr(1);
    }
    else if (nearby.langname == "*") {
      heading = "Browse";
    }
    else {
      heading = nearby.langname;
      is_language = true;
    }

    // create a portlet
    var navPortlet = document.getElementById("p-navigation");
    if (!navPortlet) return;

    var nearbyWrapper = document.getElementById("p-nearby");

    if (!nearbyWrapper) {
      nearbyWrapper = document.createElement("div");
      nearbyWrapper.id = "p-nearby";
      navPortlet.parentNode.insertBefore(nearbyWrapper, navPortlet.nextSibling);
    }

    var portlet = document.createElement('div');
    portlet.className = skin == "vector" ? "portal" : "portlet";
    var num = "seq" in nearby ? nearby.seq : this.counter;
    this.counter++;
    portlet.id = 'p-nearby-' + num;

    // find the right place to add this language
    var beforeHere = null;
    var portlets = nearbyWrapper.getElementsByTagName("div");
    for (var i = 0; i < portlets.length; i++) {
      if (portlets[i].id.substr(9) > num) {
        beforeHere = portlets[i];
        break;
      }
    }

    if (beforeHere)
      nearbyWrapper.insertBefore(portlet, beforeHere);
    else
      nearbyWrapper.appendChild(portlet);

    var ph5 = document.createElement('h5');
    ph5.setAttribute('lang', 'en');
    ph5.setAttribute('xml:lang', 'en');
    portlet.appendChild(ph5);

    var ha = document.createElement("a");
    ha.href += "#" + nearby.langname;
    ha.style.textDecoration = "none";
    ph5.appendChild(ha);

    ha.appendChild(document.createTextNode(heading));

    var pBody = document.createElement('div');
    pBody.className = skin == "vector" ? "body" : "pBody";
    portlet.appendChild(pBody);

    var pul = document.createElement('ul');
    pBody.appendChild(pul);

    // add link to portlet
    for (var i = 0; i < terms.length; i++) {
      var pli = document.createElement('li');
      pul.appendChild(pli);

      var pla = document.createElement('a');
      var href = "/wiki/";
      if (mw.config.get('wgNamespaceNumber') != 0)
        href += mw.config.get('wgCanonicalNamespace') + ":";
      href += mwEncodeURIComponent(terms[i]);
      if (is_language)
        href += "#" + nearby.langname;
      pla.href = href;

      if (i == mid) {
        if (nearby.exists)
          pla.style.fontWeight = "bold";
        else
          pla.style.color = "#ba0000";
      }
      pli.appendChild(pla);

      pla.appendChild(document.createTextNode(terms[i]));
    }
  }

  // toolserver has sent back results. add them to the page
  this.callback = function (nearby) {
    // we will always give up if there's an error in the json response
    if ("error" in nearby) return;

    // in the future we may handle multiple languages per request
    if (!"langname" in nearby) return;

    var doHeadings = mw.cookie.get('WiktNearbyPagesLangHeadings') == "true";
    var doNavBar = mw.cookie.get('WiktNearbyPagesNavbar') == "true";

    // since these options are new they default to off
    // so having nearbypages enabled with both options off means the old behaviour
    // which means display both
    if (doHeadings == false && doNavBar == false)
      doHeadings = doNavBar = true;

    if (doHeadings)
      this.doHeadings(nearby);

    if (doNavBar)
      this.doNavBar(nearby);

    --this.pending;
  }

  // entry point
  this.execute = function () {
    var bc = document.getElementById("bodyContent");
    var langname;

    // article = page = entries
    if (mw.config.get('wgNamespaceNumber') == 0) {
      // redirect
      var cs = document.getElementById("contentSub");
      cs = cs.textContent || cs.innerText;
      if (cs == "Redirect page") {
        ++this.pending;
        query("_Redirect", mw.config.get('wgTitle'));

        // normal article = page = entries
      }
      else {
        var h2s = bc.getElementsByTagName("h2");
        var nolangs = true;

        var n = 1;
        outer: for (var i = 0; i < h2s.length; ++i) {
          var spans = h2s[i].getElementsByTagName("span");
          inner: for (var j = 0; j < spans.length; ++j) {
            if (spans[j].className == "mw-headline") {
              ++this.pending;
              query(spans[j].textContent || spans[j].innerText, mw.config.get('wgTitle'), n++);
              nolangs = false;
            }
          }
        }
        // normal article = page with no language headings
        // this is usually while editing or viewing a redlink
        if (nolangs) {
          // re-enabled with new implementation
          ++this.pending;
          query("*", mw.config.get('wgTitle'));
        }
      }
      // other namespace
    }
    else {
      ++this.pending;
      query("_" + mw.config.get('wgCanonicalNamespace'), mw.config.get('wgTitle'));
    }

    function query(lang, term, seq) {
      mw.loader.load(
          "http://toolserver.org/~jackpotte/nearbypages.fcgi?"
          + "langname=" + lang + "&term=" + term + "&num=4"
          + (seq ? "&seq=" + seq : "")
          + "&callback=wiktNearby.callback");
    }
  }
}

// we need a globally visible JSONP callback
var wiktNearby;

jQuery(function () {
  wiktNearby = new WiktNearby();
  wiktNearby.execute();
});
