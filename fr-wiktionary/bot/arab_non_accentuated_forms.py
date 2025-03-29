import io
import re

import pywikibot as pwb
from pywikibot import config as pwb_config

from cache import iterate_cached


def handle_page(page: pwb.Page, flagged_pages_out: io.TextIOWrapper) -> None:
    print(page.title())
    old_text = page.text

    lines = page.text.splitlines()
    try:
        lang_section_i = lines.index('== {{langue|ar}} ==')
    except ValueError:
        print('No arabic section, skipped.')
        return
    replacing = False
    ignore = True
    unexpected_section = False
    start_i = lang_section_i + 1
    remove_line_i = -1
    for i, line in enumerate(lines[start_i:]):
        if line.startswith('=='):
            if line == '=== {{S|étymologie}} ===':
                replacing = True
            elif re.search(r'^====? \{\{S\|variante par', line, re.IGNORECASE):
                remove_line_i = start_i + i
            elif line.startswith('== {{langue|'):
                break
            else:
                unexpected_section = True
                break
        elif replacing:
            if ignore and 'sans diacritique' in line:  # Only handle sections that are non-accentuated forms
                ignore = False
            if line.startswith(':'):
                lines[start_i + i] = '#' + line[1:]
    if ignore:
        print('No “sans diacritique”, skipped.')
        return
    if remove_line_i > start_i:
        del lines[remove_line_i]
        i = remove_line_i - 1
        delete = True
        while delete:
            delete = lines[i].strip() == ''
            if delete:
                del lines[i]
            i -= 1
    if unexpected_section:
        flagged_pages_out.write(page.title() + '\n')

    page.text = '\n'.join(lines)

    if old_text != page.text:
        try:
            summary = 'Traitement de [[Wiktionnaire:Bots/Requêtes#"Forme sans diacritique" en arabe]] (2e passe)'
            page.save(summary=summary, quiet=True)
            print('Done.')
        except pwb.exceptions.PageSaveRelatedError as e:
            print('Protected page, skipped:', e)
    else:
        print('No changes, skipped.')


def main() -> None:
    pwb_config.put_throttle = 0
    site = pwb.Site()
    with open(__file__ + '.unexpected_sections.txt', 'a', encoding='utf-8') as f:
        def aux(page: pwb.Page) -> None:
            handle_page(page, f)
            f.flush()

        aux(pwb.Page(site, title='مطعم'))
        return
        title = 'Catégorie:Variantes par contrainte typographique en arabe'
        iterate_cached(pwb.Category(site, title=title).articles(namespaces=[0]), aux, cache_file_name_prefix=__file__)


if __name__ == '__main__':
    main()
