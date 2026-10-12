const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const portfolioSets = {
  social: [
    ['image-03-e67638eeab.webp', 'Marketing dashboard', 'Planning system'],
    ['image-04-370a4cf269.webp', 'Medical content calendar', 'Monthly schedule'],
    ['image-05-8e715002d3.webp', 'E-commerce calendar', 'Campaign planning'],
    ['image-06-6ce89ebc27.webp', 'Content studio', 'Ideas and captions']
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

$$('.media-rail[data-set]').forEach(rail => {
  const set = rail.dataset.set;
  const items = portfolioSets[set] || [];
  rail.innerHTML = items.map(([file, title, type]) => {
    const src = `assets/images/${file}`;
    const shape = set === 'design' ? ' square' : set === 'events' ? ' portrait' : '';
    return `<figure class="media-card${shape}"><img src="${src}" alt="${title}" loading="lazy"><figcaption class="media-caption"><strong>${title}</strong><span>${type}</span></figcaption><button class="zoom-button" data-gallery="${set}" data-src="${src}" data-alt="${title}" data-caption="${title}" aria-label="Open ${title} image"></button></figure>`;
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
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

const observedSections = $$('main section[id]');
const navAnchors = $$('.nav-links a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    navAnchors.forEach(anchor => {
      const active = anchor.getAttribute('href') === `#${entry.target.id}`;
      if (active) anchor.setAttribute('aria-current', 'true');
      else anchor.removeAttribute('aria-current');
    });
  }
}, { rootMargin: '-35% 0px -58% 0px', threshold: 0 });
observedSections.forEach(section => sectionObserver.observe(section));

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
  const targetId = tab.getAttribute('aria-controls');
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  panels.forEach(panel => panel.classList.toggle('active', panel.id === targetId));
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
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });

  $$('.reveal').forEach((element, index) => {
    element.style.setProperty('--delay', `${(index % 4) * 55}ms`);
    revealObserver.observe(element);
  });
} else {
  $$('.reveal').forEach(element => element.classList.add('visible'));
}

const lightbox = $('#lightbox');
const lightboxImage = $('#lightboxImage');
const lightboxCaption = $('#lightboxCaption');
const lightboxCount = $('#lightboxCount');
const closeLightboxButton = $('#closeLightbox');
let gallery = [];
let galleryIndex = 0;
let lightboxOpener = null;

function syncLightbox() {
  const item = gallery[galleryIndex];
  if (!item) return;
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxCaption.textContent = item.caption || item.alt;
  lightboxCount.textContent = gallery.length > 1 ? `${galleryIndex + 1} / ${gallery.length}` : '';
}

function openLightbox(button) {
  const groupName = button.dataset.gallery;
  const groupButtons = $$(`[data-gallery="${groupName}"]`);
  gallery = groupButtons.map(item => ({
    src: item.dataset.src,
    alt: item.dataset.alt || '',
    caption: item.dataset.caption || ''
  }));
  galleryIndex = groupButtons.indexOf(button);
  lightboxOpener = button;
  syncLightbox();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('dialog-open');
  closeLightboxButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('dialog-open');
  lightboxOpener?.focus({ preventScroll: true });
}

function moveLightbox(delta) {
  galleryIndex = (galleryIndex + delta + gallery.length) % gallery.length;
  syncLightbox();
}

$$('.zoom-button').forEach(button => button.addEventListener('click', () => openLightbox(button)));
closeLightboxButton?.addEventListener('click', closeLightbox);
$('#lightboxPrev')?.addEventListener('click', () => moveLightbox(-1));
$('#lightboxNext')?.addEventListener('click', () => moveLightbox(1));
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', event => {
  if (!lightbox?.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') moveLightbox(-1);
  if (event.key === 'ArrowRight') moveLightbox(1);
  if (event.key === 'Tab') {
    const focusable = $$('button', lightbox);
    const current = focusable.indexOf(document.activeElement);
    event.preventDefault();
    const direction = event.shiftKey ? -1 : 1;
    focusable[(current + direction + focusable.length) % focusable.length].focus();
  }
});

let swipeStart = null;
lightbox?.addEventListener('pointerdown', event => {
  swipeStart = { x: event.clientX, time: performance.now() };
});
lightbox?.addEventListener('pointerup', event => {
  if (!swipeStart || gallery.length < 2) return;
  const distance = event.clientX - swipeStart.x;
  const velocity = Math.abs(distance) / Math.max(1, performance.now() - swipeStart.time);
  if (Math.abs(distance) > 55 || velocity > .5) moveLightbox(distance < 0 ? 1 : -1);
  swipeStart = null;
});

const form = $('#contactForm');
const formStatus = $('#formStatus');
if (form && formStatus) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (data.get('website')) return;
    const button = $('button[type="submit"]', form);
    button.disabled = true;
    formStatus.textContent = 'Sending your message…';

    try {
      const [{ createClient }, config] = await Promise.all([
        import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'),
        import('./site-config.js')
      ]);
      const ready = config.SUPABASE_URL.startsWith('https://') && config.SUPABASE_ANON_KEY.length > 30;
      if (!ready) throw new Error('Inbox is not configured');
      const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
      const { error } = await supabase.from('portfolio_messages').insert({
        sender_name: String(data.get('name')).trim(),
        sender_email: String(data.get('email')).trim(),
        project: String(data.get('project')).trim(),
        message: String(data.get('message')).trim()
      });
      if (error) throw error;
      form.reset();
      formStatus.textContent = 'Thank you. Your message has been sent.';
    } catch (error) {
      formStatus.innerHTML = 'The private inbox is unavailable right now. Please <a href="mailto:leilaalmario28@gmail.com">email me directly</a>.';
    } finally {
      button.disabled = false;
    }
  });
}

if (!reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const heroMedia = $('.hero-media');
  const heroPhoto = $('.hero-photo img');
  heroMedia?.addEventListener('pointermove', event => {
    const rect = heroMedia.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    heroPhoto.style.transform = `scale(1.045) translate3d(${x * -8}px, ${y * -8}px, 0)`;
  });
  heroMedia?.addEventListener('pointerleave', () => {
    heroPhoto.style.transform = 'scale(1.02) translate3d(0, 0, 0)';
  });
}

$('#year').textContent = new Date().getFullYear();
