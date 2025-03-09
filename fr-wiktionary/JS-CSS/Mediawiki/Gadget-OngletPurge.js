/**
 * [[Catégorie:JavaScript du Wiktionnaire|OngletPurge]]
 * OngletPurge
 *
 * Onglet permettant de réaliser une purge du cache
 *
 * @source https://www.mediawiki.org/wiki/Snippets/Purge_action
 * @see https://www.mediawiki.org/wiki/API:Purge
 */

if (mw.config.get('wgNamespaceNumber') >= 0) {

  mw.loader.using(['mediawiki.util', 'mediawiki.api', 'mediawiki.notify'], function () {
    $(function ($) {

      if ($('#ca-purge').length) return;
      var node = mw.util.addPortletLink(
          'p-cactions',
          mw.util.getUrl(null, {action: 'purge'}),
          ['monobook', 'modern'].indexOf(mw.config.get('skin')) > -1 ? 'purger' : 'Purger',
          'ca-purge',
          'Purger le cache de la page',
          '*'
      );
      $(node).click(function (e) {
        new mw.Api()
            .post({
              action: 'purge',
              titles: mw.config.get('wgPageName'),
              forcelinkupdate: 1
            })
            .done(function () {
              location.reload();
            })
            .fail(function () {
              mw.notify('Échec de la purge', {type: 'error'});
            });
        e.preventDefault();
      });

    });
  });
}
