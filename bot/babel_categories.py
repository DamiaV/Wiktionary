import re

import lupa
import pywikibot as pwb

with open('../fr-wiktionary/models-modules/langues/data.lua', encoding='UTF-8') as f:
    languages = {k: dict(v) for k, v in lupa.LuaRuntime().execute(''.join(f.readlines())).items()}

level_titles = {
    '0': 'Personnes ne parlant pas {} mais s’y intéressant',
    '1': 'Personnes ayant un niveau débutant en {}',
    '2': 'Personnes ayant un niveau intermédiaire en {}',
    '3': 'Personnes ayant un niveau avancé en {}',
    '4': 'Personnes ayant un niveau très avancé en {}',
    'M': 'Personnes parlant nativement en {}',
}

top_category_name = 'Catégorie:Personnes ayant un intérêt ou parlant {}'

refreshed_users = set()

site = pwb.Site()

out = open('babel_categories_skipped.txt', mode='w', encoding='UTF-8')

for category in pwb.Category(site, title='Wiktionnaristes par langue').subcategories():
    title = category.title()

    if m := re.fullmatch(r'Catégorie:Utilisateurs ([a-z-][\w-]+)', title):
        code = m.group(1)
        lang_name = languages.get(code, {}).get('nom')
        print(f'{code}: {lang_name}')

        for subcategory in category.subcategories():
            sub_title = subcategory.title()

            if m := re.fullmatch(fr'Catégorie:Utilisateurs {code}-([01234M])', sub_title):
                level = m.group(1)
                print(f'{code}-{level}')

                if lang_name:
                    # Update/create category with new name system
                    new_category = pwb.Category(site, title=level_titles[level].format(lang_name))
                    new_category.text = '{{catégorisation Babel}}'
                    if new_category.exists():
                        summary = 'Catégorisation et utilisation de [[Modèle:catégorisation Babel]].'
                    else:
                        summary = 'Création catégorie Babel manquante.'
                    new_category.save(summary=summary)
                else:
                    out.writelines([code + ' : no language\n'])

                for page in subcategory.articles():
                    title = page.title()
                    if title not in refreshed_users:
                        # Refresh user page
                        page.save()
                        refreshed_users.add(title)

        if not category.isRedirectPage():
            # Rename top category
            category.move(top_category_name.format(lang_name),
                          reason='Application de la discussion [[Wiktionnaire:Wikidémie/janvier '
                                 '2021#Changement des noms des catégories de langues utilisateurs : '
                                 'saison 2]].')
            c = pwb.Category(site, title=top_category_name.format(lang_name))
            c.text = '{{catégorisation Babel}}'
            c.save(summary='Utilisation de [[Modèle:catégorisation Babel]].')

out.close()
