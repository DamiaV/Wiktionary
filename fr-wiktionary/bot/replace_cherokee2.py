import pywikibot as pwb
import re

site = pwb.Site()
pages = pwb.Category(site, title='Catégorie:Lettres en cherokee').articles()

for page in pages:
    page.text = re.sub('Lettre (.+?) de l’alphabet cherokee', r'Lettre \1 du syllabaire cherokee', page.text)
    page.save(summary='Remplacement alphabet par syllabaire')
