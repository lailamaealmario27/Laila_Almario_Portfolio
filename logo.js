/*
 * The adaptive brand mark.
 *
 * The monogram is drawn as a CSS mask of the original PNG rather than as an image, so
 * its colour is a custom property while its geometry is, literally, the artwork's own
 * alpha channel. Nothing is traced, re-drawn or filtered -- the shape on screen is the
 * file Laila supplied, painted in whatever ink the current background calls for.
 *
 * Which ink that is comes from the section behind the navigation, not from sampling
 * pixels. Every section declares its own tone in the markup, the navigation adopts a
 * matching skin, and the mark reads its colour from that skin. One attribute changes;
 * CSS does the rest.
 *
 * Detection is a one-pixel line across the viewport at the navigation's own centre.
 * An IntersectionObserver with a rootMargin that collapses the root to that line fires
 * only when a section crosses it, so scrolling costs nothing at all -- there is no
 * scroll handler here, and no layout is read while the page moves.
 */

const PAPER = 'paper';

const nav = document.querySelector('.nav');
const toned = [...document.querySelectorAll('[data-tone]')];

if (nav && toned.length) adapt();

function adapt() {
  /* Sections currently crossing the line. Usually one; two for the instant a boundary
     passes through it, and then the later one in document order is the one taking over. */
  const crossing = new Set();
  let observer = null;
  let skin = nav.dataset.skin || PAPER;

  const settle = () => {
    if (!crossing.size) return;
    let winner = null;
    /* Document order, so the section arriving from below wins the handover. */
    for (const section of toned) if (crossing.has(section)) winner = section;
    const tone = winner?.dataset.tone || PAPER;
    if (tone === skin) return;
    skin = tone;
    nav.dataset.skin = tone;
  };

  const onCross = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) crossing.add(entry.target);
      else crossing.delete(entry.target);
    });
    settle();
  };

  const build = () => {
    observer?.disconnect();
    const rect = nav.getBoundingClientRect();
    /* The navigation is fixed, so its box is already viewport-relative. */
    const line = Math.round(rect.top + rect.height / 2);
    const above = Math.max(0, line);
    const below = Math.max(0, window.innerHeight - line - 1);
    crossing.clear();
    observer = new IntersectionObserver(onCross, {
      rootMargin: `-${above}px 0px -${below}px 0px`,
      threshold: 0
    });
    toned.forEach(section => observer.observe(section));
  };

  build();

  /* The line moves when the viewport does: the navigation sits on a safe-area inset and
     changes height at the phone breakpoint. Rebuilt rather than approximated. */
  let pending = null;
  addEventListener('resize', () => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(build);
  }, { passive: true });

  /* The gate holds the navigation hidden and the page at the top. Once it lifts, the
     first section is behind the bar again whatever the observer last saw. */
  document.addEventListener('intro:left', () => requestAnimationFrame(build));
}
