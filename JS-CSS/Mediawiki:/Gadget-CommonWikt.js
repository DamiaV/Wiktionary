/*******************************************************************************
 * (en)
 * Various utility functions for gadgets.
 *******************************************************************************
 * (fr)
 * Différentes fonctions utiles pour les gadgets.
 *******************************************************************************
 * [[Catégorie:JavaScript du Wiktionnaire|CommonWikt.js]]
 *******************************************************************************/

// Polyfill
if (!String.prototype.format) {
  /**
   * Formats a string.
   * @param var_args {...Object} The list of values to insert into the string.
   * @return {string} The formatted string.
   */
  String.prototype.format = function (var_args) {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] !== "undefined" ? args[number] : match;
    });
  };
}

// Polyfill
if (!String.prototype.includes) {
  /**
   * Checks whether this string contains the given string.
   * @param value {string} The value to search for.
   * @return {boolean} True if the value is present.
   */
  String.prototype.includes = function (value) {
    return this.indexOf(value) !== -1;
  };
}

// Polyfill
if (!Array.prototype.includes) {
  /**
   * Checks whether this array contains the given value.
   * @param value {*} The value to search for.
   * @return {boolean} True if the value is present.
   */
  Array.prototype.includes = function (value) {
    return this.indexOf(value) !== -1;
  };
}

/**
 * Global object containing functions and variables for gadgets.
 */
window.wikt = window.wikt || {};
wikt.page = {};
wikt.text = {};
wikt.edit = {};
wikt.user = {};
wikt.html = {};
wikt.cookie = {};
wikt.gadgets = {};

/*
 * Text
 */

/**
 * Converts the first character in the given string to lower case.
 * @param string {string} The string to convert.
 * @return {string} The converted string.
 */
wikt.text.toLowerCaseFirst = function (string) {
  return string.length > 0 ? string.substr(0, 1).toLowerCase() + string.substr(1, string.length) : "";
};

/**
 * Converts the first character in the given string to upper case.
 * @param string {string} The string to convert.
 * @return {string} The converted string.
 */
wikt.text.toUpperCaseFirst = function (string) {
  return string.length > 0 ? string.substr(0, 1).toUpperCase() + string.substr(1, string.length) : "";
};

/*
 * Editing
 */

/**
 * Returns the edit box as a jQuery object.
 * @return {{wikiEditor: function}|null} The jQuery element corresponding
 * to the edit box or null if it could not be found.
 */
wikt.edit.getEditBox = function () {
  var $editBox = $("#wpTextbox1");
  return $editBox.length ? $editBox : null;
};

/**
 * Gets the text from the edit textarea.
 * Supports syntax coloring.
 * @param $textInput {Object?} The text input or textarea to use instead of the main edit box.
 * @return text {string}
 */
wikt.edit.getText = function ($textInput) {
  var $editBox = $textInput || this.getEditBox();
  return $editBox ? $editBox.val() : null;
};

/**
 * Sets the text in the edit textarea.
 * Supports syntax coloring.
 * @param text {string} The text to set.
 * @param $textInput {Object?} The text input or textarea to use instead of the main edit box.
 */
wikt.edit.setText = function (text, $textInput) {
  var $editBox = $textInput || this.getEditBox();

  if ($editBox) {
    $editBox.val(text);
  }
};

/**
 * Inserts the given text at the specified position in the edit area.
 * @param index {number} The index at which the text is to be inserted.
 * Supports syntax coloring.
 * @param text {string} The text to insert.
 * @param $textInput {Object?} The text input or textarea to use instead of the main edit box.
 */
wikt.edit.insertText = function (index, text, $textInput) {
  var $editBox = $textInput || this.getEditBox();

  if ($editBox) {
    var currentText = $editBox.val();
    var newText = currentText.substring(0, index) + text + currentText.substring(index);
    $editBox.val(newText);
  }
};

/**
 * Fetches then returns the current location of the text cursor inside the edit box.
 * @param $textInput {Object?} The text input or textarea to use instead of the main edit box.
 * @return {number} The index from the start of the text.
 */
wikt.edit.getCursorLocation = function ($textInput) {
  var $editBox = $textInput || this.getEditBox();

  if ($editBox) {
    if (this._isCodeMirrorInput($editBox) && this.isCodeMirrorEnabled()) {
      return this.getCodeMirror().indexFromPos(this.getCodeMirror().getCursor());
    } else {
      return $editBox.get(0).selectionStart;
    }
  }
};

/**
 * Sets the location of the text cursor inside the edit box.
 * @param position {number} The location.
 * @param $textInput {Object?} The text input or textarea to use instead of the main edit box.
 */
wikt.edit.setCursorLocation = function (position, $textInput) {
  var $editBox = $textInput || this.getEditBox();

  if ($editBox) {
    if (this._isCodeMirrorInput($editBox) && this.isCodeMirrorEnabled()) {
      this.getCodeMirror().setCursor(this.getCodeMirror().posFromIndex());
    } else {
      $editBox.get(0).selectionStart = position;
      $editBox.get(0).selectionEnd = position;
    }
  }
}

/**
 * Returns the currently selected text in the edit box.
 * @param $textInput {Object?} The text input or textarea to use instead of the main edit box.
 * @return {string} The selected text.
 */
wikt.edit.getSelectedText = function ($textInput) {
  var $editBox = $textInput || this.getEditBox();

  if (this._isCodeMirrorInput($editBox) && this.isCodeMirrorEnabled()) {
    return this.getCodeMirror().getSelection();
  } else {
    var start = $editBox.get(0).selectionStart;
    var end = $editBox.get(0).selectionEnd;
    return $editBox.val().substring(start, end);
  }
}

/**
 * Replaces the currently selected text in the edit box by the given one.
 * @param replacement {string} The replacement text.
 * @param $textInput {Object?} The text input or textarea to use instead of the main edit box.
 * @return {string} The selected text.
 */
wikt.edit.replaceSelectedText = function (replacement, $textInput) {
  var $editBox = $textInput || this.getEditBox();

  if (this._isCodeMirrorInput($editBox) && this.isCodeMirrorEnabled()) {
    this.getCodeMirror().replaceSelection(replacement);
  } else {
    var start = $editBox.get(0).selectionStart;
    var end = $editBox.get(0).selectionEnd;
    var text = $editBox.val();
    $editBox.val(text.substring(0, start) + replacement + text.substring(end));
  }
}

/**
 * Indicates whether the toolbar is enabled.
 * @return {boolean} True if the toolbar is enabled.
 */
wikt.edit.isEditToolbarEnabled = function () {
  return typeof this.getEditBox().wikiEditor !== "undefined";
}

/**
 * Returns the toolbar if enabled.
 * @return {Object|null} The toolbar or null if it is disabled.
 */
wikt.edit.getToolbar = function () {
  return this.isEditToolbarEnabled() ? this.getEditBox().wikiEditor() : null;
}

/**
 * Indicates whether syntax coloring is enabled.
 * @return {boolean} True if syntax coloring is enabled.
 */
wikt.edit.isCodeMirrorEnabled = function () {
  return $(".CodeMirror").length !== 0;
}

/**
 * Returns the handle to CodeMirror.
 * @return {Object} CodeMirror handle.
 */
wikt.edit.getCodeMirror = function () {
  // Caching CodeMirror for quicker repeated access.
  if (!this._cm) {
    this._cm = $(".CodeMirror").prop("CodeMirror");
  }
  return this._cm;
}

/**
 * Indicates whether the given element is the edit box used by CodeMirror.
 * @return {boolean} True if the element is used by CodeMirror.
 */
wikt.edit._isCodeMirrorInput = function ($textInput) {
  var $editBox = this.getEditBox();
  return $textInput && $editBox && $textInput.attr("id") === $editBox.attr("id");
}

/**
 * Returns the edit summary field.
 * @return {Object} The edit summary field.
 */
wikt.edit.getEditSummaryField = function () {
  return $("#wpSummary");
}

/*
 * Users
 */

/**
 * Tests whether the current user belongs to the given group.
 * @param groupname {string} The group’s name.
 * @return {boolean} True if the user belongs to the group.
 */
wikt.user.isInUsergroup = function (groupname) {
  var usergroups = mw.config.get('wgUserGroups');

  if (!usergroups) {
    return false;
  }
  for (var i in usergroups) {
    if (usergroups.hasOwnProperty(i) && usergroups[i] === groupname) {
      return true;
    }
  }

  return false;
};

/**
 * Teste le niveau de l’utilisateur courant.
 * Tests the current user’s level.
 * @param levelmask {int}
 * - bits 7 to 4 = bitmask.
 * - bits 3 to 0 = wgUserLevel value to obtain after masking (binary and).
 *   ex: 0x40 for non-admins.
 * @return {boolean} True if the value corresponds.
 */
wikt.user.hasLevel = function (levelmask) {
  return (wgUserLevel & (levelmask >>> 4)) === (wgUserLevel & 0xF);
};

/*
 * Page functions
 */

/**
 * Returns the title the current page.
 * @return {string} The title without the namespace.
 */
wikt.page.getCurrentPageTitle = function () {
  return mw.config.get("wgTitle");
};

/**
 * Returns the namespace ID of the current page.
 * @return {number} The namespace ID.
 */
wikt.page.getCurrentPageNamespaceId = function () {
  return mw.config.get("wgNamespaceNumber");
};

/**
 * Tells whether the current page’s namespace is one of the given ones.
 * @param namespacesNames {Array<string>} The list of namespace names.
 * @return {boolean} True if the current page’s namespace is in the list, false otherwise.
 */
wikt.page.hasNamespaceIn = function (namespacesNames) {
  var authorizedNamespaces = [];

  for (var i = 0; i < namespacesNames.length; i++) {
    var ns = namespacesNames[i].toLowerCase().replace(/\s/g, "_");
    authorizedNamespaces.push(mw.config.get("wgNamespaceIds")[ns]);
  }

  return authorizedNamespaces.includes(wikt.page.getCurrentPageNamespaceId())
};

/**
 * Adds the namespace name to the given page name.
 * @param namespaceId {int} The namespace’s ID.
 * @param pageName {string} The page name.
 * @return {string} Full page name as « namespage:pageName ».
 */
wikt.page.getFullPageName = function (namespaceId, pageName) {
  // "" is main namespace
  if (namespaceId === mw.config.get("wgNamespaceIds")[""]) {
    return pageName;
  }
  return mw.config.get("wgFormattedNamespaces")[namespaceId] + ":" + pageName;
};

/**
 * Returns all the subpages of the given base page that match the given CirrusSearch pattern.
 * Sends an AJAX request to WikiMedia’s servers.
 * @param namespaceId {number} The page’s namespace ID.
 * @param basePageName {string} The page’s name.
 * @param subPagesPattern {string} The CirrusSearch pattern subpages’ names must match.
 * @param callback {Function<Object,void>} A callback function.
 */
wikt.page.getSubpages = function (namespaceId, basePageName, subPagesPattern, callback) {
  // Échapement des caractères spéciaux de regex
  var escaped = basePageName.replace(/([~@#&*()-+{}\[\]|\\<>?./])/g, "\\$1");
  $.get(
      "https://fr.wiktionary.org/w/api.php",
      {
        action: "query",
        list: "search",
        srnamespace: namespaceId,
        srprop: "",
        srsearch: "intitle:/{0}\\/{1}/".format(escaped, subPagesPattern),
        format: "json",
      },
      callback,
      "json"
  );
}

/**
 * Adds the given buttons to the current page’s title.
 * @param buttons {Array<Object>} The buttons to add.
 * Each button object has to define a text, a title and
 * a callback function.
 */
wikt.page.addButtonAfterTitle = function (buttons) {
  var $heading = $("#firstHeading");

  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    var text = button["text"];
    var title = button["title"];
    var $span = $("<span>");
    var $link = $("<a>");

    $span.addClass("noprint ancretitres");
    $span.attr("style", "font-size: small; font-weight: normal; " +
        "-moz-user-select: none; -webkit-user-select: none; " +
        "-ms-user-select: none; user-select: none; margin-left: 5px;");

    $link.text(text);
    $link.attr("href", "#");
    $link.attr("title", title);
    $link.on("click", button["callback"]);

    $span.append($link);
    $heading.append($span);
  }
}

/**
 * Adds a listener to DOM changes for the current page.
 * @param callback {function} Function to execute when mutations are observed.
 * Parameters are the list of mutations and the observer which invoked the callback.
 * @param node {HTMLElement?} The root element to monitor. If null, the body node will be used.
 * @param options {object?} Custom options. Default: attributes, childList & subtree.
 * (see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit for accepted values)
 * @return {MutationObserver} The created observer instance.
 */
wikt.page.onDOMChanges = function (callback, node, options) {
  var targetNode = node || document.body;
  var config = options || {attributes: true, childList: true, subtree: true};
  var observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  return observer;
}

/*
 * Utilisations :
 *
 * MediaWiki:Gadget-CreerFlexionFr.js
 * MediaWiki:Gadget-CreerNouveauMot.js
 *
 * Utilisateur:Maintenance gadgets/Gadget-CreerNouveauMot.js
 * Utilisateur:Maintenance gadgets/Gadget-CreerNouveauMot.js
 *
 * Utilisateur:GaAsBot/CreerConjugFr.js (2018)
 * (Utilisateur:Automatik/test2.js)
 * (Utilisateur:Déesse23/Gadget-CreerNouveauMot.js) (2013)
 * (Utilisateur:Eiku/Gadget-CreerNouveauMot.js) (2013)
 * (Utilisateur:Automatik/Gadget-CreerNouveauMot.js) (2013)
 * Utilisateur:Otourly/Gadget-CreerFlexionIt.js
 * Utilisateur:Pamputt/Gadget-CreerFlexionDa.js
 * (Utilisateur:Pamputt/Gadget-CreerFlexionDaTest.js)
 * Utilisateur:Pamputt/Gadget-CreerFlexionEn.js
 * Utilisateur:Pamputt/Gadget-CreerFlexionEs.js
 * Utilisateur:Pamputt/Gadget-CreerFlexionFr.js
 * Utilisateur:Pamputt/Gadget-CreerFlexionFr2.js
 */
/**
 * Computes the sorting key for the given word.
 * French words only need to take apostrophies into account.
 * @param word {string} The word.
 * @return {string} The sorting key.
 */
function CommonWikt_CleTri(word) {
  var key = word;

  key = key.replace(/[ĉ]/g, "cx");
  key = key.replace(/[ĝ]/g, "gx");
  key = key.replace(/[ĥ]/g, "hx");
  key = key.replace(/[ĵ]/g, "jx");
  key = key.replace(/[ŝ]/g, "sx");
  key = key.replace(/[ŭ]/g, "ux");
  key = key.replace(/['’]/g, "");
  key = key.replace(/[-/]/g, " ");

  return key;
}

wikt.page.getSortingKey = CommonWikt_CleTri;

/**
 * Parses and renders the given wikicode.
 * /!\ Makes a synced AJAX request to the server. /!\
 * @param wikicode {string} The wikicode to parse.
 * @param onlyFirstParagraph {boolean?} If true, only returns the HTML contents of the first paragraph.
 * @return {Object|string} The corresponding jQuery object or the HTML code if onlyFirstParagraph is true.
 */
wikt.page.renderWikicode = function (wikicode, onlyFirstParagraph) {
  var html;

  $.ajax({
    url: "https://fr.wiktionary.org/w/api.php",
    data: {
      action: "parse",
      text: wikicode,
      contentmodel: "wikitext",
      format: "json",
    },
    async: false,
    complete: function (data) {
      // noinspection JSUnresolvedVariable
      var $text = $(data.responseJSON["parse"]["text"]["*"]);
      if (onlyFirstParagraph) {
        html = $text.find("p:first").html();
      } else {
        html = $text;
      }
    },
    dataType: "json",
  });

  // noinspection JSUnusedAssignment
  return html;
}

/*
 * Utilisations :
 *
 * MediaWiki:Gadget-CreerNouveauMot.js
 *
 * Utilisateur:Maintenance gadgets/Gadget-CreerNouveauMot.js
 * Utilisateur:GaAsBot/CreerConjugFr.js (2018)
 * (Utilisateur:Déesse23/Gadget-CreerNouveauMot.js) (2013)
 * (Utilisateur:Eiku/Gadget-CreerNouveauMot.js) (2013)
 * (Utilisateur:Automatik/Gadget-CreerNouveauMot.js) (2013)
 * Utilisateur:Psychoslave/common.js
 * (Utilisateur:ArséniureDeGallium/tmp.js)
 */
/**
 * Ajoute un menu dans les onglets.
 * @param link {string} L’URL.
 * @param title {string} Le titre de la page.
 * @deprecated Préférer utiliser mw.util.addPortletLink()
 *             (cf. [[mw:ResourceLoader/Default_modules#addPortletLink]])
 */
function CommonWikt_AddTabMenu(link, title) {
  $(function () {
    var cactionsTab = document.getElementById('p-cactions');
    if (cactionsTab) {
      var tabList = cactionsTab.getElementsByTagName('ul')[0];
      tabList.innerHTML += '<li><a href="' + link + '">' + title + '</a></li>';
      if (cactionsTab.className) {
        cactionsTab.className = cactionsTab.className.replace(/\s*emptyPortlet\s*/, " ");
      }
    }
  });
}

/*
 * Utilisations :
 *
 * Utilisateur:GaAsBot/CreerConjugFr.js (2018)
 */
/**
 * Détermine les dimensions de l’écran.
 * @return {{largeur: number, hauteur: number}}
 */
function CommonWikt_Screen() {
  var userAgent = navigator.userAgent.toLowerCase();
  var size = {largeur: 0, hauteur: 0};

  // Pour Internet Explorer
  if (userAgent.includes("msie") && userAgent.includes("opera")) {
    size.largeur = screen.width;
    size.hauteur = screen.height;
  } else {
    size.largeur = window.innerWidth;
    size.hauteur = window.innerHeight;
  }

  return size;
}

wikt.getScreenSize = CommonWikt_Screen;

/*
 * HTML
 */

/**
 * Remplace le contenu de la page spécifiée par le code HTML donné.
 * @param doc {Object} Le document dont il faut remplacer le contenu.
 * @param newHtml {string} Le nouveau contenu.
 */
wikt.html.replacePageBody = function (doc, newHtml) {
  while (doc.body.firstChild) {
    doc.body.removeChild(doc.body.firstChild);
  }
  doc.body.innerHTML = newHtml;
};

/*
 * Utilisations :
 *
 * MediaWiki:Gadget-CreerNouveauMot.js
 *
 * Utilisateur:Maintenance gadgets/Gadget-CreerNouveauMot.js
 *
 * Utilisateur:GaAsBot/CreerConjugFr.js (2018)
 * (Utilisateur:Déesse23/Gadget-CreerNouveauMot.js) (2013)
 * (Utilisateur:Eiku/Gadget-CreerNouveauMot.js) (2013)
 * (Utilisateur:Automatik/Gadget-CreerNouveauMot.js) (2013)
 */
/**
 * Supprime un élément HTML.
 * @param element {Object} L’élément à supprimer.
 */
function CommonWikt_Delete(element) {
  if ((element) && (element.parentNode)) {
    element.parentNode.removeChild(element);
  }
}

wikt.html.deleteNode = CommonWikt_Delete;

/*
 * Cookies
 */

/*
 * Utilisations :
 *
 * MediaWiki:Gadget-CreerNouveauMot.js
 *
 * Utilisateur:Maintenance gadgets/Gadget-CreerNouveauMot.js
 *
 * (Utilisateur:Déesse23/Gadget-CreerNouveauMot.js) (2013)
 * (Utilisateur:Eiku/Gadget-CreerNouveauMot.js) (2013)
 * (Utilisateur:Automatik/Gadget-CreerNouveauMot.js) (2013)
 */
/**
 * Crée un cookie.
 * @param name {string} Le nom du cookie.
 * @param value {string} La valeur du cookie.
 * @param days {number} La durée de vie en jours.
 */
function CommonWikt_AjouteCookie(name, value, days) {
  var date = new Date();
  date.setTime(date.getTime() + days * 86400000);
  // noinspection JSUnresolvedFunction
  document.cookie = "{0}={1}; expires={2}; path=/".format(name, value, date.toGMTString());
}

wikt.cookie.create = CommonWikt_AjouteCookie;

/*
 * Utilisations :
 *
 * MediaWiki:Gadget-CreerNouveauMot.js
 *
 * Utilisateur:Maintenance gadgets/Gadget-CreerNouveauMot.js
 *
 * (Utilisateur:Déesse23/Gadget-CreerNouveauMot.js) (2013)
 * (Utilisateur:Eiku/Gadget-CreerNouveauMot.js) (2013)
 * (Utilisateur:Automatik/Gadget-CreerNouveauMot.js) (2013)
 */
/**
 * Lit la valeur d’un cookie.
 * @param name {string} Le nom du cookie.
 * @return {string|null} La valeur du cookie ou null s’il n’existe pas.
 */
function CommonWikt_LitCookie(name) {
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var valueIndex = cookie.indexOf(name + "=");
    if (valueIndex >= 0) {
      return cookie.substr(valueIndex + name.length + 1);
    }
  }

  return null;
}

wikt.cookie.read = CommonWikt_LitCookie;

/*
 * Utilisations :
 *
 * MediaWiki:Gadget-CreerNouveauMot.js
 */
/**
 * Supprime un cookie.
 * @param name {string} Le nom du cookie.
 */
function CommonWikt_SupprimeCookie(name) {
  wikt.cookie.create(name, "", -1);
}

wikt.cookie.delete = CommonWikt_SupprimeCookie;

/*
 * AJAX
 */

/*
 * Utilisations :
 *
 * MediaWiki:Gadget-CreerFlexionFr.js TEMP en cours de refactor
 * MediaWiki:Gadget-CreerTrad.js
 *
 * Utilisateur:Maintenance gadgets/Gadget-CreerTrad.js
 *
 * Utilisateur:GaAsBot/CreerConjugFr.js (2018)
 * (Utilisateur:Automatik/test2.js)
 * Utilisateur:Lepticed7/Gadget-CreerFlexionEo.js
 * Utilisateur:Automatik/Gadget-CreerTrad.js (2018)
 * Utilisateur:Romainbehar/Gadget-CreerFlexionIt.js
 * Utilisateur:Otourly/Gadget-CreerFlexionIt.js
 * Utilisateur:Pamputt/Gadget-CreerTrad.js
 * Utilisateur:Pamputt/Gadget-CreerFlexionDa.js
 * (Utilisateur:Pamputt/Gadget-CreerFlexionDaTest.js)
 * Utilisateur:Pamputt/Gadget-CreerFlexionEn.js
 * Utilisateur:Pamputt/Gadget-CreerFlexionEs.js
 * Utilisateur:Pamputt/Gadget-CreerFlexionFr.js
 * Utilisateur:Pamputt/Gadget-CreerFlexionFr2.js
 */
/**
 * Objet permettant d’envoyer une requête AJAX aux serveurs WikiMedia.
 * - soit via l’interface standard (index.php)
 * - soit via l’API (api.php)
 * - soit via les requêtes POST et GET
 */
var CommonWikt_ajax = {
  http: function (bundle) {
    var xmlhttp;
    try {
      xmlhttp = new XMLHttpRequest();
    } catch (e) {
      try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          xmlhttp = false;
        }
      }
    }
    if (xmlhttp) {
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
          CommonWikt_ajax.httpComplete(xmlhttp, bundle);
        }
      };
      xmlhttp.open(bundle.method ? bundle.method : "GET", bundle.url, bundle.async !== false);
      if (bundle.headers) {
        for (var field in bundle.headers) {
          try {
            xmlhttp.setRequestHeader(field, bundle.headers[field]);
          } catch (err) {
          }
        }
      }
      xmlhttp.send(bundle.data ? bundle.data : null);
    }
    return xmlhttp;
  },
  httpComplete: function (xmlhttp, bundle) {
    if (xmlhttp.status === 200 || xmlhttp.status === 302) {
      if (bundle.onSuccess) {
        bundle.onSuccess(xmlhttp, bundle);
      }
    } else if (bundle.onFailure) {
      bundle.onFailure(xmlhttp, bundle);
    }
  }
};

wikt.ajax = CommonWikt_ajax;

/**
 * This function loads asynchronously the list of given scripts.
 * @param scripts The list of scripts to load.
 * @return {Object} An object that provides a "done" function taking
 * a callback that will be executed once all scripts have been loaded.
 */
wikt.loadScripts = function (scripts) {
  var deferreds = [];

  $.each(scripts, function (i, script) {
    // External script, use $.getScript
    if (script.match(/^(https?:|\/\/)/)) {
      deferreds.push($.getScript(script));
    } // Use mw.using, convert callbacks to Deferreds
    else {
      var d = $.Deferred();
      mw.loader.using(script, d.resolve, d.reject);
      deferreds.push(d);
    }
  });

  return $.when.apply($, deferreds);
}
