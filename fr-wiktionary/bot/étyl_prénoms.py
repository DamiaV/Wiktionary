import re

import pywikibot as pwb

site = pwb.Site()

for page in pwb.Category(site, title='Catégorie:Wiktionnaire:Modèle étyl sans langue précisée').articles():
    print(page.title())
    prev = page.text
    m1 = re.findall(r'{{étyl\|([^|}]+?)\|', page.text)
    m2 = re.findall(r'{{langue\|([^|}]+?)}}', page.text)
    print(m1, m2)
    if 'S|prénom' in page.text and m1 and m2 and m1[0] == m2[0]:
        page.text = re.sub(
            r": ?D(?:u |e l[’']){{étyl\|([^|}]+?)\|mot=([^|}]+?)\|tr=([^|}]*?)\|sens=([^|}]*?)}}\.?",
            r": {{refnec|De {{lien|''\2''|\1|tr=\3|sens=\4}}.}}",
            page.text
        ).replace('\u200e', '')  # Left-to-right mark
    if len(m2) == 1 and m1 and m1[0] != m2[0]:
        # print(page.text)
        page.text = re.sub(
            r": ?D(u |e l[’']){{étyl\|([^|}]+?)\|mot=([^|}]+?)\|tr=([^|}]*?)\|sens=([^|}]*?)}}\.?",
            fr": {{{{refnec|D\1{{{{étyl|\2|{m2[0]}|mot=\3|tr=\4|sens=\5}}}}.}}}}",
            page.text
        )
        # print(page.text)
    if prev != page.text:
        page.save(summary='Formatage de l’étymologie + refnec.')
