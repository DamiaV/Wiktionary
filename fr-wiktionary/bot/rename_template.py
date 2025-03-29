import pywikibot as pwb
from pywikibot import config as pwb_config

pwb_config.put_throttle = 0
site = pwb.Site()

template_name = 'Modèle:tifinaghe'

for page in pwb.Page(site, title=template_name).embeddedin():
    if page.namespace() in [0]:
        prev = page.text
        page.text = page.text.replace('{{tifinaghe}}', '{{tifinaghe ?}}')
        if page.text != prev:
            page.save(summary="Renommage de ''tifinaghe'' en ''tifinaghe ?''.")
