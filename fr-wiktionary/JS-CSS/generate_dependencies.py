import re
import copy

import pywikibot as pwb


def escape(name: str):
    return re.sub('[-./ ]', '_', name)


site = pwb.Site()
raw = pwb.Page(site, title='MediaWiki:Gadgets-definition').text
matches = re.findall(r'^\*\s*([\w:.-]+?)\s*\[.+]\s*\|\s*(.+?)\s*$', raw, re.MULTILINE)

# Extraction des pages
gadgets = {}

for match in matches:
    gadget_name, dependencies = match
    dependencies = dependencies.split("|")
    gadgets[escape(gadget_name)] = gadget_name
    for dependency in dependencies:
        dependency = dependency.strip()
        gadgets[escape(dependency)] = dependency

# Établissement des dépendances.
relations = []

for match in matches:
    gadget_name, dependencies = match
    dependencies = dependencies.split("|")
    gadget_id = escape(gadget_name)
    last_script = ''
    for dependency in dependencies:
        dependency = escape(dependency.strip())
        relations.append((gadget_id, dependency))
        if re.search('_js$', dependency) and last_script[:-3] != gadget_id:
            last_script = dependency
    if last_script:
        rels = copy.copy(relations)
        for g_id, s in relations:
            if g_id == gadget_id and s != last_script and re.search('_js$', s):
                rels.append((last_script, s))
                rels.remove((g_id, s))
        relations = rels

# Génération du graphe
code = [
    'digraph Dependencies {\n',
    '\tgraph[rankdir="LR"];\n'
]

for node_id, node_value in gadgets.items():
    color = 'black'
    if re.search('_js$', node_id):
        color = 'red'
    elif re.search('_css$', node_id):
        color = 'blue'
    url = f'https://fr.wiktionary.org/wiki/Mediawiki:{node_value}'
    code.append(f'\t{node_id}[label="Gadget-{node_value}",color={color},fontcolor={color},href="{url}"];\n')

for node1, node2 in relations:
    code.append(f'\t{node1} -> {node2};\n')

code.append('}\n')

with open('JS-CSS/dependencies.dot', mode='w', encoding='UTF-8') as f:
    f.writelines(code)
