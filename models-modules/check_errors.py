import os

import lupa

file = '0E0'
with open(os.path.join('données Unicode/names', file + '.lua'), mode='r+', encoding='UTF-8') as f:
    code = ''.join(f.readlines())
    characters = lupa.LuaRuntime().execute(code)
    for codepoint in list(characters.keys()):
        fr_name = characters[codepoint].fr
        if fr_name == '' or fr_name.upper() == '</SPAN>':
            print(f'{codepoint:04X}')
