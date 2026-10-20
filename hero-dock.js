/*
 * The hero dock's pointer tilt.
 *
 * Everything the dock does without a pointer -- its entrance, its hover states, its
 * ambient drift -- is CSS. This module adds only the part CSS cannot do: leaning the
 * panel a few degrees toward the cursor, and moving the highlight to follow it.
 *
 * It writes four custom properties and nothing else. No layout is read during the
 * animation, no element is restyled, and the loop stops as soon as the panel has
 * settled, so an untouched dock costs nothing at all.
 *
 * It does not run on a touch device or under reduced motion. A tilt that responds to a
 * pointer is meaningless where there is no pointer, and a continuous loop is not
 * something a phone should be paying for.
 */
const MAX_TILT = 4.5;      /* degrees; restraint is the whole point */
const EASE = 0.12;         /* per-frame approach -- critically damped, no overshoot */
const REST = 0.02;         /* close enough to the target to stop */

const dock = document.querySelector('[data-dock]');
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (dock && fine && !reduceMotion) tilt(dock);

function tilt(panel) {
  /* Target is where the pointer says it should be; current is where it actually is.
     The gap between them over successive frames is the spring. */
  const target = { x: 0, y: 0, glowX: 50, glowY: 0 };
  const current = { x: 0, y: 0, glowX: 50, glowY: 0 };
  let running = false;

  const frame = () => {
    let moving = false;
    for (const key of Object.keys(target)) {
      const delta = target[key] - current[key];
      if (Math.abs(delta) > REST) {
        current[key] += delta * EASE;
        moving = true;
      } else {
        current[key] = target[key];
      }
    }
    panel.style.setProperty('--tilt-x', `${current.x.toFixed(3)}deg`);
    panel.style.setProperty('--tilt-y', `${current.y.toFixed(3)}deg`);
    panel.style.setProperty('--glow-x', `${current.glowX.toFixed(1)}%`);
    panel.style.setProperty('--glow-y', `${current.glowY.toFixed(1)}%`);
    if (!moving) { running = false; return; }
    requestAnimationFrame(frame);
  };

  const wake = () => {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  };

  panel.addEventListener('pointermove', event => {
    const rect = panel.getBoundingClientRect();
    const across = (event.clientX - rect.left) / rect.width;
    const down = (event.clientY - rect.top) / rect.height;
    /* Lean toward the cursor: pointer right tips the right edge away, pointer high
       tips the top edge toward you. */
    target.y = (across - 0.5) * 2 * MAX_TILT;
    target.x = (0.5 - down) * 2 * MAX_TILT;
    target.glowX = across * 100;
    target.glowY = down * 100;
    wake();
  });

  const settle = () => {
    target.x = 0;
    target.y = 0;
    target.glowX = 50;
    target.glowY = 0;
    wake();
  };
  panel.addEventListener('pointerleave', settle);
  panel.addEventListener('pointercancel', settle);
  /* A keyboard user moving through the tiles should not be left with the panel frozen
     at whatever angle the mouse abandoned it at. */
  panel.addEventListener('focusin', settle);
}
