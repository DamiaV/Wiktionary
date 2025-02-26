import os
import re

import lupa
import requests

root_dir = 'données Unicode/names'
for file in os.listdir(root_dir):
    with open(os.path.join(root_dir, file), mode='r+', encoding='UTF-8') as f:
        print(file)
        code = ''.join(f.readlines())
        characters = lupa.LuaRuntime().execute(code)
        for codepoint in list(characters.keys()):
            names = characters[codepoint]
            print('\t' + names.en)
            if names.fr == '':
                answers = requests.request('GET', f'https://unicode-table.com/fr/{codepoint:04X}/')
                matches = re.search(r'id="symbol-title">\s*(.+?)\s*</', answers.text)
                french_name = re.sub("'|&#039;", "’", matches.group(1)).upper().replace('"', r'\"')
                code = re.sub(fr'(0x{codepoint:04X}.+")(")', fr'\1{french_name}\2', code)
                print('\t\t' + french_name)
            else:
                print('\t\talready fetched: ' + names.fr)
        f.seek(0)
        f.write(code)
