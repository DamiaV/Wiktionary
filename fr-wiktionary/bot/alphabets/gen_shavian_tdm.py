with open('alphabets/shavian_characters.csv', encoding='utf-8') as f:
    for line in f.readlines()[1:]:
        letter, _, _ = line.strip().split(',')
        print(f"{{{{·|{{{{tdmin|{letter}}}}}}}}}")
