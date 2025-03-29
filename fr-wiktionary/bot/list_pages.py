import sys

import pywikibot as pwb
import pywikibot.config as pwb_config
import pywikibot.pagegenerators as pg


def main():
    if len(sys.argv) != 2:
        print(f'Usage: {sys.argv[0]} TITLE_PREFIX', file=sys.stderr)
        return

    pwb_config.put_throttle = 0
    title_prefix = sys.argv[1]

    site = pwb.Site()
    for page in pg.PrefixingPageGenerator(title_prefix, site=site):
        print(page.title())
        print(f'\t{page.full_url()}')


if __name__ == '__main__':
    main()
