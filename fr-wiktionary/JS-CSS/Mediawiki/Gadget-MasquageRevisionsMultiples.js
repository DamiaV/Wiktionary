// Gadget pour masquer plus facilement plusieurs versions d'un article depuis l'historique,
// en cochant manuellement uniquement la version d'origine du copyvio et la dernière en date
// avec le copyvio, puis en cochant, sur un clic, toutes les versions intermédiaires
// [[Catégorie:JavaScript du Wiktionnaire|MasquageRevisionsMultiples]]

$(function () {
  if (mw.config.get('wgAction') === 'history') {
    $('.mw-history-revisiondelete-button').before('<a class="cocher-versions-intermediaires">Cocher les versions intermédaires</a>');
    $('.cocher-versions-intermediaires')
        .css({'float': 'right', 'margin': '0 2px'})
        .click(function () {
          var nb = $('#pagehistory input:checkbox:checked').length;
          if (nb === 2) {
            var $checkboxes = $('#pagehistory input:checkbox');
            var active = false;
            $checkboxes.each(function () {
              if ($(this).is(':checked')) {
                active = !active;
              }
              else if (active) {
                $(this).prop('checked', true);
              }
            });
          }
          else {
            mw.notify('Deux cases exactement doivent être cochées afin que des cases intermédiaires puissent l\'être');
          }
        });
  }
});
