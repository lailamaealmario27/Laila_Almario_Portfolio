/*
 * Interactive viewers for the print-production products.
 *
 * Each product is a glTF binary exported from blender/kpick_sinocare_print_products.blend
 * (see blender/build_models.py). Nothing here is procedural: the geometry and the
 * rectified artwork both come out of the Blender project.
 *
 * This module is deliberately self-contained and defensive. It is loaded after app.js,
 * it never touches markup outside .product-stage, and every failure path leaves the
 * original photograph on screen. An earlier integration took the Selected work section
 * down with it; that must not be possible from here.
 */
// three.js is vendored under vendor/three rather than pulled from a CDN: the addons
// upstream import the bare specifier "three", which needs an import map and fails
// silently without one. See vendor/three/README.md.
const RUNTIME = 'vendor/three';

const stages = [...document.querySelectorAll('.product-stage')];
if (stages.length) init();

function init() {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let enginePromise = null;

  /** Load three.js and its loaders once, on first demand. */
  function engine() {
    if (!enginePromise) {
      enginePromise = Promise.all([
        import(`./${RUNTIME}/three.module.min.js`),
        import(`./${RUNTIME}/OrbitControls.js`),
        import(`./${RUNTIME}/GLTFLoader.js`),
        import(`./${RUNTIME}/RoomEnvironment.js`)
      ]).then(([THREE, controls, loaders, env]) => ({
        THREE,
        OrbitControls: controls.OrbitControls,
        GLTFLoader: loaders.GLTFLoader,
        RoomEnvironment: env.RoomEnvironment
      }));
    }
    return enginePromise;
  }

  stages.forEach(stage => {
    try {
      setup(stage);
    } catch (error) {
      console.warn('[print-3d] viewer unavailable, keeping the original photo', error);
    }
  });

  /** Build the chrome around a stage, then wait until it scrolls into view to load. */
  function setup(stage) {
    const photo = stage.querySelector('.product-photo');
    const name = stage.dataset.product || 'Product';
    const variants = parseVariants(stage);
    if (!stage.dataset.model || !photo) return;

    const frame = el('div', 'product-frame');
    const canvas = document.createElement('canvas');
    canvas.className = 'product-canvas';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `${name}: interactive 3D model. Drag to rotate, scroll to zoom.`);
    canvas.tabIndex = 0;

    const status = el('p', 'product-status', 'Loading 3D model…');
    const badge = el('p', 'product-badge');
    badge.hidden = true;
    frame.append(canvas, status, badge);

    const bar = el('div', 'product-bar');
    const hint = el('span', 'product-hint', 'Drag to rotate · scroll to zoom');
    const actions = el('div', 'product-actions');

    let variantButtons = [];
    if (variants.length > 1) {
      const group = el('div', 'product-variants');
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', `${name} design options`);
      variantButtons = variants.map((variant, index) => {
        const button = el('button', 'product-chip', variant.label);
        button.type = 'button';
        button.setAttribute('aria-pressed', String(index === 0));
        group.append(button);
        return button;
      });
      actions.append(group);
    }

    const photoButton = el('button', 'product-button', 'Original photo');
    photoButton.type = 'button';
    const resetButton = el('button', 'product-button', 'Reset view');
    resetButton.type = 'button';
    actions.append(photoButton, resetButton);
    bar.append(hint, actions);

    const dialog = buildPhotoDialog(stage, photo, name);
    photo.classList.add('product-photo-hidden');
    stage.append(frame, bar, dialog);
    photoButton.addEventListener('click', () => openDialog(dialog));

    // Boot on first sight, or when something asks for it. The carousel clips its
    // off-screen slides, so it preloads the neighbouring products by hand rather than
    // waiting for them to scroll into view.
    let booted = false;
    const boot = () => {
      if (booted) return;
      booted = true;
      observer.disconnect();
      engine()
        .then(api => mount(api, { stage, frame, canvas, status, badge, hint,
                                  resetButton, variants, variantButtons, name }))
        .catch(error => fail(stage, status, error));
    };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) boot();
    }, { rootMargin: '280px' });
    observer.observe(stage);
    stage.addEventListener('product:preload', boot);
  }

  /** Give up cleanly: the supplied photograph comes back and nothing else is touched. */
  function fail(stage, status, error) {
    console.warn('[print-3d] falling back to the original photo', error);
    stage.classList.add('product-stage-fallback');
    status.textContent = '3D model unavailable — showing the original photo.';
  }

  function mount(api, ui) {
    const { THREE, OrbitControls, GLTFLoader, RoomEnvironment } = api;
    const { stage, frame, canvas, status, badge, hint, resetButton,
            variants, variantButtons, name } = ui;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd9d2c6, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 1.9);
    key.position.set(-2.4, 3.4, 3.2);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.75);
    rim.position.set(2.8, 1.8, -2.6);
    scene.add(rim);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 200);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.rotateSpeed = 0.85;
    controls.zoomSpeed = 0.75;
    controls.minPolarAngle = 0.18;
    controls.maxPolarAngle = Math.PI - 0.12;

    const pivot = new THREE.Group();
    scene.add(pivot);
    const shadow = groundShadow(THREE);
    scene.add(shadow);

    const loader = new GLTFLoader();
    let home = null;
    let current = -1;

    function frameModel(model) {
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const centre = box.getCenter(new THREE.Vector3());
      // Sit the product on the ground plane and spin it about its own centre.
      model.position.sub(new THREE.Vector3(centre.x, box.min.y, centre.z));

      const radius = Math.max(size.length() / 2, 0.02);
      const target = new THREE.Vector3(0, size.y * 0.5, 0);
      const elevation = THREE.MathUtils.degToRad(Number(stage.dataset.elevation) || 20);
      const distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov * 0.5)) * 1.05;
      // Keep the contact shadow proportional to the product rather than the scene.
      shadow.scale.setScalar(Math.max(size.x, size.z) * 1.9);

      home = {
        target,
        position: new THREE.Vector3(
          0,
          target.y + Math.sin(elevation) * distance,
          Math.cos(elevation) * distance
        )
      };
      controls.minDistance = distance * 0.45;
      controls.maxDistance = distance * 2.3;
      resetView();
    }

    function resetView() {
      if (!home) return;
      controls.target.copy(home.target);
      camera.position.copy(home.position);
      camera.updateProjectionMatrix();
      controls.update();
    }

    function show(index) {
      if (index === current) return;
      const variant = variants[index];
      current = index;
      variantButtons.forEach((button, i) =>
        button.setAttribute('aria-pressed', String(i === index)));
      status.hidden = false;
      status.textContent = 'Loading 3D model…';
      loader.load(variant.url, gltf => {
        pivot.clear();
        pivot.add(gltf.scene);
        frameModel(gltf.scene);
        status.hidden = true;
        stage.classList.add('product-stage-ready');
        resize();
      }, undefined, error => fail(stage, status, error));
    }

    function resize() {
      const rect = frame.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }

    // Tell the visitor, live, when they have turned past the photographed faces.
    const reconstructed = stage.dataset.reconstructed || '';
    const from = Number(stage.dataset.reconFrom);
    const to = Number(stage.dataset.reconTo);
    function updateBadge() {
      if (!reconstructed || Number.isNaN(from) || Number.isNaN(to)) return;
      const deg = (THREE.MathUtils.radToDeg(controls.getAzimuthalAngle()) % 360 + 360) % 360;
      const behind = from < to ? deg >= from && deg <= to : deg >= from || deg <= to;
      badge.hidden = !behind;
      if (behind) badge.textContent = `Reconstructed mockup — ${reconstructed}. Not from the original photo.`;
    }

    new ResizeObserver(resize).observe(frame);
    resetButton.addEventListener('click', () => {
      resetView();
      canvas.focus({ preventScroll: true });
    });
    variantButtons.forEach((button, index) =>
      button.addEventListener('click', () => show(index)));

    // Keyboard orbiting. OrbitControls has no public rotate method, so move the camera
    // round the target in spherical coordinates instead of reaching into its internals.
    const spherical = new THREE.Spherical();
    const offset = new THREE.Vector3();
    function nudge(azimuth, polar) {
      offset.copy(camera.position).sub(controls.target);
      spherical.setFromVector3(offset);
      spherical.theta += azimuth;
      spherical.phi = THREE.MathUtils.clamp(
        spherical.phi + polar, controls.minPolarAngle, controls.maxPolarAngle);
      camera.position.copy(controls.target).add(offset.setFromSpherical(spherical));
      controls.update();
    }

    canvas.addEventListener('keydown', event => {
      const step = event.shiftKey ? 0.3 : 0.12;
      if (event.key === 'ArrowLeft') nudge(-step, 0);
      else if (event.key === 'ArrowRight') nudge(step, 0);
      else if (event.key === 'ArrowUp') nudge(0, -step * 0.6);
      else if (event.key === 'ArrowDown') nudge(0, step * 0.6);
      else if (event.key === 'Home') resetView();
      else return;
      event.preventDefault();
    });
    if (navigator.maxTouchPoints > 0) hint.textContent = 'Drag to rotate · pinch to zoom';

    // Render only while the viewer is on screen, so six canvases cost nothing idle.
    // A viewer draws only while it is both on screen and not parked off to the side of
    // the carousel, so six canvases never compete for the GPU.
    let running = false;
    let onScreen = false;
    const loop = () => {
      if (!running) return;
      controls.update();
      updateBadge();
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    const sync = () => {
      const should = onScreen && stage.dataset.parked !== 'true';
      if (should && !running) { running = true; loop(); }
      else if (!should) { running = false; }
    };
    const visibility = new IntersectionObserver(entries => {
      onScreen = entries.some(entry => entry.isIntersecting);
      sync();
    }, { threshold: 0.01 });
    visibility.observe(stage);
    stage.addEventListener('product:parked', () => {
      sync();
      // Re-observing re-delivers the current state, so a slide that was clipped out of
      // sight starts drawing again the moment the carousel brings it back.
      visibility.unobserve(stage);
      visibility.observe(stage);
    });
    if (reduceMotion) controls.enableDamping = false;

    show(0);
  }

  function groundShadow(THREE) {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(45,34,48,0.34)');
    gradient.addColorStop(0.45, 'rgba(45,34,48,0.11)');
    gradient.addColorStop(1, 'rgba(45,34,48,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.0005;
    mesh.renderOrder = -1;
    return mesh;
  }

  function parseVariants(stage) {
    const raw = stage.dataset.variants;
    if (!raw) return [{ label: 'Default', url: stage.dataset.model }];
    return raw.split(';').map(entry => {
      const [label, url] = entry.split('|');
      return { label: label.trim(), url: url.trim() };
    });
  }

  function buildPhotoDialog(stage, photo, name) {
    const dialog = el('dialog', 'product-dialog');
    dialog.setAttribute('aria-label', `${name}: original photo`);
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = photo.currentSrc || photo.src;
    image.alt = photo.alt;
    const caption = el('figcaption', null,
      stage.dataset.photoCaption || photo.alt || 'Original photo');
    figure.append(image, caption);
    const close = el('button', 'product-button', 'Close');
    close.type = 'button';
    close.addEventListener('click', () => dialog.close());
    dialog.append(figure, close);
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
    return dialog;
  }

  function openDialog(dialog) {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
}
