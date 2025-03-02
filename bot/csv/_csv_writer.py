import typing as typ


class CSVWriter:
    def __init__(self, file_name: str, header: typ.Sequence[str], encoding='UTF-8', escape=True):
        self.__file = open(file_name, mode='w', encoding=encoding)
        if len(header) == 0:
            raise ValueError('Empty header')
        self.__header = tuple(header)
        self.__escape = escape
        self.__header_written = False

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.__file.close()

    @property
    def header(self):
        return self.__header

    def force_write_header(self):
        self.__write(True, *self.__header)

    def write_line(self, *values: str, **named_values):
        self.__write(False, *values, **named_values)

    def write_lines(self, *lines: typ.Union[typ.Sequence[str], typ.Dict[str, str]]):
        for line in lines:
            if isinstance(line, dict):
                self.__write(False, **line)
            else:
                self.__write(False, *line)

    def close(self):
        self.__file.close()

    def __write(self, header: bool, *values: str, **named_values):
        def escape(s):
            if '"' in s:
                s = '"' + s.replace('"', '""') + '"'
            elif len(s) != 0 and (s[0].isspace() or s[-1].isspace() or ',' in s):
                s = f'"{s}"'
            s = s.replace('\n', r'\n').replace('\r', r'\r')
            return s

        def check(s):
            if ',' in s:
                raise ValueError('Comma in value.')
            if '\n' in s or '\r' in s:
                raise ValueError('Line feed or carriage return in value.')
            return s

        if not self.__header_written:
            self.__header_written = True
            self.__write(True, *self.__header)

        header_length = len(self.__header)
        values_length = len(values)
        named_values_length = len(named_values)

        if values_length != 0 and named_values_length != 0:
            raise ValueError('Variable and names arguments should not be both specified.')

        if values_length == header_length:
            line = ','.join([escape(v) if self.__escape else check(v) for v in values])
        elif values_length != 0:
            raise ValueError(f'Wrong number of values, expected {header_length} got {values_length}.')
        elif named_values_length != 0:
            vals = [''] * header_length
            for k, v in named_values.items():
                if k not in self.__header:
                    raise ValueError(f'Unknown key "{k}".')
                vals[self.__header.index(k)] = escape(v) if self.__escape else check(v)
            line = ','.join(vals)
        else:
            line = ',' * (header_length - 1)
        self.__file.write(('\n' if not header else '') + line)


def _test():
    header = ['c1', 'c\n2', 'c,3']
    csv = [['1 ', ' 2', '3"3'], ['', 'a', 'b'], [], ['c', '', 'd'], ['e', 'f', '']]
    with CSVWriter('test-write1.csv', header, escape=True) as w:
        for line in csv:
            w.write_line(*line)

    csv = [['0 ', ' 2', '3"3'], ['', 'a', 'b'], {'c1': 'c', 'c,3': 'd', 'c\n2': ''}, ['e', 'f', '']]
    with CSVWriter('test-write2.csv', header, escape=True) as w:
        w.write_lines(*csv)

    with CSVWriter('test-write3.csv', header, escape=True) as w:
        w.write_line(**{'c1': 'c', 'c,3': 'd', 'c\n2': ''})
        w.write_line(**{'c1': 'a', 'c,3': 'b'})

    try:
        w = CSVWriter('dummy_file.csv', header, escape=True)
        w.write_lines('a')
        raise AssertionError()
    except ValueError as e:
        print(e)
    finally:
        w.close()

    try:
        w = CSVWriter('dummy_file.csv', header, escape=True)
        w.write_line('a', 'b', 'c', 'd')
        raise AssertionError()
    except ValueError as e:
        print(e)
    finally:
        w.close()

    try:
        w = CSVWriter('dummy_file.csv', [], escape=True)
        raise AssertionError()
    except ValueError as e:
        print(e)
    finally:
        w.close()

    try:
        w = CSVWriter('dummy_file.csv', ['a,b'], escape=False)
        w.force_write_header()
        raise AssertionError()
    except ValueError as e:
        print(e)
    finally:
        w.close()

    try:
        w = CSVWriter('dummy_file.csv', ['a\nb'], escape=False)
        w.force_write_header()
        raise AssertionError()
    except ValueError as e:
        print(e)
    finally:
        w.close()

    try:
        w = CSVWriter('dummy_file.csv', ['a\rb'], escape=False)
        w.force_write_header()
        raise AssertionError()
    except ValueError as e:
        print(e)
    finally:
        w.close()


if __name__ == '__main__':
    _test()
