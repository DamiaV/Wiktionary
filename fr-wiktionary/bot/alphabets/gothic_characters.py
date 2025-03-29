import bot.alphabets.models as models
from bot import unicode as uu


def get_page(letter, gotic_name, name, transliteration, pron, index, index2, vowel, value):
    code_points = ' '.join(uu.get_codepoints(letter))
    blocks_list = '\n'.join(models.get_models(letter, as_list=True))

    template = f"""\
{{|width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;margin-bottom:0.5em;background:transparent"
|-valign="top"
|style="padding-right:0.5em"|
__TOC__
|
{{{{alphabet gotique}}}}
|}}

== {{{{caractère}}}} ==
'''{letter}'''
# Lettre gotique ''{{{{lien|{name}|conv}}}}''. {{{{lien|Unicode|fr}}}} : {code_points}.

=== {{{{S|références}}}} ===
{blocks_list}

== {{{{langue|got}}}} ==
=== {{{{S|étymologie}}}} ===
: {{{{ébauche-étym|got}}}}

=== {{{{S|lettre|got}}}} ===
{{{{lettre gotique|{letter}|{gotic_name}|{name}|{value}}}}}
'''{letter}''' ''{transliteration}'' {{{{pron|{pron}|got}}}}
# {{{{lien|{index}|dif={index.capitalize()}|fr}}}} lettre et {{{{lien|{index2}|fr}}}} {'voyelle' if vowel else 'consonne'} \
de l’alphabet {{{{lien|gotique|fr}}}}.
"""
    return template


if __name__ == '__main__':
    letter = '𐌰'
    transliteration = 'a'
    gotic_name = '𐌰𐌷𐍃𐌰'
    name = 'ahsa'
    pron = 'a'
    index = 'première'
    index2 = 'première'
    vowel = True
    value = 1
    print(get_page(letter, gotic_name, name, transliteration, pron, index, index2, vowel, value))
