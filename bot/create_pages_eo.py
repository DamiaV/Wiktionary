import re

import pywikibot
import requests

from flexions import create_pages, REG, INV, SING, N_REG, N_DIR, N_DIR_PLUS


def __get_pron(pron_code):
    url = 'http://darmo-creations.herokuapp.com/ipa-generator/to-ipa/'
    response = requests.get(url, params={'input': pron_code})
    json = response.json()
    if 'error' in json:
        raise ValueError(json['error'])
    return json['ipa_code']


YES_ANSWER = ['o', 'oui']

site = pywikibot.Site()
page = pywikibot.Page(site, 'Wiktionnaire:Traductions manquantes en espéranto')

words = page.text.splitlines(keepends=False)[99:]
entries = []
try:
    for word in words:
        m = re.fullmatch(r'#\s*\[\[(.+)]]\s*\((.+)\)', word)
        if m is not None:
            word = m.group(1)
            translations = m.group(2).replace('[', '').replace(']', '').split(',')
            if word[0] != '-' and not pywikibot.Page(site, word).exists():
                print(f'{word} ({", ".join(translations)})')

                # Prononciation
                while 'incorrect':
                    raw_pron = input('Prononciation (<$> pour quitter, vide pour passer) : ')
                    if raw_pron == '$':
                        raise GeneratorExit()
                    if raw_pron == '':
                        break
                    try:
                        pron = __get_pron(raw_pron)
                        print(f'=> \\{pron}\\')
                        break
                    except ValueError as e:
                        print(e)
                if raw_pron == '':
                    print('Passé\n')
                    continue

                # Classe grammaticale
                cat_type = input('Classe : ')

                # Traduction
                use_default = input('Garder la définition par défaut ? (O/N) ').lower() in YES_ANSWER
                if use_default:
                    if len(translations) > 1:
                        while 'incorrect':
                            t = ' ; '.join([f'{i} : "{t}"' for i, t in enumerate(translations)])
                            try:
                                i = int(input(f'Définitions : {t} '))
                                print('=> ' + translations[i])
                            except ValueError:
                                continue
                            if 0 <= i < len(translations):
                                break
                    else:
                        print(f'Définition : {translations[0]}')
                        i = 0
                    definition = translations[i]
                else:
                    definition = input('Définition : ')

                # Catégories
                categories = [c.strip() for c in input('Catégories : ').split(',') if c != '']

                inv = input('Invariable ? (O/N) ') in YES_ANSWER
                n_dir_mode = N_REG
                if inv:
                    mode = INV
                else:
                    sing = input('Singulier ? (O/N) ') in YES_ANSWER
                    if sing:
                        mode = SING
                        r = input('Accusatif direction ? (O/N/+) ')
                        if r in YES_ANSWER:
                            n_dir_mode = N_DIR
                        elif r == '+':
                            n_dir_mode = N_DIR_PLUS
                    else:
                        mode = REG

                # noinspection PyUnboundLocalVariable
                entries.append((word, pron, cat_type, definition, categories, mode, n_dir_mode, False))
                print()
except GeneratorExit:
    pass

for entry in entries:
    create_pages(*entry)
