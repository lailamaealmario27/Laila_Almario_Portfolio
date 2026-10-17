# Laila Almario Portfolio

Static portfolio deployed from GitHub to Vercel.

## Deployment pipeline

Vercel's Git integration is the pipeline — there is no GitHub Actions workflow and no
secrets to rotate. Once the repository is connected, Vercel subscribes to GitHub's push
webhook and deploys on its own:

| You do | Vercel does |
| --- | --- |
| `git push origin main` | Builds and promotes to the production domain |
| Push any other branch, or open a PR | Builds a preview deployment and comments the URL on the PR |
| Click **Rollback** on an older deployment | Repoints production at it; no revert commit needed |

Because the site is static there is no build step to fail — a deploy is an upload, so it
is live within a minute or so of the push.

### One-time setup

1. Create an **empty** GitHub repository (no README, no `.gitignore` — this repo already
   has both, and prefilled files force a merge on the first push).
2. Point this repo at it and push:

   ```sh
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```

3. In Vercel: **Add New → Project → Import** the repository.
4. Framework Preset **Other**; leave Build Command and Output Directory blank. The site
   is served straight from the repository root.
5. **Deploy.** Every later push deploys automatically; this is the only manual step.

### What reaches production

`.vercelignore` keeps `blender/`, `archive/`, and `index.legacy.html` out of the
deployment — the Blender sources stay in git as the models' source of truth, but the
site only ever serves `assets/models/*.glb`. `vercel.json` sets `cleanUrls` (so the
private inbox is `/admin`, not `/admin.html`) and the `X-Content-Type-Options` and
`Referrer-Policy` headers.

`site-config.js` is committed on purpose: it holds only the Supabase project URL and the
publishable **anon** key, which is public by design and safe behind the RLS policies in
`private_inbox_setup.sql`. A `service_role` key must never go in any file in this repo —
see `SETUP_PRIVATE_INBOX.md`.

## The landing

The page opens on `#welcome`, a full-screen cinematic section **in the normal flow** --
not an overlay. There is nothing to dismiss, nothing locks the scroll and no deep link
has to route around it: you scroll past it the way you scroll past any other section.
An earlier version of this was a fixed overlay with a dismiss gate; it was replaced
because a gate is a thing that can trap someone, and a section cannot.

## Scroll choreography

## Kaia

The **Desktop assistant** tab in Selected work is Kaia: a Python desktop assistant Laila
designed and built, and the only thing in the portfolio that is her own software rather
than her client work. She watches which app is in front, sorts the day into twelve
categories, drafts the end-of-day report and pushes it to the K-PICK Hub.

The panel is written from the source, `assistant.py` in the parent folder -- the
category rules, the private-window list, the wording rules in the report builders, the
Telegram commands and the right-click menu. If the assistant changes, the copy in
`#panel-assistant` is what goes stale; check it against the source rather than guessing.

| Path | What it is |
| --- | --- |
| `kaia/frames/` | Her 46 source frames, five clips: idle, nod, tilt, hop, dance. |
| `kaia/poses/` | The four turnaround views. |
| `kaia/build_kaia_sprite.py` | Packs the frames onto one sheet and converts the views to WebP. |
| `assets/images/kaia-sprite.webp` | The sheet the site loads: one clip per row. |
| `kaia.js` | Walks a row a column at a time on a canvas. |

Rebuild after changing a frame:

```sh
python kaia/build_kaia_sprite.py
```

It prints the sheet geometry. `CLIPS` in `kaia.js` has to agree with it -- that is how
the animator knows how many columns a clip has before it wraps. `kaia/` is in
`.vercelignore`: 46 PNGs is 1.3 MB and 46 requests, the packed sheet is 529 KB and one.

She idles by default and breaks into a nod or a head tilt on her own every few seconds;
clicking her makes her hop. Under `prefers-reduced-motion` she holds a single frame. If
the sheet fails to load, the static turnaround view it replaces stays on screen.

She is a portfolio piece, not a chatbot: she lives in her own tab and nowhere else.

`index.html` is the website entry point. The visual system lives in `styles.css`, interactions live in `app.js`, and images/videos are stored in `assets/`.

The previous single-file version is retained in `archive/index.legacy.html` for reference only and is not loaded by the production site.

## Print-production 3D models

The six products in the **Print production** section are real 3D models, built in
Blender from the supplied mockup photographs and viewed in the browser as glTF.

### Where things live

| Path | What it is |
| --- | --- |
| `blender/kpick_sinocare_print_products.blend` | The Blender project. One collection per product. |
| `blender/build_textures.py` | Rectifies the printed artwork out of the source photos and composes the surfaces no photo shows. Writes `blender/textures/`. |
| `blender/lib_build.py` | Parametric modelling helpers (surfaces, lathes, tubes, swept ribbons, printed slabs). |
| `blender/build_models.py` | Builds every product, saves the `.blend`, and exports the GLBs. |
| `blender/build_showroom.py` | Builds the round display table into `showroom.blend`. One surface of revolution, no branding. |
| `blender/render_check.py` | Renders a four-angle turnaround of each product into `blender/preview/` for checking. |
| `blender/textures/` | Generated textures. Regenerated by `build_textures.py`; not hand-edited. |
| `assets/models/*.glb` | The optimised models the website loads. |
| `assets/models/showroom-table-round.glb` | The K-PICK display table. Sinocare has no table. |
| `showroom.js` | The showroom: one scene, two brand collections, click a product to inspect it. |
| `vendor/three/` | three.js r179, vendored. See `vendor/three/README.md`. |

The original photographs are untouched in `assets/images/` and stay reachable from
each product through its **Original photo** button.

### Rebuilding

```sh
python blender/build_textures.py
"/c/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --python blender/build_models.py
"/c/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --python blender/build_showroom.py
```

The last line only needs rerunning if the table changes. `TABLE_HEIGHT` in
`build_showroom.py` and the constant of the same name in `showroom.js` must agree: it is
how a product modelled on Z = 0 ends up standing on the table rather than through it.

The texture step needs `pillow` and `numpy`; the model step uses Blender's own Python.
To eyeball the result without opening Blender:

```sh
"/c/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b \
  blender/kpick_sinocare_print_products.blend --python blender/render_check.py
```

### Reconstructed surfaces

Most source photos show one face of a product. Those faces carry the real artwork,
rectified straight out of the photograph, including anything the mockup itself got
odd: on the pen, K-PICK TRADING CORP. runs down the barrel while EROP | SUNGSHIM runs
up it, and the model reproduces that rather than tidying it. Every surface that no photo shows is an
informed mockup built from the same brand elements, is captioned as such on the
surface itself, and raises a badge in the viewer while the camera is behind the
product. The business cards are the exception: the photo shows both printed faces, so
nothing about that model is reconstructed.

### The showroom

The Print & Production section is a single WebGL scene, not one viewer per product.
`showroom.js` stands a brand's products at their real modelled size and lets you pick
one. The two collections are **K-PICK** (tote bag, notebook and pen, spray bottle) and
**Sinocare** (roll-up banners, booth cart, calling card). Brand membership is not
inferred: every model filename, product name and supplied photo caption names its brand,
and they agree.

The two sets are staged differently, because they are different kinds of object:

* **K-PICK** is giveaway merchandise, and it sits clustered on the round table --
  1.10 m across, turned on a lathe in Blender, matte ivory.
* **Sinocare** is exhibit furniture two metres tall. It gets **no table**: the banners
  and the cart stand on the studio floor, and the calling card is held in the air off
  the cart's left shoulder, where a 9 cm card is actually readable and clear of the
  cart's geometry.

Selecting a product **lifts it, then flies the camera to it**. The two moves overlap on
purpose -- the camera is already travelling before the lift finishes -- which is what
stops the sequence reading as two separate steps. Going back reverses both, camera
leading. Escape and **Back to showroom** do the same thing.

Four details are load-bearing and easy to undo by accident:

* products are modelled at their real size in metres sitting on Z = 0, and nothing in
  the showroom rescales them. A product is placed by turning it, measuring the bounding
  box that turn produced, and dropping it onto the surface. Measuring afterwards is what
  lets the notebook lie on its face without a hand-tuned offset.
* `measure()` records a product's resting position **once**. Every later move writes an
  absolute value derived from it, never an increment, and `lower()` snaps back to the
  recorded vector rather than leaving the product wherever the easing finished. That is
  what lets the lift run a hundred round trips without drifting.
* every tween carries a tag, and starting one cancels any other with the same tag. A
  visitor clicking between two products cannot start two fights over the same camera.
* `modelScene()` clones a cached glTF scene **and clones its materials**. Without the
  material clone, fading one product fades every other product from the same file, and
  swapping a variant disposes the cached original out from under the next use. Geometry
  and textures stay shared on purpose, so `disposeTree()` frees materials only.

The scene has no frame: the canvas clears to the page's own `--paper`, the floor fogs
out into the same colour, and `.showroom-stage` carries no border or panel. The products
are meant to read as objects on a table, not as pictures in a box.

### Keeping Selected work safe

`showroom.js` loads after `app.js`, lives in its own module, touches nothing outside
`[data-showroom]`, and falls back to the supplied photographs on any error -- a missing
WebGL context, a failed model fetch or a lost context all land on the same photo grid. The
Selected work galleries are populated at the top of `app.js` and must not be made to
depend on the viewer: an earlier integration coupled the two and took the galleries
down with it.
