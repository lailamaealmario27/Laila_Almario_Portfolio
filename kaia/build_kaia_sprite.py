"""
Pack Kaia's animation frames into one sprite sheet, and convert the turnaround views.

Run:
    python kaia/build_kaia_sprite.py

The desktop assistant ships her frames as 46 separate PNGs, which is 46 requests and
1.3 MB on a page that already carries a WebGL showroom. They go onto a single sheet
instead, one clip per row, so the web animator only ever loads one image and advances
a column.

Writes:
    assets/images/kaia-sprite.webp   the sheet
    assets/images/kaia-<view>.webp   the four turnaround views

The sheet's geometry is written into kaia.js as CLIPS; if a clip gains or loses frames
here, update it there too.
"""
import json
import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
FRAMES = os.path.join(HERE, "frames")
POSES = os.path.join(HERE, "poses")
OUT = os.path.join(ROOT, "assets", "images")

# Row order on the sheet. Keep in step with CLIPS in kaia.js.
CLIPS = ["idle", "nod", "tilt", "hop", "dance"]
VIEWS = ["front", "threequarter", "side", "back"]


def clip_frames(name):
    files = sorted(f for f in os.listdir(FRAMES) if f.startswith(name + "_"))
    if not files:
        raise SystemExit("no frames found for clip %r in %s" % (name, FRAMES))
    return [Image.open(os.path.join(FRAMES, f)).convert("RGBA") for f in files]


def main():
    os.makedirs(OUT, exist_ok=True)
    clips = {name: clip_frames(name) for name in CLIPS}

    sizes = {frame.size for frames in clips.values() for frame in frames}
    if len(sizes) != 1:
        raise SystemExit("frames are not a uniform size: %s" % sorted(sizes))
    width, height = sizes.pop()
    columns = max(len(frames) for frames in clips.values())

    sheet = Image.new("RGBA", (columns * width, len(CLIPS) * height), (0, 0, 0, 0))
    for row, name in enumerate(CLIPS):
        for column, frame in enumerate(clips[name]):
            sheet.paste(frame, (column * width, row * height))

    sheet_path = os.path.join(OUT, "kaia-sprite.webp")
    # Lossless: she is flat colour on transparency, where lossy WebP fringes the edges
    # and is barely smaller anyway.
    sheet.save(sheet_path, "WEBP", lossless=True, quality=100, method=6)

    for view in VIEWS:
        source = os.path.join(POSES, "kaia_%s.png" % view)
        image = Image.open(source).convert("RGBA")
        image.save(os.path.join(OUT, "kaia-%s.webp" % view),
                   "WEBP", lossless=True, quality=100, method=6)

    geometry = {
        "frame": [width, height],
        "columns": columns,
        "clips": {name: len(frames) for name, frames in clips.items()},
        "order": CLIPS,
    }
    print("sheet   %s  %dx%d  %.0f KB"
          % (os.path.basename(sheet_path), sheet.width, sheet.height,
             os.path.getsize(sheet_path) / 1024.0))
    for view in VIEWS:
        path = os.path.join(OUT, "kaia-%s.webp" % view)
        print("view    %-24s %.0f KB" % (os.path.basename(path),
                                         os.path.getsize(path) / 1024.0))
    print("geometry for kaia.js:")
    print(json.dumps(geometry, indent=2))


if __name__ == "__main__":
    main()
