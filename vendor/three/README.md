# three.js r179 (vendored)

Source: https://cdn.jsdelivr.net/npm/three@0.179.1/

| File | Upstream path |
| --- | --- |
| `three.module.min.js` | `build/three.module.min.js` |
| `three.core.min.js` | `build/three.core.min.js` (the minified build is split in two; `three.module.min.js` imports it) |
| `OrbitControls.js` | `examples/jsm/controls/OrbitControls.js` |
| `GLTFLoader.js` | `examples/jsm/loaders/GLTFLoader.js` |
| `BufferGeometryUtils.js` | `examples/jsm/utils/BufferGeometryUtils.js` |
| `RoomEnvironment.js` | `examples/jsm/environments/RoomEnvironment.js` |

The only edit made to the upstream files is in their `import` statements: the bare
specifier `three` and the relative `../utils/BufferGeometryUtils.js` are rewritten to
point at the files in this folder. Upstream ships those addons expecting an import map;
resolving them locally instead is what keeps `print-3d.js` working with a plain
`<script type="module">` and no third-party request at runtime.

These files back the print-production product viewers (`print-3d.js`), which display the
GLB models exported from `blender/kpick_sinocare_print_products.blend`.

three.js is MIT licensed, Copyright (c) 2010-2025 three.js authors.
