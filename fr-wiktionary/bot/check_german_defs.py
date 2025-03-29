import re

import pywikibot as pwb

site = pwb.Site()
with open('check_german_defs_output.txt', mode='w', encoding='UTF-8') as out:
    for page in pwb.Category(site, title='Pages à vérifier car créées automatiquement en allemand').articles():
        if page.namespace() == 0:
            print(page.title())
            text = page.text
            german_section_index = text.index('{{langue|de')
            try:
                next_section_index = text.index('{{langue|', german_section_index + 1)
            except ValueError:
                next_section_index = len(text)
            section_text = text[german_section_index:next_section_index]
            # Définition = liste de mots
            if re.search(r'#\s*[\[\]#|\w-]+(\s*,\s*[\[\]#|\w-]+)+', section_text) \
                    and len(list(re.finditer(r'#[^*]', section_text))) == 1:  # Une seule définition
                out.write(f'# [[{page.title()}]]\n')
