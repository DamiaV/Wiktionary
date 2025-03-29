import pywikibot


def remove_dots(s):
    return s.replace('.', '').replace(' ', '')


def to_dots(s):
    return ' '.join([c + ('.' if c.isalpha() else '') for c in s])


def get_sorting_key(s):
    if '.' in s:
        sorting_key = s.replace('.', '').replace('¼ ', '').replace('½ ', '')
    else:
        sorting_key = s.replace('¼', ' ').replace('½', ' ')
    return sorting_key.lower()


def create_page(site, title):
    prons = {
        'nord-ouest': 'nɔ.ʁ‿wɛst',
        'sud-ouest': 'sy.d‿wɛst',
        'nord-est': 'nɔ.ʁ‿ɛst',
        'sud-est': 'sy.d‿ɛst',
        'quart-ouest': 'ka.ʁ‿wɛst',
        'quart-est': 'ka.ʁ‿ɛst',
        'quart': 'kaʁ',
        'demi': 'də.mi',
        'nord': 'nɔʁ',
        'sud': 'syd',
        'ouest': 'wɛst',
        'est': 'ɛst',
    }
    if '.' in title:
        voir = remove_dots(title)
        no_dots = voir
    else:
        voir = to_dots(title)
        no_dots = title
    ref = no_dots.replace('N', 'nord-').replace('S', 'sud-').replace('O', 'ouest-').replace('E', 'est-') \
        .replace('¼', 'quart-').replace('½', 'demi-').strip('-')
    pron = ref
    for k, v in prons.items():
        pron = pron.replace(k, v)
    pron = pron.replace('-', ' ')
    tt = ref.split('-')
    cf = []
    skip = False
    for i in range(len(tt)):
        if skip:
            skip = False
            continue
        if i < len(tt) - 1 and tt[i] in ['nord', 'sud'] and tt[i + 1] in ['est', 'ouest']:
            cf.append(tt[i] + '-' + tt[i + 1])
            skip = True
        elif tt[i] not in cf:
            cf.append(tt[i])
    sorting_key = get_sorting_key(title)

    page_code = f"""{{{{voir|{voir}}}}}

== {{{{langue|fr}}}} ==

=== {{{{S|étymologie}}}} ===
: {{{{abréviation|fr}}}} {{{{cf|lang=fr|{'|'.join(cf)}}}}}.

=== {{{{S|nom|fr}}}} ===
{{{{rose des vents/fr}}}}
'''{title}''' {{{{pron|{pron}|fr}}}} {{{{m}}}} {{{{invariable}}}}
# {{{{points cardinaux|fr}}}} [[{ref}|{ref.capitalize()}]].

{{{{clé de tri|{sorting_key}}}}}
"""
    page = pywikibot.Page(site, title)
    page.text = page_code
    print(f'Page "{title}" créée.')
    page.save(summary='Création automatique', watch='nochange', botflag=True)


if __name__ == '__main__':
    site = pywikibot.Site()
    category = pywikibot.Category(site, 'Catégorie:Rose des vents en français')

    for a in category.articles():
        page: pywikibot.Page = a
        title: str = page.title()
        if title not in ['nord', 'sud', 'est', 'ouest', 'N', 'N.', 'S', 'S.', 'E', 'E.', 'O', 'O.'] and (
                title[0].isupper() or 'nord' in title or 'sud' in title or 'est' in title or 'ouest' in title):
            print(title)
            text = page.text
            summary = []
            if title[0].isupper():  # modèles : voir, rose des vents/fr, clé de tri
                has_voir = False
                has_cle_de_tri = False
                has_rose_des_vents = False
                for template_name, template_args in page.raw_extracted_templates:
                    if template_name.startswith('voir'):
                        has_voir = True
                    elif template_name == 'clé de tri':
                        has_cle_de_tri = True
                    elif template_name == 'rose des vents/fr':
                        has_rose_des_vents = True

                if not has_voir:
                    if '.' in title:
                        voir_title = remove_dots(title)
                    else:
                        voir_title = to_dots(title)
                    model = f'{{{{voir|{voir_title}}}}}'
                    page.text = model + '\n\n' + page.text
                    print(f'Ajout modèle "{model}".')
                    summary.append(f'+ voir')

                if not has_cle_de_tri:
                    sorting_key = get_sorting_key(title)
                    model = f'{{{{clé de tri|{sorting_key}}}}}'
                    page.text += '\n\n' + model
                    print(f'Ajout modèle "{model}".')
                    summary.append(f'+ clé de tri')

                if not has_rose_des_vents:
                    index = page.text.index(f"'''{title}'''")
                    model = '{{rose des vents/fr}}'
                    page.text = page.text[:index] + model + '\n' + page.text[index:]
                    print(f'Ajout modèle "{model}".')
                    summary.append(f'+ rose des vents')
            else:
                t = title.replace('nord', 'N').replace('sud', 'S').replace('ouest', 'O').replace('est', 'E') \
                    .replace('quart', '¼').replace('demi', '½')
                without_dots = t.replace('-', '').replace(' ', '')
                with_dots = to_dots(without_dots)

                lines = page.text.splitlines(keepends=True)
                changed = False
                for i in range(len(lines)):
                    if '{{S|abrév' in lines[i]:
                        if without_dots not in lines[i + 1]:
                            lines.insert(i + 1, f'* [[{without_dots}]]\n')
                            print(f'Ajout lien vers "{without_dots}"')
                            changed = True
                        if with_dots not in lines[i + 2]:
                            lines.insert(i + 2, f'* [[{with_dots}]]\n')
                            print(f'Ajout lien vers "{with_dots}"')
                            changed = True
                        break
                if changed:
                    page.text = ''.join(lines)
                    summary.append('+ lien(s) vers abréviation(s)')

                page1 = pywikibot.Page(site, without_dots)
                page2 = pywikibot.Page(site, with_dots)
                if not page1.exists():
                    create_page(site, without_dots)
                if not page2.exists():
                    create_page(site, with_dots)

            if len(summary) != 0:
                summary = '(modification par bot) ' + ' & '.join(summary)
                page.save(summary=summary, watch='nochange', minor=True, botflag=True)
