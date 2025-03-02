import typing as typ

Header = typ.Tuple[str]
Line = typ.Dict[str, typ.Optional[str]]
Column = typ.List[typ.Optional[str]]


class ParseError(BaseException):
    pass


class CSVReader:
    def __init__(self, filename: str, encoding: str = 'UTF-8', silent_errors: bool = False, ignore_quotes: bool = False,
                 default_column_name: str = '<column-{}>'):
        with open(filename, encoding=encoding) as file:
            self.__header, self.__contents = self.__read(file, silent_errors, ignore_quotes, default_column_name)
        self.__columns = {}

    @staticmethod
    def __read(file: typ.TextIO, silent_errors: bool, ignore_quotes: bool, default_column_name: str) \
            -> typ.Tuple[Header, typ.List[Line]]:
        header = ()
        lines = []

        def read_line(raw_line: str, line_idx: int, file_header: typ.Optional[Header]) -> typ.Union[Header, Line]:
            if ignore_quotes:
                values = [v.strip() for v in raw_line.split(',')]
            else:
                values = []
                buffer = ''
                i = 0
                quote_mode = False
                was_quote_mode = False
                while i < len(raw_line):
                    c = raw_line[i]
                    if quote_mode:
                        if c == '"':
                            if i < len(raw_line) - 1 and raw_line[i + 1] == '"':
                                buffer += '"'
                                i += 1
                            else:
                                quote_mode = False
                                was_quote_mode = True
                        else:
                            buffer += c
                    else:
                        if not c.isspace() or (buffer != '' and not was_quote_mode and i < len(raw_line) - 1):
                            if c == ',':
                                values.append(buffer if buffer == '' or was_quote_mode else buffer.rstrip())
                                buffer = ''
                                was_quote_mode = False
                            elif c == '"':
                                if buffer != '' or was_quote_mode:
                                    raise ParseError(f'Quote found in middle of value at {line_idx + 1}:{i + 1}.')
                                quote_mode = True
                            else:
                                if was_quote_mode:
                                    raise ParseError(f'Quote found in middle of value at {line_idx + 1}:{i + 1}.')
                                buffer += c
                    i += 1
                values.append(buffer)

            if file_header is None:
                return tuple(values)

            d = {}
            for header_i in range(max(len(values), len(file_header))):
                d[file_header[header_i] if header_i < len(file_header) else default_column_name.format(header_i)] = \
                    values[header_i] if header_i < len(values) else None

            return d

        for line_index, line in enumerate(file.readlines()):
            if len(header) == 0:
                header = read_line(line, line_index, None)
            else:
                parsed_line = read_line(line, line_index, header)
                expected_length = len(header)
                actual_length = len(parsed_line)
                if not silent_errors and (expected_length != actual_length or None in parsed_line.values()):
                    raise ParseError(f'Incorrect number of values in file on line {line_index + 1}, '
                                     f'expected {expected_length} got {actual_length}.')
                lines.append(parsed_line)

        return header, lines

    @property
    def header(self) -> Header:
        return self.__header

    @property
    def lines(self) -> typ.Iterable[Line]:
        return self.__contents

    @property
    def columns(self) -> typ.Dict[str, typ.Tuple[str, ...]]:
        if self.__columns == {}:
            self.__columns = {k: [] for k in self.__header}
            for line in self.__contents:
                for k, v in line.items():
                    self.__columns[k].append(v)
        return self.__columns

    def __getitem__(self, item: typ.Union[int, slice, str,
                                          typ.Tuple[typ.Union[int, slice],
                                                    typ.Union[int, slice, str, typ.Tuple[typ.Union[str, int], ...]]]]) \
            -> typ.Union[Line, Column, typ.List[Line], typ.List[Column]]:
        def select_columns(line: Line, cols: typ.Union[int, slice, str, typ.Tuple[typ.Union[str, int], ...]]) \
                -> typ.Union[str, Line, typ.Tuple[Line, ...]]:
            if isinstance(cols, int):
                return line[self.__header[cols]]
            elif isinstance(cols, slice):
                values = {}
                for i in range(*cols.indices(len(line))):
                    key = self.__header[i]
                    values[key] = line[key]
                return values
            elif isinstance(cols, str):
                return line[cols]
            elif isinstance(cols, tuple):
                values = {}
                for k in cols:
                    if isinstance(k, int):
                        key = self.__header[k]
                        values[key] = line[key]
                    elif isinstance(k, str):
                        values[k] = line[k]
                    else:
                        raise KeyError(f'Columns tuple must contain either strings or ints, got <{type(k).__name__}>.')
                return values
            else:
                raise KeyError('Second tuple value must be either string, int, slice or tuple of int or string, '
                               f'got <{type(cols).__name__}>.')

        if isinstance(item, str):
            if item not in self.__header:
                raise KeyError(f'No key named <{item}>.')
            return [line[item] for line in self.__contents]
        elif isinstance(item, int) or isinstance(item, slice):
            return self.__contents[item]
        elif isinstance(item, tuple):
            rows, columns = item
            if isinstance(rows, int):
                lines = [self.__contents[rows]]
            elif isinstance(rows, slice):
                lines = self.__contents[rows]
            else:
                raise KeyError(f'First tuple value must be either int or slice, got <{type(rows).__name__}>.')
            lines = [select_columns(line, columns) for line in lines]
            if isinstance(rows, int):
                if isinstance(columns, int) or isinstance(columns, str):
                    return lines[0][0]
                else:
                    return lines[0]
            return lines
        raise KeyError(f'Keys must be either string, int, slice or tuple, got <{type(item).__name__}>.')


def _test():
    r = CSVReader('test1.csv', silent_errors=False, ignore_quotes=False)
    assert r.header == ('c1', 'c2', 'c3 (a, b)'), r.header

    assert r.lines == [
        {'c1': '1', 'c2': ' 2, "3 ', 'c3 (a, b)': '4'},
        {'c1': 'a', 'c2': '', 'c3 (a, b)': 'c'},
        {'c1': '4', 'c2': ' 5"', 'c3 (a, b)': '6'},
        {'c1': '', 'c2': '7', 'c3 (a, b)': '8 '},
        {'c1': '9', 'c2': '1 0', 'c3 (a, b)': ''},
    ], r.lines

    assert r['c1'] == ['1', 'a', '4', '', '9'], r['c1']

    assert r[1] == {'c1': 'a', 'c2': '', 'c3 (a, b)': 'c'}, r[1]

    assert r[:2] == [
        {'c1': '1', 'c2': ' 2, "3 ', 'c3 (a, b)': '4'},
        {'c1': 'a', 'c2': '', 'c3 (a, b)': 'c'},
    ], r[:2]

    assert r[0, 0] == '1', r[0, 0]
    assert r[0, 'c1'] == '1', r[0, 'c1']

    assert r[:2, 0] == ['1', 'a'], r[:2, 0]
    assert r[:2, 'c1'] == ['1', 'a'], r[:2, 'c1']

    assert r[0, :2] == {'c1': '1', 'c2': ' 2, "3 '}, r[0, :2]
    assert r[0, ('c1', 'c2')] == {'c1': '1', 'c2': ' 2, "3 '}, r[0, ('c1', 'c2')]
    assert r[0, (0, 'c2')] == {'c1': '1', 'c2': ' 2, "3 '}, r[0, (0, 'c2')]

    assert r[:2, 1:3] == [
        {'c2': ' 2, "3 ', 'c3 (a, b)': '4'},
        {'c2': '', 'c3 (a, b)': 'c'}
    ], r[:2, 1:3]
    assert r[:2, ('c2', 'c3 (a, b)')] == [
        {'c2': ' 2, "3 ', 'c3 (a, b)': '4'},
        {'c2': '', 'c3 (a, b)': 'c'}
    ], r[:2, ('c2', 'c3 (a, b)')]
    assert r[:2, (1, 'c3 (a, b)')] == [
        {'c2': ' 2, "3 ', 'c3 (a, b)': '4'},
        {'c2': '', 'c3 (a, b)': 'c'}
    ], r[:2, ('c2', 'c3 (a, b)')]

    assert r.columns == {
        'c1': ['1', 'a', '4', '', '9'],
        'c2': [' 2, "3 ', '', ' 5"', '7', '1 0'],
        'c3 (a, b)': ['4', 'c', '6', '8 ', '']
    }, r.columns

    assert r.lines == r[:], (r.lines, r[:])

    r = CSVReader('test2.csv', silent_errors=True, ignore_quotes=False)
    assert r[1] == {'c1': 'a', 'c2': 'b', 'c3 (a, b)': 'c', 'c4': None}, r[1]

    r = CSVReader('test2-bis.csv', silent_errors=True, ignore_quotes=False)
    assert r[2] == {'c1': '4', 'c2': '5', 'c3 (a, b)': '6', 'c4': '7', '<column-4>': '9'}, r[2]

    try:
        CSVReader('test2.csv', silent_errors=False, ignore_quotes=False)
        raise AssertionError('expected ParseError')
    except ParseError:
        pass

    try:
        CSVReader('test2-bis.csv', silent_errors=False, ignore_quotes=False)
        raise AssertionError('expected ParseError')
    except ParseError:
        pass

    try:
        CSVReader('test3.csv', silent_errors=True, ignore_quotes=False)
        raise AssertionError('expected ParseError')
    except ParseError:
        pass


if __name__ == '__main__':
    _test()
