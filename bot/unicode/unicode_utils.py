from __future__ import annotations

import dataclasses as dc
import pathlib
import typing as typ

ROOT = pathlib.Path('').absolute()

_BLOCKS: typ.List[UnicodeBlock] = []


@dc.dataclass(frozen=True)
class UnicodeBlock:
    range_lower: int
    range_upper: int
    name_en: str
    name_fr: str
    pdf_url: str
    version: str
    year: int

    def __post_init__(self):
        self.__raise_error_if_empty(self.name_en)
        self.__raise_error_if_empty(self.name_fr)
        self.__raise_error_if_empty(self.pdf_url)
        self.__raise_error_if_empty(self.version)

    def contains_character(self, c: str) -> bool:
        return self.range_lower <= ord(c) <= self.range_upper

    @staticmethod
    def __raise_error_if_empty(s: str) -> typ.Union[str, None]:
        if s == '':
            raise ValueError('Empty field')
        return s


def get_blocks(letters: str) -> typ.List[UnicodeBlock]:
    if len(_BLOCKS) == 0:
        _extract_blocks()
    blocks = []
    for letter in letters:
        for block in _BLOCKS:
            if block.contains_character(letter):
                blocks.append(block)
    return blocks


def get_block(first_codepoint: int) -> typ.Optional[UnicodeBlock]:
    if len(_BLOCKS) == 0:
        _extract_blocks()
    for block in _BLOCKS:
        if block.range_lower == first_codepoint:
            return block
    return None


def get_codepoints(letters: str) -> typ.List[str]:
    return [f'U+{ord(ll):04X}' for ll in letters]


def _extract_blocks():
    global _BLOCKS
    with (ROOT / 'unicode/blocks.csv').open(encoding='utf-8') as f:
        header = True
        for line in f.readlines():
            if header:
                header = False
            else:
                try:
                    range_lower, range_upper, name_en, name_fr, pdf_url, version, year = line.strip().split(',')
                    range_lower = int(range_lower, 16)
                    range_upper = int(range_upper, 16)
                    year = int(year)

                    _BLOCKS.append(UnicodeBlock(range_lower=range_lower, range_upper=range_upper, name_en=name_en,
                                                name_fr=name_fr, pdf_url=pdf_url, version=version, year=year))
                except ValueError:
                    continue
