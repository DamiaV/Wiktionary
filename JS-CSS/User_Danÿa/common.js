// RTRC
mw.loader.load("//meta.wikimedia.org/wiki/User:Krinkle/RTRC.js?action=raw&ctype=text/javascript");
// JWB
mw.loader.load("//en.wikipedia.org/w/index.php?title=User:Joeytje50/JWB.js/load.js&action=raw&ctype=text/javascript");
// Améliore la liste des pages liées.
mw.loader.load("//fr.wiktionary.org/wiki/User:Sebleouf/linksheredeluxe.js?action=raw&ctype=text/javascript");
// Ajoute des boutons à droite du titre de la page courante.
mw.loader.load("//fr.wiktionary.org/wiki/User:Darmo117/Gadgets/AddTitleButtons.js?action=raw&ctype=text/javascript");

var createInflectionLangs = ["en", "eo"];

var bdl_buttons = [
  {
    action: function (selectedText, language) {
      return "[[" + selectedText + "#" + language + "|" + selectedText + "]]";
    },
    promptText: "Langue",
    promptDefault: "fr",
    imageFileName: "0/0c/Button_Link_DifferentName.png",
    imageFileNameOOUI: "thumb/7/72/OOjs_UI_icon_link-ltr.svg/24px-OOjs_UI_icon_link-ltr.svg.png",
    tooltip: "Lien",
    buttonId: "link",
    group: "links",
  },
  {
    action: function (selectedText, language) {
      return "{{" + "lien|" + selectedText + "|" + language + "}}";
    },
    promptText: "Langue",
    promptDefault: "fr",
    imageFileName: "0/0c/Button_Link_DifferentName.png",
    imageFileNameOOUI: "thumb/7/72/OOjs_UI_icon_link-ltr.svg/24px-OOjs_UI_icon_link-ltr.svg.png",
    tooltip: "Lien (modèle)",
    buttonId: "link_template",
    group: "links",
  },
  {
    action: function (selectedText, language) {
      return "{{pron|" + selectedText + "|" + language + "}}";
    },
    promptText: "Langue",
    promptDefault: "fr",
    imageFileName: "1/13/Button_API_ʃ.png",
    imageFileNameOOUI: "thumb/0/0a/OOjs_UI_icon_feedback-ltr.svg/24px-OOjs_UI_icon_feedback-ltr.svg.png",
    tooltip: "Prononciation",
    buttonId: "pron",
    group: "insert",
  },
  {
    action: function (selectedText, delimiter) {
      var start, end;
      if ("[]".includes(delimiter)) {
        start = "[";
        end = "]"
      } else {
        start = end = delimiter;
      }
      return "{{pron-API|" + start + selectedText + end + "}}";
    },
    promptText: "Délimiteur",
    promptDefault: "\\",
    imageFileName: "1/13/Button_API_ʃ.png",
    imageFileNameOOUI: "thumb/0/0a/OOjs_UI_icon_feedback-ltr.svg/24px-OOjs_UI_icon_feedback-ltr.svg.png",
    tooltip: "Pron API",
    buttonId: "pron-API",
    group: "insert",
  },
  {
    tagOpen: "<code>",
    tagClose: "</code>",
    imageFileName: "2/23/Button_code.png",
    imageFileNameOOUI: "thumb/c/cd/OOjs_UI_icon_code.svg/24px-OOjs_UI_icon_code.svg.png",
    tooltip: "Baslises code",
    buttonId: "code-tag",
    group: "html_tags",
  },
  {
    action: function (selectedText, language) {
      return '<syntaxhighlight lang="' + language + '" inline>' + selectedText + '</syntaxhighlight>';
    },
    promptText: "Langage",
    promptDefault: "lua",
    imageFileName: "d/d2/Button_source.png",
    imageFileNameOOUI: "thumb/d/dc/OOjs_UI_icon_highlight.svg/24px-OOjs_UI_icon_highlight.svg.png",
    tooltip: "Balises syntaxhighlight",
    buttonId: "syntaxhighlight-tag",
    group: "html_tags",
  },
  {
    tagOpen: "<pre>",
    tagClose: "</pre>",
    imageFileName: "3/3c/Button_pre.png",
    imageFileNameOOUI: "thumb/c/cd/OOjs_UI_icon_code.svg/24px-OOjs_UI_icon_code.svg.png",
    tooltip: "Balises pre",
    buttonId: "pre-tag",
    group: "html_tags",
  },
  {
    tagOpen: "<nowiki>",
    tagClose: "</nowiki>",
    imageFileName: "5/56/BoutonsDefaut09.png",
    imageFileNameOOUI: "thumb/5/54/OOjs_UI_icon_noWikiText-ltr.svg/24px-OOjs_UI_icon_noWikiText-ltr.svg.png",
    tooltip: "Balises nowiki",
    buttonId: "nowiki-tag",
    toolbarIgnore: true,
  },
  {
    tagOpen: "<noinclude>",
    tagClose: "</noinclude>",
    imageFileName: "5/5c/Noinclude_button.png",
    imageFileNameOOUI: "thumb/8/8c/OOjs_UI_icon_markup.svg/24px-OOjs_UI_icon_markup.svg.png",
    tooltip: "Balises noinclude",
    buttonId: "noinclude-tag",
    group: "html_tags",
  },
  {
    tagOpen: "<includeonly>",
    tagClose: "</includeonly>",
    imageFileName: "9/9f/Button_nowiki_symbol.png",
    imageFileNameOOUI: "thumb/8/8c/OOjs_UI_icon_markup.svg/24px-OOjs_UI_icon_markup.svg.png",
    tooltip: "Balises includeonly",
    buttonId: "includeonly-tag",
    group: "html_tags",
  },
  {
    tagOpen: "<onlyinclude>",
    tagClose: "</onlyinclude>",
    imageFileName: "9/9f/Button_nowiki_symbol.png",
    imageFileNameOOUI: "thumb/8/8c/OOjs_UI_icon_markup.svg/24px-OOjs_UI_icon_markup.svg.png",
    tooltip: "Balises onlyinclude",
    buttonId: "onlyinclude-tag",
    group: "html_tags",
  },
  {
    tagOpen: "<small>",
    tagClose: "</small>",
    imageFileName: "9/9f/Button_nowiki_symbol.png",
    imageFileNameOOUI: "thumb/d/dc/OOjs_UI_icon_smaller-ltr.svg/24px-OOjs_UI_icon_smaller-ltr.svg.png",
    tooltip: "Balise small",
    buttonId: "small-tag",
    toolbarIgnore: true,
  },
  {
    tagOpen: "<br/>",
    tagClose: "",
    imageFileName: "f/f2/Button-br.png",
    imageFileNameOOUI: "thumb/3/3c/OOjs_UI_icon_newline-ltr.svg/24px-OOjs_UI_icon_newline-ltr.svg.png",
    tooltip: "Balise br",
    buttonId: "br-tag",
    toolbarIgnore: true,
  },
];
