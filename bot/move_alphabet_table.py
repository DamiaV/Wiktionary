import pathlib
import re

import pywikibot as pwb
from pywikibot import config as pwb_config

table_regex = re.compile(
    r'(?:__TOC__\n*)?\{\|[^{}]+?(\{\{[^}]+}})[^{}]+?\|}\n*(?=\n== \{\{caractère)'
)


def handle_page(page: pwb.Page) -> None:
    print(f'Handling page "{page.title()}"…', end=' ')
    if page.namespace() != 0:
        print(f'Not in main namespace, skipped.')
        return

    text: str = page.text
    old_text = text
    lines = text.splitlines()

    if m := table_regex.search(text):
        alphabet_template = m[1]
        see_also_section_i = None
        ref_section_i = None
        char_section_i = lines.index('== {{caractère}} ==')
        i = char_section_i
        while i < len(lines) and see_also_section_i is None and ref_section_i is None:
            line: str = lines[i]
            if line.startswith('=== {{S|voir'):
                see_also_section_i = i
            elif line.startswith('=== {{S|réf'):
                ref_section_i = i
            i += 1

        if see_also_section_i is not None:
            i = see_also_section_i + 1
            while i < len(lines) and not lines[i].startswith('=='):  # Find next section
                i += 1
            i -= 1
            while i > 0 and lines[i] == '':  # Go back up to first non-empty line
                i -= 1
            lines.insert(i + 1, alphabet_template)
        elif ref_section_i is not None:
            i = ref_section_i
            lines.insert(i - 1, alphabet_template)
            lines.insert(i - 1, '=== {{S|voir aussi}} ===')
            lines.insert(i - 1, '')
        else:
            i = char_section_i + 1
            # Find next level-2 section or first occurence of {{clé de tri}} template
            while i < len(lines) and not lines[i].startswith('== ') and not lines[i].startswith('{{clé de tri'):
                i += 1
            i -= 1
            while i > 0 and lines[i] == '':  # Go back up to first non-empty line
                i -= 1
            lines.insert(i + 1, '')
            lines.insert(i + 2, '=== {{S|voir aussi}} ===')
            lines.insert(i + 3, alphabet_template)

        page.text = '\n'.join(lines)
        page.text = page.text.replace(m[0], '').strip()  # Remove table

    if old_text != page.text:
        try:
            page.save(summary='Déplacement du tableau de caractères mal placé', quiet=True)
            print('Saved.')
        except pwb.exceptions.PageSaveRelatedError as e:
            print('Protected page, skipped:', e)
    else:
        print('No changes, skipped.')


def main() -> None:
    pwb_config.put_throttle = 0

    # Load cache of already treated pages
    cache_file_path = pathlib.Path(__file__ + '.cache.txt')
    if cache_file_path.exists():
        with cache_file_path.open('r', encoding='utf-8') as file_in:
            treated_pages = file_in.read().splitlines()
    else:
        treated_pages = []

    treated_pages_buffer = []
    for page in pwb.Category(pwb.Site(), title='Caractères').articles():
        if page.title() in treated_pages:
            continue
        handle_page(page)
        treated_pages_buffer.append(page.title())
        if len(treated_pages_buffer) == 10:  # Batch cache updates
            with cache_file_path.open('a', encoding='utf-8') as file_out:
                file_out.write('\n'.join(treated_pages_buffer) + '\n')
            treated_pages += treated_pages_buffer
            treated_pages_buffer.clear()


if __name__ == '__main__':
    main()
