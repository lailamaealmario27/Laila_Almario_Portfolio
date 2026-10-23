/*
 * State A — the intro gate.
 *
 * The overlay is already on screen when this runs: an inline script in <head> adds
 * `intro-armed` to <html> before first paint so the portfolio never flashes behind it.
 * That script also sets a safety timer which disarms everything if this module never
 * arrives, and cancelling that timer is the first thing done here. A gate that can jam
 * shut is worse than no gate at all.
 *
 * Two states, not two scroll positions. While State A is up the page is inert and the
 * scroll is locked; entering hands both back and the overlay is gone, not scrolled past.
 *
 * Kaia is three of her own supplied poses stacked on top of each other, cross-faded by
 * CSS. Nothing here rotates or distorts her to stand in for a pose she does not have.
 * kaia.js is untouched and still drives the packed sprite in Selected work; this file
 * does not import it, because the gate needs no animation engine to show a still.
 *
 * Listeners are attached once, in wire(). The gate can be reopened from the footer, and
 * an earlier version re-attached everything each time it was -- which quietly stacked a
 * second set of handlers on every replay.
 */

/* The brief's timeline: background, card at 0.5s, Kaia at 1.0s, card text at 1.8s,
   idle from 2.2s. The CSS carries the delays; these are the two moments JS needs. */
const SETTLE_MS = 2400;
const LEAVE_MS = 1000;
const REVEAL_AT = 240;
const REST_POSE = 'present';

const html = document.documentElement;
const intro = document.querySelector('[data-intro]');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* Claim the gate from the arming script. If this module had failed to load, that timer
   would have disarmed it and the site would be reachable as normal. */
if (window.__introSafety) {
  clearTimeout(window.__introSafety);
  window.__introSafety = null;
}

const armed = () => html.classList.contains('intro-armed');

let leaving = false;
let dragging = false;
let settleTimer = null;

const scene = intro?.querySelector('[data-intro-scene]');
const kaiaBox = intro?.querySelector('[data-intro-kaia]');
const hello = intro?.querySelector('[data-intro-hello]');
const enters = intro ? [...intro.querySelectorAll('[data-intro-enter]')] : [];
const pose = poseSwitcher(intro?.querySelector('[data-intro-figure]'));
const kaiaDrag = draggable(kaiaBox);

if (intro) {
  wire();
  if (armed()) open();
}

/* ------------------------------------------------------------------ the two states */

function open() {
  leaving = false;
  pose.reset();
  kaiaDrag.reset();
  enters.forEach(button => { button.disabled = false; });
  setInert(true);
  /* A reload can restore a scroll position, which would drop the visitor halfway down
     the portfolio the moment the overlay lifts. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  intro.classList.remove('is-leaving');
  requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add('is-live')));

  clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    if (armed() && !leaving) enters[0]?.focus({ preventScroll: true });
  }, reduceMotion ? 0 : SETTLE_MS);
}

function enter() {
  if (leaving || !armed()) return;
  leaving = true;
  clearTimeout(settleTimer);
  enters.forEach(button => { button.disabled = true; });
  /* A parting gesture, in a pose she actually has. */
  pose.show('cheer');
  intro.classList.remove('is-live');
  intro.classList.add('is-leaving');

  setTimeout(() => html.classList.add('intro-revealing'), reduceMotion ? 0 : REVEAL_AT);
  setTimeout(() => {
    html.classList.remove('intro-armed', 'intro-revealing');
    intro.classList.remove('is-leaving');
    setInert(false);
    if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
    document.querySelector('.nav .brand')?.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('intro:left'));
  }, reduceMotion ? 60 : LEAVE_MS);
}

/* ------------------------------------------------------------------ wiring, once */

function wire() {
  /* The buttons work from the first frame rather than when the animation finishes. */
  enters.forEach(button => button.addEventListener('click', enter));

  document.addEventListener('keydown', event => {
    if (leaving || !armed()) return;
    if (event.key !== 'Escape' && event.key !== 'Enter') return;
    /* Buttons handle their own activation, and Kaia handles her own keys. */
    if (event.target instanceof HTMLButtonElement) return;
    event.preventDefault();
    enter();
  });

  /* The pointer tilt. Card and mascot share one transformed box, so she cannot drift
     away from the card she is gesturing at. */
  if (scene && finePointer && !reduceMotion) tilt(scene);

  /* Hover: she changes to her open-palm pose and says hello. */
  if (kaiaBox && hello) {
    const greet = () => { hello.hidden = false; pose.show('greet'); };
    const part = () => {
      if (dragging) return;              /* she keeps greeting while being carried */
      hello.hidden = true;
      pose.show(REST_POSE);
    };
    kaiaBox.addEventListener('pointerenter', greet);
    kaiaBox.addEventListener('pointerleave', part);
    kaiaBox.addEventListener('focusin', greet);
    kaiaBox.addEventListener('focusout', part);
    kaiaBox.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      /* Without this the document handler above sees the same Enter and leaves the
         gate, so greeting her would have skipped the intro. */
      event.stopPropagation();
      greet();
    });
  }

  /* The way back. */
  document.querySelectorAll('[data-intro-replay]').forEach(button => {
    button.addEventListener('click', () => {
      if (!intro || armed()) return;
      window.scrollTo(0, 0);
      html.classList.add('intro-armed');
      open();
    });
  });
}

/* ------------------------------------------------------------------ Kaia */

/*
 * One pose visible at a time.
 *
 * The poses sit on top of each other and only their opacity changes, so the swap costs
 * nothing and she never shifts position. Whichever she is in carries her alt text; the
 * rest are aria-hidden, so a screen reader meets her once rather than three times.
 */
function poseSwitcher(figure) {
  const frames = new Map();
  if (figure) {
    figure.querySelectorAll('[data-pose]').forEach(img => frames.set(img.dataset.pose, img));
  }
  let current = REST_POSE;
  const show = name => {
    if (!frames.has(name) || name === current) return;
    frames.get(current)?.classList.remove('is-on');
    frames.get(name).classList.add('is-on');
    current = name;
  };
  return { show, reset: () => show(REST_POSE) };
}

/*
 * Kaia can be picked up and put down anywhere.
 *
 * The offset goes into two custom properties rather than into `transform`, because her
 * resting placement is already a transform that the stylesheet owns -- and it differs
 * between desktop and phone. Composing in CSS means the drag never has to know which
 * layout is in force, and she returns to the right home on either.
 *
 * Her position is measured once when she is picked up, not on every move: reading
 * layout inside a pointermove is how a drag starts costing more than it should.
 */
function draggable(box) {
  if (!box) return { reset() {} };

  const STEP = 8;          /* arrow key */
  const BIG = 32;          /* shift + arrow key */
  const EDGE = 10;         /* keep this much of the viewport around her */

  let x = 0, y = 0;                 /* where she is, relative to home */
  let fromX = 0, fromY = 0;         /* where she was when picked up */
  let grabX = 0, grabY = 0;         /* where the pointer was when it picked her up */
  let base = null;                  /* her untranslated box */
  let pointer = null;

  const apply = () => {
    box.style.setProperty('--drag-x', `${x.toFixed(1)}px`);
    box.style.setProperty('--drag-y', `${y.toFixed(1)}px`);
  };

  const measure = () => {
    const r = box.getBoundingClientRect();
    return { left: r.left - x, top: r.top - y, w: r.width, h: r.height };
  };

  /* She can go anywhere on the screen, but never off it. */
  const moveTo = (nx, ny) => {
    const b = base || measure();
    x = Math.min(Math.max(nx, EDGE - b.left), window.innerWidth - EDGE - b.w - b.left);
    y = Math.min(Math.max(ny, EDGE - b.top), window.innerHeight - EDGE - b.h - b.top);
    apply();
  };

  box.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointer = event.pointerId;
    dragging = true;
    base = measure();
    fromX = x; fromY = y;
    grabX = event.clientX; grabY = event.clientY;
    box.setPointerCapture(pointer);
    box.classList.add('is-dragging');
    /* Stops the browser's own image-drag ghost. */
    event.preventDefault();
  });

  box.addEventListener('pointermove', event => {
    if (!dragging || event.pointerId !== pointer) return;
    moveTo(fromX + event.clientX - grabX, fromY + event.clientY - grabY);
  });

  const drop = event => {
    if (event.pointerId !== pointer) return;
    dragging = false;
    pointer = null;
    base = null;
    box.classList.remove('is-dragging');
  };
  box.addEventListener('pointerup', drop);
  box.addEventListener('pointercancel', drop);

  /* Arrow keys for anyone not using a pointer. Escape and Home send her home, which is
     quicker than walking her back. */
  box.addEventListener('keydown', event => {
    const step = event.shiftKey ? BIG : STEP;
    const by = {
      ArrowLeft: [-step, 0], ArrowRight: [step, 0],
      ArrowUp: [0, -step], ArrowDown: [0, step]
    }[event.key];
    if (by) {
      event.preventDefault();
      event.stopPropagation();
      base = measure();
      moveTo(x + by[0], y + by[1]);
      base = null;
      return;
    }
    if (event.key === 'Home' || (event.key === 'Escape' && (x || y))) {
      event.preventDefault();
      event.stopPropagation();
      reset();
    }
  });

  /* Double-click puts her back. */
  box.addEventListener('dblclick', reset);

  /* A resize must not leave her stranded outside the window. */
  addEventListener('resize', () => {
    if (!x && !y) return;
    base = measure();
    moveTo(x, y);
    base = null;
  }, { passive: true });

  function reset() {
    x = 0; y = 0;
    apply();
  }

  return { reset };
}

/* ------------------------------------------------------------------ the pointer tilt */

/* Restrained: four degrees, damped, and it stops as soon as it has settled. */
function tilt(target_) {
  const MAX = 4;
  const EASE = 0.1;
  const REST = 0.02;
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let running = false;

  const frame = () => {
    let moving = false;
    for (const key of ['x', 'y']) {
      const delta = target[key] - current[key];
      if (Math.abs(delta) > REST) { current[key] += delta * EASE; moving = true; }
      else current[key] = target[key];
    }
    target_.style.setProperty('--tilt-x', `${current.x.toFixed(3)}deg`);
    target_.style.setProperty('--tilt-y', `${current.y.toFixed(3)}deg`);
    if (!moving) { running = false; return; }
    requestAnimationFrame(frame);
  };
  const wake = () => { if (!running) { running = true; requestAnimationFrame(frame); } };

  window.addEventListener('pointermove', event => {
    /* While she is being carried the tilt stands down. The tilt moves her too, and two
       things moving her at once makes her feel loose rather than held. */
    if (!armed() || dragging) return;
    const across = event.clientX / window.innerWidth - 0.5;
    const down = event.clientY / window.innerHeight - 0.5;
    target.y = across * 2 * MAX;
    target.x = -down * 2 * MAX;
    wake();
  }, { passive: true });

  /* Once the gate is gone there is nothing left to tilt. */
  document.addEventListener('intro:left', () => {
    target.x = 0; target.y = 0; wake();
  });
}

/* ------------------------------------------------------------------ the page behind */

function setInert(on) {
  [
    document.querySelector('.nav'),
    document.getElementById('main'),
    document.querySelector('.footer'),
    document.querySelector('[data-to-top]')
  ].filter(Boolean).forEach(node => {
    if ('inert' in node) node.inert = on;
    else if (on) node.setAttribute('aria-hidden', 'true');
    else node.removeAttribute('aria-hidden');
  });
}
