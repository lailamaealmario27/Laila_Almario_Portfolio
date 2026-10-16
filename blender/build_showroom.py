"""
Build the showroom furniture: the round display table the K-PICK products stand on.

Run headless:
    blender -b --python blender/build_showroom.py

The products built by build_models.py are modelled at their real size in metres and
sit on Z = 0. The table here is modelled the same way, so showroom.js can stand a
product on it by lifting it by TABLE_HEIGHT and nothing has to be rescaled.

The whole table is one surface of revolution: a round top, a slim waisted column and a
disc foot. The profile carries a short chamfer at every corner rather than a hard
right angle, because lib_build revolves a profile with smooth shading -- the chamfers
are what keep the rim reading as a crisp edge instead of a smeared highlight.

Sinocare has no table. Its products stand on the studio floor, so nothing here is
built for it.

This is furniture, not artwork: it carries no branding and no photographed surfaces,
only the stock colour below.
"""
import os
import sys

import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

import lib_build as L  # noqa: E402

OUT_DIR = os.path.join(ROOT, "assets", "models")
BLEND = os.path.join(HERE, "showroom.blend")

# Surface height and radius of the table top. showroom.js reads the same two numbers
# from its own constants; if you change them here, change them there.
TABLE_HEIGHT = 0.75
TOP_RADIUS = 0.55

# Matte ivory, a shade warmer than the studio floor so the table separates from it
# without becoming a bright object in its own right.
IVORY = (0.878, 0.853, 0.806)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.length_unit = "CENTIMETERS"


def build_round_table():
    coll = L.collection("Showroom_Round_Table")
    mat = L.solid("table_ivory", IVORY, roughness=0.78, specular=0.25)

    r = TOP_RADIUS
    profile = [
        # Disc foot.
        (0.000, 0.000),
        (0.268, 0.000),
        (0.285, 0.009),
        (0.285, 0.019),
        (0.270, 0.027),
        # Waisted column.
        (0.086, 0.032),
        (0.069, 0.054),
        (0.057, 0.300),
        (0.055, 0.598),
        (0.068, 0.652),
        # Trumpeted underside of the top.
        (0.320, 0.686),
        (r - 0.040, 0.696),
        (r - 0.009, 0.702),
        # Rim.
        (r, 0.712),
        (r, TABLE_HEIGHT - 0.012),
        (r - 0.008, TABLE_HEIGHT - 0.003),
        (r - 0.022, TABLE_HEIGHT),
        # Top face.
        (0.000, TABLE_HEIGHT),
    ]
    L.lathe("Round_Table", mat, coll, profile, steps=96)
    return coll


def export(coll, filename):
    bpy.ops.object.select_all(action="DESELECT")
    for ob in coll.objects:
        ob.select_set(True)
    bpy.context.view_layer.objects.active = coll.objects[0]
    path = os.path.join(OUT_DIR, filename)
    bpy.ops.export_scene.gltf(filepath=path, export_format="GLB", use_selection=True,
                              export_apply=True, export_yup=True, export_cameras=False,
                              export_lights=False, export_extras=False)
    size = os.path.getsize(path) / 1024.0
    print("  exported %-30s %7.0f KB  (%d objects)" % (filename, size, len(coll.objects)))


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    reset()
    print("Building showroom furniture:")
    jobs = [(build_round_table(), "showroom-table-round.glb")]
    for coll, _ in jobs:
        print("  built %-24s %2d objects" % (coll.name, len(coll.objects)))
    bpy.ops.wm.save_as_mainfile(filepath=BLEND)
    print("Saved Blender project:", BLEND)
    print("Exporting glTF binaries:")
    for coll, filename in jobs:
        export(coll, filename)
    print("Table top: %.3f m across at %.3f m high; showroom.js must use the same."
          % (TOP_RADIUS * 2.0, TABLE_HEIGHT))


if __name__ == "__main__":
    main()
