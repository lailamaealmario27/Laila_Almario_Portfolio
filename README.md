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

`.vercelignore` keeps `blender/`, `kaia/`, `archive/`, and `index.legacy.html` out of
the deployment — the Blender sources and Kaia's frames stay in git as the source of
truth, but the site only ever serves the built assets. `vercel.json` sets `cleanUrls`
and the `X-Content-Type-Options` and `Referrer-Policy` headers.

## The contact form

The form posts to [Web3Forms](https://web3forms.com), which emails the message on.
There is no database, no admin page and nothing to log into.

`site-config.js` holds the one thing it needs:

```js
export const WEB3FORMS_ACCESS_KEY = '...';
```

That key is committed on purpose. It is public by design — it only ever permits sending
to the single address it was issued for, which is why Web3Forms intends it to sit in a
file the browser can read. It is not a secret.

Two things worth knowing:

* a key has to be **activated from the email Web3Forms sends you**. An unactivated key
  is accepted by the form and then delivers nothing, silently;
* while the key is still the `PASTE-…` placeholder, `app.js` treats that as "not
  configured" rather than attempting the post, and the form tells visitors to email
  directly instead. That is also what happens if the request fails for any other
  reason — the fallback is an address, which cannot itself be down.

The form carries a honeypot field that is invisible to a real visitor; anything in it is
a bot and the submission is dropped before it is sent. Web3Forms' own `botcheck` is sent
alongside it.

## The intro gate

The site opens on **State A**: a fixed overlay carrying the name card and Kaia, with the
portfolio below it inert and unscrollable. Entering lifts it away -- it is not a section
you scroll past, it is a state the page leaves.

Three things keep it from becoming a trap:

* an inline script in `<head>` adds `intro-armed` to `<html>` **before first paint**, so
  the portfolio never flashes behind the overlay;
* that same script sets a 5-second safety timer which disarms the gate if `intro.js`
  never arrives. Cancelling that timer is the first thing the module does. A gate that
  can jam shut is worse than no gate at all;
* **a deep link skips it entirely** -- if `location.hash` is set, the gate never arms.

`open()` also pins `history.scrollRestoration` to `manual` and scrolls to the top,
because a reload that restores a scroll position would otherwise drop the visitor
halfway down the portfolio the moment the overlay lifted. Entering hands scrolling back,
moves focus to the masthead brand and fires an `intro:left` event.

Kaia in the gate is **three of her own supplied poses** stacked and cross-faded by CSS:
`present` at rest, `greet` on hover or focus, `cheer` on the way out. Nothing is rotated
or distorted to stand in for a pose she does not have. This is separate from `kaia.js`,
which still drives the packed sprite in Selected work -- the gate needs no animation
engine to show a still. She can be dragged, and the whole scene tilts up to 4° to
follow the pointer -- that last only on a fine pointer with motion allowed, so touch
and reduced motion simply never see it.

Listeners are attached once, in `wire()`. The gate can be reopened from the footer, and
an earlier version re-attached everything each time it was, quietly stacking a second
set of handlers on every replay.

Under `prefers-reduced-motion` the timeline collapses to near-zero rather than animating.

## Scroll choreography

`scenes.js`. Headings wipe up as they arrive, groups of things enter one after another,
and the two photographed areas drift against the scroll. That is the whole of it: no
pinning, no scroll hijacking, no snapping. Native scrolling is never touched.

**The one rule that keeps this safe: JavaScript hides, JavaScript reveals.** Nothing on
the page is hidden by the stylesheet alone, which is why the hiding classes are added by
the module rather than written into the markup. If `scenes.js` never loads, never runs,
or throws halfway through, every section stays exactly as visible as it was before it
existed -- and its `catch` explicitly re-reveals anything already hidden.

Two deliberate exclusions:

* **the hero `h1` gets no animation.** It is Laila's name and the first thing the page is
  for; it does not get to depend on an observer firing or a class landing. It renders.
* **reduced motion skips the module entirely**, which leaves the page static and
  complete. Only `backToTop()` runs either way, because it is a control rather than an
  animation.

`GROUPS` names a container, the children to stagger, and the gap between them. Selectors
that match nothing are skipped, so the list can safely name things that only exist on
some pages.

## The KOKOLOCK catalogue

The **Product catalogue** tab in Selected work is the 32-page KOKOLOCK Philippines
catalogue produced for K-PICK Trading Corp. -- smart door locks on pages 2-16, safety
vaults on 17-32, with page 1 the cover. The split is read off the page headers, not
assumed.

The masters arrive as 32 PNGs at 1080 x 1350, around 15 MB, which is more than the rest
of the site put together. `catalogue/build_catalogue.py` writes each page twice:

| File | Width | Used for |
| --- | --- | --- |
| `assets/images/kokolock-NN.webp` | 1080px | opened in the viewer |
| `assets/images/kokolock-NN-sm.webp` | 560px | the card in the rail |

Which is why `app.js` has a `TWO_SIZE` set: for those galleries the card shows the small
file and the zoom button carries the full page, so a rail of 32 lazy cards costs under a
megabyte and a full page is only fetched when someone actually opens one.

Quality is deliberately high for an image this size. These pages are mostly type, and
lossy WebP softens small text long before it softens a photograph -- a price list that
cannot be read is not worth the bytes it saves.

The PNG masters are not kept in the repository; the full-size WebP is the archived copy.
Pass the source directories as arguments to rebuild from the originals:

```sh
python catalogue/build_catalogue.py "path/to/pages" "path/to/more pages"
```

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
| `kaia/poses/` | `kaia_front`/`side`/`threequarter`/`back.png`, the four turnaround views, plus `pose-01`…`pose-17.png`: her 17 supplied poses, cut out. |
| `assets/images/kaia-present`, `-greet`, `-cheer.webp` | The three poses the intro gate loads, placed on one 250×360 canvas. |
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

## The files

`index.html` is the entry point and `styles.css` is the whole visual system. The
JavaScript is deliberately split so that one piece failing cannot take the rest down.

| File | What it does |
| --- | --- |
| `app.js` | The core. Fills the Selected work galleries, and runs the lightbox, tabs, navigation and contact form. **The gallery block is first and imports nothing optional:** if it stops running, Selected work renders empty. |
| `intro.js` | State A, the intro gate. See [The intro gate](#the-intro-gate). |
| `scenes.js` | Scroll choreography. See [Scroll choreography](#scroll-choreography). |
| `work-rail.js` | Arrows, dots, drag-to-scroll and keyboard paging for the horizontal rails. Each rail is enhanced independently. |
| `catalogue.js` | Presents the catalogue rail as a book, forwarding clicks to the rail's own zoom button. Hides the rail only once a working book is on screen. |
| `showroom.js` | The Print production WebGL scene. Falls back to the supplied photographs on any error. |
| `kaia.js` | Walks the packed sprite in the Desktop assistant tab. |
| `logo.js` | The adaptive monogram -- a CSS mask of the original PNG, inked from the tone the section behind the navigation declares. |
| `case-studies.js` | **The content file.** All case-study copy, every section tagged `verified`, `analysis` or `draft`. This is the one to edit. |
| `case-study.js` | The reader dialog, built on the platform's own `<dialog>`. Renders each section's basis, plus two optional blocks a section may carry: `items` (feature cards, each with an `Implemented` / `In development` / `Planned` status) and `steps` (an ordered workflow). |
| `site-config.js` | The Web3Forms access key, and nothing else. |

Images and video live in `assets/`. The modules layered on top of `app.js` follow one
rule: they touch only their own hooks and fail quietly, because an earlier integration
coupled a viewer to the galleries and took the galleries down with it.

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
| `blender/render_cart.py` | Renders the cart with whatever stands on its counter, to check that arrangement without a browser. |
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
  and the cart stand on the studio floor, and the calling card and the handout flyers
  sit on the cart's own counter, which is where both actually live at a booth.

The counter introduces a third surface, `on: 'cart'`. Its coordinates are given in the
**cart's frame, not the room's**, and `placeOn()` rotates them into place. That is what
lets the cart be moved or re-aimed with everything on it following, instead of sliding
off into mid-air. The counter top is at 0.840 m -- `Cart_Top` is a 48 mm slab centred at
0.816 in `build_models.py`, and `CART_TOP` in `showroom.js` has to agree with it.

The flyers are the one piece with no photograph behind them. They were asked for, and
they carry the roll-up banners' artwork at the banners' own 1 : 2.35 proportion, so they
are 105 x 247 mm rather than an A size: reproducing that layout on A5 would have meant
recomposing someone else's artwork. Their caption says the artwork comes from the banner
photo rather than implying a flyer was supplied.

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
