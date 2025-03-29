import pywikibot as pwb

site = pwb.Site()


def create_page(base_word, plural, pron, plural_pron):
    text = f"""== {{{{langue|en}}}} ==
=== {{{{S|nom|en|flexion}}}} ===
{{{{en-nom-rég|{pron}|sing={base_word}}}}}
'''{plural}''' {{{{pron|{plural_pron}|en}}}}
# ''Pluriel de'' {{{{lien|{base_word}|en}}}}.
"""
    page = pwb.Page(site, plural)
    if not page.exists():
        page.text = text
        page.save(summary='Création automatique.', watch='nochange', botflag=True)
    else:
        print(f'Page "{plural}" already exists.')


if __name__ == '__main__':
    WORDS = [
        # ('<mot>', '<pluriel>', '<prononciation>', '<prononciation pluriel>'),
        ('double-headed rail', 'double-headed rails', 'ˈdʌ.bl̩ ˈhɛ.dɪd ˈɹeɪl', 'ˈdʌ.bl̩ ˈhɛ.dɪd ˈɹeɪlz'),
        ('bullhead rail', 'bullhead rails', 'ˈbʊl.hɛd ɹeɪl', 'ˈbʊl.hɛd ɹeɪlz'),
        ('Vignoles rail', 'Vignoles rails', '', ''),
    ]

    for word in WORDS:
        create_page(*word)
