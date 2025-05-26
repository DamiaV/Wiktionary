/**
 * Returns the title the current page.
 * @return {string} The title without the namespace.
 */
function getCurrentPageTitle() {
  return mw.config.get("wgTitle");
}

/**
 * Returns the namespace ID of the current page.
 * @return {number} The namespace ID.
 */
function getCurrentPageNamespaceId() {
  return mw.config.get("wgNamespaceNumber");
}

/**
 * Tells whether the current page’s namespace is one of the given ones.
 * @param namespacesNames {Array<string>} The list of namespace names.
 * @return {boolean} True if the current page’s namespace is in the list, false otherwise.
 */
function hasNamespaceIn(namespacesNames) {
  const authorizedNamespaces = [];
  for (const namespaceName of namespacesNames) {
    const ns = namespaceName.toLowerCase().replace(/\s/g, "_");
    authorizedNamespaces.push(mw.config.get("wgNamespaceIds")[ns]);
  }
  return authorizedNamespaces.includes(wikt.page.getCurrentPageNamespaceId())
}

/**
 * Adds the namespace name to the given page name.
 * @param namespaceId {int} The namespace’s ID.
 * @param pageName {string} The page name.
 * @return {string} Full page name as “namespage:pageName”.
 */
function getFullPageName(namespaceId, pageName) {
  // "" is main namespace
  if (namespaceId === mw.config.get("wgNamespaceIds")[""])
    return pageName;
  return mw.config.get("wgFormattedNamespaces")[namespaceId] + ":" + pageName;
}

/**
 * Returns all the subpages of the given base page that match the given CirrusSearch pattern.
 * Sends an AJAX request to WikiMedia’s servers.
 * @param namespaceId {number} The page’s namespace ID.
 * @param basePageName {string} The page’s name.
 * @param subPagesPattern {string} The CirrusSearch pattern subpages’ names must match.
 * @param callback {(Object) => void} A callback function.
 */
function getSubpages(namespaceId, basePageName, subPagesPattern, callback) {
  // Échapement des caractères spéciaux de regex
  const escaped = basePageName.replace(/([~@#&*()-+{}\[\]|\\<>?./])/g, "\\$1");
  $.get(
      "https://fr.wiktionary.org/w/api.php",
      {
        action: "query",
        list: "search",
        srnamespace: namespaceId,
        srprop: "",
        srsearch: `intitle:/${escaped}\\/${subPagesPattern}/`,
        format: "json",
      },
      callback,
      "json"
  );
}

/**
 * Adds the given buttons to the current page’s title.
 * @param buttons {{text: string, title: string, callback: (event) => void}[]} The buttons to add.
 * Each button object has to define a text, a title and
 * a callback function.
 */
function addButtonAfterTitle(buttons) {
  const $heading = $("#firstHeading");

  for (const button of buttons) {
    const text = button.text;
    const title = button.title;
    const $span = $("<span>");
    const $link = $("<a>");

    $span.addClass("noprint ancretitres");
    $span.attr("style", "font-size: small; font-weight: normal; " +
        "-moz-user-select: none; -webkit-user-select: none; " +
        "-ms-user-select: none; user-select: none; margin-left: 5px;");

    $link.text(text);
    $link.attr("href", "#");
    $link.attr("title", title);
    $link.on("click", button.callback);

    $span.append($link);
    $heading.append($span);
  }
}

/**
 * Adds a listener to DOM changes for the current page.
 * @param callback {MutationCallback} Function to execute when mutations are observed.
 * Parameters are the list of mutations and the observer which invoked the callback.
 * @param node {HTMLElement?} The root element to monitor. If null, the body node will be used.
 * @param options {MutationObserverInit?} Custom options. Default: attributes, childList & subtree.
 * (see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit for accepted values)
 * @return {MutationObserver} The created observer instance.
 */
function onDOMChanges(callback, node, options) {
  const targetNode = node || document.body;
  const config = options || { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  return observer;
}

/**
 * Parses and renders the given wikicode.
 * ⚠️ Makes a synced AJAX request to the server. ⚠️
 * @param wikicode {string} The wikicode to parse.
 * @param onlyFirstParagraph {boolean?} If true, only returns the HTML contents of the first paragraph.
 * @return {Object|string} The corresponding jQuery object or the HTML code if onlyFirstParagraph is true.
 */
function renderWikicode(wikicode, onlyFirstParagraph) {
  let html;

  $.ajax({
    url: "https://fr.wiktionary.org/w/api.php",
    data: {
      action: "parse",
      text: wikicode,
      contentmodel: "wikitext",
      format: "json",
    },
    async: false,
    complete: (data) => {
      // noinspection JSUnresolvedVariable
      const $text = $(data.responseJSON["parse"]["text"]["*"]);
      html = onlyFirstParagraph ? $text.find("p:first").html() : $text;
    },
    dataType: "json",
  });

  // noinspection JSUnusedAssignment
  return html;
}

/**
 * Computes the sorting key for the given word.
 * French words only need to take apostrophies into account.
 * @param word {string} The word.
 * @return {string} The sorting key.
 */
function getSortingKey(word) {
  let key = word.toLowerCase();

  key = key.replaceAll("ĉ", "cx");
  key = key.replaceAll("ĝ", "gx");
  key = key.replaceAll("ĥ", "hx");
  key = key.replaceAll("ĵ", "jx");
  key = key.replaceAll("ŝ", "sx");
  key = key.replaceAll("ŭ", "ux");
  key = key.replaceAll(/['’]/g, "");
  key = key.replaceAll(/[-/]/g, " ");

  return key;
}

/**
 * This module defines function to get information about the current page.
 * [[Catégorie:JavaScript du Wiktionnaire|core.pages.js]]
 */
module.exports = {
  getCurrentPageTitle,
  getCurrentPageNamespaceId,
  hasNamespaceIn,
  getFullPageName,
  getSubpages,
  addButtonAfterTitle,
  onDOMChanges,
  renderWikicode,
  getSortingKey,
};
