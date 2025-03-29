import pywikibot as pwb
from pywikibot import config as pwb_config

import cache


def handle_page(site: pwb.Site, page: pwb.Page) -> None:
    verb = page.title()
    conj_page = pwb.Page(site, 'Conjugaison:interlingua/' + verb)
    if not conj_page.exists():
        conj_page.text = '{{ia-conj}}'
        conj_page.save(
            summary='Création des pages de conjugaison en interlingua sur demande de Destraak'
        )


def main() -> None:
    pwb_config.put_throttle = 0
    site = pwb.Site()
    cache.iterate_cached(pwb.Category(site, 'Catégorie:Verbes en interlingua').articles(),
                         lambda page: handle_page(site, page), cache_file_name_prefix=__file__)


if __name__ == '__main__':
    main()
