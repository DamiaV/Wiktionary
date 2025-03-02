import sys

import eo_pron

if len(sys.argv) == 1:
    word = input('Word: ')
    syllables = input('Syll: ').lower() in ['y', 'yes', '1', 'o', 'oui']
else:
    word = sys.argv[1]
    syllables = len(sys.argv) == 3 and sys.argv[2] == '-s'
print(eo_pron.pronunciation(word, show_syllables=syllables))
