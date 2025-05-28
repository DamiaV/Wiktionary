/**
 * Cette fonction fournit un lien vers une section de page en cliquant
 * sur le lien [URL] ou [[lien]] à droite du titre de section.
 * [[Catégorie:JavaScript du Wiktionnaire|AncreTitres]]
 */
// <nowiki>
"use strict";

(() => {
  const options = {
    urlButtonLabel: "[URL]",
    internalLinkButtonLabel: "[[lien]]",
    urlButtonDescription: "Obtenir une URL vers cette section",
    internalLinkButtonDescription: "Obtenir un [[Lien#interne]]",
    linkColor: null,
    fontSize: "xx-small",
    fontWeight: "normal",
    showUrlButton: true,
    showInternalLinkButton: true,
  };

  if (window.titleLinks)
    Object.assign(options, window.titleLinks);

  if (!$("#content").length || !options.showInternalLinkButton && !options.showUrlButton)
    return;

  $('#bodyContent h2, #bodyContent h3, #bodyContent h4, #bodyContent h5, #bodyContent h6').each(function () {
    const $header = $(this);
    /** @type {string} */
    const anchor = $header.attr("id")

    const $span = $(`<span class="noprint ancretitres" style="user-select: none">`);
    if (options.fontSize)
      $span.css("font-size", options.fontSize);
    if (options.fontWeight)
      $span.css("font-weight", options.fontWeight);
    if (options.linkColor)
      $span.css("color", options.linkColor);

    if (options.showUrlButton) {
      $span.append(" ");
      $(`<a href="#" title="${options.urlButtonDescription}">${options.urlButtonLabel}</a>`).click(() => {
        window.prompt(
            "Lien :",
            `https:${mw.config.get("wgServer")}${mw.util.getUrl()}#${anchor}`
        );
        return false;
      }).appendTo($span);
    }

    if (options.showInternalLinkButton) {
      $span.append(" ");
      $(`<a href="#" title="${options.internalLinkButtonDescription}">${options.internalLinkButtonLabel}</a>`).click(() => {
        const escapedAnchor =
            anchor
                // Escape HTML tags
                .replaceAll("<", "&#lt;")
                .replaceAll(">", "&#gt;")
                // Escape MediaWiki special characters
                .replaceAll("[", "&#91;")
                .replaceAll("]", "&#93;")
                .replaceAll("{", "&#123;")
                .replaceAll("|", "&#124;")
                .replaceAll("}", "&#125;");
        window.prompt(
            "Lien :",
            `[[${mw.config.get("wgPageName").replaceAll("_", " ")}#${escapedAnchor}]]`
        );
        return false;
      }).appendTo($span);
    }

    $header.append($span);
  });
})();
// </nowiki>
