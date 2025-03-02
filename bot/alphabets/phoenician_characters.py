import pywikibot as pwb

import bot.alphabets.models as models
from bot import unicode as uu


def get_page(letter, name):
    code_point = uu.get_codepoints(letter)[0]
    blocks_list = '\n'.join(models.get_models(letter, as_list=True))

    template = f"""\
{{|width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;margin-bottom:0.5em;background:transparent"
|-valign="top"
|style="padding-right:0.5em"|
__TOC__
|
{{{{alphabet phénicien}}}}
|}}

== {{{{caractère}}}} ==
'''{letter}'''
# Lettre phénicienne {{{{lien|{name}|fr}}}}. {{{{lien|Unicode|fr}}}} : {code_point}.

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Alphabet phénicien}}}}

=== {{{{S|références}}}} ===
{blocks_list}

"""
    return template


if __name__ == '__main__':
    site = pwb.Site()
    with open('alphabets/phoenician_letters.csv', encoding='utf-8') as f:
        for line in f.readlines()[1:]:
            letter, name = line.strip().split(',')
            page = pwb.Page(site, letter)
            page.text = get_page(letter, name) + page.text.replace('[[Catégorie:Alphabet phénicien]]', '')
            page.save(summary='Ajout automatique', watch=False, botflag=True)
