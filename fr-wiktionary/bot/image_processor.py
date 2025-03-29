import os.path
import pathlib
import sys

from PIL import Image


def main():
    path = pathlib.Path(sys.argv[1])
    threshold = int(sys.argv[2])
    image = Image.open(path)
    image = image.convert('L')  # To grayscale
    image = image.point(lambda p: 255 if p > threshold else 0)  # Binarization
    # image = image.convert('1')  # To monochrome
    name, ext = os.path.splitext(path.name)
    image.save(path.parent / f'{name}-bin-{threshold}{ext}')


if __name__ == '__main__':
    main()
