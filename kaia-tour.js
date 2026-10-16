/*
 * Kaia as a guide.
 *
 * She already existed as the character in Selected work. This gives her a voice, a
 * speech bubble and a reason to follow the visitor down the page -- without creating a
 * second Kaia. kaia.js owns the one character; this module borrows her, draws her into
 * the intro and into one floating guide, and drives her clips while she talks.
 *
 * What she says lives in kaia-script.js. That is the file to edit.
 *
 * Rules that are not negotiable here:
 *   - nothing is ever spoken before the visitor asks for it;
 *   - only one utterance at a time, ever;
 *   - the page is never scrolled for the visitor, and never prevented from scrolling;
 *   - with no speech synthesis available she still guides, in captions.
 */
import { kaia } from './kaia.js';
import { WELCOME, TOUR, VOICE_PREFERENCES, VOICE_SETTINGS } from './kaia-script.js';

const html = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const synth = window.speechSynthesis || null;

const guide = document.querySelector('[data-kaia-guide]');
const bubble = guide?.querySelector('[data-kaia-bubble]');
const caption = guide?.querySelector('[data-kaia-caption]');
const label = guide?.querySelector('[data-kaia-section]');
const heroMount = document.querySelector('[data-kaia-hero]');

/* Captions carry the words whether or not anything is audible, so the tour is usable
   with the sound off, on a browser with no voices, and by anyone who would rather read. */
let muted = false;
let paused = false;
let touring = false;
let current = null;          // the stop being narrated
const spoken = new Set();    // stops already narrated this tour
let voice = null;
let utterance = null;

if (guide) boot();

function boot() {
  /* kaia.js has already mounted everything carrying [data-kaia], which includes the
     figure inside this guide. Mounting it again would give one canvas two views, two
     observers and two click handlers. Only the intro's view is new. */
  if (heroMount) kaia.mount(heroMount);
  pickVoice();

  /* Chrome populates the voice list asynchronously, and sometimes only after the first
     speak() call. Re-reading on the event is what stops her defaulting to a male voice
     on the first line and switching on the second. */
  synth?.addEventListener?.('voiceschanged', pickVoice);

  wire('[data-kaia-start]', startTour);
  wire('[data-kaia-meet]', meet);
  wire('[data-kaia-pause]', togglePause);
  wire('[data-kaia-mute]', toggleMute);
  wire('[data-kaia-replay]', replay);
  wire('[data-kaia-end]', endTour);
  wire('[data-kaia-close]', () => guide.classList.toggle('is-minimised'));

  observeSections();
  syncControls();

  /* The guide belongs to the portfolio, not to the title card. */
  document.addEventListener('intro:left', () => guide.classList.add('is-ready'));
  if (!html.classList.contains('intro-armed')) guide.classList.add('is-ready');

  /* Her own panel in Selected work is the one place a second Kaia would be visible at
     the same time as the floating one. The floating one steps aside for it. */
  const panel = document.querySelector('#panel-assistant [data-kaia]');
  if (panel) {
    new IntersectionObserver(entries => {
      guide.classList.toggle('is-away', entries.some(entry => entry.isIntersecting));
    }, { threshold: 0.3 }).observe(panel);
  }

  /* Never talk over a dialog, and never sit on top of one. */
  new MutationObserver(() => {
    const busy = document.body.classList.contains('dialog-open');
    guide.classList.toggle('is-hidden', busy);
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  addEventListener('beforeunload', () => synth?.cancel());
}

function wire(selector, handler) {
  document.querySelectorAll(selector).forEach(node => node.addEventListener('click', handler));
}

function pickVoice() {
  if (!synth) return;
  const available = synth.getVoices?.() || [];
  if (!available.length) return;
  for (const wanted of VOICE_PREFERENCES) {
    const found = available.find(v => v.name === wanted);
    if (found) { voice = found; return; }
  }
  /* Nothing on the list: take any English voice, preferring one that names itself
     female, rather than whatever the browser would have picked. */
  const english = available.filter(v => /^en/i.test(v.lang));
  voice = english.find(v => /female|woman|zira|aria|jenny|sonia|samantha|karen|moira|tessa/i.test(v.name))
    || english[0] || available[0];
}

/* ------------------------------------------------------------------- speaking */
function say(text, { onEnd } = {}) {
  stopSpeaking();
  showBubble(text);
  kaia.speaking = true;

  const finish = () => {
    kaia.speaking = false;
    clearHighlight();
    onEnd?.();
  };

  if (!synth || muted) {
    /* No voice, or muted: the captions still run, paced so they can be read. */
    const ms = Math.min(14000, Math.max(2600, text.length * 55));
    utterance = { timer: setTimeout(finish, ms), silent: true };
    return;
  }

  const speech = new SpeechSynthesisUtterance(text);
  if (voice) speech.voice = voice;
  speech.rate = VOICE_SETTINGS.rate;
  speech.pitch = VOICE_SETTINGS.pitch;
  speech.volume = VOICE_SETTINGS.volume;
  /* Highlight the word being said, where the browser reports boundaries. */
  speech.addEventListener('boundary', event => {
    if (event.name && event.name !== 'word') return;
    highlightAt(event.charIndex);
  });
  speech.addEventListener('end', finish);
  speech.addEventListener('error', finish);
  utterance = speech;
  synth.speak(speech);
}

/* One utterance at a time: whatever was running is cancelled before anything starts. */
function stopSpeaking() {
  if (utterance?.silent) clearTimeout(utterance.timer);
  utterance = null;
  synth?.cancel();
  kaia.speaking = false;
}

function showBubble(text) {
  if (!bubble || !caption) return;
  caption.innerHTML = '';
  text.split(/(\s+)/).forEach(part => {
    if (!part.trim()) { caption.append(part); return; }
    const word = document.createElement('span');
    word.textContent = part;
    caption.append(word);
  });
  bubble.hidden = false;
  guide.classList.add('is-speaking');
}

function hideBubble() {
  if (!bubble) return;
  bubble.hidden = true;
  guide.classList.remove('is-speaking');
}

function highlightAt(charIndex) {
  if (!caption) return;
  let seen = 0;
  for (const node of caption.childNodes) {
    const length = (node.textContent || '').length;
    if (node.nodeType === 1) {
      node.classList.toggle('is-now', charIndex >= seen && charIndex < seen + length);
    }
    seen += length;
  }
}

function clearHighlight() {
  caption?.querySelectorAll('.is-now').forEach(node => node.classList.remove('is-now'));
}

/* ------------------------------------------------------------------- the tour */
function meet() {
  /* The first sound on the page, and only ever after this click. */
  kaia.play('hop');
  say(WELCOME, { onEnd: () => { if (!touring) enterPortfolio(); } });
  document.querySelectorAll('[data-kaia-meet]').forEach(button => {
    button.disabled = true;
    button.textContent = 'Kaia is speaking…';
  });
}

function enterPortfolio() {
  document.dispatchEvent(new CustomEvent('kaia:dismiss-intro'));
  startTour();
}

function startTour() {
  if (touring) return;
  touring = true;
  paused = false;
  spoken.clear();
  guide.classList.add('is-touring', 'is-ready');
  syncControls();
  /* Whatever is already on screen is the first stop -- she does not scroll anyone. */
  setTimeout(() => narrateVisible(), 650);
}

function endTour() {
  touring = false;
  current = null;
  stopSpeaking();
  hideBubble();
  guide.classList.remove('is-touring');
  if (label) label.textContent = '';
  syncControls();
}

function togglePause() {
  if (!touring) return;
  paused = !paused;
  if (paused) {
    if (synth?.speaking) synth.pause();
    guide.classList.add('is-paused');
  } else {
    if (synth?.paused) synth.resume();
    guide.classList.remove('is-paused');
  }
  syncControls();
}

function toggleMute() {
  muted = !muted;
  if (muted) { synth?.cancel(); kaia.speaking = false; }
  guide.classList.toggle('is-muted', muted);
  syncControls();
}

function replay() {
  const stop = current || TOUR.find(entry => document.getElementById(entry.id));
  if (!stop) return;
  if (!touring) startTour();
  paused = false;
  guide.classList.remove('is-paused');
  narrate(stop, true);
  syncControls();
}

function narrate(stop, force = false) {
  if (!stop || (!force && spoken.has(stop.id))) return;
  if (paused) return;
  spoken.add(stop.id);
  current = stop;
  if (label) label.textContent = stop.label;
  kaia.play(stop.clip || 'nod');
  say(stop.line);
}

function narrateVisible() {
  if (!touring) return;
  const middle = window.innerHeight / 2;
  let best = null;
  let bestDistance = Infinity;
  for (const stop of TOUR) {
    const section = document.getElementById(stop.id);
    if (!section) continue;
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
    const distance = Math.abs(rect.top + rect.height / 2 - middle);
    if (distance < bestDistance) { bestDistance = distance; best = stop; }
  }
  narrate(best);
}

function observeSections() {
  /* A section counts as arrived once its middle band is on screen. Scrolling is never
     driven from here -- this only listens. */
  const observer = new IntersectionObserver(entries => {
    if (!touring || paused) return;
    const arrived = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!arrived) return;
    const stop = TOUR.find(entry => entry.id === arrived.target.id);
    if (!stop || spoken.has(stop.id)) return;
    /* Let whatever she is saying finish rather than cutting her off mid-sentence. */
    if (synth?.speaking || utterance) return;
    narrate(stop);
  }, { threshold: 0.35, rootMargin: '-10% 0px -25% 0px' });

  TOUR.forEach(stop => {
    const section = document.getElementById(stop.id);
    if (section) observer.observe(section);
  });
}

function syncControls() {
  const set = (selector, pressed, text) => {
    document.querySelectorAll(selector).forEach(node => {
      if (pressed !== null) node.setAttribute('aria-pressed', String(pressed));
      if (text) node.textContent = text;
    });
  };
  set('[data-kaia-mute]', muted, muted ? 'Unmute' : 'Mute');
  set('[data-kaia-pause]', paused, paused ? 'Resume' : 'Pause');
  document.querySelectorAll('[data-kaia-start]').forEach(node => { node.hidden = touring; });
  document.querySelectorAll('[data-kaia-end]').forEach(node => { node.hidden = !touring; });
  document.querySelectorAll('[data-kaia-pause],[data-kaia-replay]').forEach(node => {
    node.hidden = !touring;
  });
  if (!synth) {
    document.querySelectorAll('[data-kaia-mute]').forEach(node => { node.hidden = true; });
  }
}

/* Reduced motion does not mean no guide: she simply stops bouncing about. */
if (reduceMotion) guide?.classList.add('is-still');
