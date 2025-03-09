"use strict";

console.log("Chargement de Gadget-wikt.remove-pronunciation-links.js…");

window.wikt.gadgets.removePronunciationLinks = {
  init: function () {
    $("a span[class='API']").each(function (_, e) {
      var $link = $(e).parent();
      if ($link.attr("href").includes("Annexe:Prononciation")) {
        $link.attr("href", null);
      }
    });
  },
};

wikt.gadgets.removePronunciationLinks.init();
