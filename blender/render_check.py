"""
Render a four-angle turnaround of every product collection so the geometry and the
artwork placement can be checked without opening Blender.

    blender -b blender/kpick_sinocare_print_products.blend --python blender/render_check.py
"""
import math
import os
import sys

import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "preview")
ANGLES = [("front", 0.0), ("right", 90.0), ("back", 180.0), ("left", 270.0)]
RES = int(os.environ.get("PREVIEW_RES", "440"))
ONLY = os.environ.get("PREVIEW_ONLY", "")


def bounds(objs):
    lo = Vector((1e9, 1e9, 1e9))
    hi = Vector((-1e9, -1e9, -1e9))
    deps = bpy.context.evaluated_depsgraph_get()
    for ob in objs:
        ev = ob.evaluated_get(deps)
        for corner in ev.bound_box:
            p = ev.matrix_world @ Vector(corner)
            lo = Vector((min(lo[i], p[i]) for i in range(3)))
            hi = Vector((max(hi[i], p[i]) for i in range(3)))
    return lo, hi


def setup_world():
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = RES
    scene.render.resolution_y = RES
    scene.render.film_transparent = False
    scene.view_settings.view_transform = "Standard"
    world = bpy.data.worlds.new("Preview")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs[0].default_value = (0.84, 0.845, 0.85, 1.0)
    world.node_tree.nodes["Background"].inputs[1].default_value = 0.85
    scene.world = world
    for name, loc, energy in (("Key", (2.4, -3.0, 3.6), 2.1),
                              ("Fill", (-3.0, -2.0, 1.6), 0.9)):
        light = bpy.data.lights.new(name, "SUN")
        light.energy = energy
        light.angle = math.radians(18)
        ob = bpy.data.objects.new(name, light)
        ob.location = loc
        ob.rotation_euler = (math.radians(52), 0.0, math.radians(-38 if name == "Key" else 150))
        scene.collection.objects.link(ob)
    cam_data = bpy.data.cameras.new("Cam")
    cam_data.lens = 58
    cam = bpy.data.objects.new("Cam", cam_data)
    scene.collection.objects.link(cam)
    scene.camera = cam
    return cam


def render(coll, cam):
    for other in bpy.data.collections:
        if other.name in (c.name for c in bpy.context.scene.collection.children):
            hide = other.name != coll.name
            for ob in other.objects:
                ob.hide_render = hide
    lo, hi = bounds(list(coll.objects))
    centre = (lo + hi) / 2.0
    radius = max((hi - lo).length / 2.0, 0.05)
    dist = radius * 2.75
    for tag, deg in ANGLES:
        a = math.radians(deg)
        cam.location = centre + Vector((math.sin(a) * dist, -math.cos(a) * dist, dist * 0.42))
        direction = centre - cam.location
        cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
        bpy.context.scene.render.filepath = os.path.join(OUT, "%s_%s.png" % (coll.name, tag))
        bpy.ops.render.render(write_still=True)
    print("  rendered", coll.name)


def main():
    os.makedirs(OUT, exist_ok=True)
    cam = setup_world()
    for coll in bpy.context.scene.collection.children:
        if ONLY and ONLY not in coll.name:
            continue
        render(coll, cam)
    print("Previews written to", OUT)


if __name__ == "__main__":
    main()
