"""
Convert the KOKOLOCK catalogue pages into the two sizes the site serves.

Run:
    python catalogue/build_catalogue.py [source-dir ...]

The masters arrive as 32 PNGs at 1080 x 1350, about 15 MB in total, which is more than
the rest of the site put together. Each page is written out twice instead:

    assets/images/kokolock-NN.webp      1080px wide, opened in the viewer
    assets/images/kokolock-NN-sm.webp    560px wide, shown in the rail

The rail only ever shows a few cards at a time and they lazy-load, so a visitor who
never opens the catalogue pays for almost none of it.

Quality is set high for a photograph because these pages are mostly type. Lossy WebP
softens small text before it softens a photograph, and a price list that cannot be read
is not worth the bytes it saves.

The PNG masters are not kept in the repository -- the full-size WebP is the archived
copy. Pass the source directories as arguments to rebuild from the originals.
"""
import os
import re
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "assets", "images")

DEFAULT_SOURCES = [
    os.path.join(os.path.expanduser("~"), "Downloads", "ENG VER - KAKAOTALK"),
    os.path.join(os.path.expanduser("~"), "Downloads", "ENG VER - KAKAOTALK (1)"),
    os.path.join(os.path.expanduser("~"), "Downloads", "ENG VER - KAKAOTALK (2)"),
]

FULL_W = 1080
CARD_W = 560
FULL_Q = 86
CARD_Q = 80


def pages(sources):
    """Every page found, ordered by the number in its filename rather than by
    directory: the catalogue arrives split across folders but is one document."""
    found = []
    for folder in sources:
        if not os.path.isdir(folder):
            raise SystemExit("not a directory: %s" % folder)
        for name in os.listdir(folder):
            match = re.match(r"(\d+)\.png$", name, re.I)
            if match:
                found.append((int(match.group(1)), os.path.join(folder, name)))
    if not found:
        raise SystemExit("no numbered PNG pages found in: %s" % ", ".join(sources))
    found.sort(key=lambda item: item[0])
    return found


def write(image, path, width, quality):
    scaled = image if image.width == width else image.resize(
        (width, round(image.height * width / image.width)), Image.LANCZOS)
    scaled.save(path, "WEBP", quality=quality, method=6)
    return os.path.getsize(path)


def main():
    sources = sys.argv[1:] or DEFAULT_SOURCES
    os.makedirs(OUT, exist_ok=True)
    found = pages(sources)
    print("Found %d pages (source numbering %d-%d)."
          % (len(found), found[0][0], found[-1][0]))

    total = 0
    for index, (number, path) in enumerate(found, start=1):
        image = Image.open(path).convert("RGB")
        full = write(image, os.path.join(OUT, "kokolock-%02d.webp" % index), FULL_W, FULL_Q)
        card = write(image, os.path.join(OUT, "kokolock-%02d-sm.webp" % index), CARD_W, CARD_Q)
        total += full + card
        print("  page %2d (was %2s.png)  %6.0f KB + %5.0f KB"
              % (index, number, full / 1024.0, card / 1024.0))

    print("%d pages, %.1f MB written to %s" % (len(found), total / 1048576.0, OUT))
    print("app.js lists these in portfolioSets.catalogue; keep the count in step.")


if __name__ == "__main__":
    main()
