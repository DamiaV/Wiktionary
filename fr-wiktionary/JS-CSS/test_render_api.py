import requests

response = requests.get('https://fr.wiktionary.org/w/api.php', params={
    'action': 'parse',
    'page': 'Conjugaison:français/être',
    'useskin': 'timeless',
    'format': 'json',
})

content = response.json()['parse']['text']['*']
with open('render.html', mode='w', encoding='UTF-8') as out:
    out.write('<!DOCTYPE html><html><body>\n')
    out.write(content)
    out.write('\n</body></html>')
    out.flush()
