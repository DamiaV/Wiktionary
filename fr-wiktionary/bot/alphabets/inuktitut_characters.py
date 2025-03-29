import pywikibot as pwb


def get_prons(name):
    prons = {
        'nng': 'ŋː',
        'ng': 'ŋ',
        'g': 'ɣ',
        'r': 'ʁ',
        'ł': 'ɬ',
        'ai': 'j',
        'ii': 'iː',
        'uu': 'uː',
        'aa': 'aː',
    }
    pron = name
    for k, v in prons.items():
        pron = pron.replace(k, v).replace('-', '')
    return pron


def get_page(letter, trans):
    template = f"""\
== {{{{langue|iu}}}} ==
=== {{{{S|étymologie}}}} ===
: Ce caractère, ainsi que tous ceux du {{{{lien|syllabaire|fr}}}} inuktitut, a été créé en 1841 par \
[[w:James Evans|James Evans]].

=== {{{{S|lettre|iu}}}} ===
'''{letter}''' ''{trans.replace('-', '')}'' {{{{pron|{get_prons(trans)}|iu}}}}
# Syllabe inuktitut{' finale' if '-' in trans else ''} ''{trans.replace('-', '')}''.

=== {{{{S|voir aussi}}}} ===
* {{{{WP|Syllabaire inuktitut}}}}

=== {{{{S|références}}}} ===
* {{{{R:Omniglot Inuktitut}}}}
* {{{{R:LanguageGeek Inuktitut}}}}
"""
    return template


if __name__ == '__main__':
    site = pwb.Site()
    with open('alphabets/inuktitut_letters.csv', encoding='utf-8') as f:
        for line in f.readlines()[1:]:
            letter, name = line.strip().split(',')
            page = pwb.Page(site, letter)
            text = get_page(letter, name)
            section_title = '== {{langue|iu}} =='
            if section_title in page.text:
                index = page.text.index(section_title)
                page.text = page.text[:index] + text + page.text[index + len(section_title):]
            else:
                page.text += '\n\n' + text
            page.save(summary='Création de section automatique', watch=False, botflag=True)
