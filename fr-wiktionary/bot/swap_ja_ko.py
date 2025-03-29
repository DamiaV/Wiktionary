import re

import pywikibot as pwb
from pywikibot import config as pwb_config

from cache import iterate_cached


def handle_page(page: pwb.Page) -> None:
    print(page.title())
    summary = 'Traitement de [[Wiktionnaire:Bots/Requêtes#Ordre des sections de langue sur les pages de sinogrammes]]'
    old_text = page.text
    lines = page.text.splitlines()
    ja_lines_ij = [-1, -1]
    ko_lines_ij = [-1, -1]
    i = 0
    for i, line in enumerate(lines):
        if line == '== {{langue|ja}} ==':
            ja_lines_ij[0] = i
        elif line == '== {{langue|ko}} ==':
            ko_lines_ij[0] = i
        elif line.startswith('== '):
            if ja_lines_ij[0] != -1 and ja_lines_ij[1] == -1:
                ja_lines_ij[1] = i
            elif ko_lines_ij[0] != -1 and ko_lines_ij[1] == -1:
                ko_lines_ij[1] = i
    if ja_lines_ij[0] != -1 and ja_lines_ij[1] == -1:
        ja_lines_ij[1] = i + 1
    if ko_lines_ij[0] != -1 and ko_lines_ij[1] == -1:
        ko_lines_ij[1] = i + 1
    if ja_lines_ij[0] < ko_lines_ij[0]:
        ko_lines = lines[ko_lines_ij[0]:ko_lines_ij[1]]
        del lines[ko_lines_ij[0]:ko_lines_ij[1]]
        lines = lines[:ja_lines_ij[0]] + ko_lines + [''] + lines[ja_lines_ij[0]:]
        page.text = re.sub(r'\n{3,}', '\n\n', '\n'.join(lines))
    if old_text != page.text:
        try:
            page.save(summary=summary, quiet=True)
            print('Done.')
        except pwb.exceptions.PageSaveRelatedError as e:
            print('Protected page, skipped:', e)
    else:
        print('No changes, skipped.')


def main() -> None:
    pwb_config.put_throttle = 0

    site = pwb.Site()
    iterator = pwb.Category(site, title='Catégorie:Sinogrammes en coréen').articles()

    iterate_cached(iterator, handle_page, cache_file_name_prefix=__file__)


if __name__ == '__main__':
    main()
