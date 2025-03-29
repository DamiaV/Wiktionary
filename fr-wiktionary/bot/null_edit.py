import sys

import pywikibot as pwb
import pywikibot.config as pwb_config


def main():
    if not (2 <= len(sys.argv) <= 3):
        print(f'Usage: {sys.argv[0]} TITLE [-s]', file=sys.stderr)
        return

    pwb_config.put_throttle = 0
    page_name = sys.argv[1]

    site = pwb.Site()
    if page_name.startswith('Catégorie:'):
        subcategories = len(sys.argv) == 3 and sys.argv[2] == '-s'
        category = pwb.Category(site, title=page_name)
        iterator = category.subcategories() if subcategories else category.articles()
    else:
        iterator = pwb.Page(site, title=page_name).embeddedin()

    for page in iterator:
        print(page.title())
        try:
            page.save()
        except pwb.exceptions.PageSaveRelatedError as e:
            print(e)
            print('Page protégée, ignorée.')


if __name__ == '__main__':
    main()
