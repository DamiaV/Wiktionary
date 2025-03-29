import pywikibot as pwb

import bot.alphabets.models as models
from bot import unicode as uu, numbers_ as nb


def get_page(letter, maj, name, trans, french_name, cyr_equiv, lat_equiv, prons, index, index2, vowel, value):
    letter = letter.upper() if maj else letter.lower()
    code_points = ' '.join(uu.get_codepoints(letter))
    blocks_list = '\n'.join(models.get_models(letter, as_list=True))
    prons_list = ' <small>ou</small> '.join([f'{{{{pron|{pron}|cu}}}}' for pron in prons])

    template = f"""\
{{|width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;margin-bottom:0.5em;background:transparent"
|-valign="top"
|style="padding-right:0.5em"|
__TOC__
|
{{{{alphabet glagolitique}}}}
|}}

== {{{{caractère}}}} ==
{{{{casse|{letter.lower()}|{letter.upper()}}}}}
'''{letter}'''
# Lettre {{{{lien|m{'aj' if maj else 'in'}uscule|fr}}}} glagolitique {{{{lien|{french_name}|fr}}}} \
({{{{lien|{name}|cu}}}}, ''{trans}''). {{{{lien|Unicode|fr}}}} : {code_points}.

=== {{{{S|voir aussi}}}} ===
* {{{{WP}}}}

=== {{{{S|références}}}} ===
* {{{{R:Omniglot Glagolitique}}}}
{blocks_list}
* {{{{R:Unicode Table|{letter}}}}}

== {{{{langue|cu}}}} ==
=== {{{{S|étymologie}}}} ===
: {{{{ébauche-étym|cu}}}}

=== {{{{S|lettre|cu}}}} ===
{{{{casse|{letter.lower()}|{letter.upper()}}}}}
{{{{lettre glagolitique|{letter}|{name}|{trans}|{cyr_equiv[0]}|{lat_equiv}|{value}\
{'|equiv-c2=' + cyr_equiv[1] if len(cyr_equiv) != 1 else ''}}}}}
'''{letter}''' ''{lat_equiv.capitalize() if maj else lat_equiv.lower()}'' {prons_list}
# [[{french_name}#fr|{french_name.capitalize()}]], {index} lettre et {index2} {'voyelle' if vowel else 'consonne'} \
de l’alphabet {{{{lien|glagolitique|fr}}}} ({{{{lien|m{'aj' if maj else 'in'}uscule|fr}}}}).

=== {{{{S|voir aussi}}}} ===
* {{{{WP}}}}

=== {{{{S|références}}}} ===
* {{{{R:Omniglot Glagolitique}}}}
* {{{{R:Unicode Table|{letter}}}}}
"""
    return template


if __name__ == '__main__':
    with open('alphabets/glagolitic_letters.csv', encoding='UTF-8') as f:
        def create_page(letter, maj, name, trans, french_name, cyr_equiv, lat_equiv, prons, index, index2, vowel,
                        value):
            page = pwb.Page(site, letter.upper() if maj else letter.lower())
            page.text = get_page(letter, maj, name, trans, french_name, cyr_equiv, lat_equiv, prons, index, index2,
                                 vowel, value)
            page.save(summary='Création automatique', watch=False, botflag=True)


        site = pwb.Site()
        for line in f.readlines()[1:]:
            letter, glago_name, name_trans, french_name, prons, vowel, i, j, value, cyrillic_equiv, latin_equiv = \
                line.strip().split(',')
            prons = prons.split(';')
            vowel = int(vowel)
            index = nb.get_number_name(int(i), nb.LANG_FR, ordinal=True, case=nb.FEMININE)
            index2 = nb.get_number_name(int(j), nb.LANG_FR, ordinal=True, case=nb.FEMININE)
            cyrillic_equiv = cyrillic_equiv.split(';')
            create_page(letter, False, glago_name, name_trans, french_name, cyrillic_equiv, latin_equiv, prons, index,
                        index2, vowel, value)
            create_page(letter, True, glago_name, name_trans, french_name, cyrillic_equiv, latin_equiv, prons, index,
                        index2, vowel, value)
