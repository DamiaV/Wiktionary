import pywikibot as pwb

site = pwb.Site()
pwb.config.put_throttle = 0

template = """
== {{{{caractère}}}} ==
{{{{casse|{minus}|{caps}}}}}
'''{char}'''
# Lettre{supp} ''{name}'' {maj}uscule de l’[[alphabet adlam#fr|alphabet adlam]]. Code [[Unicode]] : U+{code}

=== {{{{S|étymologie}}}} ===
: {{{{date|1989|lang=ff}}}}{{{{R|letterform archive|{{{{lien web\
|titre=Inventing the Adlam Script / Designing Type for a Society in Flux|site=Letterform Archive|date=19 mars 2019\
|auteur=Abdoulaye Barry, Ibrahima Barry, Mark Jamra et Neil Patel|url=https://letterformarchive.org/events/view/\
inventing-the-adlam-script-designing-type-for-a-society-in-flux}}}}}}}} Lettre inventée par deux enfants \
[[guinéen#fr|guinéens]], Ibrahima et Abdoulaye Barry, en dessinant des symboles [[au hasard#fr|au hasard]].\
{{{{R|letterform archive}}}}

=== {{{{S|références}}}} ===
==== {{{{S|sources}}}} ====
{{{{Références}}}}

==== {{{{S|bibliographie}}}} ====
* {{{{R:Bloc Unicode}}}}

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Alphabet adlam}}}}
{{{{alphabet adlam}}}}

== {{{{langue|ff}}}} ==
=== {{{{S|étymologie}}}} ===
: {{{{date|1989|lang=ff}}}}{{{{R|letterform archive|{{{{lien web\
|titre=Inventing the Adlam Script / Designing Type for a Society in Flux|site=Letterform Archive|date=19 mars 2019\
|auteur=Abdoulaye Barry, Ibrahima Barry, Mark Jamra et Neil Patel|url=https://letterformarchive.org/events/view/\
inventing-the-adlam-script-designing-type-for-a-society-in-flux}}}}}}}} Lettre inventée par deux enfants \
[[guinéen#fr|guinéens]], Ibrahima et Abdoulaye Barry, en dessinant des symboles [[au hasard#fr|au hasard]].\
{{{{R|letterform archive}}}}

=== {{{{S|lettre|ff}}}} ===
{{{{casse|{minus}|{caps}}}}}
{{{{Lang|ff|'''{char}'''|tr={latin}}}}} {{{{pron|{pron}|ff}}}}
# Lettre{supp} ''{name}'' {maj}uscule de l’[[alphabet adlam#fr|alphabet adlam]].
#* {{{{ébauche-exe|ff}}}}

=== {{{{S|références}}}} ===
==== {{{{S|sources}}}} ====
{{{{Références}}}}
""".strip()

with open('adlam_characters.csv', encoding='UTF-8') as f:  # TODO 0 cooldown
    for line in f.readlines()[1:]:
        caps, minus, latin, name, pron, supplement = line.strip().split(',')
        latin = ' <small>ou</small> '.join(latin.split('/'))
        pron = '|ff}} <small>ou</small> {{pron|'.join(pron.split('/'))
        supplement = int(supplement)
        caps_template = template.format(char=caps, name=name, latin=latin, caps=caps, minus=minus, pron=pron,
                                        supp=' supplémentaire' if supplement else '', maj='maj',
                                        code=hex(ord(caps))[2:].upper().rjust(4, '0'))
        minus_template = template.format(char=minus, name=name, latin=latin, caps=caps, minus=minus, pron=pron,
                                         supp=' supplémentaire' if supplement else '', maj='min',
                                         code=hex(ord(minus))[2:].upper().rjust(4, '0'))
        caps_page = pwb.Page(site, title=caps)
        caps_page.text = caps_template
        caps_page.save(summary='Création automatique')
        minus_page = pwb.Page(site, title=minus)
        minus_page.text = minus_template
        minus_page.save(summary='Création automatique')
