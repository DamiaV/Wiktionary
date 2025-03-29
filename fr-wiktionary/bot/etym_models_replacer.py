import re

import pywikibot as pwb


def replace(page_text):
    prev = page_text
    page_text = re.sub(
        r'{{déverbal de\s*\|\s*([^|]+?)\s*(?:\|m=\w+)?\|\s*(?:lang\s*=)?\s*([^|]+?)\s*(?:\|m=\w+)?}}',
        r'{{déverbal|de=\1|lang=\2|m=1}}',
        page_text
    )
    changed = prev != page_text

    prev = page_text
    page_text = re.sub(
        r'{{déverbal de\|\|([^|]+?)}}',
        r'{{déverbal|lang=\1|m=1}} de',
        page_text
    )
    changed |= prev != page_text

    prev = page_text
    page_text = re.sub(
        r'{{dénominal de\s*\|\s*([^|]+?)\s*(?:\|m=\w+)?\|\s*(?:lang\s*=)?\s*([^|]+?)\s*(?:\|m=\w+)?}}',
        r'{{dénominal|de=\1|lang=\2|m=1}}',
        page_text
    )
    changed |= prev != page_text

    prev = page_text
    page_text = re.sub(
        r'{{dénominal de\|\|([^|]+?)}}',
        r'{{dénominal|lang=\1|m=1}} de',
        page_text
    )
    changed |= prev != page_text

    return page_text, changed


def iterate(pages_list):
    for page in pages_list:
        page.text, changed = replace(page.text)
        if page.namespace() == 0:
            if changed:
                page.save(summary='Remplacement modèle "déverbal de" et/ou "dénominal de".')
            else:
                print(f'Page [[{page.title()}]] not changed')
        else:
            print(f'Page [[{page.title()}]] not treated')


site = pwb.Site()
pages = pwb.Page(site, title='Modèle:déverbal de').embeddedin()
iterate(pages)
pages = pwb.Page(site, title='Modèle:dénominal de').embeddedin()
iterate(pages)
