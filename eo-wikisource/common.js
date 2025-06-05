mw.loader.load("https://fr.wikisource.org/wiki/Utilisateur:Lepticed7/Sliders.js?action=raw&ctype=text/javascript");

const filePageRegex = /^\/wiki\/Dosiero:(.+)$/;
const m = filePageRegex.exec(location.pathname);
if (m) location.replace(`https://commons.wikimedia.org/wiki/File:${m[1]}`);

document.querySelectorAll("a").forEach((link) => {
  const m = filePageRegex.exec(link.pathname);
  if (m) link.href = `https://commons.wikimedia.org/wiki/File:${m[1]}`;
});

const obs = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const target = mutation.target;
    if (!(target instanceof HTMLAnchorElement)) return;
    const m = filePageRegex.exec(target.pathname);
    if (m) target.href = `https://commons.wikimedia.org/wiki/File:${m[1]}`;
  });
});
obs.observe(document.body, { childList: true, subtree: true });
