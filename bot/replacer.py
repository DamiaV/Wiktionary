import pathlib
import re

import pywikibot as pwb
from pywikibot import config as pwb_config

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

    # Load cache of already treated pages
    cache_file_path = pathlib.Path(__file__ + '.cache.txt')
    if cache_file_path.exists():
        with cache_file_path.open('r', encoding='utf-8') as file_in:
            treated_pages = file_in.read().splitlines()
    else:
        treated_pages = []

    treated_pages_buffer = []
    for page in iterator:
        if page.title() in treated_pages:
            continue
        print(f'Handling page "{page.title()}"…', end=' ')
        if NAMESPACES and page.namespace() not in NAMESPACES:
            print(f'Not in namespaces {NAMESPACES}, skipped.')
            continue

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

        treated_pages_buffer.append(page.title())
        if len(treated_pages_buffer) == 10:  # Batch cache updates
            with cache_file_path.open('a', encoding='utf-8') as file_out:
                file_out.write('\n'.join(treated_pages_buffer) + '\n')
            treated_pages += treated_pages_buffer
            treated_pages_buffer.clear()


if __name__ == '__main__':
    main()
