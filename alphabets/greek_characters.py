import alphabets.models as models
import unicode.unicode_utils as uu


def get_page(alphabet_base_letter, base_letter, string, french_letter_name, index, index2, vowel,
             base_diacritic_names, maj, ligature, links, sorting_key):
    base_letter = base_letter.title() if maj else base_letter.lower()
    string = string.title() if maj else string.lower()
    ligature = ligature.upper() if maj else ligature.lower()
    code_points = ' '.join(uu.get_codepoints(string))
    base_diacritic_names = '|'.join(base_diacritic_names)
    links = ' '.join([f'{{{{lien|{link}|fr}}}}' for link in links])
    blocks_list = '\n'.join(models.get_models(string, as_list=True))
    if ligature and not links:
        definition = f'[[{ligature[0]}]]-[[{ligature[1]}]] ligaturée ' \
            f'({ligature[1]} dans l’{ligature[0]})'
    elif ligature:
        definition = f'[[{string[0]}]]'
    elif links:
        definition = f'[[{base_letter}]]'
    else:
        definition = f'{{{{lien|{french_letter_name}|fr}}}}. {index.capitalize()} lettre et {index2} ' \
            f'{"voyelle" if vowel else "consonne"} de l’{{{{lien|alphabet grec|fr}}}}'
    case = f'{string.lower()}|{string.title()}' if ligature or sorting_key else ''
    if len(links) != 0:
        definition += ' ' + links

    template = f"""{{{{voir/{(base_letter if not ligature else ligature).lower()}}}}}
{{|width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;margin-bottom:0.5em;background:transparent"
|-valign="top"
|style="padding-right:0.5em"|
__TOC__
|
{{{{alphabet grec|{alphabet_base_letter.lower()}|{base_diacritic_names}}}}}
|}}

== {{{{caractère}}}} ==
{{{{casse{'|' + case if case else ''}}}}}
'''{string}'''
# Lettre {{{{lien|{'majuscule' if maj else 'minuscule'}|fr}}}} grecque {definition}. \
{{{{lien|Unicode|fr}}}} : {code_points}.

=== {{{{S|voir aussi}}}} ===
* {{{{WP}}}}
* {{{{WV|Grammaire/Grec}}}}

=== {{{{S|références}}}} ===
{blocks_list}
"""
    if sorting_key:
        template += f'\n{{{{clé de tri|{(alphabet_base_letter if not ligature else ligature).lower()}}}}}\n'
    return template


if __name__ == '__main__':
    letter = 'Ϳ'
    french_letter_name = 'yot'
    index = 'vingt-quatrième'
    index2 = 'septième'
    vowel = True
    alphabet_base_letter = 'Ϳ'
    base_letter = 'Ϳ'
    base_diacritic_names = []
    links = []
    ligature = ''
    sorting_key = False

    print(get_page(alphabet_base_letter, base_letter, letter, french_letter_name, index, index2, vowel,
                   base_diacritic_names, False, ligature, links, sorting_key))
    print()
    print(get_page(alphabet_base_letter, base_letter, letter, french_letter_name, index, index2, vowel,
                   base_diacritic_names, True, ligature, links, sorting_key))
