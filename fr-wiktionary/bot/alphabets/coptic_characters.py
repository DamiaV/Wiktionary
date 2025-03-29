import pywikibot as pwb

import bot.alphabets.models as models
from bot import unicode as uu, numbers_


def get_page(letter, maj, name, transliteration, prons, index, index2, vowel, value):
    letter = letter.upper() if maj else letter.lower()
    code_point = uu.get_codepoints(letter)[0]
    blocks_list = '\n'.join(models.get_models(letter, as_list=True))
    prons_list = ' <small>ou</small> '.join([f'{{{{pron|{pron}|cop}}}}' for pron in prons])
    index = numbers_.get_number_name(index, numbers_.LANG_FR, ordinal=True, case=numbers_.FEMININE).capitalize()
    index2 = numbers_.get_number_name(index2, numbers_.LANG_FR, ordinal=True, case=numbers_.FEMININE)

    template = f"""\
{{|width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;margin-bottom:0.5em;background:transparent"
|-valign="top"
|style="padding-right:0.5em"|
__TOC__
|
{{{{alphabet copte}}}}
|}}

== {{{{caractère}}}} ==
{{{{casse|{letter.lower()}|{letter.upper()}}}}}
'''{letter}'''
# Lettre {{{{lien|m{'aj' if maj else 'in'}uscule|fr}}}} copte ''{name}''. {{{{lien|Unicode|fr}}}} : {code_point}.

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Alphabet copte}}}}

=== {{{{S|références}}}} ===
{blocks_list}

== {{{{langue|cop}}}} ==
=== {{{{S|étymologie}}}} ===
: {{{{ébauche-étym|cop}}}}

=== {{{{S|lettre|cop}}}} ===
{{{{lettre copte|{letter}|{name}|{value}}}}}
'''{letter}''' ''{transliteration}'' {prons_list}
# {index} lettre et {index2} {'voyelle' if vowel else 'consonne'} de l’alphabet {{{{lien|copte|fr}}}} \
({{{{lien|m{'aj' if maj else 'in'}uscule|fr}}}}).

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Alphabet copte}}}}
"""
    return template


if __name__ == '__main__':
    def create_page(letter, value, name, trans, prons, index, index2, vowel, caps):
        page = pwb.Page(site, letter)
        if page.exists():
            print(f'Page {letter} already exists.')
        else:
            page.text = get_page(letter, caps, name, trans, prons, index, index2, vowel, value)
            page.save(summary='Création automatique', watch=False, botflag=True)


    site = pwb.Site()
    with open('alphabets/coptic_letters.csv', encoding='utf-8') as f:
        for line in f.readlines()[1:]:
            maj, mini, value, name, trans, prons, index, index2, vowel = line.strip().split(',')
            index = int(index)
            index2 = int(index2)
            prons = prons.split(';')
            vowel = int(vowel)
            create_page(maj, value, name, trans, prons, index, index2, vowel, True)
            create_page(mini, value, name, trans, prons, index, index2, vowel, False)
