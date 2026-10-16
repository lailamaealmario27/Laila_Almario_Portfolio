/*
 * The Print & Production showroom.
 *
 * One WebGL scene, two brand collections. K-PICK stands on the round display table
 * exported from blender/build_showroom.py; Sinocare has no table at all -- its pieces
 * are exhibit furniture that stands on the studio floor, with the calling card held in
 * the air beside the cart.
 *
 * Selecting a product lifts it off its spot, then flies the camera to it; going back
 * reverses both. The two moves overlap deliberately: the lift starts first and the
 * camera is already travelling before it finishes, which is what stops the sequence
 * reading as two separate steps.
 *
 * Everything is loaded from glTF binaries built by blender/build_models.py. No geometry
 * and no artwork is invented at runtime, and nothing is rescaled: the products are
 * modelled at their real size and the table was built to match.
 *
 * The same defensive rule the per-product viewers followed still applies: this module
 * is loaded after app.js, it only ever touches markup inside [data-showroom], and every
 * failure path leaves the supplied photographs on screen instead. The Selected work
 * galleries must never be able to go down with it.
 */
const RUNTIME = 'vendor/three';

/* Surface height and top radius of the round table, in metres. Must match
   TABLE_HEIGHT and TOP_RADIUS in blender/build_showroom.py. */
const TABLE_HEIGHT = 0.75;

/* The canvas clears to the page's own --paper so the scene has no visible edge: the
   studio floor fogs out into the same colour and the section reads as open page
   rather than a picture in a frame. */
const PAPER = 0xf2efe8;
const FLOOR = 0xe8e2d6;

/*
 * The two brand collections. Brand membership is not guessed: every model filename,
 * every supplied photo caption and every product name in the source markup already
 * names its brand, and they all agree.
 *
 * `place.on` is the surface -- the table top, or the floor, or `air` for a piece held
 * at `place.y` above the floor. x and z are the centre of its footprint in metres,
 * `spin` turns it on the spot and `tilt` lays it over.
 */
const CATALOGUE = {
  kpick: {
    label: 'K-PICK',
    /* The round table. Sinocare deliberately has none. */
    table: 'assets/models/showroom-table-round.glb',
    products: [
      {
        id: 'tote',
        name: 'Branded tote bag',
        role: 'Giveaway and event merchandise',
        size: '35 × 40 × 10 cm',
        model: 'assets/models/tote-kpick-a.glb',
        variants: [
          { label: 'Option A', model: 'assets/models/tote-kpick-a.glb' },
          { label: 'Option B', model: 'assets/models/tote-kpick-b.glb' }
        ],
        photo: 'assets/images/image-23-c9f86e0580.webp',
        photoCaption: 'Supplied mockup photo: K-PICK tote, Option A and Option B',
        place: { on: 'table', x: -0.15, z: -0.05, spin: -20 }
      },
      {
        id: 'notebook',
        name: 'Notebook and pen',
        role: 'Corporate stationery',
        size: 'A5, 145 × 212 mm',
        model: 'assets/models/notebook-pen-kpick.glb',
        photo: 'assets/images/image-24-178ef540cb.webp',
        photoCaption: 'Supplied mockup photo: K-PICK notebook and pen',
        /* Modelled standing upright; it lies flat on the table like the photograph. */
        place: { on: 'table', x: 0.15, z: 0.19, spin: 16, tilt: -90 }
      },
      {
        id: 'bottle',
        name: 'Spray bottle',
        role: 'Promotional giveaway',
        size: '50 ml',
        model: 'assets/models/spray-bottle-kpick.glb',
        photo: 'assets/images/image-25-ba1aa1d861.webp',
        photoCaption: 'Supplied mockup photo: K-PICK spray bottle',
        place: { on: 'table', x: 0.21, z: -0.09, spin: 24 }
      }
    ]
  },
  sinocare: {
    label: 'Sinocare',
    table: null,
    products: [
      {
        id: 'banners',
        name: 'Roll-up banners',
        role: 'Large-format display',
        size: '200 cm tall, iCan i3 and BA 823',
        model: 'assets/models/roll-up-banners-sinocare.glb',
        photo: 'assets/images/image-27-c3fd8f5793.webp',
        photoCaption: 'Supplied mockup photo: Sinocare roll-up banners, iCan i3 and BA 823',
        place: { on: 'floor', x: -0.74, z: -1.20, spin: 7 }
      },
      {
        id: 'cart',
        name: 'Booth cart',
        role: 'Event production',
        size: '80 × 40 × 200 cm',
        model: 'assets/models/booth-cart-sinocare.glb',
        photo: 'assets/images/image-26-3c72d7409f.webp',
        photoCaption: 'Supplied mockup photo: Sinocare health-monitoring cart, 80 × 40 × 200 cm',
        place: { on: 'floor', x: 1.02, z: -1.04, spin: -13 }
      },
      {
        id: 'cards',
        name: 'Calling card',
        role: 'Corporate print collateral',
        size: '90 × 55 mm',
        model: 'assets/models/business-cards-sinocare.glb',
        photo: 'assets/images/image-28-c52ef6ff59.webp',
        photoCaption: 'Supplied mockup photo: Sinocare calling card, both printed faces',
        /* Held in the air in front of the cart's left shoulder: a 9 cm card laid on the
           floor beside a two-metre cart would be unreadable, and it must not touch the
           cart. The cart's own footprint starts at x 0.53 / z -1.27. */
        place: { on: 'air', x: 0.33, z: -0.46, y: 0.92, spin: -24, tilt: -58 }
      }
    ]
  }
};

/* How the camera sits over each arrangement when nothing is selected. `pull` scales the
   fitted distance, `lift` raises the eye above the subject for a slightly elevated
   three-quarter view, and `look` is the height the camera aims at. */
const FRAMING = {
  kpick: { pull: 1.02, lift: 0.46, look: 0.92, azimuth: -8 },
  sinocare: { pull: 1.06, lift: 0.30, look: 1.02, azimuth: -6 }
};

/* Timings, in milliseconds. The camera is delayed so the lift reads first, but not by
   its whole duration -- the two overlap. */
const LIFT_MS = 520;
const PAN_MS = 880;
const PAN_DELAY = 160;
const RETURN_MS = 860;
const LOWER_DELAY = 140;

const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const root = document.querySelector('[data-showroom]');
if (root) boot(root);

function boot(mount) {
  const canvas = mount.querySelector('[data-canvas]');
  const fallback = mount.querySelector('[data-fallback]');
  const status = mount.querySelector('[data-status]');
  const detail = mount.querySelector('[data-detail]');
  const picks = mount.querySelector('[data-picks]');
  const hint = mount.querySelector('[data-hint]');
  const tabs = [...mount.querySelectorAll('[data-brand]')];
  if (!canvas || !fallback) return;

  if (!webglAvailable()) {
    say('This browser cannot display the 3D showroom. The supplied product photographs are below.');
    return;
  }

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let started = false;

  /* Nothing is fetched until the section is close to the viewport: the models are a
     couple of megabytes and most visitors never scroll this far. */
  const watcher = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting) || started) return;
    started = true;
    watcher.disconnect();
    start().catch(error => {
      console.warn('[showroom] unavailable, keeping the supplied photos', error);
      say('The 3D showroom could not start. The supplied product photographs are below.');
    });
  }, { rootMargin: '300px 0px' });
  watcher.observe(mount);

  function say(message) {
    if (status) status.textContent = message;
    mount.dataset.state = 'fallback';
  }

  async function start() {
    if (status) status.textContent = 'Loading the showroom…';
    const [THREE, orbit, gltf, room] = await Promise.all([
      import(`./${RUNTIME}/three.module.min.js`),
      import(`./${RUNTIME}/OrbitControls.js`),
      import(`./${RUNTIME}/GLTFLoader.js`),
      import(`./${RUNTIME}/RoomEnvironment.js`)
    ]);
    await run({
      THREE,
      OrbitControls: orbit.OrbitControls,
      GLTFLoader: gltf.GLTFLoader,
      RoomEnvironment: room.RoomEnvironment
    });
  }

  async function run({ THREE, OrbitControls, GLTFLoader, RoomEnvironment }) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.04;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PAPER);
    scene.fog = new THREE.Fog(PAPER, 8, 24);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(34, 1, 0.02, 80);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.rotateSpeed = 0.82;
    controls.zoomSpeed = 0.7;
    controls.enabled = false;

    /* The floor is the only plane in the scene and it carries the contact shadows.
       It fogs out to the page colour, so it has no visible far edge. */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: FLOOR, roughness: 0.97, metalness: 0 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const key = new THREE.DirectionalLight(0xfff4e4, 2.1);
    key.position.set(2.9, 5.2, 3.2);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 18;
    key.shadow.camera.left = -3.8;
    key.shadow.camera.right = 3.8;
    key.shadow.camera.top = 4.0;
    key.shadow.camera.bottom = -2.0;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.02;
    key.shadow.radius = 3;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xeaf0ff, 0.52);
    fill.position.set(-4.2, 2.6, 2.4);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 0.78);
    rim.position.set(-1.6, 3.2, -4.4);
    scene.add(rim);

    const loader = new GLTFLoader();
    const load = url => new Promise((resolve, reject) => loader.load(url, resolve, undefined, reject));

    const brands = new Map();
    const cache = new Map();
    let current = null;
    let selected = null;
    let dimmed = 0;

    /* ------------------------------------------------------------------ animation */
    /* A tiny tween runner. Each tween carries a tag; starting a tween cancels any
       other with the same tag, which is what stops a visitor clicking between two
       products from running two fights over the same camera or the same lift. */
    const tweens = new Set();

    function tween({ tag, duration, delay = 0, ease = easeInOutCubic, onUpdate, onComplete }) {
      if (tag) cancelTween(tag);
      const spec = {
        tag,
        ease,
        onUpdate,
        onComplete,
        duration: reduceMotion ? 0 : duration,
        start: performance.now() + (reduceMotion ? 0 : delay)
      };
      tweens.add(spec);
      wake();
      return spec;
    }

    function cancelTween(tag) {
      tweens.forEach(spec => { if (spec.tag === tag) tweens.delete(spec); });
    }

    function stepTweens(now) {
      let busy = false;
      [...tweens].forEach(spec => {
        if (now < spec.start) { busy = true; return; }
        const k = spec.duration > 0 ? Math.min(1, (now - spec.start) / spec.duration) : 1;
        spec.onUpdate(spec.ease(k));
        if (k < 1) { busy = true; return; }
        tweens.delete(spec);
        spec.onComplete?.();
      });
      return busy;
    }

    /* -------------------------------------------------------------------- building */
    function shadowed(object) {
      object.traverse(node => {
        if (!node.isMesh) return;
        node.castShadow = true;
        node.receiveShadow = true;
      });
    }

    /*
     * One parsed copy of each file is kept, and every placement gets a clone of it.
     * The clone's materials are cloned too -- without that, fading one product would
     * fade every other product sharing the file, and a variant swap would dispose the
     * cached original out from under the next use. Geometry and textures stay shared
     * with the cached scene on purpose: they are the expensive half, the cache is
     * bounded by the model files, and disposeTree() knows not to free them.
     */
    async function modelScene(url) {
      if (!cache.has(url)) cache.set(url, (await load(url)).scene);
      const copy = cache.get(url).clone(true);
      copy.traverse(node => {
        if (!node.isMesh || !node.material) return;
        node.material = Array.isArray(node.material)
          ? node.material.map(material => material.clone())
          : node.material.clone();
      });
      return copy;
    }

    /* Stand an object on a surface: turn it, then measure what that turn produced and
       drop it so its own lowest point rests on the surface and its footprint is centred
       on the requested spot. Measuring afterwards is what lets a product be laid on its
       face without hand-tuning an offset for it. */
    function stand(object, place) {
      object.position.set(0, 0, 0);
      object.rotation.set(
        THREE.MathUtils.degToRad(place.tilt || 0),
        THREE.MathUtils.degToRad(place.spin || 0),
        0
      );
      object.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(object);
      const centre = box.getCenter(new THREE.Vector3());
      const base = place.on === 'table' ? TABLE_HEIGHT : place.on === 'air' ? (place.y || 0) : 0;
      object.position.set(place.x - centre.x, base - box.min.y, place.z - centre.z);
      object.updateMatrixWorld(true);
    }

    /* Record where a product lives and how far it rises when picked. Both are derived
       once, from the resting pose, and every later move is written as an absolute value
       from them -- never as an increment -- so repeated lifts cannot drift. */
    function measure(entry) {
      entry.basePos = entry.holder.position.clone();
      entry.baseBox = new THREE.Box3().setFromObject(entry.holder);
      const size = entry.baseBox.getSize(new THREE.Vector3());
      entry.liftHeight = Math.min(0.30, Math.max(0.09, size.y * 0.20));
    }

    async function buildBrand(brandKey) {
      if (brands.has(brandKey)) return brands.get(brandKey);
      const spec = CATALOGUE[brandKey];
      const group = new THREE.Group();
      group.name = `brand-${brandKey}`;
      const entries = [];

      let table = null;
      if (spec.table) {
        table = await modelScene(spec.table);
        shadowed(table);
        group.add(table);
      }

      for (const product of spec.products) {
        const holder = new THREE.Group();
        holder.name = product.id;
        holder.add(await modelScene(product.model));
        shadowed(holder);
        stand(holder, product.place);
        holder.userData.product = product;
        group.add(holder);
        const entry = { product, holder, brand: brandKey, active: product.model };
        measure(entry);
        entries.push(entry);
      }

      const record = { group, entries, table };
      brands.set(brandKey, record);
      return record;
    }

    /* ---------------------------------------------------------------- camera shots */
    const tmpBox = new THREE.Box3();
    const tmpSize = new THREE.Vector3();
    const tmpCentre = new THREE.Vector3();
    const narrow = () => matchMedia('(max-width: 1000px)').matches;

    function fitDistance(size, pad) {
      const fov = THREE.MathUtils.degToRad(camera.fov);
      const half = Math.max(size.x, size.y, size.z) * 0.5 * pad;
      return Math.max(half / Math.tan(fov / 2), half / (Math.tan(fov / 2) * camera.aspect));
    }

    function showroomShot(brandKey) {
      const record = brands.get(brandKey);
      tmpBox.setFromObject(record.group);
      tmpBox.getSize(tmpSize);
      tmpBox.getCenter(tmpCentre);
      const frame = FRAMING[brandKey];
      const distance = fitDistance(tmpSize, narrow() ? 1.34 : 1.18) * frame.pull;
      const azimuth = THREE.MathUtils.degToRad(frame.azimuth);
      const target = new THREE.Vector3(tmpCentre.x, frame.look, tmpCentre.z + 0.08);
      return {
        target,
        position: new THREE.Vector3(
          target.x + Math.sin(azimuth) * distance,
          target.y + distance * frame.lift,
          target.z + Math.cos(azimuth) * distance
        )
      };
    }

    /* Framed on where the product will be once it has finished rising, so the camera
       and the lift arrive together instead of the camera chasing it. */
    function productShot(entry) {
      tmpBox.copy(entry.baseBox).translate(new THREE.Vector3(0, entry.liftHeight, 0));
      tmpBox.getSize(tmpSize);
      tmpBox.getCenter(tmpCentre);
      const small = narrow();
      const distance = fitDistance(tmpSize, small ? 1.78 : 1.46);
      /* On a phone the detail card is a sheet across the bottom of the stage, so the
         aim drops a little and the product rides higher in the frame, clear of it. */
      const target = new THREE.Vector3(
        tmpCentre.x,
        tmpCentre.y - (small ? tmpSize.y * 0.14 : 0),
        tmpCentre.z
      );
      const dir = new THREE.Vector3(0.32, 0.27, 0.91).normalize().multiplyScalar(distance);
      return { target, position: target.clone().add(dir), distance };
    }

    function flyCamera(shot, duration, delay, onArrive) {
      const fromPos = camera.position.clone();
      const fromTarget = controls.target.clone();
      controls.enabled = false;
      tween({
        tag: 'camera',
        duration,
        delay,
        ease: easeInOutCubic,
        onUpdate: k => {
          camera.position.lerpVectors(fromPos, shot.position, k);
          controls.target.lerpVectors(fromTarget, shot.target, k);
          camera.lookAt(controls.target);
        },
        onComplete: () => {
          camera.position.copy(shot.position);
          controls.target.copy(shot.target);
          controls.update();
          onArrive?.();
        }
      });
    }

    /* ------------------------------------------------------------- lift and lower */
    function raise(entry) {
      const from = entry.holder.position.y;
      const to = entry.basePos.y + entry.liftHeight;
      tween({
        tag: `lift:${entry.brand}:${entry.product.id}`,
        duration: LIFT_MS,
        ease: easeOutCubic,
        onUpdate: k => { entry.holder.position.y = from + (to - from) * k; }
      });
    }

    function lower(entry, delay = 0) {
      const from = entry.holder.position.y;
      const to = entry.basePos.y;
      tween({
        tag: `lift:${entry.brand}:${entry.product.id}`,
        duration: LIFT_MS,
        delay,
        ease: easeInOutCubic,
        onUpdate: k => { entry.holder.position.y = from + (to - from) * k; },
        /* Snapped back to the recorded resting pose rather than left wherever the
           easing finished, so a hundred round trips land in exactly one place. */
        onComplete: () => { entry.holder.position.copy(entry.basePos); }
      });
    }

    /* ------------------------------------------------------------------- dimming */
    function eachMaterial(object, fn) {
      object.traverse(node => {
        if (!node.isMesh || !node.material) return;
        (Array.isArray(node.material) ? node.material : [node.material]).forEach(fn);
      });
    }

    /* A light hold-back, not a blackout: the rest of the arrangement stays legible so
       it is obvious there is a set to come back to. */
    function applyDim(amount) {
      const record = current && brands.get(current);
      if (!record) return;
      const faded = 1 - 0.55 * amount;
      record.entries.forEach(entry => {
        const keep = selected === entry;
        eachMaterial(entry.holder, material => setOpacity(material, keep ? 1 : faded));
      });
      if (record.table) eachMaterial(record.table, material => setOpacity(material, faded));
    }

    function setOpacity(material, value) {
      if (material.userData.baseOpacity === undefined) {
        material.userData.baseOpacity = material.opacity;
        material.userData.baseTransparent = material.transparent;
      }
      const target = material.userData.baseOpacity * value;
      material.opacity = target;
      const clear = target > 0.995;
      const transparent = clear ? material.userData.baseTransparent : true;
      /* Flipping `transparent` recompiles the shader program, so only touch it on an
         actual change -- otherwise every frame of the fade rebuilds every material. */
      if (material.transparent !== transparent) {
        material.transparent = transparent;
        material.needsUpdate = true;
      }
      material.depthWrite = clear;
    }

    function animateDim(to) {
      const from = dimmed;
      tween({
        tag: 'dim',
        duration: 420,
        ease: easeInOutCubic,
        onUpdate: k => { dimmed = from + (to - from) * k; applyDim(dimmed); }
      });
    }

    /* ------------------------------------------------------------------ selection */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function entryAt(clientX, clientY) {
      const record = current && brands.get(current);
      if (!record) return null;
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(record.entries.map(e => e.holder), true);
      if (!hits.length) return null;
      let node = hits[0].object;
      while (node && !node.userData.product) node = node.parent;
      return node ? record.entries.find(entry => entry.holder === node) || null : null;
    }

    function select(entry) {
      if (!entry || selected === entry) return;
      const previous = selected;
      selected = entry;
      mount.dataset.mode = 'inspect';
      updateDetail(entry);
      updatePicks();
      if (previous) lower(previous);
      raise(entry);
      animateDim(1);
      const shot = productShot(entry);
      entry.home = shot;
      flyCamera(shot, PAN_MS, PAN_DELAY, () => {
        /* Only once the camera has arrived -- orbiting mid-flight fights the tween. */
        controls.enabled = true;
        controls.enableZoom = true;
        controls.minDistance = shot.distance * 0.42;
        controls.maxDistance = shot.distance * 2.2;
        controls.minPolarAngle = 0.12;
        controls.maxPolarAngle = Math.PI - 0.16;
        controls.minAzimuthAngle = -Infinity;
        controls.maxAzimuthAngle = Infinity;
      });
    }

    function deselect() {
      if (!selected) return;
      const entry = selected;
      selected = null;
      mount.dataset.mode = 'showroom';
      if (detail) detail.hidden = true;
      updatePicks();
      controls.enabled = false;
      animateDim(0);
      /* The camera leads and the product settles behind it. */
      flyCamera(showroomShot(current), RETURN_MS, 0, applyShowroomControls);
      lower(entry, LOWER_DELAY);
    }

    function applyShowroomControls() {
      const shot = showroomShot(current);
      const span = shot.position.distanceTo(shot.target);
      const azimuth = Math.atan2(shot.position.x - shot.target.x, shot.position.z - shot.target.z);
      controls.enabled = true;
      controls.enableZoom = false;
      controls.minDistance = span;
      controls.maxDistance = span;
      /* A little sway for a sense of depth, not a free camera: the arrangement is the
         subject here and the products are what you are meant to reach for. */
      controls.minAzimuthAngle = azimuth - 0.4;
      controls.maxAzimuthAngle = azimuth + 0.4;
      controls.minPolarAngle = 0.96;
      controls.maxPolarAngle = 1.44;
    }

    /* ---------------------------------------------------------------------- detail */
    function updateDetail(entry) {
      if (!detail) return;
      const { product } = entry;
      detail.hidden = false;
      detail.querySelector('[data-detail-brand]').textContent = CATALOGUE[entry.brand].label;
      detail.querySelector('[data-detail-name]').textContent = product.name;
      detail.querySelector('[data-detail-role]').textContent = product.role;
      detail.querySelector('[data-detail-size]').textContent = product.size || '';

      const variantHost = detail.querySelector('[data-detail-variants]');
      variantHost.innerHTML = '';
      if (product.variants) {
        product.variants.forEach(option => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'showroom-chip';
          button.textContent = option.label;
          button.setAttribute('aria-pressed', String(entry.active === option.model));
          button.addEventListener('click', () => swapVariant(entry, option));
          variantHost.append(button);
        });
      }

      detail.querySelector('[data-detail-photo]').href = product.photo;
      const image = detail.querySelector('[data-detail-photo-image]');
      image.src = product.photo;
      image.alt = product.photoCaption;
      detail.querySelector('[data-detail-photo-caption]').textContent = product.photoCaption;
      detail.dataset.showPhoto = 'false';
      const toggle = detail.querySelector('[data-photo-toggle]');
      if (toggle) toggle.setAttribute('aria-pressed', 'false');
    }

    async function swapVariant(entry, option) {
      if (entry.active === option.model) return;
      const replacement = await modelScene(option.model);
      const holder = entry.holder;
      [...holder.children].forEach(child => {
        holder.remove(child);
        disposeTree(child);
      });
      holder.add(replacement);
      shadowed(holder);
      stand(holder, entry.product.place);
      entry.active = option.model;
      /* The replacement is a different mesh, so its resting pose and travel have to be
         taken again before anything moves it. */
      measure(entry);
      if (selected === entry) {
        holder.position.y = entry.basePos.y + entry.liftHeight;
        entry.home = productShot(entry);
      }
      applyDim(dimmed);
      updateDetail(entry);
      wake();
    }

    /* Frees what modelScene() cloned, and only that. The geometry and the textures
       belong to the cached scene and are still in use by it. */
    function disposeTree(object) {
      object.traverse(node => {
        if (!node.isMesh || !node.material) return;
        (Array.isArray(node.material) ? node.material : [node.material])
          .forEach(material => material && material.dispose());
      });
    }

    /* ----------------------------------------------------------------- pick buttons */
    function updatePicks() {
      if (!picks) return;
      const record = current && brands.get(current);
      if (!record) return;
      picks.innerHTML = '';
      record.entries.forEach(entry => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'showroom-pick';
        button.textContent = entry.product.name;
        button.setAttribute('aria-pressed', String(selected === entry));
        button.addEventListener('click', () => (selected === entry ? deselect() : select(entry)));
        item.append(button);
        picks.append(item);
      });
    }

    /* --------------------------------------------------------------- brand switching */
    async function showBrand(brandKey) {
      if (current === brandKey) return;
      if (status) status.textContent = `Loading the ${CATALOGUE[brandKey].label} collection…`;
      const record = await buildBrand(brandKey);
      const previous = current && brands.get(current);
      const first = !current;
      /* Anything mid-flight belongs to the set being left behind. */
      cancelTween('camera');
      cancelTween('dim');
      if (previous) {
        previous.entries.forEach(entry => {
          cancelTween(`lift:${entry.brand}:${entry.product.id}`);
          entry.holder.position.copy(entry.basePos);
        });
        scene.remove(previous.group);
      }
      scene.add(record.group);
      current = brandKey;
      selected = null;
      dimmed = 0;
      applyDim(0);
      if (detail) detail.hidden = true;
      mount.dataset.mode = 'showroom';
      mount.dataset.state = 'ready';
      mount.dataset.brand = brandKey;
      if (status) {
        status.textContent = `${CATALOGUE[brandKey].label}: ${record.entries.length} products. Select one to inspect it.`;
      }
      tabs.forEach(tab => {
        const on = tab.dataset.brand === brandKey;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
      });
      updatePicks();
      resize();
      const shot = showroomShot(brandKey);
      if (first) {
        camera.position.copy(shot.position);
        controls.target.copy(shot.target);
        camera.lookAt(shot.target);
        applyShowroomControls();
        controls.update();
        wake();
      } else {
        flyCamera(shot, RETURN_MS, 0, applyShowroomControls);
      }
    }

    tabs.forEach(tab => tab.addEventListener('click', () => {
      showBrand(tab.dataset.brand).catch(error => console.warn('[showroom]', error));
    }));

    /* ------------------------------------------------------------------- interaction */
    let down = null;
    canvas.addEventListener('pointerdown', event => {
      down = { x: event.clientX, y: event.clientY, at: performance.now() };
    });
    canvas.addEventListener('pointerup', event => {
      if (!down) return;
      const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y);
      const quick = performance.now() - down.at < 600;
      down = null;
      /* A drag is an orbit, not a pick. Only a tap that stayed put selects. */
      if (moved > 7 || !quick) return;
      const entry = entryAt(event.clientX, event.clientY);
      if (entry) select(entry);
      else if (selected) deselect();
    });
    canvas.addEventListener('pointercancel', () => { down = null; });

    let hoverRaf = 0;
    canvas.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || hoverRaf) return;
      const { clientX, clientY } = event;
      hoverRaf = requestAnimationFrame(() => {
        hoverRaf = 0;
        canvas.style.cursor = entryAt(clientX, clientY) ? 'pointer' : '';
      });
    });

    mount.querySelectorAll('[data-back]').forEach(button =>
      button.addEventListener('click', deselect));
    mount.querySelectorAll('[data-reset]').forEach(button =>
      button.addEventListener('click', () => {
        if (selected && selected.home) flyCamera(selected.home, 460, 0, () => { controls.enabled = true; });
        else flyCamera(showroomShot(current), 460, 0, applyShowroomControls);
      }));
    mount.querySelectorAll('[data-photo-toggle]').forEach(button =>
      button.addEventListener('click', () => {
        if (!detail) return;
        const showing = detail.dataset.showPhoto === 'true';
        detail.dataset.showPhoto = String(!showing);
        button.setAttribute('aria-pressed', String(!showing));
      }));

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && selected) deselect();
    });

    /* ------------------------------------------------------------------------ frame */
    function resize() {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      wake();
    }
    new ResizeObserver(resize).observe(canvas);

    let running = false;
    let onScreen = false;
    let idleFrames = 0;

    function wake() { idleFrames = 0; sync(); }

    const loop = () => {
      if (!running) return;
      let moving = stepTweens(performance.now());
      if (controls.enabled && controls.update()) moving = true;
      renderer.render(scene, camera);
      /* Settle to a stop once the damping has run out, so an idle showroom costs
         nothing while it is sitting on screen. */
      idleFrames = moving ? 0 : idleFrames + 1;
      if (idleFrames > 90) { running = false; return; }
      requestAnimationFrame(loop);
    };

    function sync() {
      const should = onScreen && !document.hidden;
      if (should && !running) { running = true; requestAnimationFrame(loop); }
      if (!should) running = false;
    }

    new IntersectionObserver(entries => {
      onScreen = entries.some(entry => entry.isIntersecting);
      wake();
    }, { rootMargin: '120px 0px' }).observe(canvas);
    document.addEventListener('visibilitychange', wake);
    controls.addEventListener('change', wake);

    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      running = false;
      say('The 3D showroom lost its graphics context. The supplied product photographs are below.');
    });

    if (hint) {
      hint.textContent = navigator.maxTouchPoints > 0
        ? 'Tap a product to lift it · swipe to rotate · pinch to zoom'
        : 'Click a product to lift it · drag to rotate · scroll to zoom';
    }

    fallback.hidden = true;
    onScreen = true;
    await showBrand('kpick');
    wake();
  }
}

function webglAvailable() {
  try {
    const probe = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (probe.getContext('webgl2') || probe.getContext('webgl')));
  } catch {
    return false;
  }
}
