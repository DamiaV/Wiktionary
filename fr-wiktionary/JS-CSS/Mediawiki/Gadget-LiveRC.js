//[[Catégorie:JavaScript du Wiktionnaire|LiveRC.js]]
//<source lang="javascript">//<pre>//<nowiki>

function LiveRC_getSiteCustom() {


  // -- Paramètres de LiveRC --

  try {
    lrcSetConfigSetting("lrcParams", "Language", 'fr');
    lrcSetConfigSetting("lrcParams", "PageTitle", 'Wiktionnaire:LiveRC');
    lrcSetConfigSetting("lrcParams", "SandboxPage", 'Wiktionnaire:Bac à sable');
    lrcSetConfigSetting("lrcParams", "CommonsURL", '//upload.wikimedia.org/wikipedia/commons/');
    lrcSetConfigSetting("lrcParams", "SearchURL", 'https://duckduckgo.com/?q=$1');
    lrcSetConfigSetting("lrcParams", "TchatURL", 'https://webchat.freenode.net/?nick=$2&channels=$1');
    lrcSetConfigSetting("lrcParams", "TchatChannel", '#wikipedia-fr-liverc');
    lrcSetConfigSetting("lrcParams", "WhoisURL", 'http://whois.domaintools.com/$1');
    lrcSetConfigSetting("lrcParams", "MiniPreviewHeight", '250px');
    lrcSetConfigSetting("lrcParams", "PreviewWindowHeight", '250px');
    lrcSetConfigSetting("lrcParams", "HistoryWindowHeight", '250px');
    lrcSetConfigSetting("lrcParams", "SearchWindowHeight", '250px');
    lrcSetConfigSetting("lrcParams", "TchatWindowHeight", '350px');
    lrcSetConfigSetting("lrcParams", "FollowWindowHeight", '100px');
    lrcSetConfigSetting("lrcParams", "TZ", '00:00');
    lrcSetConfigSetting("lrcParams", "InterwikiList", '');
    lrcSetConfigSetting("lrcParams", "RCLimit", 50);
    lrcSetConfigSetting("lrcParams", "Refresh", 10);
    lrcSetConfigSetting("lrcParams", "ArticleLengthLimit", 0);
    lrcSetConfigSetting("lrcParams", "UserLengthLimit", 0);
    lrcSetConfigSetting("lrcParams", "MinYellowWatchers", 5);
    lrcSetConfigSetting("lrcParams", "MinGreenWatchers", 10);
    lrcSetConfigSetting("lrcParams", "BoldComments", false);
    lrcSetConfigSetting("lrcParams", "ShowArticleLength", true);
    lrcSetConfigSetting("lrcParams", "ShowUserInfos", false);
    lrcSetConfigSetting("lrcParams", "ShowPreviewOnTop", false);
    lrcSetConfigSetting("lrcParams", "LoadUsersInGroupsList", true);
    lrcSetConfigSetting("lrcParams", "LoadWatchlist", true);
    lrcSetConfigSetting("lrcParams", "LoadIPCat", true);
    lrcSetConfigSetting("lrcParams", "LoadLastBlocks", true);
    lrcSetConfigSetting("lrcParams", "GetPageInfos", true);
    lrcSetConfigSetting("lrcParams", "GetFileInfos", true);
    lrcSetConfigSetting("lrcParams", "GetWikidataInfos", false);
    lrcSetConfigSetting("lrcParams", "UseMiniDiff", false);
    lrcSetConfigSetting("lrcParams", "ShowNotifications", true);
    lrcSetConfigSetting("lrcParams", "ShowInterwikiList", true);
    lrcSetConfigSetting("lrcParams", "InterwikiPreviewEnabled", true);
    lrcSetConfigSetting("lrcParams", "KeepAllLines", false);
    lrcSetConfigSetting("lrcParams", "InvertUpdate", false);
    lrcSetConfigSetting("lrcParams", "AutoCloseDiff", false);
    lrcSetConfigSetting("lrcParams", "PreloadLines", true);
    lrcSetConfigSetting("lrcParams", "SubstWarnings", true);
    lrcSetConfigSetting("lrcParams", "BypassWatchdefault", true);
    lrcSetConfigSetting("lrcParams", "DefaultTargetPage", 'MediaWiki:Gadget-LiveRC.js/i18n/$LANG$.js');
    lrcSetConfigSetting("lrcParams", "DiffExtensionShowConfigPanel", true);
    lrcSetConfigSetting("lrcParams", "MostModifiedPagesRun", true);
    lrcSetConfigSetting("lrcParams", "MostModifiedPagesDelay", 1);
    lrcSetConfigSetting("lrcParams", "MostModifiedPagesUserLimit", 4);
    lrcSetConfigSetting("lrcParams", "MostModifiedPagesRevertLimit", 2);
    lrcSetConfigSetting("lrcParams", "lrcXUWShowEditcount", true);
    lrcSetConfigSetting("lrcParams", "lrcXUWShowWarnings", true);
    lrcSetConfigSetting("lrcParams", "lrcXUWColorNoTalk", '');
    lrcSetConfigSetting("lrcParams", "lrcXUWColorRecentTalk", '');
    lrcSetConfigSetting("lrcParams", "lrcXUWColorRecentWarning", '');
    lrcSetConfigSetting("lrcParams", "lrcXUWDelay", 24);
    lrcSetConfigSetting("lrcParams", "AFRDFH_RequestPage", 'Wikipédia:Demandes de purge d\'historique');
    lrcSetConfigSetting("lrcParams", "AFRDFH_Template", 'Wikipédia:LiveRC/Modèles/Demande de purge d\'historique|page=$page|url=$url|raison=$reason');
    lrcSetConfigSetting("lrcParams", "AFRDFH_ReasonInputSize", 35);
    lrcSetConfigSetting("lrcParams", "AFRDFH_UseOutOfLiveRC", true);
  }
  catch (e) {
  }


  // -- Options au démarrage de LiveRC --

  try {
    lrcSetConfigSetting("lrcOptionMenuValues", "LiveRCDisplayed", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "LiveRCRCTableDisplayed", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "LiveRCTchatDisplayed", false);
    lrcSetConfigSetting("lrcOptionMenuValues", "LiveRCPreviewDisplayed", false);
    lrcSetConfigSetting("lrcOptionMenuValues", "LiveRCFollowDisplayed", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "DisplayDebug", false);
    lrcSetConfigSetting("lrcOptionMenuValues", "Debug_Ajax", false);
    lrcSetConfigSetting("lrcOptionMenuValues", "Debug_Errors", false);
    lrcSetConfigSetting("lrcOptionMenuValues", "Stop", false);
    lrcSetConfigSetting("lrcOptionMenuValues", "Diff", false);
    lrcSetConfigSetting("lrcOptionMenuValues", "RC", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "RC_edit", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "RC_minor", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "RC_new", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "RC_external", false);
    lrcSetConfigSetting("lrcOptionMenuValues", "Log", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "WL_watched", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "WL_unwatched", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "Tags", false);
    lrcSetConfigSetting("lrcOptionMenuValues", "NS", false);
    lrcSetConfigSetting("lrcOptionMenuValues", "User", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "User_IP", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "User_REGISTRED", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "User_NEWBIE", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "User_AUTOPATROLLED", false);
    lrcSetConfigSetting("lrcOptionMenuValues", "User_HideOwnSubpage", false);
    lrcSetConfigSetting("lrcOptionMenuValues", "User_ShowAllSelf", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "User_ShowAllContact", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "User_ShowAllWatchlist", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "User_ShowAllRevert", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "User_ShowAllBlanking", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "User_ShowAllReplaced", true);
    lrcSetConfigSetting("lrcOptionMenuValues", "showCatRC", false);
  }
  catch (e) {
  }


  // -- Résumés de blanchiment --

  try {
    lrcSetConfigSetting("lstBlank", false, [
      {'tooltip': 'copyvio', 'resume': 'Copyvio'},
      {'tooltip': 'CAA', 'resume': '[[WT:CAA|critères d’admissibilité non atteints]]'},
      {'tooltip': 'non encyclo', 'resume': 'non lexicographique en l’état'},
      {'tooltip': 'BaS', 'resume': 'bac à sable'},
      {'tooltip': 'vandalisme', 'resume': 'vandalisme'}
    ]);
  }
  catch (e) {
  }


  // -- Résumés de révocation --

  try {
    lrcSetConfigSetting("lrcRevertMessages", false, [
      {'resume': '[[WT:Bac à sable|Bac à sable]]', 'text': 'Bac à sable'},
      {'resume': '[[WT:Vandalisme|Vandalisme]]', 'text': 'Vandalisme'},
      {'resume': 'Retrait d’information non sourcée', 'text': 'Non-sourcé'},
      {'resume': 'Traduction automatique', 'text': 'Trad auto'}
    ]);
  }
  catch (e) {
  }


  // -- Modèles d’avertissement --

  try {
    lrcSetConfigSetting("lstAverto", false, [
      {'template': 'Débutant', 'string': 'Débutant', 'hasPage': false, 'addName': false, 'addSectionTitle': false},
      {'template': 'Vandale', 'string': 'Vandale', 'hasPage': false, 'addName': false, 'addSectionTitle': false},
      {'template': 'Vandale2', 'string': 'Vandale2', 'hasPage': true, 'addName': false, 'addSectionTitle': false},
      {'template': 'Vandale3', 'string': 'Vandale3', 'hasPage': false, 'addName': false, 'addSectionTitle': false},
      {'template': 'Spam', 'string': 'Spam', 'hasPage': true, 'addName': false, 'addSectionTitle': false},
      {'template': 'Copyvio', 'string': 'Copyvio', 'hasPage': true, 'addName': false, 'addSectionTitle': false},
      {'template': 'Bienvenue', 'string': 'Bienvenue', 'hasPage': false, 'addName': false, 'addSectionTitle': false},
      {'template': 'Merci IP', 'string': 'Merci IP', 'hasPage': false, 'addName': false, 'addSectionTitle': false},
      {'template': 'T’inscrire', 'string': 'T’inscrire', 'hasPage': false, 'addName': false, 'addSectionTitle': false},
    ]);
  }
  catch (e) {
  }


  // -- Modèles de bandeaux --

  try {
    lrcSetConfigSetting("lstBando", false, [
      {'template': 'formater', 'string': 'formater', 'withDate': ''},
      {'template': 'ébauche', 'ébauche': 'copyvio', 'withDate': ''},
    ]);
  }
  catch (e) {
  }


  // -- Paramètres pour l’outil de signalement --

  try {
    lrcSetConfigSetting("lstReport", false, [
      /* { 'userright' : 'delete' , 'text' : 'REPORTING_DELETION' , 'page' : 'Wikipédia:Demande de suppression immédiate' , 'template' : 'Wikipédia:LiveRC/Modèles/Demande de suppression' , 'parampage' : true , 'paramuser' : false , 'resume' : '[[:$1]]' , 'reasonsdropdownname' : 'deletereason-dropdown' },
       { 'userright' : 'protect' , 'text' : 'REPORTING_PROTECTION' , 'page' : 'Wikipédia:Demande de protection de page' , 'template' : 'Wikipédia:LiveRC/Modèles/Demande de protection' , 'parampage' : true , 'paramuser' : false , 'resume' : '{{a-court|$1}}' , 'reasonsdropdownname' : 'protect-dropdown' },
       { 'userright' : 'block' , 'text' : 'REPORTING_BLOCK' , 'page' : 'Wikipédia:Vandalisme en cours' , 'template' : 'Wikipédia:LiveRC/Modèles/Demande de blocage' , 'parampage' : false , 'paramuser' : true , 'resume' : 'Demande de blocage : [[User:$2|$2]]' , 'reasonsdropdownname' : 'ipbreason-dropdown' },
       { 'userright' : 'anyRight' , 'text' : 'REPORTING_HELP' , 'page' : 'Wikipédia:Forum des nouveaux' , 'template' : 'Wikipédia:LiveRC/Modèles/Nouveau ayant besoin d\'aide' , 'parampage' : false , 'paramuser' : true , 'resume' : 'Demande d\'aide pour un nouveau : [[User:$2|$2]]' , 'reasonsdropdownname' : '' }
   */]);
  }
  catch (e) {
  }


  // -- Icônes utilisées par LiveRC --

  try {
    lrcSetConfigSetting("lrcIcons", "AdQIcon", {
      'type': 1,
      'src': 'thumb/c/c7/Fairytale_bookmark_gold.png/10px-Fairytale_bookmark_gold.png',
      'width': 10,
      'height': 10
    });
    lrcSetConfigSetting("lrcIcons", "APDQIcon", {
      'type': 1,
      'src': 'thumb/e/e0/Fairytale_bookmark_half_gold_silverlight_question.png/10px-Fairytale_bookmark_half_gold_silverlight_question.png',
      'width': 10,
      'height': 10
    });
    lrcSetConfigSetting("lrcIcons", "BAIcon", {
      'type': 1,
      'src': 'thumb/0/08/Fairytale_bookmark_silver.png/10px-Fairytale_bookmark_silver.png',
      'width': 10,
      'height': 10
    });
    lrcSetConfigSetting("lrcIcons", "HomonIcon", {
      'type': 0,
      'src': 'thumb/7/72/Disambig.svg/16px-Disambig.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "StubIcon", {
      'type': 0,
      'src': 'thumb/a/a6/Construction_cone.png/16px-Construction_cone.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "PaSIcon", {
      'type': 0,
      'src': 'thumb/9/9e/Icono_consulta_borrar.png/16px-Icono_consulta_borrar.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "CopyrightIcon", {
      'type': 0,
      'src': 'thumb/b/b0/Copyright.svg/16px-Copyright.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "RecentIcon", {
      'type': 0,
      'src': 'thumb/1/19/Ambox_currentevent.svg/16px-Ambox_currentevent.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "R3RIcon", {
      'type': 0,
      'src': 'thumb/b/bc/R3R.svg/16px-R3R.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "WIPIcon", {
      'type': 0,
      'src': 'thumb/6/6a/Under_construction_icon-orange.svg/16px-Under_construction_icon-orange.svg.png',
      'width': 16,
      'height': 13
    });
    lrcSetConfigSetting("lrcIcons", "LockIcon", {
      'type': 0,
      'src': 'thumb/e/e0/Padlock-gold.svg/16px-Padlock-gold.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "FullLockIcon", {
      'type': 0,
      'src': 'thumb/4/48/Padlock-red.svg/16px-Padlock-red.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "TrackingCategoriesIcon", {
      'type': 0,
      'src': '4/49/Error.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "Watchers0Icon", {
      'type': 0,
      'src': 'thumb/b/b5/Webroot_Spy_Sweeper_%28red%29.png/12px-Webroot_Spy_Sweeper_%28red%29.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "Watchers1Icon", {
      'type': 0,
      'src': 'thumb/4/48/Webroot_Spy_Sweeper_%28orange%29.png/12px-Webroot_Spy_Sweeper_%28orange%29.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "Watchers2Icon", {
      'type': 0,
      'src': 'thumb/5/5b/Webroot_Spy_Sweeper.png/12px-Webroot_Spy_Sweeper.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "Watchers3Icon", {
      'type': 0,
      'src': 'thumb/0/01/Webroot_Spy_Sweeper_%28green%29.png/12px-Webroot_Spy_Sweeper_%28green%29.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "RedirectIcon", {
      'type': 0,
      'src': 'thumb/7/71/Symbol_redirect_arrow_with_gradient.svg/16px-Symbol_redirect_arrow_with_gradient.svg.png',
      'width': 16,
      'height': 10
    });
    lrcSetConfigSetting("lrcIcons", "ExternalIcon", {
      'type': 0,
      'src': 'thumb/e/e4/Wikidata-logo_S.svg/16px-Wikidata-logo_S.svg.png',
      'width': 16,
      'height': 9
    });
    lrcSetConfigSetting("lrcIcons", "FlowIcon", {
      'type': 0,
      'src': 'thumb/6/64/Talk_page_icon_crystal.png/16px-Talk_page_icon_crystal.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "AbusefilterIcon", {
      'type': 0,
      'src': 'thumb/7/78/Nuvola_apps-agent_and_Icon_tools_red.png/16px-Nuvola_apps-agent_and_Icon_tools_red.png',
      'width': 16,
      'height': 13
    });
    lrcSetConfigSetting("lrcIcons", "AbuselogIcon", {
      'type': 0,
      'src': 'thumb/5/5e/Nuvola_apps_agent.svg/16px-Nuvola_apps_agent.svg.png',
      'width': 16,
      'height': 13
    });
    lrcSetConfigSetting("lrcIcons", "UploadIcon", {
      'type': 0,
      'src': 'thumb/4/47/Gartoon-Gnome-dev-floppy.png/16px-Gartoon-Gnome-dev-floppy.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "ImportIcon", {
      'type': 0,
      'src': 'thumb/a/a0/Document_arrow_green.svg/32px-Document_arrow_green.svg.png',
      'width': 32,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "NewUserIcon", {
      'type': 0,
      'src': 'thumb/c/c1/Crystal_personal.png/16px-Crystal_personal.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "BlockIcon", {
      'type': 0,
      'src': 'thumb/8/8b/B1.svg/16px-B1.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "DeleteIcon", {
      'type': 0,
      'src': 'thumb/e/ef/Editcut.png/16px-Editcut.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "MoveIcon", {
      'type': 0,
      'src': 'thumb/0/0e/Forward.png/16px-Forward.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "ProtectIcon", {
      'type': 0,
      'src': 'thumb/6/64/Crystal_Clear_action_lock3.png/16px-Crystal_Clear_action_lock3.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "articlefeedbackv5Icon", {
      'type': 0,
      'src': 'thumb/b/b6/Gnome_User_Speech.svg/16px-Gnome_User_Speech.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "ThanksIcon", {
      'type': 0,
      'src': 'thumb/7/7d/Heart_icon.svg/16px-Heart_icon.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "RenameuserIcon", {
      'type': 0,
      'src': 'thumb/b/b9/Blue_&_gray_people.png/15px-Blue_&_gray_people.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "RightsIcon", {
      'type': 0,
      'src': 'thumb/0/07/Fairytale_kdmconfig.png/18px-Fairytale_kdmconfig.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "MassMessageIcon", {
      'type': 0,
      'src': 'thumb/b/b3/Nuvola_apps_email-several.png/16px-Nuvola_apps_email-several.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "CheckUserIcon", {
      'type': 0,
      'src': 'thumb/c/cb/Nuvola_search_person.png/16px-Nuvola_search_person.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "OversightIcon", {
      'type': 0,
      'src': 'thumb/2/2c/Icon_delete.svg/16px-Icon_delete.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "ReviewIcon", {
      'type': 0,
      'src': 'thumb/6/66/Copyvio-NormalMagnifier.png/16px-Copyvio-NormalMagnifier.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "StableIcon", {
      'type': 0,
      'src': 'thumb/a/a7/Copyvio-WarningMagnifier.png/16px-Copyvio-WarningMagnifier.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "PagetriageDeletionIcon", {
      'type': 0,
      'src': 'thumb/c/ce/Curation_Bar_Icon_Trash_Blue.png/16px-Curation_Bar_Icon_Trash_Blue.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "PagetriageCurationIcon", {
      'type': 0,
      'src': 'thumb/b/b5/Curation_Bar_Icon_Love_Blue.png/16px-Curation_Bar_Icon_Love_Blue.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "EducationProgramIcon", {
      'type': 0,
      'src': 'thumb/4/47/WIKI_AND_ACADEMIA.PNG/16px-WIKI_AND_ACADEMIA.PNG',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "LiquidThreadsIcon", {
      'type': 0,
      'src': 'thumb/e/e7/FAQ_icon.svg/16px-FAQ_icon.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "TranslateIcon", {
      'type': 0,
      'src': 'thumb/4/40/Icono_de_traducción.svg/16px-Icono_de_traducción.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "OAuthIcon", {
      'type': 0,
      'src': 'thumb/e/e9/Crystal_Clear_Password.png/16px-Crystal_Clear_Password.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "MoodBarIcon", {
      'type': 0,
      'src': 'thumb/7/75/Oxygen480-emotes-face-plain.svg/16px-Oxygen480-emotes-face-plain.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "InterwikiIcon", {
      'type': 0,
      'src': 'thumb/1/19/Interprogetto.png/16px-Interprogetto.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "SharedIPIcon", {
      'type': 0,
      'src': 'thumb/b/b7/WLM_logo.svg/16px-WLM_logo.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "ScolarIPIcon", {
      'type': 0,
      'src': 'thumb/9/98/Crystal_kdmconfig.png/16px-Crystal_kdmconfig.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "OpenProxyIcon", {
      'type': 0,
      'src': 'thumb/0/0a/Crystal_Clear_kdmconfig-danger.png/16px-Crystal_Clear_kdmconfig-danger.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "NewbieIcon", {
      'type': 0,
      'src': 'thumb/c/c1/Crystal_personal.png/16px-Crystal_personal.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "SysopIcon", {
      'type': 0,
      'src': 'thumb/6/61/Gnome-stock_person_admin2.svg/16px-Gnome-stock_person_admin2.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "BotIcon", {
      'type': 0,
      'src': 'thumb/c/c2/Gnome-stock_person_bot.svg/16px-Gnome-stock_person_bot.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "BlockedIcon", {
      'type': 0,
      'src': 'thumb/b/b8/Modern_clock_chris_kemps_01_with_Octagon-warning.svg/16px-Modern_clock_chris_kemps_01_with_Octagon-warning.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "CopyrightUserIcon", {
      'type': 0,
      'src': 'thumb/b/b0/Copyright.svg/16px-Copyright.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "SpamblacklistUserIcon", {
      'type': 0,
      'src': 'thumb/b/b5/Nospam_at.svg/16px-Nospam_at.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "PediaProjectIcon", {
      'type': 0,
      'src': 'thumb/7/79/A13a_French_road_sign.svg/15px-A13a_French_road_sign.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "MinorEditIcon", {
      'type': 0,
      'src': 'thumb/d/d0/M_in_a_Circle.png/12px-M_in_a_Circle.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "RevertIcon", {
      'type': 0,
      'src': 'thumb/2/2c/Nuvola_actions_undo.png/12px-Nuvola_actions_undo.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "ReplacedIcon", {
      'type': 0,
      'src': 'thumb/9/95/Categorie_III.svg/12px-Categorie_III.svg.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "RedirectedIcon", {
      'type': 0,
      'src': 'thumb/7/7f/Redirect_arrow_without_text_(cropped).svg/12px-Redirect_arrow_without_text_(cropped).svg.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "BlankingIcon", {
      'type': 0,
      'src': 'thumb/4/41/Kde_crystalsvg_eraser.png/12px-Kde_crystalsvg_eraser.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "WPCIcon", {
      'type': 0,
      'src': 'thumb/2/2d/Nuvola_web_broom.svg/12px-Nuvola_web_broom.svg.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "AWBIcon", {
      'type': 0,
      'src': 'thumb/b/b4/AWB_logo_draft.png/12px-AWB_logo_draft.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "BandeauxPortailsIcon", {
      'type': 0,
      'src': 'thumb/e/e1/Portal_icon.svg/12px-Portal_icon.svg.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "BandeauxEbauchesIcon", {
      'type': 0,
      'src': 'thumb/3/37/Icon-wrench.png/12px-Icon-wrench.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "HotCatIcon", {
      'type': 0,
      'src': 'thumb/f/fd/Magnify-clip_%28sans_arrow%29.svg/12px-Magnify-clip_(sans_arrow).svg.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "PopupsIcon", {
      'type': 0,
      'src': 'thumb/1/11/Toolbaricon_hiddencomment.png/12px-Toolbaricon_hiddencomment.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "CatRenameIcon", {
      'type': 0,
      'src': 'thumb/5/56/Crystal_Project_2rightarrow.png/12px-Crystal_Project_2rightarrow.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "LRCIcon", {
      'type': 0,
      'src': 'thumb/b/b2/LiveRC.svg/12px-LiveRC.svg.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "TchatButtonIcon", {
      'type': 0,
      'src': 'thumb/7/7a/Mercury_bw.png/25px-Mercury_bw.png',
      'width': 32,
      'height': 32
    });
    lrcSetConfigSetting("lrcIcons", "DebugButtonIcon", {
      'type': 0,
      'src': 'thumb/6/69/Logviewer_bw.png/32px-Logviewer_bw.png',
      'width': 32,
      'height': 32
    });
    lrcSetConfigSetting("lrcIcons", "ConfigButtonIcon", {
      'type': 0,
      'src': 'thumb/2/27/Folder-system.png/32px-Folder-system.png',
      'width': 32,
      'height': 32
    });
    lrcSetConfigSetting("lrcIcons", "LiveRCButtonIcon", {
      'type': 0,
      'src': 'thumb/6/66/Exaile_bw.png/32px-Exaile_bw.png',
      'width': 32,
      'height': 32
    });
    lrcSetConfigSetting("lrcIcons", "RCListButtonIcon", {
      'type': 0,
      'src': 'thumb/7/78/Ethereal.png/25px-Ethereal.png',
      'width': 25,
      'height': 25
    });
    lrcSetConfigSetting("lrcIcons", "PreviewButtonIcon", {
      'type': 0,
      'src': 'thumb/0/05/Preferences-desktop-screensaver.png/25px-Preferences-desktop-screensaver.png',
      'width': 25,
      'height': 25
    });
    lrcSetConfigSetting("lrcIcons", "FollowButtonIcon", {
      'type': 0,
      'src': 'thumb/3/35/Utilities-system-monitor.png/25px-Utilities-system-monitor.png',
      'width': 25,
      'height': 25
    });
    lrcSetConfigSetting("lrcIcons", "HistoryButtonIcon", {
      'type': 0,
      'src': 'thumb/c/c7/File-manager.png/25px-File-manager.png',
      'width': 25,
      'height': 25
    });
    lrcSetConfigSetting("lrcIcons", "LogoIcon", {
      'type': 0,
      'src': 'thumb/2/2d/LiveRC_Ts-for_anim.svg/52px-LiveRC_Ts-for_anim.svg.png',
      'width': 52,
      'height': 32
    });
    lrcSetConfigSetting("lrcIcons", "AnimatedLogoIcon", {
      'type': 0,
      'src': '9/97/LiveRC_Ts-anim1.gif',
      'width': 52,
      'height': 32
    });
    lrcSetConfigSetting("lrcIcons", "FavIcon", {
      'type': 0,
      'src': 'thumb/b/b2/LiveRC.svg/16px-LiveRC.svg.png',
      'width': 16,
      'height': 16
    });
    lrcSetConfigSetting("lrcIcons", "SuggestExistIcon", {
      'type': 0,
      'src': 'thumb/b/be/P_yes.svg/20px-P_yes.svg.png',
      'width': 20,
      'height': 20
    });
    lrcSetConfigSetting("lrcIcons", "SuggestNoExistIcon", {
      'type': 0,
      'src': 'thumb/4/42/P_no.svg/20px-P_no.svg.png',
      'width': 20,
      'height': 20
    });
    lrcSetConfigSetting("lrcIcons", "ProposeTranslationExtensionIcon", {
      'type': 0,
      'src': 'thumb/0/02/Translation_-_Noun_project_987.svg/32px-Translation_-_Noun_project_987.svg.png',
      'width': 32,
      'height': 32
    });
    lrcSetConfigSetting("lrcIcons", "MostModifiedIcon", {
      'type': 0,
      'src': 'thumb/1/16/Co-op_activism4.svg/12px-Co-op_activism4.svg.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "MostRevertedIcon", {
      'type': 0,
      'src': 'thumb/9/98/Tango-grenade.svg/12px-Tango-grenade.svg.png',
      'width': 12,
      'height': 12
    });
    lrcSetConfigSetting("lrcIcons", "EditCount0", {
      'type': 0,
      'src': 'thumb/1/1b/Emblem-person-red.svg/16px-Emblem-person-red.svg.png',
      'width': 14,
      'height': 14
    });
    lrcSetConfigSetting("lrcIcons", "EditCount1", {
      'type': 0,
      'src': 'thumb/2/23/Emblem-person-orange.svg/16px-Emblem-person-orange.svg.png',
      'width': 14,
      'height': 14
    });
    lrcSetConfigSetting("lrcIcons", "EditCount2", {
      'type': 0,
      'src': 'thumb/f/f4/Emblem-person-yellow.svg/16px-Emblem-person-yellow.svg.png',
      'width': 14,
      'height': 14
    });
    lrcSetConfigSetting("lrcIcons", "EditCount3", {
      'type': 0,
      'src': 'thumb/0/06/Emblem-person-green.svg/16px-Emblem-person-green.svg.png',
      'width': 14,
      'height': 14
    });
    lrcSetConfigSetting("lrcIcons", "SpamIcon", {'type': 0, 'src': '9/92/LiveRC_Spam.png', 'width': 14, 'height': 14});
    lrcSetConfigSetting("lrcIcons", "Test0Icon", {
      'type': 0,
      'src': '3/3b/LiveRC_Test0.png',
      'width': 14,
      'height': 14
    });
    lrcSetConfigSetting("lrcIcons", "Test1Icon", {
      'type': 0,
      'src': '5/5d/LiveRC_Test1.png',
      'width': 14,
      'height': 14
    });
    lrcSetConfigSetting("lrcIcons", "Test2Icon", {
      'type': 0,
      'src': '7/78/LiveRC_Test2.png',
      'width': 14,
      'height': 14
    });
    lrcSetConfigSetting("lrcIcons", "Test3Icon", {
      'type': 0,
      'src': '7/7b/LiveRC_Test3.png',
      'width': 14,
      'height': 14
    });
    lrcSetConfigSetting("lrcIcons", "SalebotIcon", {
      'type': 0,
      'src': '3/31/Salebot_small_icon.png',
      'width': 14,
      'height': 14
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_bold", {
      'type': 0,
      'src': 'e/e2/Button_bold.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_italic", {
      'type': 0,
      'src': '1/1d/Button_italic.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_underline", {
      'type': 0,
      'src': 'f/fd/Button_underline.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_strike", {
      'type': 0,
      'src': '3/30/Btn_toolbar_rayer.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_sup", {
      'type': 0,
      'src': '6/6a/Button_sup_letter.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_sub", {
      'type': 0,
      'src': 'a/aa/Button_sub_letter.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_big", {
      'type': 0,
      'src': '8/89/Button_bigger.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_small", {
      'type': 0,
      'src': '0/0d/Button_smaller.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_headline2", {
      'type': 0,
      'src': '7/78/Button_head_A2.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_headline3", {
      'type': 0,
      'src': '4/4f/Button_head_A3.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_headline4", {
      'type': 0,
      'src': '1/14/Button_head_A4.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_headline5", {
      'type': 0,
      'src': '8/8c/Button_head_A5.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_link", {
      'type': 0,
      'src': 'c/c0/Button_link.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_extlink", {
      'type': 0,
      'src': 'e/ec/Button_extlink.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_category", {
      'type': 0,
      'src': 'b/b4/Button_category03.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_template", {
      'type': 0,
      'src': '3/3b/Button_template_alt.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_comment", {
      'type': 0,
      'src': '1/1b/Button_hide_wiki_tag.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_enum", {
      'type': 0,
      'src': '8/88/Btn_toolbar_enum.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_list", {
      'type': 0,
      'src': '1/11/Btn_toolbar_liste.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_image", {
      'type': 0,
      'src': 'd/de/Button_image.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_media", {
      'type': 0,
      'src': '1/19/Button_media.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_gallery", {
      'type': 0,
      'src': '9/9e/Btn_toolbar_gallery.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_math", {
      'type': 0,
      'src': '5/5b/Math_icon.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_nowiki", {
      'type': 0,
      'src': '8/82/Nowiki_icon.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_sign", {
      'type': 0,
      'src': '6/6d/Button_sig.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_hr", {
      'type': 0,
      'src': '0/0d/Button_hr.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_br", {
      'type': 0,
      'src': '1/13/Button_enter.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_redirect", {
      'type': 0,
      'src': 'c/c8/Button_redirect.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_table", {
      'type': 0,
      'src': '0/04/Button_array.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_ref", {
      'type': 0,
      'src': 'c/c4/Button_ref.png',
      'width': 23,
      'height': 23
    });
    lrcSetConfigSetting("lrcIcons", "ToolbarIcon_references", {
      'type': 0,
      'src': '6/64/Buttonrefvs8.png',
      'width': 23,
      'height': 23
    });
  }
  catch (e) {
  }


  // -- Textes non traduisibles --

  try {
    lrcSetConfigSetting("UnTranslatedTexts", "ON_ARTICLE", 'sur');
    lrcSetConfigSetting("UnTranslatedTexts", "UPDATEMESSAGES", 'Mise à jour de la configuration Mediawiki locale');
    lrcSetConfigSetting("UnTranslatedTexts", "MWSiteGlobalLegend", 'Configuration locale de Mediawiki');
    lrcSetConfigSetting("UnTranslatedTexts", "MWGeneralConfigLegend", 'Configuration générale de Mediawiki');
    lrcSetConfigSetting("UnTranslatedTexts", "MWLanguagesLegend", 'Langues supportées');
    lrcSetConfigSetting("UnTranslatedTexts", "MWMessagesLegend", 'Messages système');
    lrcSetConfigSetting("UnTranslatedTexts", "MWExtensionsLegend", 'Extensions Mediawiki');
    lrcSetConfigSetting("UnTranslatedTexts", "MWNamespacesLegend", 'Espaces de noms');
    lrcSetConfigSetting("UnTranslatedTexts", "MWMagicwordsLegend", 'Mots magiques');
    lrcSetConfigSetting("UnTranslatedTexts", "MWInterwikimapLegend", 'Table interwiki');
    lrcSetConfigSetting("UnTranslatedTexts", "MWWikibaseLegend", 'Wikibase');
    lrcSetConfigSetting("UnTranslatedTexts", "MWTagsLegend", 'Balises');
    lrcSetConfigSetting("UnTranslatedTexts", "TAG_RESUME", 'Bandeau');
    lrcSetConfigSetting("UnTranslatedTexts", "USERMSG_RESUME", 'Message');
    lrcSetConfigSetting("UnTranslatedTexts", "EMPTY_RESUME", 'Blanchiment');
    lrcSetConfigSetting("UnTranslatedTexts", "USERTHANK_RESUME", 'Remerciement');
    lrcSetConfigSetting("UnTranslatedTexts", "BLOCKTEMPLATE", 'Blocage');
    lrcSetConfigSetting("UnTranslatedTexts", "RESUMESTART", '[[WP:LRC|LiveRC]] : ');
    lrcSetConfigSetting("UnTranslatedTexts", "Comment", 'Personnalisation pour LiveRC');
    lrcSetConfigSetting("UnTranslatedTexts", "ProposeTranslationResume", 'Mise à jour traductions (langue = $1)');
    lrcSetConfigSetting("UnTranslatedTexts", "CLRCE_resume", 'Mise à jour de la configuration LiveRC locale');
    lrcSetConfigSetting("UnTranslatedTexts", "HC_ResumeScript", '[[Projet:JavaScript/Notices/HotCatsMulti|HotCatsMulti]] : ');
    lrcSetConfigSetting("UnTranslatedTexts", "BP_CommentStart", '[[Projet:JavaScript/Notices/BandeauxPortails|BandeauxPortails]] : ');
    lrcSetConfigSetting("UnTranslatedTexts", "AFRDFH_Resume", '{{a-court|$1}}');
  }
  catch (e) {
  }


  // -- Paramètres pour test selon les commentaires de modification --

  try {
    lrcSetConfigSetting("commenttests", false, [
      {
        'state': 'REVERT',
        'icon': 'RevertIcon',
        'class': 'RcRevert',
        'regex': /(Live|Patrouille)? *(RC)?( : )?Révocation |([Bb]ot : )?[Aa]nnulation des modifications|([Bb]ot : )?[Rr]évocation de |^(Undid|Revert to( the)?) revision|^(Undoing|Reverted( \d+)?) edit|^r(e)?v(ert(ing|ed)?)?\b|^La dernière modification du texte .* a été rejetée/,
        'hide': false
      },
      {
        'state': 'BLANKING',
        'icon': 'BlankingIcon',
        'class': 'RcBlanking',
        'regex': /^Résumé automatique : blanchiment|^[Bb]lanchi|(Live|Patrouille) *(RC)?( : )?Blanchiment/,
        'hide': false
      },
      {
        'state': 'REPLACED',
        'icon': 'ReplacedIcon',
        'class': 'RcReplaced',
        'regex': /^Résumé automatique : contenu remplacé par/,
        'hide': false
      },
      {
        'state': 'REDIRECTED',
        'icon': 'RedirectedIcon',
        'class': 'RcRedirected',
        'regex': /^Page redirigée vers|^#REDIRECT/,
        'hide': false
      },
      {
        'state': 'WPCLEANER',
        'icon': 'WPCIcon',
        'class': 'RcWPC',
        'regex': /(WPCleaner|Correction syntaxique)/,
        'hide': false
      },
      {'state': 'AWB', 'icon': 'AWBIcon', 'class': 'RcAWB', 'regex': /(AWB|AutoWikiBrowser)/, 'hide': false},
      {
        'state': 'B_PORTAIL',
        'icon': 'BandeauxPortailsIcon',
        'class': 'RcBandeauxPortails',
        'regex': /BandeauxPortails/,
        'hide': false
      },
      {
        'state': 'B_EBAUCHE',
        'icon': 'BandeauxEbauchesIcon',
        'class': 'RcBandeauxEbauches',
        'regex': /BandeauxEbauches/,
        'hide': false
      },
      {
        'state': 'HOTCAT',
        'icon': 'HotCatIcon',
        'class': 'RcHotCat',
        'regex': /(HotCatsMulti|HotCat|Hotcat)/,
        'hide': false
      },
      {'state': 'LRC', 'icon': 'LRCIcon', 'class': 'RcLRC', 'regex': /(Live|Patrouille) *(RC)?/, 'hide': false},
      {'state': 'POPUPS', 'icon': 'PopupsIcon', 'class': 'RcPopups', 'regex': /(P|p)opups/, 'hide': false},
      {
        'state': 'CATRENAME',
        'icon': 'CatRenameIcon',
        'class': 'RcCatRename',
        'regex': /Renommage de catégorie/,
        'hide': false
      }
    ]);
  }
  catch (e) {
  }


  // -- Paramètres pour test selon les modèles inclus dans les pages --

  try {
    lrcSetConfigSetting("templatestests", false, [
      {'state': 'PORTAIL', 'icon': '', 'class': 'RcPortail', 'template': 'Méta lien vers portail'},
      {'state': 'RECENT', 'icon': 'RecentIcon', 'class': 'RcRecent', 'template': 'Méta bandeau d\'événement récent'},
      {'state': 'R3R', 'icon': 'R3RIcon', 'class': 'RcR3R', 'template': 'Règle des 3 révocations'},
      {'state': 'PAS', 'icon': 'PaSIcon', 'class': 'RcPaS', 'template': 'Suppression'},
      {'state': 'COPYRIGHT', 'icon': 'CopyrightIcon', 'class': 'RcCopyright', 'template': 'Copie de site'},
      {'state': 'COPYRIGHT', 'icon': 'CopyrightIcon', 'class': 'RcCopyright', 'template': 'Copie à vérifier'},
      {'state': 'COPYRIGHT', 'icon': 'CopyrightIcon', 'class': 'RcCopyright', 'template': 'Copyrighté'},
      {'state': 'COPYRIGHT', 'icon': 'CopyrightIcon', 'class': 'RcCopyright', 'template': 'Texte copyvio'},
      {'state': 'COPYRIGHT', 'icon': 'CopyrightIcon', 'class': 'RcCopyright', 'template': 'Image copyvio'},
      {'state': 'COPYRIGHT', 'icon': 'CopyrightIcon', 'class': 'RcCopyright', 'template': 'Synopsis'},
      {'state': 'WIP', 'icon': 'WIPIcon', 'class': 'RcWIP', 'template': 'En cours'},
      {'state': 'WIP', 'icon': 'WIPIcon', 'class': 'RcWIP', 'template': 'En travaux'}
    ]);
  }
  catch (e) {
  }


  // -- Paramètres pour test selon les catégories de pages --

  try {
    lrcSetConfigSetting("categoriestests", false, [
      {'state': 'ADQ', 'icon': 'AdQIcon', 'class': 'RcADQ', 'regex': /Article de qualité( contesté|)$/},
      {'state': 'BA', 'icon': 'BAIcon', 'class': 'RcBA', 'regex': /Bon article$/},
      {'state': 'APDQ', 'icon': 'APDQIcon', 'class': 'RcAPDQ', 'regex': /Article potentiellement (bon|de qualité)/},
      {'state': 'STUB', 'icon': 'StubIcon', 'class': 'RcStub', 'regex': /Wikipédia:ébauche/},
      {
        'state': 'COPYRIGHT',
        'icon': 'CopyrightIcon',
        'class': 'RcCopyright',
        'regex': /Article soupçonné de travail sous copyright/
      },
      {'state': 'PAS', 'icon': 'PaSIcon', 'class': 'RcPaS', 'regex': /Page proposée à la suppression/}
    ]);
  }
  catch (e) {
  }


  // -- Paramètres pour test selon les catégories d’utilisateurs --

  try {
    lrcSetConfigSetting("watchCategories", false, [
      {'state': 'SCOLARIP', 'icon': 'ScolarIPIcon', 'class': 'RcScolarIP', 'category': 'Adresse IP scolaire'},
      {'state': 'SHAREDIP', 'icon': 'SharedIPIcon', 'class': 'RcSharedIP', 'category': 'Adresse IP partagée'},
      {'state': 'OPENPROXY', 'icon': 'OpenProxyIcon', 'class': 'RcOpenProxy', 'category': 'Proxy ouvert'},
      {
        'state': 'COPYRIGHTUSER',
        'icon': 'CopyrightUserIcon',
        'class': 'RcCopyrightUser',
        'category': 'Utilisateur enfreignant un copyright'
      },
      {
        'state': 'PEDIAPROJECT',
        'icon': 'PediaProjectIcon',
        'class': 'RcPediaProject',
        'category': 'Utilisateur projet pédagogique'
      }
    ]);
  }
  catch (e) {
  }


  // -- Paramètres pour boutons de suppression de lignes --

  try {
    lrcSetConfigSetting("lrcSupprLineParams", false, [
      {'textid': 'HIDE_ALL', 'color': 'red', 'class': '*', 'separator': '|'},
      {'textid': 'HIDE_REVIEWED', 'color': 'rgb(255,235,71)', 'class': 'RcChecked', 'separator': ''},
      {'textid': 'HIDE_REVERTS', 'color': 'rgb(255,99,83)', 'class': 'RcRevert', 'separator': ''},
      {'textid': 'HIDE_NEW', 'color': 'rgb(178,243,113)', 'class': 'RcNew', 'separator': ''},
      {'textid': 'HIDE_BLANKING', 'color': 'white', 'class': 'RcBlanking', 'separator': ''},
      {'textid': 'HIDE_LOG', 'color': 'blue', 'class': 'RcLog', 'separator': ''}
    ]);
  }
  catch (e) {
  }


  // -- Catégories pour le filtrage des RC --

  try {
    lrcSetConfigSetting("LiveRC_defaultCats", false, [
      {'cat': 'Portail:Amérique/Articles liés', 'checked': true},
      {'cat': 'Portail:Cinéma/Articles liés', 'checked': true},
      {'cat': 'Portail:Europe/Articles liés', 'checked': true},
      {'cat': 'Portail:Musique/Articles liés', 'checked': true}
    ]);
  }
  catch (e) {
  }


  // -- Paramètres de l’extension HotCats --

  try {
    lrcSetConfigSetting("lrcHotCatsVariables", "HC_MinoreditState", '1');
    lrcSetConfigSetting("lrcHotCatsVariables", "HC_WatchthisState", 'nochange');
    lrcSetConfigSetting("lrcHotCatsVariables", "HC_docURL", '//fr.wikipedia.org/wiki/Projet:JavaScript/Notices/HotCatsMulti#Fonctionnement');
    lrcSetConfigSetting("lrcHotCatsVariables", "HC_NoCatTemplate", 'À catégoriser');
    lrcSetConfigSetting("lrcHotCatsVariables", "HC_suggestion_delay", 200);
    lrcSetConfigSetting("lrcHotCatsVariables", "HC_list_size", 10);
    lrcSetConfigSetting("lrcHotCatsVariables", "HC_list_items", 50);
    lrcSetConfigSetting("lrcHotCatsVariables", "HC_list_down", false);
    lrcSetConfigSetting("lrcHotCatsVariables", "HC_autocommit", true);
    lrcSetConfigSetting("lrcHotCatsVariables", "HC_AutoMulti", false);
    lrcSetConfigSetting("lrcHotCatsVariables", "HC_ShowLegend", false);
    lrcSetConfigSetting("lrcHotCatsVariables", "HC_ShowInline", false);
    lrcSetConfigSetting("lrcHotCatsVariables", "HC_SkipRecap", false);
  }
  catch (e) {
  }


  // -- Paramètres de l’extension UserWarnings --

  try {
    lrcSetConfigSetting("lrcUserWarningsMessages", false, [
      {'image': 'SpamIcon', 'class': 'RcUWSpam', 'regex': /(S|s)pammeur/},
      {'image': 'Test0Icon', 'class': 'RcUWTest0', 'regex': /(T|t)est ?0/},
      {'image': 'Test1Icon', 'class': 'RcUWTest1', 'regex': /(T|t)est ?1/},
      {'image': 'Test2Icon', 'class': 'RcUWTest2', 'regex': /(T|t)est ?2/},
      {'image': 'Test3Icon', 'class': 'RcUWTest3', 'regex': /(T|t)est ?3/},
      {'image': 'SalebotIcon', 'class': 'RcUWSalebot', 'regex': /^bot : annonce de révocation/}
    ]);
  }
  catch (e) {
  }


  // -- Paramètres de l’extension Toolbar --

  try {
    lrcSetConfigSetting("lrcEditToolBarSetup", false, [
      {'iconid': 'ToolbarIcon_bold', 'before': '\'\'\'', 'sampletext': '', 'after': '\'\'\''},
      {'iconid': 'ToolbarIcon_italic', 'before': '\'\'', 'sampletext': '', 'after': '\'\''},
      {'iconid': 'ToolbarIcon_underline', 'before': '<u>', 'sampletext': '', 'after': '</u>'},
      {'iconid': 'ToolbarIcon_strike', 'before': '<s>', 'sampletext': '', 'after': '</s>'},
      {'iconid': 'ToolbarIcon_sup', 'before': '<sup>', 'sampletext': '', 'after': '</sup>'},
      {'iconid': 'ToolbarIcon_sub', 'before': '<sub>', 'sampletext': '', 'after': '</sub>'},
      {'iconid': 'ToolbarIcon_big', 'before': '<strong>', 'sampletext': '', 'after': '</strong>'},
      {'iconid': 'ToolbarIcon_small', 'before': '', 'sampletext': '', 'after': ''},
      {'iconid': 'ToolbarIcon_headline2', 'before': '== ', 'sampletext': '', 'after': ' =='},
      {'iconid': 'ToolbarIcon_headline3', 'before': '=== ', 'sampletext': '', 'after': ' ==='},
      {'iconid': 'ToolbarIcon_headline4', 'before': '==== ', 'sampletext': '', 'after': ' ===='},
      {'iconid': 'ToolbarIcon_headline5', 'before': '===== ', 'sampletext': '', 'after': ' ====='},
      {'iconid': 'ToolbarIcon_link', 'before': '[[', 'sampletext': '', 'after': ']]'},
      {'iconid': 'ToolbarIcon_extlink', 'before': '[', 'sampletext': '', 'after': ']'},
      {'iconid': 'ToolbarIcon_category', 'before': '[[Category:', 'sampletext': '', 'after': ']]'},
      {'iconid': 'ToolbarIcon_template', 'before': '{{', 'sampletext': '', 'after': '}}'},
      {'iconid': 'ToolbarIcon_comment', 'before': '<!-- ', 'sampletext': '', 'after': ' -->'},
      {
        'iconid': 'ToolbarIcon_enum',
        'before': '\n# élément 1\n# élément 2\n# élément 3',
        'sampletext': '',
        'after': ''
      },
      {
        'iconid': 'ToolbarIcon_list',
        'before': '\n* élément A\n* élément B\n* élément C',
        'sampletext': '',
        'after': ''
      },
      {
        'iconid': 'ToolbarIcon_image',
        'before': '[[File:',
        'sampletext': 'Exemple.jpg',
        'after': '|thumb|Description.]]'
      },
      {
        'iconid': 'ToolbarIcon_media',
        'before': '[[File:',
        'sampletext': 'Exemple.ogg',
        'after': '|thumb|Description.]]'
      },
      {
        'iconid': 'ToolbarIcon_gallery',
        'before': '\n<gallery>\nExemple.jpg|[[Tournesol]]\nExemple1.jpg|[[La Joconde]]\nExemple2.jpg|Un [[hamster]]\n</gallery>\n',
        'sampletext': '',
        'after': ''
      },
      {'iconid': 'ToolbarIcon_math', 'before': '<math>', 'sampletext': '\\rho=\\sqrt{x_0^2+y_0^2}', 'after': '</math>'},
      {'iconid': 'ToolbarIcon_nowiki', 'before': '<nowiki>', 'sampletext': '', 'after': '</nowiki>'},
      {'iconid': 'ToolbarIcon_sign', 'before': '-- ~~~~', 'sampletext': '', 'after': ''},
      {'iconid': 'ToolbarIcon_hr', 'before': '----', 'sampletext': '', 'after': ''},
      {'iconid': 'ToolbarIcon_br', 'before': '<br>', 'sampletext': '', 'after': ''},
      {'iconid': 'ToolbarIcon_redirect', 'before': '#REDIRECT[[', 'sampletext': '', 'after': ']]'},
      {
        'iconid': 'ToolbarIcon_table',
        'before': '{| class="wikitable"\n',
        'sampletext': '|-\n! titre 1\n! titre 2\n! titre 3\n|-\n| rangée 1, case 1\n| rangée 1, case 2\n| rangée 1, case 3\n|-\n| rangée 2, case 1\n| rangée 2, case 2\n| rangée 2, case 3',
        'after': '\n|}'
      },
      {'iconid': 'ToolbarIcon_ref', 'before': '<ref>', 'sampletext': '', 'after': '</ref>'},
      {'iconid': 'ToolbarIcon_references', 'before': '<references />', 'sampletext': '', 'after': ''}
    ]);
  }
  catch (e) {
  }


  // -- Paramètres de l’extension BandeauPortail --

  try {
    lrcSetConfigSetting("lrcBandeauPortailVariables", "BP_MinoreditState", '1');
    lrcSetConfigSetting("lrcBandeauPortailVariables", "BP_WatchthisState", 'nochange');
    lrcSetConfigSetting("lrcBandeauPortailVariables", "BP_suggestion_delay", 200);
    lrcSetConfigSetting("lrcBandeauPortailVariables", "BP_list_size", 5);
    lrcSetConfigSetting("lrcBandeauPortailVariables", "BP_list_items", 10);
    lrcSetConfigSetting("lrcBandeauPortailVariables", "BP_list_down", false);
    lrcSetConfigSetting("lrcBandeauPortailVariables", "BP_ShowInline", false);
    lrcSetConfigSetting("lrcBandeauPortailVariables", "BP_autocommit", true);
    lrcSetConfigSetting("lrcBandeauPortailVariables", "BP_SkipRecap", false);
  }
  catch (e) {
  }


  // -- Paramètres de l’extension LinkOnIcon --

  try {
    lrcSetConfigSetting("LinkOnIconParams", false, [
      {'class': 'PaSIcon', 'page': '$1/Suppression'},
      {'class': 'CopyrightIcon', 'page': '$1/Droit d\'auteur'},
      {'class': 'AdQIcon', 'page': '$1/Article de qualité'},
      {'class': 'APDQIcon', 'page': '$1/Article de qualité'},
      {'class': 'BAIcon', 'page': '$1/Bon article'}
    ]);
  }
  catch (e) {
  }


  // -- Raisons de requête de masquage --

  try {
    lrcSetConfigSetting("lstAskForRevisionReasons", false, [
      {'reason': 'Violation de copyright', 'text': 'copyvio'},
      {'reason': 'Diffamation', 'text': 'diffamation'},
      {'reason': 'Renseignements personnels inappropriés', 'text': 'vie privée'}
    ]);
  }
  catch (e) {
  }


  // -- Affichage/masquage des onglets du menu de configuration --

  try {
    lrcSetConfigSetting("lstParamMenuTabs", "lrcParams", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lrcOptionMenuValues", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lstBlank", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lrcRevertMessages", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lstAverto", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lstBando", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lstReport", false);
    lrcSetConfigSetting("lstParamMenuTabs", "lrcIcons", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lrcTranslatedTexts", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lrcTranslatedParamDesc", true);
    lrcSetConfigSetting("lstParamMenuTabs", "UnTranslatedTexts", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lrcExtensions", false);
    lrcSetConfigSetting("lstParamMenuTabs", "commenttests", true);
    lrcSetConfigSetting("lstParamMenuTabs", "categoriestests", true);
    lrcSetConfigSetting("lstParamMenuTabs", "templatestests", true);
    lrcSetConfigSetting("lstParamMenuTabs", "watchCategories", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lrcSupprLineParams", false);
    lrcSetConfigSetting("lstParamMenuTabs", "ContactListLegend", true);
    lrcSetConfigSetting("lstParamMenuTabs", "HiddenListLegend", true);
    lrcSetConfigSetting("lstParamMenuTabs", "ExtensionsLegend", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lrcCSSstyles", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lrcEditToolBarSetup", true);
    lrcSetConfigSetting("lstParamMenuTabs", "LiveRC_defaultCats", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lrcHotCatsVariables", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lrcUserWarningsMessages", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lrcBandeauPortailVariables", true);
    lrcSetConfigSetting("lstParamMenuTabs", "LinkOnIconParams", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lstAskForRevisionReasons", true);
    lrcSetConfigSetting("lstParamMenuTabs", "lstParamMenuTabs", true);
  }
  catch (e) {
  }


  // -- Paramètres pour la liste des extensions --

  try {
    LiveRC_AddNewExtension({
      "name": 'EditCharactersExtension',
      "url": '//fr.wikipedia.org/w/index.php?title=MediaWiki:Gadget-LiveRC.js/Extensions/EditCharactersExtension.js',
      "neededright": '',
      "desc": 'Améliore la fenêtre de modification avec les fonctions standards du Common.js (caractères spéciaux).'
    });
    LiveRC_AddNewExtension({
      "name": 'RunCommonJS',
      "url": '//fr.wikipedia.org/w/index.php?title=MediaWiki:Gadget-LiveRC.js/Extensions/RunCommonJS.js',
      "neededright": '',
      "desc": 'Améliore la prévisualisation avec des fonctions du Common.js (boîtes déroulantes, palettes, etc...)'
    });
    LiveRC_AddNewExtension({
      "name": 'BandeauPortail',
      "url": '//fr.wikipedia.org/w/index.php?title=MediaWiki:Gadget-LiveRC.js/Extensions/BandeauPortail.js',
      "neededright": '',
      "desc": 'Permet d’ajouter/modifier/retirer un ou plusieurs bandeau de portail lors de la prévisualisation d’un article'
    });
    LiveRC_AddNewExtension({
      "name": 'InserisciTemplate',
      "url": '//fr.wikipedia.org/wiki/MediaWiki:Gadget-LiveRC.js/Extensions/AddComplexTemplateExtension.js',
      "neededright": '',
      "desc": 'Permet d’insérer un modèle d’avertissement paramétré dans une page'
    });
  }
  catch (e) {
  }


  // -- Paramètres de configuration de LiveRC --

  try {
    // -- Modèle pour la catégorisation des pages --
    LiveRC_Config["CustomCatTemplate"] = 'Catégorisation JS';
    // -- URL pour les rapports de bugs --
    LiveRC_Config["BugzillaURL"] = 'https://fr.wikipedia.org/wiki/Discussion MediaWiki:Gadget-LiveRC.js';
    // -- Catégories de suivi --
    LiveRC_Config["TrackingCategories"] = ['expensive-parserfunction-category', 'post-expand-template-argument-category', 'post-expand-template-inclusion-category', 'hidden-category-category', 'broken-file-category', 'node-count-exceeded-category', 'expansion-depth-exceeded-category', 'score-error-category', 'massmessage-list-category', 'commonsmetadata-trackingcategory-no-license', 'commonsmetadata-trackingcategory-no-description', 'commonsmetadata-trackingcategory-no-author', 'commonsmetadata-trackingcategory-no-source', 'geodata-broken-tags-category', 'geodata-unknown-globe-category', 'geodata-unknown-region-category', 'geodata-unknown-type-category', 'scribunto-common-error-category', 'scribunto-module-with-errors-category'];
    // -- IDs à rechercher pour le contenu d’une page --
    LiveRC_Config["PageContentIds"] = ['bodyContent', 'article', 'mw_contentholder'];
    // -- Listes d’utilisateurs locaux par groupe --
    LiveRC_Config["UserGroupList"] = {
      "sysop": {list: [], show: false},
      "bot": {list: [], show: false}
    };
    // -- Limite de versions revertables --
    LiveRC_Config["RevertLimit"] = 10;
    // -- Droits de limitation des fonctions d’édition automatique --
    LiveRC_Config["LimitationsRight"]["Default"] = 'autopatrol';
    LiveRC_Config["LimitationsRight"]["Revert"] = 'autopatrol';
    LiveRC_Config["LimitationsRight"]["Blank"] = 'autopatrol';
    LiveRC_Config["LimitationsRight"]["Tag"] = 'autopatrol';
    LiveRC_Config["LimitationsRight"]["Message"] = 'autopatrol';
    LiveRC_Config["LimitationsRight"]["Thank"] = 'autopatrol';
    LiveRC_Config["LimitationsRight"]["Report"] = 'autopatrol';
    LiveRC_Config["LimitationsRight"]["AskForRevisionDeleteFromHist"] = 'autopatrol';
    // -- Liste des pages où flow est actif --
    LiveRC_Config["FlowOccupyPages"] = ['Discussion Wikipédia:Flow', 'Wikipédia:Forum des nouveaux/Flow'];
    // -- Liste des namespaces où flow est actif --
    LiveRC_Config["FlowOccupyNamespaces"] = [2600];
    // -- Actions permises sur les pages où flow est actif --
    LiveRC_Config["FlowCoreActionWhitelist"] = ['info', 'history', 'protect', 'unprotect', 'unwatch', 'watch'];
  }
  catch (e) {
  }

}


//END PARAMS
//</nowiki></pre></source>

mw.loader.load('//fr.wikipedia.org/w/index.php?title=MediaWiki:Gadget-LiveRC.js&action=raw&ctype=text/javascript', 'text/javascript', false);
