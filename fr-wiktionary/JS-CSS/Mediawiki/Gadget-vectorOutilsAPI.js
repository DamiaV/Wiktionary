//[[Catégorie:JavaScript du Wiktionnaire|vectorOutilsAPI.js]]
// Ce gadget ajoute la liste des caractères API utilisés en français standard
// à la barre d'outils de vector

// Liste des caractères
var api_liste_fr = ["a", "ɑ", "ɑ̃", "o", "ɔ", "ɔ̃", "e", "ɛ", "ɛ̃", "ø", "œ", "œ̃", "ə", "u", "y",
  "j", "w", "ɥ",
  "b", "k", "ʃ", "d", "f", "ɡ", "ʒ", "l", "m", "n", "ɲ", "ŋ", "p", "ʁ", "s", "t", "v", "z",
  "‿"];

var caracteres_liste_fr = ["’", "à", "À", "â", "Â", "æ", "Æ", "€", "é", "É", "è", "È", "ê", "Ê", "î", "Î", "ï", "Ï", "œ", "Œ", "ô", "Ô", "ù", "Ù", "û", "Û", "ç", "Ç"];

// Ajout de la section Caractères du Wiktionnaire > API français
jQuery('load', function () {
  $j('#wpTextbox1').wikiEditor('addToToolbar', {
    'sections': {
      'caracteres': {
        label: 'Caractères du Wiktionnaire',
        type: 'booklet',
        deferLoad: true,
        pages: {
          'car_fr': {
            'label': 'Caractères spéciaux français',
            'layout': 'characters',
            'characters': caracteres_liste_fr
          },
          'API_fr': {
            'label': 'API français',
            'layout': 'characters',
            'characters': api_liste_fr
          }

        }
      }
    }
  });
});
