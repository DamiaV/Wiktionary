import bot.alphabets.models as models
from bot import unicode as uu


def get_page(letter, maj, armenian_name, names, transliterations, prons, index, index2, vowel, value):
    letter = letter.upper() if maj else letter.lower()
    code_points = ' '.join(uu.get_codepoints(letter))
    blocks_list = '\n'.join(models.get_models(letter, as_list=True))
    names_list = '/'.join([f"''{name}''" for name in names])
    transliterations = ', '.join([f"''{t.upper() if maj else t.lower()}''" for t in transliterations])
    prons_list = ' <small>ou</small> '.join([f'{{{{pron|{pron}|hy}}}}' for pron in prons])

    template = f"""\
{{|width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;margin-bottom:0.5em;background:transparent"
|-valign="top"
|style="padding-right:0.5em"|
__TOC__
|
{{{{alphabet arménien}}}}
|}}

== {{{{caractère}}}} ==
{{{{casse}}}}
'''{letter}'''
# Lettre {{{{lien|m{'aj' if maj else 'in'}uscule|fr}}}} arménienne {names_list}. {{{{lien|Unicode|fr}}}} : \
{code_points}.

=== {{{{S|voir aussi}}}} ===
* {{{{WP}}}}

=== {{{{S|références}}}} ===
{blocks_list}

== {{{{langue|hy}}}} ==
=== {{{{S|étymologie}}}} ===
: {{{{ébauche-étym|hy}}}}

=== {{{{S|lettre|hy}}}} ===
{{{{lettre arménienne|{letter}|{armenian_name}|{'/'.join(names)}|{value}}}}}
'''{letter}''' {transliterations} {prons_list}
# {index.capitalize()} lettre et {index2} {'voyelle' if vowel else 'consonne'} de l’alphabet {{{{lien|arménien|fr}}}} \
({{{{lien|m{'aj' if maj else 'in'}uscule|fr}}}}).

=== {{{{S|voir aussi}}}} ===
* {{{{WP}}}}
"""
    return template


if __name__ == '__main__':
    letter = 'և'
    transliterations = ['f']
    armenian_name = 'եւ'
    names = ['ew', 'ev', 'yev']
    prons = ['f']
    index = ''
    index2 = ''
    vowel = False
    value = '–'
    print(get_page(letter, False, armenian_name, names, transliterations, prons, index, index2, vowel, value))
    print()
    print(get_page(letter, True, armenian_name, names, transliterations, prons, index, index2, vowel, value))
