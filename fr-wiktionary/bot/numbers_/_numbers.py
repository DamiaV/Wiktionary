try:
    from ._data import NUMBERS
except ModuleNotFoundError:
    from bot.numbers_._data import NUMBERS


def get_number_name(i: int, lang: str, ordinal: bool = False, case: int = 1) -> str:
    """
    Returns the textual version of the given number.
    :param i: The positive integer to convert (from 0 to 10000 excluded).
    :param lang: The target language.
    :param ordinal: If true, number will be an ordinal.
    :param case: Grammatical case (index).
    :return: The textual name of the given integer.
    """
    numbers = NUMBERS[lang]
    plus_sep = numbers['plus']
    times_sep = numbers['times']

    def get(values):
        if not ordinal:
            return values[0]
        else:
            if len(values) == 1:
                return values[0] + numbers['ordinal suffix']
            elif 1 <= len(values) <= case:
                return values[1]
            else:
                return values[case]

    if i in numbers:
        return get(numbers[i])
    else:
        res = ''

        tens = 1
        while i > 0:
            t = i % 100
            # First two digits (tens and units)
            if tens == 1 and t in numbers and t != 0:
                res = get(numbers[t]) + res
                i = i // 100
                tens = 100
            else:
                v = i % 10
                if v != 0:
                    if v * tens in numbers:
                        s = get(numbers[v * tens]) if res == '' else numbers[v * tens][0]
                    else:
                        s = numbers[v][0] + times_sep + (get(numbers[tens]) if res == '' else numbers[tens][0])
                    if res != '':
                        res = plus_sep + res
                    res = s + res
                i = i // 10
                tens *= 10

        return res.lstrip(plus_sep)


if __name__ == '__main__':
    print(get_number_name(2, 'fr', ordinal=True, case=2))
