/*
 * The cinematic intro.
 *
 * The overlay is already on screen by the time this runs: an inline script in <head>
 * adds `intro-armed` to <html> before first paint, so the portfolio never flashes
 * behind it. That script also sets a safety timer which disarms everything if this
 * module never arrives -- the first thing done here is to cancel it, which is the only
 * way the intro is ever allowed to stay up.
 *
 * Nothing about the portfolio underneath is rebuilt or moved. While the intro is up the
 * page is inert and the scroll is locked; when it leaves, both are handed straight back
 * and every existing section, observer and control behaves exactly as before.
 */
const ENTER_STAGGER = 95;
const LEAVE_MS = 620;
const REVEAL_AT = 220;     /* the page starts arriving before the overlay has gone */
const SETTLE_MS = 1020;

const html = document.documentElement;
const intro = document.querySelector('[data-intro]');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Claim the intro from the inline arming script. If this module had failed to load,
   that timer would have disarmed it and the site would be reachable as normal. */
if (window.__introSafety) {
  clearTimeout(window.__introSafety);
  window.__introSafety = null;
}

/* The guide is hidden behind the overlay but would still be reachable by Tab, so she
   goes inert with the rest of the page. Her view *inside* the intro is a different
   element and stays live. */
const inertable = () => [
  document.querySelector('.nav'),
  document.getElementById('main'),
  document.querySelector('.footer'),
  document.querySelector('[data-kaia-guide]')
].filter(Boolean);

function setInert(on) {
  inertable().forEach(node => {
    if ('inert' in node) node.inert = on;
    else if (on) node.setAttribute('aria-hidden', 'true');
    else node.removeAttribute('aria-hidden');
  });
}

if (intro && html.classList.contains('intro-armed')) armIntro();
backToTop();

function armIntro() {
  const cta = intro.querySelector('[data-intro-enter]');
  let leaving = false;

  setInert(true);
  /* A reload can restore a scroll position, which would put the portfolio halfway down
     the moment the overlay lifts. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* Staggered in document order, so the reveal reads top to bottom. */
  intro.querySelectorAll('[data-intro-step]').forEach((node, index) => {
    node.style.setProperty('--step', `${index * ENTER_STAGGER}ms`);
  });

  requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add('is-live')));
  if (cta && !reduceMotion) setTimeout(() => cta.focus({ preventScroll: true }), 900);
  else if (cta) cta.focus({ preventScroll: true });

  cta?.addEventListener('click', leave);
  intro.querySelector('[data-intro-skip]')?.addEventListener('click', leave);
  /* Kaia asks for the portfolio herself once her welcome is finished. */
  document.addEventListener('kaia:dismiss-intro', leave);

  /* Reaching for the page is as good as asking for it -- unless Kaia is mid-sentence,
     in which case a stray wheel would cut her off a word into the welcome. */
  const busy = () => html.dataset.kaiaSpeaking === 'true';

  intro.addEventListener('wheel', event => {
    if (event.deltaY > 2 && !busy()) leave();
  }, { passive: true });

  let touchStart = null;
  intro.addEventListener('touchstart', event => {
    touchStart = event.touches[0]?.clientY ?? null;
  }, { passive: true });
  intro.addEventListener('touchmove', event => {
    if (touchStart === null || busy()) return;
    if (touchStart - (event.touches[0]?.clientY ?? touchStart) > 24) leave();
  }, { passive: true });

  document.addEventListener('keydown', onKey);
  function onKey(event) {
    if (leaving) return;
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      /* The buttons handle their own Enter and Space; this is for everywhere else. */
      if (event.target instanceof HTMLButtonElement) return;
      /* Escape always works; the rest wait for her to finish. */
      if (busy() && event.key !== 'Escape') return;
      event.preventDefault();
      leave();
    }
  }

  function leave() {
    if (leaving) return;
    leaving = true;
    document.removeEventListener('keydown', onKey);
    intro.classList.remove('is-live');
    intro.classList.add('is-leaving');

    const revealAt = reduceMotion ? 0 : REVEAL_AT;
    const settleAt = reduceMotion ? 60 : SETTLE_MS;

    setTimeout(() => html.classList.add('intro-revealing'), revealAt);
    setTimeout(() => {
      html.classList.remove('intro-armed', 'intro-revealing');
      intro.classList.remove('is-leaving');
      setInert(false);
      if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
      /* Hand the keyboard somewhere sensible now that the page is live. */
      document.querySelector('.nav .brand')?.focus({ preventScroll: true });
      document.dispatchEvent(new CustomEvent('intro:left'));
    }, settleAt);
  }
}

/* The way back: a control that only exists once there is something to come back from. */
function backToTop() {
  const button = document.querySelector('[data-to-top]');
  const replay = document.querySelector('[data-intro-replay]');

  if (button) {
    let shown = false;
    const sync = () => {
      const should = window.scrollY > window.innerHeight * 1.1 &&
        !html.classList.contains('intro-armed') &&
        !document.body.classList.contains('dialog-open');
      if (should === shown) return;
      shown = should;
      button.hidden = !should;
    };
    addEventListener('scroll', sync, { passive: true });
    sync();
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  replay?.addEventListener('click', () => {
    if (!intro || html.classList.contains('intro-armed')) return;
    window.scrollTo(0, 0);
    intro.classList.remove('is-leaving');
    html.classList.add('intro-armed');
    armIntro();
  });
}
