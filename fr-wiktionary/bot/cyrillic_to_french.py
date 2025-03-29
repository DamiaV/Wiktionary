"""
Russian to French transcriptor.
For conversion table see:
https://fr.wikipedia.org/wiki/Transcription_du_russe_en_fran%C3%A7ais#Tableau
"""


def is_cons(char):
    return char in 'бвгджзклмнпрстфхцчшщ'


def is_vowel(char):
    return char in 'аеёийоуыэюя'


def is_ij(char):
    return char in 'ий'


def is_iy(char):
    return char in 'иы'


def is_sign(char):
    return char in 'ъь'


TRANS = {
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'д': 'd',
    'ё': 'io',  # Conventions non gérées
    'ж': 'j',
    'з': 'z',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'т': 't',
    'у': 'ou',  # Conventions non gérées
    'ф': 'f',
    'х': 'kh',
    'ц': 'ts',
    'ч': 'tch',
    'ш': 'ch',
    'щ': 'chtch',
    'ъ': '”',
    'ы': 'y',
    'ь': '’',
    'э': 'e',
}

cyrillic = input('Mot cyrillique\u00a0: ')

transcription = ''
for i, c in enumerate(cyrillic):
    is_upper = c.isupper()
    is_first = i == 0
    is_last = i == len(cyrillic) - 1
    c = c.lower()
    prev_c = cyrillic[i - 1].lower() if i - 1 >= 0 else '-'
    next_c = cyrillic[i + 1].lower() if i + 1 < len(cyrillic) else '-'

    t = ''

    if c in TRANS:
        t = TRANS[c]
    elif c == 'г':
        if next_c in 'еи':
            t = 'gu'
        else:
            t = 'g'
    elif c == 'е':  # Conventions non gérées
        if is_cons(prev_c) or is_ij(prev_c):
            t = 'e'
        elif is_vowel(prev_c) and not is_ij(prev_c):
            t = 'ïe'
        elif is_first or is_sign(prev_c):
            t = 'ie'
    elif c == 'и':
        if is_vowel(prev_c) and prev_c != 'и':
            t = 'ï'
        else:
            t = 'i'
    elif c == 'й':
        if not is_last or not is_iy(prev_c):
            t = 'ï'
    elif c == 'н':
        if is_last and is_iy(prev_c):
            t = 'ne'
        else:
            t = 'n'
    elif c == 'с':
        if is_vowel(prev_c) and is_vowel(next_c):
            t = 'ss'
        else:
            t = 's'
    elif c == 'ю':  # Conventions non gérées
        if is_ij(prev_c):
            t = 'ou'
        elif is_vowel(prev_c):
            t = 'ïou'
        else:
            t = 'iou'
    elif c == 'я':  # Conventions non gérées
        if is_ij(prev_c):
            t = 'a'
        elif is_vowel(prev_c):
            t = 'ïa'
        else:
            t = 'ia'

    if is_upper:
        t = t.title()

    transcription += t

print(transcription)
