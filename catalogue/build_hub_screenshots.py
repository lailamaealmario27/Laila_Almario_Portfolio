# -*- coding: utf-8 -*-
"""Turn the supplied Hub screenshots into portfolio images.

Every redaction below exists because of a rule she set herself:

  * her brief for this update - "Hide customer information, private reports,
    financial details, account identifiers, credentials, and tokens"
  * PORTFOLIO_CONTENT_REVIEW.md section 3 - colleague names stay off the public site
  * the standing note that attendance and time-tracker data never ship

A redaction is pixelate-then-blur, not a blur alone. A blur of small text can be
partially recovered; reducing the region to 10px blocks first throws the information
away before the blur is applied, so what ships cannot be read back.
"""
import os
from PIL import Image, ImageFilter

# Raw, unredacted captures. Keep them OUT of this repo -- `catalogue/` is in
# .vercelignore so it is never deployed, but it IS in git, and a raw capture of
# the lead register must not be committed anywhere. Point this at a local folder.
SRC = os.environ.get("HUB_SHOTS_SRC",
                     os.path.join(os.path.expanduser("~"), "Pictures", "hub-screenshots"))
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "assets", "images")
WIDTH = 1600          # 2x the widest the spotlight is ever displayed at
QUALITY = 80


def redact(im, boxes):
    """Destroy the pixels in each box, then soften the edge so it reads as deliberate."""
    for box in boxes:
        x0, y0, x1, y1 = box
        region = im.crop(box)
        w, h = region.size
        if w < 2 or h < 2:
            continue
        # throw the detail away: down to ~10px blocks and back up
        region = region.resize((max(1, w // 10), max(1, h // 10)), Image.BILINEAR)
        region = region.resize((w, h), Image.NEAREST)
        region = region.filter(ImageFilter.GaussianBlur(7))
        im.paste(region, box)
    return im


# name, source, redaction boxes, why
JOBS = [
    ("hub-01-overview.webp", "2.png", [
        (1573, 293, 1838, 330),   # top-creator handle + peso figure: account id + money
        (858, 692, 1812, 735),    # priority-task body: internal competitor research
    ]),
    ("hub-02-products.webp", "3.png", [
        (461, 341, 600, 369),     # a filter chip carrying a team member's name
    ]),
    ("hub-03-ecommerce.webp", "4.png", []),
    ("hub-04-seo.webp", "5.png", [
        (1246, 493, 1356, 524),   # SALES figure: company revenue
    ]),
    ("hub-05-calendar.webp", "6.png", []),
    ("hub-06-studio.webp", "7.png", []),
    ("hub-07-analytics.webp", "8.png", []),
    ("hub-08-script.webp", "9.png", [
        (258, 250, 524, 274),     # "Suggested next call: <name> (<company>)": a real lead
    ]),
    ("hub-09-leads.webp", "10.png", [
        (1655, 180, 1840, 235),   # owners tile: three colleague names
        (262, 325, 1845, 485),    # direct-leads card: customer names, emails, phone, enquiries
        (352, 560, 1200, 950),    # follow-up list: named clinicians and their companies
                                  # (starts after the tier badge, which carries no name)
        (1774, 560, 1808, 950),   # the owner chip on every follow-up row: a colleague name
    ]),
]

os.makedirs(OUT, exist_ok=True)
for name, src, boxes in JOBS:
    im = Image.open(os.path.join(SRC, src))
    if im.mode == "RGBA":                      # flatten onto white, not onto black
        flat = Image.new("RGB", im.size, (255, 255, 255))
        flat.paste(im, mask=im.split()[3])
        im = flat
    else:
        im = im.convert("RGB")

    im = redact(im, boxes)

    w, h = im.size
    im = im.resize((WIDTH, round(h * WIDTH / w)), Image.LANCZOS)
    path = os.path.join(OUT, name)
    im.save(path, "WEBP", quality=QUALITY, method=6)
    print("%-26s %4dx%-4d  %6.1f KB  %d redaction(s)"
          % (name, im.size[0], im.size[1], os.path.getsize(path) / 1024, len(boxes)))
