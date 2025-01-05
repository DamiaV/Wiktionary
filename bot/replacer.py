import re

import pywikibot as pwb
from pywikibot import config as pwb_config

from cache import iterate_cached

MODE_CAT = 'category_pages'
MODE_EMBEDS = 'embeds'
MODE_LINKS = 'links'

# Arguments #
PAGE_NAME = 'Catégorie:kotava'
SUMMARY = 'Traitement de [[Wiktionnaire:Bots/Requêtes#Retours à la ligne inutiles au début d\'articles en Kotava / manquants ailleurs]] (2ème passage)'
LINK_MODE = MODE_CAT
# language=pythonregexp
NEEDLE = r'(?<![\n=])(\n(={2,6})[^=]+\2\n)'
REPL = '\n\\1'
NAMESPACES = [0]


def handle_page(page: pwb.Page) -> None:
    old_text = page.text
    page.text = re.sub(NEEDLE, REPL, old_text.strip())
    if old_text != page.text:
        try:
            page.save(summary=SUMMARY, quiet=True)
            print('Done.')
        except pwb.exceptions.PageSaveRelatedError as e:
            print('Protected page, skipped:', e)
    else:
        print('No changes, skipped.')


def main() -> None:
    pwb_config.put_throttle = 0

    site = pwb.Site()
    if LINK_MODE == MODE_CAT and PAGE_NAME.startswith('Catégorie:'):
        iterator = pwb.Category(site, title=PAGE_NAME).articles()
    elif LINK_MODE == MODE_EMBEDS:
        iterator = pwb.Page(site, title=PAGE_NAME).embeddedin()
    elif LINK_MODE == MODE_LINKS:
        iterator = pwb.Page(site, title=PAGE_NAME).backlinks()
    else:
        raise ValueError(f'Invalid link mode: {LINK_MODE}')

    iterate_cached(iterator, handle_page)


if __name__ == '__main__':
    main()
