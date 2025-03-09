import pywikibot as pwb
import pywikibot.pagegenerators as gens

TITLE = 'De la Ramée - Grammaire de P. de la Ramée, 1572.pdf'
NEEDLE = '⁹'

site = pwb.Site()
for page in gens.SubpageFilterGenerator(gens.PrefixingPageGenerator(f'Page:{TITLE}'), 1):
    if NEEDLE in page.text:
        print(page.title())
