/**
 * Outils pour réverter
 *
 * [[Catégorie:JavaScript du Wiktionnaire|RevertDiff.js]]
 * fournit des liens dans les pages de diff pour révoquer facilement une modification et avertir son auteur
 *
 * Auteurs : Lorian (en), Chphe (fr)
 * Dernière révision : 9 novembre 2013
 * {{w:Projet:JavaScript/Script|RevertDiff}}
 */
//<nowiki>

var RevertDiffParams = new Object();

RevertDiffParams.Text = new Object();
RevertDiffParams.Text.Revert = "Annuler";
RevertDiffParams.Text.RevertResume = 'Révocation des modifications de [[Special:Contributions/$2|$2]] (retour à la précédente version de [[Special:Contributions/$1|$1]])';
RevertDiffParams.Text.Message = "Message";
RevertDiffParams.Text.MessageAlert = 'Quel message faut-il laisser ?';
RevertDiffParams.Text.Warn = "Avertir";


RevertDiffParams.Warn = [
  {urlparam: "warn=01", text: "Débutant", template: '{{subst:Débutant}}~~' + '~~'},
  {urlparam: "warn=02", text: "Vandale1", template: '{{subst:Vandale}}~~' + '~~'},
  {urlparam: "warn=03", text: "Vandale2", template: '{{subst:Vandale2}}~~' + '~~'},
  {urlparam: "warn=04", text: "Vandale3", template: '{{subst:Vandale3}}~~' + '~~'},
  {urlparam: "warn=05", text: "Copyvio", template: '{{subst:Copyvio}}~~' + '~~'},
  {urlparam: "warn=06", text: "Spam", template: '{{subst:Spam}}~~' + '~~'},
  {urlparam: "warn=07", text: "Bienvenue", template: '{{subst:Bienvenue}}~~' + '~~'},
  {urlparam: "warn=08", text: "MerciIP", template: '{{subst:Merci IP}}~~' + '~~'}
];


function getURLParameters(x) {
  var questionMark = x.indexOf('?');
  if (questionMark == -1) return {};
  var fieldsArray = x.substr(questionMark + 1).split('&');
  var fields = {};
  for (var i = 0; i < fieldsArray.length; i++) {
    var field = fieldsArray[i];
    var equal = field.indexOf('=');
    if (equal == -1) {
      fields[decodeURIComponent(field)] = '';
    }
    else {
      fields[decodeURIComponent(field.substr(0, equal))] =
          decodeURIComponent(field.substr(equal + 1));
    }
  }
  return fields;
}

_GET = getURLParameters(location.href);

function getMessage(chemin, where, user1, user2) {
  var message = prompt(RevertDiffParams.Text.MessageAlert, '');
  if (message) {
    window.location = chemin + '&' + where + '=2&user1=' + user1 + '&user2=' + user2 + '&message=' + message;
  }
}

window.getMessage = getMessage;

$(document).ready(function () {
  if (location.href.match(/diff=/)) {
    // Get username of submitter
    var user1TD = $('td.diff-otitle')[0];
    var user2TD = $('td.diff-ntitle')[0];
    if (!user1TD || !user2TD) return;

    // Récupération du chemin vers la version à rétablir
    var chemin = encodeURI(user1TD.getElementsByTagName('a')[1].href);

    var user1 = $(user1TD).find('a.mw-userlink').first().text();
    var user2 = $(user2TD).find('a.mw-userlink').first().text();

    var Revert = '('
        + '<a href="' + chemin + '&revert=1&user1=' + user1 + '&user2=' + user2 + '">' + RevertDiffParams.Text.Revert + '</a>'
        + ' / '
        + '<a href="javascript:getMessage(\'' + chemin + '\',\'revert\',\'' + user1 + '\',\'' + user2 + '\');">' + RevertDiffParams.Text.Message + '</a>'
        + ')';

    var Warn = '(' + RevertDiffParams.Text.Warn + ' : ';
    var SiteURL = mw.config.get('wgServer') + mw.config.get('wgScript') + '?title=';
    for (var a = 0, l = RevertDiffParams.Warn.length; a < l; a++) {
      if (a !== 0) Warn += ' / ';
      Warn += '<a href="' + SiteURL + 'User_talk:' + user2 + '&action=edit&section=new'
          + '&' + RevertDiffParams.Warn[a].urlparam + '" '
          + 'title="' + RevertDiffParams.Warn[a].template + '" '
          + '>' + RevertDiffParams.Warn[a].text + '</a>';
    }
    Warn += ')';
    document.getElementById('contentSub').innerHTML = Revert + " " + Warn;

  }
  else if (location.href.match(/revert=1/)) {
    document.getElementById('wpSummary').value = RevertDiffParams.Text.RevertResume.split("$1").join(_GET['user1']).split("$2").join(_GET['user2']);
    document.getElementById('editform').submit();
  }
  else if (location.href.match(/revert=2/)) {
    document.getElementById('wpSummary').value =
        RevertDiffParams.Text.RevertResume.split("$1").join(_GET['user1']).split("$2").join(_GET['user2']) + ' : ' + _GET['message'];
    document.getElementById('editform').submit();
  }
  else {
    for (var a = 0, l = RevertDiffParams.Warn.length; a < l; a++) {
      var Warn = RevertDiffParams.Warn[a];
      if (location.href.match(new RegExp(Warn.urlparam))) {
        document.getElementById('wpTextbox1').value = Warn.template;
        document.getElementById('editform').submit();
      }
    }
  }
});
//</nowiki>
