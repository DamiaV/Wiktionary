/**
 * (fr)
 * Ce gadget masque les traductions qui ne sont pas dans la liste définie
 * dans le filterTranslations.js de l’utilisateur. Voir [[Aide:Gadget-FilterTranslations]].
 * ----
 * (en)
 * This gadget filters out translations that are not listed in the user’s
 * filterTranslations.js. See [[Aide:Gadget-FilterTranslations]] (fr).
 * ----
 * [[Catégorie:JavaScript du Wiktionnaire|FilterTranslations.js]]
 */

$(function () {
  if (wikt.page.hasNamespaceIn([""])) {
    window.wikt.gadgets.filterTranslations = {
      NAME: "Filtrer traductions",

      VERSION: "2.0",

      _translations: [],

      _hidden: false,

      _$button: null,

      /**
       * Sets the whitelisted language codes then filters the translations.
       * @param whitelistedLangs {Array<string>} Language codes to whitelist.
       */
      init: function (whitelistedLangs) {
        var self = this;

        this._$button = $('<button style="position:fixed;bottom:0;left:0"></button>');
        this._$button.click(function () {
          if (self._hidden) {
            self.show();
          } else {
            self.hide();
          }
        });
        $(document.body).append(this._$button);

        $(".translations > ul > li").each(function (_, e) {
          var $item = $(e);
          var match = /trad-([\w-]+)/.exec($item.find("span").prop("class"));

          if (match && !(whitelistedLangs || []).includes(match[1])) {
            self._translations.push($item);
          }
        });
        this.hide();
      },

      hide: function () {
        this._translations.forEach(function ($item) {
          $item.hide();
        });
        this._$button.text("Afficher toutes les traductions");
        this._hidden = true;
      },

      show: function () {
        this._translations.forEach(function ($item) {
          $item.show();
        });
        this._$button.text("Filtrer les traductions");
        this._hidden = false;
      },
    };

    console.log("Chargement de Gadget-FilterTranslations.js…");
    // Variable should be declared in user page.
    if (typeof ft_whitelist !== "undefined" && ft_whitelist instanceof Array) {
      console.log("Found {0} languages in whitelist.".format(ft_whitelist.length));
      wikt.gadgets.filterTranslations.init(ft_whitelist);
    }
  }
});
