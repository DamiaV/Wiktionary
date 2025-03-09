//==========================================================================================
// Création d'une page de flexions en français depuis le lien rouge dans la page principale
// -----------------------------------------------------------------------------------------
// ArséniureDeGallium 2012-11-07
// -----------------------------------------------------------------------------------------
//[[Catégorie:JavaScript du Wiktionnaire|CreerFlexionFr.js]]
//==========================================================================================
//<nowiki>

// TEST
console.log("Gadget-CreerFlexionFr.js");

if ( mw.config.get('wgNamespaceNumber') === 0 ){ CrFlFr_ChangerLiensRouges(); }

//--------------------------------------------------------------------------------------
// Créer les liens vers le gadget
// pour tous les liens rouges dans les infobox de classe "flextable-fr-mfsp"
//--------------------------------------------------------------------------------------
function CrFlFr_ChangerLiensRouges(){
  var genre_pagename;
  // genre du mot de la page courante ? On cherche le mot en gras dans la boite de flexions
  var flextable_vedette = $('.flextable-fr-mfsp .selflink').length;
  if ( flextable_vedette && $('.flextable-fr-mfsp .selflink').first().parents('.flextable-fr-m').length ) {
    genre_pagename = 'm';
  } else if ( flextable_vedette && $('.flextable-fr-mfsp .selflink').first().parents('.flextable-fr-f').length ) {
    genre_pagename = 'f';
  }
  $(".flextable-fr-mfsp .new").each(function() {
    var flex = $(this).text();
    // Une boite de flexions pour noms communs contient deux lemmes différents :
    // celui au masculin et au féminin : on ne colore dans ce cas que les formes
    // du genre correspondant au nom de la page
    var isNomCommun = false;
    var typeDeMot = $(this).parents('.flextable-fr-mfsp').prevAll('h3').first()
        .find('.titredef').text();
    if ( typeDeMot == 'Nom commun' || typeDeMot == 'Locution nominale' ) {
      isNomCommun = true;
    }
    // genre du mot en lien rouge ?
    var genre_lien_rouge;
    if ( $(this).parents('.flextable-fr-m').length ) {
      genre_lien_rouge = 'm';
    } else if ( $(this).parents('.flextable-fr-f').length ) {
      genre_lien_rouge = 'f';
    }
    // On ne surligne pas les liens qui ne sont pas des flexions du mot courant
    // genre_lien_rouge est undefined dans le cas de fr-rég, où le genre n'est pas indiqué dans le tableau de flexions
    if (isNomCommun && (genre_lien_rouge != genre_pagename && genre_lien_rouge !== undefined)) {
      return;
    }
    // sinon on surligne
    $(this).css('background-color','#00ff00');
    $(this).prop('title', 'Cliquez pour créer « ' + flex + ' » avec le gadget');
    $(this).click(function(e) {
      e.preventDefault();
      CrFlFr_CreerFlexion1( flex.replace(/&nbsp;/g, ' ') );
    });
  });
}

//==========================================================================================
var CrFlFr_Mot = "";
var CrFlFr_Flex = "";

//--------------------------------------------------------------------------------------
// Première étape suite à clic :
// * mémoriser les graphies des mots dans les variables globales
// * requête pour obtenir le wikicode de l'article
//--------------------------------------------------------------------------------------
function CrFlFr_CreerFlexion1(flx){

  CrFlFr_Mot = mw.config.get('wgPageName').replace(/_/g," ");
  CrFlFr_Flex = flx;

  // requête pour obtenir le contenu de l'article
  var urlMot =mw.config.get('wgServer') + mw.config.get('wgScript') + '?title=' + encodeURIComponent(CrFlFr_Mot);
  CommonWikt_ajax.http({
    url: urlMot + '&action=raw',
    onSuccess:CrFlFr_CreerFlexion2
  });
}

//--------------------------------------------------------------------------------------
// Deuxième étape suite à clic :
// * récupération du wikicode de l'article
// * calcul du wikicode pour la flexion
// * requête pour ouvrir la page de flexion en édition
//--------------------------------------------------------------------------------------
function CrFlFr_CreerFlexion2(Req,data){

  // récupérer le wikicode
  var codewiki=Req.responseText;
  var codesplit = codewiki.split("\n"); // séparation en lignes individuelles

  // Avorter la création si la page de base ne contient pas le wikicode nécessaire
  if ( ! /== *\{\{langue\|fr\}\} *==/.test(codewiki) ) {
    alert('Pas de section Français reconnue !\nCréation avortée'); return;
  }
  if (! /=== *\{\{S\|(adj|adjectif|nom)\|fr[|}]/.test(codewiki) ) {
    alert('Pas de section Adjectif ou Nom commun reconnue !\nCréation avortée'); return;
  }

  // Générer le code wiki de la nouvelle page en ne conservant que les lignes utiles
  // de l'ancienne (la page principale du mot).
  // Le principe est que l'on doit trouver dans l'ordre :
  // * une section de langue française
  // ** une section de type de mot
  // *** éventuellement une boite de flexions
  // *** une ligne de forme
  // ** éventuellement une autre section de type de mot (retour récursif).
  // * Une autre section de langue arrête tout.
  var status = "wait fr";
  var flex = false;
  var new_codewiki="";
  var mot_inv = false;
  var k;
  var pos;

  //on recherche si {{fr-inv}} est present, auquel cas on ne creera pas la section de nom commun
  for (k=0; k<codesplit.length; k++) {
    mot_inv = /^{\{fr\-inv/.test(codesplit[k]);
    if(mot_inv)
      break;
    if(codesplit[k].indexOf("msing")>0 || codesplit[k].indexOf("fsing")>0) {
      mot_inv = true;
      break;
    }
    if(/{{[mf]}} *{{invar/.test(codesplit[k])) {
      mot_inv = true;
      break;
    }
  }

  for (k=0; k<codesplit.length; k++){

    var sec_qqq = /^==[ ]*\{\{langue/.test(codesplit[k]);
    var sec_fr = /^==[ ]*\{\{langue\|fr\}\}[ ]*==/.test(codesplit[k]);
    var sec_flex = /\|flexion\}\}/.test(codesplit[k]);
    var sec_adj = /^=== *\{\{S\|(adj|adjectif)\|/.test(codesplit[k]);
    var sec_nom = /^===[ ]*\{\{S\|nom\|/.test(codesplit[k]);
    var flex_box = /^\{\{fr-/.test(codesplit[k]);
    var lig_frm = /^'''/.test(codesplit[k]);

    switch (status) {
      case "wait fr" :
        if (sec_fr) {
          new_codewiki = codesplit[k] + "\n";
          status="wait sec mot";
        }
        break;

      case "wait sec mot" :
        if (sec_qqq) { status="fini"; }
        if (sec_flex) { flex = true; } else { flex = false; }
        if (sec_adj) {
          if (flex)
            new_codewiki += codesplit[k] + "\n";
          else
            new_codewiki += codesplit[k].replace(/fr(\|num=\d)?}}/,"fr|flexion$1}}") + "\n";
          status = "wait frm adj";
        }
        if (sec_nom && !mot_inv) {
          if (flex)
            new_codewiki += codesplit[k] + "\n";
          else
            new_codewiki += codesplit[k].replace(/fr(\|num=\d)?}}/,"fr|flexion$1}}") + "\n";
          status = "wait frm nom";
        }
        break;

      case "wait frm adj" :
        var infobox_lig;
        if (sec_qqq) { status="fini"; }
        if (flex_box) {
          new_codewiki += CrFlFr_Infobox(codesplit[k], CrFlFr_Mot) + "\n";
          infobox_lig = codesplit[k];
        }
        if (lig_frm) {

          //on vérifie que le mot sur la ligne de forme est le même que le titre de la page
          if(codesplit[k].indexOf(CrFlFr_Mot) == -1) {
            alert("Le mot vedette sur la ligne de forme ne correspond pas au titre de la page. Création avortée."); return;
          }

          new_codewiki += codesplit[k].replace(CrFlFr_Mot, CrFlFr_Flex)
              .replace("{{m}}", "")
              .replace("{{f}}", "")
              .replace("{{sp}}", "") + "\n";

          var frm_principale = CrFlFr_Mot;
          if (flex) {
            //on essaie de récupérer la forme principale
            //depuis l'infobox en cherchant « |s= » ou « |ms= »
            //si on ne l'a pas trouvé, alors on le cherchera en premier paramètre du modèle
            var trouve = false;
            // Ce regex vérifie la présence de s= ou ms=, que ce soit
            // avant un éventuel paramètre (|) ou en fin de modèle (}})
            var regex = /\|(?:s|ms)=([^|}]+)(?:\||\}\})/;
            trouve = infobox_lig.match(regex);
            if ( trouve ) {
              frm_principale = trouve[1]; // le premier groupe capturé par String.match(regex)
            } else { trouve = false; }
            //si on n'a pas trouvé, alors il s'agit d'un de ces modèles
            //pour lesquels on trouve le radical en premier paramètre
            //*fr-accord-eur
            //*fr-accord-eux
            //*fr-accord-f
            //*fr-accord-oux
            //ou bien d'un modèle basé sur [[Module:fr-flexion]] (cf. ligne suivante)
            var terminaisons_module = ['ain', 'al', 'an', 'at', 'eau', 'el', 'en', 'er', 'et', 'in', 'on'];
            var terminaison = infobox_lig.match(/fr-accord-([^|}]+)[|}]/);
            var radical_gere_par_module = false;
            if (terminaison && terminaisons_module.indexOf(terminaison[1]) != -1) {
              radical_gere_par_module = true;
              alert('Veuillez vérifier le lemme dans la page créée : il n\'est pas bien géré ' +
                  'pour les modèles reposant sur Module:fr-flexion');
            }
            if(trouve===false && !radical_gere_par_module) {
              var radical = infobox_lig.substring(infobox_lig.indexOf("|")+1,infobox_lig.indexOf("|",infobox_lig.indexOf("|")+1));
              var suf = infobox_lig.substring(infobox_lig.indexOf("fr-accord-")+10,infobox_lig.indexOf("|"));
              frm_principale =  radical + suf;
              trouve = true;
            }

            flex = false;
          }

          //*************************************************************//
          //on cherche maintenant à traiter les différents cas possibles
          //*fr-accord-al
          //*fr-accord-ain
          //*fr-accord-an
          //*fr-accord-cons
          //*fr-accord-el
          //*fr-accord-en
          //*fr-accord-er
          //*fr-accord-et
          //*fr-accord-eur
          //*fr-accord-eux
          //*fr-accord-f
          //*fr-accord-in
          //*fr-accord-on
          //*fr-accord-ot
          //*fr-accord-oux
          //*fr-accord-rég
          //*fr-accord-s
          //*fr-accord-un
          //*fr-rég
          //Si aucun de ces cas n'est trouvé alors on utilise un cas général où on laisse l'utilisateur choisir les bons termes.
          //*************************************************************//

          if( /fr-accord-al\|/.test(new_codewiki) )
            new_codewiki = Flex_al(new_codewiki,frm_principale);
          else if( /fr-accord-ain\|/.test(new_codewiki) )
            new_codewiki = Flex_ain(new_codewiki,frm_principale);
          else if( /fr-accord-an\|/.test(new_codewiki) )
            new_codewiki = Flex_an(new_codewiki,frm_principale);
          else if( /fr-accord-el\|/.test(new_codewiki) )
            new_codewiki = Flex_el(new_codewiki,frm_principale);
          else if( /fr-accord-en\|/.test(new_codewiki) )
            new_codewiki = Flex_en(new_codewiki,frm_principale);
          else if( /fr-accord-er\|/.test(new_codewiki) )
            new_codewiki = Flex_er(new_codewiki,frm_principale);
          else if( /fr-accord-et\|/.test(new_codewiki) )
            new_codewiki = Flex_et(new_codewiki,frm_principale);
          else if( /fr-accord-eur\|/.test(new_codewiki) )
            new_codewiki = Flex_eur(new_codewiki,frm_principale);
          else if( /fr-accord-eux\|/.test(new_codewiki) )
            new_codewiki = Flex_eux(new_codewiki,frm_principale);
          else if( /fr-accord-f\|/.test(new_codewiki) )
            new_codewiki = Flex_f(new_codewiki,frm_principale);
          else if( /fr-accord-in\|/.test(new_codewiki) )
            new_codewiki = Flex_in(new_codewiki,frm_principale);
          else if( /fr-accord-on\|/.test(new_codewiki) )
            new_codewiki = Flex_on(new_codewiki,frm_principale);
          else if( /fr-accord-ot\|/.test(new_codewiki) )
            new_codewiki = Flex_ot(new_codewiki,frm_principale);
          else if( /fr-accord-oux\|/.test(new_codewiki) )
            new_codewiki = Flex_oux(new_codewiki,frm_principale);
          else if( /fr-accord-rég\|/.test(new_codewiki) )
            new_codewiki = Flex_reg(new_codewiki,frm_principale);
          else if( /fr-accord-s\|/.test(new_codewiki) )
            new_codewiki = Flex_s(new_codewiki,frm_principale);
          else if( /fr-accord-un\|/.test(new_codewiki) )
            new_codewiki = Flex_un(new_codewiki,frm_principale);
          else if( /fr-accord-cons\|/.test(new_codewiki) ) {
            //on récupère la consonne
            var cons = infobox_lig.substring(infobox_lig.indexOf("|",infobox_lig.indexOf("|")+1)+1,infobox_lig.length-2);
            if(cons.indexOf("ms=")>0)
              cons = cons.substring(0,cons.indexOf("|"));
            new_codewiki = Flex_cons(new_codewiki,frm_principale,cons);
          }
          else if( /fr-rég\|/.test(new_codewiki) )
            new_codewiki = Flex_reg2(new_codewiki,CrFlFr_Mot);
          else
            new_codewiki += Flex_standard(codesplit[k],CrFlFr_Mot);

          status = "wait sec mot";
        }
        break;

      case "wait frm nom" :
        if (sec_qqq) { status="fini"; }
        if (flex_box) {
          new_codewiki += CrFlFr_Infobox(codesplit[k],CrFlFr_Mot) + "\n";
        }
        if (lig_frm) {
          pos = codesplit[k].indexOf("|équiv=");
          // on cherche si le paramètre "équiv" est utilisé. S'il l'est alors on ne garde que
          // le début de la ligne de forme et on rajoute "}}" pour ne garder que {{m}} ou {{f}}
          if( pos>0 )
            codesplit[k] = codesplit[k].substring(0, pos) + codesplit[k].substring(codesplit[k].indexOf("}}",pos));

          pos = codesplit[k].indexOf("{{équiv-pour|");
          // on cherche si le modèle "équi-pourv" est utilisé. S'il l'est alors on le supprime
          // car il n'a pas lieu d'être sur une page de flexion
          if( pos>0 )
            codesplit[k] = codesplit[k].substring(0, pos) + codesplit[k].substring(codesplit[k].indexOf("}}",pos)+2);
          //suppression des espaces multiples qui ont pu apparaitre suite aux remplacements précédents
          codesplit[k] = codesplit[k].replace(/  +/g, ' ');

          //remplacement par la flexion
          var lfm = codesplit[k].replace(CrFlFr_Mot,CrFlFr_Flex);
          //détection du modèle m/f/mf/fm, avec paramètres éventuels ignorés (ils seront supprimés)
          var chc = lfm.match( /\{\{(?:m|f|mf|fm|mf\?)\s*(?:\|[^\}]*)?\}\}/ );
          //si trouvé, garde le modèle de genre mais sans les paramètres
          if (chc) {
            lfm = lfm.replace(/\{\{(m|f|mf|fm|mf\?)\s*\|[^\}]+\}\}/, "{{$1}}"); // suppression éventuelle du code langue pour les modèles de genre
            new_codewiki += lfm + "\n";
          }
          //si pas de modèle de genre, ajoute le modèle "c'est pas bien"
          else if ( lfm.indexOf("{{genre") != -1 ) {
            new_codewiki += lfm + "\n";
          } else {
            new_codewiki += lfm + " {{genre ?|fr}}\n";
          }
          new_codewiki += "# ''Pluriel de'' [[";
          new_codewiki += CrFlFr_Mot + "#fr|" + CrFlFr_Mot + "]].\n\n";
          status = "wait sec mot";
        }
        break;
    }
    if (status=="fini") { break; }  //on ne traite que le français
  }

  //générer clé de tri
  var cle = CommonWikt_CleTri(CrFlFr_Flex);
  if (cle != CrFlFr_Flex) { new_codewiki += "{{clé de tri|" + cle + "}}\n"; }

  //ouvrir la nouvelle page en édition
  var urlFlx =mw.config.get('wgServer') + mw.config.get('wgScript') + "?title=" + encodeURIComponent(CrFlFr_Flex);
  CommonWikt_ajax.http({
    url: urlFlx + "&action=edit",
    text: new_codewiki,
    page_origine: CrFlFr_Mot,
    onSuccess:CrFlFr_CreerFlexion3
  });
}

//--------------------------------------------------------------------------------------
// Troisième étape suite à clic :
// * charger le code wiki dans la zone d'édition
// * rendre la main à l'utilisateur
//--------------------------------------------------------------------------------------
function CrFlFr_CreerFlexion3(Req,data){

  var TexteFinal = data.text;
  while(document.body.firstChild){ document.body.removeChild(document.body.firstChild); }
  document.body.innerHTML = Req.responseText;
  document.getElementById('wpTextbox1').value = TexteFinal;
  document.getElementById('wpSummary').value = "Création avec [[Aide:Gadget-CreerFlexionFr|Gadget-CreerFlexionFr]]" +
      " depuis [[" + data.page_origine + "]]";
}

//==========================================================================================

//--------------------------------------------------------------------------------------
// Vérifie qu'une des formes mp, fs ou fp a été trouvée. Si ce n'est pas le cas,
// on affiche une boite de dialogue pour signaler que le modèle de flexion n'est
// probablement pas le bon.
//--------------------------------------------------------------------------------------
function verifFlexBox(mp, fs, fp){
  if(mp==-1 && fs==-1 && fp==-1)
    alert("Le modèle de flexion ne semble pas correct. Vérifiez le et modifiez le si besoin avant de créer les flexions.");
// il faudrait mettre ici qqchose qui stoppe l'exécution du gadget pour qu'on reste sur la page principale plutôt que d'arriver sur une page de flexion mal remplie.
}
//--------------------------------------------------------------------------------------
// Ajouter le paramètre s= ou ms= à l'infobox
//--------------------------------------------------------------------------------------
function CrFlFr_Infobox(lig,mot){
  var p = lig.lastIndexOf("}}");
  if (p==-1) {
    alert("Les infobox avec le code sur plusieurs lignes ne sont pas gérées.");
    return lig;
  }
  if ( (/fr-rég\|/.test(lig) ||
      /fr-rég-x\|/.test(lig) ||
      /fr-accord-mf\|/.test(lig)) &&
      lig.indexOf("|s=")==-1) {
    return lig.substring(0,p) + "|s=" + mot + "}}";
  } else if ( (/fr-rég/.test(lig)) && lig.indexOf("|s=")==-1) {
    return lig.substring(0,p) + "||s=" + mot + "}}";
  }
  if ( (/fr-accord-rég\|/.test(lig) ||
      /fr-accord-mixte\|/.test(lig) ||
      /fr-accord-s\|/.test(lig) ||
      /fr-accord-cons\|/.test(lig) ||
      /fr-accord-ot\|/.test(lig) ||
      /fr-accord-un\|/.test(lig) ) &&
      (lig.indexOf("|ms=") == -1) ){
    return lig.substring(0,p) + "|ms=" + mot + "}}";
  }
  if ( /fr-accord-mixte\|/.test(lig) && (lig.indexOf("|fs=") == -1)){
    return lig.substring(0,p) + "|ms=" + mot + "|fs=" + mot + "e}}";
  }
  return lig; // pour les modèles non gérés
}

//--------------------------------------------------------------------------------------
// Définition dans le cas régulier
//--------------------------------------------------------------------------------------
function Flex_standard(codesplit,frm_principale){
  var tmp_codewiki="";
  if ((codesplit.indexOf("{{mf}}")>=0) )
    tmp_codewiki += "# ''Pluriel de'' [[";
  else
    tmp_codewiki += "# ''Masculin/Féminin singulier/pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}


//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-al
//--------------------------------------------------------------------------------------
function Flex_al(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("aux'''");
  var pos_fs = tmp_codewiki.indexOf("ale'''");
  var pos_fp = tmp_codewiki.indexOf("ales'''");

  verifFlexBox(pos_mp, pos_fs, pos_fp);

  if( pos_mp>0 )
    if(tmp_codewiki.indexOf("al|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/al\|fr\}\}/mg,"o|fr}}");
    else if(tmp_codewiki.indexOf("al}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/al\}\}/mg,"o|fr}}");
  if( pos_fs>0 || pos_fp>0 )
    if(tmp_codewiki.indexOf("o|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/o\|fr\}\}/mg,"al|fr}}");
    else if(tmp_codewiki.indexOf("o}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/o\}\}/mg,"al|fr}}");

  if (pos_mp>0)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}

//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-ain
//--------------------------------------------------------------------------------------
function Flex_ain(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("ains'''");
  var pos_fs = tmp_codewiki.indexOf("aine'''");
  var pos_fp = tmp_codewiki.indexOf("aines'''");

  verifFlexBox(pos_mp, pos_fs, pos_fp);

  if( pos_mp>0 )
    if(tmp_codewiki.indexOf("ɛn|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛn\|fr\}\}/mg,"ɛ̃|fr}}");
    else if(tmp_codewiki.indexOf("ɛn}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛn\}\}/mg,"ɛ̃|fr}}");
  if( pos_fs>0 || pos_fp>0 )
    if(tmp_codewiki.indexOf("ɛ|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛ̃\|fr\}\}/mg,"ɛn|fr}}");
    else if(tmp_codewiki.indexOf("ɛ̃}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛ̃\}\}/mg,"ɛn|fr}}");

  if (pos_mp>0)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}

//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-an
//--------------------------------------------------------------------------------------
function Flex_an(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("ans'''");
  var pos_fs = tmp_codewiki.indexOf("ane'''");
  var pos_fp = tmp_codewiki.indexOf("anes'''");

  verifFlexBox(pos_mp, pos_fs, pos_fp);

  if( pos_mp>0 )
    if(tmp_codewiki.indexOf("an|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/an\|fr\}\}/mg,"ɑ̃|fr}}");
    else if(tmp_codewiki.indexOf("an}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/an\}\}/mg,"ɑ̃|fr}}");
  if( pos_fs>0 || pos_fp>0 )
    if(tmp_codewiki.indexOf("ɑ̃|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɑ̃\|fr\}\}/mg,"an|fr}}");
    else if(tmp_codewiki.indexOf("ɑ̃}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɑ̃\}\}/mg,"an|fr}}");

  if (pos_mp>0)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}

//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-cons
//--------------------------------------------------------------------------------------
function Flex_cons(new_codewiki,frm_principale,cons){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("s'''");
  var pos_fs = tmp_codewiki.indexOf("e'''");
  var pos_fp = tmp_codewiki.indexOf("es'''");

  verifFlexBox(pos_mp, pos_fs, pos_fp);

  if( pos_mp>0 && pos_fp==-1) {
    var tmp = cons + "|fr}}";
    var tmp_pos = tmp_codewiki.indexOf(tmp,tmp_codewiki.indexOf("{{pron|"));
    if(tmp_pos>0)
      tmp_codewiki= tmp_codewiki.substr(0, tmp_pos) + tmp_codewiki.substr(tmp_pos+cons.length);
  }
  if( pos_fs>0 || pos_fp>0 ) {
    var tmp = cons + "|fr}}";
    var tmp_pos = tmp_codewiki.indexOf(tmp,tmp_codewiki.indexOf("{{pron|"));
    if(tmp_pos==-1) {
      tmp_pos = tmp_codewiki.indexOf("|fr}}",tmp_codewiki.indexOf("{{pron|"));
      if ( tmp_codewiki.indexOf("{{pron|") != -1 ) {
        //on ajoute la (les) lettre(s) supplémentaire(s) dans la prononciation
        tmp_codewiki= tmp_codewiki.substr(0, tmp_pos) + cons + tmp_codewiki.substr(tmp_pos);
      }
    }
  }
  if (pos_mp>0 && pos_fp==-1)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}

//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-el
//--------------------------------------------------------------------------------------
function Flex_el(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("els'''");
  var pos_fs = tmp_codewiki.indexOf("elle'''");
  var pos_fp = tmp_codewiki.indexOf("elles'''");

  verifFlexBox(pos_mp, pos_fs, pos_fp);

  if (pos_mp>0)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}

//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-en
//--------------------------------------------------------------------------------------
function Flex_en(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("ens'''");
  var pos_fs = tmp_codewiki.indexOf("enne'''");
  var pos_fp = tmp_codewiki.indexOf("ennes'''");

  verifFlexBox(pos_mp, pos_fs, pos_fp);

  if( pos_mp>0 )
    if(tmp_codewiki.indexOf("ɛn|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛn\|fr\}\}/mg,"ɛ̃|fr}}");
    else if(tmp_codewiki.indexOf("ɛn}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛn\}\}/mg,"ɛ̃|fr}}");
  if( pos_fs>0 || pos_fp>0 )
    if(tmp_codewiki.indexOf("ɛ̃|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛ̃\|fr\}\}/mg,"ɛn|fr}}");
  if(tmp_codewiki.indexOf("ɛ̃}}")>0)
    tmp_codewiki = tmp_codewiki.replace(/ɛ̃\}\}/mg,"ɛn|fr}}");

  if (pos_mp>0)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}

//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-er
//--------------------------------------------------------------------------------------
function Flex_er(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("ers'''");
  var pos_fs = tmp_codewiki.indexOf("ère'''");
  var pos_fp = tmp_codewiki.indexOf("ères'''");

  verifFlexBox(pos_mp, pos_fs, pos_fp);

  if( pos_mp>0 )
    if(tmp_codewiki.indexOf("ɛʁ|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛʁ\|fr\}\}/mg,"e|fr}}");
    else if(tmp_codewiki.indexOf("ɛʁ}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛʁ\}\}/mg,"e|fr}}");
  if( pos_fs>0 || pos_fp>0 ) {
    if(tmp_codewiki.indexOf("e|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/e\|fr\}\}/mg,"ɛʁ|fr}}");
    else if(tmp_codewiki.indexOf("e}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/e\}\}/mg,"ɛʁ|fr}}");
    tmp_codewiki = tmp_codewiki.replace("languɛʁ","langue");
  }
  if (pos_mp>0)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}

//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-et
//--------------------------------------------------------------------------------------
function Flex_et(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("ets'''");
  var pos_fs = tmp_codewiki.indexOf("ette'''");
  var pos_fp = tmp_codewiki.indexOf("ettes'''");
  //si pos_fs et pos_fp n'ont pas été trouvés, c'est peut-être parce que le féminin se termine en « -ète ».
  if(pos_fs==-1)
    pos_fs = tmp_codewiki.indexOf("ète'''");
  if(pos_fp==-1)
    pos_fp = tmp_codewiki.indexOf("ètes'''");

  verifFlexBox(pos_mp, pos_fs, pos_fp);

  if( pos_mp>0 )
    if(tmp_codewiki.indexOf("ɛt|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛt\|fr\}\}/mg,"ɛ|fr}}");
    else if(tmp_codewiki.indexOf("ɛt}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛt\}\}/mg,"ɛ|fr}}");
  if( pos_fs>0 || pos_fp>0 )
    if(tmp_codewiki.indexOf("ɛ|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛ\|fr\}\}/mg,"ɛt|fr}}");
    else if(tmp_codewiki.indexOf("ɛ}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛ\}\}/mg,"ɛt|fr}}");

  if (pos_mp>0)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}

//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-eur
//--------------------------------------------------------------------------------------
function Flex_eur(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("eurs'''");
  var pos_fs1 = tmp_codewiki.indexOf("euse'''");
  var pos_fp1 = tmp_codewiki.indexOf("euses'''");
  var pos_fs2 = tmp_codewiki.indexOf("rice'''");
  var pos_fp2 = tmp_codewiki.indexOf("rices'''");

//la fonction verifFlexBox manque d'argument pour gérer ce cas.

  if( pos_mp>0 ) {
    if(tmp_codewiki.indexOf("øz|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/øz\|fr\}\}/mg,"œʁ|fr}}");
    else if(tmp_codewiki.indexOf("øz}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/øz\}\}/mg,"œʁ|fr}}");
    if(tmp_codewiki.indexOf("ʁis|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ʁis\|fr\}\}/mg,"œʁ|fr}}");
    else if(tmp_codewiki.indexOf("ʁis}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ʁis\}\}/mg,"œʁ|fr}}");
  }
  if( pos_fs1>0 || pos_fp1>0 )
    if(tmp_codewiki.indexOf("œʁ|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/œʁ\|fr\}\}/mg,"øz|fr}}");
    else if(tmp_codewiki.indexOf("œʁ}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/œʁ\}\}/mg,"øz|fr}}");
  if( pos_fs2>0 || pos_fp2>0 )
    if(tmp_codewiki.indexOf("œʁ|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/œʁ\|fr\}\}/mg,"ʁis|fr}}");
    else if(tmp_codewiki.indexOf("œʁ}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/œʁ\}\}/mg,"ʁis|fr}}");

  if (pos_mp>0)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs1>0 || pos_fs2>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp1>0 || pos_fp2>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}

//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-eux
//--------------------------------------------------------------------------------------
function Flex_eux(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_fs = tmp_codewiki.indexOf("euse'''");
  var pos_fp = tmp_codewiki.indexOf("euses'''");

  verifFlexBox(pos_fs, pos_fs, pos_fp); //on met 2 fois pos_fs car la fonction prend 3 arguments en entrée

  if( pos_fs>0 || pos_fp>0 ) {
    if(tmp_codewiki.indexOf("ø|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ø\|fr\}\}/mg,"øz|fr}}");
    else if(tmp_codewiki.indexOf("ø}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ø\}\}/mg,"øz|fr}}");
  }
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}

//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-f
//--------------------------------------------------------------------------------------
function Flex_f(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("fs'''");
  var pos_fs = tmp_codewiki.indexOf("ve'''");
  var pos_fp = tmp_codewiki.indexOf("ves'''");

  verifFlexBox(pos_mp, pos_fs, pos_fp);

  if( pos_mp>0 )
    if(tmp_codewiki.indexOf("v|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/v\|fr\}\}/mg,"f|fr}}");
    else if(tmp_codewiki.indexOf("v}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/v\}\}/mg,"f|fr}}");
  if( pos_fs>0 || pos_fp>0 )
    if(tmp_codewiki.indexOf("f|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/f\|fr\}\}/mg,"v|fr}}");
    else if(tmp_codewiki.indexOf("f}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/f\}\}/mg,"v|fr}}");

  if (pos_mp>0)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}

//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-in
//--------------------------------------------------------------------------------------
function Flex_in(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("ins'''");
  var pos_fs = tmp_codewiki.indexOf("ine'''");
  var pos_fp = tmp_codewiki.indexOf("ines'''");

  verifFlexBox(pos_mp, pos_fs, pos_fp);

  if( pos_mp>0 )
    if(tmp_codewiki.indexOf("in|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/in\|fr\}\}/mg,"ɛ̃|fr}}");
    else if(tmp_codewiki.indexOf("in}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/in\}\}/mg,"ɛ̃|fr}}");
  if( pos_fs>0 || pos_fp>0 )
    if(tmp_codewiki.indexOf("ɛ̃|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛ̃\|fr\}\}/mg,"in|fr}}");
    else if(tmp_codewiki.indexOf("ɛ̃}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɛ̃\}\}/mg,"in|fr}}");

  if (pos_mp>0)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}

//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-on
//--------------------------------------------------------------------------------------
function Flex_on(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("ons'''");
  var pos_fs = tmp_codewiki.indexOf("onne'''");
  var pos_fp = tmp_codewiki.indexOf("onnes'''");
  //si pos_fs et pos_fp n'ont pas été trouvés, c'est peut-être parce que le féminin se termine en « -one ».
  if(pos_fs==-1)
    pos_fs = tmp_codewiki.indexOf("one'''");
  if(pos_fp==-1)
    pos_fp = tmp_codewiki.indexOf("ones'''");

  verifFlexBox(pos_mp, pos_fs, pos_fp);

  if( pos_mp>0 )
    if(tmp_codewiki.indexOf("ɔn|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɔn\|fr\}\}/mg,"ɔ̃|fr}}");
  if(tmp_codewiki.indexOf("ɔn}}")>0)
    tmp_codewiki = tmp_codewiki.replace(/ɔn\}\}/mg,"ɔ̃|fr}}");
  if( pos_fs>0 || pos_fp>0 )
    if(tmp_codewiki.indexOf("ɔ̃|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɔ̃\|fr\}\}/mg,"ɔn|fr}}");
  if(tmp_codewiki.indexOf("ɔ̃}}")>0)
    tmp_codewiki = tmp_codewiki.replace(/ɔ̃\}\}/mg,"ɔn|fr}}");

  if (pos_mp>0)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}

//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-ot
//--------------------------------------------------------------------------------------
function Flex_ot(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("ots'''");
  var pos_fs = tmp_codewiki.indexOf("ote'''");
  var pos_fp = tmp_codewiki.indexOf("otes'''");
  //si pos_fs et pos_fp n'ont pas été trouvés, c'est peut-être parce que le féminin se termine en « -ote ».
  if(pos_fs==-1)
    pos_fs = tmp_codewiki.indexOf("otte'''");
  if(pos_fp==-1)
    pos_fp = tmp_codewiki.indexOf("ottes'''");

  verifFlexBox(pos_mp, pos_fs, pos_fp);

  if( pos_mp>0 )
    if(tmp_codewiki.indexOf("ɔt|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/ɔt\|fr\}\}/mg,"o|fr}}");
  if(tmp_codewiki.indexOf("ɔt}}")>0)
    tmp_codewiki = tmp_codewiki.replace(/ɔt\}\}/mg,"o|fr}}");
  if( pos_fs>0 || pos_fp>0 )
    if(tmp_codewiki.indexOf("o|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/o\|fr\}\}/mg,"ɔt|fr}}");
  if(tmp_codewiki.indexOf("o}}")>0)
    tmp_codewiki = tmp_codewiki.replace(/o\}\}/mg,"ɔt|fr}}");

  if (pos_mp>0)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}

//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-oux
//--------------------------------------------------------------------------------------
function Flex_oux(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_fs = tmp_codewiki.indexOf("ouce'''");
  var pos_fp = tmp_codewiki.indexOf("ouces'''");

  verifFlexBox(pos_fs, pos_fs, pos_fp); //on met 2 fois pos_fs car la fonction prend 3 arguments en entrée

  if( pos_fs>0 || pos_fp>0 )
    if(tmp_codewiki.indexOf("u|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/u\|fr\}\}/mg,"us|fr}}");
  if(tmp_codewiki.indexOf("u}}")>0)
    tmp_codewiki = tmp_codewiki.replace(/u\}\}/mg,"us|fr}}");

  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}


//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-reg
//--------------------------------------------------------------------------------------
function Flex_reg(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("s'''");
  var pos_fs = tmp_codewiki.indexOf("e'''");
  var pos_fp = tmp_codewiki.indexOf("es'''");

  verifFlexBox(pos_mp, pos_fs, pos_fp);

  if (pos_mp>0 && pos_fp==-1)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}


//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-rég
//--------------------------------------------------------------------------------------
function Flex_reg2(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  tmp_codewiki += "# ''Pluriel de'' [[" + frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}


//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-s
//--------------------------------------------------------------------------------------
function Flex_s(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_fs = tmp_codewiki.indexOf("se'''");
  var pos_fp = tmp_codewiki.indexOf("ses'''");

  if( pos_fs>0 || pos_fp>0 ) {
    var tmp_pos = tmp_codewiki.indexOf("z|fr}}",tmp_codewiki.indexOf("{{pron|"));
    if(tmp_pos==-1) {
      var tmp_pos = tmp_codewiki.lastIndexOf("|fr}}");
      if ( tmp_codewiki.indexOf("{{pron|") != -1 ) {
        //on ajoute la (les) lettre(s) supplémentaire(s) dans la prononciation
        tmp_codewiki= tmp_codewiki.substr(0, tmp_pos) + "z" + tmp_codewiki.substr(tmp_pos);
      }
    }
  }

  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}


//--------------------------------------------------------------------------------------
// Définition dans le cas des mots qui utilisent fr-accord-un
//--------------------------------------------------------------------------------------
function Flex_un(new_codewiki,frm_principale){
  var tmp_codewiki=new_codewiki;
  // on cherche d'abord de quelle forme on doit s'occuper
  var pos_mp = tmp_codewiki.indexOf("uns'''");
  var pos_fs = tmp_codewiki.indexOf("une'''");
  var pos_fp = tmp_codewiki.indexOf("unes'''");

  if( pos_fs>0 || pos_fp>0 ) {
    if(tmp_codewiki.indexOf("œ̃|fr}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/œ̃\|fr\}\}/mg,"yn|fr}}");
    if(tmp_codewiki.indexOf("œ̃}}")>0)
      tmp_codewiki = tmp_codewiki.replace(/œ̃\}\}/mg,"yn|fr}}");
  }
  if (pos_mp>0)
    tmp_codewiki += "# ''Masculin pluriel de'' [[";
  if (pos_fs>0)
    tmp_codewiki += "# ''Féminin singulier de'' [[";
  if (pos_fp>0)
    tmp_codewiki += "# ''Féminin pluriel de'' [[";
  tmp_codewiki += frm_principale + "#fr|" + frm_principale + "]].\n\n";
  return tmp_codewiki;
}
//</nowiki>
