import lupa

blocks = lupa.LuaRuntime().execute('\n'.join(open('../../models-modules/données Unicode/data/blocks.lua').readlines()))

with open('blocks.txt', encoding='UTF-8') as f:
    codes = []
    for line in f.readlines():
        i = int(line[:line.index('.')], 16)
        codes.append(line[:line.index('.')])
        if i not in blocks.keys():
            print(line, 'not in Lua')
    for k in blocks.keys():
        if f'{k:04X}' not in codes:
            print(line, 'not in Unicode')
