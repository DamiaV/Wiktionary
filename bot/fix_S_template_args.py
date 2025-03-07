"""This script applies some fixes to misused {{S}} templates."""
import json
import pathlib
import re
import time
import typing

import pywikibot as pwb
from pywikibot import config as pwb_config

from cache import iterate_cached

RENAME_TABLE = {
    'id': 'num',
    'ID': 'num',
    'nim': 'num',
    'nom': 'num',
    'nun': 'num',
    'nul': 'num',
    'mum': 'num',
    'nmm': 'num',
    'cél': 'clé',
    'cléé': 'clé',
    'clé de tri': 'clé',
    'flexionnum': 'flexion|num',
    'genrre': 'genre',
}
INVALID_ARGS = ['loc', 'aspect', 'mf', 'sing', 'sens', 'verbe', ]
INVALID_VALUES = ['locution', ]


def fix_homophones(new_text: str) -> str:
    lines = new_text.splitlines()
    lang_code = None
    for i, line in enumerate(lines):
        if m := re.search(r'\{\{langue\|([^}]+)}}', line):
            lang_code = m[1]
        elif '{{S|homophones}}' in line and lang_code:
            lines[i] = line.replace('{{S|homophones}}', f'{{{{S|homophones|{lang_code}}}}}')
    return '\n'.join(lines)


def handle_page(aliases: dict[str, str], page: pwb.Page) -> None:
    print(page.title())
    old_text = page.text
    any_change = False

    new_text = old_text.strip()

    # Set all section names to lower case
    def repl(match: re.Match[str]) -> str:
        nonlocal any_change
        any_change = True
        return '{{S|' + match[1].lower()

    new_text = re.sub(
        r'\{\{S\|([\wéÉ -]+)(?=[|}])',
        repl,
        new_text
    )

    # Rename arguments
    for old_name, new_name in RENAME_TABLE.items():
        if old_name + '=' in new_text:
            new_text = re.sub(
                r'\{\{S((?:\|[^|}]+)*)\|' + old_name + r'=([^|}]+)((?:\|[^}]+)*)}}',
                r'{{S\1|' + new_name + r'=\2\3}}',
                new_text
            )
            any_change = True

    # Remove invalid named arguments
    for invalid_name in INVALID_ARGS:
        if invalid_name + '=' in new_text:
            new_text = re.sub(
                r'\{\{S((?:\|[^|}]+)*)\|' + invalid_name + r'=[^|}]+((?:\|[^}]+)*)}}',
                r'{{S\1\2}}',
                new_text
            )
            any_change = True

    # Remove invalid positional arguments
    for invalid_value in INVALID_VALUES:
        if invalid_value in new_text:
            new_text = re.sub(
                r'\{\{S((?:\|[^|}]+)+)\|' + invalid_value + r'((?:\|[^}]+)*)}}',
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

    # Remove empty arguments
    if '||' in new_text or '|}}' in new_text:
        new_text = re.sub(
            r'\{\{S((?:\|[^}]+)*)\|+((?:\|[^}]+)*)?}}',
            r'{{S\1\2}}',
            new_text
        )
        any_change = True

    # Replace section name aliases
    for alias, full_name in aliases.items():
        if '{{S|' + alias in new_text:
            new_text = re.sub(
                r'\{\{S\|\s*' + alias + r'\s*(?=[}|])',
                r'{{S|' + full_name,
                new_text
            )

    # Add language code to homophones section
    if '{{S|homophones}}' in new_text:
        new_text = fix_homophones(new_text)

    if old_text.strip() != new_text and any_change:
        page.text = new_text
        try:
            page.save(summary='Correction des paramètres de {{S}}', quiet=True)
            print('Done.')
        except pwb.exceptions.PageSaveRelatedError as e:
            print('Protected page, skipped:', e)
    else:
        print('No changes, skipped.')


def pages(site: pwb.Site) -> typing.Iterator[pwb.Page]:
    yield from pwb.Category(site, 'Catégorie:Appels de modèles incorrects:S').articles()
    yield from pwb.Category(site, 'Catégorie:Wiktionnaire:Sections avec paramètres superflus').articles()
    yield from pwb.Category(site, 'Catégorie:Wiktionnaire:Sections de titre sans langue précisée').articles()
    yield from pwb.Category(site, 'Catégorie:Wiktionnaire:Sections avec titre inconnu').articles()

    yield from pwb.Category(site, 'Catégorie:Wiktionnaire:Sections utilisant un alias').articles()
    yield from pwb.Category(site, 'Catégorie:Wiktionnaire:Sections de type de mot utilisant un alias').articles()


def load_aliases(site: pwb.Site, page_title: str) -> dict[str, str]:
    return json.loads(pwb.Page(site, page_title).text)['alias']


def main() -> None:
    pwb_config.put_throttle = 0
    site = pwb.Site()
    aliases = load_aliases(site, 'Module:types de mots/data/dump.json')
    aliases.update(load_aliases(site, 'Module:section article/data/dump.json'))
    while True:
        print('> Started')
        iterate_cached(pages(site), lambda page: handle_page(aliases, page), cache_file_name_prefix=__file__)
        pathlib.Path(__file__ + '.cache.txt').unlink(missing_ok=True)
        print('> Sleeping for 5 min')
        time.sleep(300_000)


if __name__ == '__main__':
    main()
