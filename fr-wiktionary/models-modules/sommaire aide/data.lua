return {
  homePage = {
    page = "Aide:Sommaire",
    title = "Aide",
    icon = "Circle-icons-support.svg",
    colors = {
      normal = {
        bg = "#fef6e7",
        fg = "black"
      }
    }
  },
  tabs = {
    ["Wiktionnaire:Entraide"] = {
      title = "Forum d’entraide",
      index = 1,
      items = {},
      colors = {
        normal = { bg = "#eaf3ff", fg = "black" },
        selected = { bg = "#36c", fg = "white" },
        itemActive = { bg = "#2a4b8d", fg = "white" }
      }
    },
    ["Aide:FAQ"] = {
      title = "FAQ",
      index = 2,
      items = {
        ["Aide:FAQ générale"] = { title = "FAQ générale", index = 1 },
        ["Aide:FAQ lecteurs"] = { title = "FAQ lecteurs", index = 2 },
        ["Aide:FAQ participants"] = { title = "FAQ participants", index = 3 },
        ["Aide:FAQ administration"] = { title = "FAQ administration", index = 4 },
        ["Aide:FAQ technique"] = { title = "FAQ technique", index = 5 },
        ["Aide:FAQ divers"] = { title = "FAQ divers", index = 6 },
      },
      colors = {
        normal = { bg = "#fef6e7", fg = "black" },
        selected = { bg = "#fc3", fg = "black" },
        itemActive = { bg = "#ac6600", fg = "white" }
      }
    },
    ["Wiktionnaire:Bienvenue sur le Wiktionnaire"] = {
      title = "Bienvenue&nbsp;!",
      index = 3,
      items = {
        ["Wiktionnaire:Bienvenue sur le Wiktionnaire"] = { title = "Accueil", index = 1 },
        ["Wiktionnaire:À propos"] = { title = "Le Wiktionnaire", index = 2 },
        ["Aide:Premiers pas"] = { title = "Premiers pas", index = 3 },
        ["Wiktionnaire:Bac à sable"] = { title = "Bac à sable", index = 4 },
        ["Aide:Les particularités du Wiktionnaire"] = { title = "Particularités du Wiktionnaire", index = 5 },
      },
      colors = {
        normal = { bg = "#d5fdf4", fg = "black" },
        selected = { bg = "#00af89", fg = "black" },
        itemActive = { bg = "#14866d", fg = "white" }
      }
    },
    ["Aide:Créer un compte"] = {
      title = "Bien débuter",
      index = 4,
      items = {
        ["Aide:Créer un compte"] = { title = "Compte utilisateur", index = 1 },
        ["Aide:Comment démarrer une page"] = { title = "Créer une page", index = 2 },
        ["Aide:Comment modifier une page"] = { title = "Modifier une page", index = 3 },
        ["Aide:Bases de la syntaxe du Wiktionnaire"] = { title = "Syntaxe du Wiktionnaire", index = 4 },
        ["Aide:Liens"] = { title = "Lier les pages", index = 5 },
        ["Aide:Conseils généraux"] = { title = "Conseils généraux", index = 6 },
        ["Aide:Caractères spéciaux"] = { title = "Caractères spéciaux", index = 7 },
        ["Aide:Tutoriels"] = { title = "Tutoriels interactifs", index = 8 },
      },
      colors = {
        normal = { bg = "#eaf3ff", fg = "black" },
        selected = { bg = "#36c", fg = "white" },
        itemActive = { bg = "#2a4b8d", fg = "white" }
      }
    },
    ["Wiktionnaire:Principes fondateurs"] = {
      title = "Principes fondamentaux",
      index = 5,
      items = {
        ["Wiktionnaire:Neutralité de point de vue"] = { title = "Neutralité de point de vue", index = 1 },
        ["Wiktionnaire:Règles de savoir-vivre"] = { title = "Règles de savoir-vivre", index = 2 },
        ["Wiktionnaire:Copyright"] = { title = "Droit d’auteur", index = 3 },
        ["Wiktionnaire:Citation et réutilisation du contenu du Wiktionnaire"] = { title = "Réutilisation du contenu", index = 4 },
      },
      colors = {
        normal = { bg = "#eaf3ff", fg = "black" },
        selected = { bg = "#36c", fg = "white" },
        itemActive = { bg = "#2a4b8d", fg = "white" }
      }
    },
    ["Wiktionnaire:Conventions"] = {
      title = "Conventions",
      index = 6,
      items = {
        ["Wiktionnaire:Critères d’acceptabilité des entrées"] = { title = "Critères d’acceptabilité", index = 1 },
        ["Wiktionnaire:Structure des pages"] = { title = "Structure des pages", index = 2 },
        ["Wiktionnaire:Conventions typographiques"] = { title = "Typographie", index = 3 },
        ["Wiktionnaire:Apostrophes"] = { title = "Apostrophes", index = 4 },
        ["Wiktionnaire:Définitions"] = { title = "Définitions", index = 5 },
        ["Wiktionnaire:Étymologie"] = { title = "Étymologie", index = 6 },
        ["Wiktionnaire:Prononciation"] = { title = "Prononciation", index = 7 },
        ["Wiktionnaire:Exemples"] = { title = "Exemples", index = 8 },
        ["Wiktionnaire:Illustrations"] = { title = "Illustrations", index = 9 },
        ["Wiktionnaire:Traductions"] = { title = "Traductions", index = 10 },
        ["Wiktionnaire:Références"] = { title = "Références", index = 11 },
        ["Wiktionnaire:Liens externes"] = { title = "Liens externes", index = 12 },
        ["Wiktionnaire:Flexions"] = { title = "Flexions", index = 13 },
        ["Wiktionnaire:Redirections"] = { title = "Redirections", index = 14 },
        ["Wiktionnaire:Catégories"] = { title = "Catégories", index = 15 },
        ["Wiktionnaire:Thésaurus"] = { title = "Thésaurus", index = 16 },
        ["Projet:Annexes/Wiktionnaire:Annexes"] = { title = "Annexes", index = 17 },
        ["Wiktionnaire:Rimes en français"] = { title = "Rimes en français", index = 18 },
        ["Wiktionnaire:Formes reconstruites"] = { title = "Formes reconstruites", index = 19 },
        ["Wiktionnaire:Droit des marques"] = { title = "Droit des marques", index = 20 },
      },
      colors = {
        normal = { bg = "#eaf3ff", fg = "black" },
        selected = { bg = "#36c", fg = "white" },
        itemActive = { bg = "#2a4b8d", fg = "white" }
      }
    },
    ["Aide:Recherche"] = {
      title = "Parcourir le Wiktionnaire",
      index = 7,
      items = {
        ["Aide:Recherche"] = { title = "Rechercher une page", index = 1 },
        ["Aide:Consultation"] = { title = "Consulter les pages", index = 2 },
      },
      colors = {
        normal = { bg = "#ffc6a6", fg = "black" },
        selected = { bg = "#fe701f", fg = "white" },
        itemActive = { bg = "#e35f14", fg = "white" }
      }
    },
    ["Aide:Guides de rédaction"] = {
      title = "Guides de rédaction",
      index = 8,
      items = {
        ["Aide:Types de mots"] = { title = "Types de mots", index = 1 },
        ["Aide:Définitions"] = { title = "Définitions", index = 2 },
        ["Aide:Étymologies"] = { title = "Étymologies", index = 3 },
        ["Aide:Prononciation"] = { title = "Prononciation", index = 4 },
        ["Aide:Exemples"] = { title = "Exemples", index = 5 },
        ["Aide:Expressions du mot vedette"] = { title = "Expressions", index = 6 },
        ["Aide:Traductions"] = { title = "Traductions", index = 7 },
        ["Aide:Synonymes et antonymes"] = { title = "Synonymes et antonymes", index = 8 },
        ["Aide:Mots et locutions dérivés"] = { title = "Mots et locutions dérivés", index = 9 },
        ["Aide:Mots apparentés"] = { title = "Mots apparentés", index = 10 },
        ["Aide:Vocabulaire apparenté"] = { title = "Vocabulaire apparenté", index = 11 },
        ["Aide:Hyperonymes et hyponymes"] = { title = "Hyperonymes et hyponymes", index = 12 },
        ["Aide:Méronymes et holonymes"] = { title = "Méronymes et holonymes", index = 13 },
        ["Aide:Homophones et paronymes"] = { title = "Homophones et paronymes", index = 14 },
        ["Aide:Anagrammes"] = { title = "Anagrammes", index = 15 },
        ["Aide:Voir aussi"] = { title = "Voir aussi", index = 16 },
        ["Aide:Références"] = { title = "Références", index = 17 },
        ["Aide:Liens interwikis"] = { title = "Liens interwikis", index = 18 },
        ["Aide:Flexions"] = { title = "Flexions", index = 19 },
        ["Aide:Abréviations, sigles et acronymes"] = { title = "Abréviations, sigles et acronymes", index = 20 },
        ["Aide:Formes reconstruites"] = { title = "Reconstructions", index = 21 },
        ["Aide:Catégories"] = { title = "Catégories", index = 22 },
        ["Aide:Thésaurus"] = { title = "Thésaurus", index = 23 },
        ["Aide:Annexes"] = { title = "Annexes", index = 24 },
        ["Aide:Conjugaisons"] = { title = "Conjugaisons", index = 25 },
      },
      colors = {
        normal = { bg = "#fef6e7", fg = "black" },
        selected = { bg = "#fc3", fg = "black" },
        itemActive = { bg = "#ac6600", fg = "white" }
      }
    },
    ["Aide:Patrons"] = {
      title = "Patrons",
      index = 9,
      items = {
        ["Wiktionnaire:Patron d’article pour un nom commun"] = { title = "Nom commun", index = 1 },
        ["Wiktionnaire:Patron d’article pour un nom propre"] = { title = "Nom propre", index = 2 },
        ["Wiktionnaire:Patron d’article pour un prénom"] = { title = "Prénom", index = 3 },
        ["Wiktionnaire:Patron d’article pour un article"] = { title = "Article", index = 4 },
        ["Wiktionnaire:Patron d’article pour un adjectif"] = { title = "Adjectif", index = 5 },
        ["Wiktionnaire:Patron d’article pour un verbe"] = { title = "Verbe", index = 6 },
        ["Wiktionnaire:Patron d’article pour un adverbe"] = { title = "Adverbe", index = 7 },
        ["Wiktionnaire:Patron d’article pour une préposition"] = { title = "Préposition", index = 8 },
        ["Wiktionnaire:Patron d’article pour une conjonction"] = { title = "Conjonction", index = 9 },
        ["Wiktionnaire:Patron d’article pour un pronom"] = { title = "Pronom", index = 10 },
        ["Wiktionnaire:Patron d’article pour une interjection"] = { title = "Interjection", index = 11 },
        ["Wiktionnaire:Patron d’article pour un affixe"] = { title = "Affixe", index = 12 },
        ["Wiktionnaire:Patron d’article pour un caractère"] = { title = "Caractère", index = 13 },
        ["Wiktionnaire:Patron d’article pour un numéral"] = { title = "Numéral", index = 14 },
        ["Wiktionnaire:Patron d’article pour une locution"] = { title = "Locution", index = 15 },
        ["Wiktionnaire:Patron d’article pour une locution-phrase"] = { title = "Locution-phrase", index = 16 },
        ["Wiktionnaire:Patron d’article pour un proverbe"] = { title = "Proverbe", index = 17 },
        ["Wiktionnaire:Patron d’article général"] = { title = "Patron général", index = 18 },
      },
      colors = {
        normal = { bg = "#fee7e6", fg = "black" },
        selected = { bg = "#d33", fg = "white" },
        itemActive = { bg = "#b32424", fg = "white" }
      }
    },
    ["Wiktionnaire:Ressources"] = {
      title = "Ressources",
      index = 10,
      items = {
        ["Wiktionnaire:Ressources"] = { title = "Ressources linguistiques", index = 1 },
        ["Wiktionnaire:Liste des références"] = { title = "Liste des références", index = 2 },
        ["Aide:Quels langues, parlers, dialectes et patois ?"] = { title = "Langues, dialectes", index = 3 },
        ["Aide:Consulter le Wiktionnaire hors-connexion"] = { title = "Wiktionnaire en hors-ligne", index = 4 },
        ["Annexe:Prononciation"] = { title = "Prononciation", index = 5 },
        ["w:Aide:Unicode"] = { title = "Polices de caractères", index = 6 },
      },
      colors = {
        normal = { bg = "#d5fdf4", fg = "black" },
        selected = { bg = "#00af89", fg = "black" },
        itemActive = { bg = "#14866d", fg = "white" }
      }
    },
    ["Wiktionnaire:Modèles"] = {
      title = "Modèles",
      index = 11,
      items = {
        ["Wiktionnaire:Modèles"] = { title = "Les modèles", index = 1 },
        ["Wiktionnaire:Liste de tous les modèles"] = { title = "Tous les modèles", index = 2 },
        ["Wiktionnaire:Liste de tous les modèles/Par langue"] = { title = "Tous les modèles par langue", index = 3 },
        ["Wiktionnaire:Liste des langues"] = { title = "Liste des langues", index = 4 },
      },
      colors = {
        normal = { bg = "#d5fdf4", fg = "black" },
        selected = { bg = "#00af89", fg = "black" },
        itemActive = { bg = "#14866d", fg = "white" }
      }
    },
    ["Aide:Multimédia"] = {
      title = "Multimédia",
      index = 12,
      subGroups = {
        ["Images"] = { from = 1, to = 2 },
        ["Son"] = { from = 3, to = 4 },
      },
      items = {
        ["Aide:Illustrations"] = { title = "Illustrations", index = 1 },
        ["Aide:Planches illustratives"] = { title = "Planches illustratives", index = 2 },
        ["Aide:Prononciation"] = { title = "Prononciation", index = 3 },
        ["Modèle:écouter"] = { title = "Enregistrements sonores", index = 4 },
        ["w:Aide:Importer un fichier"] = { title = "Importer un fichier", index = 5 },
      },
      colors = {
        normal = { bg = "#d5fdf4", fg = "black" },
        selected = { bg = "#00af89", fg = "black" },
        itemActive = { bg = "#14866d", fg = "white" }
      }
    },
    ["Aide:Diverses aides à la contribution"] = {
      title = "Aide diverse",
      index = 13,
      subGroups = {
        ["Pages particulières"] = { from = 1, to = 5 },
        ["Outils"] = { from = 6, to = 9 },
      },
      items = {
        ["Aide:Espace de noms"] = { title = "Espace de noms", index = 1 },
        ["Aide:Page d’utilisateur"] = { title = "Page d’utilisateur", index = 2 },
        ["Aide:Pages de discussion"] = { title = "Pages de discussion", index = 3 },
        ["Aide:Redirections"] = { title = "Redirections", index = 4 },
        ["Wiktionnaire:Homonymie"] = { title = "Pages d’homonymie", index = 5 },
        ["Aide:Liens"] = { title = "Liens", index = 6 },
        ["Aide:Modèles"] = { title = "Modèles", index = 7 },
        ["Aide:Gadgets"] = { title = "Gadgets", index = 8 },
        ["Aide:Jargon"] = { title = "Jargon", index = 9 },
      },
      colors = {
        normal = { bg = "#d5fdf4", fg = "black" },
        selected = { bg = "#00af89", fg = "black" },
        itemActive = { bg = "#14866d", fg = "white" }
      }
    },
    ["Wiktionnaire:Technique et développement"] = {
      title = "Développement",
      index = 14,
      subGroups = {
        ["Modules"] = { from = 1, to = 4 },
        ["Javascript"] = { from = 5, to = 5 },
      },
      items = {
        ["Wiktionnaire:Modules"] = { title = "Conventions", index = 1 },
        ["Aide:Modules"] = { title = "Aide", index = 2 },
        ["Wiktionnaire:Tests unitaires"] = { title = "Test unitaires", index = 3 },
        ["Aide:Tests unitaires"] = { title = "Aide des tests unitaires", index = 4 },
        ["Wiktionnaire:Gadgets"] = { title = "Gadgets", index = 5 },
      },
      colors = {
        normal = { bg = "#d5fdf4", fg = "black" },
        selected = { bg = "#00af89", fg = "black" },
        itemActive = { bg = "#14866d", fg = "white" }
      }
    },
  }
}
