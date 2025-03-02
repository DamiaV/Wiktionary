import re

import pywikibot as pwb

PAGE_NB = 72
PAGE_BASE_NAME = "André - Tout l'Esperanto en 12 dialogues, 1910.pdf"
# MESSAGE = 'Ajout d’espaces insécables'
MESSAGE = 'Remplacement ù en ŭ'
SUBSTITUTIONS = [
    # (re.compile('[  ]([:;?!»])'), r'&nbsp;\1'),
    # (re.compile('«[  ]'), '«&nbsp;'),
    (re.compile('([^oO])ù'), r'\1ŭ'),
]

site = pwb.Site(code='fr', fam='wikisource', user='Danÿa')

indices = range(1, PAGE_NB + 1)
for i, p in enumerate(indices):
    page = pwb.Page(site, title=f'Page:{PAGE_BASE_NAME}/{p}')
    if page.exists():
        print(f'Page {p} ({i + 1}/{len(indices)})…')
        text = page.text
        for pattern, repl in SUBSTITUTIONS:
            page.text = re.sub(pattern, repl, page.text)
        if text != page.text:
            page.save(summary=f'(Automatique) {MESSAGE}')
        else:
            print('Nothing changed, skipped.')
