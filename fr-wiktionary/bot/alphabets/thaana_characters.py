import itertools as it

import pywikibot as pwb

import bot.alphabets.models as models
from bot import unicode as uu, numbers_ as nb, csv


def get_page(letter, thaana_name, name, trans, prons, index, typ, note, supp, etym):
    code_points = ' '.join(uu.get_codepoints(letter))
    blocks_list = '\n'.join(models.get_models(letter, as_list=True))
    trans_list = ', '.join([f"''{t}''" for t in trans])
    pron_list = ' <small>ou</small> '.join([f'{{{{pron|{p}|dv}}}}' for p in prons])
    if index is not None:
        index_t = nb.get_number_name(index, lang=nb.LANG_FR, ordinal=True, case=nb.FEMININE)
        index_t += ' voyelle ({{lien|diacritique|fr}})' if typ == 0 else ' consonne'
        if supp:
            index_t += ' supplémentaire'
    else:
        index_t = ('voyelle ({{lien|diacritique|fr}})' if typ == 0 else 'consonne')
        if supp:
            index_t += ' supplémentaire'
    if note != '':
        note = f"""
==== {{{{S|notes}}}} ====
: {note}
"""
    etym = '{{ébauche-étym|dv}}' if etym == '' else f'De l’arabe [[{etym}]].'

    char_template, dv_template = f"""\
{{|width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;margin-bottom:0.5em;background:transparent"
|-valign="top"
|style="padding-right:0.5em"|
__TOC__
|
{{{{alphabet thâna}}}}
|}}

== {{{{caractère}}}} ==
'''{letter}'''
# Lettre {{{{lien|thâna|fr}}}} ''{name}''. {{{{lien|Unicode|fr}}}} : {code_points}.

=== {{{{S|références}}}} ===
{blocks_list}
* {{{{R:Omniglot Thâna}}}}
""", f"""
== {{{{langue|dv}}}} ==
=== {{{{S|étymologie}}}} ===
: {etym}

=== {{{{S|lettre|dv}}}} ===
'''{letter}''' {trans_list} {pron_list}
# ''{name.capitalize()}'' ({{{{lien|{thaana_name}|dv}}}}), {index_t} de l’alphabet thâna.
{note}
=== {{{{S|références}}}} ===
* {{{{R:Omniglot Thâna}}}}
"""
    return char_template, dv_template


def get_page2(consonant, vowel, trans_c, trans_v, prons_c, prons_v, note, def2):
    def prod(l1, l2):
        return [''.join(v) for v in it.product(l1, l2)]

    letter = consonant + vowel
    code_points = ' '.join(uu.get_codepoints(letter))
    blocks_list = '\n'.join(models.get_models(letter, as_list=True))
    trans_list = ', '.join([f"''{t}''" for t in prod(trans_c, trans_v)])
    pron_list = ' <small>ou</small> '.join([f'{{{{pron|{p}|dv}}}}' for p in prod(prons_c, prons_v)])
    if def2 != '':
        def2 = f"""
=== {{{{S|nom|dv}}}} ===
'''{letter}''' {trans_list} {pron_list}
# {def2}
"""
    if note != '':
        note = f"""
==== {{{{S|notes}}}} ====
: {note}
"""
    return f"""\
{{|width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;margin-bottom:0.5em;background:transparent"
|-valign="top"
|style="padding-right:0.5em"|
__TOC__
|
{{{{alphabet thâna}}}}
|}}

== {{{{caractère}}}} ==
'''{letter}'''
# Syllabe {{{{lien|thâna|fr}}}} composée de la consonne [[{consonant}]] et de la voyelle [[◌{vowel}]]. \
{{{{lien|Unicode|fr}}}} : {code_points}.

=== {{{{S|références}}}} ===
{blocks_list}
* {{{{R:Omniglot Thâna}}}}

== {{{{langue|dv}}}} ==
=== {{{{S|étymologie}}}} ===
: Syllabe {{{{compos|{consonant}|◌{vowel}|lang=dv|f=1}}}}.

=== {{{{S|lettre|dv}}}} ===
'''{letter}''' {trans_list} {pron_list}
# Syllabe de l’alphabet {{{{lien|thâna|fr}}}}.
{note}{def2}
=== {{{{S|références}}}} ===
* {{{{R:Omniglot Thâna}}}}
"""


if __name__ == '__main__':
    site = pwb.Site()
    r = csv.CSVReader('alphabets/thaana_letters.csv')
    vowels = []
    consonants = []
    for line in r.lines:
        letter = line['letter']

        typ = int(line['type'])
        if typ == 0:
            vowels.append(line)
            letter = '◌' + letter
        else:
            consonants.append(line)

        page = pwb.Page(site, letter)
        if page.exists():
            continue

        note = line['note'] if typ == 1 else 'Les voyelles sont des diacritiques se plaçant sur ' \
                                             'ou sous une consonne pour former une syllabe.'
        supp = 'supp' in note
        index = int(line['index']) if line['index'] != '' else None
        char, dv = get_page(letter, line['thaana name'], line['name'].lower(),
                            line['trans'].replace("'", '&apos;').split('|'), line['prons'].split('|'), index, typ, note,
                            supp, line['etym'])
        if letter == 'ރ':
            i = page.text.index('== {{langue|conv}} ==')
            conv = page.text[i:]
            page.text = char + '\n' + conv + '\n' + dv
        else:
            page.text = char + dv
        # print(page.text)
        # print()
        page.save(summary='Création automatique', watch=False, botflag=True)


    def is_name(c, v):
        letter = c + v
        for item in consonants + vowels:
            if item['thaana name'] == letter:
                return item['letter']
        return False


    for c in consonants:
        for v in vowels:
            note = ''
            if c['note'] != '' and c['letter'] != 'އ':
                note = c['note'].replace('consonne', 'syllabe')
            n = is_name(c['letter'], v['letter'])
            def2 = f'Nom de la lettre {{{{lien|{n}|dv}}}}.' if n else ''

            page = pwb.Page(site, c['letter'] + v['letter'])
            if page.exists():
                continue
            page.text = get_page2(c['letter'], v['letter'], c['trans'].replace("'", '&apos;').split('|'),
                                  v['trans'].replace("'", '&apos;').split('|'), c['prons'].split('|'),
                                  v['prons'].split('|'), note, def2)
            # print(page.text)
            # print()
            page.save(summary='Création automatique', watch=False, botflag=True)
