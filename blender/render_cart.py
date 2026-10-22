"""
Render the booth cart with whatever the showroom stands on its counter, so the
arrangement can be checked without opening a browser.

    blender -b blender/kpick_sinocare_print_products.blend --python blender/render_cart.py

The placements below mirror `placeOn()` and `stand()` in showroom.js: coordinates are
given in the cart's own frame and rotated into the room's. If the two ever disagree,
this render is the one that is wrong -- the site is the thing that ships.

Writes blender/preview/cart-counter.png.
"""
import math
import os

import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "preview")

CART_TOP = 0.840          # Cart_Top surface, see build_models.build_cart
CART_SPIN = -13.0         # the cart's own turn, from showroom.js

# collection name -> (x, z, spin) in the cart's frame, matching showroom.js
ON_COUNTER = {
    "BusinessCards": (-0.17, 0.11, 6.0),
    "Flyers": (0.16, 0.03, -9.0),
}


def objects(name):
    coll = bpy.data.collections.get(name)
    return list(coll.objects) if coll else []


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


def place(name, local_x, local_z, local_spin):
    """
    Blender is Z-up and the exporter turns it Y-up, so the site's z is Blender's -y.
    The rotation is the cart's plus the piece's own, about the vertical axis.
    """
    objs = objects(name)
    if not objs:
        print("  (no collection %r)" % name)
        return
    spin = math.radians(CART_SPIN + local_spin)
    cart_a = math.radians(CART_SPIN)
    cos, sin = math.cos(cart_a), math.sin(cart_a)
    world_x = local_x * cos + local_z * sin
    world_z = -local_x * sin + local_z * cos

    empty = bpy.data.objects.new("pivot_" + name, None)
    bpy.context.scene.collection.objects.link(empty)
    for ob in objs:
        if ob.parent is None:
            ob.parent = empty
    empty.rotation_euler = (0.0, 0.0, spin)
    bpy.context.view_layer.update()

    lo, hi = bounds(objs)
    centre = (lo + hi) / 2.0
    empty.location = (world_x - centre.x, -world_z - centre.y, CART_TOP - lo.z)
    bpy.context.view_layer.update()
    print("  %-14s sits at z=%.3f" % (name, bounds(objs)[0].z))


def main():
    os.makedirs(OUT, exist_ok=True)
    print("Standing the counter pieces:")
    for name, (x, z, spin) in ON_COUNTER.items():
        place(name, x, z, spin)

    # Everything that is not the cart or its counter pieces is out of shot.
    keep = {"BoothCart"} | set(ON_COUNTER)
    for coll in bpy.data.collections:
        if coll.name not in keep:
            for ob in coll.objects:
                ob.hide_render = True

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 900
    scene.render.resolution_y = 760
    scene.view_settings.view_transform = "Standard"
    world = bpy.data.worlds.new("CartPreview")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs[0].default_value = (0.90, 0.89, 0.86, 1.0)
    world.node_tree.nodes["Background"].inputs[1].default_value = 1.0
    scene.world = world

    key = bpy.data.objects.new("Key", bpy.data.lights.new("KeyData", "AREA"))
    key.data.energy = 220
    key.data.size = 2.4
    key.location = (1.4, -1.6, 2.6)
    key.rotation_euler = (math.radians(42), 0.0, math.radians(38))
    scene.collection.objects.link(key)

    # Looking down at the counter from the front, close enough to read what is on it.
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("CamData"))
    cam.data.lens = 50
    scene.collection.objects.link(cam)
    scene.camera = cam
    target = Vector((0.0, 0.0, 0.78))
    cam.location = target + Vector((0.55, -2.15, 0.95))
    direction = target - cam.location
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

    scene.render.filepath = os.path.join(OUT, "cart-counter.png")
    bpy.ops.render.render(write_still=True)
    print("Wrote", scene.render.filepath)


if __name__ == "__main__":
    main()
