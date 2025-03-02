// <nowiki>
const createInflectionLangs = ["en", "eo"];

const bdl_buttons = [
  {
    action: (selectedText, language) => `[[${selectedText}#${language}|${selectedText}]]`,
    promptText: "Langue",
    promptDefault: "fr",
    imageFileName: "0/0c/Button_Link_DifferentName.png",
    imageFileNameOOUI: "thumb/7/72/OOjs_UI_icon_link-ltr.svg/24px-OOjs_UI_icon_link-ltr.svg.png",
    tooltip: "Lien",
    buttonId: "link",
    group: "links",
  },
  {
    action: (selectedText, language) => `{{lien|${selectedText}|${language}}}`,
    promptText: "Langue",
    promptDefault: "fr",
    imageFileName: "0/0c/Button_Link_DifferentName.png",
    imageFileNameOOUI: "thumb/7/72/OOjs_UI_icon_link-ltr.svg/24px-OOjs_UI_icon_link-ltr.svg.png",
    tooltip: "Lien (modèle)",
    buttonId: "link_template",
    group: "links",
  },
  {
    action: (selectedText, language) => `{{pron|${selectedText}|${language}}}`,
    promptText: "Langue",
    promptDefault: "fr",
    imageFileName: "1/13/Button_API_ʃ.png",
    imageFileNameOOUI: "thumb/0/0a/OOjs_UI_icon_feedback-ltr.svg/24px-OOjs_UI_icon_feedback-ltr.svg.png",
    tooltip: "Prononciation",
    buttonId: "pron",
    group: "insert",
  },
  {
    action: (selectedText, delimiter) => {
      let start, end;
      if ("[]".includes(delimiter)) {
        start = "[";
        end = "]";
      } else start = end = delimiter;
      return `{{pron-API|${start}${selectedText}${end}}}`;
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
    action: (selectedText, language) =>
        `<syntaxhighlight lang="${language}" inline>${selectedText}</syntaxhighlight>`,
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
    tagOpen: "<br>",
    tagClose: "",
    imageFileName: "f/f2/Button-br.png",
    imageFileNameOOUI: "thumb/3/3c/OOjs_UI_icon_newline-ltr.svg/24px-OOjs_UI_icon_newline-ltr.svg.png",
    tooltip: "Balise br",
    buttonId: "br-tag",
    toolbarIgnore: true,
  },
  {
    action: (selectedText, langCode) => `#* {{exemple|lang=${langCode}}}`,
    promptText: "Langue",
    promptDefault: "",
    imageFileName: "2/26/Button_latinas.png",
    imageFileNameOOUI: "thumb/c/c0/OOjs_UI_icon_quotes-ltr.svg/24px-OOjs_UI_icon_quotes-ltr.svg.png",
    tooltip: "Modèle exemple vide",
    buttonId: "exemple-template",
    group: "insert",
  },
  {
    action: (selectedText, langCode) => {
      const match = /^#+\*\s*''(.+)''\s*\{\{source\s*\|(.+)}}\s*$/gs.exec(selectedText);
      if (!match) return selectedText;
      return `#* {{exemple|lang=${langCode}
 | ${match[1]}
 | source=${match[2]}
}}`;
    },
    promptText: "Langue",
    promptDefault: "",
    imageFileName: "2/26/Button_latinas.png",
    imageFileNameOOUI: "thumb/1/1d/OOjs_UI_icon_quotes-rtl.svg/24px-OOjs_UI_icon_quotes-rtl.svg.png",
    tooltip: "Vers modèle exemple",
    buttonId: "to-exemple-template",
    group: "insert",
  },
  {
    tagOpen: "{{graphie|",
    tagClose: "}}",
    imageFileName: "",
    imageFileNameOOUI: "thumb/a/a5/OOjs_UI_icon_bold-g-invert.svg/24px-OOjs_UI_icon_bold-g-invert.svg.png",
    tooltip: "Modèle {{graphie}}",
    buttonId: "graphie-template",
    group: "insert",
  },
];
// </nowiki>
