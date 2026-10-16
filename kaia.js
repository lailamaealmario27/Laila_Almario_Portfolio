/*
 * Kaia, the desktop assistant, playing on the portfolio.
 *
 * Her frames come from the assistant itself. kaia/build_kaia_sprite.py packs them onto
 * one sheet, five clips, one per row; this walks a row a column at a time.
 *
 * There is one Kaia. She can be drawn in more than one place -- her own panel in
 * Selected work, the intro, the floating guide -- but every canvas renders the same
 * character from the same clip and the same frame, out of one shared state. Nothing
 * here creates a second character, and no canvas animates independently of the others.
 *
 * Loaded in its own module and guarded the same way the showroom is: if the sheet never
 * arrives, the static turnaround view stays on screen and nothing else on the page is
 * affected.
 */

/* Geometry of assets/images/kaia-sprite.webp. Printed by build_kaia_sprite.py -- if a
   clip gains or loses frames there, correct it here. */
const FRAME_W = 140;
const FRAME_H = 215;
export const CLIPS = {
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

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ shared state */
const state = {
  clip: CLIPS.idle,
  clipName: 'idle',
  frame: 0,
  last: 0,
  nextBreak: 0,
  running: false,
  /* While she is speaking she keeps gesturing instead of standing still; idle breaks
     are suspended so the two do not fight over the clip. */
  speaking: false
};

const views = new Set();
let sheet = null;
let sheetReady = false;

function loadSheet() {
  if (sheet) return;
  sheet = new Image();
  sheet.decoding = 'async';
  sheet.addEventListener('error', () => {
    console.warn('[kaia] sprite sheet unavailable, keeping the still');
  });
  sheet.addEventListener('load', () => {
    sheetReady = true;
    views.forEach(view => view.reveal());
    state.nextBreak = performance.now() + gap();
    wake();
  });
  sheet.src = SHEET;
}

const gap = () => BREAK_MIN + Math.random() * (BREAK_MAX - BREAK_MIN);

/* ------------------------------------------------------------------- one canvas */
function mount(element) {
  const canvas = element.querySelector('[data-kaia-canvas]');
  const still = element.querySelector('[data-kaia-still]');
  if (!canvas) return null;
  const context = canvas.getContext('2d');
  if (!context) return null;

  const view = {
    element,
    canvas,
    onScreen: false,
    reveal() {
      if (still) still.hidden = true;
      canvas.hidden = false;
      view.resize();
    },
    resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      view.draw();
    },
    draw() {
      if (!sheetReady || !canvas.width) return;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingQuality = 'high';
      context.drawImage(
        sheet,
        state.frame * FRAME_W, state.clip.row * FRAME_H, FRAME_W, FRAME_H,
        0, 0, canvas.width, canvas.height
      );
    }
  };

  new ResizeObserver(() => view.resize()).observe(canvas);
  new IntersectionObserver(entries => {
    view.onScreen = entries.some(entry => entry.isIntersecting);
    wake();
  }, { rootMargin: '80px 0px' }).observe(canvas);

  canvas.addEventListener('click', () => play('hop'));
  element.querySelectorAll('[data-kaia-play]').forEach(button =>
    button.addEventListener('click', () => play(button.dataset.kaiaPlay)));

  views.add(view);
  loadSheet();
  if (sheetReady) view.reveal();
  return view;
}

/* ------------------------------------------------------------------- the loop */
function drawAll() { views.forEach(view => view.draw()); }

function visible() {
  for (const view of views) if (view.onScreen) return true;
  return false;
}

const tick = now => {
  if (!state.running) return;
  const step = 1000 / state.clip.fps;
  if (now - state.last >= step) {
    state.last = now - ((now - state.last) % step);
    state.frame += 1;
    if (state.frame >= state.clip.frames) {
      if (state.clip.loop) {
        state.frame = 0;
      } else {
        /* One-shots hand back to the idle loop rather than freezing on a last pose. */
        state.clip = CLIPS.idle;
        state.clipName = 'idle';
        state.frame = 0;
        state.nextBreak = now + (state.speaking ? 900 : gap());
      }
    }
    drawAll();
  }
  /* A small unprompted movement now and then, so she reads as present rather than as a
     looping graphic. While she is talking the same mechanism keeps her gesturing. */
  if (state.clipName === 'idle' && now >= state.nextBreak) {
    if (state.speaking) play(Math.random() < 0.6 ? 'nod' : 'tilt');
    else play(Math.random() < 0.55 ? 'nod' : 'tilt');
  }
  requestAnimationFrame(tick);
};

function wake() {
  if (state.running || !sheetReady || document.hidden || reduceMotion) return;
  if (!visible()) return;
  state.running = true;
  state.last = performance.now();
  requestAnimationFrame(tick);
}

function play(name) {
  const next = CLIPS[name];
  if (!next) return;
  if (reduceMotion) { state.clip = next; state.frame = 0; drawAll(); return; }
  state.clip = next;
  state.clipName = name;
  state.frame = 0;
  state.last = performance.now();
  wake();
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) state.running = false;
  else wake();
});

/* ------------------------------------------------------------------- the handle */
export const kaia = {
  /** Draw her into another element. Same character, same state, one more canvas. */
  mount,
  /** Play one of her clips once, then fall back to idling. */
  play,
  /** While true she gestures continuously instead of standing still between breaks. */
  set speaking(value) {
    state.speaking = Boolean(value);
    document.documentElement.dataset.kaiaSpeaking = state.speaking ? 'true' : 'false';
    if (state.speaking) play(Math.random() < 0.5 ? 'nod' : 'tilt');
  },
  get speaking() { return state.speaking; },
  get ready() { return sheetReady; }
};

/* Everything already in the markup, including her own panel in Selected work. */
document.querySelectorAll('[data-kaia]').forEach(mount);
