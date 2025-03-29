def get_page(letter, value, index, thousands, unknown_etym):
    if unknown_etym:
        etym = '{{ébauche-étym|el}}'
    else:
        etym = f'De [[{letter}]], {index} lettre de l’{{{{lien|alphabet grec|fr}}}}, '
        if not thousands:
            etym += 'suivie d’une {{lien|keréa|fr}}, signe terminant les nombres.'
        else:
            etym += 'précédée d’une {{lien|aristerí keréa|fr}}, signe multipliant la valeur par 1000.'

    return f"""\
== {{{{langue|el}}}} ==
=== {{{{S|étymologie}}}} ===
: {etym}

=== {{{{S|numéral|el}}}} ===
'''{'͵' if thousands else ''}{letter}{'ʹ' if not thousands else ''}'''
# Symbole ayant la valeur [[{value * (1000 if thousands else 1)}]] en {{{{lien|numération|fr}}}} \
{{{{lien|alphabétique|fr}}}}.

==== {{{{S|vocabulaire}}}} ====
{{{{numération grecque}}}}

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Numération grecque#Numération alphabétique|Numération grecque}}}}
"""


letter = 'Ϡ'
value = 900
index = ''
unknown_etym = True

print(get_page(letter, value, index, True, unknown_etym))
print()
print(get_page(letter, value, index, False, unknown_etym))
