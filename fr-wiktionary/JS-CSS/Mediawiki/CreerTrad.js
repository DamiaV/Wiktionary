/*******************************************************************************************
 * (en)
 * Lets the users create the page for a translation just by clicking its (red) link in the
 * French entry.
 *******************************************************************************************
 * (fr)
 * Permet aux utilisateurs de créer la page d’une traduction en cliquant juste sur son lien
 * (rouge) dans l’entrée en français.
 *******************************************************************************************
 * v1.0 2013-06-13
 * v2.0 2020-11-01 Full rewrite.
 * v2.1 2021-05-08 Smarter wikicode analysis;
 *                 page reloads instead of having its content replaced.
 * v2.2 2021-05-18 Now requires gadget wikt.preload-edit-text.
 * v2.3 2025-05-27 Conversion into a module.
 *******************************************************************************************
 * [[Catégorie:JavaScript du Wiktionnaire|CreerTrad.js]]
 *******************************************************************************************/
// <nowiki>
"use strict";

const { romanNumeralToInt } = require("./wikt.core.text.js");

console.log("Chargement de Gadget-CreerTrad.js…");

const NAME = "Créer traduction";

const VERSION = "2.3";

/**
 * A function that generates the word line for the given translation.
 * The “word line” is the line containing the word in bold font, its pronunciation(s), and its grammatical templates.
 *
 * Its parameters are:
 * * Translation word
 * * Word’s grammatical nature
 * * Word’s gender
 * * Word’s transcription in latin script
 * * The value of the `dif` parameter from the {{trad*}} template that was clicked.
 * @typedef {function(string, string, string, string, string): void} WordLineGenerator
 */

/**
 * Extracts relevent data to generate translation’s wikicode from the given wikicode.
 * @param currentWikicode {string} Current article’s wikicode.
 * @param currentPageTitle {string} The current page’s title.
 * @param translation {string} The translation to create.
 * @param translationText {string} The translation’s link text.
 * @param langCode {string} The translation’s language code.
 * @param wordLineGenerator {WordLineGenerator?} A function that generates the translation’s word line.
 */
function generateWikicode(
    currentWikicode,
    currentPageTitle,
    translation,
    translationText,
    langCode,
    wordLineGenerator
) {
  const wikicodeLines = currentWikicode.split("\n");

  let translationLineIndex = 0;
  let translationLine = "";

  // Fetch line where the translation is.
  for (let i = 0; i < wikicodeLines.length && !translationLine; i++) {
    const line = wikicodeLines[i];
    let translationMatch = new RegExp(
        "{{trad[+-]?\\|" + langCode + "\\|(?:[^}]*?tradi=)?" + translationText
    ).exec(line);
    if (translationMatch) {
      translationLineIndex = i;
      translationLine = line;
    } else {
      translationMatch = new RegExp(
          "{{trad[+-]?\\|" + langCode + "\\|" + translation
      ).exec(line);
      if (translationMatch) {
        translationLineIndex = i;
        translationLine = line;
      }
    }
  }

  if (!translationLine) {
    console.log(`${NAME} could not find trad template for ${translation}`);
    return;
  }

  const tradTemplateArgs = $.grep(translationLine.match(/{{trad[+-]?\|[^}]+?}}/g), function (m) {
    return m.includes(translation);
  })[0];
  const templateArgsArray = $.map(
      tradTemplateArgs.substring(2, tradTemplateArgs.length - 2).split("|"),
      s => s.trim()
  );

  let transcription = "";
  let dif = "";
  let gender = "";

  for (const arg of templateArgsArray) {
    let match;
    // Get transcription if there is one.
    if (match = /^(?:tr|R)\s*=\s*(.+)$/.exec(arg))
      transcription = match[1];
        // Get dif parameter if it is defined.
    // Example : * {{T|he}} : {{trad+|he|מכלב|R=makhlev|dif=מַכְלֵב}}
    else if (match = /^dif\s*=\s*(.+)$/.exec(arg))
      dif = match[1];
    // Get gender if there is one.
    else if (/^(m|f|n|c|s|p|d|mf|mp|fp|mfp|np|ma|mi|fa|fi|na|ni)$/.test(arg))
      gender = arg;
  }

  let sectionLineIndex = 0;
  let nature = "";
  let definitionNumber = [1];
  let definitionNumberFound = false;
  const definitionsLines = [];

  /*
   * We go through each line upwards from the translation until we encounter a level-2 (===) section.
   * This section is the nature of the word.
   * We also gather all encountered definitions and the definition number the translation refers to.
   */
  for (let i = translationLineIndex; i >= 0 && !nature; i--) {
    const line = wikicodeLines[i];

    // Fetch enclosing trad-début template to get definition number
    let tradStartTemplateMatch;
    if (!definitionNumberFound && (tradStartTemplateMatch = /{{trad-début\|[^|]*\|([^|}]+)/.exec(line))) {
      definitionNumber = $.map(
          tradStartTemplateMatch[1].toLowerCase().split("."),
          (s, i) => {
            s = s.trim();
            const n = parseInt(s);
            if (isNaN(n))
              switch (i) {
                case 0:
                  return NaN;
                case 1:
                  return /^[a-z]$/.test(s) ? s.charCodeAt(0) - "a".charCodeAt(0) + 1 : NaN;
                default:
                  return romanNumeralToInt(s);
              }
            return n;
          }
      );
      definitionNumberFound = true;
    }

    // Fetch word type
    let natureMatch;
    if (natureMatch = /^===\s*{{S\|([^|}]+)/.exec(line)) {
      nature = natureMatch[1];
      sectionLineIndex = i;
    }
  }

  // Fetch all definitions starting from the line after
  // the word type section line until the next encountered section
  for (let i = sectionLineIndex + 1; i < translationLineIndex && !/^(=+).+\1$/.test(wikicodeLines[i]); i++) {
    const line = wikicodeLines[i];
    let match;
    if ((match = /^(#+)/.exec(line)) && !/^#+\*/.test(line))
      definitionsLines.push([match[1].length, i]);
  }

  // Recursively fetches the line for definitionNumber
  function getDefinitionLine(level, startIndex) {
    let levelCounter = 0;

    for (let i = startIndex; i < definitionsLines.length; i++) {
      const item = definitionsLines[i];
      if (item[0] === level + 1) {
        levelCounter++;
        if (levelCounter === definitionNumber[level]) {
          if (level === definitionNumber.length - 1)
              // We reached the end of definitionNumber array, return line number
            return item[1];
          // Recursively handle the rest of the definitionNumber array
          return getDefinitionLine(level + 1, i + 1);
        }
      }
    }
    return NaN;
  }

  const definitionLineIndex = getDefinitionLine(0, 0) || definitionsLines[0][1];
  let domains = "";

  // We look for a template of the form {{lexique|boulangerie|fr}}.
  let domainMatch;
  if (domainMatch = /{{lexique\|([^}]+?)\|[^|}]+?}}/.exec(wikicodeLines[definitionLineIndex]))
    domains = domainMatch[1];

  // Wikicode generation.

  let newWikicode = `== {{langue|${langCode}}} ==\n`;
  newWikicode += "=== {{S|étymologie}} ===\n";
  newWikicode += `: {{ébauche-étym|${langCode}}}\n\n`;
  newWikicode += `=== {{S|${nature}|${langCode}}} ===\n`;

  if (wordLineGenerator)
    newWikicode += wordLineGenerator(
        translation,
        nature,
        gender,
        transcription,
        dif
    ).trim();
  else
    newWikicode += genericWordLineGenerator(
        langCode,
        translation,
        nature,
        gender,
        transcription,
        dif
    ).trim();

  newWikicode += "\n# ";
  if (domains) newWikicode += `{{lexique|${domains}|${langCode}}} `;
  const uppercasedWord = currentPageTitle.charAt(0).toUpperCase() + currentPageTitle.substring(1);
  newWikicode += `[[${currentPageTitle}#fr|${uppercasedWord}]].\n`;

  newWikicode += `#* {{exemple|lang=${langCode}}}\n\n`;

  // Go to the translation’s page
  location.href = "/wiki/" + encodeURIComponent(translation)
      + "?action=edit"
      + "&preload-edit-text=" + encodeURIComponent(newWikicode)
      + "&preload-edit-summary=" + encodeURIComponent(`Création d’une entrée en ${langCode} avec [[Aide:Gadget-CreerTrad|${NAME} v${VERSION}]].`);
}

/**
 * Appends the appropriate gender templates to the wikicode, and return the wikicode.
 *
 * @param wikicode {string} Current article’s wikicode.
 * @param nature {string} Part of speech in French ('nom', 'adjectif', etc.).
 * @param gender {string} Gender parameter extracted from {{trad}}.
 */
function addGender(wikicode, nature, gender) {
  const genderWikicode = {
    m: "{{m}}",
    f: "{{f}}",
    n: "{{n}}",
    c: "{{c}}",
    s: "{{s}}",
    p: "{{p}}",
    d: "{{d}}",
    mf: "{{mf}}",
    mp: "{{m}} {{p}}",
    fp: "{{f}} {{p}}",
    np: "{{n}} {{p}}",
    mfp: "{{mf}} {{p}}",
    ma: "{{m|a}}",
    mi: "{{m|i}}",
    fa: "{{f|a}}",
    fi: "{{f|i}}",
    na: "{{n|a}}",
    ni: "{{n|i}}",
  }[gender];

  if (nature === "nom" && genderWikicode)
    wikicode += " " + genderWikicode;
  return wikicode;
}

/**
 * Fallback word line generator for languages not explicitly supported by the gadget.
 * @param langCode {string} The translation’s language code.
 * @param translation {string} The translation word.
 * @param nature {string} Word’s grammatical nature.
 * @param gender {string} Word’s gender if any.
 * @param transcription {string} Word’s latin transcription if any.
 * @param dif {string} Text to show on the instead in place of the translation.
 * @return {string} The generic word line.
 */
function genericWordLineGenerator(langCode, translation, nature, gender, transcription, dif) {
  let wikicode = "";
  wikicode += dif ? `'''${dif}'''` : `'''${translation}'''`;
  if (transcription) wikicode += `, ''${transcription}''`;
  wikicode += ` {{pron||${langCode}}}`;
  return addGender(wikicode, nature, gender);
}

/*
 * Generators registration
 */

/**
 * This map associates a language code to a function that generates the word line for it.
 * @type {{[code: string]: WordLineGenerator}}
 */
const wordLineGenerators = {};

/**
 * Register a word line generator for the given language.
 * @param langCode {string} Language’s code.
 * @param generator {Function} The generator function.
 */
function registerWordLineGeneratorForLanguage(langCode, generator) {
  wordLineGenerators[langCode] = generator;
}

// Catalan/Catalan
registerWordLineGeneratorForLanguage(
    "ca",
    (translation, nature, gender) => {
      let wikicode = "";
      if (nature === "nom") wikicode += "{{ca-rég|<!-- Compléter -->}}\n";
      wikicode += `'''${translation}''' {{pron||ca}}`;
      return addGender(wikicode, nature, gender);
    }
);

// Esperanto/Espéranto
registerWordLineGeneratorForLanguage(
    "eo",
    (translation, nature) => {
      let wikicode = "";

      if (nature === "adjectif" || nature === "nom")
        wikicode += "{{eo-flexions|<!-- Compléter -->}}\n";
      else if (nature === "verbe")
        wikicode += "{{eo-verbe}}\n";

      wikicode += `'''${translation}''' {{pron||eo}}`;
      if (nature === "verbe")
        wikicode += " {{valence ?|eo}} {{conjugaison|eo}}";

      return wikicode;
    }
);

// Spanish/Espagnol
registerWordLineGeneratorForLanguage(
    "es",
    (translation, nature, gender) => {
      let wikicode = "";
      if (nature === "nom")
        wikicode += "{{es-rég|<!-- Compléter -->}}\n";
      wikicode += `'''${translation}''' {{pron||es}}`;
      return addGender(wikicode, nature, gender);
    }
);

// Italian/Italien
registerWordLineGeneratorForLanguage(
    "it",
    (translation, nature, gender) => {
      let wikicode = "";

      if (nature === "nom")
        wikicode += "{{it-flexion|<!-- Compléter -->}}\n";

      wikicode += `'''${translation}''' {{pron||it}}`;
      if (nature === "nom" && gender)
        wikicode = addGender(wikicode, nature, gender);
      else
        wikicode += " {{genre ?|it}}";

      return wikicode;
    }
);

// Occitan/Occitan
registerWordLineGeneratorForLanguage(
    "oc",
    (translation, nature, gender) => {
      let wikicode = "";

      if (nature === "adjectif")
        wikicode += "{{oc-accord-mixte|<!-- Compléter -->}}\n";
      else if (nature === "nom")
        wikicode += "{{oc-rég|<!-- Compléter -->}}\n";

      wikicode += `'''${translation}''' {{pron||oc}}`;
      return addGender(wikicode, nature, gender);
    }
);

// Russian/Russe
registerWordLineGeneratorForLanguage(
    "ru",
    (translation, nature, gender) => {
      let wikicode = "";
      if (nature === "nom" && gender)
        wikicode += `{{ru-décl${gender}|<!-- Compléter -->}}\n`;
      wikicode += `'''${translation}''', ''{{transliterator|ru|${translation}}}'' {{pron||ru}}`;
      return addGender(wikicode, nature, gender);
    }
);

// Swedish/Suédois
registerWordLineGeneratorForLanguage(
    "sv",
    (translation, nature, gender) => {
      let wikicode = "";

      if (nature === "adjectif")
        wikicode += "{{sv-adj}}\n";
      else if (nature === "nom") {
        if (translation.endsWith("a"))
          wikicode += "{{sv-nom-c-or}}\n";
        else if (translation.endsWith("ing"))
          wikicode += "{{sv-nom-c-ar}}\n";
        else if (translation.endsWith("are"))
          wikicode += "{{sv-nom-c-ar|are=}}\n";
        else if (translation.endsWith("ande"))
          wikicode += "{{sv-nom-n-n}}\n";
        else if (translation.endsWith("ende"))
          wikicode += "{{sv-nom-n-n}}\n";
        else if (translation.endsWith("um"))
          wikicode += "{{sv-nom-n-er|um=}}\n";
        else if (translation.endsWith("tion"))
          wikicode += "{{sv-nom-c-er}}\n";
        else if (translation.endsWith("tör"))
          wikicode += "{{sv-nom-c-er}}\n";
        else if (translation.endsWith("ier"))
          wikicode += "{{sv-nom-c-er|r=}}\n";
        else if (translation.endsWith("iker"))
          wikicode += "{{sv-nom-c-er|r=}}\n";
        else if (translation.endsWith("else"))
          wikicode += "{{sv-nom-c-er|e=}}\n";
        else if (gender === "neutre")
          wikicode += "{{sv-nom-n-0}}\n";
        else
          wikicode += "{{sv-nom-c-er}}\n";
      } else if (nature === "verbe")
        wikicode += "{{sv-conj-ar}}\n";

      wikicode += `'''${translation}''' {{pron||sv}}`;
      if (nature === "nom") {
        if (gender)
          wikicode = addGender(wikicode, nature, gender);
        else if (translation.endsWith("ande") || translation.endsWith("ende") || translation.endsWith("um"))
          wikicode += " {{n}}";
        else
          wikicode += " {{c}}";
      }

      return wikicode;
    }
);

/*
 * Gadget setup
 */

/**
 * Make a GET request to get the wikicode for the current page.
 * Stores the word, translation and language code for use further down the line.
 * @param translation {string} The translation to create.
 * @param translationText {string} The translation’s link text.
 * @param langCode {string} The translation’s language code.
 */
function createTranslation(translation, translationText, langCode) {
  /** @type {string} */
  const word = mw.config.get("wgTitle");
  switch (langCode) {
    case "zh-Hans":
    case "zh-Hant":
      langCode = "zh";
      break;
    case "ko-Hani":
      langCode = "ko";
      break;
    case "vi-Hani":
    case "vi-Hans":
    case "vi-Hant":
      langCode = "vi";
      break;
    case "nan-Hani":
    case "nan-Hans":
    case "nan-Hant":
      langCode = "nan";
      break;
  }

  // Get current article’s wikicode
  $.get(
      "/wiki/" + encodeURIComponent(word),
      {
        action: "raw",
      },
      (wikicode) => generateWikicode(
          wikicode,
          word,
          translation,
          translationText,
          langCode,
          wordLineGenerators[langCode]
      )
  );
}

/*
 * Initialize this gadget by hooking a callback to
 * every red links in the infoboxes with the "translations" class.
 */
$(".translations .new").each(function () {
  const $link = $(this);
  const url = new URL($link.prop("href"));
  let title = url.searchParams.get("title"); // Old red link URL structure
  if (!title) title = url.pathname.substring(6); // Strip /wiki/
  const translation = decodeURIComponent(title.replaceAll("_", " "));
  const translationText = $link.text();

  if (translation) {
    const langCode = $link.parent().attr("lang");
    $link.addClass("create-translation");
    $link.attr("title", `Cliquez pour créer «\u00a0${translation}\u00a0» avec le gadget`);
    $link.on("click", (event) => {
      event.preventDefault();
      createTranslation(translation, translationText, langCode);
    });
  }
});
// </nowiki>
