"""
Bring short-form videos into the site.

Run:
    python catalogue/build_videos.py <source.mp4> [...]

Each file is remuxed, not re-encoded. The streams are already H.264 at a sensible
bitrate, and a second lossy pass would cost quality to save very little. What the remux
does buy is `faststart`: it moves the index to the front of the file so playback can
begin before the whole thing has downloaded. Without it a 7 MB clip is a 7 MB wait.

A poster frame is pulled from roughly a fifth of the way in -- far enough past the
opening to be a real shot, early enough to still be the subject. The markup uses
preload="metadata", so the poster is all a visitor downloads until they press play.

Writes:
    assets/videos/video-NN.mp4
    assets/images/video-NN-poster.webp
"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
VIDEOS = os.path.join(ROOT, "assets", "videos")
IMAGES = os.path.join(ROOT, "assets", "images")

POSTER_AT = 0.2      # fraction of the way through
POSTER_W = 540
POSTER_Q = "82"


def run(args):
    done = subprocess.run(args, capture_output=True, text=True)
    if done.returncode != 0:
        raise SystemExit("ffmpeg failed:\n" + done.stderr[-800:])
    return done


def duration(path):
    out = run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
               "-of", "csv=p=0", path]).stdout.strip()
    return float(out)


def next_index():
    """Carry on from whatever is already in assets/videos rather than renumbering it."""
    taken = [int(n[6:8]) for n in os.listdir(VIDEOS)
             if n.startswith("video-") and n[6:8].isdigit()]
    return max(taken) + 1 if taken else 1


def main():
    sources = sys.argv[1:]
    if not sources:
        raise SystemExit(__doc__)
    os.makedirs(VIDEOS, exist_ok=True)

    index = next_index()
    print("Adding %d clip(s), starting at video-%02d." % (len(sources), index))
    for source in sources:
        if not os.path.isfile(source):
            raise SystemExit("not a file: %s" % source)
        name = "video-%02d" % index
        out_video = os.path.join(VIDEOS, name + ".mp4")
        out_poster = os.path.join(IMAGES, name + "-poster.webp")

        run(["ffmpeg", "-v", "error", "-i", source, "-c", "copy",
             "-movflags", "+faststart", out_video, "-y"])
        run(["ffmpeg", "-v", "error", "-ss", "%.2f" % (duration(source) * POSTER_AT),
             "-i", source, "-frames:v", "1",
             "-vf", "scale=%d:-2" % POSTER_W, "-quality", POSTER_Q,
             out_poster, "-y"])

        print("  %s  %5.1f MB video + %4.0f KB poster   (from %s)"
              % (name, os.path.getsize(out_video) / 1048576.0,
                 os.path.getsize(out_poster) / 1024.0, os.path.basename(source)))
        index += 1

    print("Add each one to the Short-form video panel in index.html.")


if __name__ == "__main__":
    main()
