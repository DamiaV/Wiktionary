import pywikibot as pwb

site = pwb.Site()
page = pwb.Page(site, title='Modèle:Documentation/patron')
page.text = """<<noinclude></noinclude>noinclude>{{Documentation}}<<noinclude></noinclude>/noinclude>
<<noinclude></noinclude>includeonly>
<!-- Mettre ici les catégories du modèle -->
<<noinclude></noinclude>/includeonly>
== Usage ==
: Le modèle {{modl|{{<includeonly>subst:</includeonly>BASEPAGENAME}}}} …

== Paramètres ==
{{ébauche-templatedata}}

== Exemples ==

== Voir aussi ==
"""
page.save(summary='Remplacement tableau par modèle d’ébauche')
