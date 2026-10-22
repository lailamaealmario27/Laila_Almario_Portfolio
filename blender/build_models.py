"""
Build the six print-production products as real Blender geometry, surface them with
the artwork rectified out of the supplied photographs, save the .blend project and
export one optimised GLB per product for the website.

Run headless:
    blender -b --python blender/build_models.py

Every product is modelled at its real size in metres and sits on Z = 0 so the web
viewer can frame it from its bounding box. Back faces that no photograph shows use
the reconstructed textures built by build_textures.py.
"""
import math
import os
import sys

import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

import lib_build as L  # noqa: E402

OUT_DIR = os.path.join(ROOT, "assets", "models")
BLEND = os.path.join(HERE, "kpick_sinocare_print_products.blend")
TAU = math.tau

# Shared stock colours sampled off the photographs.
WHITE_FABRIC = (0.905, 0.900, 0.880)
PAPER = (0.935, 0.932, 0.922)
BOARD_EDGE = (0.880, 0.876, 0.862)
ALU = (0.700, 0.706, 0.712)
DARK_GREY = (0.145, 0.153, 0.160)
CART_WHITE = (0.885, 0.888, 0.890)
SINO_RED = (0.760, 0.090, 0.110)
PET = (0.880, 0.930, 0.940)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.length_unit = "CENTIMETERS"


def mirrored(u, v):
    return (1.0 - u, v)


# ====================================================================== 1 / 2. tote bags
def build_tote(tag, front_tex, back_tex):
    """
    Non-woven shopping tote, 35 x 40 x 10 cm. Front and back are separate sewn panels
    that bulge outward, joined by side gussets, a base and two webbing handles.
    """
    coll = L.collection("Tote_" + tag)
    w, h, d = 0.35, 0.40, 0.10
    hd = d / 2.0
    front = L.textured("tote_%s_front" % tag, front_tex, roughness=0.86)
    back = L.textured("tote_%s_back" % tag, back_tex, roughness=0.86)
    cloth = L.solid("tote_cloth_" + tag, WHITE_FABRIC, roughness=0.90)
    strap = L.solid("tote_strap_" + tag, (0.925, 0.922, 0.906), roughness=0.82)

    def swell(u, v, amount):
        """Nothing at the sewn borders, fullest just below the middle of the panel."""
        return amount * math.sin(math.pi * u) * math.pow(math.sin(math.pi * v), 0.75)

    L.panel("Tote_FrontPanel", front, coll, w, h,
            lambda x, y, z: (x, -hd - z, h / 2.0 + y),
            nu=30, nv=34, bulge=lambda u, v: swell(u, v, 0.022), smooth=True)
    L.panel("Tote_BackPanel", back, coll, w, h,
            lambda x, y, z: (x, hd + z, h / 2.0 + y),
            nu=30, nv=34, bulge=lambda u, v: swell(u, v, 0.022),
            uv=mirrored, flip=True, smooth=True)

    for side, sx in (("L", -1.0), ("R", 1.0)):
        L.panel("Tote_Gusset_" + side, cloth, coll, d, h,
                lambda x, y, z, sx=sx: (sx * (w / 2.0 + z * 0.35), x, h / 2.0 + y),
                nu=6, nv=34,
                bulge=lambda u, v: swell(u, v, 0.006), flip=sx < 0, smooth=True)

    L.panel("Tote_Base", cloth, coll, w, d,
            lambda x, y, z: (x, y, -z * 0.4), nu=10, nv=6,
            bulge=lambda u, v: swell(u, v, 0.010), flip=True, smooth=True)

    # A soft fold of cloth across the opening, so the bag does not read as an open box.
    L.panel("Tote_Mouth", cloth, coll, w - 0.004, d - 0.004,
            lambda x, y, z: (x, y, h - 0.055 - z * 0.5), nu=10, nv=6,
            bulge=lambda u, v: swell(u, v, 0.012), smooth=True)

    # One webbing handle per face, stitched where the photographed bag shows its
    # reinforcement patches, standing proud of the bulge at the stitch points.
    for face, fy in (("front", -hd), ("back", hd)):
        def arc(t, fy=fy):
            x = (t - 0.5) * 0.146
            lift = math.sin(math.pi * min(max(t, 0.0), 1.0)) ** 0.8
            return (x, fy * (1.0 + 0.30 * (1.0 - lift)), h - 0.058 + 0.215 * lift)
        L.ribbon("Tote_Handle_" + face, strap, coll, arc,
                 width=0.026, thickness=0.0038, steps=44)
    return coll


# ================================================================= 3. notebook plus pen
def build_notebook():
    """
    Wire-bound A5 notebook with a printed cover, a visible page block, twin-loop
    binding and the matching push-button pen from the same photograph.
    """
    coll = L.collection("Notebook")
    w, h = 0.145, 0.212
    cover_t, block_t = 0.0022, 0.0135
    cover_face = L.textured("nb_cover", "notebook_cover", roughness=0.42, specular=0.45)
    cover_in = L.solid("nb_cover_inner", PAPER, roughness=0.78)
    cover_rear = L.textured("nb_back", "notebook_back", roughness=0.42, specular=0.45)
    edge = L.solid("nb_edge", BOARD_EDGE, roughness=0.8)
    paper = L.solid("nb_paper", (0.955, 0.952, 0.940), roughness=0.9)
    wire = L.solid("nb_wire", (0.300, 0.312, 0.325), roughness=0.33, metallic=0.85)
    pen_body = L.textured("pen_barrel_mat", "pen_barrel", roughness=0.26, specular=0.6)
    pen_white = L.solid("pen_white", (0.945, 0.945, 0.940), roughness=0.3)
    steel = L.solid("pen_steel", (0.620, 0.628, 0.640), roughness=0.22, metallic=0.9)

    top = block_t / 2.0 + cover_t / 2.0

    # Front cover, page block and rear cover, stacked about Z = 0 then stood upright.
    L.printed_slab("NB_Cover", coll, w, h, cover_t, 0.007,
                   lambda x, y, z: (x, -(z + top), h / 2.0 + y),
                   (cover_face, cover_in, edge))
    # The rear cover's printed face points away from the viewer's front, so the slab's
    # +z face carries the artwork and its U runs the other way.
    L.printed_slab("NB_Rear", coll, w, h, cover_t, 0.007,
                   lambda x, y, z: (x, (z + top), h / 2.0 + y),
                   (cover_rear, cover_in, edge), mirror=(True, False))
    L.printed_slab("NB_Block", coll, w - 0.006, h - 0.006, block_t, 0.005,
                   lambda x, y, z: (x + 0.002, z, h / 2.0 + y),
                   (paper, paper, paper), nu=48)

    # Twin-loop wire binding: pairs of open rings through the punched left edge.
    ring_r, wire_r = 0.0092, 0.00085
    spine_x = -w / 2.0 + 0.004
    count = 13
    for i in range(count):
        z = 0.012 + (h - 0.024) * i / (count - 1.0)
        for k, dz in enumerate((-0.0028, 0.0028)):
            def loop(u, v, z=z, dz=dz):
                a = -0.30 * TAU + u * 0.86 * TAU
                b = v * TAU
                cx = spine_x + ring_r * math.cos(a)
                cy = ring_r * math.sin(a)
                nx, ny = math.cos(a), math.sin(a)
                return (cx + wire_r * math.cos(b) * nx,
                        cy + wire_r * math.cos(b) * ny,
                        z + dz + wire_r * math.sin(b))
            L.surface("NB_Wire_%d_%d" % (i, k), wire, coll, 22, 7, loop, wrap_v=True)

    # Pen, standing beside the notebook. Every dimension below is read off the source
    # photograph at its own scale (the notebook's 212 mm height sets 1 px = 0.186 mm),
    # so the model reproduces the photographed pen rather than a generic one.
    px, py = 0.118, 0.004
    barrel_r = 0.00465
    nib_top, taper_top = 0.0071, 0.0382       # chrome point, then the white cone
    barrel_top = 0.1526                       # end of the straight printed section
    collar_top, button_top = 0.1675, 0.1768

    # The printed strip wraps the half of the barrel that faced the camera, running
    # -X round through -Y to +X. The photograph is an orthographic view of a cylinder,
    # so V follows sin(angle) rather than the angle itself, undoing that foreshortening.
    # V runs +X -> -X because Blender's UV origin is the bottom-left of the image while
    # the strip's bottom row is the pen's right-hand edge.
    def half(u, front):
        angle = (u - 0.5) * math.pi
        side = 1.0 if front else -1.0
        return (px + side * barrel_r * math.sin(angle),
                py - side * barrel_r * math.cos(angle))

    L.surface("Pen_Barrel", pen_body, coll, 22, 1,
              lambda u, v: half(u, True) + (taper_top + v * (barrel_top - taper_top),),
              uv=lambda u, v: (v, 0.5 - 0.5 * math.sin((u - 0.5) * math.pi)))
    L.surface("Pen_BarrelBack", pen_white, coll, 22, 1,
              lambda u, v: half(u, False) + (taper_top + v * (barrel_top - taper_top),))

    L.lathe("Pen_Taper", pen_white, coll,
            [(0.00205, 0.0), (0.0027, 0.006), (0.0037, 0.016), (0.0043, 0.025),
             (barrel_r, 0.0311)],
            steps=26, centre=(px, py, nib_top))
    L.lathe("Pen_Nib", steel, coll,
            [(0.0, 0.0), (0.00035, 0.0008), (0.0008, 0.0030), (0.0016, 0.0050),
             (0.00205, 0.0071)],
            steps=22, centre=(px, py, 0.0))
    # Flared collar between the barrel and the push button, as in the photo.
    L.lathe("Pen_Collar", pen_white, coll,
            [(barrel_r, 0.0), (0.0050, 0.0022), (0.0050, 0.0072), (0.0043, 0.0122),
             (0.0030, 0.0149)],
            steps=26, centre=(px, py, barrel_top))
    L.lathe("Pen_Button", pen_white, coll,
            [(0.0028, 0.0), (0.0028, 0.0062), (0.0024, 0.0085), (0.0014, 0.0092),
             (0.0, 0.0093)],
            steps=24, centre=(px, py, collar_top))

    # Pocket clip: on the +X side, exactly where the photograph shows it. It springs
    # off the collar, bows away from the barrel and tapers back in to a rounded end.
    clip_top, clip_len = 0.1670, 0.0455

    def clip(t):
        standoff = 0.0006 + 0.0042 * math.exp(-((t - 0.22) / 0.40) ** 2)
        return (px + barrel_r + standoff, py, clip_top - clip_len * t)
    L.ribbon("Pen_Clip", pen_white, coll, clip, width=0.0052, thickness=0.0013,
             steps=26, up=(1.0, 0.0, 0.0))
    return coll


# ====================================================================== 4. spray bottle
def build_bottle():
    """
    100 ml PET spray bottle: clear lathed body, wrap-around printed label, white pump
    collar and trigger head, clear over-cap and the dip tube visible through the wall.
    """
    coll = L.collection("SprayBottle")
    clear = L.glassy("bottle_pet", PET, roughness=0.055, transmission=0.92)
    cap_white = L.solid("bottle_cap", (0.950, 0.950, 0.946), roughness=0.30)
    cap_clear = L.glassy("bottle_overcap", (0.905, 0.940, 0.950), roughness=0.045,
                         transmission=0.94)
    tube_mat = L.solid("bottle_tube", (0.930, 0.935, 0.932), roughness=0.25)
    label_front = L.textured("bottle_label_f", "bottle_label_front", roughness=0.40, specular=0.5)
    label_back = L.textured("bottle_label_b", "bottle_label_back", roughness=0.40, specular=0.5)

    body = [
        (0.0000, 0.0000), (0.0180, 0.0000), (0.0228, 0.0030), (0.0240, 0.0075),
        (0.0240, 0.1030), (0.0236, 0.1095), (0.0205, 0.1140), (0.0150, 0.1180),
        (0.0108, 0.1205), (0.0105, 0.1250), (0.0112, 0.1262), (0.0105, 0.1280),
        (0.0112, 0.1292), (0.0105, 0.1310), (0.0090, 0.1312), (0.0000, 0.1312),
    ]
    L.lathe("Bottle_Body", clear, coll, body, steps=64)

    # Label: two half cylinders so the photographed face and the reconstructed reverse
    # each get their own artwork, matching how the printed wrap sits on the bottle.
    # The photographed face wraps the half of the bottle that faces the camera (-Y),
    # so it runs from -X round through -Y to +X; the reconstructed half covers +Y.
    lab_r, lab_z0, lab_h = 0.02425, 0.0215, 0.0605
    for name, mat, start in (("Front", label_front, math.pi), ("Back", label_back, 0.0)):
        L.surface("Bottle_Label_" + name, mat, coll, 34, 1,
                  lambda u, v, s=start: (lab_r * math.cos(s + u * math.pi),
                                         lab_r * math.sin(s + u * math.pi),
                                         lab_z0 + v * lab_h))

    L.lathe("Bottle_Collar", cap_white, coll,
            [(0.0000, 0.0000), (0.0128, 0.0000), (0.0132, 0.0020), (0.0132, 0.0165),
             (0.0126, 0.0180), (0.0092, 0.0182)],
            steps=48, centre=(0.0, 0.0, 0.1258))
    L.lathe("Bottle_PumpStem", cap_white, coll,
            [(0.0092, 0.0000), (0.0092, 0.0085), (0.0100, 0.0092), (0.0100, 0.0150),
             (0.0060, 0.0158), (0.0000, 0.0158)],
            steps=40, centre=(0.0, 0.0, 0.1440))
    L.box("Bottle_Nozzle", cap_white, coll, (0.0092, 0.0150, 0.0085),
          centre=(0.0, -0.0036, 0.1548), bevel=0.0014, segments=3)
    L.lathe("Bottle_OverCap", cap_clear, coll,
            [(0.0000, 0.0000), (0.0122, 0.0000), (0.0122, 0.0330), (0.0112, 0.0348),
             (0.0000, 0.0352)],
            steps=48, centre=(0.0, 0.0, 0.1272))
    L.tube("Bottle_DipTube", tube_mat, coll, 0.0013, 0.1150,
           centre=(0.0035, 0.0, 0.0640), steps=14)
    L.lathe("Bottle_Liquid", L.solid("bottle_liquid", (0.930, 0.965, 0.975),
                                     roughness=0.05, alpha=0.18), coll,
            [(0.0000, 0.0000), (0.0228, 0.0000), (0.0228, 0.0880), (0.0000, 0.0880)],
            steps=48, centre=(0.0, 0.0, 0.0045))
    return coll


# =============================================================== 5. Sinocare booth cart
def build_cart():
    """
    Promoter counter built to the dimensions printed on the source photo: an 80 x 40 cm
    counter 80 cm high, two poles carrying a 30 cm header, 200 cm overall.
    """
    coll = L.collection("BoothCart")
    w, d, h = 0.80, 0.40, 0.80
    white = L.solid("cart_white", CART_WHITE, roughness=0.34, specular=0.5)
    alu = L.solid("cart_alu", ALU, roughness=0.26, metallic=0.85)
    front = L.textured("cart_front_mat", "cart_front", roughness=0.44, specular=0.45)
    back = L.textured("cart_back_mat", "cart_back", roughness=0.44, specular=0.45)
    side_l = L.textured("cart_side_l", "cart_side", roughness=0.44, specular=0.45)
    side_r = L.textured("cart_side_r", "cart_side_right", roughness=0.44, specular=0.45)
    head_f = L.textured("cart_head_f", "cart_header", roughness=0.40, specular=0.5)
    head_b = L.textured("cart_head_b", "cart_header_back", roughness=0.40, specular=0.5)

    L.box("Cart_Carcass", white, coll, (w - 0.028, d - 0.028, h - 0.02),
          centre=(0.0, 0.0, (h - 0.02) / 2.0))

    pw, ph = w - 0.044, h - 0.035
    sw = d - 0.044
    zc = ph / 2.0 + 0.018
    L.panel("Cart_Front", front, coll, pw, ph,
            lambda x, y, z: (x, -(d / 2.0) + 0.0005, zc + y), flip=True)
    L.panel("Cart_Back", back, coll, pw, ph,
            lambda x, y, z: (x, (d / 2.0) - 0.0005, zc + y), uv=mirrored)
    L.panel("Cart_SideL", side_l, coll, sw, ph,
            lambda x, y, z: (-(w / 2.0) + 0.0005, -x, zc + y))
    L.panel("Cart_SideR", side_r, coll, sw, ph,
            lambda x, y, z: ((w / 2.0) - 0.0005, x, zc + y), flip=True)

    # Rounded white corner posts and the counter top slab.
    for sx in (-1.0, 1.0):
        for sy in (-1.0, 1.0):
            L.lathe("Cart_Post_%d_%d" % (sx, sy), white, coll,
                    [(0.021, 0.0), (0.021, h - 0.012)], steps=18,
                    centre=(sx * (w / 2.0 - 0.021), sy * (d / 2.0 - 0.021), 0.0))
    L.box("Cart_Top", white, coll, (w + 0.055, d + 0.055, 0.048),
          centre=(0.0, 0.0, h + 0.016), bevel=0.012, segments=4)
    L.box("Cart_Plinth", white, coll, (w - 0.01, d - 0.01, 0.018),
          centre=(0.0, 0.0, 0.009), bevel=0.005, segments=2)

    pole_top = 1.70
    for sx in (-1.0, 1.0):
        L.tube("Cart_Pole_%d" % sx, alu, coll, 0.0135, pole_top - (h + 0.04),
               centre=(sx * 0.295, 0.0, (h + 0.04 + pole_top) / 2.0), steps=18)

    # The aluminium frame has to sit *behind* the printed faces, not around them.
    head_w, head_h, head_d = 0.96, 0.30, 0.034
    head_z = pole_top + head_h / 2.0 - 0.012
    L.box("Cart_HeaderFrame", alu, coll, (head_w + 0.016, head_d - 0.006, head_h + 0.014),
          centre=(0.0, 0.0, head_z), bevel=0.006, segments=3)
    L.panel("Cart_HeaderFront", head_f, coll, head_w, head_h,
            lambda x, y, z: (x, -head_d / 2.0, head_z + y), flip=True)
    L.panel("Cart_HeaderBack", head_b, coll, head_w, head_h,
            lambda x, y, z: (x, head_d / 2.0, head_z + y), uv=mirrored)
    return coll


# ================================================================== 6. roll-up banners
def build_banners():
    """
    Two 85 x 200 cm roll-up stands, as photographed: aluminium cassette with fold-out
    feet, a rear support pole, a top clamping rail and the gently bowed banner face.
    """
    coll = L.collection("RollUpBanners")
    alu = L.solid("ban_alu", (0.760, 0.766, 0.772), roughness=0.24, metallic=0.8)
    dark = L.solid("ban_dark", DARK_GREY, roughness=0.45)
    pole = L.solid("ban_pole", (0.800, 0.806, 0.812), roughness=0.3, metallic=0.6)
    bw, bh = 0.85, 2.00

    base_h, z0 = 0.082, 0.095

    for tag, ox, swing in (("A", -0.56, 0.055), ("B", 0.56, -0.055)):
        face = L.textured("ban_%s_face" % tag, "banner_" + tag.lower(),
                          roughness=0.52, specular=0.35)
        liner = L.textured("ban_%s_liner" % tag, "banner_%s_back" % tag.lower(),
                           roughness=0.70)
        ca, sa = math.cos(swing), math.sin(swing)

        def world(across, out, up, ca=ca, sa=sa, ox=ox):
            """Map stand-local (across the face, out of the face, up) into world space."""
            return (ox + across * ca - out * sa, across * sa + out * ca, up)

        def bow(u, v):
            """A hanging banner never sits dead flat; it bows away from the pole."""
            return 0.020 * math.sin(math.pi * u) * math.pow(math.sin(math.pi * v), 0.5)

        L.panel("Banner_%s_Face" % tag, face, coll, bw, bh,
                lambda x, y, z, w=world: w(x, -z, z0 + bh / 2.0 + y),
                nu=22, nv=30, bulge=bow, flip=True, smooth=True)
        L.panel("Banner_%s_Liner" % tag, liner, coll, bw, bh,
                lambda x, y, z, w=world: w(x, -z + 0.0016, z0 + bh / 2.0 + y),
                nu=22, nv=30, bulge=bow, uv=mirrored, smooth=True)

        base = world(0.0, 0.0, base_h / 2.0)
        L.box("Banner_%s_Base" % tag, alu, coll, (bw + 0.035, 0.215, base_h),
              centre=base, bevel=0.016, segments=4).rotation_euler = (0.0, 0.0, swing)
        for sx in (-1.0, 1.0):
            cap = world(sx * (bw + 0.035) / 2.0, 0.0, base_h / 2.0)
            L.box("Banner_%s_BaseCap_%d" % (tag, sx), dark, coll, (0.055, 0.225, base_h + 0.008),
                  centre=cap, bevel=0.012, segments=3).rotation_euler = (0.0, 0.0, swing)
            foot = world(sx * (bw / 2.0 - 0.03), 0.0, 0.011)
            L.box("Banner_%s_Foot_%d" % (tag, sx), dark, coll, (0.075, 0.30, 0.022),
                  centre=foot, bevel=0.006, segments=2).rotation_euler = (0.0, 0.0, swing)

        rail_z = z0 + bh + 0.008
        L.box("Banner_%s_Rail" % tag, alu, coll, (bw + 0.012, 0.030, 0.019),
              centre=world(0.0, 0.0, rail_z), bevel=0.005,
              segments=3).rotation_euler = (0.0, 0.0, swing)
        for sx in (-1.0, 1.0):
            L.box("Banner_%s_RailCap_%d" % (tag, sx), dark, coll, (0.030, 0.034, 0.023),
                  centre=world(sx * (bw / 2.0 + 0.006), 0.0, rail_z), bevel=0.005,
                  segments=2).rotation_euler = (0.0, 0.0, swing)

        # Rear support pole, standing behind the face and clamping the top rail.
        L.tube("Banner_%s_Pole" % tag, pole, coll, 0.0095, bh - 0.02,
               centre=world(0.0, 0.055, z0 + (bh - 0.02) / 2.0 - 0.02), axis="Z", steps=14)
    return coll


# ================================================================= 7. business cards
def build_cards():
    """
    Two 90 x 50 mm cards on 350 gsm stock, laid out as in the photograph. Both faces
    carry real artwork, so turning the model shows the printed front and back.
    """
    coll = L.collection("BusinessCards")
    front = L.textured("card_face_front", "card_front", roughness=0.40, specular=0.45)
    back = L.textured("card_face_back", "card_back", roughness=0.40, specular=0.45)
    edge = L.solid("card_edge", (0.945, 0.943, 0.935), roughness=0.75)
    cw, ch, ct = 0.090, 0.050, 0.00042

    def lay(ox, oy, oz, angle):
        ca, sa = math.cos(angle), math.sin(angle)

        def place(x, y, z):
            return (ox + x * ca - y * sa, oy + x * sa + y * ca, oz + z)
        return place

    # Lower card, face up showing the printed reverse.
    L.printed_slab("Card_Back", coll, cw, ch, ct, 0.0016,
                   lay(0.017, -0.011, ct / 2.0 + 0.00002, math.radians(-7.0)),
                   (back, front, edge), nu=64)
    # Upper card resting across it, face up showing the printed front.
    L.printed_slab("Card_Front", coll, cw, ch, ct, 0.0016,
                   lay(-0.021, 0.019, ct * 1.6, math.radians(9.0)),
                   (front, back, edge), nu=64)

    for obj in coll.objects:
        if obj.name.startswith("Card_Front"):
            obj.rotation_euler = (math.radians(1.6), math.radians(-2.2), 0.0)
    return coll



# =================================================================== 8. handout flyers
def build_flyers():
    """
    Two handout flyers carrying the roll-up banner artwork.

    The brief was "exactly like the X-stand banner layout", so the proportion is the
    banner's own: the stands are 85 x 200 cm, a ratio of 1 : 2.35, and these keep it at
    105 x 247 mm. That is a long flyer rather than an A-size one, which is the price of
    reproducing the layout without recomposing it -- squeezing a 1 : 2.35 design onto A5
    would mean redrawing someone else's artwork.

    The faces use the same rectified textures as the banners. The reverse uses the same
    reconstructed liner, because no photograph shows the back of either piece.
    """
    coll = L.collection("Flyers")
    paper_edge = L.solid("flyer_edge", (0.950, 0.948, 0.941), roughness=0.78)
    fw, fh, ft = 0.105, 0.247, 0.00040

    def lay(ox, oy, oz, angle):
        ca, sa = math.cos(angle), math.sin(angle)

        def place(x, y, z):
            return (ox + x * ca - y * sa, oy + x * sa + y * ca, oz + z)
        return place

    for tag, offset, angle, lift in (("B", (0.016, -0.013), -7.5, 1.0),
                                     ("A", (-0.013, 0.014), 10.0, 2.4)):
        face = L.textured("flyer_%s_face" % tag, "banner_" + tag.lower(),
                          roughness=0.46, specular=0.40)
        liner = L.textured("flyer_%s_back" % tag, "banner_%s_back" % tag.lower(),
                           roughness=0.62)
        L.printed_slab("Flyer_" + tag, coll, fw, fh, ft, 0.0012,
                       lay(offset[0], offset[1], ft * lift, math.radians(angle)),
                       (face, liner, paper_edge), nu=64)

    # The top flyer sits across the one beneath it rather than dead flat on the counter.
    for obj in coll.objects:
        if obj.name.startswith("Flyer_A"):
            obj.rotation_euler = (math.radians(1.1), math.radians(-1.7), 0.0)
    return coll

# ============================================================================== export
def export(coll, filename):
    bpy.ops.object.select_all(action="DESELECT")
    for ob in coll.objects:
        ob.select_set(True)
    bpy.context.view_layer.objects.active = coll.objects[0]
    path = os.path.join(OUT_DIR, filename)
    kwargs = dict(filepath=path, export_format="GLB", use_selection=True,
                  export_apply=True, export_yup=True, export_cameras=False,
                  export_lights=False, export_extras=False,
                  export_image_format="JPEG", export_jpeg_quality=86)
    try:
        bpy.ops.export_scene.gltf(**kwargs)
    except TypeError:
        kwargs.pop("export_jpeg_quality", None)
        kwargs["export_image_quality"] = 86
        bpy.ops.export_scene.gltf(**kwargs)
    size = os.path.getsize(path) / 1024.0
    print("  exported %-34s %7.0f KB  (%d objects)" % (filename, size, len(coll.objects)))


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    reset()
    print("Building Blender geometry for the print-production products:")
    jobs = [
        (build_tote("A", "tote_a_front", "tote_a_back"), "tote-kpick-a.glb"),
        (build_tote("B", "tote_b_front", "tote_b_back"), "tote-kpick-b.glb"),
        (build_notebook(), "notebook-pen-kpick.glb"),
        (build_bottle(), "spray-bottle-kpick.glb"),
        (build_cart(), "booth-cart-sinocare.glb"),
        (build_banners(), "roll-up-banners-sinocare.glb"),
        (build_cards(), "business-cards-sinocare.glb"),
        (build_flyers(), "flyers-sinocare.glb"),
    ]
    for coll, _ in jobs:
        print("  built %-22s %3d objects" % (coll.name, len(coll.objects)))
    bpy.ops.wm.save_as_mainfile(filepath=BLEND)
    print("Saved Blender project:", BLEND)
    print("Exporting glTF binaries:")
    for coll, filename in jobs:
        export(coll, filename)
    print("Models written to", OUT_DIR)


if __name__ == "__main__":
    main()
