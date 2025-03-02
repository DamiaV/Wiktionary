"""
Created on Mon Dec 17 18:58:19 2018

@author: cedtr
"""
import pywikibot

ADJ = 'adjectif'
NOM = 'nom'

site = pywikibot.Site()
special_chars = {
    'ĉ': 'cx',
    'ĝ': 'gx',
    'ĥ': 'hx',
    'ĵ': 'hx',
    'ŝ': 'sx',
    'ŭ': 'ux',
}

REG = 0
INV = 1
SING = 2

N_REG = 0
N_DIR = 1
N_DIR_PLUS = 2


def create_page(main_page_name, prononciation, cat_type, force, suffix='', definition='', categories=(), mode=REG,
                n_dir_mode=N_REG):
    words = main_page_name.split()
    if mode != INV:
        words_suffixed = [w + (suffix if w[-1] in 'ao' else '') for w in words]
        page_name = ' '.join(words_suffixed)
    else:
        page_name = main_page_name

    page = pywikibot.Page(site, page_name)
    if force or page.text == '':
        pron = prononciation.split()
        pron_suffixed = [p + (suffix if p[-1] in 'ao' else ' ') for p in pron]

        if definition == '':
            etym = ''
            case = ('Accusatif' if 'n' in suffix else 'Nominatif') + ' ' + ('pluriel' if 'j' in suffix else 'singulier')
            defin = f"''{case} de'' [[{main_page_name}#eo|{main_page_name}]]"
        else:
            etym = '\n=== {{S|étymologie}} ===\n: {{ébauche-étym|eo}}'
            defin = f'[[{definition}#fr|{definition.capitalize()}]]'

        categories = ' '.join([f'{{{{{c}|eo}}}}' for c in categories])
        if categories != '':
            categories = ' ' + categories

        sorting_key = ''
        if set(main_page_name) & set(special_chars.keys()) != set():
            x_page_name = main_page_name.replace('ĉ', 'cx').replace('ĝ', 'gx').replace('ĥ', 'hx') \
                .replace('ĵ', 'jx').replace('ŝ', 'sx').replace('ŭ', 'ux')
            sorting_key = f'\n\n{{{{clé de tri|{x_page_name}}}}}'

        if mode != INV:
            s = '-sing' if mode == SING else ''
            direction = ""
            if n_dir_mode == N_DIR:
                direction = '|dir=1'
            elif n_dir_mode == N_DIR_PLUS:
                direction = '|dir+=1'
            if len(words) == 2:
                flexions = f'\n{{{{eo-rég{s}2|{"|".join(words)}|{"|".join(pron)}{direction}}}}}'
            else:
                flexions = f'\n{{{{eo-rég{s}|{prononciation}|ns={main_page_name}{direction}}}}}'
        else:
            flexions = ''

        text = f"""== {{{{langue|eo}}}} =={etym}
=== {{{{S|{cat_type}|eo{'|flexion' if suffix != '' else ''}}}}} ==={flexions}
'''{page_name}''' {{{{pron|{' '.join(pron_suffixed)}|eo}}}}
#{categories} {defin}.""" + sorting_key
        page.text = text
        page.save('Création automatique.', watch='nochange', botflag=True)
    else:
        print(f'"{page_name}" already exists.')


def create_pages(page_name, prononciation, cat_type, definition, categories, mode, n_dir_mode, force):
    if definition != '':
        create_page(page_name, prononciation, cat_type, force, definition=definition, categories=categories, mode=mode,
                    n_dir_mode=n_dir_mode)
    if mode != INV:
        if mode != SING:
            create_page(page_name, prononciation, cat_type, force, suffix='j')
            create_page(page_name, prononciation, cat_type, force, suffix='jn')
        create_page(page_name, prononciation, cat_type, force, suffix='n', mode=mode, n_dir_mode=n_dir_mode)


if __name__ == '__main__':
    WORDS = [
        # ('<mot>', '<pron>', '<classe>', '<définition>', [<catégories...>], '<mode>', '<n direction mode>', <force>),
        ('', '', 'nom', '', [], REG, N_REG, False),
    ]

    for entry in WORDS:
        create_pages(*entry)
