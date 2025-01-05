import re

import pywikibot as pwb
from pywikibot import config as pwb_config

from cache import iterate_cached

ébauche_regex = re.compile(r'^{{ébauche\|([^|}]+)}}$', re.MULTILINE)


def handle_page(page: pwb.Page) -> None:
    print(f'Handling page "{page.title()}"…', end=' ')
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
    iterate_cached(pwb.Page(pwb.Site(), title='Modèle:ébauche').embeddedin(), handle_page)


if __name__ == '__main__':
    main()
