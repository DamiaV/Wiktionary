"""This script replaces section name aliases by the full name for the {{S}} template."""
import json
import re
import typing

import pywikibot as pwb
from pywikibot import config as pwb_config

from cache import iterate_cached


def handle_page(aliases: dict[str, str], page: pwb.Page) -> None:
    print(page.title())
    old_text = page.text

    new_text = old_text.strip()

    for alias, full_name in aliases.items():
        if '{{S|' + alias in new_text:
            new_text = re.sub(
                r'\{\{S\|' + alias + r'(?=[}|])',
                r'{{S|' + full_name,
                new_text
            )

    if old_text != new_text:
        page.text = new_text
        try:
            page.save(summary='Remplacement des alias de noms de sections', quiet=True)
            print('Done.')
        except pwb.exceptions.PageSaveRelatedError as e:
            print('Protected page, skipped:', e)
    else:
        print('No changes, skipped.')


def pages(site: pwb.Site) -> typing.Iterator[pwb.Page]:
    yield from pwb.Category(site, 'Catégorie:Wiktionnaire:Sections utilisant un alias').articles()
    yield from pwb.Category(site, 'Catégorie:Wiktionnaire:Sections de type de mot utilisant un alias').articles()


def main() -> None:
    pwb_config.put_throttle = 0
    site = pwb.Site()
    aliases: dict[str, str] = json.loads(pwb.Page(site, 'Module:types de mots/data/dump.json').text)['alias']
    aliases.update(json.loads(pwb.Page(site, 'Module:section article/data/dump.json').text)['alias'])
    iterate_cached(pages(site), lambda page: handle_page(aliases, page), cache_file_name_prefix=__file__)


if __name__ == '__main__':
    main()
