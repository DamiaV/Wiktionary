// Page Previews for Wiktionary, adapted from [[en:MediaWiki:Gadget-PagePreviews.js]] by [[User:Ioaxxere]].
// <nowiki>
"use strict";

const { getLanguagesNames } = require("./wikt.core.languages.js");

console.log("Chargement de Gadget-wikt.page-preview.js…");

// Generated using the following Python code:
// import requests
// import re
// data = requests.get("https://en.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=interwikimap&formatversion=2&format=json").json()['query']['interwikimap']
// prefix_data = {item["prefix"]: (re.findall("https://([^.]+).wikipedia.org/wiki/\$1$", item["url"]) or [0])[0] for item in data}
// prefix_data["wikipedia"] = 0
// prefix_data_array = [list(i) for i in prefix_data.items()]
// print(f"const INTERWIKI_PREFIXES = new Map(" + str(prefix_data_array).replace(" ", "").replace("'", "\"") + ");")
const INTERWIKI_PREFIXES = new Map([["acronym", 0], ["advisory", 0], ["aew", 0], ["antwiki", 0], ["appropedia", 0], ["aquariumwiki", 0], ["arborwiki", 0], ["arxiv", 0], ["baden", 0], ["battlestarwiki", 0], ["bcnbio", 0], ["beacha", 0], ["betawiki", 0], ["betawikiversity", 0], ["bibcode", 0], ["bibliowiki", 0], ["botwiki", 0], ["boxrec", 0], ["bugzilla", 0], ["bulba", 0], ["c2", 0], ["cache", 0], ["centralwikia", 0], ["choralwiki", 0], ["citizendium", 0], ["commons", 0], ["communitywiki", 0], ["comune", 0], ["creativecommons", 0], ["creativecommonswiki", 0], ["dbdump", 0], ["dcdatabase", 0], ["debian", 0], ["devmo", 0], ["dico", 0], ["dicoado", 0], ["dict", 0], ["dictionary", 0], ["diffblog", 0], ["discord", 0], ["disinfopedia", 0], ["dmoz", 0], ["dmozs", 0], ["doi", 0], ["donate", 0], ["doom_wiki", 0], ["download", 0], ["dpd", 0], ["dpla", 0], ["drae", 0], ["elibre", 0], ["emacswiki", 0], ["encyc", 0], ["englyphwiki", 0], ["enkol", 0], ["esolang", 0], ["etherpad", 0], ["ethnologue", 0], ["ethnologuefamily", 0], ["exkcd", 0], ["exotica", 0], ["fanimutationwiki", 0], ["fedora", 0], ["finalfantasy", 0], ["finnix", 0], ["flickrphoto", 0], ["flickruser", 0], ["foldoc", 0], ["foundation", 0], ["foundationsite", 0], ["freebsdman", 0], ["freedomdefined", 0], ["freenode", 0], ["freesoft", 0], ["gardenology", 0], ["gentoo", 0], ["genwiki", 0], ["gerrit", 0], ["git", 0], ["gitlab", 0], ["globalcontribs", 0], ["glottolog", 0], ["glottopedia", 0], ["google", 0], ["googledefine", 0], ["googlegroups", 0], ["gucprefix", 0], ["guildwarswiki", 0], ["gutenberg", 0], ["gutenbergwiki", 0], ["hackerspaces", 0], ["hammondwiki", 0], ["hdl", 0], ["heraldik", 0], ["horizonlabs", 0], ["hrfwiki", 0], ["hrwiki", 0], ["iarchive", 0], ["imdbcompany", 0], ["imdbname", 0], ["imdbtitle", 0], ["incubator", 0], ["infosphere", 0], ["irc", 0], ["ircrc", 0], ["ircs", 0], ["isni", 0], ["iso639-3", 0], ["issn", 0], ["iuridictum", 0], ["jaglyphwiki", 0], ["jira", 0], ["jstor", 0], ["kamelo", 0], ["karlsruhe", 0], ["komicawiki", 0], ["lexemes", 0], ["liberachat", 0], ["libreplanet", 0], ["lingualibre", 0], ["linguistlist", 0], ["listarchive", 0], ["livepedia", 0], ["localwiki", 0], ["lofc", 0], ["lojban", 0], ["lokalhistoriewiki", 0], ["lostpedia", 0], ["luxo", 0], ["mail", 0], ["mailarchive", 0], ["mariowiki", 0], ["marveldatabase", 0], ["mdwiki", 0], ["meatball", 0], ["mediawikiwiki", 0], ["mediazilla", 0], ["memoryalpha", 0], ["metawiki", 0], ["metawikimedia", 0], ["metawikipedia", 0], ["mineralienatlas", 0], ["mixnmatch", 0], ["moinmoin", 0], ["mosapedia", 0], ["mozillawiki", 0], ["mozillazinekb", 0], ["mw", 0], ["mwod", 0], ["mwot", 0], ["nara", 0], ["nlab", 0], ["nost", "nostalgia"], ["nostalgia", "nostalgia"], ["oclc", 0], ["oeis", 0], ["oldwikisource", 0], ["olpc", 0], ["openlibrary", 0], ["openstreetmap", 0], ["openwetware", 0], ["organicdesign", 0], ["orthodoxwiki", 0], ["osmwiki", 0], ["otrs", 0], ["otrswiki", 0], ["outreach", 0], ["outreachwiki", 0], ["owasp", 0], ["paws", 0], ["petscan", 0], ["phab", 0], ["phabricator", 0], ["planetmath", 0], ["pmid", 0], ["pokewiki", 0], ["pokéwiki", 0], ["policy", 0], ["proofwiki", 0], ["pyrev", 0], ["pythoninfo", 0], ["quality", 0], ["quarry", 0], ["rcirc", 0], ["regiowiki", 0], ["rev", 0], ["revo", 0], ["rfc", 0], ["rheinneckar", 0], ["rodovid", 0], ["rt", 0], ["scholar", 0], ["schoolswp", 0], ["scores", 0], ["scoutwiki", 0], ["securewikidc", 0], ["semantic-mw", 0], ["senseislibrary", 0], ["sep11", 0], ["sharemap", 0], ["silcode", 0], ["slashdot", 0], ["sourceforge", 0], ["spcom", 0], ["species", 0], ["stats", 0], ["stewardry", 0], ["strategy", 0], ["strategywiki", 0], ["sulutil", 0], ["svn", 0], ["swtrain", 0], ["tardis", 0], ["tclerswiki", 0], ["tenwiki", "ten"], ["test2wiki", "test2"], ["testwiki", "test"], ["testwikidata", 0], ["tfwiki", 0], ["thelemapedia", 0], ["theopedia", 0], ["ticket", 0], ["tmbw", 0], ["toolforge", 0], ["toolhub", 0], ["toollabs", 0], ["tools", 0], ["translatewiki", 0], ["tswiki", 0], ["tviv", 0], ["twiki", 0], ["twl", 0], ["tyvawiki", 0], ["umap", 0], ["uncyclopedia", 0], ["unihan", 0], ["urbandict", 0], ["usability", 0], ["usemod", 0], ["utrs", 0], ["viaf", 0], ["vikidia", 0], ["vlos", 0], ["votewiki", 0], ["vrts", 0], ["vrtwiki", 0], ["wcna", 0], ["weirdgloop", 0], ["werelate", 0], ["wg", "wg-en"], ["wikia", 0], ["wikiapiary", 0], ["wikiasite", 0], ["wikibooks", 0], ["wikicities", 0], ["wikicity", 0], ["wikiconference", 0], ["wikidata", 0], ["wikiedudashboard", 0], ["wikifunctions", 0], ["wikifur", 0], ["wikihow", 0], ["wikiindex", 0], ["wikilivres", 0], ["wikilivresru", 0], ["wikimania", 0], ["wikimedia", 0], ["wikinews", 0], ["wikinfo", 0], ["wikinvest", 0], ["wikipapers", 0], ["wikipedia", 0], ["wikipediawikipedia", 0], ["wikiquote", 0], ["wikiskripta", 0], ["wikisophia", 0], ["wikisource", 0], ["wikisp", 0], ["wikispecies", 0], ["wikispore", 0], ["wikispot", 0], ["wikitech", 0], ["labsconsole", 0], ["wikitrek", 0], ["wikiti", 0], ["wikiversity", 0], ["wikivoyage", 0], ["wikiwikiweb", 0], ["wiktionary", 0], ["wm2005", 0], ["wm2006", 0], ["wm2007", 0], ["wm2008", 0], ["wm2009", 0], ["wm2010", 0], ["wm2011", 0], ["wm2012", 0], ["wm2013", 0], ["wm2014", 0], ["wm2015", 0], ["wm2016", 0], ["wm2017", 0], ["wm2018", 0], ["wmam", 0], ["wmania", 0], ["wmar", 0], ["wmat", 0], ["wmau", 0], ["wmbd", 0], ["wmbe", 0], ["wmbr", 0], ["wmca", 0], ["wmch", 0], ["wmcl", 0], ["wmcn", 0], ["wmco", 0], ["wmcz", 0], ["wmcz_docs", 0], ["wmcz_old", 0], ["wmdc", 0], ["wmde", 0], ["wmdeblog", 0], ["wmdk", 0], ["wmdoc", 0], ["wmec", 0], ["wmee", 0], ["wmes", 0], ["wmet", 0], ["wmf", 0], ["wmfblog", 0], ["wmfdashboard", 0], ["wmfi", 0], ["wmfr", 0], ["wmge", 0], ["wmhi", 0], ["wmhk", 0], ["wmhu", 0], ["wmid", 0], ["wmil", 0], ["wmin", 0], ["wmit", 0], ["wmke", 0], ["wmmk", 0], ["wmmx", 0], ["wmnl", 0], ["wmno", 0], ["wmnyc", 0], ["wmpa-us", 0], ["wmph", 0], ["wmpl", 0], ["wmplsite", 0], ["wmpt", 0], ["wmpunjabi", 0], ["wmromd", 0], ["wmrs", 0], ["wmru", 0], ["wmse", 0], ["wmsk", 0], ["wmteam", 0], ["wmtr", 0], ["wmtw", 0], ["wmua", 0], ["wmuk", 0], ["wmve", 0], ["wmza", 0], ["wookieepedia", 0], ["wowwiki", 0], ["wurmpedia", 0], ["xkcd", 0], ["xtools", 0], ["zum", 0], ["c", 0], ["m", 0], ["meta", 0], ["d", 0], ["f", 0], ["aa", "aa"], ["ab", "ab"], ["ace", "ace"], ["ady", "ady"], ["af", "af"], ["ak", "ak"], ["als", "als"], ["alt", "alt"], ["am", "am"], ["ami", "ami"], ["an", "an"], ["ang", "ang"], ["ann", "ann"], ["anp", "anp"], ["ar", "ar"], ["arc", "arc"], ["ary", "ary"], ["arz", "arz"], ["as", "as"], ["ast", "ast"], ["atj", "atj"], ["av", "av"], ["avk", "avk"], ["awa", "awa"], ["ay", "ay"], ["az", "az"], ["azb", "azb"], ["ba", "ba"], ["ban", "ban"], ["bar", "bar"], ["bat-smg", "bat-smg"], ["bbc", "bbc"], ["bcl", "bcl"], ["bdr", "bdr"], ["be", "be"], ["be-tarask", "be-tarask"], ["be-x-old", "be-tarask"], ["bew", "bew"], ["bg", "bg"], ["bh", "bh"], ["bi", "bi"], ["bjn", "bjn"], ["blk", "blk"], ["bm", "bm"], ["bn", "bn"], ["bo", "bo"], ["bpy", "bpy"], ["br", "br"], ["bs", "bs"], ["btm", "btm"], ["bug", "bug"], ["bxr", "bxr"], ["ca", "ca"], ["cbk-zam", "cbk-zam"], ["cdo", "cdo"], ["ce", "ce"], ["ceb", "ceb"], ["ch", "ch"], ["cho", "cho"], ["chr", "chr"], ["chy", "chy"], ["ckb", "ckb"], ["co", "co"], ["cr", "cr"], ["crh", "crh"], ["cs", "cs"], ["csb", "csb"], ["cu", "cu"], ["cv", "cv"], ["cy", "cy"], ["da", "da"], ["dag", "dag"], ["de", "de"], ["dga", "dga"], ["din", "din"], ["diq", "diq"], ["dsb", "dsb"], ["dtp", "dtp"], ["dty", "dty"], ["dv", "dv"], ["dz", "dz"], ["ee", "ee"], ["el", "el"], ["eml", "eml"], ["en", "en"], ["eo", "eo"], ["es", "es"], ["et", "et"], ["eu", "eu"], ["ext", "ext"], ["fa", "fa"], ["fat", "fat"], ["ff", "ff"], ["fi", "fi"], ["fiu-vro", "fiu-vro"], ["fj", "fj"], ["fo", "fo"], ["fon", "fon"], ["fr", "fr"], ["frp", "frp"], ["frr", "frr"], ["fur", "fur"], ["fy", "fy"], ["ga", "ga"], ["gag", "gag"], ["gan", "gan"], ["gcr", "gcr"], ["gd", "gd"], ["gl", "gl"], ["glk", "glk"], ["gn", "gn"], ["gom", "gom"], ["gor", "gor"], ["got", "got"], ["gpe", "gpe"], ["gsw", "als"], ["gu", "gu"], ["guc", "guc"], ["gur", "gur"], ["guw", "guw"], ["gv", "gv"], ["ha", "ha"], ["hak", "hak"], ["haw", "haw"], ["he", "he"], ["hi", "hi"], ["hif", "hif"], ["ho", "ho"], ["hr", "hr"], ["hsb", "hsb"], ["ht", "ht"], ["hu", "hu"], ["hy", "hy"], ["hyw", "hyw"], ["hz", "hz"], ["ia", "ia"], ["iba", "iba"], ["id", "id"], ["ie", "ie"], ["ig", "ig"], ["igl", "igl"], ["ii", "ii"], ["ik", "ik"], ["ilo", "ilo"], ["inh", "inh"], ["io", "io"], ["is", "is"], ["it", "it"], ["iu", "iu"], ["ja", "ja"], ["jam", "jam"], ["jbo", "jbo"], ["jv", "jv"], ["ka", "ka"], ["kaa", "kaa"], ["kab", "kab"], ["kbd", "kbd"], ["kbp", "kbp"], ["kcg", "kcg"], ["kg", "kg"], ["kge", "kge"], ["ki", "ki"], ["kj", "kj"], ["kk", "kk"], ["kl", "kl"], ["km", "km"], ["kn", "kn"], ["ko", "ko"], ["koi", "koi"], ["kr", "kr"], ["krc", "krc"], ["ks", "ks"], ["ksh", "ksh"], ["ku", "ku"], ["kus", "kus"], ["kv", "kv"], ["kw", "kw"], ["ky", "ky"], ["la", "la"], ["lad", "lad"], ["lb", "lb"], ["lbe", "lbe"], ["lez", "lez"], ["lfn", "lfn"], ["lg", "lg"], ["li", "li"], ["lij", "lij"], ["lld", "lld"], ["lmo", "lmo"], ["ln", "ln"], ["lo", "lo"], ["lrc", "lrc"], ["lt", "lt"], ["ltg", "ltg"], ["lv", "lv"], ["lzh", "zh-classical"], ["mad", "mad"], ["mai", "mai"], ["map-bms", "map-bms"], ["mdf", "mdf"], ["mg", "mg"], ["mh", "mh"], ["mhr", "mhr"], ["mi", "mi"], ["min", "min"], ["mk", "mk"], ["ml", "ml"], ["mn", "mn"], ["mni", "mni"], ["mnw", "mnw"], ["mo", "mo"], ["mos", "mos"], ["mr", "mr"], ["mrj", "mrj"], ["ms", "ms"], ["mt", "mt"], ["mus", "mus"], ["mwl", "mwl"], ["my", "my"], ["myv", "myv"], ["mzn", "mzn"], ["na", "na"], ["nah", "nah"], ["nan", "zh-min-nan"], ["nap", "nap"], ["nds", "nds"], ["nds-nl", "nds-nl"], ["ne", "ne"], ["new", "new"], ["ng", "ng"], ["nia", "nia"], ["nl", "nl"], ["nn", "nn"], ["no", "no"], ["nov", "nov"], ["nqo", "nqo"], ["nr", "nr"], ["nrm", "nrm"], ["nso", "nso"], ["nv", "nv"], ["ny", "ny"], ["oc", "oc"], ["olo", "olo"], ["om", "om"], ["or", "or"], ["os", "os"], ["pa", "pa"], ["pag", "pag"], ["pam", "pam"], ["pap", "pap"], ["pcd", "pcd"], ["pcm", "pcm"], ["pdc", "pdc"], ["pfl", "pfl"], ["pi", "pi"], ["pih", "pih"], ["pl", "pl"], ["pms", "pms"], ["pnb", "pnb"], ["pnt", "pnt"], ["ps", "ps"], ["pt", "pt"], ["pwn", "pwn"], ["qu", "qu"], ["rm", "rm"], ["rmy", "rmy"], ["rn", "rn"], ["ro", "ro"], ["roa-rup", "roa-rup"], ["roa-tara", "roa-tara"], ["rsk", "rsk"], ["ru", "ru"], ["rue", "rue"], ["rup", "roa-rup"], ["rw", "rw"], ["sa", "sa"], ["sah", "sah"], ["sat", "sat"], ["sc", "sc"], ["scn", "scn"], ["sco", "sco"], ["sd", "sd"], ["se", "se"], ["sg", "sg"], ["sgs", "bat-smg"], ["sh", "sh"], ["shi", "shi"], ["shn", "shn"], ["shy", "shy"], ["si", "si"], ["simple", "simple"], ["sk", "sk"], ["skr", "skr"], ["sl", "sl"], ["sm", "sm"], ["smn", "smn"], ["sn", "sn"], ["so", "so"], ["sq", "sq"], ["sr", "sr"], ["srn", "srn"], ["ss", "ss"], ["st", "st"], ["stq", "stq"], ["su", "su"], ["sv", "sv"], ["sw", "sw"], ["szl", "szl"], ["szy", "szy"], ["ta", "ta"], ["tay", "tay"], ["tcy", "tcy"], ["tdd", "tdd"], ["te", "te"], ["tet", "tet"], ["tg", "tg"], ["th", "th"], ["ti", "ti"], ["tk", "tk"], ["tl", "tl"], ["tly", "tly"], ["tn", "tn"], ["to", "to"], ["tpi", "tpi"], ["tr", "tr"], ["trv", "trv"], ["ts", "ts"], ["tt", "tt"], ["tum", "tum"], ["tw", "tw"], ["ty", "ty"], ["tyv", "tyv"], ["udm", "udm"], ["ug", "ug"], ["uk", "uk"], ["ur", "ur"], ["uz", "uz"], ["ve", "ve"], ["vec", "vec"], ["vep", "vep"], ["vi", "vi"], ["vls", "vls"], ["vo", "vo"], ["vro", "fiu-vro"], ["wa", "wa"], ["war", "war"], ["wo", "wo"], ["wuu", "wuu"], ["xal", "xal"], ["xh", "xh"], ["xmf", "xmf"], ["yi", "yi"], ["yo", "yo"], ["yue", "zh-yue"], ["za", "za"], ["zea", "zea"], ["zgh", "zgh"], ["zh", "zh"], ["zh-classical", "zh-classical"], ["zh-min-nan", "zh-min-nan"], ["zh-yue", "zh-yue"], ["zu", "zu"], ["cz", "cs"], ["dk", "da"], ["epo", "eo"], ["jp", "ja"], ["zh-cn", "zh"], ["zh-tw", "zh"], ["cmn", "zh"], ["egl", "eml"], ["en-simple", "simple"], ["nb", "no"], ["w", "en"], ["wikt", 0], ["q", 0], ["b", 0], ["n", 0], ["s", 0], ["chapter", 0], ["v", 0], ["voy", 0]]);

const LANGUAGES = getLanguagesNames(true);

const animationSpeed = 0.2; // seconds
// language=css
mw.util.addCSS(`
  .page-preview ol {
    margin: 0 0.5em 0 1.5em;
    padding: 0;
  }

  .page-preview dl {
    margin-bottom: 0;
  }

  .page-preview p {
    margin: 0;
  }

  /* popupContainer has the opacity animation, while popup gets translated. */
  .popup-fade-in-up, .popup-fade-in-down {
    animation: popup-fade-in ${animationSpeed}s ease forwards;
  }

  .popup-fade-out-up, .popup-fade-out-down {
    animation: popup-fade-out ${animationSpeed}s ease forwards;
  }

  .popup-fade-in-up > div {
    animation: popup-move-in-up ${animationSpeed}s ease forwards;
  }

  .popup-fade-in-down > div {
    animation: popup-move-in-down ${animationSpeed}s ease forwards;
  }

  .popup-fade-out-up > div {
    animation: popup-move-out-up ${animationSpeed}s ease forwards;
  }

  .popup-fade-out-down > div {
    animation: popup-move-out-down ${animationSpeed}s ease forwards;
  }

  @keyframes popup-move-in-up {
    0% {
      transform: translate(0, 20px);
    }
  }

  @keyframes popup-move-in-down {
    0% {
      transform: translate(0, -20px);
    }
  }

  @keyframes popup-move-out-up {
    100% {
      transform: translate(0, -20px);
    }
  }

  @keyframes popup-move-out-down {
    100% {
      transform: translate(0, 20px);
    }
  }

  @keyframes popup-fade-out {
    100% {
      opacity: 0;
    }
  }

  @keyframes popup-fade-in {
    0% {
      opacity: 0;
    }
  }

  .ring-loader {
    margin: auto;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    /* noinspection CssUnresolvedCustomProperty */
    border-top: 5px solid var(--wikt-palette-black, #202122);
    /* noinspection CssUnresolvedCustomProperty */
    border-bottom: 5px solid var(--wikt-palette-black, #202122);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    animation: spin 1.2s linear infinite;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

  .preview-headerlink, .preview-headerlink:visited {
    color: inherit;
    font-weight: bold;
  }

  /* Hack: get the speaker icon on Wikipedia articles without having to load Phonos. */
  .ext-phonos .oo-ui-buttonElement-button:after {
    content: "🔊";
  }

  .ext-phonos * {
    display: inline !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .page-preview {
    position: absolute;
    /* noinspection CssUnresolvedCustomProperty */
    filter: drop-shadow(0px 30px 30px rgba(0, 0, 0, 0.15)) drop-shadow(0px 0px 0.75px var(--wikt-palette-dullblue, #49555f));
    z-index: 801;
  }

  .popup {
    box-sizing: border-box;
    height: 100%;
    /* noinspection CssUnresolvedCustomProperty */
    background: var(--wikt-palette-white, #ffffff);
  }

  .popup-content {
    display: flex;
    flex-direction: column;
    border-radius: 2px;
    box-sizing: border-box;
    overflow: auto;
    height: 100%;
    overflow-wrap: break-word;
    scrollbar-width: thin;
  }

  .popup-header {
    font-size: 90%;
    /* noinspection CssUnresolvedCustomProperty */
    color: var(--wikt-palette-deepblue, #2f445c);
  }

  .popup-header .icon {
    float: right;
    margin-left: 10px;
    height: 20px;
  }

  @media screen {
    html.skin-theme-clientpref-night .popup {
      background-color: #292929;
    }

    html.skin-theme-clientpref-night .popup-header {
      color: #3b86db;
    }
  }

  @media screen and (prefers-color-scheme: dark) {
    html.skin-theme-clientpref-os .popup {
      background-color: #292929;
    }

    html.skin-theme-clientpref-os .popup-header {
      color: #3b86db;
    }
  }
`);

const definitionIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor"><g><path d="M15 2a7.65 7.65 0 00-5 2 7.65 7.65 0 00-5-2H1v15h4a7.65 7.65 0 015 2 7.65 7.65 0 015-2h4V2zm2.5 13.5H14a4.38 4.38 0 00-3 1V5s1-1.5 4-1.5h2.5z"></path></g></svg>`;
const articleIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor"><g><path d="M5 1a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V3a2 2 0 00-2-2zm0 3h5v1H5zm0 2h5v1H5zm0 2h5v1H5zm10 7H5v-1h10zm0-2H5v-1h10zm0-2H5v-1h10zm0-2h-4V4h4z"></path></g></svg>`;

const loader = document.createElement("div");
loader.className = "ring-loader";

const popupContainer = document.createElement("div");
const popup = document.createElement("div");
const popupContent = document.createElement("div");

popupContainer.style.display = "none";
popupContainer.className = "page-preview";
popup.className = "popup";
popupContent.className = "popup-content";

document.body.append(popupContainer);
popupContainer.append(popup);
popup.append(popupContent);

let popupTimer;
let openLink;
let mouseX, mouseY;

let apiController = new AbortController();

function closePopup() {
  if (!openLink) return;
  openLink.dispatchEvent(new Event("pagePreviewClosed"));
  openLink = null;

  apiController.abort();
  apiController = new AbortController();

  if (popupContainer.classList.contains("popup-fade-in-up")) {
    popupContainer.classList.remove("popup-fade-in-up");
    popupContainer.classList.add("popup-fade-out-down");
  } else {
    popupContainer.classList.remove("popup-fade-in-down");
    popupContainer.classList.add("popup-fade-out-up");
  }

  // After the animation has completed, reset the popup to its initial state.
  setTimeout(() => {
    popupContainer.style.display = "none";
    popupContainer.classList.remove("popup-fade-out-down", "popup-fade-out-up");
  }, animationSpeed * 1000);
}

popup.addEventListener("pointerenter", () => {
  clearTimeout(popupTimer);
});

popup.addEventListener("pointerleave", () => {
  clearTimeout(popupTimer);
  popupTimer = setTimeout(closePopup, 300);
});

/**
 * @param link {HTMLAnchorElement}
 */
function processLink(link) {
  const linkTitle = decodeURIComponent(link.pathname.split("/wiki/")[1]);
  const titlePrefix = linkTitle.includes(":") ? linkTitle.toLowerCase().split(":")[0] : "";
  let resolvedTitle = linkTitle;
  let apiDomain = link.origin;
  let linkAnchor = decodeURIComponent(link.hash.slice(1) || "");
  const isWPlink = link.href.match(/^https:\/\/[^.]+.wikipedia.org\/wiki\//);
  const isPreviewLink = Boolean(link.closest(".page-preview"));

  // Start with various checks to determine whether a link should be processed
  if (link.matches(`nav a, .mw-widget-titleOptionWidget a, .new, .preview-headerlink, .external, [href$="#"]`))
    return;
  // If the anchor is a language name, replace it by its code
  let wasLangName = false;
  linkAnchor = linkAnchor.replace(/_/g, " ").toLowerCase();
  for (const [code, langName] of LANGUAGES) {
    if (linkAnchor === langName.toLowerCase()) {
      linkAnchor = code;
      wasLangName = true;
      break;
    }
  }
  const isLanguage = wasLangName || LANGUAGES.has(linkAnchor);
  // If the link points to the current page and has no anchor or it is not a language code, skip the link
  if (link.pathname === location.pathname && (!linkAnchor || !isLanguage))
    return;

  if (linkAnchor && !isWPlink && !isLanguage)
    linkAnchor = ""; // Ignore anchor if it’s not a language code

  if (link.href.startsWith("https://fr.wiktionary.org/wiki/")) {
    // Filter out all interwiki prefixes.
    if (INTERWIKI_PREFIXES.has(titlePrefix))
      return;
    const titleObject = new mw.Title(linkTitle);
    if (titleObject.namespace !== 0 && titleObject.namespace !== 110) // Main and Reconstruction space
      return;
  } else if (isWPlink) {
    // Filter out invalid interwiki prefixes.
    if (INTERWIKI_PREFIXES.get(titlePrefix) === 0)
      return;
    // Get the resolved title if it's a language interwiki.
    if (INTERWIKI_PREFIXES.has(titlePrefix)) {
      apiDomain = "https://" + INTERWIKI_PREFIXES.get(titlePrefix) + ".wikipedia.org";
      resolvedTitle = linkTitle.substring(linkTitle.indexOf(":") + 1);
      // If the resolved title contains another interwiki, return.
      const resolvedTitlePrefix = resolvedTitle.includes(":") ? resolvedTitle.toLowerCase().split(":")[0] : ""; // same as linkPrefix
      if (INTERWIKI_PREFIXES.has(resolvedTitlePrefix))
        return;
    }
  } else {
    return;
  }

  link.addEventListener("pointerover", event => {
    clearTimeout(popupTimer);

    // Ignore links which are already open.
    if (link === openLink)
      return;

    if (!isPreviewLink)
      closePopup();

    // Track mouse movements.
    mouseX = event.clientX;
    mouseY = event.clientY;

    // Fetch popup text immediately on hover to reduce delay.
    const responsePromise = fetch(apiDomain + "/api/rest_v1/page/html/" + encodeURIComponent(resolvedTitle), {
      headers: { "Api-User-Agent": "Gadget developed by [[User:Ioaxxere]]" },
      signal: apiController.signal
    }).then(r => r.text()).catch(() => { /* fetch was aborted */
    });

    popupTimer = setTimeout(() => {
      popupContainer.style.display = "";
      popupContent.innerHTML = "";
      popupContent.append(loader);
      popupContent.style.padding = "14px 16px 8px";

      // Disable link hovering until animation has completed.
      popupContent.style.pointerEvents = "none";
      setTimeout(() => popupContent.style.pointerEvents = "", animationSpeed * 1000);

      // Adapt the popup for large, standard, and small size preference in Vector 2022.
      let sizeSetting = 0;
      if (document.documentElement.matches(".vector-feature-custom-font-size-clientpref-1"))
        sizeSetting = 1;
      else if (document.documentElement.matches(".vector-feature-custom-font-size-clientpref-2"))
        sizeSetting = 2;

      const width = [320, 340, 360][sizeSetting];
      const height = [210, 225, 240][sizeSetting];
      const triangleSize = [9, 10, 11][sizeSetting];

      popupContainer.style.fontSize = ["14px", "15px", "17px"][sizeSetting];
      popupContainer.style.lineHeight = ["21px", "22px", "24px"][sizeSetting];
      popupContainer.style.width = width + "px";
      popupContainer.style.height = height + "px";

      if (isPreviewLink) {
        // Trigger fade-in-down animation.
        popupContainer.classList.remove("popup-fade-in-up", "popup-fade-in-down");
        void popupContainer.offsetLeft; // Force reflow
        popupContainer.classList.add("popup-fade-in-down");
      } else {
        openLink = link;
        openLink.dispatchEvent(new Event("pagePreviewOpened"));

        // Get list of rects (lines) of the target element, then find the one whose midpoint is closest to mouseY.
        // This ensures that the code can correctly handle multi-line links.
        const linkBlock = Array.from(event.target.getClientRects()).reduce((prev, next) => Math.abs((next.top + next.bottom) / 2 - mouseY) < Math.abs((prev.top + prev.bottom) / 2 - mouseY) ? next : prev);

        // Horizontal position. Choose left or right depending on the side of the screen the mouse is in.
        let leftPosition = mouseX - 30;
        if (mouseX > document.documentElement.clientWidth / 2)
          leftPosition = mouseX - width + 30;
        // Ensure that the popup is at least 5px away from the side of the screen.
        leftPosition = Math.max(5, Math.min(leftPosition, document.documentElement.clientWidth - width - 5));
        popupContainer.style.left = leftPosition + document.documentElement.scrollLeft + "px";

        // Vertical position. Prioritize fade-in-down unless there would be less than 10px of room above.
        if (linkBlock.top > height + 10 || linkBlock.top > document.documentElement.clientHeight - linkBlock.bottom) {
          popupContainer.style.top = linkBlock.top + document.documentElement.scrollTop - height + "px";
          popupContainer.classList.add("popup-fade-in-down");
          popup.style.padding = `0 0 ${triangleSize}px`;
          // Create a triangle on the bottom.
          popup.style.clipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${triangleSize}px), ${mouseX - leftPosition + triangleSize}px calc(100% - ${triangleSize}px), ${mouseX - leftPosition}px 100%, ${mouseX - leftPosition - triangleSize}px calc(100% - ${triangleSize}px), 0 calc(100% - ${triangleSize}px))`;
        } else {
          popupContainer.style.top = linkBlock.bottom + document.documentElement.scrollTop + "px";
          popupContainer.classList.add("popup-fade-in-up");
          popup.style.padding = `${triangleSize}px 0 0`;
          // Create a triangle on top.
          popup.style.clipPath = `polygon(0 ${triangleSize}px, ${mouseX - leftPosition - triangleSize}px ${triangleSize}px, ${mouseX - leftPosition}px 0, ${mouseX - leftPosition + triangleSize}px ${triangleSize}px, 100% ${triangleSize}px, 100% 100%, 0 100%)`;
        }
      }

      responsePromise.then(response => {
        if (!response) return; // if the fetch was aborted

        popupContent.innerHTML = "";
        const responseDocument = new DOMParser().parseFromString(response, "text/html");
        // Convert to absolute URLs.
        responseDocument.querySelectorAll("a[href]").forEach(link => link.setAttribute("href", link.href));
        let anchoredElement = responseDocument.getElementById(linkAnchor.replace(/ /g, "_"));
        let language = LANGUAGES.get(linkAnchor);

        const popupHeader = document.createElement("div");
        popupHeader.className = "popup-header";
        popupContent.append(popupHeader);

        const iconContainer = document.createElement("span");
        iconContainer.className = "icon";
        popupHeader.append(iconContainer);

        const titleLink = document.createElement("a");
        titleLink.href = link.href;
        titleLink.title = link.title;
        titleLink.className = "preview-headerlink";

        // Scrape entry content.
        if (isWPlink) {
          iconContainer.innerHTML = articleIcon;
          titleLink.textContent = linkTitle.replaceAll("_", " ");
          if (responseDocument.title)
            titleLink.innerHTML = responseDocument.title; // sometimes gives HTML text
          const wikipediaName = LANGUAGES.get(apiDomain.substring(8).split(".")[0]);
          popupHeader.append(`Article Wikipédia en ${wikipediaName} pour `, titleLink);

          const articleContent = document.createElement("div");
          articleContent.style.margin = "5px 0 0 10px";

          const firstSection = responseDocument.querySelector("section");
          if (firstSection && responseDocument.querySelector(`meta[property="mw:pageNamespace"][content="0"]`)) {
            firstSection.querySelectorAll("b").forEach(boldElem => boldElem.outerHTML = boldElem.innerHTML);
            firstSection.querySelectorAll(":scope > p, :scope > ul, :scope > ol").forEach(elem => articleContent.append(elem));
          }
          if (articleContent.childElementCount)
            popupContent.append(articleContent);
        } else {
          const hasDefinitions = elem => !!elem.querySelector("ol:not(.references)");
          iconContainer.innerHTML = definitionIcon;

          // Try to guess the anchor target in the following order: French, Translingual, [first h2 on page]
          // Always prioritize an L2 section which contains definitions.
          if (!linkAnchor) {
            let pageH2s = Array.from(responseDocument.querySelectorAll("h2 > span"));
            if (pageH2s.some(h2 => hasDefinitions(h2.parentElement.parentElement)))
              pageH2s = pageH2s.filter(h2 => hasDefinitions(h2.parentElement.parentElement));

            anchoredElement = pageH2s.find(h2 => h2.id === "fr");
            if (!anchoredElement) anchoredElement = pageH2s.find(h2 => h2.id === "conv");
            if (!anchoredElement) anchoredElement = pageH2s[0];
            language = LANGUAGES.get(anchoredElement.id);
          }

          const displayTitle = document.createElement("strong");
          displayTitle.textContent = linkTitle.split("/").pop().replaceAll("_", " ");

          // Find localest section containing an h2.
          let languageSection = anchoredElement;
          while (languageSection && !languageSection.querySelector(":scope > h2"))
            languageSection = languageSection.parentElement.closest("section");

          // Make sure that the entry is well-formed.
          if (languageSection) {
            let scrapeSection = anchoredElement.closest("section");
            // Find localest section which contains any definitions.
            while (scrapeSection && !hasDefinitions(scrapeSection))
              scrapeSection = scrapeSection.parentElement.closest("section");

            if (scrapeSection) {
              const ols = scrapeSection.querySelectorAll(":scope > ol:not(.references), section > ol:not(.references)");

              for (const ol of ols) {
                const posContainer = document.createElement("div");
                posContainer.style.margin = "8px 0 5px 0";

                const pos = document.createElement("span");
                pos.style = "font-size: 110%; font-weight: bold";
                pos.textContent = ol.closest("section").firstChild.textContent;
                posContainer.append(pos);

                popupContent.append(posContainer, ol);
              }
            }
            titleLink.append(displayTitle);
            if (language)
              popupHeader.append("Aperçu des définitions en " + language + " de ", titleLink);
            else
              popupHeader.append("Aperçu des définitions de ", titleLink);
          } else {
            titleLink.append(displayTitle);
            popupHeader.append("Aperçu des définitions de ", titleLink);
          }
        }

        if (popupContent.childElementCount > 1) {
          // Clean up HTML.
          popupContent.querySelectorAll("link, .previewonly, .maintenance-line, .mw-empty-elt, .reference, .Inline-Template").forEach(elem => elem.remove());
          if (!isWPlink)
            popupContent.querySelectorAll("li > ul").forEach(elem => elem.remove()); // remove quotations
          for (const elem of popupContent.querySelectorAll("*"))
            elem.removeAttribute("id"); // avoid inadvertently repeating IDs within a page
        } else if (isWPlink) {
          // Display a message if the Wikipedia article was invalid or not in mainspace.
          const noArticle = document.createElement("div");
          noArticle.style = "margin: 5px 0 0 15px; font-size: 90%";
          noArticle.textContent = "(aperçu indisponible)";
          popupContent.append(noArticle);
        } else if (linkAnchor && !anchoredElement) {
          // Display a message if the anchor is invalid.
          const noSectionFound = document.createElement("div");
          noSectionFound.style = "margin: 10px 0 0 7.5px; font-size: 90%";
          const strong = document.createElement("strong");
          if (language) {
            strong.textContent = language;
            noSectionFound.append("La section en ", strong, " n’existe pas dans cette page.");
          } else {
            strong.textContent = linkAnchor;
            noSectionFound.append("La section ", strong, " n’existe pas dans cette page.");
          }
          popupContent.append(noSectionFound);
        } else {
          // Display a message if no definitions were found in the section.
          const noDefinitionsFound = document.createElement("div");
          noDefinitionsFound.style = "margin: 5px 0 0 15px; font-size: 90%";
          noDefinitionsFound.textContent = "(aucune définition n’a été trouvée)";
          popupContent.append(noDefinitionsFound);
        }

        // Reduce the padding if a scrollbar is present. The intended padding is 16px on each side.
        if (width - popupHeader.clientWidth > 32)
          popupContent.style.paddingRight = Math.max(4, 48 + popupHeader.clientWidth - width) + "px";
      });
      // (Hack?) make sure that `link pointerleave` doesn't cause the popup to immediately close.
      setTimeout(() => clearTimeout(popupTimer), 0);
    }, isPreviewLink ? 1200 : 400);
  });

  link.addEventListener("pointerout", () => {
    clearTimeout(popupTimer);
    if (link === openLink) {
      popupTimer = setTimeout(closePopup, 300);
    } else {
      apiController.abort();
      apiController = new AbortController();
    }
  });

  link.addEventListener("pointermove", event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  link.addEventListener("click", () => clearTimeout(popupTimer));
}

document.querySelectorAll("a").forEach(processLink);

// Process links which are added to the DOM after the gadget has run.
const mo = new MutationObserver(events => events.forEach(event => event.addedNodes.forEach(node => {
  if (node instanceof Element) {
    if (node.tagName === "A")
      processLink(node);
    node.querySelectorAll("a").forEach(processLink);
  }
})));
mo.observe(document.body, { childList: true, subtree: true });

// </nowiki>
