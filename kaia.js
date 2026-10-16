/*
 * Kaia, the desktop assistant, playing on the portfolio.
 *
 * Her frames come from the assistant itself. kaia/build_kaia_sprite.py packs them onto
 * one sheet, five clips, one per row; this walks a row a column at a time.
 *
 * Loaded in its own module and guarded the same way the showroom is: if the sheet never
 * arrives, the static turnaround view stays on screen and nothing else on the page is
 * affected.
 */

/* Geometry of assets/images/kaia-sprite.webp. Printed by build_kaia_sprite.py -- if a
   clip gains or loses frames there, correct it here. */
const FRAME_W = 140;
const FRAME_H = 215;
const CLIPS = {
  idle: { row: 0, frames: 8, fps: 8, loop: true },
  nod: { row: 1, frames: 6, fps: 10 },
  tilt: { row: 2, frames: 8, fps: 10 },
  hop: { row: 3, frames: 8, fps: 12 },
  dance: { row: 4, frames: 16, fps: 12 }
};
const SHEET = 'assets/images/kaia-sprite.webp';

/* How long she waits before doing something small on her own. */
const BREAK_MIN = 5200;
const BREAK_MAX = 11000;

const stage = document.querySelector('[data-kaia]');
if (stage) boot(stage);

function boot(mount) {
  const canvas = mount.querySelector('[data-kaia-canvas]');
  const still = mount.querySelector('[data-kaia-still]');
  if (!canvas) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const context = canvas.getContext('2d');
  if (!context) return;

  const sheet = new Image();
  sheet.decoding = 'async';
  sheet.addEventListener('error', () => {
    /* The still is the fallback and it is already on screen; just leave it there. */
    console.warn('[kaia] sprite sheet unavailable, keeping the still');
  });
  sheet.addEventListener('load', () => {
    if (still) still.hidden = true;
    canvas.hidden = false;
    resize();
    start();
  });
  sheet.src = SHEET;

  let clip = CLIPS.idle;
  let clipName = 'idle';
  let frame = 0;
  let last = 0;
  let nextBreak = 0;
  let running = false;
  let onScreen = false;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    draw();
  }

  function draw() {
    if (!sheet.complete || !canvas.width) return;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    /* Nearest-neighbour would crawl on a sprite this soft; she is drawn at whatever
       size the layout gives her and smoothed. */
    context.imageSmoothingQuality = 'high';
    context.drawImage(
      sheet,
      frame * FRAME_W, clip.row * FRAME_H, FRAME_W, FRAME_H,
      0, 0, canvas.width, canvas.height
    );
  }

  function play(name) {
    const next = CLIPS[name];
    if (!next || reduceMotion) return;
    clip = next;
    clipName = name;
    frame = 0;
    last = performance.now();
    wake();
  }

  function scheduleBreak(now) {
    nextBreak = now + BREAK_MIN + Math.random() * (BREAK_MAX - BREAK_MIN);
  }

  const tick = now => {
    if (!running) return;
    const step = 1000 / clip.fps;
    if (now - last >= step) {
      last = now - ((now - last) % step);
      frame += 1;
      if (frame >= clip.frames) {
        if (clip.loop) {
          frame = 0;
        } else {
          /* One-shots hand back to the idle loop rather than freezing on a last pose. */
          clip = CLIPS.idle;
          clipName = 'idle';
          frame = 0;
          scheduleBreak(now);
        }
      }
      draw();
    }
    /* A small unprompted movement now and then, so she reads as present rather than
       as a looping graphic. */
    if (clipName === 'idle' && now >= nextBreak) {
      play(Math.random() < 0.55 ? 'nod' : 'tilt');
    }
    requestAnimationFrame(tick);
  };

  function wake() {
    if (running || !onScreen || document.hidden || reduceMotion) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(tick);
  }

  function sleep() { running = false; }

  function start() {
    scheduleBreak(performance.now());
    if (reduceMotion) { draw(); return; }
    wake();
  }

  new IntersectionObserver(entries => {
    onScreen = entries.some(entry => entry.isIntersecting);
    if (onScreen) wake();
    else sleep();
  }, { rootMargin: '80px 0px' }).observe(canvas);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) sleep();
    else wake();
  });

  new ResizeObserver(resize).observe(canvas);

  /* Tapping her, or the buttons beside her, asks for a specific clip. */
  canvas.addEventListener('click', () => play('hop'));
  mount.querySelectorAll('[data-kaia-play]').forEach(button =>
    button.addEventListener('click', () => play(button.dataset.kaiaPlay)));
}
