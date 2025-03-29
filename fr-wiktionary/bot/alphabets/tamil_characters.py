import re

import pywikibot as pwb

import bot.alphabets.models as models
from bot import unicode as uu


def get_prons(name):
    prons = {
        'k': ('k', 'ɡ', 'x', 'ɣ', 'h'),
        'ṅ': 'ŋ',
        't': ('t̪', 'd̪', 'ð'),
        'c': ('t͡ʃ', 'd͡ʒ', 'ʃ', 'ʒ', 's', 'z'),
        'ñ': 'ɲ',
        'ṭ': ('ʈ', 'ɖ', 'ɽ'),
        'ṇ': 'ɳ',
        'n': 'n̪',
        'p': ('p', 'b', 'β'),
        'j': 'd͡ʒ',
        'y': 'j',
        'r': 'ɾ',
        'v': 'ʋ',
        'ḻ': 'ɻ',
        'ḷ': 'ɭ',
        'ṟ': ('r', 't', 'd'),
        'ṉ': 'n',
        'ś': 't͡ʃ',
        'ṣ': 'ʂ',
        'ai': 'ʌj',
        'au': 'ʌʋ',
        'a': 'ʌ',
        'ā': 'ɑː',
        'ī': 'iː',
        'u': ('u', 'ɯ'),
        'ū': 'uː',
        'ē': 'eː',
        'ō': 'oː',
    }
    pron_list = [name]
    for k, v in prons.items():
        if k not in name:
            continue
        if isinstance(v, tuple):
            pp = []
            for ppp in v:
                pp.extend([p.replace(k, ppp) for p in pron_list])
            pron_list = pp
        else:
            pron_list = [p.replace(k, v) for p in pron_list]
    return pron_list


def get_page(letter, trans, typ, kernel, diacritic, vowel, image='', insert=''):
    code_point_list = ' '.join(uu.get_codepoints(letter))
    block_list = '\n'.join(models.get_models(letter, as_list=True))
    is_symbol = typ == 'sm'
    is_diacritic = typ == 'd'
    is_vowel = typ == 'v'
    is_composed = kernel is not None
    typ, fem = {
        'v': ('Voyelle', True),
        'd': ('Diacritique voyelle', True),
        'c': ('Consonne', True),
        'cg': ('Consonne {{lien|grantha|fr}}', True),
        's': ('Syllabe', True),
        'sg': ('Syllabe {{lien|grantha|fr}}', True),
        'sm': ('Symbole', False),
    }[typ]
    pron_list = ' <small>ou</small> '.join([f'{{{{pron|{p}|ta}}}}' for p in get_prons(trans)]) if not is_symbol else ''
    if is_symbol and ';' in trans:
        trans = "'' ou ''".join(trans.split(';'))
    compos = ''
    if is_composed:
        compos = f' composée de la consonne [[{kernel}]] et de la voyelle [[{vowel}]]' + \
                 (f' ([[{diacritic}]])' if diacritic is not None else '')
    compl = ''
    if is_diacritic:
        compl = f' (forme indépendante : [[{vowel}]])'
    elif is_vowel and diacritic is not None:
        compl = f' (forme diacritique : [[{diacritic}]])'
    if image != '':
        image = f'\n[[{image}]]'
    if insert != '':
        insert = f'\n{insert}\n'

    template = f"""\
{{|width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;margin-bottom:0.5em;background:transparent"
|-valign="top"
|style="padding-right:0.5em"|
__TOC__
|
{{{{alphabet tamoul}}}}
|}}

== {{{{caractère}}}} ==
'''{letter}'''
# {typ} {{{{lien|tamoul{'|dif=tamoule' if fem else ''}|fr}}}} ''{trans}''{compl}{compos}. \
{{{{lien|Unicode|fr}}}} : {code_point_list}.

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Alphasyllabaire tamoul}}}}

=== {{{{S|références}}}} ===
* {{{{R:Omniglot Tamoul}}}}
{block_list}

== {{{{langue|ta}}}} ==
=== {{{{S|étymologie}}}} ===
: {{{{ébauche-étym|ta}}}}

=== {{{{S|lettre|ta}}}} ==={image}
'''{letter}'''{f" ''{trans}'' {pron_list}" if not is_symbol else ''}
# {typ} ''{trans}''{compl}{compos}.
{insert}
=== {{{{S|voir aussi}}}} ===
* {{{{WP|Alphasyllabaire tamoul}}}}

=== {{{{S|références}}}} ===
* {{{{R:Omniglot Tamoul}}}}
"""
    return template


if __name__ == '__main__':
    site = pwb.Site()
    with open('alphabets/tamil_letters.csv', encoding='utf-8') as f:
        vowels = {}
        diacritics = {}
        consonants = {}
        go = False
        for line in f.readlines()[1:]:
            letter, name, typ, other_form = line.strip().split(',')

            if letter == 'க்ஷ':
                go = True

            kernel, diacritic, vowel = (None,) * 3

            if typ == 'v':
                vowels[name] = letter
                if other_form != '':
                    diacritic = other_form
            elif typ == 'd':
                diacritics[name] = letter
                vowel = other_form
            elif typ in ('c', 'cg'):
                consonants[name] = letter
            elif typ in ('s', 'sg'):
                kernel = consonants[name[0 if name[1] != 'ṣ' else slice(2)]]
                v = name[slice(1, len(name)) if name[1] != 'ṣ' else slice(2, len(name))]
                diacritic = diacritics[v] if v in diacritics else None
                vowel = vowels[v]

            if not go:
                continue

            page = pwb.Page(site, letter)
            text = page.text
            if page.exists():
                print(f'Page {letter} already exists.')
                matcher = re.search(r'\[\[(Image:.+?\.gif.+?)]]', text)
                matcher2 = re.search(r'(====? {{S\|(?!étym|lettre)(?:\n|.)+)', text, flags=re.MULTILINE)
                image = matcher.group(1) if matcher is not None else ''
                insert = matcher2.group(1) if matcher2 is not None else ''
                page.text = get_page(letter, name, typ, kernel, diacritic, vowel, image, insert)
            else:
                page.text = get_page(letter, name, typ, kernel, diacritic, vowel)
            page.save(summary='Création/Reformatage automatique', watch=False, botflag=True)
