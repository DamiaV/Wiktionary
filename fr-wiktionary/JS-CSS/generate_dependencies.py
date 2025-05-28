import copy
import re

import pywikibot as pwb


def escape(name: str) -> str:
    return re.sub('[-./ ]', '_', name)


def main() -> None:
    site = pwb.Site('fr', 'wiktionary')
    definitions = pwb.Page(site, title='MediaWiki:Gadgets-definition').text
    matches: list[tuple[str, str]] = re.findall(r'^\*\s*([\w:.-]+?)\s*\[.+]\s*\|\s*(.+?)\s*$', definitions,
                                                re.MULTILINE)

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

    for gadget_name, deps in matches:
        dependencies = deps.split('|')
        gadget_id = escape(gadget_name)
        last_script = ''
        for dependency in dependencies:
            dependency = escape(dependency.strip())
            relations.append((gadget_id, dependency))
            if re.search('_js?$', dependency) and last_script[:-3] != gadget_id:
                last_script = dependency
        if last_script:
            rels = copy.copy(relations)
            for g_id, s in relations:
                if g_id == gadget_id and s != last_script and re.search('_js(on)?$', s):
                    rels.append((last_script, s))
                    rels.remove((g_id, s))
            relations = rels

    # Génération du graphe
    code = [
        'digraph Dependencies {\n',
        '  graph[rankdir="LR"];\n'
    ]

    for node_id, node_value in gadgets.items():
        color = 'black'
        if re.search('_js$', node_id):
            color = 'red'
        elif re.search('_json$', node_id):
            color = 'purple'
        elif re.search('_css$', node_id):
            color = 'blue'
        url = f'https://fr.wiktionary.org/wiki/Mediawiki:{node_value}'
        code.append(f'  {node_id}[label="Gadget-{node_value}",color={color},fontcolor={color},href="{url}"];\n')

    for node1, node2 in relations:
        code.append(f'  {node1} -> {node2};\n')

    code.append('}\n')

    with open('fr-wiktionary/JS-CSS/dependencies.dot', mode='w', encoding='UTF-8') as f:
        f.writelines(code)


if __name__ == '__main__':
    main()
