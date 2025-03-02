import pathlib

import pywikibot as pwb
from pywikibot import config as pwb_config

import bot.alphabets.models as models
from bot import unicode as uu

NAMES = {
    'ᜣ': 'ka',
    'ᜤ': 'ga',
    'ᜥ': 'nga',
    'ᜦ': 'ta',
    'ᜧ': 'da',
    'ᜨ': 'na',
    'ᜩ': 'pa',
    'ᜪ': 'ba',
    'ᜫ': 'ma',
    'ᜬ': 'ya',
    'ᜭ': 'ra',
    'ᜮ': 'la',
    'ᜯ': 'wa',
    'ᜰ': 'sa',
    'ᜱ': 'ha',
    '\u1732': "diacritique ''i''",
    '\u1733': "diacritique ''u''",
    '\u1734': '[[pamudpod#fr|pamudpod]]',
}


def get_page(letter: str, transliteration: str, pron: str, type_: str):
    code_points = ' '.join(uu.get_codepoints(letter))
    blocks_list = '\n'.join(models.get_models(letter, as_list=True))
    chars = list(letter)
    etymology = '{{date|lang=hnn}}'
    if len(chars) == 2:
        syllable, diacritic = chars
        syllable_name = NAMES[syllable]
        diacritic_name = NAMES[diacritic]
        etymology += f" {{{{composé de|{syllable}|sens1=syllabe ''{syllable_name}''" \
                     f'|◌{diacritic}|sens2={diacritic_name}|lang=hnn|m=1}}}}.\n: '

    template = f"""\
== {{{{caractère}}}} ==
{{{{Lang|hnn|'''{letter}'''}}}}
# Lettre hanunóo ''{transliteration}''. {{{{lien|Unicode|fr}}}} : {code_points}.

=== {{{{S|références}}}} ===
{blocks_list}

== {{{{langue|hnn}}}} ==
=== {{{{S|étymologie}}}} ===
: {etymology} {{{{ébauche-étym|hnn}}}}

=== {{{{S|lettre|hnn}}}} ===
{{{{Lang|hnn|'''{letter}'''|tr={transliteration}}}}} {{{{pron|{pron}|hnn}}}}
# {type_.capitalize()} ''{transliteration}''.

=== {{{{S|voir}}}} ===
* {{{{WP|Hanunoo script|lang=en}}}}
{{{{alphasyllabaire hanunóo}}}}
"""
    return template


pwb_config.put_throttle = 0
site = pwb.Site()
uu.ROOT = pathlib.Path('..').absolute()
with open('alphabets/hanunoo_characters.csv', encoding='UTF-8') as f:
    for line in f.readlines()[1:]:
        letter, trans, pron, type_ = line.strip().split(',')
        page = pwb.Page(site, title=letter)
        page.text = get_page(letter, trans, pron, 'voyelle' if type_ == 'v' else 'syllabe')
        page.save(summary='Création automatique.')
