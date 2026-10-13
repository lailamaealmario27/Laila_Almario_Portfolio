/*
 * Selected work rail navigation.
 *
 * The rails are horizontal scrollers, which left the only obvious way through a set
 * being to click a card — and clicking a card opens the lightbox rather than moving
 * along the rail. This adds arrows, dots, drag-to-scroll and keyboard paging so a set
 * can be worked through without ever touching an image.
 *
 * Loaded after app.js and kept in its own module for the same reason print-3d.js is:
 * the galleries are written by app.js and must not be able to fail because of
 * something layered on top of them. Every rail is enhanced independently, so one
 * throwing does not stop the rest.
 */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* A drag that travels less than this is a click: it must still open the lightbox. */
const DRAG_SLOP = 8;

function enhance(rail, index) {
  const cards = [...rail.children].filter(node => node.nodeType === 1);
  if (cards.length < 2) return;

  const label = rail.closest('.work-panel')?.querySelector('h3')?.textContent?.trim() || 'Selected work';
  rail.tabIndex = 0;
  rail.setAttribute('role', 'group');
  rail.setAttribute('aria-roledescription', 'carousel');
  rail.setAttribute('aria-label', label);

  const nav = document.createElement('div');
  nav.className = 'rail-nav';
  const prev = document.createElement('button');
  const next = document.createElement('button');
  const dots = document.createElement('div');
  const live = document.createElement('p');
  prev.type = next.type = 'button';
  prev.className = next.className = 'rail-arrow';
  prev.innerHTML = '&#8249;';
  next.innerHTML = '&#8250;';
  prev.setAttribute('aria-label', `Previous item, ${label}`);
  next.setAttribute('aria-label', `Next item, ${label}`);
  dots.className = 'rail-dots';
  live.className = 'rail-live';
  live.setAttribute('aria-live', 'polite');

  const dotButtons = cards.map((card, cardIndex) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'rail-dot';
    dot.setAttribute('aria-label', `Item ${cardIndex + 1} of ${cards.length}`);
    dot.addEventListener('click', () => scrollToCard(cardIndex));
    dots.append(dot);
    /* The rail is the scroll container, so its own cards are the labelled slides. */
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', `${cardIndex + 1} of ${cards.length}`);
    return dot;
  });

  nav.append(prev, dots, next, live);
  rail.after(nav);

  /* Positions are read from client rects rather than offsetLeft: `.media-card` is
     positioned, so the cards and the rail do not share an offsetParent and the
     offsetLeft values are not in the rail's scroll coordinate space.
     Card widths also vary between the square, portrait and default sets, so the
     current card is measured rather than counted. */
  const currentIndex = () => {
    /* At the far end the last cards all share the viewport, so the leftmost one is no
       longer the one being looked at. Report the last card there, or the dots disagree
       with the arrow that just became disabled. */
    if (rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2) return cards.length - 1;
    if (rail.scrollLeft <= 2) return 0;
    const railLeft = rail.getBoundingClientRect().left;
    let best = 0;
    let bestGap = Infinity;
    cards.forEach((card, cardIndex) => {
      const gap = Math.abs(card.getBoundingClientRect().left - railLeft);
      if (gap < bestGap) { bestGap = gap; best = cardIndex; }
    });
    return best;
  };

  function scrollToCard(target) {
    const card = cards[Math.max(0, Math.min(cards.length - 1, target))];
    if (!card) return;
    /* Instant, by direct scrollLeft assignment. Smooth scrolling was measured against
       this container and silently fails: both `scrollTo({behavior:'smooth'})` and CSS
       `scroll-behavior: smooth` leave it parked at the first snap point, under either
       `mandatory` or `proximity` snapping and with reduced motion off. A control that
       reliably moves beats one that sometimes animates. */
    rail.scrollLeft += card.getBoundingClientRect().left - rail.getBoundingClientRect().left;
    /* Update the controls from here rather than waiting for the scroll event this
       causes. The scroll listener below still covers user-driven swipes and wheels,
       but a button must never depend on an event to show its own result. */
    sync();
  }

  function sync() {
    /* A rail with nothing to scroll past has no use for its controls, but they are
       hidden with `visibility` rather than `display`/`hidden`. Removing them from the
       layout changes the page height, which makes the window scrollbar come and go,
       which changes the viewport width, which resizes the rail, which runs this again:
       a resize loop that pinned the main thread for tens of seconds. Reserving the
       space costs one row and keeps the observer stable. */
    const scrollable = rail.scrollWidth - rail.clientWidth > 2;
    nav.classList.toggle('is-idle', !scrollable);
    if (!scrollable) return;
    const active = currentIndex();
    dotButtons.forEach((dot, dotIndex) => {
      if (dotIndex === active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    /* Rounding in scrollLeft means the ends need a tolerance, or the arrow guarding
       the last card never enables. */
    prev.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2;
    live.textContent = `Item ${active + 1} of ${cards.length}`;
  }

  prev.addEventListener('click', () => scrollToCard(currentIndex() - 1));
  next.addEventListener('click', () => scrollToCard(currentIndex() + 1));

  rail.addEventListener('keydown', event => {
    if (event.target !== rail) return;
    const keys = { ArrowLeft: -1, ArrowRight: 1 };
    if (event.key in keys) {
      event.preventDefault();
      scrollToCard(currentIndex() + keys[event.key]);
    } else if (event.key === 'Home') {
      event.preventDefault();
      scrollToCard(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      scrollToCard(cards.length - 1);
    }
  });

  let scrollTimer = 0;
  rail.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(sync, 90);
  }, { passive: true });

  /* Drag to scroll, for mouse and pen. Touch is left to the browser's own panning,
     which is smoother and keeps the vertical/horizontal gesture split native. */
  let dragging = false;
  let startX = 0;
  let startScroll = 0;
  let moved = 0;

  rail.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || event.button !== 0) return;
    /* Never steal the gesture from a video's own transport controls. */
    if (event.target.closest('video')) return;
    dragging = true;
    moved = 0;
    startX = event.clientX;
    startScroll = rail.scrollLeft;
  });

  rail.addEventListener('pointermove', event => {
    if (!dragging) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > moved) moved = Math.abs(delta);
    if (moved > DRAG_SLOP) {
      /* Only claim the pointer once this is unambiguously a drag, so a plain click
         still reaches the zoom button underneath. */
      if (!rail.classList.contains('is-dragging')) {
        rail.classList.add('is-dragging');
        rail.setPointerCapture?.(event.pointerId);
      }
      event.preventDefault();
      rail.scrollLeft = startScroll - delta;
    }
  });

  function endDrag(event) {
    if (!dragging) return;
    dragging = false;
    if (rail.classList.contains('is-dragging')) {
      rail.releasePointerCapture?.(event.pointerId);
      /* Drop the class after the click event this pointerup generates has been and
         gone, otherwise the lightbox opens at the end of every drag. */
      setTimeout(() => rail.classList.remove('is-dragging'), 0);
      /* Settle on a card: snap was off for the duration of the drag. */
      scrollToCard(currentIndex());
    }
    sync();
  }

  rail.addEventListener('pointerup', endDrag);
  rail.addEventListener('pointercancel', endDrag);

  cards.forEach(card => {
    const media = card.querySelector('img');
    if (media && !media.complete) media.addEventListener('load', sync, { once: true });
  });
  sync();
  return sync;
}

/*
 * Resync on viewport changes and on tab switches.
 *
 * Deliberately NOT a per-rail ResizeObserver. sync() has to measure scrollWidth, and an
 * observer that measures layout and then writes to the DOM re-enters itself through the
 * window scrollbar: the page height shifts, the scrollbar appears or disappears, the
 * viewport width changes, the vw-sized cards resize, and the observer fires again. With
 * the print carousel also on the page that loop pinned the main thread for ~44s on a
 * single resize. A debounced window listener cannot close that loop.
 */
const syncs = [];
document.querySelectorAll('.media-rail').forEach((rail, index) => {
  try {
    const sync = enhance(rail, index);
    if (sync) syncs.push(sync);
  } catch (error) {
    console.warn('[work-rail] skipped a rail', error);
  }
});

const syncAll = () => syncs.forEach(sync => { try { sync(); } catch { /* one bad rail */ } });

let resizeTimer = 0;
addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(syncAll, 150);
}, { passive: true });

/* A panel that was display:none has no measurable rail, so the controls for a set are
   only correct once its tab has been shown. Synced twice: once on the next frame, and
   again after the panel-enter animation has finished and the rail has its final box. */
document.querySelector('.work-tabs')?.addEventListener('click', () => {
  requestAnimationFrame(syncAll);
  setTimeout(syncAll, 450);
});
