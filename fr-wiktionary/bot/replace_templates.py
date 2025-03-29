import re

import pywikibot as pwb
from pywikibot import config as pwb_config

pwb_config.put_throttle = 0
page_name = 'Modèle:R:Liddell'

site = pwb.Site()
if page_name.startswith('Catégorie:'):
    iterator = pwb.Category(site, title=page_name).articles()
else:
    iterator = pwb.Page(site, title=page_name).embeddedin()

for page in iterator:
    print(page.title())
    try:
        if 'Liddell|' in page.text:
            page.text = re.sub(r'{{R([:|])Liddell\|[^}]+}}', r'{{R\1Liddell}}', page.text)
            page.save(summary='Suppression du paramètre obsolète de [[Modèle:R:Liddell]]')
        else:
            print('Template not found, skipped.')
    except pwb.exceptions.LockedPageError:
        print('Page protégée, ignorée.')
