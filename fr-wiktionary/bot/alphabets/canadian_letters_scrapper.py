import re

import requests

codes = list(range(0x1400, 0x167F + 1)) + list(range(0x18B0, 0x18F5 + 1))
title_regex = re.compile(r'<title>.+?- (.+?) \(U\+\w+\) -.+?</title>', re.MULTILINE)

with open('canadian_letters.csv', mode='w', encoding='UTF-8') as f:
    f.write('char,name')
    for code in codes:
        response = requests.request('GET', f'https://unicode-table.com/fr/{code:04X}/')
        matcher = title_regex.search(response.text)
        name = matcher.group(1)
        f.write('\n' + chr(code) + ',' + name)
        print(name)
