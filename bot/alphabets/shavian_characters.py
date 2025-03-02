import pywikibot as pwb

from bot import unicode as uu


def get_page(letter, name):
    code_point = uu.get_codepoints(letter)[0]

    template = f"""\
== {{{{caractère}}}} ==
'''{letter}'''
# ''{{{{lien|{name}|en}}}}'', lettre de l’[[alphabet shavien]]. [[Unicode#fr|Unicode]]&nbsp;: {code_point}.

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Alphabet shavien}}}}
{{{{alphabet shavien}}}}

=== {{{{S|références}}}} ===
* {{{{R:Omniglot Shavien}}}}
* {{{{R:Bloc Unicode}}}}
"""
    return template


def get_page2(letter, pron, name):
    prons = pron.split(';')
    pron1 = f'{{{{pron|{prons[0]}|en}}}}'
    if len(prons) > 1:
        pron1 += f' <small>ou</small> {{{{pron|{prons[1]}|en}}}}'
    pron2 = f'{{{{pron-API|/{prons[0]}/}}}}'
    if len(prons) > 1:
        pron2 += f' et {{{{pron-API|/{prons[1]}/}}}}'

    s = 's' if len(prons) > 1 else ''

    return f"""
[[Catégorie:Alphabet shavien]]

== {{{{langue|en}}}} ==
=== {{{{S|étymologie}}}} ===
: {{{{date|1958}}}} Lettre créée par Kingsley {{{{pc|Read}}}} lors d’un concours financé par \
{{{{nom w pc|George Bernard|Shaw}}}} pour le développement d’un nouvel [[alphabet#fr|alphabet]] pour l’anglais.

=== {{{{S|lettre|en}}}} ===
'''{letter}''' {pron1}
# ''{{{{lien|{name.title()}|en}}}}'', lettre de l’alphabet shavien pour représenter le{s} phonème{s} {pron2}.

=== {{{{S|références}}}} ===
* {{{{R:Omniglot Shavien}}}}
"""


def get_page3(text, name):
    text = text.replace(f"# ''{{{{lien|{name}|en}}}}'',", f"# ''{{{{lien|{name.lower()}|dif={name}|en}}}}'',")
    text = text.replace('l’alphabet shavien', 'l’[[alphabet shavien#fr|alphabet shavien]]')
    text = text.replace(' :', '&nbsp;:')
    return text


if __name__ == '__main__':
    site = pwb.Site()
    with open('alphabets/shavian_characters.csv', encoding='utf-8') as f:
        for line in f.readlines()[1:]:
            letter, pron, name = line.strip().split(',')
            page = pwb.Page(site, letter)
            page.text = get_page3(page.text, name)
            page.save(summary='Retouches')
