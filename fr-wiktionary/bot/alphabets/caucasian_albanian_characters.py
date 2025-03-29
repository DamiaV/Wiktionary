import pywikibot as pwb

from bot import unicode as uu


def get_page(letter, name, prons, index):
    code_points = ' '.join(uu.get_codepoints(letter))
    prons_list = ' <small>ou</small> '.join([f'{{{{pron|{pron}|xag}}}}' for pron in prons])

    return f"""\
== {{{{caractère}}}} ==
'''{letter}'''
# Lettre albanienne ''{name}''. {{{{lien|Unicode|fr}}}} : {code_points}.

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Alphabet albanien}}}}
{{{{alphabet albanien}}}}

=== {{{{S|références}}}} ===
==== {{{{S|bibliographie}}}} ====
* {{{{R:Omniglot Albanien}}}}
* {{{{R:Bloc Unicode}}}}

== {{{{langue|xag}}}} ==
=== {{{{S|étymologie}}}} ===
: {{{{siècle|IV}}}} ou {{{{siècle|V}}}}{{{{R|Omniglot Albanien}}}} Selon des universitaires arméniens, les lettres de \
l’[[alphabet albanien#fr|alphabet albanien]] auraient été créées par {{{{w|Mesrop Mashtots}}}}, un missionnaire \
arménien.{{{{R|Omniglot Albanien}}}}

=== {{{{S|lettre|xag}}}} ===
'''{letter}''' {prons_list}
# {index.capitalize()} lettre de l’[[alphabet albanien#fr|alphabet albanien]].

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Alphabet albanien}}}}
{{{{alphabet albanien}}}}

=== {{{{S|références}}}} ===
==== {{{{S|sources}}}} ====
{{{{Références}}}}
"""


site = pwb.Site()

with open('caucasian_albanian_letters.csv', encoding='UTF-8') as f:
    for line in f.readlines()[1:]:
        letter, name, sound, index = line.strip().split(',')
        text = get_page(letter, name, sound.split(';'), index)
        page = pwb.Page(site, letter)
        if not page.exists():
            page.text = text
            page.save(summary='Création automatique.')
