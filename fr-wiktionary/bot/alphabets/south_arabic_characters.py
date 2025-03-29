import pywikibot as pwb

from bot import unicode as uu


def get_page(letter, letter_name, trans, pron):
    code_points = ' '.join(uu.get_codepoints(letter))
    transcriptions = ', '.join([f'{{{{graphie|{t}}}}}' for t in trans.split(';')])
    return f"""\
== {{{{caractère}}}} ==
'''{letter}'''
# Lettre ''{letter_name}'' de l’[[alphabet sudarabique#fr|alphabet sudarabique]]. \
{{{{lien|Unicode|fr}}}} : {code_points}.

==== {{{{S|notes}}}} ====
: Cette lettre représentait le son {{{{pron-API|\\{pron}\\}}}} et est transcrite {transcriptions}.

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Alphabet sudarabique}}}}
{{{{alphabet sudarabique}}}}

=== {{{{S|références}}}} ===
* {{{{R:Omniglot Sudarabique}}}}
* {{{{R:Bloc Unicode}}}}
"""


if __name__ == '__main__':
    site = pwb.Site()

    with open('south_arabic_letters.csv', mode='r', encoding='UTF-8') as f:
        for line in f.readlines()[1:]:
            letter, name, trans, pron = line.strip().split(',')
            page = pwb.Page(site, title=letter)
            page.text = get_page(letter, name, trans, pron)
            page.save(summary='Création automatique depuis [[w:en:Ancient South Arabian script#Letters]]')
