import pywikibot as pwb

site = pwb.Site()

for i in range(1, 87 + 1):
    page = pwb.Page(site, title=f'Page:Poisson - Alphabet nouveau - 1609.djvu/{i}')
    prev = page.text
    page.text = page.text.replace('[ch]', '{{X|ch}}')

    # new_text = ''
    # for line in page.text.split('\n'):
    #     if len(line) > 0 and line[0] == '|':
    #         try:
    #             i = line.index(" ||")
    #             line = line[:i].replace('ch', '[ch]') + line[i:]
    #         except ValueError:
    #             pass
    #     else:
    #         line = line.replace('ch', '[ch]')
    #     new_text += line + '\n'
    # page.text = new_text.strip() + '\n'

    if prev != page.text:
        page.save(
            summary='(Modification par bot) Remplacement [ch] par {{X|ch}} '
                    '(cf. [[Wikisource:Scriptorium/Juillet 2020#Caractère_difficile_à_transcrire]])',
            minor=True
        )
    else:
        print(f'Page [[{page.title()}]] not changed')
