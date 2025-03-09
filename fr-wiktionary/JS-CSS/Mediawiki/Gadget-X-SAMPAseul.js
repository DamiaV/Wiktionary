/*[[Catégorie:JavaScript du Wiktionnaire|X-SAMPAseul.js]]*/
// Convertit les prononciations API en X-SAMPA
$(function pronpage() {
  $('.API').each(function () {
    $(this).text(APIversXSAMPA($(this).text()))
        .attr('title', "Prononciation X-SAMPA")
        .addClass('X-SAMPA')
        .removeClass('API');
  });
});
