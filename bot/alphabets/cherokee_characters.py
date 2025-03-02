import pywikibot as pwb

import bot.alphabets.models as models
from bot import unicode as uu


def get_prons(name):
    prons = {
        'k': 'kʰ',
        'qu': 'kʰw',
        'tl': 'tɬ',
        'ts': 'ts',
        'g': 'ɡ',
        'h': 'h',
        'l': 'l',
        'm': 'm',
        'n': 'n',
        's': 's',
        'd': 'd',
        't': 't',
        'w': 'w',
        'y': 'j',
        'a': 'ɐ',
        'e': 'e',
        'i': 'i',
        'o': 'o',
        'u': 'u',
        'v': 'ə̃',
    }
    pron = name
    for k, v in prons.items():
        pron = pron.replace(k, v)
    return pron


def get_page(letter, trans, maj):
    letter = letter.upper() if maj else letter.lower()
    code_point = uu.get_codepoints(letter)[0]
    block = models.get_models(letter, as_list=True)[0]

    template = f"""\
{{|width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;margin-bottom:0.5em;background:transparent"
|-valign="top"
|style="padding-right:0.5em"|
__TOC__
|
{{{{alphabet cherokee}}}}
|}}

== {{{{caractère}}}} ==
{{{{casse|{letter.lower()}|{letter.upper()}}}}}
'''{letter}'''
# Lettre {{{{lien|m{'aj' if maj else 'in'}uscule|fr}}}} {{{{lien|cherokee|fr}}}} ''{name}''. \
{{{{lien|Unicode|fr}}}} : {code_point}.

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Syllabaire cherokee}}}}

=== {{{{S|références}}}} ===
* {{{{R:Everson 2013 Cherokee}}}}
* {{{{R:Omniglot Cherokee}}}}
{block}

== {{{{langue|chr}}}} ==
=== {{{{S|étymologie}}}} ===
: {{{{ébauche-étym|chr}}}}

=== {{{{S|lettre|chr}}}} ===
{{{{casse|{letter.lower()}|{letter.upper()}}}}}
'''{letter}''' ''{trans.capitalize() if maj else trans}'' {{{{pron|{get_prons(trans)}|chr}}}}
# Lettre ''{trans}'' de l’alphabet cherokee ({{{{lien|m{'aj' if maj else 'in'}uscule|fr}}}}).

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Syllabaire cherokee}}}}

=== {{{{S|références}}}} ===
* {{{{R:Omniglot Cherokee}}}}
* {{{{R:Everson 2013 Cherokee}}}}
"""
    return template


if __name__ == '__main__':
    def create_page(letter, name, maj):
        letter = letter.upper() if maj else letter.lower()
        page = pwb.Page(site, letter)
        if page.exists():
            print(f'Page {letter} already exists.')
            print(get_page(letter, name, maj))
        else:
            page.text = get_page(letter, name, maj)
            page.save(summary='Création automatique', watch=False, botflag=True)


    site = pwb.Site()
    with open('alphabets/cherokee_letters.csv', encoding='utf-8') as f:
        for line in f.readlines()[1:]:
            letter, name = line.strip().split(',')
            create_page(letter, name, True)
            create_page(letter, name, False)
