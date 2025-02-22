"use strict";

(() => {
  console.log("Chargement de Gadget-wikt.manage-sections.js…");

  /**
   * @param $sectionTitle
   * @return {number}
   */
  function getSectionIndexInHtml($sectionTitle) {
    let count = 0;
    for (const node of $(".mw-parser-output").children()) {
      if ($(node).classList.contains("mw-heading")) count++;
      if (node === $sectionTitle[0]) return count;
    }
    return -1;
  }

  /**
   * @param wikicode {string}
   * @param htmlIndex {number}
   * @return {number}
   */
  function getSectionIndexInWikicode(wikicode, htmlIndex) {
    let i = 0;
    for (const line of wikicode.split("\n")) {
      if (htmlIndex === 0) return i;
      if (/(={2,6}) *[^=]+ *\1/.test(line)) htmlIndex--;
      i++;
    }
    return htmlIndex === 0 ? i : -1;
  }

  /**
   * @param $sectionTitle
   * @param up {boolean}
   */
  function moveSection($sectionTitle, up) {
    $.get(
        location.href,
        {action: "raw"},
        callback
    )

    /**
     * @param wikicode {string}
     */
    function callback(wikicode) {
      const htmlI = getSectionIndexInHtml($sectionTitle);
      const wikicodeI = getSectionIndexInWikicode(wikicode, htmlI);
      // TODO
    }
  }

  /**
   * @param $sectionTitle
   * @param level {number}
   */
  function setSectionLevel($sectionTitle, level) {
    if (level < 2 || level > 6) throw new Error("level must be between 2 and 6");
    $.get(
        location.href,
        {action: "raw"},
        callback
    )

    /**
     * @param wikicode {string}
     */
    function callback(wikicode) {
      const htmlI = getSectionIndexInHtml($sectionTitle);
      const wikicodeI = getSectionIndexInWikicode(wikicode, htmlI);
      const tagName = $sectionTitle.children()[0].tagName;
      const currentLevel = tagName.charAt(tagName.length - 1);

      $sectionTitle.classList.remove("mw-heading" + currentLevel);
      $sectionTitle.classList.add("mw-heading" + level);
      // TODO replace current H* tag with new one
      // TODO update wikicode
    }
  }
})();
