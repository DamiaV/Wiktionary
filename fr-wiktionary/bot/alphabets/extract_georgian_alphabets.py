import json

with open('georgian_letters.json', encoding='UTF-8') as f:
    data = json.load(f)
    languages = data['languages']
    letters = data['letters']
    alphabets = {}
    for letter in letters:
        asomtavruli = letter['asomtavruli']
        nuskhuri = letter['nuskhuri']
        mtavruli = letter['mtavruli']
        mkhedruli = letter['mkhedruli']
        for l10n_letter in letter['languages']:
            lang_id = l10n_letter['language id']
            language = languages[l10n_letter['language id']]
            if lang_id not in alphabets:
                alphabets[lang_id] = []
            d = {'index': l10n_letter['index'], 'mtavruli': mtavruli, 'mkhedruli': mkhedruli}
            if language['code'] == 'ka':  # Georgian
                d.update({'asomtavruli': asomtavruli, 'nuskhuri': nuskhuri})
            alphabets[lang_id].append(d)
    alphabets = {k: sorted(v, key=lambda e: e['index'] or 100) for k, v in alphabets.items()}

    for i, alphabet in alphabets.items():
        with open(f'../models-modules/alphabets/géorgien/alphabet_{languages[i]["name"]}_brut.wiki', mode='w',
                  encoding='UTF-8') as out:
            w = 1 / ((1 + len(alphabet)) // 2) * 100
            for j, letter in enumerate(alphabet):
                if j == (1 + len(alphabet)) // 2:
                    out.write('|-\n')
                links = f'[[{letter["mtavruli"]}]]<br/>[[{letter["mkhedruli"]}]]'
                if 'asomtavruli' in letter:
                    links = f'[[{letter["asomtavruli"]}]]<br/>[[{letter["nuskhuri"]}]]<br/>' + links
                out.write(f'| style="width: {w:0.3f}%;" | {links}\n')
