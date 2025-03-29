import re

from pywikibot import config as pwb_config
import pywikibot as pwb

pwb_config.put_throttle = 0

regex = re.compile(r'Modèle:anagrammes/(\w+)/.+')
site = pwb.Site()

for page in pwb.Page(site, title='Modèle:anagrammes').embeddedin(namespaces=['Modèle']):
    print(page.title())
    title = page.title()
    if 'lang=' not in page.text and (m := regex.fullmatch(title)):
        page.text = page.text.replace('{{anagrammes|', f'{{{{anagrammes|lang={m.group(1)}|')
        try:
            page.save()
        except (pwb.exceptions.LockedPageError, pwb.exceptions.OtherPageSaveError) as e:
            print(e)
            print('Protected page, ignored.')
    else:
        print('Skipped.')
