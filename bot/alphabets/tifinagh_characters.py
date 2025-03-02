import bot.alphabets.models as models
from bot import unicode as uu


def get_page(letter, names, trans, prons, arabic):
    code_point = uu.get_codepoints(letter)[0]
    block = models.get_models(letter, as_list=True)[0]
    names_list = ' ou '.join([f'{{{{lien|{name}|fr}}}}' for name in names])
    trans_list = '/'.join(trans)
    prons_list = '/'.join(prons)
    arabic_list = '/'.join(arabic)

    template = f"""\
{{|width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;margin-bottom:0.5em;background:transparent"
|-valign="top"
|style="padding-right:0.5em"|
__TOC__
|
{{{{alphabet tifinagh}}}}
|}}

== {{{{caractère}}}} ==
{{{{lettre tifinaghe|{letter}|{names[0]}|trlatin={trans_list}|trapi={prons_list}|trarabe={arabic_list}\
{f'|nom2={names[1]}' if len(names) > 1 else ''}}}}}
'''{letter}'''
# Lettre tifinaghe {names_list}. {{{{lien|Unicode|fr}}}} : {code_point}.

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Tifinagh#Normalisation internationale (Unicode)|Normalisation Unicode du Tifinagh}}}}

=== {{{{S|références}}}} ===
{block}
"""
    return template


if __name__ == '__main__':
    char = '⵿'
    name = 'liant de consonnes'
    trans = ''
    prons = ''
    arabic = ''
    print(get_page(char, name.split(';'), trans.split(';'), prons.split(';'), arabic.split(';')))
    # site = pwb.Site()
    # with open('alphabets/tifinagh_letters.csv', encoding='utf-8') as f:
    #     ok = False
    #     for line in f.readlines()[1:]:
    #         char, trans, prons, arabic, name = line.rstrip().split(',')
    #         if char == 'ⵯ':
    #             break
    #         page = pwb.Page(site, char)
    #         page.text = get_page(char, name.split(';'), trans.split(';'), prons.split(';'), arabic.split(';'))
    #         page.save(summary='Création automatique', watch=False, botflag=True)
