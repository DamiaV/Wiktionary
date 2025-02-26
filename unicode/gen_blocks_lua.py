import datetime

with open('blocks.csv', encoding='UTF-8') as f_in:
    with open('../models-modules/données Unicode/data/blocks.lua', mode='w', encoding='UTF-8') as f_out:
        f_out.write(f"""-- This page lists all Unicode blocks.
-- Do not edit this page manually as it is automatically generated.
-- Last generation: {datetime.datetime.now()}

-- Sources:
-- https://www.unicode.org/Public/UCD/latest/ucd/Blocks.txt

-- Values : lower bound, upper bound, {{english name, french name}}, PDF’s URL, Unicode version, publication year

return {{""")
        for line in f_in.readlines()[1:]:
            lower, upper, name, f_name, url, version, year = line.rstrip().split(',')
            f_out.write(
                f'\n  [0x{int(lower, 16):06X}] = {{ lower = 0x{int(lower, 16):06X}, upper = 0x{int(upper, 16):06X}, '
                f'name = {{ en = "{name}", fr = "{f_name}" }}, url = "{url}", version = "{version}", '
                f'year = "{year}" }},'
            )
        f_out.write("""
}
""")
