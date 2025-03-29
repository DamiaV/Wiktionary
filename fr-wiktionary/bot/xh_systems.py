_X = {
    'ĉ': 'cx',
    'ĝ': 'gx',
    'ĥ': 'hx',
    'ĵ': 'jx',
    'ŝ': 'sx',
    'ŭ': 'ux',
    'Ĉ': 'Cx',
    'Ĝ': 'Gx',
    'Ĥ': 'Hx',
    'Ĵ': 'Jx',
    'Ŝ': 'Sx',
    'Ŭ': 'Ux',
}
_H = {
    'ĉ': 'ch',
    'ĝ': 'gh',
    'ĥ': 'hh',
    'ĵ': 'jh',
    'ŝ': 'sh',
    'ŭ': 'u',
    'Ĉ': 'Ch',
    'Ĝ': 'Gh',
    'Ĥ': 'Hh',
    'Ĵ': 'Jh',
    'Ŝ': 'Sh',
    'Ŭ': 'U',
}


def to_x_system(word):
    for letter, x_letter in _X.items():
        word = word.replace(letter, x_letter)
    return word


def to_h_system(word):
    for letter, h_letter in _H.items():
        word = word.replace(letter, h_letter)
    return word
