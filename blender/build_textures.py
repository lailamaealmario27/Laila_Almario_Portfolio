"""
Rectify the printed artwork out of the supplied print-production photographs so the
Blender models can be surfaced with the real artwork instead of a redrawn imitation.

Every quad below was measured off the source photo. Perspective rectification uses an
inverse homography with bilinear sampling, so the output is the flat print file as it
would have been supplied to the printer.

Reconstructed surfaces (back faces that no photo shows) are composed from brand
elements lifted out of the rectified fronts and are captioned as reconstructed.
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "assets", "images")
OUT = os.path.join(HERE, "textures")
os.makedirs(OUT, exist_ok=True)

PHOTOS = {
    "tote":     "image-23-c9f86e0580.webp",
    "notebook": "image-24-178ef540cb.webp",
    "bottle":   "image-25-ba1aa1d861.webp",
    "cart":     "image-26-3c72d7409f.webp",
    "banner":   "image-27-c3fd8f5793.webp",
    "cards":    "image-28-c52ef6ff59.webp",
}
_cache = {}


def photo(key):
    if key not in _cache:
        _cache[key] = np.asarray(Image.open(os.path.join(SRC, PHOTOS[key])).convert("RGB"), dtype=np.float32)
    return _cache[key]


def homography(src_quad, dst_quad):
    """Solve the 3x3 homography taking src_quad -> dst_quad (both TL,TR,BR,BL)."""
    a, b = [], []
    for (x, y), (u, v) in zip(src_quad, dst_quad):
        a.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.append(u)
        a.append([0, 0, 0, x, y, 1, -v * x, -v * y]); b.append(v)
    h = np.linalg.solve(np.asarray(a, dtype=np.float64), np.asarray(b, dtype=np.float64))
    return np.append(h, 1.0).reshape(3, 3)


def sample(img, xs, ys):
    """Bilinear sample an HxWx3 float array at float coordinates, clamped to the edge."""
    h, w = img.shape[:2]
    xs = np.clip(xs, 0, w - 1.001)
    ys = np.clip(ys, 0, h - 1.001)
    x0 = np.floor(xs).astype(np.int32); y0 = np.floor(ys).astype(np.int32)
    x1 = x0 + 1; y1 = y0 + 1
    fx = (xs - x0)[..., None]; fy = (ys - y0)[..., None]
    top = img[y0, x0] * (1 - fx) + img[y0, x1] * fx
    bot = img[y1, x0] * (1 - fx) + img[y1, x1] * fx
    return top * (1 - fy) + bot * fy


def rectify(key, quad, out_w, out_h):
    """Flatten a photographed planar panel (quad = TL,TR,BR,BL in photo pixels)."""
    img = photo(key)
    dst = [(0, 0), (out_w - 1, 0), (out_w - 1, out_h - 1), (0, out_h - 1)]
    inv = np.linalg.inv(homography(quad, dst))
    gx, gy = np.meshgrid(np.arange(out_w, dtype=np.float64), np.arange(out_h, dtype=np.float64))
    den = inv[2, 0] * gx + inv[2, 1] * gy + inv[2, 2]
    sx = (inv[0, 0] * gx + inv[0, 1] * gy + inv[0, 2]) / den
    sy = (inv[1, 0] * gx + inv[1, 1] * gy + inv[1, 2]) / den
    return Image.fromarray(np.clip(sample(img, sx, sy), 0, 255).astype(np.uint8))


def unwrap_cylinder(key, x_left, x_right, y_top, y_bottom, out_w, out_h, bow=0.0):
    """
    Flatten a label wrapped round a cylinder. The visible front spans 180 deg, so the
    horizontal sample position follows x = cx + R*sin(theta) rather than being linear.
    `bow` is the extra pixel sag of the horizontal label edges at the centre of the
    bottle, used to straighten the curvature of the top and bottom edges.
    """
    img = photo(key)
    cx = (x_left + x_right) / 2.0
    radius = (x_right - x_left) / 2.0
    u = np.linspace(0, 1, out_w)
    theta = (u - 0.5) * np.pi                     # -90 deg .. +90 deg across the visible face
    sx = cx + radius * np.sin(theta)
    sag = bow * np.cos(theta)                     # edges ride higher than the centre
    v = np.linspace(0, 1, out_h)
    sx = np.tile(sx, (out_h, 1))
    top = y_top - sag + bow
    bottom = y_bottom + sag - bow
    sy = top[None, :] + v[:, None] * (bottom - top)[None, :]
    return Image.fromarray(np.clip(sample(img, sx, sy), 0, 255).astype(np.uint8))


# --------------------------------------------------------------------------------------
# Measured artwork quads (TL, TR, BR, BL) in source-photo pixels.
# --------------------------------------------------------------------------------------
QUADS = {
    "tote_a_front":   ("tote",     [(150, 311), (691, 314), (694, 915), (152, 903)], 1024, 1130),
    "tote_b_front":   ("tote",     [(833, 313), (1337, 316), (1340, 912), (836, 901)], 1024, 1210),
    "notebook_cover": ("notebook", [(184, 120), (898, 170), (893, 1248), (186, 1192)], 1024, 1500),
    "cart_front":     ("cart",     [(554, 557), (1013, 537), (1011, 926), (562, 1018)], 1600, 1300),
    "cart_side":      ("cart",     [(417, 538), (541, 563), (549, 994), (409, 937)], 800, 1300),
    "cart_header":    ("cart",     [(513, 26), (964, 77), (962, 192), (515, 161)], 1800, 480),
    "banner_a":       ("banner",   [(266, 56), (659, 53), (659, 1028), (266, 1030)], 880, 2048),
    "banner_b":       ("banner",   [(777, 43), (1198, 45), (1198, 1024), (777, 1022)], 880, 2048),
    "card_front":     ("cards",    [(70, 133), (928, 16), (1027, 480), (143, 618)], 1536, 870),
    "card_back":      ("cards",    [(603, 450), (1407, 593), (1320, 1055), (429, 872)], 1536, 870),
}


def build_rectified():
    made = {}
    for name, (key, quad, w, h) in QUADS.items():
        im = rectify(key, quad, w, h)
        im.save(os.path.join(OUT, name + ".png"))
        made[name] = im
        print("  rectified", name, im.size)
    # Spray-bottle label is wrapped round the bottle, so it needs a cylindrical unwrap.
    label = unwrap_cylinder("bottle", 657, 858, 470, 757, 1280, 900, bow=13.0)
    label.save(os.path.join(OUT, "bottle_label_front.png"))
    made["bottle_label_front"] = label
    print("  unwrapped bottle_label_front", label.size)
    # Pen barrel: the straight section of the barrel only, so the strip maps 1:1 onto
    # the cylinder. Rotated clockwise, which puts the barrel's top at U = 1 and the
    # pen's left edge at V = 0. Whatever the mockup prints there is carried through
    # exactly as photographed, including the two lockups running opposite ways.
    pen = rectify("notebook", [(998, 430), (1048, 430), (1048, 1045), (998, 1045)], 200, 1400)
    pen = pen.rotate(-90, expand=True)
    pen.save(os.path.join(OUT, "pen_barrel.png"))
    made["pen_barrel"] = pen
    print("  rectified pen_barrel", pen.size)
    return made


# --------------------------------------------------------------------------------------
# Clean-up of the rectified artwork, then composition of the surfaces no photo shows.
# --------------------------------------------------------------------------------------
FONT_DIR = r"C:\Windows\Fonts"
RECON_NOTE = "RECONSTRUCTED MOCKUP  \u00b7  NOT FROM THE ORIGINAL PHOTO"


def font(name, size):
    try:
        return ImageFont.truetype(os.path.join(FONT_DIR, name), size)
    except OSError:
        return ImageFont.load_default()


def paper_tone(im, box):
    """Average colour of a blank patch, used to fill areas that have to be painted out."""
    return tuple(int(v) for v in np.asarray(im.crop(box).convert("RGB"), dtype=np.float32).mean(axis=(0, 1)))


def fill_quad(im, points, colour, blur=9):
    """Paint a polygon with a soft edge so the repair does not show a hard seam."""
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).polygon(points, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(blur))
    return Image.composite(Image.new("RGB", im.size, colour), im, mask)


def note(im, text, colour=(150, 152, 156), size_ratio=0.021, pad_ratio=0.022, align="center"):
    """Stamp the reconstruction caption onto a surface that was not photographed."""
    im = im.convert("RGB")
    d = ImageDraw.Draw(im)
    f = font("arial.ttf", max(11, int(im.width * size_ratio)))
    w = d.textbbox((0, 0), text, font=f)[2]
    x = (im.width - w) / 2 if align == "center" else int(im.width * pad_ratio)
    d.text((x, im.height - int(im.height * pad_ratio) - f.size), text, font=f, fill=colour)
    return im


def tile_patch(im, box, size, blur=2):
    """
    Grow a small blank swatch of material into a full surface. The swatch is mirrored
    on each repeat so the weave carries across the joins without a visible grid.
    """
    patch = im.crop(box).filter(ImageFilter.GaussianBlur(blur))
    # Flatten the lighting gradient out of the swatch, keeping only the weave, so the
    # tiled result reads as even material rather than a repeated blotch.
    a = np.asarray(patch, dtype=np.float32)
    low = np.asarray(patch.filter(ImageFilter.GaussianBlur(28)), dtype=np.float32)
    patch = Image.fromarray(np.clip(a - low + a.mean(axis=(0, 1)), 0, 255).astype(np.uint8))
    flip_h = patch.transpose(Image.FLIP_LEFT_RIGHT)
    rows = [[patch, flip_h], [patch.transpose(Image.FLIP_TOP_BOTTOM), flip_h.transpose(Image.FLIP_TOP_BOTTOM)]]
    out = Image.new("RGB", size)
    for iy, y in enumerate(range(0, size[1], patch.height)):
        for ix, x in enumerate(range(0, size[0], patch.width)):
            out.paste(rows[iy % 2][ix % 2], (x, y))
    return out.filter(ImageFilter.GaussianBlur(1.2))


def ink(layer, white=214.0, softness=30.0):
    """
    Build an alpha channel from how dark a pixel is, so a lockup lifted off a white
    panel transfers as ink alone and leaves no paste rectangle behind.
    """
    a = np.asarray(layer.convert("RGB"), dtype=np.float32).min(axis=2)
    alpha = np.clip((white - a) / softness, 0, 1) * 255
    layer = layer.convert("RGBA")
    layer.putalpha(Image.fromarray(alpha.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)))
    return layer


def fit(layer, width):
    return layer.resize((width, max(1, round(layer.height * width / layer.width))), Image.LANCZOS)


def clean(made):
    """Repair the three rectified panels that carry an occlusion or hardware in frame."""
    # The lower business card overlaps the corner of the upper one. That corner of the
    # real card is blank stock, so it is repainted in the card's own paper tone.
    cf = made["card_front"]
    w, h = cf.size
    tone = paper_tone(cf, (900, 300, 1200, 420))
    cf = fill_quad(cf, [(w * 0.26, h * 0.958), (w + 24, h * 0.958), (w + 24, h + 24), (w * 0.26, h + 24)], tone, 12)
    cf = fill_quad(cf, [(w * 0.53, h + 24), (w * 0.53, h * 0.862), (w * 0.60, h * 0.775),
                        (w + 24, h * 0.636), (w + 24, h + 24)], tone, 16)
    cf.save(os.path.join(OUT, "card_front.png"))
    made["card_front"] = cf

    # The notebook's spiral binding sits in front of the cover. The wire is modelled in
    # 3D instead, so the strip it covered is repainted in the cover's own white.
    nb = made["notebook_cover"]
    nb = fill_quad(nb, [(0, 0), (int(nb.width * 0.098), 0), (int(nb.width * 0.098), nb.height), (0, nb.height)],
                   paper_tone(nb, (300, 150, 700, 330)), 10)
    nb.save(os.path.join(OUT, "notebook_cover.png"))
    made["notebook_cover"] = nb

    # The pen barrel is left exactly as photographed. In the supplied mockup the
    # EROP | SUNGSHIM lockup runs up the barrel while K-PICK TRADING CORP. runs down
    # it, so the two read in opposite directions; that is reproduced rather than
    # tidied up, because the model has to match the photo.
    print("  cleaned card_front, notebook_cover")
    return made


def build_reconstructed(made):
    """
    Compose the surfaces that no supplied photograph shows. Every element used here is
    lifted from the rectified fronts, so the branding stays correct even though the
    layout is an informed mockup rather than the real reverse artwork.
    """
    out = {}
    tote = made["tote_a_front"]
    lockup = tote.crop((200, 240, 940, 680))          # K-PICK / EROP / SUNGSHIM lockup
    swoosh = tote.crop((0, 890, 1024, 1130))          # the green / blue / red ribbon

    def tote_back(src, name):
        fabric = tile_patch(src, (60, 150, 260, 350), src.size, 3)
        mark = ink(fit(lockup, int(src.width * 0.62)))
        fabric.paste(mark, ((src.width - mark.width) // 2, int(src.height * 0.30)), mark)
        band = fit(swoosh.transpose(Image.FLIP_LEFT_RIGHT), src.width)
        fabric.paste(band, (0, src.height - band.height))
        out[name] = note(fabric, RECON_NOTE)

    tote_back(made["tote_a_front"], "tote_a_back")
    tote_back(made["tote_b_front"], "tote_b_back")

    # Notebook back cover: blank board with the ribbon turned over and a small lockup.
    nb = made["notebook_cover"]
    back = tile_patch(nb, (300, 150, 700, 400), nb.size, 3)
    band = fit(nb.crop((0, 905, 1024, 1500)).transpose(Image.FLIP_LEFT_RIGHT), nb.width)
    back.paste(band, (0, nb.height - band.height))
    mark = ink(fit(nb.crop((140, 470, 930, 600)), int(nb.width * 0.46)))
    back.paste(mark, ((nb.width - mark.width) // 2, int(nb.height * 0.10)), mark)
    out["notebook_back"] = note(back, RECON_NOTE)

    # Rear half of the wrap-around bottle label.
    lab = made["bottle_label_front"]
    rear = tile_patch(lab, (40, 330, 240, 430), lab.size, 3)
    mark = ink(fit(lab.crop((120, 450, 1180, 600)), int(lab.width * 0.52)))
    rear.paste(mark, ((lab.width - mark.width) // 2, int(lab.height * 0.36)), mark)
    band = fit(lab.crop((0, 620, 1280, 900)).transpose(Image.FLIP_LEFT_RIGHT), lab.width)
    rear.paste(band, (0, lab.height - band.height))
    out["bottle_label_back"] = note(rear, RECON_NOTE, size_ratio=0.028)

    # Cart: the operator side of these counters is normally blank white board; the right
    # cheek repeats the left, and the header is printed on both faces.
    cf = made["cart_front"]
    board = Image.new("RGB", cf.size, (238, 238, 236))
    bd = ImageDraw.Draw(board)
    bf = font("arial.ttf", 44)
    for label, y in (("OPERATOR SIDE", 0.45), ("Left blank white board, as supplied.", 0.50)):
        tw = bd.textbbox((0, 0), label, font=bf)[2]
        bd.text(((board.width - tw) / 2, board.height * y), label, font=bf, fill=(176, 178, 180))
    out["cart_back"] = note(board, RECON_NOTE, size_ratio=0.024)
    out["cart_side_right"] = note(made["cart_side"].copy(), RECON_NOTE)
    out["cart_header_back"] = note(made["cart_header"].copy(), RECON_NOTE, colour=(240, 205, 205), size_ratio=0.028)

    # Roll-up banner stock is printed on one face only; the reverse is the blank liner.
    for name in ("banner_a", "banner_b"):
        liner = Image.new("RGB", made[name].size, (231, 229, 224))
        d = ImageDraw.Draw(liner)
        big = font("arialbd.ttf", 44)
        small = font("arial.ttf", 28)
        for label, y, f in (("UNPRINTED REVERSE", 0.455, big),
                            ("Roll-up banner stock carries print on one face only.", 0.495, small)):
            tw = d.textbbox((0, 0), label, font=f)[2]
            d.text(((liner.width - tw) / 2, liner.height * y), label, font=f, fill=(158, 156, 150))
        out[name + "_back"] = note(liner, RECON_NOTE, colour=(170, 168, 162))

    for name, im in out.items():
        im.save(os.path.join(OUT, name + ".png"))
        print("  reconstructed", name, im.size)
    return out


if __name__ == "__main__":
    print("Rectifying printed artwork from the source photographs:")
    made = clean(build_rectified())
    print("Composing the surfaces no photograph shows:")
    build_reconstructed(made)
    print("Textures written to", OUT)
