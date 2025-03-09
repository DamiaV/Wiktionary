/*
[[Catégorie:JavaScript du Wiktionnaire|APIversXSAMPA.js]]
=== Conversion API X-SAMPA ===
<pre> */

// conversion d'une prononciation API vers X-SAMPA
function APIversXSAMPA(pron) {

  /* </pre>
  ==== Minuscules ====
  <pre> */
  pron = pron.replace(/a/g, 'a');
  pron = pron.replace(/b/g, 'b');
  pron = pron.replace(/ɓ/g, 'b_<');
  pron = pron.replace(/c/g, 'c');
  pron = pron.replace(/d/g, 'd');
  pron = pron.replace(/ɖ/g, 'd`');
  pron = pron.replace(/ɗ/g, 'd_<');
  pron = pron.replace(/e/g, 'e');
  pron = pron.replace(/f/g, 'f');
  pron = pron.replace(/ɡ/g, 'g');
  pron = pron.replace(/ɠ/g, 'g_<');
  pron = pron.replace(/h/g, 'h');
  pron = pron.replace(/ɦ/g, 'h\\');
  pron = pron.replace(/i/g, 'i');
  pron = pron.replace(/j/g, 'j');
  pron = pron.replace(/ʝ/g, 'j\\');
  pron = pron.replace(/k/g, 'k');
  pron = pron.replace(/l/g, 'l');
  pron = pron.replace(/ɭ/g, 'l`');
  pron = pron.replace(/ɺ/g, 'l\\');
  pron = pron.replace(/m/g, 'm');
  pron = pron.replace(/n/g, 'n');
  pron = pron.replace(/ɳ/g, 'n`');
  pron = pron.replace(/o/g, 'o');
  pron = pron.replace(/p/g, 'p');
  pron = pron.replace(/ɸ/g, 'p\\');
  pron = pron.replace(/q/g, 'q');
  pron = pron.replace(/ʠ/g, 'q_<');
  pron = pron.replace(/r/g, 'r');
  pron = pron.replace(/ɽ/g, 'r`');
  pron = pron.replace(/ɹ/g, 'r\\');
  pron = pron.replace(/ɻ/g, 'r\\`');
  pron = pron.replace(/ɼ/g, 'r\\_r');
  pron = pron.replace(/s/g, 's');
  pron = pron.replace(/ʂ/g, 's`');
  pron = pron.replace(/ɕ/g, 's\\');
  pron = pron.replace(/t/g, 't');
  pron = pron.replace(/ʈ/g, 't`');
  pron = pron.replace(/u/g, 'u');
  pron = pron.replace(/v/g, 'v');
  pron = pron.replace(/ʋ/g, 'P');
  pron = pron.replace(/w/g, 'w');
  pron = pron.replace(/x/g, 'x');
  pron = pron.replace(/ɧ/g, 'x\\');
  pron = pron.replace(/y/g, 'y');
  pron = pron.replace(/z/g, 'z');
  pron = pron.replace(/ʐ/g, 'z`');
  pron = pron.replace(/ʅ/g, 'z`=');
  pron = pron.replace(/ʑ/g, 'z\\');
  pron = pron.replace(/ɿ/g, 'z=');

  /* </pre>
  ==== Majuscules ====
  <pre> */
  pron = pron.replace(/ɑ/g, 'A');
  pron = pron.replace(/β/g, 'B');
  pron = pron.replace(/ʙ/g, 'B\\');
  pron = pron.replace(/ç/g, 'C');
  pron = pron.replace(/ð/g, 'D');
  pron = pron.replace(/ɛ/g, 'E');
  pron = pron.replace(/ɱ/g, 'F');
  pron = pron.replace(/ɣ/g, 'G');
  pron = pron.replace(/ɢ/g, 'G\\');
  pron = pron.replace(/ʛ/g, 'G\\_<');
  pron = pron.replace(/ɥ/g, 'H');
  pron = pron.replace(/ʜ/g, 'H\\');
  pron = pron.replace(/ɪ/g, 'I');
  pron = pron.replace(/Ɨ/g, 'I\\');
  pron = pron.replace(/ɲ/g, 'J');
  pron = pron.replace(/ɟ/g, 'J\\');
  pron = pron.replace(/ʄ/g, 'J\\_<');
  pron = pron.replace(/ɬ/g, 'K');
  pron = pron.replace(/ɮ/g, 'K\\');
  pron = pron.replace(/ʎ/g, 'L');
  pron = pron.replace(/ʟ/g, 'L\\');
  pron = pron.replace(/ɯ/g, 'M');
  pron = pron.replace(/ɰ/g, 'M\\');
  pron = pron.replace(/ŋ/g, 'N');
  pron = pron.replace(/ɴ/g, 'N\\');
  pron = pron.replace(/ɔ/g, 'O');
  pron = pron.replace(/ʘ/g, 'O\\');
  pron = pron.replace(/ɒ/g, 'Q');
  pron = pron.replace(/ʁ/g, 'R');
  pron = pron.replace(/ʀ/g, 'R\\');
  pron = pron.replace(/ʃ/g, 'S');
  pron = pron.replace(/ʆ/g, 'S_j');
  pron = pron.replace(/θ/g, 'T');
  pron = pron.replace(/ʊ/g, 'U');
// double :
  pron = pron.replace(/ɷ/g, 'U');
  pron = pron.replace(/ʊ̵/g, 'U\\');
  pron = pron.replace(/ʌ/g, 'V');
  pron = pron.replace(/ʍ/g, 'W');
  pron = pron.replace(/χ/g, 'X');
  pron = pron.replace(/ħ/g, 'X\\');
  pron = pron.replace(/ʏ/g, 'Y');
  pron = pron.replace(/ʒ/g, 'Z');
  pron = pron.replace(/ʓ/g, 'Z_j');


  /* </pre>
  ==== Autres caractères ====
  <pre> */
//  pron = pron.replace(/./g, '.');
  pron = pron.replace(/ˈ/g, '"');
  pron = pron.replace(/ˌ/g, '%');
  pron = pron.replace(/ʲ/g, '_j');
// double :
  pron = pron.replace(/ ̡/g, '_j');
  pron = pron.replace(/ː/g, ':');
  pron = pron.replace(/ˑ/g, ':\\');
  pron = pron.replace(/&nbsp;/g, '-'); // double
  pron = pron.replace(/ /g, '-');
  pron = pron.replace(/ə/g, '@');
  pron = pron.replace(/ɘ/g, '@\\');
  pron = pron.replace(/ɚ/g, '@`');
  pron = pron.replace(/æ/g, '{');
  pron = pron.replace(/ʉ/g, '}');
  pron = pron.replace(/ɨ/g, '1');
  pron = pron.replace(/ø/g, '2');
  pron = pron.replace(/ɜ/g, '3');
  pron = pron.replace(/ɝ/g, '3`');
  pron = pron.replace(/ɞ/g, '3\\');
  pron = pron.replace(/ɾ/g, '4');
  pron = pron.replace(/ɫ/g, '5');
  pron = pron.replace(/ɐ/g, '6');
  pron = pron.replace(/ɤ/g, '7');
  pron = pron.replace(/ɵ/g, '8');
  pron = pron.replace(/œ/g, '9');
  pron = pron.replace(/ɶ/g, '&');
// double :
  pron = pron.replace(/ʚ/g, '&\\');
  pron = pron.replace(/ʔ/g, '?');
  pron = pron.replace(/ʕ/g, '?\\');
  pron = pron.replace(/ /g, '*');
  pron = pron.replace(/ /g, '/');
  pron = pron.replace(/ /g, '<');
  pron = pron.replace(/ʢ/g, '<\\');
  pron = pron.replace(/ /g, '>');
  pron = pron.replace(/ʡ/g, '>\\');
  pron = pron.replace(/↑/g, '^');
  pron = pron.replace(/ǃ/g, '!\\');
  pron = pron.replace(/ʗ/g, '!\\');
// Attention, à placer avant le X-pron " ! " :
  pron = pron.replace(/↓/g, '!');
  pron = pron.replace(/ /g, '|');
  pron = pron.replace(/ǀ/g, '|\\');
  pron = pron.replace(/ /g, '||');
  pron = pron.replace(/ǁ/g, '|\\|\\');
// double :
  pron = pron.replace(/ʖ/g, '|\\|\\');
  pron = pron.replace(/ǂ/g, '=\\');
  pron = pron.replace(/‿/g, '-\\');
  pron = pron.replace(/ʇ/g, '|\\');

  /* </pre>

  ==== Diacritiques ====
  <pre> */
  pron = pron.replace(/̈/g, '_"');
  pron = pron.replace(/̟/g, '_+');
// double :
  pron = pron.replace(/˖/g, '_+');
  pron = pron.replace(/̠/g, '_-');
// double :
  pron = pron.replace(/˗/g, '_-');
  pron = pron.replace(/ˇ/g, '_/');
  pron = pron.replace(/̥/g, '_0');
// double :
  pron = pron.replace(/˒/g, '_0');
// triple :
  pron = pron.replace(/̊/g, '_0');
  pron = pron.replace(/̩/g, '=');
// double :
  pron = pron.replace(/̍/g, '=');
  pron = pron.replace(/ʼ/g, '_>');
// double :
  pron = pron.replace(/ˀ/g, '_>');
  pron = pron.replace(/ˤ/g, '_?\\');
  pron = pron.replace(/ˆ/g, '_\\');
  pron = pron.replace(/̯/g, '_^');
  pron = pron.replace(/̚/g, '_}');
  pron = pron.replace(/˞/g, '`');
// double ? :
  pron = pron.replace(/̢/g, '`');
  pron = pron.replace(/̃/g, '~');
// double :
  pron = pron.replace(/̨/g, '~');
  pron = pron.replace(/̘/g, '_A');
  pron = pron.replace(/̺/g, '_a');
  pron = pron.replace(/̏/g, '_B');
  pron = pron.replace(/ˏ/g, '_B_L');
  pron = pron.replace(/̜/g, '_c');
// double :
  pron = pron.replace(/˓/g, '_c');
  pron = pron.replace(/̪/g, '_d');
  pron = pron.replace(/̴/g, '_e');
  pron = pron.replace(/↘/g, '<F>');
  pron = pron.replace(/̂/g, '_F');
  pron = pron.replace(/ˠ/g, '_G');
  pron = pron.replace(/́/g, '_H');
  pron = pron.replace(/˥/g, '_T');
  pron = pron.replace(/ʰ/g, '_h');
  pron = pron.replace(/̴/g, '_e');
  pron = pron.replace(/̰/g, '_k');
  pron = pron.replace(/̀/g, '_L');
  pron = pron.replace(/ˎ/g, '_L_B');
  pron = pron.replace(/ˡ/g, '_l');
  pron = pron.replace(/̄/g, '_M');
  pron = pron.replace(/̻/g, '_m');
  pron = pron.replace(/̼/g, '_N');
  pron = pron.replace(/ⁿ/g, '_n');
  pron = pron.replace(/̹/g, '_O');
  pron = pron.replace(/̞/g, '_o');
// double :
  pron = pron.replace(/˕/g, '_o');
  pron = pron.replace(/̙/g, '_q');
  pron = pron.replace(/↗/g, '_R');
  pron = pron.replace(/̌/g, '_R');
//  pron = pron.replace(/??????/g, '_R_F'); Ton ascendant puis descendant ?
  pron = pron.replace(/̝/g, '_r');
// double :
  pron = pron.replace(/˔/g, '_r');
  pron = pron.replace(/̋/g, '_T');
// double ? :
  pron = pron.replace(/ˉ/g, '_T');
  pron = pron.replace(/̤/g, '_t');
// double :
  pron = pron.replace(/ʱ/g, '_t');
  pron = pron.replace(/̬/g, '_v');
  pron = pron.replace(/ʷ/g, '_w');
// double :
  pron = pron.replace(/̫/g, '_w');
  pron = pron.replace(/̆/g, '_X');
  pron = pron.replace(/̽/g, '_x');

  /* </pre>
  ==== Divers ====
  <pre> */
// API ?
  pron = pron.replace(/ʤ/g, 'dZ');
  pron = pron.replace(/ʣ/g, 'dz');
  pron = pron.replace(/ʥ/g, 'dz\\');
  pron = pron.replace(/ʧ/g, 'tS');
  pron = pron.replace(/ʨ/g, 'ts\\');
  pron = pron.replace(/ʦ/g, 'ts');
  pron = pron.replace(/﻿͡/g, ')');
// ʞ ?
// Extras ?
  pron = pron.replace(/˩﻿/g, '_B');
  pron = pron.replace(/˦﻿/g, '_H');
  pron = pron.replace(/˨﻿/g, '_L');
  pron = pron.replace(/˧/g, '_M');
  pron = pron.replace(/˩﻿/g, '_B');
// Micros
  pron = pron.replace(/ʳ/g, '_r');
  pron = pron.replace(/ʶ/g, '_R');
  pron = pron.replace(/ʴ/g, '_r\\');
  pron = pron.replace(/ʵ/g, '_r\\`');
  pron = pron.replace(/ˢ/g, '_s');
  pron = pron.replace(/ˣ/g, '_x');
  pron = pron.replace(/ʸ/g, '_y');
  return pron;
}
