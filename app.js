const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Selected work galleries. These rails are filled here rather than written into the
// markup, so keep this block ahead of everything else and free of optional imports:
// if it stops running, the Selected work section renders empty.
const portfolioSets = {
  /* The dashboard's Overview is not in this rail. It is featured on its own above the
     rail, in the spotlight block that carries the case study, because it is the screen
     the whole system is read from and a rail slice of it reads as nothing. Its zoom
     button sits earlier in the DOM than these, so it is still image 1 of the social
     gallery in the viewer.

     These eight are the rest of the dashboard, in sidebar order. Every one is redacted
     before it ships -- see catalogue/build_hub_screenshots.py for which region on
     which screen, and the rule that put it there. Never replace one of these with a raw
     screenshot. */
  social: [
    ['hub-02-products.webp', 'Products', 'ERP-linked records, prices and promotion remarks'],
    ['hub-03-ecommerce.webp', 'E-commerce alerts', 'Read-only ERP stock and shipping deadlines'],
    ['hub-05-calendar.webp', 'Content calendar', 'A month planned, filtered by brand'],
    ['hub-06-studio.webp', 'Content Studio', 'The same month as production work'],
    ['hub-07-analytics.webp', 'Content analytics', 'Measured posts only, never estimated'],
    ['hub-04-seo.webp', 'SEO Management', 'Listing checks, and how old the data is'],
    ['hub-08-script.webp', 'Script generator', 'A call script drafted from a lead record'],
    ['hub-09-leads.webp', 'HCP leads', 'Follow-up states (lead details redacted)']
  ],
  design: [
    ['image-07-e0e49d68f8.webp', 'BER months campaign', 'Social creative'],
    ['image-08-143cc1d97a.webp', 'Earth Day awareness', 'Campaign creative'],
    ['image-09-20f63d2084.webp', 'Birthday sale', 'Promotion'],
    ['image-10-907560fd02.webp', 'Workshop promotion', 'Event creative'],
    ['image-11-65bb25cd77.webp', 'Christmas content', 'Seasonal creative'],
    ['image-12-373a4b2005.webp', 'Proof of transactions', 'Trust content'],
    ['image-13-892b4a35a1.webp', 'World Diabetes Day', 'Awareness creative']
  ],
  /* The KOKOLOCK product catalogue, 32 pages, built for K-PICK Trading Corp.
     Page 1 is the cover, 2-16 are the door locks, 17-32 are the safety vaults.
     Rebuild the images with catalogue/build_catalogue.py; this list has to match
     the number of pages it writes. */
  catalogue: [
    ['kokolock-01.webp', 'KOKOLOCK catalogue', 'Cover'],
    ['kokolock-02.webp', 'Smart door lock', 'Page 2 of 32'],
    ['kokolock-03.webp', 'Smart door lock', 'Page 3 of 32'],
    ['kokolock-04.webp', 'Smart door lock', 'Page 4 of 32'],
    ['kokolock-05.webp', 'Smart door lock', 'Page 5 of 32'],
    ['kokolock-06.webp', 'Smart door lock', 'Page 6 of 32'],
    ['kokolock-07.webp', 'Smart door lock', 'Page 7 of 32'],
    ['kokolock-08.webp', 'Smart door lock', 'Page 8 of 32'],
    ['kokolock-09.webp', 'Smart door lock', 'Page 9 of 32'],
    ['kokolock-10.webp', 'Smart door lock', 'Page 10 of 32'],
    ['kokolock-11.webp', 'Smart door lock', 'Page 11 of 32'],
    ['kokolock-12.webp', 'Smart door lock', 'Page 12 of 32'],
    ['kokolock-13.webp', 'Smart door lock', 'Page 13 of 32'],
    ['kokolock-14.webp', 'Smart door lock', 'Page 14 of 32'],
    ['kokolock-15.webp', 'Smart door lock', 'Page 15 of 32'],
    ['kokolock-16.webp', 'Smart door lock', 'Page 16 of 32'],
    ['kokolock-17.webp', 'Safety vaults', 'Page 17 of 32'],
    ['kokolock-18.webp', 'Safety vaults', 'Page 18 of 32'],
    ['kokolock-19.webp', 'Safety vaults', 'Page 19 of 32'],
    ['kokolock-20.webp', 'Safety vaults', 'Page 20 of 32'],
    ['kokolock-21.webp', 'Safety vaults', 'Page 21 of 32'],
    ['kokolock-22.webp', 'Safety vaults', 'Page 22 of 32'],
    ['kokolock-23.webp', 'Safety vaults', 'Page 23 of 32'],
    ['kokolock-24.webp', 'Safety vaults', 'Page 24 of 32'],
    ['kokolock-25.webp', 'Safety vaults', 'Page 25 of 32'],
    ['kokolock-26.webp', 'Safety vaults', 'Page 26 of 32'],
    ['kokolock-27.webp', 'Safety vaults', 'Page 27 of 32'],
    ['kokolock-28.webp', 'Safety vaults', 'Page 28 of 32'],
    ['kokolock-29.webp', 'Safety vaults', 'Page 29 of 32'],
    ['kokolock-30.webp', 'Safety vaults', 'Page 30 of 32'],
    ['kokolock-31.webp', 'Safety vaults', 'Page 31 of 32'],
    ['kokolock-32.webp', 'Safety vaults', 'Page 32 of 32']
  ],
  events: [
    ['image-14-0a804db065.webp', 'Customer engagement', 'PhilMedical Expo'],
    ['image-15-133ef44b5e.webp', 'Exhibit support', 'On-site'],
    ['image-16-b6c36c37aa.webp', 'Product presentation', 'Convention'],
    ['image-17-780407f442.webp', 'Team support', 'Convention'],
    ['image-18-543b04bdf5.webp', 'Brand representation', 'Sinocare'],
    ['image-19-f706e252d4.webp', 'Event activity', 'Healthcare'],
    ['image-20-bfefc18bf1.webp', 'Booth interaction', 'Customer support'],
    ['image-21-68587b0974.webp', 'Event content', 'On-site'],
    ['image-22-e803726246.webp', 'Exhibit presentation', 'Product support']
  ]
};

/* Sets whose pages are dense enough to be worth two files: a small one for the card
   in the rail, the full page kept back for the viewer. Thirty-two full-size catalogue
   pages in a rail would be several megabytes of images nobody has asked to read yet. */
const TWO_SIZE = new Set(['catalogue']);

$$('.media-rail[data-set]').forEach(rail => {
  const set = rail.dataset.set;
  const items = portfolioSets[set] || [];
  /* The social set is whole application screens, not photographs. A tall card with
     object-fit:cover shows a zoomed slice of one, which tells a reader nothing about
     which screen they are looking at -- so it gets a card shaped like the screenshot
     and the image is contained rather than cropped. The lightbox is where it is read. */
  const shape = set === 'design' ? ' square'
    : set === 'events' || set === 'catalogue' ? ' portrait'
    : set === 'social' ? ' wide' : '';
  rail.innerHTML = items.map(([file, title, type]) => {
    const full = `assets/images/${file}`;
    const card = TWO_SIZE.has(set) ? full.replace(/\.webp$/, '-sm.webp') : full;
    return `<figure class="media-card${shape}"><img src="${card}" alt="${title}" loading="lazy"><figcaption class="media-caption"><strong>${title}</strong><span>${type}</span></figcaption><button class="zoom-button" data-gallery="${set}" data-src="${full}" data-alt="${title}" data-caption="${title} \u2014 ${type}" aria-label="Open ${title}, ${type}"></button></figure>`;
  }).join('');
});

const menuButton = $('#menuButton');
const navLinks = $('#navLinks');
function closeMenu() {
  if (!menuButton || !navLinks) return;
  menuButton.setAttribute('aria-expanded', 'false');
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navLinks.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});
$$('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const navAnchors = $$('.nav-links a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(anchor => {
      const active = anchor.getAttribute('href') === `#${entry.target.id}`;
      if (active) anchor.setAttribute('aria-current', 'true');
      else anchor.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-35% 0px -58% 0px', threshold: 0 });
$$('main section[id]').forEach(section => sectionObserver.observe(section));

$$('.experience-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.experience-item');
    const open = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!open));
    item.classList.toggle('open', !open);
  });
});

const tabs = $$('.work-tab');
const panels = $$('.work-panel');
function activateTab(tab) {
  const id = tab.getAttribute('aria-controls');
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  panels.forEach(panel => panel.classList.toggle('active', panel.id === id));
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    activateTab(tabs[next]);
    tabs[next].focus();
  });
});

if (!reduceMotion) {
  /* Toggled rather than latched: an entrance that only ever plays once leaves the
     page static for anyone scrolling back up through it. */
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
  }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  $$('.reveal').forEach((element, index) => {
    element.style.setProperty('--delay', `${(index % 4) * 55}ms`);
    revealObserver.observe(element);
  });
} else $$('.reveal').forEach(element => element.classList.add('visible'));

const lightbox = $('#lightbox');
const lightboxImage = $('#lightboxImage');
const lightboxCaption = $('#lightboxCaption');
const lightboxCount = $('#lightboxCount');
const lightboxClose = $('#closeLightbox');
let gallery = [];
let galleryIndex = 0;
let lightboxOpener = null;
function updateLightbox() {
  const item = gallery[galleryIndex];
  if (!item) return;
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxCaption.textContent = item.caption || item.alt;
  lightboxCount.textContent = gallery.length > 1 ? `${galleryIndex + 1} / ${gallery.length}` : '';
}
function openLightbox(button) {
  const group = button.dataset.gallery;
  const items = $$(`[data-gallery="${group}"]`);
  gallery = items.map(item => ({ src: item.dataset.src, alt: item.dataset.alt || '', caption: item.dataset.caption || '' }));
  galleryIndex = items.indexOf(button);
  lightboxOpener = button;
  updateLightbox();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('dialog-open');
  lightboxClose.focus();
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('dialog-open');
  lightboxOpener?.focus({ preventScroll: true });
}
function moveLightbox(delta) {
  galleryIndex = (galleryIndex + delta + gallery.length) % gallery.length;
  updateLightbox();
}
$$('.zoom-button').forEach(button => button.addEventListener('click', () => openLightbox(button)));
lightboxClose?.addEventListener('click', closeLightbox);
$('#lightboxPrev')?.addEventListener('click', () => moveLightbox(-1));
$('#lightboxNext')?.addEventListener('click', () => moveLightbox(1));
lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => {
  if (!lightbox?.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') moveLightbox(-1);
  if (event.key === 'ArrowRight') moveLightbox(1);
});

const form = $('#contactForm');
const formStatus = $('#formStatus');
const DIRECT_EMAIL = 'leilaalmario28@gmail.com';

/*
 * The contact form posts straight to Web3Forms, which emails the message on. There is
 * no database behind it and nothing to log into: if the post fails, the visitor is
 * given the address to write to directly, which is the only fallback that cannot
 * itself be down.
 */
form?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  /* The honeypot is invisible to a real visitor, so anything in it came from a bot. */
  if (data.get('website')) return;

  const button = $('button[type="submit"]', form);
  button.disabled = true;
  formStatus.textContent = 'Sending your message…';

  try {
    const { WEB3FORMS_ACCESS_KEY: key } = await import('./site-config.js');
    /* An unfilled placeholder is not a configuration. Saying so here is what turns a
       silent non-delivery into the visible fallback below. */
    if (typeof key !== 'string' || key.length < 20 || key.includes('PASTE')) {
      throw new Error('Web3Forms access key is not set in site-config.js');
    }

    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: `Portfolio message from ${name || 'a visitor'}`,
        from_name: 'Laila Mae Almario portfolio',
        name,
        email,
        /* So replying in the inbox answers the visitor, not the form. */
        replyto: email,
        project: String(data.get('project') || '').trim() || '—',
        message: String(data.get('message') || '').trim(),
        /* Web3Forms' own honeypot, documented as a boolean. False means human. */
        botcheck: false
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) {
      throw new Error(result.message || `Web3Forms replied ${response.status}`);
    }

    form.reset();
    formStatus.textContent = 'Thank you. Your message has been sent.';
  } catch (error) {
    console.warn('[contact] not delivered:', error);
    formStatus.textContent = 'The form is unavailable right now. Please email me directly: ';
    const link = document.createElement('a');
    link.href = `mailto:${DIRECT_EMAIL}`;
    link.textContent = DIRECT_EMAIL;
    formStatus.append(link);
  } finally {
    button.disabled = false;
  }
});

$('#year').textContent = new Date().getFullYear();
