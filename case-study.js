/*
 * The case-study reader.
 *
 * Every work panel that has an entry in case-studies.js gets a button in its intro;
 * the button opens a dialog built from that entry. Panels without an entry are left
 * exactly as they were, so adding or removing a case study is a change to the data
 * file alone.
 *
 * It uses the platform's own <dialog>, which brings the modal behaviour, the focus
 * trap, the backdrop and Escape-to-close with it. Writing those by hand is how
 * accessible dialogs usually go wrong.
 *
 * The one rule that matters here: each section renders the basis it was written on.
 * A reading of a finished piece is not the same kind of claim as a fact from the
 * project files, and a draft awaiting confirmation is not a claim at all. The markup
 * says which is which rather than letting them blur together.
 */
import { CASE_STUDIES, BASIS_LABEL } from './case-studies.js';

/*
 * Draft sections are not published.
 *
 * A section marked `draft` is something only Laila can confirm -- her intent, her
 * process, what she took from a piece. Until she has, it is not hers to publish under
 * her own name, and a recruiter should never be reading a tag that says "needs
 * confirming" on a finished portfolio.
 *
 * They stay in case-studies.js and in PORTFOLIO_CONTENT_REVIEW.md. Confirming one
 * means changing its basis to 'verified' or 'analysis', at which point it appears
 * here with no further change. Set this to true to preview them all at once.
 */
const SHOW_DRAFTS = false;

const panels = [...document.querySelectorAll('.work-panel[id^="panel-"]')];
const printSection = document.querySelector('#print .print-sticky');
if (panels.length || printSection) boot();

function boot() {
  const dialog = build();
  document.body.append(dialog);

  panels.forEach(panel => {
    const key = panel.id.replace('panel-', '');
    const study = CASE_STUDIES[key];
    if (!study) return;
    const intro = panel.querySelector('.project-intro');
    if (intro) intro.append(trigger(key, study));
  });

  /* Print production is a section rather than a work panel, so its trigger goes
     beside the process list instead. */
  if (printSection && CASE_STUDIES.print) {
    printSection.append(trigger('print', CASE_STUDIES.print));
  }

  function trigger(key, study) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'case-open';
    button.innerHTML = 'Read the case study <span class="case-open-arrow" aria-hidden="true">&rarr;</span>';
    button.setAttribute('aria-label', `Read the case study: ${study.title}`);
    button.addEventListener('click', () => open(key, button));
    return button;
  }

  let opener = null;

  function open(key, button) {
    const study = CASE_STUDIES[key];
    if (!study) return;
    opener = button;
    fill(dialog, study);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');       /* ancient browsers get a plain panel */
    dialog.querySelector('.case-body').scrollTop = 0;
  }

  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
  /* Clicking the backdrop closes. The dialog element itself is the backdrop's
     hit target, so a click landing on it and not on the card means outside. */
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
}

function build() {
  const dialog = document.createElement('dialog');
  dialog.className = 'case';
  dialog.setAttribute('aria-labelledby', 'case-title');
  dialog.innerHTML = `
    <article class="case-card">
      <header class="case-head">
        <p class="case-kind" data-kind></p>
        <h2 id="case-title" data-title></h2>
        <p class="case-lead" data-lead></p>
        <dl class="case-facts" data-facts></dl>
        <button class="case-close" type="button" aria-label="Close case study">&times;</button>
      </header>
      <div class="case-body" data-body tabindex="0"></div>
      <footer class="case-foot">
        <p>Each section says what it is based on &mdash; the project files and the work
           itself, or my own reading of the finished piece. Nothing here reports a
           result that was not measured.</p>
      </footer>
    </article>`;
  dialog.querySelector('.case-close').addEventListener('click', () => dialog.close());
  return dialog;
}

function fill(dialog, study) {
  dialog.querySelector('[data-kind]').textContent = study.kind;
  dialog.querySelector('[data-title]').textContent = study.title;
  dialog.querySelector('[data-lead]').textContent = study.lead;

  const facts = dialog.querySelector('[data-facts]');
  facts.innerHTML = '';
  [['Brand', study.brands], ['Placement', study.platform], ['Scope', study.scope]]
    .filter(([, value]) => value)
    .forEach(([label, value]) => {
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      facts.append(dt, dd);
    });

  const body = dialog.querySelector('[data-body]');
  body.innerHTML = '';
  const sections = study.sections.filter(s => SHOW_DRAFTS || s.basis !== 'draft');
  sections.forEach(section => {
    const block = document.createElement('section');
    block.className = 'case-section';
    block.dataset.basis = section.basis;

    const heading = document.createElement('h3');
    heading.textContent = section.title;
    block.append(heading);

    const tag = document.createElement('p');
    tag.className = 'case-basis';
    tag.textContent = BASIS_LABEL[section.basis] || section.basis;
    block.append(tag);

    section.body.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      block.append(p);
    });
    body.append(block);
  });
}
