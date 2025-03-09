import lupa

with open('langues/data.lua', encoding='UTF-8') as f:
    langs = lupa.LuaRuntime().execute('\n'.join(f.readlines()))
    for code, name in sorted(langs.items()):
        print(f'* [[{code}]] - [[{name["nom"]}]]')
