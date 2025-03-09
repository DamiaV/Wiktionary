/** [[Catégorie:JavaScript du Wiktionnaire|DeluxeHistory.js]]
 * Nom : DeluxeHistory
 * Implémentation originale de Dake, basée sur du code Ajax de GôTô
 * Réécriture complète par Dr Brains et Od1n, avec améliorations de Ltrlg
 *
 */

// La dépendance 'user' assure le chargement du common.js utilisateur avant ce script, pour la configuration.

mw.loader.using(['user', 'user.options', 'mediawiki.api', 'mediawiki.storage'], function () {
  $(function ($) {
    'use strict';

    /* jshint sub: true */
    /* globals mw, $ */

    /* eslint dot-notation: "off" */
    /* global mw, $ */

    var botMembers, sysopMembers, patrollerMembers;
    var oldBotMembers = [
      'ArthurBot', 'Bonbot', 'Bot-Jagwar', 'BotdeSki', 'BotMoyogo', 'BotRenard',
      'CaBot', 'CaBot Junior', 'CaBot Senior', 'ChrisaixBot', 'ChuispastonBot',
      'Cjlabot', 'DaftBot', 'DerbethBot', 'Diego Grez Bot', 'Eikubot', 'Eobot',
      'Fenkysbot', 'FtiercelBot', 'GanimalBot', 'Hunbot', 'Interwicket',
      'KamikazeBot', 'KipBot', 'KoxingaBot', 'Luckas-bot', 'Makecat-bot',
      'MenasimBot', 'MglovesfunBot', 'ONKbot', 'OrikriBot', 'PiedBot', 'RobotGMwikt',
      'SpaceBirdyBot', 'VolkovBot', 'WarddrBOT', 'WikitanvirBot', 'Yann Bot'
    ];
    var $content;

    /////////////////////////////////////// LOCALSTORAGE ///////////////////////////////////////

    function storageGet(key) {
      var lastUpdate = mw.storage.get('HistoryDeluxe_' + key + '_lastUpdate');
      if (lastUpdate) {
        // cacheAge ne peut théoriquement pas être négatif, mais si jamais cela arrive (problème d'horloge)
        // le test "cacheAge > 0" permet de ne pas se retrouver avec un cache indéfiniment valide
        var cacheAge = Date.now() - lastUpdate;
        if (cacheAge < 1000 * 3600 * 24 && cacheAge > 0) {
          return mw.storage.get('HistoryDeluxe_' + key);
        }
      }
      return null;
    }

    function storageSet(key, value) {
      mw.storage.set('HistoryDeluxe_' + key, value);
      mw.storage.set('HistoryDeluxe_' + key + '_lastUpdate', Date.now());
    }

    /////////////////////////////////////// RÉCUPÉRATION DE LA LISTE DES BOTS ET SYSOPS ///////////////////////////////////////

    function getUserList(group) {
      var deferred = $.Deferred();
      var members = getStoredUserList(group);
      if (members) {
        deferred.resolve(members);
      }
      else {
        updateUserList(group, deferred);
      }
      return deferred.promise();
    }

    function getStoredUserList(group) {
      var storedValue = storageGet(group);
      return storedValue ? storedValue.split('|') : null;
    }

    function updateUserList(group, deferred, userList, userContinue) {
      if (!userList) {
        userList = [];
      }

      var paramUserGroups = mw.config.get('wgUserGroups');
      var APILimit = paramUserGroups.indexOf('sysop') > -1 || paramUserGroups.indexOf('bot') > -1
          ? 5000 : 500;
      var params = {
        'action': 'query',
        'list': 'allusers',
        'aulimit': APILimit,
        'augroup': group,
      };
      if (userContinue) {
        $.extend(params, userContinue);
      }

      new mw.Api()
          .get(params)
          .done(function (data) {
            data.query.allusers.forEach(function (user) {
              userList.push(user.name);
            });
            if (data['continue']) {
              updateUserList(group, deferred, userList, data['continue']);
            }
            else {
              storageSet(group, userList.join('|'));
              deferred.resolve(userList);
            }
          });
    }

    /////////////////////////////////////// FONCTION DE TRAITEMENT DES LIENS ///////////////////////////////////////

    function userGroupClassName($lis) {
      var nsSpecial = mw.config.get('wgFormattedNamespaces')[-1] + ':';
      var watcherName = mw.config.get('wgUserName');

      function isUserIP(userlink) {
        // Les liens des IP sont de la forme « Spécial:Contributions/<IP> »
        return userlink.title.indexOf(nsSpecial) === 0;
      }

      function getUserClass(userlink) {
        var UserName = userlink.textContent;
        if (UserName === watcherName) {
          return 'UserIs-Self';
        }
        if (botMembers.indexOf(UserName) > -1) {
          return 'UserIs-Bot';
        }
        if (oldBotMembers.indexOf(UserName) > -1) {
          return 'UserIs-OldBot';
        }
        if (sysopMembers.indexOf(UserName) > -1) {
          return 'UserIs-Sysop';
        }
        if (patrollerMembers.indexOf(UserName) > -1) {
          return 'UserIs-Patroller';
        }
        if (isUserIP(userlink)) {
          return 'UserIs-IP';
        }
        return 'UserIs-User';
      }

      // Renvoie 'UserIs-…' si un seul type, 'UserIs-Mixed' sinon (RC "améliorée").
      // Colore les liens vers les utilisateurs pour disposer de la différentiation même si historique mixte.
      function getMultipleClassName(userlinks) {
        var className = '';
        $.each(userlinks, function () {
          var localClassName = getUserClass(this);
          this.classList.add(localClassName);
          if (className === '') {
            className = localClassName;
          }
          else if (className !== localClassName) {
            className = 'UserIs-Mixed';
          }
        });
        return className;
      }

      $lis.each(function () {
        var userlinks = this.getElementsByClassName('mw-userlink');
        if (userlinks.length === 1) {
          this.classList.add(getUserClass(userlinks[0]));
        }
        else if (userlinks.length > 1) {  // groupe des RC "améliorées"
          this.classList.add(getMultipleClassName(userlinks));
        }
      });
    }

    /////////////////////////////////////// FONCTIONS DE PARCOURS DES ÉLÉMENTS ///////////////////////////////////////

    function scan_first_ul() {
      userGroupClassName($content.find('ul').eq(0).find('li'));
    }

    function scan_ul_special_li() {
      userGroupClassName($content.find('ul.special li'));
    }

    function scan_td() {
      userGroupClassName($content.find('td'));
    }

    /////////////////////////////////////// FONCTIONS DE SÉLECTION DES FILTRES ///////////////////////////////////////

    function process_History() {
      userGroupClassName($content.find('#pagehistory, .flow-board-history').find('li'));
    }

    function process_Watchlist() {
      if (mw.user.options.get('usenewrc')) {
        scan_td(); // Liste de suivi "améliorée"
      }
      else {
        scan_ul_special_li(); // Liste de suivi normale
      }
    }

    function process_Recentchanges() {
      if (mw.user.options.get('usenewrc')) {
        scan_td(); // RC "améliorées"
      }
      else {
        scan_ul_special_li(); // RC normales
      }
    }

    function process_Recentchangeslinked() {
      if (mw.user.options.get('usenewrc')) {
        scan_td(); // RC liées "améliorées"
      }
      else {
        scan_ul_special_li(); // RC liées normales
      }
    }

    function process_Newpages() {
      scan_first_ul();
    }

    function process_Log() {
      scan_first_ul();
    }

    function process_AbuseLog() {
      scan_first_ul();
    }

    function process_OtherPages() {
      scan_ul_special_li();
    }

    /////////////////////////////////////// LANCEMENTS ///////////////////////////////////////

    function launch(classesCallback) {
      // si l'état est null, cela signifie que ce gadget n'est plus listé dans les définitions (ou a été renommé sans mettre à jour le nom ici)
      // si l'état est resté sur registered, cela signifie que l'utilisateur charge ce gadget autrement que par le ResourceLoader (importScript(), etc.)
      var state = mw.loader.getState('ext.gadget.DeluxeHistory');
      if (!state || state === 'registered') {
        mw.loader.load('/w/index.php?title=MediaWiki:Gadget-DeluxeHistory.css&action=raw&ctype=text/css', 'text/css');
      }

      var botPromise = getUserList('bot').then(function (members) {
        botMembers = members;
      });

      var sysopPromise = getUserList('sysop').then(function (members) {
        sysopMembers = members;
      });

      var patrollerPromise = getUserList('patroller').then(function (members) {
        patrollerMembers = members;
      });

      $.when(botPromise, sysopPromise, patrollerPromise).then(function () {
        mw.hook('wikipage.content').add(function ($latestContent) {
          $content = $latestContent;
          classesCallback();
        });
      });
    }

    /////////////////////////////////////// INITIALISATION ///////////////////////////////////////

    var action = mw.config.get('wgAction');
    var canonicalSpecialPageName = mw.config.get('wgCanonicalSpecialPageName');

    var enabled = {
      'history': true,
      'watchlist': true,
      'recentchanges': true,
      'recentchangeslinked': true,
      'newpages': true,
      'log': true,
      'abuseLog': true,
      'other': true
    };

    if (typeof DeluxeHistory_Enabled !== 'undefined') {
      $.extend(enabled, DeluxeHistory_Enabled);
    }

    if (action === 'history') {
      if (enabled['history']) {
        launch(process_History);
      }

    }
    else if (canonicalSpecialPageName === 'Watchlist') {
      if (enabled['watchlist']) {
        launch(process_Watchlist);
      }

    }
    else if (canonicalSpecialPageName === 'Recentchanges') {
      if (enabled['recentchanges']) {
        launch(process_Recentchanges);
      }

    }
    else if (canonicalSpecialPageName === 'Recentchangeslinked') {
      if (enabled['recentchangeslinked']) {
        launch(process_Recentchangeslinked);
      }

    }
    else if (canonicalSpecialPageName === 'Newpages') {
      if (enabled['newpages']) {
        mw.loader.addStyleTag('.not-patrolled { text-decoration: underline; }');
        launch(process_Newpages);
      }

    }
    else if (canonicalSpecialPageName === 'Log') {
      if (enabled['log']) {
        launch(process_Log);
      }

    }
    else if (canonicalSpecialPageName === 'AbuseLog') {
      if (enabled['abuseLog']) {
        launch(process_AbuseLog);
      }

    }
    else if ($('#mw-content-text').find('.special').length) {
      if (enabled['other']) {
        launch(process_OtherPages);
      }
    }

  });
});
