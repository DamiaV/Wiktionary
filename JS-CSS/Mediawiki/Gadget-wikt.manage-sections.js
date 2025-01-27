"use strict";

(() => {
  console.log("Chargement de Gadget-wikt.manage-sections.js…");

  /**
   * @param $sectionTitle {jQuery}
   * @return {number}
   */
  function getSectionLine($sectionTitle) {
    const title = $sectionTitle.find("span:first-child").text();
    // TODO
  }

  /**
   * @param $sectionTitle {jQuery}
   * @param up {boolean}
   */
  function moveSection($sectionTitle, up) {
    // TODO
  }

  /**
   * @param $sectionTitle {jQuery}
   * @param level {number}
   */
  function setSectionLevel($sectionTitle, level) {
    if (level < 2 || level > 6) throw new Error("level must be between 2 and 6");
    // TODO
  }
})();
