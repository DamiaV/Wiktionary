/**
 * Format the sections in the given text.
 * @param text {string} The text to format.
 * @returns {{newText: string, changesCount: number, errors: {invalidLine: string, lineNumber: number, error: string}[]}}
 */
function formatSections(text) {
  /** @type {{invalidLine: string, lineNumber: number, error: string}[]} */
  var errors = [];

  /**
   * Format the given section.
   * @param sectionText {string} The section to format.
   * @param lineNumber {number} The line number of the text to format.
   * @returns {string} The formatted section text.
   */
  function formatSection(sectionText, lineNumber) {
    // Special case
    if (/^{{trad-trier}}\s*$/.test(sectionText)) {
      return "===== {{S|traductions à trier}} =====";
    }

    sectionText = sectionText.replaceAll(/\s+$/g, "");

    var isTemplateS = false;
    // Get the section name using the old syntax
    var sectionName = /{{-([^|}]+)-/.exec(sectionText);

    if (!sectionName) {
      // Not found, use the new syntax
      sectionName = /{{S\|\s*([^|}]+)\s*[|}]/.exec(sectionText);
      if (sectionName !== null)
        isTemplateS = true;
      else {
        errors.push({
          invalidLine: sectionText,
          lineNumber: lineNumber,
          error: "Pas de nom de section reconnu"
        });
        return sectionText;
      }
    }

    // Formatting
    sectionName = sectionName[1].trim();
    sectionName = sectionName.charAt(0).toLowerCase() + sectionName.substring(1);

    var flexion = false;
    // Check if the section is a flexion (old syntax)
    if (sectionName.length >= 6 && sectionName.indexOf("flex-") === 0) {
      sectionName = sectionName.substring(5);
      flexion = true;
    }

    // Remove "loc-" from the old section name
    if (sectionName !== 'loc-phr' && sectionName.length >= 5 && sectionName.indexOf('loc-') === 0)
      sectionName = sectionName.substring(4);

    // Handle old "s" parameter for "note" section type
    if (sectionName === "note" && /\|s=[^|}]/.test(sectionText))
      sectionName = "notes";

    // Section not recognized, push an error and return
    if (!sections[sectionName]) { // Declared in [[MediaWiki:Gadget-Formatage/sections/liste.js]]
      errors.push({
        invalidLine: sectionText,
        lineNumber: lineNumber,
        error: "Nom de section inconnu : " + sectionName
      });
      return sectionText;
    }

    var langCode = null;
    // Get the language code if applicable
    if (sections[sectionName].hasCode) {
      if (isTemplateS) {
        langCode = /{{S\|[^|}]+?\|([^|}=]+?)[|}]/.exec(sectionText);
      } else {
        langCode = /\|([^|}=]+?)[|}]/.exec(sectionText);
      }
      if (langCode !== null) {
        langCode = $.trim(langCode[1]);
      } else {
        errors.push({
          invalidLine: sectionText,
          lineNumber: lineNumber,
          error: "Code langue manquant"
        });
        return sectionText;
      }
    }

    var match = null;

    var locution = null;
    if (isTemplateS) {
      if (/\|flexion[|}]/.test(sectionText))
        flexion = true;
      match = /locution\s*=([^|}]+?)[|}]/.exec(sectionText);
      locution = match ? match[1].trim() : null;
    }

    match = /num\s*=([^|}]+?)[|}]/.exec(sectionText);
    var num = match ? match[1].trim() : null;

    match = /clé\s*=([^|}]+?)[|}]/.exec(sectionText);
    var sortKey = match ? match[1].trim() : null;

    var gender = null;
    // Get "genre" parameter of {{-prénom-}}
    if (sectionName === "prénom") {
      match = /genre\s*=([^|}]+?)[|}]/.exec(sectionText);
      gender = match ? match[1].trim() : null;
    }

    // Generate final text
    var formattedText = "{{S|" + sections[sectionName].name;
    if (langCode)
      formattedText += "|" + langCode;
    if (flexion)
      formattedText += "|flexion";
    if (locution)
      formattedText += "|locution=" + locution;
    if (gender)
      formattedText += "|genre=" + gender;
    if (sortKey)
      formattedText += "|clé=" + sortKey;
    if (num)
      formattedText += "|num=" + num;
    formattedText += "}}";
    formattedText = formatSectionTitle(formattedText, sections[sectionName].level);
    return formattedText;
  }

  /**
   * Wrap the given text between the specified number of "=" signs.
   * @param text {string} The text to wrap.
   * @param level {number} The number of "=".
   * @returns {string} The formatted text.
   */
  function formatSectionTitle(text, level) {
    var header;
    switch (level) {
      case 3:
        header = "===";
        break;
      case 4:
        header = "====";
        break;
      case 5:
        header = "=====";
        break;
    }
    return header + " " + text + " " + header;
  }

  var formattedText = text;
  var changesCount = 0;

  var lines = text.split("\n");
  for (var i = 0; i < lines.length; i++) {
    if (/^{{-[^|}]+-[^}]*?}} *$/.test(lines[i]) // old templates
        || /^{{trad-trier}} *$/.test(lines[i])  // non-conventional old template
        || /^{{n-vern}} *$/.test(lines[i])			// idem
        || /^\s*=+\s*{{S\|[^|}]+[^}]*?}} *=+ *$/.test(lines[i])	// "S" template
    ) {
      var newText = formattedText.replace(lines[i], formatSection(lines[i], i + 1));
      if (newText !== text) {
        changesCount++;
        formattedText = newText;
      }
    }
  }

  // Remove blank lines before and after each section
  var t = formattedText
      .replaceAll(/[\r\n]+==/g, "\n\n==")
      .replaceAll(/==[\r\n]+/g, "==\n");
  if (t !== formattedText) {
    changesCount++;
    formattedText = t;
  }

  return {
    newText: formattedText,
    changesCount: changesCount,
    errors: errors,
  };
}
