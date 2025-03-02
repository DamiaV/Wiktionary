"""
Created on Mon Jan 21 16:54:13 2019

@author: cedtr
"""
import pywikibot

site = pywikibot.Site()
special_chars = set('ĉĝĥĵŝŭ')


def get_t(term):
    if term == 'as':
        return 'pr'
    if term == 'is':
        return 'pa'
    if term == 'os':
        return 'f'
    if term == 'us':
        return 'c'
    if term == 'u':
        return 's'


def generate_page(verb, pron, term, trans):
    cle = ""
    if set(verb) & special_chars != set():
        x_page_name = verb.replace('ĉ', 'cx').replace('ĝ', 'gx').replace('ĥ', 'hx') \
            .replace('ĵ', 'jx').replace('ŝ', 'sx').replace('ŭ', 'ux')
        cle = f"\n\n{{{{clé de tri|{x_page_name}{term}}}}}"
    t = get_t(term)
    pattern = f"""== {{{{langue|eo}}}} ==
=== {{{{S|verbe|eo|flexion}}}} ===
{{{{eo-conj|{verb}}}}}
'''{verb}{term}''' {{{{pron|{pron}{term}|eo}}}}
# {{{{eo-conj-std|{trans}|v={verb}i|t={t}}}}}
""" + cle

    page = pywikibot.Page(site, f"{verb}{term}")

    assert page.text == "", f"{verb}{term} already exists."

    page.text = pattern
    page.save("Création automatique de la flexion.", watch="unwatch")


TRANS = 't'
INTRANS = 'i'

# Paramètres
rac = 'aĉ'
pron = 'ˈa.t͡ʃ'

for term in ['is', 'as', 'os', 'us', 'u']:
    try:
        generate_page(rac, pron, term, TRANS)
    except:
        continue
