import json

import pywikibot as pwb

import bot.alphabets.models as models
from bot import unicode as uu, numbers_ as nb

# nullable: languages.localized name, languages.value, languages.index, asomtavruli, nuskhuri, ISO 9984 trans
# optional: languages.asomtavruli name, languages.nuskhuri name, languages.additional sections
# types: letters, diacriticized letters, digrams, trigrams

DIACRITICS = {
    '\u0302': 'circonflexe',
    '\u0304': 'macron',
    '\u0308': 'tréma',
}

LETTER = 0
ACCENTUATED = 1
N_GRAM = 2


def letter_type(letter):
    if len(letter) == 1:
        return LETTER
    elif len(letter) > 1:
        if letter[1] in DIACRITICS:
            return ACCENTUATED
        else:
            return N_GRAM
    else:
        return None


def get_alphabet(asomtavruli, nuskhuri, mtavruli, mkhedruli, letter):
    if letter == asomtavruli:
        alphabet = 'asomtavruli'
    elif letter == nuskhuri:
        alphabet = 'nuskhuri'
    elif letter == mtavruli:
        alphabet = 'mtavruli'
    elif letter == mkhedruli:
        alphabet = 'mkhedruli'
    else:
        raise ValueError()
    return alphabet


def get_case(asomtavruli, nuskhuri, mtavruli, mkhedruli):
    if asomtavruli and nuskhuri:
        return f'\n{{{{casse/géorgien|{mtavruli}|{mkhedruli}|{asomtavruli}|{nuskhuri}}}}}'
    else:
        return f'\n{{{{casse/géorgien|{mtavruli}|{mkhedruli}}}}}'


def get_character_section(asomtavruli, nuskhuri, mtavruli, mkhedruli, letter, name, additional):
    code_points = ' '.join(uu.get_codepoints(letter))
    blocks_list = '\n'.join(models.get_models(letter, as_list=True))
    l_type = letter_type(letter)
    if l_type == LETTER:
        alphabet = get_alphabet(asomtavruli, nuskhuri, mtavruli, mkhedruli, letter)
        definition = f"''{name.capitalize()}'', lettre{' additionnelle' if additional else ''} " \
                     f"de l’alphabet géorgien {{{{lien|{alphabet}|fr}}}}"
    elif l_type == ACCENTUATED:
        definition = name
    else:
        raise ValueError(f'Illegal entry type <{l_type}>.')
    return f"""\
== {{{{caractère}}}} =={get_case(asomtavruli, nuskhuri, mtavruli, mkhedruli)}
'''{letter}'''
# {definition}. {{{{lien|Unicode|fr}}}} : {code_points}.

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Alphabet géorgien#Composition|Alphabet géorgien}}}}
{{{{alphabet géorgien|{mkhedruli}|{'|'.join([n for d, n in DIACRITICS.items() if d in letter])}}}}}

=== {{{{S|références}}}} ===
{blocks_list}
* {{{{R:Omniglot Géorgien}}}}
"""


def get_section(asomtavruli, nuskhuri, mtavruli, mkhedruli, letter, localized_name, name, iso_trans, language_code,
                language_name, prons, value, archaic, index, trans):
    trans_list = ', '.join(trans)
    prons_list = ' <small>ou</small> '.join([f'{{{{pron|{pron}|{language_code}}}}}' for pron in prons])
    note = '\n: Cette lettre n’est plus utilisée de nos jours.' if archaic else ''
    if value:
        note += f'\n: Valeur numérique : {value}'
    index = nb.get_number_name(index, nb.LANG_FR, ordinal=True, case=nb.FEMININE) if index else 'ancienne'
    loc_name = f" (« {{{{lien|{localized_name}|{language_code}}}}} »)" if localized_name else ''
    alphabet = get_alphabet(asomtavruli, nuskhuri, mtavruli, mkhedruli, letter)

    return f"""\
== {{{{langue|{language_code}}}}} ==
=== {{{{S|étymologie}}}} ===
: {{{{ébauche-étym|{language_code}}}}}

=== {{{{S|lettre|{language_code}}}}} ==={get_case(asomtavruli, nuskhuri, mtavruli, mkhedruli)}
'''{letter}''' {prons_list}
# ''{name.capitalize()}''{loc_name}, {index} lettre de l’alphabet {{{{lien|{language_name.lower()}|fr}}}} \
({{{{lien|{alphabet}|fr}}}}).

==== {{{{S|notes}}}} ===={note}
: Translitérations :
:* ISO 9984 : {iso_trans if iso_trans else "''non défini''"}
:* Locale : {trans_list}

=== {{{{S|voir aussi}}}} ===
{{{{alphabet géorgien en {language_name.lower()}}}}}

=== {{{{S|références}}}} ===
* {{{{R:Omniglot {language_name.capitalize()}{'2' if language_code == 'ka' else ''}}}}}
"""


def has_georgian(languages):
    for language in languages:
        if language['language id'] == 0:
            return True
    return False


if __name__ == '__main__':
    def create_page(site, letter_obj, letter, languages):
        asomtavruli = letter_obj['asomtavruli']
        nuskhuri = letter_obj['nuskhuri']
        mtavruli = letter_obj['mtavruli']
        mkhedruli = letter_obj['mkhedruli']
        name = letter_obj['name']
        iso_trans = letter_obj['ISO 9984 trans']
        letter_languages = sorted(letter_obj['languages'], key=lambda v: languages[v['language id']]['name'])
        char_section = ''
        l_type = letter_type(mkhedruli)
        if l_type in [LETTER, ACCENTUATED]:
            additional = not has_georgian(letter_languages)
            char_section = get_character_section(asomtavruli, nuskhuri, mtavruli, mkhedruli, letter, name, additional)
        sections = []
        for language_obj in letter_languages:
            if letter in [asomtavruli, nuskhuri] and languages[language_obj['language id']]['name'] != 'Géorgien':
                continue
            if letter == asomtavruli and 'asomtavruli name' in language_obj:
                localized_name = language_obj['asomtavruli name']
            elif letter == nuskhuri and 'nuskhuri name' in language_obj:
                localized_name = language_obj['nuskhuri name']
            else:
                localized_name = language_obj['localized name']
            lang = languages[language_obj['language id']]
            language_code = lang['code']
            language_name = lang['name']
            prons = language_obj['prons']
            value = language_obj['value']
            archaic = language_obj['archaic']
            index = language_obj['index']
            trans = language_obj['trans']
            sections.append(get_section(asomtavruli, nuskhuri, mtavruli, mkhedruli, letter, localized_name, name,
                                        iso_trans, language_code, language_name, prons, value, archaic, index, trans))
        page = pwb.Page(site, letter)
        text = char_section + '\n' + '\n'.join(sections)
        if page.exists():
            print(f'Page "{letter}" already exists')
            print(text)
            print()
        else:
            page.text = text
            page.save(summary='Création automatique', watch=False, botflag=True)


    site = pwb.Site()
    with open('alphabets/georgian_letters.json', encoding='UTF-8') as f:
        data = json.load(f)
        letters = data['letters']
        languages = data['languages']
        for letter_object in letters:
            for letter in [letter_object['asomtavruli'], letter_object['nuskhuri'], letter_object['mtavruli'],
                           letter_object['mkhedruli']]:
                if letter:
                    create_page(site, letter_object, letter, languages)
