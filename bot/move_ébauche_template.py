import pathlib
import re

import pywikibot as pwb
from pywikibot import config as pwb_config

ébauche_regex = re.compile(r'^{{ébauche\|([^|}]+)}}$', re.MULTILINE)


def handle_page(page: pwb.Page) -> None:
    print(f'Handling page "{page.title()}"…')
    if page.namespace() != 0:
        print(f'Not in main namespace, skipped.')
        return

    text: str = page.text
    old_text = text
    lines = text.splitlines()

    for match in ébauche_regex.finditer(text):  # Template may appear multiple times in the same page
        if not match:
            continue
        template = match[0]
        lang_code = match[1]
        template_i = lines.index(template)
        # Check if template is just after its language section
        if template_i != 0 and re.match(fr'== {{{{langue\|{lang_code}}}}} ==', lines[template_i - 1]):
            continue
        # Try to locate the corresponding language section
        try:
            section_i = lines.index(f'== {{{{langue|{lang_code}}}}} ==')
        except ValueError:
            continue
        # Move template to just after the language section
        lines.insert(section_i + 1, template)
        if section_i < template_i:
            template_i += 1
        del lines[template_i]

    page.text = '\n'.join(lines)
    if old_text != page.text:
        try:
            page.save(summary='Déplacement du modèle {{ébauche}} en début de section de langue', quiet=True)
            print('Saved.')
        except pwb.exceptions.PageSaveRelatedError as e:
            print('Protected page, skipped:', e)
    else:
        print('No changes, skipped.')


def main() -> None:
    pwb_config.put_throttle = 0

    # Load cache of already treated pages
    cache_file_path = pathlib.Path(__file__).parent / 'move_ébauche_template-cache.txt'
    if cache_file_path.exists():
        with cache_file_path.open('r', encoding='utf-8') as file_in:
            treated_pages = file_in.read().splitlines()
    else:
        treated_pages = []

    treated_pages_buffer = []
    for page in pwb.Page(pwb.Site(), title='Modèle:ébauche').embeddedin():
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
