import collections.abc as coll
import pathlib
import typing

import pywikibot as pwb


def iterate_cached(
        pages: coll.Iterable[pwb.Page],
        page_callback: typing.Callable[[pwb.Page], None],
        cache_batch_count: int = 10,
        cache_file_name_prefix: str = __file__,
) -> tuple[int, int]:
    """Iterate over a collection of pages using a callback function.
    Pages that have already been iterated over are ignored.
    Each page is appended to a cache file so that if the script is interrupted,
    the next time it is launched these pages will not be iterated over a second time.

    :param pages: The pages to iterate over.
    :param page_callback: The callback function that will be called for each page.
    :param cache_batch_count: The number of pages to cache at a time.
    :param cache_file_name_prefix: The prefix of the cache file’s name.
    :return: A tuple containing the number of iterated and treated pages, in this order.
    """
    # Load cache of already treated pages
    cache_file_path = pathlib.Path(cache_file_name_prefix + '.cache.txt')
    if cache_file_path.exists():
        with cache_file_path.open('r', encoding='utf-8') as file_in:
            treated_pages = file_in.read().splitlines()
    else:
        treated_pages = []

    treated_pages_buffer = []
    count = 0
    treated_count = 0
    for page in pages:
        if page.title() in treated_pages:
            continue
        old_text = page.text
        page_callback(page)
        if old_text != page.text:
            treated_count += 1
        treated_pages_buffer.append(page.title())
        if len(treated_pages_buffer) == cache_batch_count:  # Batch cache updates
            with cache_file_path.open('a', encoding='utf-8') as file_out:
                file_out.write('\n'.join(treated_pages_buffer) + '\n')
            treated_pages += treated_pages_buffer
            treated_pages_buffer.clear()
        count += 1
    return count, treated_count
