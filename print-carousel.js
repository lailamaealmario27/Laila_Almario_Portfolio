/*
 * Print-production carousel.
 *
 * Shows one product at a time and leaves the 3D viewers in print-3d.js completely
 * alone: the slides keep their existing markup, the models keep their own drag-to-
 * rotate handling, and this module only moves the track around them.
 *
 * The one rule that makes the two coexist: a pointer that starts on a product canvas
 * (or on any control) belongs to the viewer, so the carousel never claims it. A
 * pointer that starts anywhere else in the slide is a swipe.
 */
const root = document.querySelector('[data-print-carousel]');
if (root) {
  try {
    init(root);
  } catch (error) {
    console.warn('[print-carousel] falling back to the stacked gallery', error);
  }
}

function init(carousel) {
  const track = carousel.querySelector('.print-track');
  const viewport = carousel.querySelector('.print-viewport');
  const dotsHost = carousel.querySelector('[data-print-dots]');
  const live = carousel.querySelector('[data-print-live]');
  const prev = carousel.querySelector('[data-print-prev]');
  const next = carousel.querySelector('[data-print-next]');
  const slides = [...track.querySelectorAll('.print-card')];
  if (slides.length < 2) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsInert = 'inert' in HTMLElement.prototype;
  const SWIPE = 48;          // px of horizontal travel that commits to a slide change
  let index = 0;
  let dragging = null;

  // Scoped to the card's own caption: the product viewer appends a dialog that carries
  // a figcaption of its own, and that one must not be mistaken for the product label.
  const titleOf = slide =>
    slide.querySelector(':scope > figcaption strong')?.textContent?.trim() || 'Product';

  const dots = slides.map((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'print-dot';
    dot.setAttribute('aria-label', `Show ${titleOf(slide)}`);
    dot.addEventListener('click', () => go(i));
    dotsHost.append(dot);

    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${slides.length}: ${titleOf(slide)}`);
    return dot;
  });

  /** Park the viewers that are off to the side so they stop drawing. */
  function park(slide, parked) {
    const stage = slide.querySelector('.product-stage');
    if (!stage) return;
    if (parked) stage.dataset.parked = 'true';
    else delete stage.dataset.parked;
    stage.dispatchEvent(new CustomEvent('product:parked'));
  }

  /** Ask the neighbouring products to load, so moving between slides feels instant. */
  function preloadAround(i) {
    [i, (i + 1) % slides.length, (i - 1 + slides.length) % slides.length].forEach(n => {
      slides[n].querySelector('.product-stage')
        ?.dispatchEvent(new CustomEvent('product:preload'));
    });
  }

  function paint(offset = 0) {
    const shift = -index * 100;
    track.style.transform = offset
      ? `translate3d(calc(${shift}% + ${offset}px), 0, 0)`
      : `translate3d(${shift}%, 0, 0)`;
  }

  function go(target, { focus = false } = {}) {
    const wrapped = (target % slides.length + slides.length) % slides.length;
    index = wrapped;
    paint();
    slides.forEach((slide, i) => {
      const active = i === wrapped;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      if (supportsInert) slide.inert = !active;
      park(slide, !active);
    });
    dots.forEach((dot, i) => {
      if (i === wrapped) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    live.textContent = `${titleOf(slides[wrapped])}, ${wrapped + 1} of ${slides.length}`;
    preloadAround(wrapped);
    if (focus) slides[wrapped].querySelector('.product-canvas')?.focus({ preventScroll: true });
  }

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));

  // Arrow keys move the carousel, except inside a product canvas where they orbit
  // the model, and except on the dots where they would fight the buttons.
  carousel.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (event.target.closest('.product-canvas')) return;
    event.preventDefault();
    go(index + (event.key === 'ArrowRight' ? 1 : -1));
  });

  // Swipe. Ignored when the gesture starts on the model or on any control, so
  // rotating a product never drags the carousel with it.
  const claimed = target => target.closest(
    '.product-canvas, .product-bar, .product-dialog, button, a, input, textarea, select');

  viewport.addEventListener('pointerdown', event => {
    if (dragging || event.button !== 0 || claimed(event.target)) return;
    dragging = { id: event.pointerId, x: event.clientX, y: event.clientY, axis: null };
  });

  viewport.addEventListener('pointermove', event => {
    if (!dragging || event.pointerId !== dragging.id) return;
    const dx = event.clientX - dragging.x;
    const dy = event.clientY - dragging.y;
    if (!dragging.axis) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      // Settle on one axis once, so a mostly-vertical gesture stays a page scroll.
      dragging.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (dragging.axis === 'x') {
        carousel.classList.add('is-dragging');
        // The pointer can already be gone (cancelled, or a synthetic event); losing
        // capture only costs us the drag preview, so it must not break the swipe.
        try { viewport.setPointerCapture(dragging.id); } catch { /* not capturable */ }
      }
    }
    if (dragging.axis !== 'x') return;
    event.preventDefault();
    const edge = (index === 0 && dx > 0) || (index === slides.length - 1 && dx < 0);
    paint(reduceMotion ? 0 : dx * (edge ? 0.32 : 0.85));
  });

  function endDrag(event) {
    if (!dragging || event.pointerId !== dragging.id) return;
    const dx = event.clientX - dragging.x;
    const axis = dragging.axis;
    if (viewport.hasPointerCapture?.(dragging.id)) viewport.releasePointerCapture(dragging.id);
    dragging = null;
    carousel.classList.remove('is-dragging');
    if (axis !== 'x') return;
    if (Math.abs(dx) > SWIPE) go(index + (dx < 0 ? 1 : -1));
    else paint();
  }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  // Belt and braces for browsers without `overflow: clip`: if anything manages to
  // scroll the viewport (a focus() inside the track, a scrollIntoView), pin it back,
  // otherwise the track would sit out of step with its transform.
  viewport.addEventListener('scroll', () => {
    if (viewport.scrollLeft || viewport.scrollTop) {
      viewport.scrollLeft = 0;
      viewport.scrollTop = 0;
    }
  }, { passive: true });

  // Only switch the stacked gallery into a carousel once the behaviour is wired up.
  carousel.classList.add('is-ready');
  go(0);
}
