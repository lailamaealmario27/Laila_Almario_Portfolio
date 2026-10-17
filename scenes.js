/*
 * The scroll choreography.
 *
 * Headings wipe up as they arrive, groups of things enter one after another, and the
 * two photographed areas drift against the scroll. That is the whole of it: no pinning,
 * no scroll hijacking, no snapping. Native scrolling is never touched, in either
 * direction, and nothing here waits on a loading screen.
 *
 * The one rule that keeps this safe: JAVASCRIPT HIDES, JAVASCRIPT REVEALS. Nothing on
 * the page is hidden by the stylesheet alone. If this module never loads, never runs,
 * or throws halfway through, every section stays exactly as visible as it was before
 * it existed. That is why the hiding classes are added here rather than written into
 * the markup.
 *
 * Reduced motion skips the module entirely, which leaves the page static and complete.
 */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Each entry staggers its children as the container arrives. `step` is the gap between
   them; `rise` is how far they travel. Selectors that match nothing are skipped, so
   this list can name things that only exist on some pages. */
const GROUPS = [
  { box: '.stage-inner', items: '.stage-eyebrow > span, .stage-line > span, .stage-intro > span, .stage-cta', step: 110 },
  { box: '.hero-proof', items: '.proof-item', step: 80 },
  { box: '.capabilities', items: 'span', step: 55, rise: '.6rem' },
  { box: '.photo-pair', items: 'figure', step: 140 },
  { box: '.experience-list', items: '.experience-item', step: 90 },
  { box: '.work-tabs', items: '.work-tab', step: 45, rise: '.5rem' },
  { box: '.media-rail', items: '.media-card', step: 90 },
  { box: '.listing-grid', items: '.listing-card', step: 70 },
  { box: '.process', items: 'li', step: 55, rise: '.5rem' },
  { box: '.skills-grid', items: '.skill-group', step: 85 },
  { box: '.kaia-details', items: '.kaia-card', step: 70 },
  { box: '.kaia-day', items: 'li', step: 60, rise: '.5rem' },
  { box: '.contact-links', items: 'a', step: 60, rise: '.5rem' },
  { box: '.footer-inner', items: 'span', step: 70, rise: '.4rem' }
];

/* Headings get the wipe rather than the rise: the line uncovers itself. */
const HEADINGS = [
  '.hero h1',
  '.section-heading h2',
  '.project-intro h3',
  '.print-sticky h2',
  '.contact-copy h2',
  '.about-copy h3'
];

/* The two places with photography big enough for the drift to read. Both sit inside a
   wrapper with overflow: hidden, which is what stops the movement showing an edge. */
const PARALLAX = '.hero-photo img, .photo-pair figure img';
const DRIFT = 18;

/* The back-to-top control is not an animation and is wanted either way. */
backToTop();
if (!reduceMotion) run();

function run() {
  try {
    choreograph();
    headings();
    parallax();
    scrollHint();
  } catch (error) {
    /* Anything unexpected leaves the page visible rather than half-revealed. */
    console.warn('[scenes] choreography unavailable', error);
    document.querySelectorAll('.scene-item, .scene-text').forEach(node => {
      node.classList.remove('scene-item', 'scene-text');
    });
  }
}

/* Toggled rather than latched, so an entrance plays again on the way back up. The
   bottom margin means a thing resets only once it is properly gone, not when it grazes
   the edge of the viewport. */
function watch(box, apply) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => apply(entry.isIntersecting));
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  observer.observe(box);
}

function choreograph() {
  GROUPS.forEach(({ box, items, step = 70, rise }) => {
    document.querySelectorAll(box).forEach(container => {
      const children = [...container.querySelectorAll(items)];
      if (!children.length) return;
      children.forEach((child, index) => {
        child.classList.add('scene-item');
        /* Capped: a rail of nine cards must not make the last one wait a second. */
        child.style.setProperty('--delay', `${Math.min(index, 7) * step}ms`);
        if (rise) child.style.setProperty('--rise', rise);
      });
      watch(container, on => children.forEach(child => child.classList.toggle('is-in', on)));
    });
  });
}

function headings() {
  document.querySelectorAll(HEADINGS.join(',')).forEach(heading => {
    heading.classList.add('scene-text');
    watch(heading, on => heading.classList.toggle('is-in', on));
  });
}

/* The landing invites a scroll; once the visitor has taken it, the invitation goes. */
function scrollHint() {
  const hint = document.querySelector('[data-stage-scroll]');
  if (!hint) return;
  const sync = () => {
    hint.style.opacity = window.scrollY > window.innerHeight * 0.25 ? '0' : '';
  };
  addEventListener('scroll', sync, { passive: true });
  sync();
}

/* Appears once there is something to come back from, and stays out of the way of
   anything holding the screen. */
function backToTop() {
  const button = document.querySelector('[data-to-top]');
  if (!button) return;
  let shown = false;
  const sync = () => {
    const should = window.scrollY > window.innerHeight * 1.1 &&
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

function parallax() {
  const items = [...document.querySelectorAll(PARALLAX)]
    .map(image => ({ image, wrap: image.parentElement }))
    .filter(item => item.wrap);
  if (!items.length) return;
  items.forEach(item => { item.image.dataset.parallax = ''; });

  let queued = false;
  const update = () => {
    queued = false;
    const height = window.innerHeight;
    for (const { image, wrap } of items) {
      const rect = wrap.getBoundingClientRect();
      /* Off screen costs nothing: no reads turn into writes. */
      if (rect.bottom < -240 || rect.top > height + 240) continue;
      const progress = (rect.top + rect.height / 2 - height / 2) / height;
      image.style.setProperty('--parallax', `${(-progress * DRIFT).toFixed(1)}px`);
    }
  };

  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
}
