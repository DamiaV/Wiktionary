import json
import os
import re
import sys
import typing as typ

import pywikibot as pwb

ROOT = 'JS-CSS'
BUILD_DIR = 'build'

site = pwb.Site()

build_file = os.path.join(ROOT, BUILD_DIR, sys.argv[1])
build_chore = sys.argv[2]
push_dependencies = len(sys.argv) >= 4 and sys.argv[3] == '-d'

with open(build_file, mode='r', encoding='UTF-8') as f:
    build_config = json.load(f)

root: str = build_config['root']
namespace: int = build_config['namespace']
files: typ.List[str] = build_config['page_names']
dependencies: typ.List[str] = build_config.get('dependencies', [])
build_chores: dict = build_config.get('build', {})

# Copy chore
copy_chore: dict = build_chores.get('copy', {})
copy_filename_rules: dict = copy_chore.get('filename_rules', [])
copy_content_rules: dict = copy_chore.get('content_rules', [])

push_gadget = build_chore == 'push'
copy_gadget = build_chore == 'copy'
pull_gadget = build_chore == 'pull'

messages = {
    'push': 'Pushing',
    'copy': 'Copying',
    'pull': 'Pulling',
}

if build_chore not in messages:
    raise ValueError(f'illegal chore type "{build_chore}"')


def handle_file(name: str, commit_message: str):
    def get_file_content() -> str:
        with open(path, mode='r', encoding='UTF-8') as f_in:
            return ''.join(f_in.readlines())

    print(f'{messages[build_chore]} file "{name}"…')

    *p, fname = name.split('/')
    path = os.path.join(ROOT, root, *map(lambda s: s.replace('.js', '_js'), p), fname)

    if push_gadget:
        page = pwb.Page(site, title=name, ns=namespace)
        content = get_file_content()
        if content.rstrip() != page.text.rstrip():
            page.text = get_file_content()
            page.save(summary="(Déploiement automatique) " + commit_message)
        else:
            print(f'Page [[{page.title()}]] unchanged.')
    elif pull_gadget:
        page = pwb.Page(site, title=name, ns=namespace)
        with open(path, mode='w', encoding='UTF-8') as f_out:
            f_out.write(page.text + '\n')
    elif copy_gadget:
        target_file = path
        for filename_rule in copy_filename_rules:
            target_file = re.sub(filename_rule['pattern'], filename_rule['repl'], target_file)
        new_content = get_file_content()
        for content_rule in copy_content_rules:
            new_content = re.sub(content_rule['pattern'], content_rule['repl'], new_content)

        print(f'Copying file to "{target_file}"…')
        with open(target_file, mode='w', encoding='UTF-8') as f_out:
            f_out.write(new_content)

    print('Done.')


if push_gadget:
    commit_message = input('Commit message: ')
else:
    commit_message = ''

for file_name in files:
    handle_file(file_name, commit_message)

if push_gadget and push_dependencies:
    for file_name in dependencies:
        handle_file(file_name, commit_message)

print('Finished.')
