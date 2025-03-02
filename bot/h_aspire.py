import re
import json

import pywikibot as pwb

site = pwb.Site()
c = pwb.Category(site, title='Catégorie:Pages avec des erreurs de script')
# pages = c.articles()

with open('../test/téléchargement.json', encoding='UTF-8') as f:
    pages = (pwb.Page(site, title=p) for p in json.load(f)['*'][0]['a']['*'])

h_regex = re.compile(r'{{h\|.*?}}', re.MULTILINE)
h_aspire_regex = re.compile(r'{{h aspiré\|.*?}}', re.MULTILINE)

for page in pages:
    if page.namespace() == 0:
        print(page.title())
        prev_text = page.text
        page.text = h_regex.sub('{{h}}', page.text)
        page.text = h_aspire_regex.sub('{{h aspiré}}', page.text)
        if prev_text != page.text:
            page.save(summary="(''Automatique'') Suppression des paramètres inutiles du modèle h/h aspiré.", minor=True)
        else:
            print('Page non changée.')
