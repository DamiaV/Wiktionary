$(function () {
  mw.loader.using(["mediawiki.widgets"]).then(function () {
    /**
     * Build an audio player below the given tag.
     *
     * @param $title {jQuery} Tag to build player below of.
     * @param audioTags$ {{$element: jQuery, region: string?, ipa: string?, word: string?, file: string?, level: string?}[]}
     *  List of audio tags to put in the player.
     * @param id {number} Player’s unique ID.
     */
    function buildAudioPlayer($title, audioTags$, id) {
      var audioCount = audioTags$.length;
      var playerID = "audio-player-" + id;
      var $player = $("<div>");
      $player.attr("id", playerID);

      var $list = $("<ul>");
      /** @type {jQuery[]} */
      var items$ = [];
      audioTags$.forEach(function (item) {
        var $item = $("<li>");
        $item.data("region", item.region);
        $item.append(item.$element)
        items$.push($item);
        $list.append($item);
        $item.hide();
      })

      var searchField = new OO.ui.TextInputWidget({
        placeholder: "Filtrer selon la région…",
      });
      searchField.on("change", function (text) {
        text = text.toLowerCase();
        items$.forEach(function ($item) {
          var region = ($item.data("region") || "").toLowerCase();
          if (text && (text === "*" || region.includes(text))) {
            $item.show();
          } else {
            $item.hide();
          }
        })
      });
      var fieldsLayout = new OO.ui.FieldsetLayout({
        label: "Fichiers disponibles\u00a0: {0}".format(audioCount),
        items: [
          searchField,
        ],
      });
      var frame = new OO.ui.PanelLayout({
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
     * @param $element {jQuery}
     * @param selector {string}
     * @param dataKey {string}
     * @return string|null
     */
    function extractData($element, selector, dataKey) {
      var e = $element.find(selector);
      if (e.length) {
        return $(e).data(dataKey).trim() || null;
      }
      return null;
    }

    var i = 1;
    $("div.mw-parser-output h3").each(function (_, element) {
      var $title = $(element);
      if ($title.text().includes("Prononciation")) {
        var audioTags$ = [];
        var $element = $title.next();
        while ($element.length && !/H[1-6]/.test($element.prop("tagName"))) {
          $element.find(".audio-pronunciation").each(function (_, e) {
            var $e = $(e);
            var file = extractData($e, ".audio-file", "file");
            if (!file) {
              return;
            }
            audioTags$.push({
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
        buildAudioPlayer($title, audioTags$, i++);
      }
    });
  });
});
