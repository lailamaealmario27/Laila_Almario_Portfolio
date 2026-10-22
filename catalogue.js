/*
 * The product catalogue, read as a book.
 *
 * This is a presentation layer over a gallery that already works. app.js fills
 * .media-rail[data-set="catalogue"] and wires its zoom buttons; this reads those cards,
 * builds a book from them, and hides the rail. Clicking a page forwards to the rail's
 * own zoom button, so the full-size viewer, its arrows and its page count are the ones
 * already written and tested rather than a second copy of them.
 *
 * The order of operations is the point: the rail is hidden only once a working book is
 * on screen. If this module never loads, throws, or finds nothing to read, the rail is
 * still sitting there in its normal state and the catalogue is still browsable.
 */
const TURN_MS = 620;

const mount = document.querySelector('[data-book]');
const rail = document.querySelector('.media-rail[data-set="catalogue"]');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* A spread is two pages side by side. On a phone that is two columns of body text in
   the width of a hand, so the book goes to one page at a time instead. */
const single = matchMedia('(max-width: 760px)');

if (mount && rail) {
  try {
    build();
  } catch (error) {
    console.warn('[catalogue] book unavailable, keeping the rail', error);
    mount.hidden = true;
    rail.hidden = false;
  }
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function sheet(className) {
  const wrap = el('div', 'book-page ' + className);
  const image = el('img');
  image.loading = 'lazy';
  image.decoding = 'async';
  wrap.append(image);
  return { wrap, image };
}

function build() {
  /* app.js has already rendered these. Reading them rather than keeping a second list
     of page files means the two can never drift apart. */
  const pages = [...rail.querySelectorAll('.media-card')].map(card => ({
    full: card.querySelector('.zoom-button')?.dataset.src,
    alt: card.querySelector('img')?.alt || '',
    open: card.querySelector('.zoom-button')
  })).filter(page => page.full);
  if (!pages.length) throw new Error('no catalogue pages in the rail');

  const stage = el('div', 'book-stage');
  const left = sheet('is-left');
  const right = sheet('is-right');
  const leaf = el('div', 'book-leaf');
  leaf.hidden = true;
  const leafFront = sheet('book-leaf-face is-front');
  const leafBack = sheet('book-leaf-face is-back');
  leaf.append(leafFront.wrap, leafBack.wrap);
  stage.append(left.wrap, right.wrap, leaf);

  const prev = turnButton('Previous page', '‹');
  const next = turnButton('Next page', '›');
  const status = el('p', 'book-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const bar = el('div', 'book-bar');
  bar.append(prev, status, next);

  mount.append(stage, bar);
  mount.hidden = false;
  mount.tabIndex = 0;
  mount.setAttribute('role', 'group');
  mount.setAttribute('aria-roledescription', 'catalogue');

  /*
   * A cover opens alone on the right, a back page closes alone on the left, and
   * everything between falls into spreads the way a bound document does. One page at a
   * time keeps the page on the right-hand slot, so turning forward always has a sheet
   * to lift and the animation is the same in both layouts.
   */
  function layout(one) {
    if (one) return pages.map((_, i) => [null, i]);
    const out = [[null, 0]];
    for (let i = 1; i < pages.length - 1; i += 2) {
      out.push([i, i + 1 < pages.length - 1 ? i + 1 : null]);
    }
    if (pages.length > 1) out.push([pages.length - 1, null]);
    return out;
  }

  let spreads = layout(single.matches);
  let at = 0;
  let turning = false;

  function turnButton(label, glyph) {
    const button = el('button', 'book-turn');
    button.type = 'button';
    button.setAttribute('aria-label', label);
    button.textContent = glyph;
    return button;
  }

  function show(index, side) {
    const blank = index === null || index === undefined;
    side.wrap.classList.toggle('is-blank', blank);
    if (blank) {
      side.image.removeAttribute('src');
      side.image.alt = '';
      return;
    }
    side.image.src = pages[index].full;
    side.image.alt = pages[index].alt;
  }

  function render() {
    const [l, r] = spreads[at];
    show(l, left);
    show(r, right);
    mount.dataset.open = l !== null && r !== null ? 'spread' : 'single';
    prev.disabled = at === 0;
    next.disabled = at === spreads.length - 1;
    const shown = [l, r].filter(n => n !== null).map(n => n + 1);
    status.textContent = shown.length > 1
      ? `Pages ${shown[0]}–${shown[1]} of ${pages.length}`
      : `Page ${shown[0]} of ${pages.length}`;
    /* Warm the neighbouring spread so a turn does not land on a blank sheet. */
    [spreads[at - 1], spreads[at + 1]].forEach(near => {
      if (!near) return;
      near.forEach(n => { if (n !== null) new Image().src = pages[n].full; });
    });
  }

  /*
   * The turn. A leaf is laid over the page being left behind, carrying that page on its
   * front and the page arriving on its back, and is rotated about the spine. The spread
   * underneath is swapped half way through, behind the leaf, so the swap is never seen.
   */
  function turn(direction) {
    const to = at + direction;
    if (turning || to < 0 || to >= spreads.length) return;

    const leaving = direction > 0 ? spreads[at][1] : spreads[at][0];
    const arriving = direction > 0 ? spreads[to][0] : spreads[to][1];
    if (reduceMotion || leaving === null || arriving === null) {
      at = to;
      render();
      return;
    }

    turning = true;
    show(leaving, leafFront);
    show(arriving, leafBack);
    leaf.hidden = false;
    leaf.dataset.direction = direction > 0 ? 'forward' : 'back';
    leaf.classList.remove('is-turning');
    void leaf.offsetWidth;          // commit the start state before animating
    leaf.classList.add('is-turning');

    setTimeout(() => { at = to; render(); }, TURN_MS / 2);
    setTimeout(() => {
      leaf.classList.remove('is-turning');
      leaf.hidden = true;
      turning = false;
    }, TURN_MS);
  }

  next.addEventListener('click', () => turn(1));
  prev.addEventListener('click', () => turn(-1));

  /* A page opens in the viewer the rail already owns. */
  [left, right].forEach((side, slot) => {
    side.wrap.addEventListener('click', () => {
      const n = spreads[at][slot];
      if (n !== null && n !== undefined) pages[n].open?.click();
    });
  });

  mount.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); turn(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); turn(-1); }
  });

  let swipe = null;
  stage.addEventListener('pointerdown', event => { swipe = event.clientX; });
  stage.addEventListener('pointerup', event => {
    if (swipe === null) return;
    const travelled = event.clientX - swipe;
    swipe = null;
    /* A travelled pointer is a page turn, a still one is a click into the viewer. */
    if (Math.abs(travelled) > 48) turn(travelled < 0 ? 1 : -1);
  });
  stage.addEventListener('pointercancel', () => { swipe = null; });

  /* Changing layout keeps the reader on the page they were looking at rather than
     dropping them back at the cover. */
  single.addEventListener('change', () => {
    const showing = spreads[at].find(n => n !== null) ?? 0;
    spreads = layout(single.matches);
    const found = spreads.findIndex(spread => spread.includes(showing));
    at = found < 0 ? 0 : found;
    render();
  });

  render();
  /* Only now, with a working book on screen, does the rail step aside. */
  rail.hidden = true;
}
