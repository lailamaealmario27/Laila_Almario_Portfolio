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
 * A section may also carry `items` (feature cards) and `steps` (an ordered workflow).
 * Both are optional, so every existing study renders exactly as it did.
 *
 * Each item carries a `status`, and the label is deliberately blunt. A feature that is
 * built but not connected to anything is not a feature a reader can rely on, and a
 * portfolio that blurs the two is making a claim it cannot support. The three states
 * are the only ones allowed; an unknown value falls back to showing nothing rather
 * than inventing a reassuring label.
 */
const STATUS_LABEL = {
  live: 'Implemented',
  building: 'In development',
  planned: 'Planned'
};

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
/* Anything that is neither a work panel nor the print section names its study with
   `data-case="<key>"`, and optionally marks where the button goes with
   `data-case-slot`. That is what lets one screen inside a panel carry its own study
   without being promoted to a panel of its own. */
const hosts = [...document.querySelectorAll('[data-case]')];
if (panels.length || printSection || hosts.length) boot();

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

  hosts.forEach(host => {
    const key = host.dataset.case;
    const study = CASE_STUDIES[key];
    if (!study) return;
    (host.querySelector('[data-case-slot]') || host).append(trigger(key, study));
  });

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

    if (section.items?.length) block.append(features(section.items));
    if (section.steps?.length) block.append(steps(section.steps));

    body.append(block);
  });
}

/* The feature cards. One card per feature, each with its implementation status, so a
   reader can tell at a glance what the thing does today from what it is going to do.
   Built with textContent throughout: every string here is author-written, but a
   portfolio that renders its own data as HTML is one copy-paste away from not being
   able to say that any more. */
function features(items) {
  const list = document.createElement('ul');
  list.className = 'case-features';

  items.forEach(item => {
    const card = document.createElement('li');
    card.className = 'case-feature';
    card.dataset.status = item.status;

    const head = document.createElement('p');
    head.className = 'case-feature-name';
    head.textContent = item.name;
    card.append(head);

    const label = STATUS_LABEL[item.status];
    if (label) {
      const pill = document.createElement('span');
      pill.className = 'case-status';
      pill.textContent = label;
      head.append(' ', pill);
    }

    const text = document.createElement('p');
    text.className = 'case-feature-body';
    text.textContent = item.body;
    card.append(text);

    list.append(card);
  });

  return list;
}

/* The workflow, as an ordered list. It is a sequence and it should look like one --
   seven paragraphs in a row read as prose and lose the order, which is the only thing
   the section is for. */
function steps(entries) {
  const list = document.createElement('ol');
  list.className = 'case-steps';
  entries.forEach(entry => {
    const item = document.createElement('li');
    item.textContent = entry;
    list.append(item);
  });
  return list;
}
