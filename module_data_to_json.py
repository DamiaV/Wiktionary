"""This script exports the data from [[Module:types de mots/data]] and [[Module:section article/data]] to JSON."""
import json
import re

import lupa
import pywikibot as pwb
import pywikibot.config as config


def table_to_json(table) -> dict | list:
    data = {}
    for k, v in table.items():
        if v.__class__.__name__ == '_LuaTable':  # Cannot use isinstance as _LuaTable class is not accessible
            v = table_to_json(v)
        data[str(k)] = v
    sorted_keys = sorted(data.keys())
    # If all numeric keys, convert to array
    if all(re.match(r'\d+', k) for k in sorted_keys):
        return [data[k] for k in sorted_keys]
    return data


def main() -> None:
    config.put_throttle = 0

    data_modules = [
        'Module:types de mots/data',
        'Module:section article/data',
        'Module:lexique/data',
    ]

    site = pwb.Site()
    for data_module in data_modules:
        lua_code = pwb.Page(site, data_module).text
        runtime = lupa.LuaRuntime()
        json_data = json.dumps(table_to_json(runtime.execute(lua_code)), ensure_ascii=False)

        json_page = pwb.Page(site, data_module + '/dump.json')
        json_page.text = json_data
        json_page.save(summary=f'Export automatique depuis [[{data_module}]]')


if __name__ == '__main__':
    main()
