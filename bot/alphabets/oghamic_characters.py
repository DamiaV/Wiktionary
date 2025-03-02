import bot.alphabets.models as models
from bot import unicode as uu
import pywikibot as pwb


def get_page(letter, name, transliterations, prons, aicme):
    code_point = uu.get_codepoints(letter)[0]
    block = models.get_models(letter, as_list=True)[0]
    trans_list = ', '.join([f"''{trans}''" for trans in transliterations])
    prons_list = ' <small>ou</small> '.join([f'{{{{pron|{pron}|pgl}}}}' for pron in prons])

    template = f"""\
{{|width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;margin-bottom:0.5em;background:transparent"
|-valign="top"
|style="padding-right:0.5em"|
__TOC__
|
{{{{alphabet oghamique}}}}
|}}

== {{{{caractère}}}} ==
'''{letter}'''
# Lettre ogham ''[[{name}]]''{{{{réf|1}}}}. {{{{lien|Unicode|fr}}}} : {code_point}.

=== {{{{S|références}}}} ===
* {{{{RÉF|1}}}} {{{{R:Ogham_Liberty}}}}
{block}

== {{{{langue|pgl}}}} ==
=== {{{{S|étymologie}}}} ===
: {{{{ébauche-étym|pgl}}}}

=== {{{{S|lettre|pgl}}}} ===
'''{letter}''' {trans_list}{{{{réf|2}}}} {prons_list}{{{{réf|3}}}}
# Lettre ''{name}''{{{{réf|4}}}} de l’alphabet {{{{lien|ogham|fr}}}}. \
Elle fait partie de l’{{{{lien|aicme|fr}}}} {aicme}.

=== {{{{S|références}}}} ===
* {{{{RÉF|2}}}} {{{{R:Summerlands Ogham}}}}
* {{{{RÉF|3}}}} {{{{R:Omniglot Ogham}}}}
* {{{{RÉF|4}}}} {{{{R:Ogham_Liberty}}}}
"""
    return template


if __name__ == '__main__':
    # letter = 'ᚚ'
    # name = 'peith'
    # prons = ''
    # trans = 'p'
    # aicme = ''
    # print(get_page(letter, name, trans.split(';'), prons.split(';'), aicme))
    site = pwb.Site()
    with open('alphabets/oghamic_letters.csv', encoding='utf-8') as f:
        for line in f.readlines()[1:]:
            letter, name, prons, trans, aicme = line.strip().split(',')
            if name == 'peith':
                break
            page = pwb.Page(site, letter)
            page.text = get_page(letter, name, trans.split(';'), prons.split(';'), aicme)
            msg = 'Création' if not page.exists() else 'Modification'
            page.save(summary=f'{msg} automatique', watch=False, botflag=True)
