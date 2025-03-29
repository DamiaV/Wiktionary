import pywikibot as pwb
import re

site = pwb.Site()
for page in pwb.Page(site, title='Modèle:ja-exmpl').embeddedin():
    if page.namespace() in ['']:
        previous = page.text
        page.text = re.sub(r'{{\s*(?:ja-exmpl)\s*\|', r'{{ja-exemple|', page.text)
        page.save(summary='Remplacement modèle "ja-exmpl" par "ja-exemple"')
