/* Résumé Deluxe.
 *
 * [[Catégorie:JavaScript du Wiktionnaire|ResumeDeluxe.js]]
 * Ajoute des commentaires de modification prédéfinis
 *
 * Auteur : Dake
 * Contributions : Pabix, Tieno, Ltrlg
 *
 * Dépendances :
 *  — les habituelles implicites 'mediawiki' & 'jquery' ;
 *  — 'user' (chargement du common.js).
 *
 * {{Projet:JavaScript/Script|ResumeDeluxe}}
 */

/* globals window, $, document, mw, ve */

mw.loader.using('user', function () {
  'use strict';

  var
      /* Vérifier la présence d’un titre de section.
       * Cela permet de n’ajouter un séparateur ' ; ' entre deux résumés que si
       * nécessaire.
       * Note : on ne vérifie que le fait que le motif est en fin de chaîne, pas
       * en début.
       */
      sansPointVirgule = /\*\/\s*$/,

      /* La liste des liens qui seront affichés.
       * Les éléments du tableau sont d’une des deux formes suivantes :
       *   — [ 'lien' , 'resume' ]
       *   — 'texte'
       * où 'lien' représente l’intitulé du lien, 'resume' le résumé d’édition
       * inséré par le lien et 'texte' les deux à la fois.
       */
      listeLiens = [],

      /* Liens affichés par défaut, même format que listeLiens. */
      liensParDefaut = [
        ['nouvelle entrée', 'création d’une nouvelle entrée'],
        ['étymologie', 'modification de l’étymologie'],
        ['imageName', 'ajout ou modification de l’image'],
        ['prononciation', 'ajout ou modification de la prononciation'],
        ['exemple', 'ajout ou modification d’un exemple'],
        ['synonyme/antonyme', 'modification concernant les synonymes, antonymes ou autres -nymes'],
        ['dérivé', 'ajout ou modification de mots dérivés'],
        ['vocabulaire', 'vocabulaire apparenté'],
        ['référence', 'ajout ou modification des références'],
        ['orthographe', 'correction orthographique'],
        ['rédaction', 'correction de formulations'],
        ['mise en forme', 'amélioration de la mise en forme'],
        'retouche de la modification précédente'
      ],

      /* Objet permettant de désactiver des liens (parmi la liste par défaut
       * ci-avant), sous la forme { 'lien1': false, 'lien2': false, … } où
       * 'lien1', 'lien2'… est l’intitulé du lien à ne pas afficher.
       */
      liensAffiches = window.ResumeDeluxe_affiches || {},

      /* Objet jQuery contenant l’<input> ou le <textarea> constituant le résumé. */
      $resume,

      /* Objet jQuery contenant la liste de liens. */
      $cont;

  /* Fonction renvoyant l’intitulé d’un lien à partir de sa représentation sous
   * forme de tableau ou de chaîne.
   */
  function texteDuLien(definition) {
    if ($.isArray(definition)) {
      return definition[0];
    }
    else {
      // Soyons sûr d’avoir une chaîne de caractères
      return definition.toString();
    }
  }

  /* Fonction renvoyant le texte ajouté par un lien à partir de sa représentation
   * sous forme de tableau ou de chaîne.
   */
  function resumeAInserer(definition) {
    if ($.isArray(definition)) {
      return definition[1];
    }
    else {
      // Soyons sûr d’avoir une chaîne de caractères.
      return definition.toString();
    }
  }

  /* Procédure appliquant les préférences de l’utilisateur :
   *   — si l’utilisateur a défini window.ResumeDeluxe_liens, celui-ci est utilisé
   *     à la place de la liste par défaut liensParDefaut ;
   *   — sinon si l’utilisateur a défini window.ResumeDeluxe_affiches, les règles
   *     de désactivation sont appliquées ;
   *   — sinon liensAffiches est un objet vide, donc la liste par défaut est
   *     utilisée.
   */
  function appliquerConfiguration() {
    var i, cle;

    if ($.isArray(window.ResumeDeluxe_liens)) {
      listeLiens = window.ResumeDeluxe_liens;
    }
    else {
      for (i = 0; i < liensParDefaut.length; i++) {
        cle = texteDuLien(liensParDefaut[i]);
        if (liensAffiches[cle] !== false) {
          listeLiens.push(liensParDefaut[i]);
        }
      }
    }
  }

  /* Procedure effectuant l’ajout d’une chaîne au résumé d’édition, avec un
   * séparateur si besoin
   */
  function ajouterAuResume(chaine) {
    var resumeActuel = $resume.val();
    if (resumeActuel === '') {
      $resume.val(chaine);
    }
    else if (sansPointVirgule.test(resumeActuel)) {
      $resume.val(resumeActuel + chaine);
    }
    else {
      $resume.val(resumeActuel + ' ; ' + chaine);
    }

    // L’ÉditeurVisuel ne se base plus sur le contenu mais sur l’évènement
    $resume.change();

    // Conserver le focus sur le lien est inutile à l’utilisateur
    // Plaçons-le sur le champ de résumé, s’il veut compléter à la main
    $resume.focus();
  }

  /*  Fonction renvoyant un lien à partir de sa définition. */
  function $lien(definition) {
    var resume = resumeAInserer(definition);
    return $('<a>')
        .text(texteDuLien(definition))
        .attr({
          href: '#',
          title: 'Ajouter «\xA0' + resume + '\xA0» au résumé de modification'
        })
        .click(function () {
          ajouterAuResume(resume);
          return false;
        });
  }

  /* Procédure construisant la liste de liens. */
  function contruireListe() {
    var i, $ul;

    $ul = $('<ul>')
        .addClass('liste-horizontale')
        .css({
          display: 'inline',
          margin: 0
        });

    for (i = 0; i < listeLiens.length; i++) {
      $ul.append($('<li>').append($lien(listeLiens[i])));
    }

    $cont = $('<div>').attr('id', 'ResumeDeluxe')
        .text('Résumé express\xA0: ')
        .append($ul);
  }

  /* Procédure initialisant $resume et insérant la liste de liens dans le cas de
   * l’éditeur de wikicode, quand les nœuds nécessaires sont en place.
   */
  function demarrer_wikicode() {
    $(function ($) {
      $('#wpSummaryLabel').before($cont);
      $resume = $('#wpSummary');
    });
  }

  /* Procédure initialisant $resume et insérant la liste de liens dans le cas de
   * l’ÉditeurVisuel, quand les nœuds nécessaires sont en place.
   */
  function demarrer_EditeurVisuel() {
    mw.hook('ve.saveDialog.stateChanged').add(function () {
      /*
       * Traitement : si le dialogue a été recréé, on y remet ce qu’il faut.
       * TODO Vérifier si cette vérification est encore nécessaire.
       */
      if ($('#ResumeDeluxe').length < 1) {
        ve.init.target.saveDialog.$editSummaryLabel.after($cont);
        $resume = ve.init.target.saveDialog.editSummaryInput.$input;
      }
    });
  }

  /* Procédure qui détermine quel éditeur peut être utilisé et démarre le gadget
   * selon le résultat.
   */
  function demarrer() {
    switch (mw.config.get('wgAction')) {
      case 'edit':
      case 'submit':
        // Désactivé pour la création de sections
        if (!/[?&]section=new(&|$)/.test(document.location.search)) {
          demarrer_wikicode();
        }
        // L’EV peut démarrer de ces modes sans rechargement
        /* falls through */
      case 'view':
        demarrer_EditeurVisuel();
        break;
    }
  }

  /***** Démarrage du tout *****/

  // Lecture des préférences
  appliquerConfiguration();

  // Construction de la liste des liens
  contruireListe();

  // Insère la liste dans l’arbre des nœuds et cherche le nœud contenant le résumé
  demarrer();

});
