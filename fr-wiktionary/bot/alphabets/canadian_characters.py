import pywikibot as pwb

import bot.alphabets.models as models
from bot import unicode as uu


def get_page(letter, name):
    code_point = uu.get_codepoints(letter)[0]
    blocks_list = '\n'.join(models.get_models(letter, as_list=True))

    template = f"""\
== {{{{caractère}}}} ==
'''{letter}'''
# {name}. {{{{lien|Unicode|fr}}}} : {code_point}.

=== {{{{S|références}}}} ===
{blocks_list}
* {{{{R:Unicode Table|{letter}}}}}
[[Catégorie:Syllabaires autochtones canadiens]]
"""
    return template


if __name__ == '__main__':
    site = pwb.Site()
    with open('alphabets/canadian_letters.csv', encoding='utf-8') as f:
        for line in f.readlines()[1:]:
            letter, name = line.strip().split(',')
            page = pwb.Page(site, letter)
            text = get_page(letter, name)
            if page.exists():
                t = page.text
                see_also = ''
                if t.startswith('{{voir|'):
                    i = t.index('\n')
                    see_also = t[:i + 1]
                    t = t[i + 1:]
                if '== {{langue|' in t:
                    print(letter)
                    i = t.index('== {{langue|')
                    if '== {{caractère}} ==' in t:
                        text += '\n' + t[i:]
                    else:
                        text += '\n' + t
                text = see_also + text
            page.text = text
            page.save(summary='Ajout automatique', watch=False, botflag=True)
