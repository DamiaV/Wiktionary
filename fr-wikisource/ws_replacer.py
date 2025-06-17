import re

import pywikibot as pwb


def main() -> None:
    site = pwb.Site()

    for i in range(1, 75 + 1):
        page = pwb.Page(site, title=f'Page:Marot, Jean - Le Recueil Jehan Marot.djvu/{i}')
        prev = page.text
        page.text = re.sub(r'{{em\|1}}', '{{em}}', page.text)

        if prev != page.text:
            page.save(
                summary='(Modification par bot) Simplification de {{em|1}}',
                minor=True
            )
        else:
            print(f'Page [[{page.title()}]] not changed')


if __name__ == '__main__':
    main()
