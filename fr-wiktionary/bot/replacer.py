"""This parameterizable script performs string substitutions on selected pages."""
import re

import pywikibot as pwb
from pywikibot import config as pwb_config

from cache import iterate_cached

MODE_CAT = 'category_pages'
MODE_EMBEDS = 'embeds'
MODE_LINKS = 'links'

# Arguments #
PAGE_NAME = 'Catégorie:same du Nord'
SUMMARY = 'Traitement de [[Wiktionnaire:Bots/Requêtes#Clés de tri en same du Nord]]'
LINK_MODE = MODE_CAT
# language=pythonregexp
NEEDLE = r'\{\{clé de tri\|[^|}]+}}'
REPL = '{{clé de tri||se}}'


def CONDITION(text: str) -> bool:
    if '{{clé de tri' not in text:
        return False
    matches = re.findall(r'== *\{\{langue\|([^}]+)}} *==', text)
    return len(matches) == 1 and matches[0] == 'se'


def handle_page(page: pwb.Page) -> None:
    print(page.title())
    old_text = page.text
    if not CONDITION(old_text):
        print('Condition is false, skipped.')
        return
    page.text = re.sub(NEEDLE, REPL, old_text.strip())
    if old_text != page.text:
        try:
            page.save(summary=SUMMARY, quiet=True, minor=False)
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
