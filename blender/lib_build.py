"""
Small modelling toolkit used by build_models.py.

Everything is built from parametric surfaces so the geometry is predictable when
Blender runs headless: a surface is a subdivided quad whose vertex positions come
from a function of (u, v), which covers planes, tubes, lathes and swept ribbons.
Units are metres and every product is modelled at its real size.
"""
import math
import os
import bpy

TEX_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "textures")
_images = {}


# ---------------------------------------------------------------------------- materials
def image(name):
    if name not in _images:
        img = bpy.data.images.load(os.path.join(TEX_DIR, name + ".png"), check_existing=True)
        img.colorspace_settings.name = "sRGB"
        _images[name] = img
    return _images[name]


def _principled(name):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    return mat, mat.node_tree.nodes["Principled BSDF"]


def textured(name, texture, roughness=0.62, metallic=0.0, specular=0.3):
    """A printed surface: the rectified artwork drives base colour."""
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat, bsdf = _principled(name)
    tex = mat.node_tree.nodes.new("ShaderNodeTexImage")
    tex.image = image(texture)
    tex.location = (-420, 240)
    mat.node_tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = specular
    return mat


def solid(name, colour, roughness=0.55, metallic=0.0, alpha=1.0, specular=None):
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat, bsdf = _principled(name)
    bsdf.inputs["Base Color"].default_value = (colour[0], colour[1], colour[2], 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Alpha"].default_value = alpha
    if specular is not None and "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = specular
    if alpha < 1.0:
        _make_transparent(mat)
    return mat


def _make_transparent(mat):
    """Blender renamed the blended-surface switch between releases; set whichever exists."""
    if hasattr(mat, "surface_render_method"):
        try:
            mat.surface_render_method = "BLENDED"
        except TypeError:
            pass
    if hasattr(mat, "blend_method"):
        try:
            mat.blend_method = "BLEND"
        except TypeError:
            pass


def glassy(name, colour, roughness=0.07, transmission=0.9, ior=1.5):
    """
    Clear PET. Transmission is used rather than plain alpha so the bottle reads as a
    solid moulded wall; a viewer that ignores KHR_materials_transmission simply shows
    it as pale opaque plastic rather than making the bottle disappear.
    """
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat, bsdf = _principled(name)
    bsdf.inputs["Base Color"].default_value = (colour[0], colour[1], colour[2], 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    if "IOR" in bsdf.inputs:
        bsdf.inputs["IOR"].default_value = ior
    for key in ("Transmission Weight", "Transmission"):
        if key in bsdf.inputs:
            bsdf.inputs[key].default_value = transmission
            break
    _make_transparent(mat)
    return mat


# ---------------------------------------------------------------------------- geometry
def _add(name, verts, faces, uvs, mat, coll, smooth):
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    layer = me.uv_layers.new(name="UVMap")
    i = 0
    for face_uv in uvs:
        for pair in face_uv:
            layer.data[i].uv = pair
            i += 1
    if smooth:
        for poly in me.polygons:
            poly.use_smooth = True
    me.materials.append(mat)
    ob = bpy.data.objects.new(name, me)
    coll.objects.link(ob)
    return ob


def surface(name, mat, coll, nu, nv, point, uv=None, flip=False, smooth=True,
            wrap_u=False, wrap_v=False):
    """
    Build a subdivided quad from point(u, v) -> (x, y, z).
    wrap_u / wrap_v weld the seam so a tube or lathe closes without a crack, while
    the UVs still follow the real parameter so the artwork does not fold back.
    """
    cu = nu if wrap_u else nu + 1
    cv = nv if wrap_v else nv + 1
    verts = []
    for j in range(cv):
        for i in range(cu):
            verts.append(point(i / nu, j / nv))
    faces, fuv = [], []
    for j in range(nv):
        for i in range(nu):
            i2 = (i + 1) % cu
            j2 = (j + 1) % cv
            a = j * cu + i
            b = j * cu + i2
            c = j2 * cu + i2
            d = j2 * cu + i
            corners = [(i / nu, j / nv), ((i + 1) / nu, j / nv),
                       ((i + 1) / nu, (j + 1) / nv), (i / nu, (j + 1) / nv)]
            if uv:
                corners = [uv(p[0], p[1]) for p in corners]
            if flip:
                faces.append((a, d, c, b))
                fuv.append([corners[0], corners[3], corners[2], corners[1]])
            else:
                faces.append((a, b, c, d))
                fuv.append(corners)
    return _add(name, verts, faces, fuv, mat, coll, smooth)


def panel(name, mat, coll, width, height, place, nu=1, nv=1, bulge=None,
          uv=None, flip=False, smooth=False):
    """A flat or gently bulged printed panel. place(x, y, z) -> world position."""
    def point(u, v):
        x = (u - 0.5) * width
        y = (v - 0.5) * height
        z = bulge(u, v) if bulge else 0.0
        return place(x, y, z)
    return surface(name, mat, coll, nu, nv, point, uv=uv, flip=flip, smooth=smooth)


SQUARE = [(0.0, 0.0), (1.0, 0.0), (1.0, 1.0), (0.0, 1.0)]


def box(name, mat, coll, size, centre=(0, 0, 0), bevel=0.0, segments=3, smooth=False):
    w, d, h = size
    cx, cy, cz = centre
    x0, x1 = cx - w / 2.0, cx + w / 2.0
    y0, y1 = cy - d / 2.0, cy + d / 2.0
    z0, z1 = cz - h / 2.0, cz + h / 2.0
    verts = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
             (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    faces = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4),
             (2, 3, 7, 6), (1, 2, 6, 5), (3, 0, 4, 7)]
    ob = _add(name, verts, faces, [SQUARE] * 6, mat, coll, smooth)
    if bevel:
        mod = ob.modifiers.new("Bevel", "BEVEL")
        mod.width = bevel
        mod.segments = segments
        mod.limit_method = "ANGLE"
        mod.angle_limit = math.radians(40)
        for poly in ob.data.polygons:
            poly.use_smooth = True
    return ob


def lathe(name, mat, coll, profile, steps=56, centre=(0, 0, 0), arc=math.tau,
          start=0.0, uv=None, flip=False):
    """Revolve a list of (radius, height) points about the Z axis."""
    cx, cy, cz = centre
    closed = abs(arc - math.tau) < 1e-6

    def point(u, v):
        ang = start + u * arc
        idx = v * (len(profile) - 1)
        i = min(int(idx), len(profile) - 2)
        t = idx - i
        r = profile[i][0] * (1 - t) + profile[i + 1][0] * t
        z = profile[i][1] * (1 - t) + profile[i + 1][1] * t
        return (cx + r * math.cos(ang), cy + r * math.sin(ang), cz + z)
    return surface(name, mat, coll, steps, max(1, len(profile) - 1), point,
                   uv=uv, flip=flip, wrap_u=closed)


def tube(name, mat, coll, radius, length, centre=(0, 0, 0), axis="Z", steps=24, caps=True):
    cx, cy, cz = centre

    def place(a, b, t):
        if axis == "Z":
            return (cx + a, cy + b, cz + t)
        if axis == "X":
            return (cx + t, cy + a, cz + b)
        return (cx + a, cy + t, cz + b)

    def point(u, v):
        ang = u * math.tau
        return place(radius * math.cos(ang), radius * math.sin(ang), (v - 0.5) * length)
    ob = surface(name, mat, coll, steps, 1, point, wrap_u=True)
    if caps:
        for sign, tag in ((-1.0, "a"), (1.0, "b")):
            def cap(u, v, sign=sign):
                ang = u * math.tau
                return place(radius * v * math.cos(ang), radius * v * math.sin(ang),
                             sign * length / 2.0)
            surface(name + "_cap_" + tag, mat, coll, steps, 1, cap,
                    wrap_u=True, flip=sign < 0, smooth=False)
    return ob


def ribbon(name, mat, coll, path, width, thickness, steps=44, up=(0.0, 0.0, 1.0)):
    """Sweep a flat strap along path(t) -> (x, y, z). Used for the tote handles."""
    def frame(t):
        eps = 1e-3
        p0 = path(max(0.0, t - eps))
        p1 = path(min(1.0, t + eps))
        tan = [p1[k] - p0[k] for k in range(3)]
        n = math.sqrt(sum(c * c for c in tan)) or 1.0
        tan = [c / n for c in tan]
        side = [tan[1] * up[2] - tan[2] * up[1],
                tan[2] * up[0] - tan[0] * up[2],
                tan[0] * up[1] - tan[1] * up[0]]
        n = math.sqrt(sum(c * c for c in side)) or 1.0
        side = [c / n for c in side]
        nor = [side[1] * tan[2] - side[2] * tan[1],
               side[2] * tan[0] - side[0] * tan[2],
               side[0] * tan[1] - side[1] * tan[0]]
        return path(t), side, nor

    # Rectangular cross section walked as eight points so the strap reads as webbing.
    section = [(-0.5, -0.5), (0.0, -0.5), (0.5, -0.5), (0.5, 0.0),
               (0.5, 0.5), (0.0, 0.5), (-0.5, 0.5), (-0.5, 0.0)]

    def point(u, v):
        p, side, nor = frame(v)
        idx = u * len(section)
        i = int(idx) % len(section)
        j = (i + 1) % len(section)
        t = idx - int(idx)
        a = (section[i][0] * (1 - t) + section[j][0] * t) * width
        b = (section[i][1] * (1 - t) + section[j][1] * t) * thickness
        return tuple(p[k] + side[k] * a + nor[k] * b for k in range(3))
    return surface(name, mat, coll, len(section), steps, point, wrap_u=True)


# -------------------------------------------------------------- rounded rectangle solid
def rounded_outline(t, half_w, half_h, radius):
    """
    Walk the perimeter of a rounded rectangle, t in [0, 1). Returns (x, y). The walk is
    parameterised by segment count rather than arc length, which keeps the corner
    tessellation dense enough for a card edge without needing a bevel modifier.
    """
    sw = max(half_w - radius, 0.0)
    sh = max(half_h - radius, 0.0)
    corners = [(sw, sh, 0.0), (-sw, sh, math.pi / 2),
               (-sw, -sh, math.pi), (sw, -sh, 3 * math.pi / 2)]
    straight = [2 * sh, 2 * sw, 2 * sh, 2 * sw]
    arc_len = radius * math.pi / 2
    lengths = []
    for k in range(4):
        lengths.append(arc_len)
        lengths.append(straight[k])
    total = sum(lengths)
    d = (t % 1.0) * total
    for k in range(4):
        cx, cy, a0 = corners[k]
        if d <= lengths[2 * k]:
            ang = a0 + (d / arc_len) * (math.pi / 2) if arc_len else a0
            return (cx + radius * math.cos(ang), cy + radius * math.sin(ang))
        d -= lengths[2 * k]
        run = lengths[2 * k + 1]
        if d <= run:
            nx, ny, _ = corners[(k + 1) % 4]
            f = (d / run) if run else 0.0
            sx = cx + radius * math.cos(a0 + math.pi / 2)
            sy = cy + radius * math.sin(a0 + math.pi / 2)
            ex = nx + radius * math.cos(a0 + math.pi / 2)
            ey = ny + radius * math.sin(a0 + math.pi / 2)
            return (sx + (ex - sx) * f, sy + (ey - sy) * f)
        d -= run
    return (sw + radius, sh)


def printed_slab(name, coll, width, height, depth, radius, place, mats, nu=72,
                 mirror=(False, True)):
    """
    A board printed on both faces with a rounded edge band: business card, notebook
    cover, banner panel, cart panel. mats = (front, back, edge) where "front" is the
    face on the +local-z side. `mirror` flips the U of each face so artwork reads the
    right way round for whichever side the camera ends up on.
    """
    front_mat, back_mat, edge_mat = mats
    hw, hh, hd = width / 2.0, height / 2.0, depth / 2.0

    def pt(u, v, z):
        x, y = rounded_outline(u, hw, hh, radius)
        return place(x * v, y * v, z)

    def face_uv(u, v, flip_u):
        x, y = rounded_outline(u, hw, hh, radius)
        a = x * v / width + 0.5
        b = y * v / height + 0.5
        if flip_u:
            a = 1.0 - a
        return (a, b)

    front = surface(name + "_front", front_mat, coll, nu, 1,
                    lambda u, v: pt(u, v, hd),
                    uv=lambda u, v: face_uv(u, v, mirror[0]),
                    wrap_u=True, smooth=False)
    back = surface(name + "_back", back_mat, coll, nu, 1,
                   lambda u, v: pt(u, v, -hd),
                   uv=lambda u, v: face_uv(u, v, mirror[1]),
                   wrap_u=True, flip=True, smooth=False)
    edge = surface(name + "_edge", edge_mat, coll, nu, 1,
                   lambda u, v: pt(u, 1.0, hd - v * depth), wrap_u=True, flip=True)
    return [front, back, edge]


def collection(name):
    col = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(col)
    return col


def move(objs, offset=(0, 0, 0), rotation=(0, 0, 0)):
    for ob in objs:
        ob.location = (ob.location[0] + offset[0], ob.location[1] + offset[1],
                       ob.location[2] + offset[2])
        ob.rotation_euler = rotation
    return objs
