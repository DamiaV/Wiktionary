import requests
import json

params = {
    'action': 'query',
    'meta': 'siteinfo',
    'siprop': 'namespaces',
    'format': 'json',
}
response = requests.get('https://fr.wiktionary.org/w/api.php', params=params)

last_id = 0
for namespace in sorted(json.loads(response.text)['query']['namespaces'].values(), key=lambda ns: ns['id']):
    ident = namespace['id']
    canonical_name = (namespace['canonical'] if ident else 'Main')
    var_name = (canonical_name.replace(' ', '_') if ident else 'Main').upper().replace('É', 'E')
    canonical_name = (namespace['canonical'] if ident else '')

    if ident != last_id + 1:
        print()
    print(f"""\
export.NS_{var_name} = {{
  id = {ident},
  canonical_name = '{canonical_name}',
  local_name = '{namespace['*']}',
}}\
""")
    last_id = ident
