// [[Catégorie:JavaScript du Wiktionnaire|audio-player.js]]
/**
 * @typedef {{
 *  $element: JQuery,
 *  region: string?,
 *  ipa: string?,
 *  word: string?,
 *  file: string?,
 *  level: string?
 * }} AudioTag
 */

(() => {
  /**
   * Build an audio player below the given tag.
   *
   * @param $title {JQuery} Tag to build player below of.
   * @param audioTags {AudioTag[]} List of audio tags to put in the player.
   * @param id {number} Player’s unique ID.
   */
  function buildAudioPlayer($title, audioTags, id) {
    const audioCount = audioTags.length;
    const playerID = "audio-player-" + id;
    const $player = $("<div>");
    $player.attr("id", playerID);

    const $list = $("<ul>");
    /** @type {JQuery[]} */
    const items$ = [];
    audioTags.forEach(function (item) {
      const $item = $("<li>");
      $item.data("region", item.region);
      $item.append(item.$element)
      items$.push($item);
      $list.append($item);
      $item.hide();
    })

    const searchField = new OO.ui.TextInputWidget({
      placeholder: "Filtrer selon la région…",
    });
    searchField.on("change", (text) => {
      text = text.toLowerCase();
      items$.forEach(($item) => {
        const region = ($item.data("region") || "").toLowerCase();
        if (text && (text === "*" || region.includes(text))) $item.show();
        else $item.hide();
      })
    });
    const fieldsLayout = new OO.ui.FieldsetLayout({
      label: "Fichiers disponibles\u00a0: {0}".format(audioCount),
      items: [
        searchField,
      ],
    });
    const frame = new OO.ui.PanelLayout({
      id: "audio-player-{0}".format(id),
      classes: ["audio-player"],
      expanded: false,
      content: [
        fieldsLayout,
      ],
    });

    $player.append(frame.$element, $list);
    $player.insertAfter($title);
  }

  /**
   * @param $element {JQuery}
   * @param selector {string}
   * @param dataKey {string}
   * @return {string|null}
   */
  function extractData($element, selector, dataKey) {
    const e = $element.find(selector);
    return e.length ? $(e).data(dataKey).trim() || null : null;
  }

  let i = 1;
  $("div.mw-parser-output h3").each((_, element) => {
    const $title = $(element);
    if ($title.text().includes("Prononciation")) {
      /** @type {AudioTag[]} */
      const audioTags = [];
      let $element = $title.next();
      while ($element.length && !/H[1-6]/.test($element.prop("tagName"))) {
        $element.find(".audio-pronunciation").each(function (_, e) {
          const $e = $(e);
          const file = extractData($e, ".audio-file", "file");
          if (!file) return;
          audioTags.push({
            $element: $e,
            region: extractData($e, ".audio-region", "region"),
            ipa: extractData($e, ".audio-ipa", "ipa"),
            word: extractData($e, ".audio-word", "word"),
            file: file,
            level: extractData($e, ".audio-mastery-level", "level"),
          });
        });
        $element.hide();
        $element = $element.next();
      }
      buildAudioPlayer($title, audioTags, i++);
    }
  });
})();
