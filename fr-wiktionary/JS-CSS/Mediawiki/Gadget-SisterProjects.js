//[[Catégorie:JavaScript du Wiktionnaire|SisterProjects]]
// Liens les pages spéciales/systèmes équivalentes vers d'autres wiki, placé sous la barre d'outils à gauche, seulement chargé dans les espaces Spécial (-1) et Mediawiki (8)

if (
    mw.config.get('wgCanonicalNamespace') === 'Special' ||
    mw.config.get('wgCanonicalNamespace') === 'MediaWiki'
) {
  $(function () {
    var projects, isVector, path, $ul, $div;

    projects = [
      ['fr.wikipedia', 'Wikipédia'],
      ['fr.wikibooks', 'Wikilivres'],
      ['fr.wikiquote', 'Wikiquote'],
      ['fr.wikinews', 'Wikinews'],
      ['fr.wikisource', 'Wikisource'],
      ['fr.wikiversity', 'Wikiversité'],
      ['fr.wikivoyage', 'Wikivoyage'],
      ['species.wikipedia', 'Wikispecies'],
      ['commons.wikimedia', 'Commons'],
      ['meta.wikimedia', 'Meta-Wiki'],
      ['www.wikidata', 'Wikidata']
    ];

    isVector = (mw.config.get('skin') === 'vector');

    path = mw.util.getUrl(mw.config.get('wgNamespaceNumber') < 0
        ? mw.format(
            '$1:$2',
            mw.config.get('wgCanonicalNamespace'),
            mw.config.get('wgCanonicalSpecialPageName')
        )
        : mw.config.get('wgPageName')
    );

    $ul = $('<ul>');

    $div = $('<div>')
        .attr({
          'id': 'p-intpr',
          'role': 'navigation',
          'aria-labelledby': isVector ? 'p-intpr-label' : null
        })
        .addClass(isVector ? 'portal' : 'portlet')
        .append(
            $('<h3>')
                .attr('id', isVector ? 'p-intpr-label' : null)
                .text('Autres projets'),
            $('<div>')
                .addClass(isVector ? 'body' : 'pBody')
                .append($ul)
        );

    $.each(projects, function () {
      $('<a>')
          .attr('href', mw.format('//$1.org$2', this[0], path))
          .text(this[1])
          .appendTo($('<li>').appendTo($ul));
    });

    $('#p-tb').after($div);
  });
}
