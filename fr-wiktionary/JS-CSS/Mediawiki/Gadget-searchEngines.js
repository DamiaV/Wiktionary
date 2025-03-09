/**
 [[Catégorie:JavaScript du Wiktionnaire|searchengine]]
 * Modifie Special:Search pour pouvoir utiliser différents moteurs de recherche,
 * disponibles dans une boîte déroulante.
 * Auteurs : Jakob Voss, Guillaume, importé depuis la Wiki allemande
 *
 * Emprunté à Wikipédia ([[w:Mediawiki:Common.js]])
 * <pre><nowiki>
 */

function externalSearchEngines() {
  if (typeof SpecialSearchEnhanced2Disabled != 'undefined') return;
  if (mw.config.get('wgPageName') != "Spécial:Recherche") return;

  var mwSearchTopTable = document.getElementById("mw-search-top-table");
  if (!mwSearchTopTable) return;

  var firstEngine = "mediawiki";

  var choices = document.createElement("div");
  choices.setAttribute("id", "searchengineChoices");
  choices.style.clear = "left";
  choices.style.paddingTop = "0.3em";

  var lsearchbox = document.getElementById("searchText");
  if (!lsearchbox) lsearchbox = document.getElementById("powerSearchText");
  if (!lsearchbox) return;
  var initValue = lsearchbox.value;

  var space = "";

  for (var id in searchEngines) {
    var engine = searchEngines[id];
    if (engine.ShortName) {
      if (space) choices.appendChild(space);
      space = document.createTextNode(" ");

      var attr = {
        type: "radio",
        name: "searchengineselect",
        value: id,
        onFocus: "changeSearchEngine(this.value)",
        id: "searchengineRadio-" + id
      };

      var html = "<input";
      for (var a in attr) html += " " + a + "='" + attr[a] + "'";
      html += " />";
      var span = document.createElement("span");
      span.innerHTML = html;

      choices.appendChild(span);
      var label = document.createElement("label");
      label.htmlFor = "searchengineRadio-" + id;
      if (engine.Template.indexOf('http') === 0) {
        var lienMoteur = document.createElement("a");
        lienMoteur.href = engine.Template.replace("{searchTerms}", initValue).replace("{language}", "fr");
        lienMoteur.appendChild(document.createTextNode(engine.ShortName));
        label.appendChild(lienMoteur);
      }
      else {
        label.appendChild(document.createTextNode(engine.ShortName));
      }

      choices.appendChild(label);
    }
  }
  var input = document.createElement("input");
  input.id = "searchengineextraparam";
  input.type = "hidden";

  $(mwSearchTopTable).after(choices, input);

  changeSearchEngine(firstEngine, initValue);
}

window.changeSearchEngine = function (selectedId, searchTerms) {
  var currentId = document.getElementById("searchengineChoices").currentChoice;
  if (selectedId == currentId) return;

  document.getElementById("searchengineChoices").currentChoice = selectedId;
  var radio = document.getElementById('searchengineRadio-' + selectedId);
  radio.checked = "checked";

  var engine = searchEngines[selectedId];
  var p = engine.Template.indexOf('?');
  var params = engine.Template.substr(p + 1);

  var form;
  if (document.forms.search) {
    form = document.forms.search;
  }
  else {
    form = document.getElementById("powersearch");
  }
  form.setAttribute("action", engine.Template.substr(0, p));

  var l = ("" + params).split("&");
  for (var idx = 0; idx < l.length; idx++) {
    var peng = l[idx].split("=");
    var pValue = peng[1];

    if (pValue == "{language}") {
    }
    else if (pValue == "{searchTerms}") {
      var input = $("#searchText");

      if (!input.is('input')) {
        input = input.find('input').first();
      }

      input.attr('name', peng[0]);
    }
    else {
      $("#searchengineextraparam").attr('name', peng[0]).val(pValue);
    }
  }
};

// Définition des moteurs à ajouter
var searchEngines = {
  mediawiki: {
    ShortName: "Rechercher un mot",
    Template: "/w/index.php?search={searchTerms}"
  },
  graphies: {
    ShortName: "Recherche avec joker",
    Template: "//tools.wmflabs.org/anagrimes/chercher_graphie.php?graphie={searchTerms}&langue={language}"
  },
  rimes: {
    ShortName: "Recherche de rimes",
    Template: "//tools.wmflabs.org/anagrimes/chercher_prononciation.php?rime={searchTerms}&langue={language}&place=fin&flex=oui&loc=oui&gent=oui"
  },
  anagr: {
    ShortName: "Recherche d’anagrammes",
    Template: "//tools.wmflabs.org/anagrimes/chercher_anagrammes.php?mot={searchTerms}&langue={language}&flex=oui&gent=oui&nom_propre=oui"
  },
  wikiwix: {
    ShortName: "Wikiwix",
    Template: "//fr.wikiwix.com/index.php?action={searchTerms}&lang={language}&disp=dict"
  },
};

// Ajout
if (mw.config.get('wgPageName') === "Spécial:Recherche") {
  jQuery(externalSearchEngines);
}

// </nowiki></pre>
