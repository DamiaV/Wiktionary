//[[Catégorie:JavaScript du Wiktionnaire|HideCategories.js]]
var NombreDeCategoriesMax = 10;

function count_categories(CategorySpanTags) {
  var count = 0;

  for (i = 0; i < CategorySpanTags.length; i = i + 1) {
    if (CategorySpanTags[i].dir == 'ltr') {
      count = count + 1;
    }
  }

  return count;
}

function debutCategoriesHTML() {
  var j = 0;
  var htmlcat = document.getElementById('mw-normal-catlinks').innerHTML;

  while (1) {
    if (htmlcat.substring(j, j + 8) == '&nbsp;: ') return htmlcat.substring(0, j + 8);
    else j = j + 1;
  }
}

function count_span_number_categories(CategorySpanTags) {
  var ltrcount = 0;
  var totalcount = 0;

  for (i = 0; i < CategorySpanTags.length; i = i + 1) {
    if (ltrcount > -1) {
      if (CategorySpanTags[i].dir == 'ltr') {
        ltrcount = ltrcount + 1;
      }
      totalcount = totalcount + 1;

      if (ltrcount == this.NombreDeCategoriesMax)
        return totalcount;
    }
  }
}

function DisplayNormalCatlinks() {
  document.getElementById('mw-normal-catlinks-message').style.display = "none";
  document.getElementById('mw-normal-catlinks-hidden').style.display = "inline";
}

function DisplayHiddenCatlinks() {
  // si on affiche les catégories cachées, on affiche toutes les catégories (mais slt si d'autres catégories ont été cachées, sinon plantage)
  if (document.getElementById('mw-normal-catlinks-message') != null)
    DisplayNormalCatlinks();

  document.getElementById('mw-hidden-catlinks-message').style.display = "none";
  document.getElementById('mw-hidden-catlinks').style.display = "inline";
}


function HideCategories() {
  var categories = document.getElementById('mw-normal-catlinks').getElementsByTagName('span');
  var count = count_categories(categories);
  var totalcount;
  var match;
  var begin;

  if (count > NombreDeCategoriesMax) {
    totalcount = count_span_number_categories(categories);
    match = debutCategoriesHTML();
    var cathtml = '<span id="mw-normal-catlinks-displayed">' + match;
    if (begin = match.match(/< *span/g))
      begin = begin.length;
    else begin = 0;

    for (i = begin; i < totalcount; i = i + 1) {
      if (i > begin) {
        cathtml = cathtml + ' • ';
      }

      if ((categories[i].dir = 'ltr') && (categories[i].className != 'noprint')) {
        cathtml = cathtml + '<span dir="ltr">' + categories[i].innerHTML + '</span>';
      }
      else {
        cathtml = cathtml + '<span>' + categories[i].innerHTML + '</span>';
      }

      // gestion d'une incompatibilité avec HotCats
      if (match = categories[i].innerHTML.match(/< *span/g)) {
        i = i + match.length;
      }
    }
    cathtml = cathtml + '</span><span id="mw-normal-catlinks-hidden" style="display:none">';

    for (i = totalcount; i < categories.length; i = i + 1) {
      if (categories[i].className != 'noprint') { // gestion d'une incompatibilité avec HotCats
        cathtml = cathtml + ' • ';
      }

      if (categories[i].dir = 'ltr') {
        cathtml = cathtml + '<span dir="ltr">' + categories[i].innerHTML + '</span>';
      }
      else {
        cathtml = cathtml + '<span>' + categories[i].innerHTML + '</span>';
      }

      // gestion d'une incompatibilité avec HotCats
      if (match = categories[i].innerHTML.match(/< *span/g)) {
        i = i + match.length;
      }
    }
    cathtml = cathtml + '</span><span id="mw-normal-catlinks-message" style=""> - <small><b><a href="javascript:DisplayNormalCatlinks();">Afficher toutes les catégories</a></b></small></span>';

    document.getElementById('mw-normal-catlinks').innerHTML = cathtml;
  }

  // Ajout en bas de chaque page un lien permettant d'afficher les catégories cachées
  if (document.getElementById('mw-hidden-catlinks') != null) {
    document.getElementById('mw-normal-catlinks').innerHTML = document.getElementById('mw-normal-catlinks').innerHTML + '<span id="mw-hidden-catlinks-message" style=""> - <small><b><a href="javascript:DisplayHiddenCatlinks();">Afficher les catégories cachées</a></b></small></span>';
  }
}

if (document.getElementById('mw-normal-catlinks') != null) {
  jQuery(document).ready(HideCategories);
}
