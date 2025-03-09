//[[Catégorie:JavaScript du Wiktionnaire|adddefinition.js]]
// This script adds an "Add definition" button to the toolbox section of the sidebar.

var bodyContent;

if(mw.config.get('wgNamespaceNumber') === 0 && mw.config.get('wgAction') == "view" && !/&printable=yes|&diff=|&oldid=/.test(window.location.search))
{
  jQuery(function()
  {
    bodyContent = document.getElementById('bodyContent');
    mw.util.addPortletLink('p-tb', 'javascript:addDefinition()', 'Ajouter une définition');
  });
}

var currentBoxToBeAdded;
var definitionHover;
var tempDefinitionText;

function setUpBoxToBeAdded()
{
  bodyContent.appendChild(currentBoxToBeAdded);
  document.onmousemove =
      function (e)
      {
        e = e || event;
        currentBoxToBeAdded.style.left = e.clientX + 2 + 'px';
        currentBoxToBeAdded.style.top = e.clientY + 2 + 'px';
      };
  document.body.style.cursor = 'move';
}

function addDefinition()
{
  if(! document.onmousemove)
  {
    var instructions = "Entrer une définition ici, puis la faire glisser jusqu'à son emplacement, et cliquer pour sauvegarder.";
    var temp;
    currentBoxToBeAdded =
        (
            newNode
            (
                'div',
                {
                  style:
                      'border: 1px solid #000000;' +
                      'position:fixed; left:200px; top:500px; z-index:5;' +
                      'padding:10px; background-color:#FFFFFF;'
                },
                newNode
                (
                    'nobr',
                    'Definition: ',
                    newNode
                    (
                        'input',
                        {
                          size: 100,
                          blur: function(){
                            if(definitionHover)
                            {addDefinition2(definitionHover, currentBoxToBeAdded.lastChild.lastChild.value.replace(instructions,''))}
                            else
                            {tempDefinitionText=currentBoxToBeAdded.lastChild.lastChild.value.replace(instructions,'');}
                            bodyContent.removeChild(currentBoxToBeAdded);
                            document.onmousemove = null;
                            document.body.style.cursor = '';
                            var ols = document.getElementsByTagName('ol');
                            for(var i = 0; i < ols.length; i++)
                            {
                              var lis = ols[i].getElementsByTagName('li');
                              for(var ii = 0; ii < lis.length; ii++)
                              {
                                lis[ii].onmouseover = null;
                                lis[ii].onmouseout = null;
                              }
                            }
                          },
                          value: tempDefinitionText || ""
                        }
                    )
                )
            )
        );
    setUpBoxToBeAdded();
    temp=currentBoxToBeAdded.lastChild.lastChild;
    temp.focus();
    if(!temp.value){
      temp.value = instructions;
      temp.style.color="#AAA";
      temp.onkeydown=function(){
        this.style.color = "#000";
        this.value='';
        this.onkeydown=null;
      };
    }

    var ols = document.getElementsByTagName('ol');
    for(var i = 0; i < ols.length; i++)
    {
      var lis = ols[i].getElementsByTagName('li');
      for(var ii = 0; ii < lis.length; ii++)
      {
        lis[ii].onmouseover =
            function () { this.style.borderBottom = '1px solid #000000'; definitionHover=this; };
        lis[ii].onmouseout =
            function () { this.style.borderBottom = this.style.borderTopStyle=="dashed"?"2px #00FF00 dashed":""; definitionHover=null };
      }
    }
  }
}

function addDefinition2(q,newdef)
{
  q.style.borderBottom = q.style.borderTopStyle=="dashed"?"2px #00FF00 dashed":"";
  definitionHover = null;
  tempDefinitionText = null;

  var qq = newNode('li', newNode('span'));
  JsMwApi().page(mw.config.get('wgPageName')).parseFragment(newdef, function (res) { qq.lastChild.innerHTML = res; });

  function addDefinition3(wikitext)
  {
    var prevheader = q;
    var prevols=0, prevlis=1;
    while(prevheader.previousSibling)
    {
      prevheader = prevheader.previousSibling;
      if(prevheader.nodeName.toLowerCase() == "li")
      {prevlis++}
    }
    prevheader=prevheader.parentNode;
    while(prevheader.nodeName != "H2")
    {
      prevheader = prevheader.previousSibling;
      if(prevheader.nodeName.toLowerCase() == "ol")
      {prevols++}
    }

    var findNumberOfHeaders =
        Number(prevheader.firstChild.getElementsByTagName('a')[0].href.match(/\d*$/));
    wikitext =
        (
            wikitext.replace
            (
                RegExp("((?:(^|\n)=[\\s\\S]*?){" + findNumberOfHeaders + "}([\\s\\S]*?\n#[\\s\\S]*?\n(?!#)){" + prevols+ "}([\\s\\S]*?\n#(?![#:\\*])){" + prevlis + "}[\\s\\S]*?)(\n(?!#[#:\\*])|$)"),
                '$1\n# ' + newdef + '\n'
            )
        );
    return ccc = wikitext;
  }

  var editor=new Editor();
  editor.addEdit({
    edit: addDefinition3,
    redo: function ()
    {
      q.parentNode.insertBefore(qq, q.nextSibling);
      if(window.makedefsidebox && qq.childNodes.length == 1)
      { makedefsidebox(qq); } // User:Yair_rand/editor.js stuff
    },
    undo: function () { q.parentNode.removeChild(qq); },
    summary: "+def: " +newdef
  },qq);
}




/**
 * Create a new DOM node for the current document.
 *    Basic usage:  var mySpan = newNode('span', "Hello World!")
 *    Supports attributes and event handlers*: var mySpan = newNode('span', {style:"color: red", focus: function(){alert(this)}, id:"hello"}, "World, Hello!")
 *    Also allows nesting to create trees: var myPar = newNode('p', newNode('b',{style:"color: blue"},"Hello"), mySpan)
 *
 * *event handlers, there are some issues with IE6 not registering event handlers on some nodes that are not yet attached to the DOM,
 * it may be safer to add event handlers later manually.
 **/
function newNode(tagname){

  var node = document.createElement(tagname);

  for( var i=1;i<arguments.length;i++ ){

    if(typeof arguments[i] == 'string'){ //Text
      node.appendChild( document.createTextNode(arguments[i]) );

    }else if(typeof arguments[i] == 'object'){

      if(arguments[i].nodeName){ //If it is a DOM Node
        node.appendChild(arguments[i]);

      }else{ //Attributes (hopefully)
        for(var j in arguments[i]){
          if(j == 'class'){ //Classname different because...
            node.className = arguments[i][j];

          }else if(j == 'style'){ //Style is special
            node.style.cssText = arguments[i][j];

          }else if(typeof arguments[i][j] == 'function'){ //Basic event handlers
            try{ node.addEventListener(j,arguments[i][j],false); //W3C
            }catch(e){try{ node.attachEvent('on'+j,arguments[i][j],"Language"); //MSIE
            }catch(e){ node['on'+j]=arguments[i][j]; }} //Legacy

          }else{
            node.setAttribute(j,arguments[i][j]); //Normal attributes

          }
        }
      }
    }
  }

  return node;
}




















/** See talk page for details **/

//JsMwApi documentation is at http://en.wiktionary.org/wiki/User_talk:Conrad.Irwin/Api.js
function JsMwApi (api_url, request_type) {

  if (!api_url)
  {
    if (typeof(true) === 'undefined' || true === false)
      throw "API local inutilisable.";

    api_url = mw.config.get('wgScriptPath') + "/api.php";
  }

  if (!request_type)
  {
    if (api_url.indexOf('http://') === 0 || api_url.indexOf('https://') == 0)
      request_type = "remote";
    else
      request_type = "local";
  }
  function call_api (query, callback)
  {
    if(!query || !callback)
      throw "Paramètres insuffisants pour l'appel API";

    query = serialise_query(query);

    if(request_type == "remote")
      request_remote(api_url, query, callback, call_api.on_error || default_on_error);
    else
      request_local(api_url, query, callback, call_api.on_error || default_on_error);

  }

  var default_on_error = JsMwApi.prototype.on_error || function (xhr, callback, res)
  {
    if (typeof(console) != 'undefined')
      console.log([xhr, res]);

    callback(null);
  };

  function get_xhr ()
  {
    try{
      return new XMLHttpRequest();
    }catch(e){ try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    }catch(e){ try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    }catch(e){
      throw "Impossible de créer de requête XmlHttp";
    }}}
  }

  function request_local (url, query, callback, on_error)
  {
    var xhr = get_xhr();

    xhr.open('POST', url + '?format=json', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(query);
    xhr.onreadystatechange = function ()
    {
      if (xhr.readyState == 4)
      {
        var res;
        if (xhr.status != 200)
          res = {error: {
              code: '_badresponse',
              info: xhr.status + " " + xhr.statusText
            }};
        else
        {
          try
          {
            res = JSON.parse("("+xhr.responseText+")");
          }
          catch(e)
          {
            res = {error: {
                code: '_badresult',
                info: "Le serveur renvoie une réponse de formatage incorrect"
              }};
          }
        }
        if (!res || res.error || res.warnings)
          on_error(xhr, callback, res);
        else
          callback(res);
      }
    };
  }

  function request_remote (url, query, callback, on_error)
  {
    if(! window.__JsMwApi__counter)
      window.__JsMwApi__counter = 0;

    var cbname = '__JsMwApi__callback' + window.__JsMwApi__counter++;

    window[cbname] = function (res)
    {
      if (res.error || res.warnings)
        on_error(null, callback, res);
      else
        callback(res);
    };

    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url + '?format=json&callback=window.' + cbname + '&' + query);
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  function serialise_query (obj)
  {
    var amp = "";
    var out = "";
    if (String(obj) === obj)
    {
      out = obj;
    }
    else if (obj instanceof Array)
    {
      for (var i=0; i < obj.length; i++)
      {
        out += amp + serialise_query(obj[i]);
        amp = (out === '' || out.charAt(out.length-1) == '&') ? '' : '&';
      }
    }
    else if (obj instanceof Object)
    {
      for (var k in obj)
      {
        if (obj[k] === true)
          out += amp + encodeURIComponent(k) + '=1';
        else if (obj[k] === false)
          continue;
        else if (obj[k] instanceof Array)
          out += amp + encodeURIComponent(k) + '=' + encodeURIComponent(obj[k].join('|'));
        else if (obj[k] instanceof Object)
          throw "Les paramètres de l'API ne doivent pas être des objets";
        else
          out += amp + encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
        amp = '&';
      }
    }
    else if (typeof(obj) !== 'undefined' && obj !== null)
    {
      throw "Une requête API peut seulement être une chaîne ou un objet";
    }
    return out;
  }

  // Make JSON.parse work
  var JSON = (typeof JSON == 'undefined' ? {} : JSON);

  if (typeof JSON.parse != 'function')
    JSON.parse = function (json) { return eval('(' + json + ')'); };

  // Allow .prototype. extensions
  if (JsMwApi.prototype)
  {
    for (var i in JsMwApi.prototype)
    {
      call_api[i] = JsMwApi.prototype[i];
    }
  }
  return call_api;
}

JsMwApi.prototype.page = function (title) {

  function call_with_page (params, callback)
  {
    call_with_page.api([params, {title: title, titles: title}], callback);
  }

  call_with_page.api = this;

  call_with_page.edit = function (params, edit_function)
  {
    if (typeof(params) == 'function')
    {
      edit_function = params;
      params = null;
    }
    params = [params, {
      action: "query",
      prop: ["info", "revisions"],
      intoken: "edit",
      rvprop: ["content", "timestamp"]
    }];

    call_with_page(params, function (res)
    {
      if (!res || !res.query || !res.query.pages)
        return edit_function(null);

      // Get the first (and only) page from res.query.pages
      for (var pageid in res.query.pages) break;
      var page = res.query.pages[pageid];

      var text = page.revisions ? page.revisions[0]['*'] : '';

      function save_function (ntext, params, post_save)
      {
        if (typeof(params) == 'function')
        {
          post_save = params;
          params = null;
        }
        params = [params, {
          action: "edit",
          text: ntext,
          token: page.edittoken,
          starttimestamp: page.starttimestamp,
          basetimestamp: (page.revisions ? page.revisions[0].timestamp : false)
        }];

        call_with_page(params, post_save);
      }

      edit_function(text, save_function, res);

    });
  }

  call_with_page.parse = function (to_parse, callback)
  {
    if (typeof to_parse == "function")
    {
      callback = to_parse;
      to_parse = null;
    }
    var params = (to_parse == null ? {page: title} : {title: title, text: to_parse});

    call_with_page.api([{action: "parse", pst: true}, params], function (res)
    {
      if (!res || !res.parse || !res.parse.text)
        callback(null, res);
      else
        callback(res.parse.text['*'], res);
    })
  }

  call_with_page.parseFragment = function (to_parse, callback)
  {
    call_with_page.parse("<div>\n" + to_parse + "</div>", function (parsed, res)
    {
      callback(parsed ? parsed.replace(/^<div>\n?/,'').replace(/(\s*\n)?<\/div>\n*(<!--[^>]*-->\s*)?$/,'') : parsed, res);
    })
  }

  return call_with_page;
}
/**
 * Storage of "string" preferences.
 */
function CookiePreferences (context)
{
  //Repeated calls with the same context should get the same preferences object.
  if (arguments.callee[context])
    return arguments.callee[context];
  else
    arguments.callee[context] = this;

  /**
   * Change the value of a preference.
   *
   * This will cause all the people subscribed to the function to recieve an
   * update.
   *
   * @param {string} name  The name of the preference
   * @param {string} value  The new value of the preference.
   */
  this.set = function (name, value)
  {
    if (value === null || storage[name] === value)
      return;

    storage[name] = value;

    updateCookie();
  }

  /**
   * Get the value of a preference.
   *
   * If the preference isn't set, return the second argument or undefined.
   *
   * @param {string} name  The name of the preference
   * @param {string} def  The default value of the preference
   */
  this.get = function (name, def)
  {
    if (storage[name])
      return storage[name];
    else
      return def;
  }

  var storage = {};

  // Save storage into the cookie.
  function updateCookie ()
  {
    var value = "";
    for (var name in storage)
    {
      value += '&' + encodeURIComponent(name) + "=" + encodeURIComponent(storage[name]);
    }

    mw.cookie.set('preferences' + context, value)
  }

  // Load storage from the cookie.
  // NOTE: If you wish to update the cookie format, both loading and storing
  // must continue to work for 30 days.
  function updateStorage ()
  {
    var value = mw.cookie.set('preferences' + context, value) || '';
    var pairs = value.split('&');

    for (var i=1; i < pairs.length; i++)
    {
      var val = pairs[i].split('=');

      if (storage[val[0]] === val[1])
        continue;

      storage[val[0]] = val[1];
    }
  }

  //__init__
  updateStorage();
}
/**
 * A generic page editor for the current page.
 *
 * This is a singleton and it displays a small interface in the top left after
 * the first edit has been registered.
 *
 * @public
 * this.page
 * this.addEdit
 * this.error
 *
 */
function Editor ()
{
  //Singleton
  if (arguments.callee.instance)
    return arguments.callee.instance
  else
    arguments.callee.instance = this;

  // @public - the JsMwApi object for the current page
  this.page = JsMwApi().page(mw.config.get('wgPageName'));

  // get the current text of the article and call the callback with it
  // NOTE: This function also acts as a loose non-re-entrant lock to protect currentText.
  this.withCurrentText = function(callback)
  {
    if (callbacks.length == 0)
    {
      callbacks = [callback];
      for (var i=0; i<callbacks.length; i++)
      {
        callbacks[i](currentText);
      }
      return callbacks = [];
    }

    if (callbacks.length > 0)
    {
      return callbacks.push(callback);
    }

    callbacks = [callback];
    thiz.page.edit(function (text, _save)
    {
      if (text === null)
        return thiz.error("Connexion au serveur impossible");

      currentText = originalText = text;
      saveCallback = _save;

      for (var i=0; i<callbacks.length; i++)
      {
        callbacks[i](currentText);
      }
      callbacks = [];

    });
  }
  // A decorator for withCurrentText
  function performSequentially(f)
  {
    return (function ()
    {
      var the_arguments = arguments;
      thiz.withCurrentText(function ()
      {
        f.apply(thiz, the_arguments);
      });
    });
  }

  // add an edit to the editstack
  function addEdit (edit, node, fromRedo)
  {
    thiz.withCurrentText(function ()
    {
      withPresenceShowing(false, function ()
      {
        if (node)
        {
          nodestack.push(node);
          node.style.cssText = "border: 2px #00FF00 dashed;"
        }

        if (! fromRedo)
          redostack = [];

        var ntext = false;
        try
        {
          ntext = edit.edit(currentText);

          if (ntext && ntext != currentText)
          {
            edit.redo();
            currentText = ntext;
          }
          else
            return false;
        }
        catch (e)
        {
          this.error("ERROR:" + e);
        }

        editstack.push(edit);
      });
    });
  }
  this.addEdit = performSequentially(addEdit);

  // display an error to the user
  this.error = function (message)
  {
    if (!errorlog)
    {
      errorlog = newNode('ul',{style: "background-color: #FFDDDD; margin: 0px -10px -10px -10px; padding: 10px;"});
      withPresenceShowing(true, function (presence)
      {
        presence.appendChild(errorlog);
      });
    }
    errorlog.appendChild(newNode('li', message));
  }


  var thiz = this; // this is set incorrectly when private functions are used as callbacks.

  var editstack = []; // A list of the edits that have been applied to get currentText
  var redostack = []; // A list of the edits that have been recently undone.
  var nodestack = []; // A lst of nodes to which we have added highlighting
  var callbacks = {}; // A list of onload callbacks (initially .length == undefined)

  var originalText = ""; // What was the contents of the page before we fiddled?
  var currentText = ""; // What is the contents now?

  var saveCallback; // The callback returned by the api's edit function to save.

  var errorlog; // The ul for sticking errors in.
  var savelog; // The ul for save messages.

  //Move an edit from the editstack to the redostack
  function undo ()
  {
    if (editstack.length == 0)
      return false;
    var edit = editstack.pop();
    redostack.push(edit);
    edit.undo();

    var text = originalText;
    for (var i=0; i < editstack.length; i++)
    {
      var ntext = false;
      try
      {
        ntext = editstack[i].edit(text);
      }
      catch (e)
      {
        thiz.error("ERROR:" + e);
      }
      if (ntext && ntext != text)
      {
        text = ntext;
      }
      else
      {
        editstack[i].undo();
        editstack = editstack.splice(0, i);
        break;
      }
    }
    currentText = text;
    return true;
  }
  this.undo = performSequentially(undo);

  //Move an edit from the redostack to the editstack
  function redo ()
  {
    if (redostack.length == 0)
      return;
    var edit = redostack.pop();
    addEdit(edit, null, true);
  }
  this.redo = performSequentially(redo);

  function withPresenceShowing(broken, callback)
  {
    if (arguments.callee.presence)
    {
      arguments.callee.presence.style.display = "block";
      return callback(arguments.callee.presence);
    }

    var presence = newNode('div',{'style':"position: fixed; bottom:0px; right: 0px; background-color: #00FF00; z-index: 10;padding: 30px;"})
    //Fix fixed positioning for IE6/
    /*@cc_on
        @if (@_jscript_version <= 5.6)
            presence.style.cssText = "position: absolute; top: expression((dummy = (document.documentElement.scrollTop || document.body.scrollTop || 0)) + 'px'); background-color: #00FF00; z-index: 10000; padding: 30px;"
        @end
    @*/
    window.setTimeout(function () {
      presence.style.backgroundColor = "#CCCCFF";
      presence.style.padding = "10px";
    }, 400);

    presence.appendChild(newNode('div',{'style':"position: relative; top:0px; left:0px; margin: -10px; color: #0000FF;cursor:pointer;", click:performSequentially(close)},"X"))
    document.body.insertBefore(presence, document.body.firstChild);

    var contents = newNode('p', {style: 'text-align: center'},
        newNode('b', "Édition de la page"), newNode('br'));

    if (!broken)
    {
      contents.appendChild(newNode('button',"Sauvegarder les modifications", {'click': save}));
      contents.appendChild(newNode('br'));
      contents.appendChild(newNode('button',"Défaire", {'click': thiz.undo}));
      contents.appendChild(newNode('button', "Refaire", {'click':thiz.redo}));
    }
    presence.appendChild(contents);

    arguments.callee.presence = presence;
    callback(presence);
  }

  // Remove the button
  function close ()
  {
    while (undo())
      ;

    withPresenceShowing(true, function (presence)
    {
      presence.style.display = "none";
      if (errorlog)
      {
        errorlog.parentNode.removeChild(errorlog);
        errorlog = false;
      }
    });
  }

  //Send the currentText back to the server to save.
  function save ()
  {
    thiz.withCurrentText(function ()
    {
      var cleanup_callbacks = callbacks;
      callbacks = [];
      var sum = {};
      for (var i=0; i<editstack.length; i++)
      {
        sum[editstack[i].summary] = true;
      }
      var summary = "";
      for (var name in sum)
      {
        summary += name + " ";
      }
      editstack = [];
      redostack = [];
      var saveLi = newNode('li', 'Sauvegarde :' + summary + "...");
      withPresenceShowing(false, function (presence)
      {
        if (! savelog)
        {
          savelog = newNode('ul', {style: "background-color: #DDFFDD; margin: 0px -10px -10px -10px; padding: 10px;"});
          presence.appendChild(savelog);
        }
        savelog.appendChild(saveLi);

        if (originalText == currentText)
          return thiz.error("Aucun changement n'a été appliqué à la page.");

        else if (!currentText)
          return thiz.error("Erreur : la page a été blanchie.");
      });

      originalText = currentText;
      var nst = []
      var node;
      while (node = nodestack.pop())
      {
        nst.push(node);
      }
      saveCallback(currentText, {summary: summary + "([[WT:EDIT|Assisté]])"}, function (res)
      {
        if (res == null)
          return thiz.error("Une erreur est survenue pendant la sauvegarde.");

        try {
          saveLi.appendChild(newNode('span', newNode('b', " Sauvegardé "),
              newNode('a', {'href': mw.config.get('wgScript') +
                    '?title=' + encodeURIComponent(mw.config.get('wgPageName')) +
                    '&diff=' + encodeURIComponent(res.edit.newrevid) +
                    '&oldid=' + encodeURIComponent(res.edit.oldrevid)}, "(Afficher les modifications)")));
        }catch(e){
          if (res.error)
          {
            thiz.error("Non sauvegardé : " + String(res.error.info));
          }
          else
          {
            thiz.error(newNode('p',String(e)));
          }
        }

        for (var i=0; i < nst.length; i++)
          nst[i].style.cssText = "background-color: #0F0;border: 2px #0F0 solid;";

        window.setTimeout(function () {
          var node;
          while (node = nst.pop())
            node.style.cssText = "";
        }, 400);

        // restore any callbacks that were waiting for currentText before we started
        for (var i=0; i < cleanup_callbacks.length; i++)
          thiz.withCurrentText(cleaup_callbacks[i]);

      });
    });
  }
}

var util = {

  getVanillaIndexOf: function (str, text, pos)
  {
    if (!pos)
      pos = 0;
    var cpos = 0, tpos = 0, wpos = 0, spos = 0;
    do
    {
      cpos = text.indexOf('<!--', pos);
      tpos = text.indexOf('{'+'{', pos);
      wpos = text.indexOf('<nowiki>', pos);
      spos = text.indexOf(str, pos);

      pos = Math.min(
          Math.min(
              cpos == -1 ? Infinity : cpos ,
              tpos == -1 ? Infinity : tpos
          ),
          Math.min(
              wpos == -1 ? Infinity : wpos,
              spos == -1 ? Infinity : spos
          )
      )

      if (pos == spos)
        return pos == Infinity ? -1 : pos;

      else if (pos == cpos)
        pos = text.indexOf('-->', pos) + 3;

      else if (pos == wpos)
        pos = text.indexOf('</nowiki>', pos) + 9;

      else if (pos == tpos) //FIXME
        pos = text.indexOf('}}', pos) + 2;


    } while (pos < Infinity)
    return -1;
  },

  validateNoWikisyntax: function(field, nonempty)
  {
    return function(txt, error)
    {
      if(/[\[\{\|#\}\]]/.test(txt))
        return error("Merci de ne pas utiliser les caractères wiki ([]{}#|) dans le " + field +".");
      if(nonempty && !txt)
        return error("Merci de spécifier un " + field + ".");
      return txt;
    }
  },

  escapeRe: function(txt)
  {
    return txt.replace(/([\\{}(\|)[\].?*+])/g, "\\$1");
  },

  // pos is a position in the line containing the gloss
  getWikitextGloss: function (txt, pos)
  {
    var g_start = txt.lastIndexOf('\n{'+'{(', pos) + 1;
    var g_end = txt.indexOf('\n', pos);
    var g_line = txt.substr(g_start, g_end - g_start);
    g_line = g_line.replace("{"+"{(}}", "{"+"{(|Traductions}}");
    return g_line.replace(/\{\{\(\|(.*)\}\}/, "$1");
  },

  // get [start_pos, end_pos] of position of wikitext for trans_table containing node in text
  getTransTable: function (text, node, recursive)
  {
    var gloss = util.getTransGloss(node);
    var pos = 0;
    var transect = [];
    while(pos > -1)
    {
      pos = util.getVanillaIndexOf('{'+'{(', text, pos+1) // }}
      if (pos > -1 && util.matchGloss(util.getWikitextGloss(text, pos), gloss))
      {
        transect.push(pos);
      }
    }
    if (transect.length > 1)
    {
      var poss = transect;
      transect = [];
      for (var i=0; i<poss.length; i++)
      {
        pos = poss[i];
        if (util.matchGloss(gloss, util.getWikitextGloss(text, pos)))
        {
          transect.push(pos);
        }
      }

      if (transect.length > 1 && !recursive)
        transect = util.tieBreakTransTable(text, transect, node);
    }
    if (transect.length == 1)
    {
      pos = transect[0];
      pos = text.indexOf('}}\n', pos) + 3;
      var endpos = text.indexOf('{'+'{)}}', pos);
      if (endpos > -1 && pos > -1)
        return [pos, endpos];
    }

    return false;
  },

  // try to narrow down the correct poss if multiple matching trans tables
  tieBreakTransTable: function (text, poss, node)
  {
    if (node.nodeName.toLowerCase() == 'div')
    {
      while (node && !(node.className && node.className.indexOf('boite') > -1))
        node = node.parentNode;

      var nodes = node.getElementsByTagName('table');
      if (! nodes.length)
        return poss;

      node = nodes[0];
    }
    else
    {
      while (node && node.nodeName.toLowerCase() != 'table')
        node = node.parentNode;
    }

    var tables = document.getElementsByTagName('table');
    var before_count = 0;
    var after_count = 0;
    var is_found = false;
    for (var i=0; i < tables.length; i++)
    {
      if (tables[i].className.indexOf('translations') >= 0)
      {
        var gloss = util.getTransGloss(tables[i]);
        if (gloss == "Traductions à vérifier")
          continue;

        if (tables[i] == node)
        {
          is_found = true;
          continue;
        }

        var pos = util.getTransTable(text, tables[i], true);

        if (pos)
        {
          for (var j=0; j < poss.length; j++)
          {
            if (poss[j] == pos)
              return util.tieBreakTransTable(poss.splice(j, 1), node);
          }
        }
        else
        {
          var matched = 0;
          for (var j=0; j < poss.length; j++)
          {
            if (util.matchGloss(util.getWikitextGloss(text, poss[j]), gloss) &&
                util.matchGloss(gloss, util.getWikitextGloss(text, poss[j])))
            {
              matched++;
            }
          }
          if (matched == poss.length)
          {
            if (is_found)
              after_count++;
            else
              before_count++;
          }
        }
      }
    }

    if (before_count + 1 + after_count == poss.length)
      return [poss[before_count]];
    else
      return poss;
  },

  matchGloss: function (line, gloss)
  {
    if (gloss.match(/^ *$/))
      return !!(line.match(/\{\{\(\| *\}\}/) || line.match(/^ *$/));

    var words = gloss.split(/\W+/);
    var pos = 0;
    for (var i=0; i < words.length; i++)
    {
      pos = line.indexOf(words[i], pos);
      if (pos == -1)
        return false;
    }
    return pos > -1;
  },

  //User:Karelklic
  getTransGlossText: function (node) {
    var ret = '';
    var children = node.childNodes;
    for (var i=0; i<children.length; i++)
    {
      if (children[i].nodeType == 3)
        ret += children[i].nodeValue;
      else if (children[i].nodeName.match(/^(i|b)$/i) || children[i].className.indexOf('wt-edit-recurse') > -1)
        ret += util.getTransGlossText(children[i]);
      else if (ret.match(/\w$/)) //Prevent new words from being created across node boundaries
        ret += " ";
    }
    // all characters except a-zA-Z0-9 are changed to spaces
    return ret.replace(/\W/g, ' ');
  },

  getTransGloss: function (ul)
  {
    var node = ul;
    while (node && node.className.indexOf('boite') == -1)
      node = node.parentNode;

    if (!node) return '';

    var children = node.getElementsByTagName('div');
    for (var i=0; i< children.length; i++)
    {
      if(children[i].className && children[i].className.indexOf('NavHead') > -1)
        return util.getTransGlossText(children[i]);

    }
    return '';
  },

  isTrreq: function (li)
  {
    var spans = li.getElementsByTagName('span');
    return (spans && spans.length > 0 && spans[0].className.indexOf("trreq") > -1)
  }
};

/**
 * A small amount of common code that can be usefully applied to adder forms.
 *
 * An adder is assumed to be an object that has:
 *
 * .fields  A object mapping field names to either validation functions used
 *          for text fields, or the word 'checkbox'
 *
 * .createForm  A function () that returns a newNode('form') to be added to the
 *              document (by appending to insertNode)
 *
 * .onsubmit  A function (values, register (wikitext, callback)) that accepts
 *            the validated set of values and processes them, the register
 *            function accepts wikitext and a continuation function to be
 *            called with the result of rendering it.
 *
 * Before onsubmit or any validation functions are called, but after running
 * createForm, a new property .elements will be added to the adder which is a
 * dictionary mapping field names to HTML input elements.
 *
 * @param {editor}  The current editor.
 * @param {adder}  The relevant adder.
 * @param {insertNode}  Where to insert this in the document.
 * @param {insertSibling} Where to insert this within insertNode.
 */
function AdderWrapper (editor, adder, insertNode, insertSibling)
{
  var form = adder.createForm()
  var status = newNode('span');

  form.appendChild(status);
  if (insertSibling)
    insertNode.insertBefore(form, insertSibling);
  else
    insertNode.appendChild(form);

  adder.elements = {};

  //This is all because IE doesn't reliably allow form.elements['name']
  for (var i=0; i< form.elements.length; i++)
  {
    adder.elements[form.elements[i].name] = form.elements[i];
  }

  form.onsubmit = function ()
  {
    try
    {
      var submit = true;
      var values = {}

      status.innerHTML = "";
      for (var name in adder.fields)
      {
        if (adder.fields[name] == 'checkbox')
        {
          values[name] = adder.elements[name].checked ? name : false;
        }
        else
        {
          values[name] = adder.fields[name](adder.elements[name].value || '', function (msg)
          {
            status.appendChild(newNode('span',{style:'color: red'}, msg, newNode('br')));
            return false
          });

          if (values[name] === false)
            submit = false;
        }
      }
      if (!submit)
        return false;

      var loading = newNode('span', 'Loading...');
      status.appendChild(loading);

      adder.onsubmit(values, function (text, callback)
      {
        editor.page.parseFragment(text, function (res)
        {
          if (!res)
            return loading.appendChild(newNode('p', {style: 'color: red'}, "Connexion au serveur impossible."));

          callback(res);
          status.removeChild(loading);
        });
      });
    }
    catch(e)
    {
      status.innerHTML = "Erreur :" + e.description;
      return false;
    }

    return false;
  }

}
// An adder for translations on en.wikt
function TranslationAdders (editor)
{
  function TranslationAdder (insertUl)
  {
    // Hippietrail
    var langmetadata = new LangMetadata ();

    this.fields =  {
      lang: function (txt, error)
      {
        if (/^[a-z]{2,3}(-[a-z\-]{1,7})?$/.test(txt)) return txt;
        return error("Merci d'utiliser un code langue (en, fr, de)")
      },
      word: function (txt, error)
      {
        if (txt == '{'+'{trreq}}')
          return txt;

        if (txt.indexOf(',') == -1 || forceComma)
        {
          forceComma = false;
          return util.validateNoWikisyntax('translation', true)(txt, error);
        }

        if (prefs.get('comma-knowledge', 'none') == 'none')
        {
          return error(newNode('span',
              "Merci d'ajouter une seule traduction à la fois. If this is one translation that contains a comma, you can ",
              newNode('span', {style: "color: blue; text-decoration: underline; cursor: pointer;", click: function ()
                {
                  forceComma = true;
                  inputForm.onsubmit();
                  prefs.set('comma-knowledge', 'guru')
                }}, "l'ajouter en cliquant ici.")))
        }
        else
        {
          var msg = newNode('span',
              newNode('span', {style: "color: blue; text-decoration: underline; cursor: pointer;", click: function ()
                {
                  prefs.set('comma-knowledge', 'none')
                  try{ msg.parentNode.removeChild(msg); } catch(e) {}
                  editor.undo()
                }}, "Merci de cliquer sur défaire"), " les listes de traductions ne sont pas encore disponibles en une fois.");

          error(msg)
          return txt;
        }
      },
      qual: util.validateNoWikisyntax('qualifier'),
      tr: util.validateNoWikisyntax('transcription'),
      alt: util.validateNoWikisyntax('page name'),
      sc: function (txt, error)
      {
        if (txt && !/^((?:[a-z][a-z][a-z]?-)?[A-Z][a-z][a-z][a-z]|polytonic|unicode)$/.test(txt))
          return error(newNode('span', "Merci d'utiliser un ", newNode('a',{href: '/wiki/Catégorie:Modèles de script'},"modèle de script"), "(e.g. fa-Arab, Deva, polytonic)"))

        if (!txt)
          txt = prefs.get('script-' + thiz.elements.lang.value, langmetadata.guessScript(thiz.elements.lang.value) || '');
        if (txt == 'Latn')
          txt = '';
        return txt;
      },
      m: 'checkbox', f: 'checkbox', n: 'checkbox', c: 'checkbox', p: 'checkbox'
    };

    this.createForm = function ()
    {
      var controls = {
        lang: newNode('input', {size:4, type:'text', name:'lang', value:prefs.get('curlang',''), title:'Les 2 ou 3 lettres du code langue ISO 639'}),
        transliteration: newNode('span', newNode('a', {href: '/wiki/Wiktionary:Traduction'}, "Traduction"), ": ",
            newNode('input', {name: "tr", title: "Le mot romanisé."}), " (ex : ázbuka pour азбука)"),
        qualifier: newNode('p', "Qualificatif : ", newNode('input', {name: 'qual', title: "Un qualificatif pour le mot"}), " (ex : littéralement, formellement, argot)"),
        display: newNode('p',"Nom de la page : ", newNode('input', {name: 'alt', title: "Le mot avec toutes les diacritiques du dictionnaire."}), " (ex : amo pour amō)"),
        script: newNode('p', newNode('a', {href: '/wiki/Catégorie:Modèles de script'},"Modèle de script"),": ",
            newNode('input', {name: 'sc', size: 6, title: "Le modèle de script pour rendre ce mot en."}), "(ex : Cyrl pour Cyrillic, Latn pour Latin)", newNode('br')),
        gender_m: newNode('span',newNode('input', {type: 'checkbox', name: 'm'}), 'masc. '),
        gender_f: newNode('span', newNode('input', {type: 'checkbox', name: 'f'}), 'fém. '),
        gender_n: newNode('span', newNode('input', {type: 'checkbox', name: 'n'}), 'neuter '),
        gender_c: newNode('span', newNode('input', {type: 'checkbox', name: 'c'}), 'common\u00A0gender '),
        plural: newNode('span', newNode('input', {type: 'checkbox', name: 'p'}), 'pluriel ', newNode('br'))
      };

      controls.gender = newNode('p', controls.gender_m, controls.gender_f, controls.gender_n, controls.gender_c, controls.plural);

      langInput = controls.lang;

      var showButton = newNode('span',{'click': function ()
        {
          if (!advancedMode)
          {
            advancedMode = true;
            showButton.innerHTML = " Moins";
          }
          else
          {
            advancedMode = false;
            showButton.innerHTML = " Plus";
          }
          updateScriptGuess.call(langInput, true);
        }, 'style':"color: #0000FF;cursor: pointer;"}, advancedMode ? " Moins" : " Plus");

      function autoTransliterate () {
        if (thiz.elements.word.value == '{'+'{trreq}}')
          thiz.elements.alt.value = ''
        else
          thiz.elements.alt.value = langmetadata.generateAltForm(thiz.elements.lang.value, thiz.elements.word.value) || '';
      }
      function updateScriptGuess (preserve) {
        preserve = (preserve === true);

        //show all arguments
        function show ()
        {
          for (var i=0; i<arguments.length; i++)
          {
            if (arguments[i].nodeName.toLowerCase() == 'p')
              arguments[i].style.display = "block";
            else
              arguments[i].style.display = "inline";
          }

        }
        //hide all arguments
        function hide ()
        {
          for (var i=0; i < arguments.length; i++)
            arguments[i].style.display = "none";
        }
        //if the first argument is false hide the remaining arguments, otherwise show them.
        function toggle (condition)
        {
          if (condition) //eww...
            show.apply(this, [].splice.call(arguments, 1, arguments.length - 1));
          else
            hide.apply(this, [].splice.call(arguments, 1, arguments.length - 1));
        }

        if (!preserve)
          langInput.value = cleanLangCode(langInput.value);

        var guess = prefs.get('script-' + langInput.value, langmetadata.guessScript(langInput.value || ''));
        if (!preserve)
        {
          if (guess)
            thiz.elements.sc.value = guess;
          else
            thiz.elements.sc.value = '';

          autoTransliterate();
        }

        var lang = langInput.value;

        if (!advancedMode)
        {
          var g = langmetadata.getGenders(lang);

          if (!lang)
          {
            hide(controls.gender);
          }
          else if (g == undefined)
          {
            show(controls.gender,controls.gender_m, controls.gender_f, controls.gender_n, controls.gender_c);
          }
          else
          {
            toggle(g.indexOf('m') > -1, controls.gender);
            toggle(g.indexOf('m') > -1, controls.gender_m);
            toggle(g.indexOf('f') > -1, controls.gender_f);
            toggle(g.indexOf('n') > -1, controls.gender_n);
            toggle(g.indexOf('c') > -1, controls.gender_c);
          }

          var p = langmetadata.hasPlural(lang);

          toggle(p !== false, controls.plural);
          toggle(g || p, controls.gender);

          toggle(guess && guess != 'Latn', controls.transliteration);

          var alt = langmetadata.needsAlt(lang);

          toggle(alt === true, controls.display);

          hide(controls.qualifier); //only in more
          hide(controls.script); //should be in less when array returned from .getScripts

        }
        else
        {
          show(controls.gender, controls.gender_m, controls.gender_f, controls.gender_n, controls.gender_c,
              controls.plural, controls.transliteration, controls.qualifier, controls.display,
              controls.script);
        }
      }

      //In browsers other than IE this can be in the newNode function above
      langInput.onchange = updateScriptGuess;

      window.setTimeout(function () {updateScriptGuess.call(langInput)}, 0);

      inputForm = newNode('form',
          newNode('p', newNode('a',{href:"/wiki/User_talk:Sniff/editor.js#Usage"},"Ajouter la traduction"),' ',
              langInput, newNode('b',': '), newNode('input', {'name': 'word', size:20, change:autoTransliterate}),
              newNode('input',{'type': 'submit', 'value':'Prévisualiser la traduction'}), showButton
          ),
          controls.gender,
          controls.transliteration,
          controls.display,
          controls.qualifier,
          controls.script
      )
      return inputForm;
    }

    this.onsubmit = function (values, render)
    {
      var wikitext;
      if (values.word.indexOf('{'+'{trreq') == 0)
        wikitext = '{'+'{trreq|' + '{'+'{subst:' + values.lang + '|l=}}}}'
      else
        wikitext = '{'+'{T|' + values.lang + '}} : ' +
            (values.qual? '{'+'{qualifier|' + values.qual + '}} ' : '') +
            '{'+'{trad' + (langmetadata.hasWiktionary(values.lang) ? '' : '--') +
            '|' + values.lang + '|' + (values.alt ? values.alt : values.word) +
            (values.m ? '|m' : '') +
            (values.f ? '|f' : '') +
            (values.n ? '|n' : '') +
            (values.c ? '|c' : '') +
            (values.p ? '|p' : '') +
            (values.tr ? '|tr=' + values.tr : '') +
            ((values.alt && values.alt != values.word) ? '|alt=' + values.word : '') +
            (values.sc ? '|sc=' + values.sc  : '') + '}}';
      render(wikitext, function (html) { registerEdits(values, wikitext, html)});
      if (!this.balancer)
        this.balancer = new TranslationBalancer(editor, insertUl.parentNode.parentNode.parentNode);
    }

    var thiz = this;
    var prefs = new CookiePreferences('TranslationAdder');
    var langInput;
    var inputForm;
    var advancedMode = prefs.get('more-display', 'none') != 'none'; //from ye days of yore
    var forceComma = false;

    //Reset elements to default values.
    function resetElements ()
    {
      if (prefs.get('more-display', 'none') != advancedMode ? 'block' : 'none')
        prefs.set('more-display', advancedMode ? 'block' : 'none'); //named for compatibility
      thiz.elements.word.value = thiz.elements.tr.value = thiz.elements.alt.value = thiz.elements.qual.value = '';
      thiz.elements.m.checked = thiz.elements.f.checked = thiz.elements.n.checked = thiz.elements.c.checked = thiz.elements.p.checked = false;
      prefs.set('curlang', thiz.elements.lang.value);
      if ((thiz.elements.sc.value || 'Latn') != (prefs.get('script-'+thiz.elements.lang.value, langmetadata.guessScript(thiz.elements.lang.value) || 'Latn')))
      {
        prefs.set('script-'+thiz.elements.lang.value, thiz.elements.sc.value);
        thiz.elements.lang.update();
      }
    }

    // This is onsubmit after the wikitext has been rendered to give content
    function registerEdits (values, wikitext, content)
    {
      var li = newNode('li');
      li.innerHTML = content;
      var lang = getLangName(li);
      var summary = 'trad+' + values.lang + ':[[' + (values.alt || values.word) + ']]';

      var insertBefore = null;
      var nextLanguage = null;

      function addEdit (edit, span)
      {
        editor.addEdit({
          'undo': function ()
          {
            edit.undo();
            if (thiz.elements.word.value == "" &&
                thiz.elements.tr.value == "" &&
                thiz.elements.alt.value == "" &&
                thiz.elements.qual.value == "")
            {
              var fields = ["lang","word","alt","qual","tr","sc"];
              var cb = "mnfcp".split("");
              for (var i=0; i < fields.length; i++)
              {
                thiz.elements[fields[i]].value = values[fields[i]];
              }
              for (var i=0; i < cb.length; i++)
              {
                thiz.elements[fields[i]].checked = values[fields[i]];
              }
            }
          },
          'redo': function ()
          {
            edit.redo();
            var fields = ["lang","word","alt","qual","tr","sc"];
            for (var i=0; i < fields.length; i++)
            {
              if (thiz.elements[fields[i]].value != values[fields[i]])
                return;
            }
            resetElements();
          },
          'edit': edit.edit,
          'summary': summary
        }, span);
      }


      if (lang)
      {
        //Get all li's in this table row.
        var lis = [];
        var ls = insertUl.parentNode.parentNode.getElementsByTagName('li');
        for (var j=0; j < ls.length; j++)
          lis.push(ls[j]);

        ls = insertUl.parentNode.parentNode.getElementsByTagName('dd');
        for (var j=0; j < ls.length; j++)
          lis.push(ls[j]);

        for (var j=0; j < lis.length; j++)
        {
          if (lis[j].getElementsByTagName('form').length > 0)
            continue;
          var ln = getLangName(lis[j]);
          if (ln == lang)
          {
            if (values.word == '{'+'{trreq}}') {
              addEdit({
                'redo': function () {},
                'undo': function () {},
                'edit': function () {
                  return editor.error("Impossible d'ajouter une requête de traduction à une langue avec traductions");
                }
              });
              return resetElements();
            }

            var span = newNode('span');
            var parent = lis[j];
            if (util.isTrreq(parent))
            {
              span.innerHTML = content;
              var trspan = parent.getElementsByTagName('span')[0];
              addEdit({
                'redo': function () { parent.removeChild(trspan); parent.appendChild(span); },
                'undo': function () { parent.removeChild(span); parent.appendChild(trspan); },
                'edit': getEditFunction(values, wikitext, ln, values.lang, true, function (text, ipos)
                {
                  //Converting a Translation request into a translation
                  var lineend = text.indexOf('\n', ipos);
                  return text.substr(0, ipos) + wikitext + text.substr(lineend);
                })
              }, span);
            }
            else
            {
              if (parent.getElementsByTagName('ul').length + parent.getElementsByTagName('dl').length == 0)
              {
                span.innerHTML = ", " + content.substr(content.indexOf(':') + 1);
                addEdit({
                  'redo': function () { parent.appendChild(span) },
                  'undo': function () { parent.removeChild(span) },
                  'edit': getEditFunction(values, wikitext, ln, values.lang, false, function (text, ipos)
                  {
                    //We are adding the wikitext to a list of translations that already exists.
                    var lineend = text.indexOf('\n', ipos);
                    wikitext = wikitext.replace('subst:','');
                    wikitext = wikitext.substr(wikitext.indexOf(':') + 1);
                    return text.substr(0, lineend) + ", " + wikitext + text.substr(lineend);
                  })
                }, span);
                return resetElements();
              }
              else
              {
                var node = parent.firstChild;
                var hastrans = false;
                while (node)
                {
                  if (node.nodeType == 1)
                  {
                    var nn = node.nodeName.toUpperCase();
                    if (nn == 'UL' || nn == 'DL')
                    {
                      span.innerHTML = (hastrans ? ", ": " ") + content.substr(content.indexOf(':') + 1);
                      addEdit({
                        'redo': function () { parent.insertBefore(span, node) },
                        'undo': function () { parent.removeChild(span) },
                        'edit': getEditFunction(values, wikitext, ln, values.lang, false, function (text, ipos)
                        {
                          //Adding the translation to a language that has nested translations under it
                          var lineend = text.indexOf('\n', ipos);
                          wikitext = wikitext.replace('subst:','');
                          wikitext = wikitext.substr(wikitext.indexOf(':') + 1);
                          return text.substr(0, lineend) + (hastrans ? ", " : " ") + wikitext + text.substr(lineend);
                        })
                      }, span);
                      return resetElements();
                    }
                    else
                    {
                      hastrans = true;
                    }

                  }
                  node = node.nextSibling;
                }
              }
            }
            return resetElements();
          }
          else if (ln && ln > lang && (!nextLanguage || ln < nextLanguage) && lis[j].parentNode.parentNode.nodeName.toLowerCase() != 'li')
          {
            nextLanguage = ln;
            var parent = lis[j];
            insertBefore = [
              {
                'redo': function () {parent.parentNode.insertBefore(li, parent);},
                'undo': function () {parent.parentNode.removeChild(li)},
                'edit': getEditFunction(values, wikitext, ln, getLangCode(parent), util.isTrreq(parent), function (text, ipos)
                {
                  //Adding a new language's translation before another language's translation
                  var lineend = text.lastIndexOf('\n', ipos);
                  return text.substr(0, lineend) + "\n* " + wikitext + text.substr(lineend);
                })
              },li];
          }
        }
      }
      if (values.nested)
      {
        nextLanguage = null;
        insertBefore = null;

        var lis = insertUl.parentNode.parentNode.getElementsByTagName('li');
        for (var j = 0; j < lis.length; j++)
        {
          //Ignore the editor form
          if (lis[j].getElementsByTagName('form').length > 0)
            continue;

          //Don't look at nested translations
          if (lis[j].parentNode.parentNode.nodeName.toLowerCase() != 'li')
            continue;

          var ln = getLangName(lis[j]);
          if (ln == values.nested)
          {
            var sublis = lis[j].getElementsByTagName('li');

            if (! sublis.length)
              sublis = lis[j].getElementsByTagName('dd');

            if (sublis.length == 0)
            {
              var parent = lis[j];
              var dd = newNode('dd');
              var dl = newNode('dl', dd);
              dd.innerHTML = content;

              addEdit({
                'redo': function () {parent.appendChild(dl);},
                'undo': function () {parent.removeChild(dl);},
                'edit': getEditFunction(values, wikitext, values.nested, null, util.isTrreq(parent), function (text, ipos)
                {
                  //Adding a new dl to an existing translation line
                  var lineend = text.indexOf('\n', ipos);
                  return text.substr(0, lineend) + "\n*: " + wikitext + text.substr(lineend);
                })
              }, dd);
            }
            else
            {
              //Adding a new dd to an existing dl

            }

            return resetElements();
          }
          else if (ln && ln > values.nested && (!nextLanguage || ln < nextLanguage))
          {
            nextLanguage = ln;
            var parent = lis[j];
            li.innerHTML = values.nested + ":" + "<dl><dd>" + content + "</dd></dl>";
            insertBefore = [
              {
                'redo': function () {parent.parentNode.insertBefore(li, parent);},
                'undo': function () {parent.parentNode.removeChild(li)},
                'edit': getEditFunction(values, wikitext, ln, getLangCode(parent), util.isTrreq(parent), function (text, ipos)
                {
                  //Adding a new nested translation section.
                  var lineend = text.lastIndexOf('\n', ipos);
                  return text.substr(0, lineend) + "* " + values.nested + "\n*: " + wikitext + text.substr(lineend);
                })
              },li];
          }
        }
      }

      li.className = "trans-" + wikitext.replace(/.*\{\{subst:/,'').replace(/[\|\}].*/, '');
      if (insertBefore)
      {
        addEdit(insertBefore[0], insertBefore[1]);
      }
      else
      {
        //Append the translations to the end (no better way found)
        addEdit({
          'redo': function () {insertUl.appendChild(li);},
          'undo': function () {insertUl.removeChild(li)},
          'edit': getEditFunction(values, wikitext)
        }, li);
      }
      return resetElements();
    }

    //Get the wikitext modification for the current form submission.
    function getEditFunction (values, wikitext, findLanguage, findLangCode, trreq, callback)
    {
      return function(text)
      {
        var p = util.getTransTable(text, insertUl);

        if (!p)
          return editor.error("Table de traduction introuvable pour '" + values.lang + ":" + values.word + "'. Les explications doivent être uniques");

        var stapos = p[0];
        var endpos = p[1];

        if (findLanguage)
        {
          var ipos = 0;
          if (trreq)
          {
            ipos = text.indexOf('{'+'{trreq|'+findLanguage+'}}', stapos);
            if (ipos < 0 || ipos > endpos)
              ipos = text.indexOf('{'+'{trreq|'+findLangCode+'}}', stapos);
            if (ipos < 0 || ipos > endpos)
              ipos = text.indexOf('{'+'{trreq|{'+'{subst:'+findLangCode+'|l=}}}}', stapos);
          }

          // If we have a nested trreq, then we still need to look for the non-trreq form of the heading language
          if (!trreq || ipos < 0 || ipos > endpos )
          {
            ipos = text.indexOf('{'+'{T|'+findLangCode+'}} :', stapos);
          }

          if (ipos >= stapos && ipos < endpos)
          {
            return callback(text, ipos, trreq);
          }
          else
          {
            return editor.error("Traduction introuvable pour '" + values.lang + ":" +values.word + "'. Merci de reformater");
          }
        }

        return text.substr(0, endpos) + "* " + wikitext + "\n" + text.substr(endpos);
      };
    }

    //Given user input, return a language code. For all languages in ISO 639-1, this will convert the name and the ISO 639-3 code to the -1 code.
    //FIXME: move to meta-data
    function cleanLangCode(lang)
    {
      var key = lang.toLowerCase().replace(' ','');
      var dict = {aar:"aa",afar:"aa",abk:"ab",abkhazian:"ab",afr:"af",afrikaans:"af",aka:"ak",akan:"ak",amh:"am",amharic:"am",ara:"ar",arabic:"ar",arg:"an",aragonese:"an",asm:"as",assamese:"as",ava:"av",avaric:"av",ave:"ae",avestan:"ae",aym:"ay",aymara:"ay",aze:"az",azerbaijani:"az",bak:"ba",bashkir:"ba",bam:"bm",bambara:"bm",bel:"be",belarusian:"be",ben:"bn",bengali:"bn",bis:"bi",bislama:"bi",bod:"bo",tibetan:"bo",bos:"bs",bosnian:"bs",bre:"br",breton:"br",bul:"bg",bulgarian:"bg",cat:"ca",catalan:"ca",ces:"cs",czech:"cs",cha:"ch",chamorro:"ch",che:"ce",chechen:"ce",chu:"cu",churchslavic:"cu",chv:"cv",chuvash:"cv",cor:"kw",cornish:"kw",cos:"co",corsican:"co",cre:"cr",cree:"cr",cym:"cy",welsh:"cy",dan:"da",danish:"da",deu:"de",german:"de",div:"dv",dhivehi:"dv",dzo:"dz",dzongkha:"dz",ell:"el",greek:"el",eng:"en",english:"en",epo:"eo",esperanto:"eo",est:"et",estonian:"et",eus:"eu",basque:"eu",ewe:"ee",fao:"fo",faroese:"fo",fas:"fa",persian:"fa",fij:"fj",fijian:"fj",fin:"fi",finnish:"fi",fra:"fr",french:"fr",fry:"fy",westernfrisian:"fy",ful:"ff",fulah:"ff",gla:"gd",scottishgaelic:"gd",gle:"ga",irish:"ga",glg:"gl",galician:"gl",glv:"gv",manx:"gv",grn:"gn",guarani:"gn",guj:"gu",gujarati:"gu",hat:"ht",haitian:"ht",hau:"ha",hausa:"ha",heb:"he",hebrew:"he",her:"hz",herero:"hz",hin:"hi",hindi:"hi",hmo:"ho",hirimotu:"ho",hrv:"hr",croatian:"hr",hun:"hu",hungarian:"hu",hye:"hy",armenian:"hy",ibo:"ig",igbo:"ig",ido:"io",iii:"ii",sichuanyi:"ii",iku:"iu",inuktitut:"iu",ile:"ie",interlingue:"ie",ina:"ia",interlingua:"ia",ind:"id",indonesian:"id",ipk:"ik",inupiaq:"ik",isl:"is",icelandic:"is",ita:"it",italian:"it",jav:"jv",javanese:"jv",jpn:"ja",japanese:"ja",kal:"kl",kalaallisut:"kl",kan:"kn",kannada:"kn",kas:"ks",kashmiri:"ks",kat:"ka",georgian:"ka",kau:"kr",kanuri:"kr",kaz:"kk",kazakh:"kk",khm:"km",centralkhmer:"km",kik:"ki",kikuyu:"ki",kin:"rw",kinyarwanda:"rw",kir:"ky",kirghiz:"ky",kom:"kv",komi:"kv",kon:"kg",kongo:"kg",kor:"ko",korean:"ko",kua:"kj",kuanyama:"kj",kur:"ku",kurdish:"ku",lao:"lo",lat:"la",latin:"la",lav:"lv",latvian:"lv",lim:"li",limburgan:"li",lin:"ln",lingala:"ln",lit:"lt",lithuanian:"lt",ltz:"lb",luxembourgish:"lb",lub:"lu",lubakatanga:"lu",lug:"lg",ganda:"lg",mah:"mh",marshallese:"mh",mal:"ml",malayalam:"ml",mar:"mr",marathi:"mr",mkd:"mk",macedonian:"mk",mlg:"mg",malagasy:"mg",mlt:"mt",maltese:"mt",mon:"mn",mongolian:"mn",mri:"mi",maori:"mi",msa:"ms",malay:"ms",mya:"my",burmese:"my",nau:"na",nauru:"na",nav:"nv",navajo:"nv",nbl:"nr",southndebele:"nr",nde:"nd",northndebele:"nd",ndo:"ng",ndonga:"ng",nep:"ne",nepali:"ne",nld:"nl",dutch:"nl",nno:"nn",norwegiannynorsk:"nn",nob:"nb",norwegianbokmal:"nb",nor:"no",norwegian:"no",nya:"ny",nyanja:"ny",oci:"oc",occitan:"oc",oji:"oj",ojibwa:"oj",ori:"or",oriya:"or",orm:"om",oromo:"om",oss:"os",ossetian:"os",pan:"pa",panjabi:"pa",pli:"pi",pali:"pi",pol:"pl",polish:"pl",por:"pt",portuguese:"pt",pus:"ps",pushto:"ps",que:"qu",quechua:"qu",roh:"rm",romansh:"rm",ron:"ro",romanian:"ro",run:"rn",rundi:"rn",rus:"ru",russian:"ru",sag:"sg",sango:"sg",san:"sa",sanskrit:"sa",sin:"si",sinhala:"si",slk:"sk",slovak:"sk",slv:"sl",slovenian:"sl",sme:"se",northernsami:"se",smo:"sm",samoan:"sm",sna:"sn",shona:"sn",snd:"sd",sindhi:"sd",som:"so",somali:"so",sot:"st",southernsotho:"st",spa:"es",spanish:"es",sqi:"sq",albanian:"sq",srd:"sc",sardinian:"sc",srp:"sr",serbian:"sr",ssw:"ss",swati:"ss",sun:"su",sundanese:"su",swa:"sw",swahili:"sw",swe:"sv",swedish:"sv",tah:"ty",tahitian:"ty",tam:"ta",tamil:"ta",tat:"tt",tatar:"tt",tel:"te",telugu:"te",tgk:"tg",tajik:"tg",tgl:"tl",tagalog:"tl",tha:"th",thai:"th",tir:"ti",tigrinya:"ti",ton:"to",tonga:"to",tsn:"tn",tswana:"tn",tso:"ts",tsonga:"ts",tuk:"tk",turkmen:"tk",tur:"tr",turkish:"tr",twi:"tw",uig:"ug",uighur:"ug",ukr:"uk",ukrainian:"uk",urd:"ur",urdu:"ur",uzb:"uz",uzbek:"uz",ven:"ve",venda:"ve",vie:"vi",vietnamese:"vi",vol:"vo",volapuk:"vo",wln:"wa",walloon:"wa",wol:"wo",wolof:"wo",xho:"xh",xhosa:"xh",yid:"yi",yiddish:"yi",yor:"yo",yoruba:"yo",zha:"za",zhuang:"za",zho:"zh",chinese:"zh",zul:"zu",zulu:"zu"};
      if (dict[key])
        return dict[key];
      else
        return lang;
    }
    // For an <li> in well-formed translation sections, return the language name.
    function getLangName(li)
    {
      var guess = li.textContent || li.innerText;

      if (guess)
        guess = guess.substr(0, guess.indexOf(':'));

      if (guess == 'Template') {
        return false;
      }

      return guess.replace(/^[\s\n]*/,'');
    }

    // Try to get the language code from an <li> containing { {t t+ or t-	// }}
    function getLangCode(li)
    {
      var spans = li.getElementsByTagName('span');
      for (var i=0; i < spans.length; i++)
      {
        if (spans[i].lang) {
          return spans[i].lang;
        }
      }
      if (li.className.indexOf('trans-') == 0)
        return li.className.substr(6);
      return false;
    }

  }
  var tables = document.getElementsByTagName('table');
  for (var i=0; i<tables.length; i++)
  {
    if (tables[i].className.indexOf('translations') > -1 && util.getTransGloss(tables[i]) != 'Traductions à vérifier')
    {
      var _lists = tables[i].getElementsByTagName('ul');
      var lists = [];
      for (var j=0; j<_lists.length; j++)
        if (_lists[j].parentNode.nodeName.toLowerCase() == 'td')
          lists.push(_lists[j]);

      if (lists.length == 0)
      {
        tables[i].getElementsByTagName('td')[0].appendChild(newNode('ul'));
        lists = tables[i].getElementsByTagName('ul');
      }
      if (lists.length == 1)
      {
        var table = tables[i].getElementsByTagName('td')[1]
        if (table)
        {
          table.appendChild(newNode('ul'));
          lists = tables[i].getElementsByTagName('ul');
        }
      }
      if (lists)
      {
        var li = newNode('li');
        var ul = lists[lists.length - 1];
        var table = tables[i];
        if (table.getElementsByTagName('tbody').length > 0)
          table = table.getElementsByTagName('tbody')[0];
        ul.appendChild(li);
        new AdderWrapper(editor, new TranslationAdder(ul), li);
      }
    }
  }
}

function TranslationBalancer (editor, insertTable)
{
  var status;

  //create the form
  function init ()
  {
    var cns = insertTable.getElementsByTagName('tr')[0].childNodes;
    var tds = [];
    //Find all three table cells in the translation table.
    for (var i=0; i<cns.length; i++)
    {
      if (cns[i].nodeName.toUpperCase() == 'TD')
        tds.push(cns[i])
    }

    //Ensure that there is a <ul> on the left side of the balancer.
    var left = tds[0].getElementsByTagName('ul');
    if (left.length > 0)
      left = left[0];
    else
    {
      left = newNode('ul');
      tds[0].appendChild(left);
    }

    //Ensure that there is a <ul> on the right side of the balancer.
    var right = tds[2].getElementsByTagName('ul');
    if (right.length > 0)
      right = right[0];
    else
    {
      right = newNode('ul');
      tds[2].appendChild(right);
    }

    var moveLeft = newNode('input',{'type':'submit','name':'ml', 'value':'←', 'click': function(){return prepareEdits('←', left, right)}});
    var moveRight = newNode('input',{'type':'submit','name':'mr', 'value':'→', 'click': function(){return prepareEdits('→', left, right)}});
    status = newNode('span');

    var form = newNode('form', moveLeft, newNode('br'), moveRight, newNode('br'), status);
    tds[1].appendChild(form);
    form.onsubmit = function () { return false; } //Must be done after the appendChild for IE :(
  }

  function moveOneRight(left, right)
  {
    var li = left.lastChild;
    while (li && li.nodeName.toLowerCase() != 'li')
      li = li.previousSibling;

    if (li)
      right.insertBefore(left.removeChild(li), right.firstChild);
  }

  function moveOneLeft(left, right)
  {
    var li = right.firstChild;
    while (li && li.nodeName.toLowerCase() != 'li')
      li = li.nextSibling;

    if (li)
      left.appendChild(right.removeChild(li));
  }

  //store the edit object with the editor
  function prepareEdits(direction, left, right)
  {
    status.innerHTML = "Loading...";

    editor.addEdit({
      'redo': function () { (direction == '→' ? moveOneRight : moveOneLeft)(left, right) },
      'undo': function () { (direction == '→' ? moveOneLeft : moveOneRight)(left, right) },
      'edit': function (text) {return editWikitext(right, direction, text);},
      'summary': 't-balance'
    });
  }

  //get the wikitext modification
  function editWikitext(insertUl, direction, text)
  {
    status.innerHTML = "";
    //Find the position of the translation table
    var p = util.getTransTable(text, insertUl);

    if (!p)
      return editor.error("Table de traduction introuvable, merci d'améliorer l'explication.");

    var stapos = p[0];
    var endpos = p[1];

    //Find the start and end of the { {-}} in the table
    var midpos = text.indexOf('{'+'{-}}', stapos);
    var midstart = text.lastIndexOf("\n", midpos);
    var midend = text.indexOf("\n", midpos);

    if (midstart < stapos - 1 || midend > endpos)
      return editor.error("Impossible de trouver {'+'{-}}, merci de corriger.");

    if (direction == '→')
    {
      // Select the last list item of the left list (may be more than one line if nested translations are present)
      var linestart = text.lastIndexOf("\n", midstart - 3);
      while (/^[:*#;]$/.test(text.substr(linestart+2,1)))
        linestart = text.lastIndexOf("\n", linestart - 1);

      if (linestart < stapos - 1 || linestart >= endpos)
        return editor.error("Aucune traduction à déplacer");

      return text.substr(0, linestart)  //Everything before the item we are moving
          + text.substr(midstart, midend - midstart) //Then { {-}}
          + text.substr(linestart, midstart - linestart) //Then the item we are moving
          + text.substr(midend); //Then everything after { {-}}
    }
    else if (direction == '←')
    {
      // Select the first list item of the right list (may be more than one line if nested translations are present)
      var lineend = text.indexOf("\n", midend + 3);
      while (/^[:*#;]$/.test(text.substr(lineend+2,1)))
        lineend = text.indexOf("\n", lineend + 1);

      if (lineend < stapos - 1 || lineend >= endpos)
        return editor.error("No translations to move");

      return text.substr(0, midstart) //Everything before { {-}}
          + text.substr(midend, lineend - midend) //Then the item we are moving
          + text.substr(midstart, midend - midstart) //Then { {-}}
          + text.substr(lineend); //Then everything after the item we are moving
    }
    return text;
  }
  init();
}

function LangMetadata ()
{
  //Singleton
  if (arguments.callee.instance)
    return arguments.callee.instance
  else
    arguments.callee.instance = this;


  var metadata = {aa:{hw:true,sc:["Latn","Ethi"]},ab:{hw:true,sc:["Cyrl","Latn","Geor"]},aer:{sc:"Latn"},af:{g:"",hw:true,p:true,sc:"Latn"},ak:{hw:true},akk:{g:"mf",p:true,sc:"Xsux"},als:{hw:true},am:{g:"mf",hw:true,p:true,sc:"Ethi"},an:{g:"mf",hw:true,p:true,sc:"Latn"},ang:{alt:true,g:"mfn",hw:true,p:true,sc:"Latn"},ar:{alt:true,g:"mf",hw:true,p:true,sc:"Arab"},arc:{g:"mf",p:true,sc:"Hebr"},are:{sc:"Latn"},arz:{alt:true,g:"mf",p:true,sc:"Arab"},as:{hw:true,sc:"Beng"},ast:{g:"mf",hw:true,p:true,sc:"Latn"},av:{hw:true,sc:"Cyrl"},ay:{hw:true},az:{alt:false,g:"",hw:true,p:true,sc:["Latn","Cyrl","Arab"]},ba:{hw:true,sc:"Cyrl"},bar:{sc:"Latn"},"bat-smg":{g:"mf",p:true,sc:"Latn"},be:{g:"mfn",hw:true,p:true,sc:["Cyrl","Latn"]},"be-x-old":{sc:"Cyrl"},bg:{g:"mfn",hw:true,p:true,sc:"Cyrl"},bh:{hw:true,sc:"Deva"},bhb:{sc:"Deva"},bi:{hw:true,sc:"Latn"},blt:{sc:"Tavt"},bm:{hw:true,sc:["Latn","Nkoo","Arab"]},bn:{g:"",hw:true,sc:"Beng"},bo:{hw:true,sc:"Tibt"},br:{g:"mf",hw:true,sc:"Latn"},bs:{hw:true,sc:"Latn"},ca:{g:"mf",hw:true,p:true,sc:"Latn"},ch:{hw:true,sc:"Latn"},chr:{hw:true,sc:"Cher"},co:{hw:true,sc:"Latn"},cr:{hw:true,sc:"Cans"},crh:{alt:false,g:"",sc:"Latn"},cs:{g:"mfn",hw:true,p:true,sc:"Latn"},csb:{hw:true},cu:{g:"mfn",p:true,sc:["Cyrs","Glag"]},cv:{alt:false,g:"",sc:"Cyrl"},cy:{g:"mf",hw:true,p:true,sc:"Latn"},da:{g:"cn",hw:true,p:true,sc:"Latn"},dax:{sc:"Latn"},de:{g:"mfn",hw:true,p:true,sc:"Latn"},dhg:{sc:"Latn"},djb:{sc:"Latn"},dji:{sc:"Latn"},djr:{sc:"Latn"},dsx:{sc:"Latn"},duj:{sc:"Latn"},dv:{hw:true,p:true,sc:"Thaa"},dz:{hw:true,sc:"Tibt"},el:{g:"mfn",hw:true,p:true,sc:"Grek"},en:{g:"",hw:true,p:true,sc:"Latn"},eo:{g:"",hw:true,p:true,sc:"Latn"},es:{alt:false,g:"mf",hw:true,p:true,sc:"Latn"},et:{alt:false,g:"",hw:true,p:true,sc:"Latn"},ett:{p:true,sc:"Ital"},eu:{alt:false,g:"",hw:true,p:true,sc:"Latn"},fa:{g:"",hw:true,sc:"Arab",wsc:"fa-Arab"},fi:{g:"",hw:true,p:true,sc:"Latn"},fil:{g:"",p:false,sc:"Latn"},fj:{hw:true,sc:"Latn"},fo:{g:"mfn",hw:true,sc:"Latn"},fr:{alt:false,g:"mf",hw:true,p:true,sc:"Latn"},fy:{hw:true,sc:"Latn"},ga:{g:"mf",hw:true,p:true,sc:"Latn"},gd:{g:"mf",hw:true,p:true,sc:"Latn"},gez:{sc:"Ethi"},gl:{g:"mf",hw:true,p:true,sc:"Latn"},gmy:{sc:"Linb"},gn:{hw:true},gnn:{sc:"Latn"},got:{g:"mfn",p:true,sc:"Goth"},grc:{g:"mfn",p:true,sc:"Grek",wsc:"polytonic"},gu:{g:"mfn",hw:true,p:true,sc:"Gujr"},guf:{sc:"Latn"},gv:{hw:true},ha:{hw:true},har:{sc:"Ethi"},he:{alt:true,g:"mf",hw:true,p:true,sc:"Hebr"},hi:{g:"mf",hw:true,p:true,sc:"Deva"},hif:{sc:["Latn","Deva"]},hit:{sc:"Xsux"},hr:{alt:true,g:"mfn",hw:true,p:true,sc:"Latn"},hsb:{hw:true},hu:{alt:false,g:"",hw:true,p:true,sc:"Latn"},hy:{alt:false,g:"",hw:true,sc:"Armn"},ia:{alt:false,g:"",hw:true,sc:"Latn"},id:{hw:true,sc:"Latn"},ie:{alt:false,g:"",hw:true,sc:"Latn"},ik:{hw:true},ike:{sc:"Cans"},ikt:{sc:"Cans"},ims:{sc:"Ital"},io:{hw:true},is:{alt:false,g:"mfn",hw:true,p:true,sc:"Latn"},it:{alt:false,g:"mf",hw:true,p:true,sc:"Latn"},iu:{hw:true,sc:"Cans"},ja:{alt:false,g:"",hw:true,p:false,sc:"Jpan"},jay:{sc:"Latn"},jbo:{hw:true,sc:"Latn"},jv:{hw:true},ka:{alt:false,g:"",hw:true,sc:"Geor"},khb:{sc:"Talu"},kjh:{sc:"Cyrl"},kk:{alt:false,g:"",hw:true,sc:"Cyrl"},kl:{hw:true},km:{hw:true,sc:"Khmr"},kn:{hw:true,sc:"Knda"},ko:{alt:false,g:"",hw:true,p:false,sc:"Kore"},krc:{alt:false,g:"",p:true,sc:"Cyrl"},ks:{hw:true,sc:["Arab","Deva"],wsc:"ks-Arab"},ku:{hw:true,sc:"Arab",wsc:"ku-Arab"},kw:{hw:true},ky:{alt:false,g:"",hw:true,sc:"Cyrl"},la:{alt:true,g:"mfn",hw:true,p:true,sc:"Latn"},lb:{hw:true},lez:{sc:"Cyrl"},li:{hw:true},ln:{hw:true},lo:{alt:false,g:"",hw:true,p:false,sc:"Laoo"},lt:{alt:true,g:"mf",hw:true,p:true,sc:"Latn"},lv:{alt:false,g:"mf",hw:true,p:true,sc:"Latn"},mg:{hw:true},mh:{hw:true},mi:{alt:false,g:0,hw:true,sc:"Latn"},mk:{g:"mfn",hw:true,p:true,sc:"Cyrl"},ml:{g:"",hw:true,sc:"Mlym"},mn:{alt:false,g:"",hw:true,sc:["Cyrl","Mong"]},mo:{hw:true,sc:"Cyrl"},mol:{sc:"Cyrl"},mr:{g:"mfn",hw:true,sc:"Deva"},ms:{hw:true,sc:["Latn","Arab"]},mt:{g:"mf",hw:true,sc:"Latn"},mwp:{sc:"Latn"},my:{hw:true,sc:"Mymr"},na:{hw:true},nah:{hw:true},nb:{alt:false,g:"mfn",p:true,sc:"Latn"},nds:{hw:true},ne:{hw:true,sc:"Deva"},nl:{alt:false,g:"mfn",hw:true,p:true,sc:"Latn"},nn:{alt:false,g:"mfn",hw:true,p:true,sc:"Latn"},no:{alt:false,g:"mfn",hw:true,p:true,sc:"Latn"},non:{g:"mfn",p:true,sc:"Latn"},oc:{g:"mf",hw:true,p:true,sc:"Latn"},om:{hw:true},or:{hw:true,sc:"Orya"},os:{alt:false,g:"",sc:"Cyrl"},osc:{sc:"Ital"},ota:{sc:"Arab",wsc:"ota-Arab"},pa:{g:"mf",hw:true,p:true,sc:["Guru","Arab"]},peo:{sc:"Xpeo"},phn:{sc:"Phnx"},pi:{hw:true},pjt:{sc:"Latn"},pl:{g:"mfn",hw:true,p:true,sc:"Latn"},ps:{hw:true,sc:"Arab",wsc:"ps-Arab"},pt:{alt:false,g:"mf",hw:true,p:true,sc:"Latn"},qu:{hw:true},rit:{sc:"Latn"},rm:{g:"mf",hw:true,sc:"Latn"},rn:{hw:true},ro:{g:"mfn",hw:true,p:true,sc:["Latn","Cyrl"]},"roa-rup":{hw:true},ru:{alt:true,g:"mfn",hw:true,p:true,sc:"Cyrl"},ruo:{g:"mfn",p:true,sc:"Latn"},rup:{g:"mfn",p:true,sc:"Latn"},ruq:{g:"mfn",p:true,sc:"Latn"},rw:{hw:true,sc:"Latn"},sa:{g:"mfn",hw:true,p:true,sc:"Deva"},sah:{sc:"Cyrl"},sc:{hw:true},scn:{g:"mf",hw:true,p:true,sc:"Latn"},sco:{sc:"Latn"},sd:{hw:true,sc:"Arab",wsc:"sd-Arab"},sg:{hw:true},sh:{hw:true},si:{hw:true,sc:"Sinh"},simple:{hw:true,sc:"Latn"},sk:{g:"mfn",hw:true,p:true,sc:"Latn"},sl:{g:"mfn",hw:true,p:true,sc:"Latn"},sm:{hw:true},sn:{hw:true},so:{hw:true},spx:{sc:"Ital"},sq:{alt:false,g:"mf",hw:true,sc:"Latn"},sr:{g:"mfn",hw:true,p:true,sc:["Cyrl","Latn"]},ss:{hw:true},st:{hw:true},su:{hw:true},sux:{sc:"Xsux"},sv:{alt:false,g:"cn",hw:true,p:true,sc:"Latn"},sw:{alt:false,g:"",hw:true,sc:"Latn"},syr:{sc:"Syrc"},ta:{alt:false,g:"",hw:true,sc:"Taml"},tdd:{sc:"Tale"},te:{alt:false,g:"",hw:true,sc:"Telu"},tg:{alt:false,g:"",hw:true,sc:"Cyrl"},th:{alt:false,g:"",hw:true,p:false,sc:"Thai"},ti:{hw:true,sc:"Ethi"},tig:{sc:"Ethi"},tiw:{sc:"Latn"},tk:{alt:false,g:"",hw:true,sc:"Latn"},tl:{g:"",hw:true,p:false,sc:["Latn","Tglg"]},tmr:{sc:"Hebr"},tn:{hw:true},to:{hw:true},tokipona:{hw:true},tpi:{hw:true,sc:"Latn"},tr:{alt:true,g:"",hw:true,p:true,sc:"Latn"},ts:{hw:true},tt:{alt:false,g:"",hw:true,sc:"Cyrl"},tw:{hw:true},ug:{hw:true,sc:"Arab",wsc:"ug-Arab"},uga:{sc:"Ugar"},uk:{g:"mfn",hw:true,p:true,sc:"Cyrl"},ulk:{sc:"Latn"},ur:{g:"mf",hw:true,p:true,sc:"Arab",wsc:"ur-Arab"},uz:{alt:false,g:"",hw:true,sc:"Latn"},vi:{g:"",hw:true,p:false,sc:"Latn"},vo:{hw:true},wa:{hw:true},wbp:{sc:"Latn"},wo:{hw:true},xae:{sc:"Ital"},xcl:{alt:false,g:"",sc:"Armn"},xcr:{sc:"Cari"},xfa:{sc:"Ital"},xh:{hw:true},xlc:{sc:"Lyci"},xld:{sc:"Lydi"},xlu:{sc:"Xsux"},xrr:{sc:"Ital"},xst:{sc:"Ethi"},xum:{sc:"Ital"},xve:{sc:"Ital"},xvo:{sc:"Ital"},yi:{g:"mfn",hw:true,p:true,sc:"Hebr",wsc:"yi-Hebr"},yo:{hw:true},yua:{alt:true,g:"",p:true,sc:"Latn"},za:{hw:true},zh:{g:"",hw:true,p:false,sc:"Hani"},"zh-classical":{sc:"Hant"},"zh-min-nan":{hw:true,sc:"Latn"},"zh-yue":{sc:"Hani"},zu:{hw:true,sc:"Latn"}};

  //The language code is necessary in case someone has just added a translation into "Norwegian" and wants to add a "Nynorsk" translation
  //as the wikitext will contain Norwegian: not Norwegian:. This does not support linking of the headings, it may not need to.
  // FIXME: This is all wrong....
  var nesting = {nn: ['Norwegian', 'no'], nb: ['Norwegian', 'no'], dsb: ['Sorbian',null], hsb: ['Sorbian',null], ang:['English','en'], enm: ['English','en']}

  var altForm = {
    ang: {from:"ĀāǢǣĊċĒēĠġĪīŌōŪūȲȳ", to:"AaÆæCcEeGgIiOoUuYy", strip:"\u0304\u0307"}, //macron and above dot
    ar: {strip:"\u064B\u064C\u064D\u064E\u064F\u0650\u0651\u0652"},
    he: {strip:"\u05B0\u05B1\u05B2\u05B3\u05B4\u05B5\u05B6\u05B7\u05B8\u05B9\u05BA\u05BB\u05BC\u05BD\u05BF\u05C1\u05C2"},
    hr: {from:"ȀȁÀàȂȃÁáĀāȄȅÈèȆȇÉéĒēȈȉÌìȊȋÍíĪīȌȍÒòȎȏÓóŌōȐȑȒȓŔŕȔȕÙùȖȗÚúŪū",
      to:"AaAaAaAaAaEeEeEeEeEeIiIiIiIiIiOoOoOoOoOoRrRrRrUuUuUuUuUu",
      strip:"\u030F\u0300\u0311\u0301\u0304"},
    la: {from:"ĀāĒēĪīŌōŪū", to:"AaEeIiOoUu",strip:"\u0304"}, //macron
    lt: {from:"áãàéẽèìýỹñóõòúù", to:"aaaeeeiyynooouu", strip:"\u0340\u0301\u0303"},
    sh: {from:"ȀȁÀàȂȃÁáĀāȄȅÈèȆȇÉéĒēȈȉÌìȊȋÍíĪīȌȍÒòȎȏÓóŌōȐȑȒȓŔŕȔȕÙùȖȗÚúŪū",
      to:"AaAaAaAaAaEeEeEeEeEeIiIiIiIiIiOoOoOoOoOoRrRrRrUuUuUuUuUu",
      strip:"\u030F\u0300\u0311\u0301\u0304"},
    sr: {from:"ȀȁÀàȂȃÁáĀāȄȅÈèȆȇÉéĒēȈȉÌìȊȋÍíĪīȌȍÒòȎȏÓóŌōȐȑȒȓŔŕȔȕÙùȖȗÚúŪū",
      to:"AaAaAaAaAaEeEeEeEeEeIiIiIiIiIiOoOoOoOoOoRrRrRrUuUuUuUuUu",
      strip:"\u030F\u0300\u0311\u0301\u0304"},
    tr: {from:"ÂâÛû", to:"AaUu",strip:"\u0302"},
    sl: {from: "áÁàÀâÂȃȂȁȀéÉèÈêÊȇȆȅȄíÍìÌîÎȋȊȉȈóÓòÒôÔȏȎȍȌŕŔȓȒȑȐúÚùÙûÛȗȖȕȔệỆộỘẹẸọỌ",
      to: "aAaAaAaAaAeEeEeEeEeEiIiIiIiIiIoOoOoOoOoOrRrRrRuUuUuUuUuUeEoOeEoO",
      strip: "\u0301\u0300\u0302\u0311\u030f\u0323"}
  };
  //Returns true if the specified lang.wiktionary exists according to the meta list
  this.hasWiktionary = function(lang)
  {
    if (metadata[lang])
      return metadata[lang].hw;
  }

  //Given a language code return a default script code.
  this.guessScript = function(lang)
  {
    if (metadata[lang]) {
      // enwikt language template? (ur-Arab, polytonic)
      if (metadata[lang].wsc) {
        return metadata[lang].wsc;
      }
      // ISO script code? (Arab, Grek)
      if (metadata[lang].sc) {
        if (typeof metadata[lang].sc == 'object')
          return metadata[lang].sc[0];
        else
          return metadata[lang].sc;
      }
    }

    return false;
  }

  //Returns a string of standard gender letters (mfnc) or an empty string
  this.getGenders = function(lang)
  {
    if (metadata[lang])
      return metadata[lang].g;
  }

  //Returns true if the specified lang has the concept of plural nouns
  this.hasPlural = function(lang)
  {
    if (metadata[lang])
      return metadata[lang].p;
  }

  //Returns true if the specified lang uses optional vowels or diacritics
  this.needsAlt = function(lang)
  {
    if (metadata[lang])
      return metadata[lang].alt && (!altForm[lang]);
  }

//    this.nestedUnder = function (lang)
//    {
//        if (nesting[lang])
//            return nesting[lang];
//    }

  this.generateAltForm = function (lang, word)
  {
    //FIXME: use a dictionary and iterate along the string.
    // this is horrendously slow and horrid.
    if (altForm[lang])
    {
      var alt = altForm[lang];

      var map = {};

      if (alt.from && alt.to)
      {
        for (var i = 0; i < alt.from.length; i++)
        {
          map[alt.from.charAt(i)] = alt.to.charAt(i);
        }
      }
      if (alt.strip)
      {
        for (var i = 0; i < alt.strip.length; i++)
        {
          map[alt.strip.charAt(i)] = "";
        }
      }

      var input = word.split("");
      var output = "";

      for (var i = 0; i < input.length; i++)
      {
        var repl = map[input[i]];
        output += (repl == null) ? input[i] : repl;
      }
      return output;
    }
  }
}
