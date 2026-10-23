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
 * does not import it, because the gate no longer needs an animation engine to show her
 * gesturing at the card.
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

const inertable = () => [
  document.querySelector('.nav'),
  document.getElementById('main'),
  document.querySelector('.footer'),
  document.querySelector('[data-to-top]')
].filter(Boolean);

function setInert(on) {
  inertable().forEach(node => {
    if ('inert' in node) node.inert = on;
    else if (on) node.setAttribute('aria-hidden', 'true');
    else node.removeAttribute('aria-hidden');
  });
}

if (intro && html.classList.contains('intro-armed')) arm();
backToIntro();

function arm() {
  const scene = intro.querySelector('[data-intro-scene]');
  const kaiaBox = intro.querySelector('[data-intro-kaia]');
  const hello = intro.querySelector('[data-intro-hello]');
  const enters = [...intro.querySelectorAll('[data-intro-enter]')];
  const pose = poseSwitcher(intro.querySelector('[data-intro-figure]'));
  let leaving = false;

  setInert(true);
  /* A reload can restore a scroll position, which would drop the visitor halfway down
     the portfolio the moment the overlay lifts. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add('is-live')));

  /* The button works from the first frame rather than when its animation finishes. */
  enters.forEach(button => button.addEventListener('click', enter));
  setTimeout(() => enters[0]?.focus({ preventScroll: true }), reduceMotion ? 0 : SETTLE_MS);

  document.addEventListener('keydown', onKey);
  function onKey(event) {
    if (leaving) return;
    if (event.key === 'Escape' || event.key === 'Enter') {
      if (event.target instanceof HTMLButtonElement) return;   /* buttons handle their own */
      event.preventDefault();
      enter();
    }
  }

  /* --- the pointer tilt. Card and mascot share one transformed box, so she cannot
         drift away from the card she is gesturing at. --- */
  if (scene && finePointer && !reduceMotion) tilt(scene);

  /* --- hover. She changes to her open-palm pose and says hello. --- */
  if (kaiaBox && hello) {
    const greet = () => { hello.hidden = false; pose.show('greet'); };
    const part = () => { hello.hidden = true; pose.show(REST_POSE); };
    kaiaBox.addEventListener('pointerenter', greet);
    kaiaBox.addEventListener('pointerleave', part);
    kaiaBox.addEventListener('focusin', greet);
    kaiaBox.addEventListener('focusout', part);
    kaiaBox.tabIndex = 0;
    kaiaBox.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); greet(); }
    });
  }

  function enter() {
    if (leaving) return;
    leaving = true;
    enters.forEach(button => { button.disabled = true; });
    document.removeEventListener('keydown', onKey);
    /* A parting gesture, in a pose she actually has. */
    pose.show('cheer');
    intro.classList.remove('is-live');
    intro.classList.add('is-leaving');

    const revealAt = reduceMotion ? 0 : REVEAL_AT;
    const doneAt = reduceMotion ? 60 : LEAVE_MS;

    setTimeout(() => html.classList.add('intro-revealing'), revealAt);
    setTimeout(() => {
      html.classList.remove('intro-armed', 'intro-revealing');
      intro.classList.remove('is-leaving');
      setInert(false);
      if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
      document.querySelector('.nav .brand')?.focus({ preventScroll: true });
      document.dispatchEvent(new CustomEvent('intro:left'));
    }, doneAt);
  }
}

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
  return {
    show(name) {
      if (!frames.has(name) || name === current) return;
      frames.get(current)?.classList.remove('is-on');
      frames.get(name).classList.add('is-on');
      current = name;
    }
  };
}

/* Restrained: four degrees, damped, and it stops as soon as it has settled. */
function tilt(scene) {
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
    scene.style.setProperty('--tilt-x', `${current.x.toFixed(3)}deg`);
    scene.style.setProperty('--tilt-y', `${current.y.toFixed(3)}deg`);
    if (!moving) { running = false; return; }
    requestAnimationFrame(frame);
  };
  const wake = () => { if (!running) { running = true; requestAnimationFrame(frame); } };

  const onMove = event => {
    const across = event.clientX / window.innerWidth - 0.5;
    const down = event.clientY / window.innerHeight - 0.5;
    target.y = across * 2 * MAX;
    target.x = -down * 2 * MAX;
    wake();
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  /* Once the gate is gone there is nothing left to tilt. */
  document.addEventListener('intro:left', () => {
    window.removeEventListener('pointermove', onMove);
    target.x = 0; target.y = 0; wake();
  }, { once: true });
}

/* The way back. */
function backToIntro() {
  document.querySelectorAll('[data-intro-replay]').forEach(button => {
    button.addEventListener('click', () => {
      if (!intro || html.classList.contains('intro-armed')) return;
      window.scrollTo(0, 0);
      intro.classList.remove('is-leaving');
      /* Whatever pose she left in, she is back to resting when the gate reopens. */
      intro.querySelectorAll('[data-pose]').forEach(img => {
        img.classList.toggle('is-on', img.dataset.pose === REST_POSE);
      });
      html.classList.add('intro-armed');
      arm();
    });
  });
}
