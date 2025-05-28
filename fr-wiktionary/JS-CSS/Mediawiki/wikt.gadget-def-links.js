// [[Catégorie:JavaScript du Wiktionnaire|gadget-def-links.js]]
"use strict";

(() => {
  if (mw.config.get("wgPageName") !== "MediaWiki:Gadgets-definition")
    return;

  console.log("Chargement de Gadget-wikt.gadget-def-links.js…");

  const gadgetDefRegex = /^(?<description>\S+)(?<spaces> *)(?<options>\[.+?])(?<sources>.+)$/;

  $("section[data-mw-section-id]").each((_, section) => {
    const $section = $(section);
    if ($section.data("mw-section-id") === "0") return;

    // Replace the title’s text by a link to the corresponding "MediaWiki:Gadget-section-*" page
    const $headerTextNode = $section.find("h2").contents().filter(function () {
      return this.nodeType === Node.TEXT_NODE;
    }).first();
    const headerText = $headerTextNode[0].textContent;
    const headerPageName = "MediaWiki:Gadget-section-" + headerText;
    $(`<a href="/wiki/${headerPageName}" title="${headerPageName}">${headerText}</a>`).insertAfter($headerTextNode);
    $headerTextNode.remove();

    // Insert links in each gadget definition item
    $section.find("ul > li").each((_, item) => {
      const $item = $(item);
      const match = gadgetDefRegex.exec($item.text());
      if (!match) return;

      const description = getLink(match.groups.description);
      const spaces = match.groups.spaces;
      const options = match.groups.options;
      const sources = parseSources(match.groups.sources);

      $item.html(`${description}${spaces}${options}${sources}`);
    });
  });

  /**
   * @param gadgetName {string}
   * @return {string}
   */
  function getLink(gadgetName) {
    const fullName = "MediaWiki:Gadget-" + gadgetName.replaceAll("_", " ");
    return `<a href="/wiki/${fullName}" title="${fullName}">${gadgetName}</a>`;
  }

  /**
   * @param values {string}
   * @return {string}
   */
  function parseSources(values) {
    let res = "";
    let buffer = "";
    let spacerBuffer = "";

    for (const c of values) {
      if (c === "|" || c === " ") {
        if (buffer) {
          res += getLink(buffer);
          buffer = "";
        }
        spacerBuffer += c;
      } else {
        if (spacerBuffer) {
          res += spacerBuffer;
          spacerBuffer = "";
        }
        buffer += c;
      }
    }
    if (buffer) res += getLink(buffer);

    return res;
  }
})();
