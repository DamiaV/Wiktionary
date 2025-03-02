import collections
import datetime

import lxml.etree as etree
import requests

unicode_scripts = {}
with open('scripts.txt', encoding='UTF-8') as f:
    for script in f.readlines():
        script = script.strip()
        if '#' in script:
            script = script[:script.index('#')]
        if ';' in script:
            codes, script = [v.strip().replace(' ', '_') for v in script.split(';')]
            if script not in unicode_scripts:
                unicode_scripts[script] = []

            # Fusion des plages contigües
            if '..' in codes:
                lower, upper = [int(v, 16) for v in codes.split('..')]
            else:
                lower = upper = int(codes, 16)
            if len(unicode_scripts[script]) > 0 and unicode_scripts[script][-1][1] + 1 == lower:
                unicode_scripts[script][-1][1] = upper
            else:
                unicode_scripts[script].append([lower, upper])
unicode_scripts = dict(sorted(unicode_scripts.items()))

answer = requests.get('https://en.wikipedia.org/wiki/Template:ISO_15924_script_codes_and_related_Unicode_data')
root = etree.HTML(answer.text)

directions = collections.defaultdict(lambda: 'm', {
    'left-to-right': 'lr',
    'bottom-to-top left-to-right': 'lr',
    'left-to-right bottom-to-top': 'lr',
    'right-to-left': 'rl',
    'right-to-left script': 'rl',
    'right-to-left script top-to-bottom': 'rl',
    'columns right-to-left (historically)': 'rl',
    'varies': 'm',
    'mixed': 'm',
    'inherited': 'i',
    '': 'i',
})
script_to_direction = {}
for element in root.xpath('//div[@class="mw-parser-output"]/table[position()=1]/tbody/tr'):
    children = element.getchildren()
    if len(children) >= 4 and children[0].tag == 'td':
        iso_code = ''.join(children[0].itertext()).strip()[-4:]
        direction = ''.join(children[3].itertext()).strip()
        raw_dir = direction.strip().lower().replace(',', '')
        if raw_dir.startswith('vertical'):
            vertical = True
            raw_dir = raw_dir.replace('vertical', '').strip()
        elif raw_dir.startswith('top-to-bottom'):
            vertical = True
            raw_dir = raw_dir.replace('top-to-bottom', '').strip()
        else:
            vertical = False
        script_to_direction[iso_code] = 'tb' if vertical else directions[raw_dir]

iso_scripts = {}
with open('iso15924-utf8.txt', encoding='UTF-8') as f:
    for script in f.readlines():
        script = script.strip()
        if script != '' and script[0] != '#':
            iso_code, number, name, f_name, alias, _, _ = script.rstrip().split(';')
            if iso_code in ['Geok', 'Geor']:
                name = name[:name.index(' ')]
                f_name = f_name[:f_name.index(' ')]
            iso_scripts[alias] = (iso_code, name, f_name)

with open('../../models-modules/données Unicode/data/scripts.lua', mode='w', encoding='UTF-8') as f_out:
    f_out.write(f"""-- List of Unicode/ISO 15924 scripts.
-- Do not edit this page manually as it is automatically generated.
-- Last generation: {datetime.datetime.now()}

-- Sources:
-- https://unicode.org/iso15924/iso15924-text.html
-- https://www.unicode.org/Public/UCD/latest/ucd/Scripts.txt
-- https://en.wikipedia.org/w/index.php?title=Template:ISO_15924_script_codes_and_related_Unicode_data&oldid=1116205109

-- Values: code, writing direction, vertical, {{english name, french name}}
-- Writing directions:
-- * lr: left to right
-- * rl: right to left
-- * tb: top to bottom
-- * m: mixed
-- * i: inherited (diacritics, common characters, etc.)

return {{""")
    for unicode_script, unicode_script_data in unicode_scripts.items():
        iso_code, name, f_name = iso_scripts[unicode_script]
        direction = script_to_direction[iso_code]
        f_out.write(
            f'\n  ["{unicode_script}"] = {{ code = "{unicode_script}", direction = "{direction}",'
            f' name = {{ en = "{name}", fr = "{f_name}" }} }},'
        )
    f_out.write(
        f'\n  -- For all characters with no associated script'
    )
    f_out.write(
        f'\n  ["Unknown"] = {{ code = "Unknown", direction = "i", name = {{ en = "Unknown", fr = "Inconnu" }} }},'
    )
    f_out.write("""
}
""")

with open('../../models-modules/données Unicode/data/script_ranges.lua', mode='w', encoding='UTF-8') as f_out:
    f_out.write(f"""-- This page defines the code point ranges of all writing systems.
-- Do not edit this page manually as it is automatically generated.
-- Last generation: {datetime.datetime.now()}

-- Sources:
-- https://www.unicode.org/Public/UCD/latest/ucd/Scripts.txt

return {{""")
    lines = {}
    for unicode_script, unicode_script_data in unicode_scripts.items():
        for range_ in unicode_script_data:
            lower, upper = range_
            lines[lower] = f'\n  [{{ 0x{lower:04X}, 0x{upper:04X} }}] = "{unicode_script}",'
    lines = dict(sorted(lines.items()))
    for line in lines.values():
        f_out.write(line)
    f_out.write("""
}
""")
