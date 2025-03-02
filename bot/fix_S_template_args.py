"""This script applies some fixes to misused {{S}} templates."""
import re
import typing

import pywikibot as pwb
from pywikibot import config as pwb_config

from cache import iterate_cached

RENAME_TABLE = {
    'id': 'num',
    'ID': 'num',
    'nim': 'num',
    'nom': 'num',
    'cél': 'clé',
}
INVALID_ARGS = ['loc', 'aspect', ]


def handle_page(page: pwb.Page) -> None:
    print(page.title())
    old_text = page.text
    any_change = False

    new_text = old_text.strip()

    # Rename arguments
    for old_name, new_name in RENAME_TABLE.items():
        if old_name + '=' in new_text:
            new_text = re.sub(
                r'\{\{S((?:\|[^|}]+)*)\|' + old_name + r'=([^|}]+)((?:\|[^}]+)*)}}',
                r'{{S\1|' + new_name + r'=\2\3}}',
                new_text
            )
            any_change = True

    # Rename invalid arguments
    for invalid_name in INVALID_ARGS:
        if invalid_name + '=' in new_text:
            new_text = re.sub(
                r'\{\{S((?:\|[^|}]+)*)\|' + invalid_name + r'=[^|}]+((?:\|[^}]+)*)}}',
                r'{{S\1\2}}',
                new_text
            )
            any_change = True

    # Replace named arg "flexion=" by "flexion"
    if 'flexion=' in new_text:
        new_text = re.sub(
            r'\{\{S((?:\|[^|}]+)*)\|flexion=[^|}]+((?:\|[^}]+)*)}}',
            r'{{S\1|flexion\2}}',
            new_text
        )
        any_change = True

    # Remove args "genre=" and "g=" from sections that are not "prénom"
    if 'genre=' in new_text or 'g=' in new_text:
        def repl(match: re.Match) -> str:
            nonlocal any_change
            if match[1] != 'prénom':
                any_change = True
                return f'{{{{S|{match[1]}{match[2]}{match[3]}}}}}'
            return match[0]

        new_text = re.sub(
            r'\{\{S\|([\w é-]+)((?:\|[^|}]+)*)\|g(?:enre)?=[^|}]+((?:\|[^}]+)*)}}',
            repl,
            new_text
        )
        any_change = True

    # Replace arg "g=" by "genre="
    if 'g=' in new_text:
        new_text = re.sub(
            r'\{\{S\|prénom((?:\|[^|}]+)*)\|g=([^|}]+)((?:\|[^}]+)*)}}',
            r'{{S|prénom\1|genre=\2\3}}',
            new_text
        )
        any_change = True

    # Remove empty last arguments
    if '|}}' in new_text:
        new_text = re.sub(
            r'\{\{S((?:\|[^|}]+)*)\|+}}',
            r'{{S\1}}',
            new_text
        )
        any_change = True

    if old_text.strip() != new_text and any_change:
        page.text = new_text
        try:
            page.save(summary='Correction des paramètres de {{S}}', quiet=True)
            print('Done.')
        except pwb.exceptions.PageSaveRelatedError as e:
            print('Protected page, skipped:', e)
    else:
        print('No changes, skipped.')


def proper_nouns(site: pwb.Site) -> typing.Iterable[pwb.Page]:
    root = pwb.Category(site, 'Catégorie:Noms propres')
    yield from root.articles()
    for cat in root.subcategories(recurse=True):
        yield from cat.articles()


def pages() -> typing.Iterator[pwb.Page]:
    site = pwb.Site()
    yield from pwb.Category(site, 'Catégorie:Appels de modèles incorrects:S').articles()
    yield from pwb.Category(site, 'Catégorie:Wiktionnaire:Sections avec paramètres superflus').articles()
    yield from proper_nouns(site)


def main() -> None:
    pwb_config.put_throttle = 0
    iterate_cached(pages(), handle_page, cache_file_name_prefix=__file__)


if __name__ == '__main__':
    main()
