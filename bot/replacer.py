import re

import pywikibot as pwb
from pywikibot import config as pwb_config

from cache import iterate_cached

MODE_CAT = 'category_pages'
MODE_EMBEDS = 'embeds'
MODE_LINKS = 'links'

# Arguments #
PAGE_NAME = 'Modèle:R:avk-grammaire'
SUMMARY = 'Traitement de [[Wiktionnaire:Bots/Requêtes#Mise à jour des numéros de pages]]'
LINK_MODE = MODE_EMBEDS
# language=pythonregexp
NEEDLE = r'\{\{R:avk-grammaire\|p=(\d+)}}'


def _repl(match: re.Match[str]) -> str:
    page_num = match[1]
    new_num = page_num
    if (nb := int(page_num)) in (10, 15, 24, 28, 52):
        new_num = str(nb - 1)
    return f'{{{{R:avk-grammaire|p={new_num}}}}}'


REPL = _repl


def handle_page(page: pwb.Page) -> None:
    print(page.title())
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

    iterate_cached(iterator, handle_page, cache_file_name_prefix=__file__)


if __name__ == '__main__':
    main()
