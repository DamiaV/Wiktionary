import lupa

with open('test.lua', encoding='UTF-8') as f:
    functions = lupa.LuaRuntime().eval('\n'.join(f.readlines()))
    print(functions('I'))
    # print(functions['fromRoman'].coroutine('I').send(None))
