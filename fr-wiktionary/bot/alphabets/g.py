import json

with open('georgian_letters.json', encoding='UTF-8') as f:
    data = json.load(f)
    letters = data['letters']
    base_letters = [letter for letter in letters
                    if len(letter['languages']) != 0 and letter['languages'][0]['language id'] == 0 and not
                    letter['languages'][0]['archaic']]
    w = 100 / len(base_letters)
    for letter in base_letters:
        asomtavruli = letter['asomtavruli']
        nuskhuri = letter['nuskhuri']
        mtavruli = letter['mtavruli']
        mkhedruli = letter['mkhedruli']
        print(f'| style="width:{w:.3f}%" | [[{asomtavruli}]]<br />[[{nuskhuri}]]<br />'
              f'[[{mtavruli}]]<br />[[{mkhedruli}]]')

    print()
    additional_letters = [letter for letter in letters if letter not in base_letters and len(letter['mkhedruli']) == 1]
    for letter in additional_letters:
        asomtavruli = letter['asomtavruli']
        nuskhuri = letter['nuskhuri']
        mtavruli = letter['mtavruli']
        mkhedruli = letter['mkhedruli']
        links = f'[[{mtavruli}]]<br />[[{mkhedruli}]]'
        if asomtavruli is not None:
            links = f'[[{asomtavruli}]]<br />[[{nuskhuri}]]<br />' + links
        print(f'| style="width:{w:.3f}%" | {links}')
