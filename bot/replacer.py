import re

import pywikibot as pwb
from pywikibot import config as pwb_config

MODE_CAT = 'category_pages'
MODE_EMBEDS = 'embeds'
MODE_LINKS = 'links'

# Arguments #
PAGE_NAME = ''
SUMMARY = ''
LINK_MODE = MODE_CAT
# language=pythonregexp
NEEDLE = r''
REPL = r''
NAMESPACES = []


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

    for page in iterator:
        print(f'Handling page "{page.title()}"…')
        if NAMESPACES and page.namespace() not in NAMESPACES:
            print(f'Not in namespaces {NAMESPACES}, skipped.')
            continue

        old_text = page.text
        page.text = re.sub(NEEDLE, REPL, page.text)
        if old_text != page.text:
            try:
                page.save(summary=SUMMARY)
                print('Done.')
            except pwb.exceptions.PageSaveRelatedError as e:
                print('Protected page, skipped:', e)
        else:
            print('No changes, skipped.')


if __name__ == '__main__':
    main()
