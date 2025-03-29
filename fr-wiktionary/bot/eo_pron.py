import re

_PHONEMS = {
    'a': 'a',
    'b': 'b',
    'c': 'c',
    'ĉ': 't͡ʃ',
    'd': 'd',
    'e': 'e',
    'f': 'f',
    'g': 'ɡ',
    'ĝ': 'd͡ʒ',
    'h': 'h',
    'ĥ': 'x',
    'i': 'i',
    'j': 'j',
    'ĵ': 'ʒ',
    'k': 'k',
    'l': 'l',
    'm': 'm',
    'n': 'n',
    'o': 'o',
    'p': 'p',
    'r': 'r',
    's': 's',
    'ŝ': 'ʃ',
    't': 't',
    'u': 'u',
    'ŭ': 'w',
    'v': 'v',
    'z': 'z',
}

_VOWELS = 'aeiou'


def pronunciation(word: str, show_syllables=False) -> str:
    """
    Generates the API pronunciation of an Esperanto word.
    :param word: The word.
    :param show_syllables: If true, the function will attempt to separate syllables and mark the stress.
    :return: The word's pronunciation.
    """
    words = []
    for w in word.lower().split():
        show = show_syllables and re.fullmatch('[aeiou]?([^aeiou][aeiou])*j?n?', w.lower())
        syllables = ['']
        syllable_index = 0
        for i, c in enumerate(w):
            if c in _PHONEMS:
                syllables[syllable_index] += _PHONEMS[c]
            else:
                raise ValueError(f'Unknown symbol "{c}"!')
            if show and c in _VOWELS and i != len(w) - 1 and not (i >= len(w) - 3 and w[-1] in 'jn'):
                syllable_index += 1
                syllables.append('')

        if len(syllables) > 1:
            syllables[-2] = 'ˈ' + syllables[-2]
        words.append('.'.join(syllables))
    return ' '.join(words)
