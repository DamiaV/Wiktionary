import re

import pywikibot

site = pywikibot.Site()
category = pywikibot.Category(site, 'Catégorie:Caractères')

out_unicode = open('model_replacer_output_unicode.txt', mode='w', encoding='UTF-8')
out_default = open('model_replacer_output_default.txt', mode='w', encoding='UTF-8')

for page in category.articles():
    keep_code = len(page.title()) > 1
    prev_text = page.text

    page.text = re.sub(r'^\*\s*{{R:Unicode U(\w+)}}$',
                       r'* {{R:Bloc Unicode|0x\1}}' if keep_code else '* {{R:Bloc Unicode}}',
                       page.text,
                       flags=re.MULTILINE)

    page.text = re.sub(r'^\*\s*{{R:Bloc Unicode\|([a-fA-F0-9]+)}}$',
                       r'* {{R:Bloc Unicode|0x\1}}' if keep_code else '* {{R:Bloc Unicode}}',
                       page.text,
                       flags=re.MULTILINE)

    if not keep_code:
        page.text = re.sub(r'^\*\s*{{R:Bloc Unicode\|(0x[a-fA-F0-9]+)}}$',
                           '* {{R:Bloc Unicode}}',
                           page.text,
                           flags=re.MULTILINE)

    page.text = re.sub(
        r"^\*\s+Unicode,\s+Inc\.,\s+(?:«\s*)?\[https?://.+?PDF(?:/.+?)?/U(?:\d+-)?(\w+)\.pdf\s+(?:'')?.+?(?:'')?]"
        r"(?:\s*»)?,\s+(?:'')?(?:(?:Le )?standard Unicode|(?:The )?Unicode standard)(?:'')?,"
        r"\s+version\s+\d+\.\d+(?:,\s+\d+)?\.?$",
        r'* {{R:Bloc Unicode|0x\1}}' if keep_code else '* {{R:Bloc Unicode}}',
        page.text,
        flags=re.MULTILINE | re.IGNORECASE)

    if prev_text != page.text:
        page.save(summary="Remplacement modèle obsolète {{R:Unicode U####}}/Ajout modèle {{R:Bloc Unicode}}.")
    elif '{{R:Bloc Unicode}}' in page.text or ('{{R:Bloc Unicode|0x' in page.text and keep_code):
        print(f'Page [[{page.title()}]] already treated')
    elif 'Unicode, Inc.' in page.text:
        print(f'Page [[{page.title()}]] not changed, "Unicode, Inc." detected')
        out_unicode.write(f'{page.title()}\n')
    else:
        print(f'Page [[{page.title()}]] not changed, no known Unicode source')
        out_default.write(f'{page.title()}\n')

out_unicode.close()
out_default.close()
