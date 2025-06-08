"use strict";

//mw.loader.load("https://fr.wikisource.org/wiki/Utilisateur:Lepticed7/Sliders.js?action=raw&ctype=text/javascript");

/*
 * Redirect Diosiero: pages to the corresponding File: page on Commons
 */
const filePageRegex = /^\/wiki\/Dosiero:(.+)$/;
const m = filePageRegex.exec(location.pathname);
if (m) location.replace(`https://commons.wikimedia.org/wiki/File:${m[1]}`);

/**
 * @param link {HTMLAnchorElement}
 */
function replaceLink(link) {
  const m = filePageRegex.exec(link.pathname);
  if (m) link.href = `https://commons.wikimedia.org/wiki/File:${m[1]}`;
}

document.querySelectorAll("a").forEach((link) => {
  replaceLink(link);
});

const obs = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const target = mutation.target;
    if (!(target instanceof HTMLAnchorElement)) return;
    replaceLink(target);
  });
});
obs.observe(document.body, { childList: true, subtree: true });
