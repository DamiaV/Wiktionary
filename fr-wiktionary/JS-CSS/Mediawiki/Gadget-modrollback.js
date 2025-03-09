//[[Catégorie:JavaScript du Wiktionnaire|modrollback.js]]
//<source lang=javascript>
$j(document).ready(function () {
  $j('.mw-rollback-link a').each(function (i) {
    var href = $j(this).attr('href');
    var usr = decodeURIComponent(href.split('from=')[1].split('&')[0]);
    var cont = mw.config.get('wgArticlePath').replace("$1", 'Special:Contributions/') + usr;
    $j(this).attr('href', '');
    $j(this).click(function () {

      $.get(href, function () {
        window.location.href = (cont);
      });
      return false;
    });
  });
});
//</source>
