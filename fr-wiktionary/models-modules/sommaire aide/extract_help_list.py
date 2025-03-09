import re

with open('list.txt', mode='r', encoding='UTF-8') as f:
    tree = {}

    tab_index = 1
    item_index = 1
    current_tab = None

    for line in map(str.rstrip, f.readlines()):
        # noinspection RegExpRepeatedSpace
        if m := re.match(r'- ([^(]+?) \((.+?)\)', line):
            page_title, tab_title = m.groups()
            tree[page_title] = {
                'title': tab_title,
                'index': tab_index,
                'items': {},
                'colors': {
                    'normal': {'bg': '#', 'fg': 'black'},
                    'selected': {'bg': '#', 'fg': 'white'},
                    'itemActive': {'bg': '#', 'fg': 'white'},
                },
            }
            current_tab = page_title
            tab_index += 1
            item_index = 1
        elif m := re.match(r'  - ([^(]+?) \((.+?)\)', line):
            page_title, item_title = m.groups()
            tree[current_tab]['items'][page_title] = {
                'title': item_title,
                'index': item_index,
            }
            item_index += 1

    print(re.sub(r'("[^"]+?") =', r'[\1] =',
                 re.sub(r'"(title|index|items|colors|normal|selected|itemActive|bg|fg)"', r'\1',
                        repr(tree).replace("':", "' =").replace("'", '"'))))
