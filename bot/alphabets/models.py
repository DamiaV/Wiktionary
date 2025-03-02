import typing as typ

from bot import unicode as uu


def get_models(letters: str, as_list: bool = False) -> typ.List[str]:
    models = [('* ' if as_list else '') + f'{{{{R:Bloc Unicode|0x{b.range_lower:04X}}}}}'
              for b in uu.get_blocks(letters)]
    return list(dict.fromkeys(models))
