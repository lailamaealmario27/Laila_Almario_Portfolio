const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const portfolioSets = {
  social: [
    ['image-03-e67638eeab.webp', 'Marketing dashboard', 'Planning system'],
    ['image-04-370a4cf269.webp', 'Medical content calendar', 'Monthly schedule'],
    ['image-05-8e715002d3.webp', 'E-commerce calendar', 'Campaign planning'],
    ['image-06-6ce89ebc27.webp', 'Content studio', 'Ideas and captions']
  ],
  design: [
    ['image-07-e0e49d68f8.webp', 'BER months campaign', 'Social creative'],
    ['image-08-143cc1d97a.webp', 'Earth Day awareness', 'Campaign creative'],
    ['image-09-20f63d2084.webp', 'Birthday sale', 'Promotion'],
    ['image-10-907560fd02.webp', 'Workshop promotion', 'Event creative'],
    ['image-11-65bb25cd77.webp', 'Christmas content', 'Seasonal creative'],
    ['image-12-373a4b2005.webp', 'Proof of transactions', 'Trust content'],
    ['image-13-892b4a35a1.webp', 'World Diabetes Day', 'Awareness creative']
  ],
  events: [
    ['image-14-0a804db065.webp', 'Customer engagement', 'PhilMedical Expo'],
    ['image-15-133ef44b5e.webp', 'Exhibit support', 'On-site'],
    ['image-16-b6c36c37aa.webp', 'Product presentation', 'Convention'],
    ['image-17-780407f442.webp', 'Team support', 'Convention'],
    ['image-18-543b04bdf5.webp', 'Brand representation', 'Sinocare'],
    ['image-19-f706e252d4.webp', 'Event activity', 'Healthcare'],
    ['image-20-bfefc18bf1.webp', 'Booth interaction', 'Customer support'],
    ['image-21-68587b0974.webp', 'Event content', 'On-site'],
    ['image-22-e803726246.webp', 'Exhibit presentation', 'Product support']
  ]
};

$$('.media-rail[data-set]').forEach(rail => {
  const set = rail.dataset.set;
  const items = portfolioSets[set] || [];
  rail.innerHTML = items.map(([file, title, type]) => {
    const src = `assets/images/${file}`;
    const shape = set === 'design' ? ' square' : set === 'events' ? ' portrait' : '';
    return `<figure class="media-card${shape}"><img src="${src}" alt="${title}" loading="lazy"><figcaption class="media-caption"><strong>${title}</strong><span>${type}</span></figcaption><button class="zoom-button" data-gallery="${set}" data-src="${src}" data-alt="${title}" data-caption="${title}" aria-label="Open ${title} image"></button></figure>`;
  }).join('');
});

const menuButton = $('#menuButton');
const navLinks = $('#navLinks');

function closeMenu() {
  if (!menuButton || !navLinks) return;
  menuButton.setAttribute('aria-expanded', 'false');
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navLinks.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});

$$('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

const observedSections = $$('main section[id]');
const navAnchors = $$('.nav-links a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    navAnchors.forEach(anchor => {
      const active = anchor.getAttribute('href') === `#${entry.target.id}`;
      if (active) anchor.setAttribute('aria-current', 'true');
      else anchor.removeAttribute('aria-current');
    });
  }
}, { rootMargin: '-35% 0px -58% 0px', threshold: 0 });
observedSections.forEach(section => sectionObserver.observe(section));

$$('.experience-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.experience-item');
    const open = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!open));
    item.classList.toggle('open', !open);
  });
});

const tabs = $$('.work-tab');
const panels = $$('.work-panel');
function activateTab(tab) {
  const targetId = tab.getAttribute('aria-controls');
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  panels.forEach(panel => panel.classList.toggle('active', panel.id === targetId));
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    activateTab(tabs[next]);
    tabs[next].focus();
  });
});

if (!reduceMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });

  $$('.reveal').forEach((element, index) => {
    element.style.setProperty('--delay', `${(index % 4) * 55}ms`);
    revealObserver.observe(element);
  });
} else {
  $$('.reveal').forEach(element => element.classList.add('visible'));
}

const lightbox = $('#lightbox');
const lightboxImage = $('#lightboxImage');
const lightboxCaption = $('#lightboxCaption');
const lightboxCount = $('#lightboxCount');
const closeLightboxButton = $('#closeLightbox');
let gallery = [];
let galleryIndex = 0;
let lightboxOpener = null;

function syncLightbox() {
  const item = gallery[galleryIndex];
  if (!item) return;
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxCaption.textContent = item.caption || item.alt;
  lightboxCount.textContent = gallery.length > 1 ? `${galleryIndex + 1} / ${gallery.length}` : '';
}

function openLightbox(button) {
  const groupName = button.dataset.gallery;
  const groupButtons = $$(`[data-gallery="${groupName}"]`);
  gallery = groupButtons.map(item => ({
    src: item.dataset.src,
    alt: item.dataset.alt || '',
    caption: item.dataset.caption || ''
  }));
  galleryIndex = groupButtons.indexOf(button);
  lightboxOpener = button;
  syncLightbox();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('dialog-open');
  closeLightboxButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('dialog-open');
  lightboxOpener?.focus({ preventScroll: true });
}

function moveLightbox(delta) {
  galleryIndex = (galleryIndex + delta + gallery.length) % gallery.length;
  syncLightbox();
}

$$('.zoom-button').forEach(button => button.addEventListener('click', () => openLightbox(button)));
closeLightboxButton?.addEventListener('click', closeLightbox);
$('#lightboxPrev')?.addEventListener('click', () => moveLightbox(-1));
$('#lightboxNext')?.addEventListener('click', () => moveLightbox(1));
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', event => {
  if (!lightbox?.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') moveLightbox(-1);
  if (event.key === 'ArrowRight') moveLightbox(1);
  if (event.key === 'Tab') {
    const focusable = $$('button', lightbox);
    const current = focusable.indexOf(document.activeElement);
    event.preventDefault();
    const direction = event.shiftKey ? -1 : 1;
    focusable[(current + direction + focusable.length) % focusable.length].focus();
  }
});

let swipeStart = null;
lightbox?.addEventListener('pointerdown', event => {
  swipeStart = { x: event.clientX, time: performance.now() };
});
lightbox?.addEventListener('pointerup', event => {
  if (!swipeStart || gallery.length < 2) return;
  const distance = event.clientX - swipeStart.x;
  const velocity = Math.abs(distance) / Math.max(1, performance.now() - swipeStart.time);
  if (Math.abs(distance) > 55 || velocity > .5) moveLightbox(distance < 0 ? 1 : -1);
  swipeStart = null;
});

const form = $('#contactForm');
const formStatus = $('#formStatus');
if (form && formStatus) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (data.get('website')) return;
    const button = $('button[type="submit"]', form);
    button.disabled = true;
    formStatus.textContent = 'Sending your message…';

    try {
      const [{ createClient }, config] = await Promise.all([
        import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'),
        import('./site-config.js')
      ]);
      const ready = config.SUPABASE_URL.startsWith('https://') && config.SUPABASE_ANON_KEY.length > 30;
      if (!ready) throw new Error('Inbox is not configured');
      const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
      const { error } = await supabase.from('portfolio_messages').insert({
        sender_name: String(data.get('name')).trim(),
        sender_email: String(data.get('email')).trim(),
        project: String(data.get('project')).trim(),
        message: String(data.get('message')).trim()
      });
      if (error) throw error;
      form.reset();
      formStatus.textContent = 'Thank you. Your message has been sent.';
    } catch (error) {
      formStatus.innerHTML = 'The private inbox is unavailable right now. Please <a href="mailto:leilaalmario28@gmail.com">email me directly</a>.';
    } finally {
      button.disabled = false;
    }
  });
}

if (!reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const heroMedia = $('.hero-media');
  const heroPhoto = $('.hero-photo img');
  heroMedia?.addEventListener('pointermove', event => {
    const rect = heroMedia.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    heroPhoto.style.transform = `scale(1.045) translate3d(${x * -8}px, ${y * -8}px, 0)`;
  });
  heroMedia?.addEventListener('pointerleave', () => {
    heroPhoto.style.transform = 'scale(1.02) translate3d(0, 0, 0)';
  });
}

$('#year').textContent = new Date().getFullYear();

// Product visualizations are authored as real, lightweight Three.js meshes.
// They are intentionally illustrative mockups because the source images only
// show a single view of each item and cannot reveal hidden geometry.
try {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js');
  const models = [];

  function makeArtwork(title, subline, options = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = options.background || '#f7f5ef';
    ctx.fillRect(0, 0, 1024, 1024);
    if (options.accent) {
      ctx.fillStyle = options.accent;
      ctx.fillRect(0, 0, 1024, 118);
      ctx.fillRect(0, 890, 1024, 134);
    }
    ctx.fillStyle = options.ink || '#212027';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 82px Arial, sans-serif';
    ctx.fillText('K-PICK', 512, options.accent ? 310 : 405);
    ctx.font = '600 30px Arial, sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillText('TRADING CORP.', 512, options.accent ? 385 : 480);
    ctx.fillStyle = options.accent || '#275880';
    ctx.fillRect(250, options.accent ? 435 : 535, 524, 5);
    ctx.fillStyle = options.ink || '#37333a';
    ctx.font = '500 25px Arial, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(title.toUpperCase(), 512, options.accent ? 520 : 620);
    ctx.font = '400 19px Arial, sans-serif';
    ctx.fillText(subline.toUpperCase(), 512, options.accent ? 570 : 667);
    if (options.mark) {
      ctx.fillStyle = options.mark;
      ctx.beginPath();
      ctx.arc(512, 770, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '700 27px Arial, sans-serif';
      ctx.fillText('KP', 512, 771);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }

  function standardMaterial(color, roughness = .8, extra = {}) {
    return new THREE.MeshStandardMaterial({ color, roughness, ...extra });
  }

  function addBox(parent, size, material, position) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addBar(parent, start, end, radius, material, radialSegments = 10) {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(b, a);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), radialSegments), material);
    mesh.position.copy(a).add(b).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addFrontPrint(parent, width, height, texture, position, materialOptions = {}) {
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: .82,
      side: THREE.DoubleSide,
      ...materialOptions
    });
    const face = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    face.position.set(...position);
    parent.add(face);
    return face;
  }

  function createTote() {
    const group = new THREE.Group();
    const cloth = standardMaterial('#e5dfd3', .96);
    const shape = new THREE.Shape();
    shape.moveTo(-.95, -.85);
    shape.lineTo(.95, -.85);
    shape.lineTo(.82, .85);
    shape.quadraticCurveTo(.8, .93, .7, .93);
    shape.lineTo(-.7, .93);
    shape.quadraticCurveTo(-.8, .93, -.82, .85);
    shape.closePath();
    const bodyGeometry = new THREE.ExtrudeGeometry(shape, { depth: .22, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .035, bevelThickness: .035 });
    bodyGeometry.translate(0, 0, -.11);
    const body = new THREE.Mesh(bodyGeometry, cloth);
    body.castShadow = true;
    group.add(body);
    const print = makeArtwork('Corporate giveaway', 'Event collection', { background: '#f7f5ef', accent: '#234c6d', mark: '#26764f' });
    addFrontPrint(group, 1.2, 1.15, print, [0, -.04, .151]);
    const strap = standardMaterial('#b9ad9c', .91);
    for (const x of [-.49, .49]) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x - .16, .68, .1), new THREE.Vector3(x - .16, 1.06, .1),
        new THREE.Vector3(x, 1.23, .1), new THREE.Vector3(x + .16, 1.06, .1),
        new THREE.Vector3(x + .16, .68, .1)
      ]);
      const handle = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, .055, 8, false), strap);
      handle.castShadow = true;
      group.add(handle);
    }
    return group;
  }

  function createNotebook() {
    const group = new THREE.Group();
    const cover = standardMaterial('#245071', .65);
    const pages = standardMaterial('#f4f0e7', .96);
    addBox(group, [2.12, .17, 2.75], pages, [0, 0, 0]);
    addBox(group, [2.2, .095, 2.82], cover, [0, .105, 0]);
    const artwork = makeArtwork('Notes & ideas', 'Corporate stationery', { background: '#f3efe5', accent: '#215071', ink: '#1f2024' });
    const notebookArtwork = addFrontPrint(group, 1.82, 2.15, artwork, [0, .157, -.04], { side: THREE.FrontSide });
    notebookArtwork.rotation.x = -Math.PI / 2;
    const spine = standardMaterial('#1a3b55', .68);
    addBox(group, [.12, .1, 2.75], spine, [-1.09, .16, 0]);
    for (let z = -.95; z <= .96; z += .28) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.09, .018, 6, 18, Math.PI), standardMaterial('#b9b7b0', .35, { metalness: .72 }));
      ring.rotation.x = Math.PI / 2;
      ring.rotation.z = Math.PI / 2;
      ring.position.set(-1.17, .17, z);
      group.add(ring);
    }
    const pen = new THREE.Group();
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, 2.2, 16), standardMaterial('#eeeae1', .38, { metalness: .18 }));
    barrel.position.y = 0;
    pen.add(barrel);
    const clip = new THREE.Mesh(new THREE.BoxGeometry(.018, .75, .03), standardMaterial('#295579', .3, { metalness: .25 }));
    clip.position.set(.045, .58, .018);
    pen.add(clip);
    const nib = new THREE.Mesh(new THREE.ConeGeometry(.044, .15, 16), standardMaterial('#a7a39b', .28, { metalness: .75 }));
    nib.rotation.z = Math.PI;
    nib.position.y = -1.15;
    pen.add(nib);
    pen.position.set(1.3, .25, .15);
    pen.rotation.z = -.08;
    group.add(pen);
    return group;
  }

  function createBottle() {
    const group = new THREE.Group();
    const glass = standardMaterial('#e7eee9', .18, { metalness: .04, transparent: true, opacity: .62 });
    const profile = [
      new THREE.Vector2(.22, -1.2), new THREE.Vector2(.34, -1.15), new THREE.Vector2(.38, -.96),
      new THREE.Vector2(.38, .35), new THREE.Vector2(.34, .54), new THREE.Vector2(.2, .64),
      new THREE.Vector2(.18, .94), new THREE.Vector2(.22, 1.02), new THREE.Vector2(.22, 1.1)
    ];
    const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 56), glass);
    body.castShadow = true;
    group.add(body);
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(.31, .33, .72, 48), standardMaterial('#eef1eb', .31, { transparent: true, opacity: .55 }));
    liquid.position.y = -.64;
    group.add(liquid);
    const label = makeArtwork('Fresh & clean', 'Daily essentials', { background: '#f7f5ef', accent: '#245071', mark: '#347c59' });
    const labelMaterial = new THREE.MeshStandardMaterial({ map: label, roughness: .58, side: THREE.DoubleSide });
    const labelMesh = new THREE.Mesh(new THREE.CylinderGeometry(.388, .388, .72, 64, 1, true), labelMaterial);
    labelMesh.position.y = -.12;
    group.add(labelMesh);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(.19, .2, .3, 40), standardMaterial('#d7ded8', .24, { metalness: .2 }));
    neck.position.y = 1.04;
    group.add(neck);
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(.25, .25, .12, 40), standardMaterial('#ece9df', .24, { metalness: .15 }));
    collar.position.y = 1.17;
    group.add(collar);
    const pump = new THREE.Mesh(new THREE.CylinderGeometry(.105, .105, .27, 24), standardMaterial('#f1efe9', .2, { metalness: .1 }));
    pump.position.y = 1.36;
    group.add(pump);
    const head = new THREE.Mesh(new THREE.BoxGeometry(.38, .14, .17), standardMaterial('#f4f2eb', .19, { metalness: .08 }));
    head.position.set(.11, 1.49, 0);
    group.add(head);
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(.045, .06, .17, 16), standardMaterial('#f4f2eb', .2));
    nozzle.rotation.z = -Math.PI / 2;
    nozzle.position.set(.33, 1.49, 0);
    group.add(nozzle);
    return group;
  }

  function createCart() {
    const group = new THREE.Group();
    const white = standardMaterial('#e8e6df', .42, { metalness: .08 });
    const blue = standardMaterial('#234e70', .48);
    const dark = standardMaterial('#44464a', .4, { metalness: .25 });
    const top = addBox(group, [2.15, .15, 1.15], white, [0, .18, .1]);
    top.material = white;
    addBox(group, [1.96, 1.18, .11], blue, [0, 1.0, .32]);
    const screen = makeArtwork('Health & care', 'Product information', { background: '#f5f2ea', accent: '#225174', mark: '#317651' });
    addFrontPrint(group, 1.55, .84, screen, [0, 1.0, .385], { side: THREE.FrontSide });
    addBox(group, [1.68, .11, .62], white, [0, -.28, .16]);
    for (const x of [-.89, .89]) {
      addBar(group, [x, -.82, -.25], [x, -.02, -.25], .045, dark);
      addBar(group, [x, -.82, .5], [x, -.02, .5], .045, dark);
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, .12, 24), dark);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, -.78, .12);
      group.add(wheel);
    }
    for (const x of [-.72, .72]) addBar(group, [x, -.2, -.14], [x, -.2, .44], .028, dark);
    return group;
  }

  function createBanner() {
    const group = new THREE.Group();
    const frame = standardMaterial('#65646a', .32, { metalness: .7 });
    const cloth = standardMaterial('#f4f1e9', .92, { side: THREE.DoubleSide });
    const art = makeArtwork('Your health, supported', 'Care that connects', { background: '#f3efe4', accent: '#b93637', mark: '#245c86' });
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(1.82, 2.65), cloth);
    banner.position.set(0, .1, .02);
    group.add(banner);
    addFrontPrint(group, 1.79, 2.62, art, [0, .1, .035]);
    addBar(group, [-.99, -1.24, .18], [0, .05, -.3], .025, frame);
    addBar(group, [.99, -1.24, .18], [0, .05, -.3], .025, frame);
    addBar(group, [-.99, -1.24, -.18], [0, .05, .3], .025, frame);
    addBar(group, [.99, -1.24, -.18], [0, .05, .3], .025, frame);
    addBar(group, [-.99, 1.42, 0], [-.99, -1.28, 0], .026, frame);
    addBar(group, [.99, 1.42, 0], [.99, -1.28, 0], .026, frame);
    addBar(group, [-1.02, -1.28, .22], [1.02, -1.28, .22], .035, frame);
    addBar(group, [-.8, -1.31, -.35], [.8, -1.31, -.35], .04, frame);
    return group;
  }

  function createCard() {
    const group = new THREE.Group();
    const paper = standardMaterial('#fbfaf6', .79);
    const baseGeometry = new THREE.BoxGeometry(2.55, .12, 1.55);
    const base = new THREE.Mesh(baseGeometry, paper);
    base.castShadow = true;
    group.add(base);
    const under = addBox(group, [2.5, .1, 1.5], standardMaterial('#e4dfd4', .88), [.03, -.13, -.025]);
    under.rotation.y = -.035;
    const cardArt = makeArtwork('Laila Mae Almario', 'Social media & e-commerce', { background: '#f7f4ed', accent: '#40244b', ink: '#222027' });
    const cardFace = addFrontPrint(group, 2.48, 1.5, cardArt, [0, .061, 0], { side: THREE.FrontSide });
    cardFace.rotation.x = -Math.PI / 2;
    const corner = addBox(group, [.46, .012, .46], standardMaterial('#f0ece3', .85), [.88, .07, -.48]);
    corner.rotation.y = -.2;
    return group;
  }

  const factories = { tote: createTote, notebook: createNotebook, bottle: createBottle, cart: createCart, banner: createBanner, card: createCard };
  const viewportObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.__model?.render();
      if (entry.target.__model) entry.target.__model.visible = entry.isIntersecting;
    });
  }, { rootMargin: '160px' });

  for (const wrapper of $$('.model-wrap')) {
    const canvas = $('canvas', wrapper);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.13;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
    camera.position.set(4.1, 2.7, 5.4);
    camera.lookAt(0, .05, 0);
    scene.add(new THREE.HemisphereLight(0xfff8eb, 0x77717b, 2.0));
    const key = new THREE.DirectionalLight(0xfff2dc, 3.1);
    key.position.set(-3.5, 6, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xd9e4ff, 1.35);
    fill.position.set(4, 2, -4);
    scene.add(fill);

    const pivot = new THREE.Group();
    pivot.add(factories[wrapper.dataset.model]());
    scene.add(pivot);
    const groundShadow = new THREE.Mesh(new THREE.CircleGeometry(1.65, 48), new THREE.MeshBasicMaterial({ color: 0x827a80, transparent: true, opacity: .1, depthWrite: false }));
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -1.42;
    groundShadow.scale.set(1.15, .56, 1);
    scene.add(groundShadow);

    const state = { renderer, scene, camera, pivot, wrapper, visible: false, spinning: false, dragging: false };
    state.render = () => {
      const width = Math.max(1, wrapper.clientWidth);
      const height = Math.max(1, wrapper.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    wrapper.__model = state;
    models.push(state);
    wrapper.classList.add('ready');
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'application');
    canvas.setAttribute('aria-label', `${wrapper.getAttribute('aria-label')}. Drag horizontally to turn it all the way around; drag vertically to tilt. Use arrow keys when focused.`);
    viewportObserver.observe(wrapper);

    const autoButton = $('.spin-toggle', wrapper);
    autoButton.addEventListener('click', event => {
      event.stopPropagation();
      state.spinning = !state.spinning;
      autoButton.setAttribute('aria-pressed', String(state.spinning));
      autoButton.textContent = state.spinning ? 'Pause rotation' : 'Auto rotate';
      state.render();
    });
    canvas.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      state.dragging = true;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.lastTime = performance.now();
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointermove', event => {
      if (!state.dragging) return;
      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;
      const now = performance.now();
      const dt = Math.max(1, now - state.lastTime);
      pivot.rotation.y += dx * .012;
      pivot.rotation.x = THREE.MathUtils.clamp(pivot.rotation.x + dy * .009, -.75, .75);
      state.velocity = dx * .012 / dt;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.lastTime = now;
      state.render();
    });
    const release = () => { state.dragging = false; };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('keydown', event => {
      const step = event.shiftKey ? .35 : .14;
      if (event.key === 'ArrowLeft') pivot.rotation.y -= step;
      else if (event.key === 'ArrowRight') pivot.rotation.y += step;
      else if (event.key === 'ArrowUp') pivot.rotation.x = THREE.MathUtils.clamp(pivot.rotation.x - step, -.75, .75);
      else if (event.key === 'ArrowDown') pivot.rotation.x = THREE.MathUtils.clamp(pivot.rotation.x + step, -.75, .75);
      else return;
      event.preventDefault();
      state.render();
    });
    new ResizeObserver(() => { if (state.visible) state.render(); }).observe(wrapper);
    state.render();
  }

  let previousFrame = 0;
  function animate(now) {
    const active = models.some(model => model.visible && model.spinning && !model.dragging);
    if (!active) return;
    const dt = Math.min(.04, (now - previousFrame) / 1000 || 0);
    previousFrame = now;
    for (const model of models) {
      if (model.visible && model.spinning && !model.dragging) {
        model.pivot.rotation.y += dt * .42;
        model.render();
      }
    }
    requestAnimationFrame(animate);
  }
  const autoSpinObserver = new MutationObserver(() => {
    if (models.some(model => model.visible && model.spinning)) requestAnimationFrame(animate);
  });
  models.forEach(model => autoSpinObserver.observe($('.spin-toggle', model.wrapper), { attributes: true, attributeFilter: ['aria-pressed'] }));
} catch (error) {
  console.error('3D previews could not be initialized', error);
  $$('.model-loading').forEach(label => { label.textContent = '3D view unavailable in this browser'; });
}
