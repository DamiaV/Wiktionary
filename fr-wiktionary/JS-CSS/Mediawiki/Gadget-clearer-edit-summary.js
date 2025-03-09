/**
 * Cet outil remplace les modèles dans les résumés d'édition par un nom lisible,
 * en listant le fil d’Ariane de la section modifiée.
 */
$(function () {
  console.log("Chargement de Gadget-clearer-edit-summary.js…");
  // Add `&summary=/* <summary> */` to each “Edit” link.
  $(".mw-editsection").each(function () {
    const $this = $(this);
    let $title = $this.prev(); // H* tag that precedes the current element
    if (!$title.length) return;
    // When "Show me both editor tabs" enabled, there will be two links: visual and wikitext.
    $this.find("a").attr("href", (_, href) =>
        href + "&summary=/*%20" + $title.attr("id").replaceAll("_", " ") + "%20*/%20");
  });
});
