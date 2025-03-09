//[[Catégorie:JavaScript du Wiktionnaire|HiddenQuote.js]]
// DOM from en.wikt
function newNode(tagname) {

  var node = document.createElement(tagname);

  for (var i = 1; i < arguments.length; i++) {

    if (typeof arguments[i] == 'string') { //Text
      node.appendChild(document.createTextNode(arguments[i]));

    }
    else if (typeof arguments[i] == 'object') {

      if (arguments[i].nodeName) { //If it is a DOM Node
        node.appendChild(arguments[i]);

      }
      else { //Attributes (hopefully)
        for (var j in arguments[i]) {
          if (j == 'class') { //Classname different because...
            node.className = arguments[i][j];

          }
          else if (j == 'style') { //Style is special
            node.style.cssText = arguments[i][j];

          }
          else if (typeof arguments[i][j] == 'function') { //Basic event handlers
            try {
              node.addEventListener(j, arguments[i][j], false); //W3C
            }
            catch (e) {
              try {
                node.attachEvent('on' + j, arguments[i][j], "Language"); //MSIE
              }
              catch (e) {
                node['on' + j] = arguments[i][j];
              }
            }
            ; //Legacy

          }
          else {
            node.setAttribute(j, arguments[i][j]); //Normal attributes

          }
        }
      }
    }
  }

  return node;
}


// Visibility toggling from en.wikt

var VisibilityToggles = {
  // toggles[category] = [[montrer les, masquer les],...]; statuses[category] = [true, false,...]; buttons = <li>
  toggles: {}, statuses: {}, buttons: null,

  // Add a new toggle, adds a Show/Hide category button in the toolbar,
  // and will call show_function and hide_function once on register, and every alternate click.
  register: function (category, show_function, hide_function) {

    var id = 0;
    if (!this.toggles[category]) {
      this.toggles[category] = [];
      this.statuses[category] = [];
    }
    else {
      id = this.toggles[category].length;
    }
    this.toggles[category].push([show_function, hide_function]);
    this.statuses[category].push(this.currentStatus(category));
    this.addGlobalToggle(category);

    (this.statuses[category][id] ? show_function : hide_function)();

    return function () {
      var statuses = VisibilityToggles.statuses[category];
      statuses[id] = !statuses[id]
      VisibilityToggles.checkGlobalToggle(category);
      return (statuses[id] ? show_function : hide_function)();
    }

  },

  // Add a new global toggle to the side bar
  addGlobalToggle: function (category) {
    if (document.getElementById('p-visibility-' + category))
      return;
    if (!this.buttons) {
      this.buttons = newNode('ul');
      var collapsed = mw.cookie.get("vector-nav-p-visibility") == "false", toolbox = newNode('div', {
            'class': "portal portlet " + (collapsed ? "collapsed" : "expanded"),
            'id': 'p-visibility'
          },
          newNode('h3', 'Visibilité'),
          newNode('div', {'class': "pBody body"}, collapsed ? undefined : {'style': 'display:block;'}, this.buttons)
      );
      var sidebar = document.getElementById('mw-panel') || document.getElementById('column-one');
      var insert = null;
      if (insert = (document.getElementById('p-lang') || document.getElementById('p-feedback')))
        sidebar.insertBefore(toolbox, insert);
      else
        sidebar.appendChild(toolbox);

    }
    var status = this.currentStatus(category);
    var newToggle = newNode('li', newNode('a', {
          id: 'p-visibility-' + category,
          style: 'cursor: pointer',
          href: '#visibility-' + category,
          click: function (e) {
            VisibilityToggles.toggleGlobal(category);
            if (e && e.preventDefault)
              e.preventDefault();
            else
              window.event.returnValue = false;
            return false;
          }
        },
        (status ? 'Masquer les ' : 'Montrer les ') + category));
    for (var i = 0; i < this.buttons.childNodes.length; i++) {
      if (this.buttons.childNodes[i].id < newToggle.id) {
        this.buttons.insertBefore(newToggle, this.buttons.childNodes[i]);
        return;
      }
    }
    this.buttons.appendChild(newToggle);
  },

  // Update the toggle-all buttons when all things are toggled one way
  checkGlobalToggle: function (category) {
    var statuses = this.statuses[category];
    var status = statuses[0];
    for (var i = 1; i < statuses.length; i++) {
      if (status != statuses[i])
        return;
    }
    document.getElementById('p-visibility-' + category).innerHTML = (status ? 'Masquer les ' : 'Montrer les ') + category;
  },

  // Toggle all un-toggled elements when the global button is clicked
  toggleGlobal: function (category) {
    var status = document.getElementById('p-visibility-' + category).innerHTML.indexOf('Montrer les ') == 0;
    for (var i = 0; i < this.toggles[category].length; i++) {
      if (this.statuses[category][i] != status) {
        this.toggles[category][i][status ? 0 : 1]();
        this.statuses[category][i] = status;
      }
    }
    document.getElementById('p-visibility-' + category).innerHTML = (status ? 'Masquer les ' : 'Montrer les ') + category;
    var current = mw.cookie.get('Visibilité');
    if (!current)
      current = ";";
    current = current.replace(';' + category + ';', ';');
    if (status)
      current = current + category + ";";
    mw.cookie.set('Visibilité', current);
  },

  currentStatus: function (category) {
    if (mw.cookie.get('WiktionaryPreferencesShowNav') == 'true')
      return true;
    else if (mw.cookie.get('Visibilité') && mw.cookie.get('Visibilité').indexOf(';' + category + ';') >= 0)
      return true;
    return false; // TODO load this from category specific cookies
  }
};

// NavBars from en.wikt

var NavigationBarHide = 'Afficher ▲';
var NavigationBarShow = 'Masquer ▼';

function NavToggleCategory(navFrame) {
  var table = navFrame.getElementsByTagName('table')[0];
  if (table && table.className == "translations")
    return "translations";

  var heading = navFrame.previousSibling;
  while (heading) {
    if (/[hH][4-6]/.test(heading.nodeName)) {
      if (heading.getElementsByTagName('span')[1]) {
        return heading.getElementsByTagName('span')[1].innerHTML.toLowerCase();
      }
      else {
        return heading.getElementsByTagName('span')[0].innerHTML.toLowerCase();
      }
    }
    else if (/[hH][1-3]/.test(heading.nodeName))
      break;
    heading = heading.previousSibling;
  }
  return "other boxes";
};

function createNavToggle(navFrame) {
  var navHead, navToggle, navContent;
  for (var j = 0; j < navFrame.childNodes.length; j++) {
    var div = navFrame.childNodes[j];
    switch (div.className) {
      case 'NavHead':
        navHead = div;
        break;
      case 'NavContent':
        navContent = div;
        break;
    }
  }
  if (!navHead || !navContent)
    return;
  // Step 1, don't react when a subitem is clicked.
  for (var i = 0; i < navHead.childNodes.length; i++) {
    var child = navHead.childNodes[i];
    if (child.nodeType == 1) {
      child.onclick = function (e) {
        if (e && e.stopPropagation)
          e.stopPropagation();
        else
          window.event.cancelBubble = true;
      }
    }
  }
  // Step 2, toggle visibility when bar is clicked.
  // NOTE This function was chosen due to some funny behaviour in Safari.
  navToggle = newNode('a', {href: 'javascript:(function(){})()'}, '');
  navHead.insertBefore(newNode('span', {'class': 'NavToggle'}, '[', navToggle, ']'), navHead.firstChild);

  navHead.style.cursor = "pointer";
  navHead.onclick = VisibilityToggles.register(NavToggleCategory(navFrame),
      function show() {
        navToggle.innerHTML = NavigationBarHide;
        if (navContent)
          navContent.style.display = "block";
      },
      function hide() {
        navToggle.innerHTML = NavigationBarShow;
        if (navContent)
          navContent.style.display = "none";
      });
};


// Hidden Quotes from en.wikt

function setupHiddenQuotes(li) {
  var HQToggle, liComp;
  var HQShow = 'exemples&nbsp;▼';
  var HQHide = 'exemples&nbsp;▲';
  for (var k = 0; k < li.childNodes.length; k++) {
    // Look at each component of the definition.
    liComp = li.childNodes[k];
    // If we find a ul or dl, we have quotes or example sentences, and thus need a button.
    if (/^(ul|UL)$/.test(liComp.nodeName)) {
      HQToggle = newNode('a', {href: 'javascript:(function(){})()'}, '');
      li.insertBefore(newNode('span', {'class': 'HQToggle', 'style': 'font-size:0.65em'}, ' [', HQToggle, ']'), liComp);
      HQToggle.onclick = VisibilityToggles.register('exemples',
          function show() {
            HQToggle.innerHTML = HQHide;
            for (var child = li.firstChild; child != null; child = child.nextSibling) {
              if (/^(ul|UL)$/.test(child.nodeName)) {
                child.style.display = 'block';
              }
            }
          },
          function hide() {
            HQToggle.innerHTML = HQShow;
            for (var child = li.firstChild; child != null; child = child.nextSibling) {
              if (/^(ul|UL)$/.test(child.nodeName)) {
                child.style.display = 'none';
              }
            }
          });

      break;
    }
  }
}

jQuery(function () {
  if (mw.config.get('wgNamespaceNumber') == 0) {
    var ols, lis, li;
    // First, find all the ordered lists, i.e. all the series of definitions.
    var ols = document.getElementsByTagName('ol');
    for (var i = 0; i < ols.length; i++) {
      // Then, for every set, find all the individual definitions.
      for (var j = 0; j < ols[i].childNodes.length; j++) {
        li = ols[i].childNodes[j];
        if (li.nodeName.toUpperCase() == 'LI') {
          setupHiddenQuotes(li);
        }
      }
    }
  }
});
