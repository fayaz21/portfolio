/* ============================================================
   FAYAZ MOQUEEM MOHAMMED — PORTFOLIO JS
   Navigation | Animations | Interactions
   ============================================================ */

'use strict';

/* ── Utility ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   NAV — scroll state + mobile menu
   ============================================================ */
function initNav() {
  const nav = $('.nav');
  if (!nav) return;

  // Scroll state
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link — based on current page URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav__link, .nav__mobile .nav__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop();
    if (
      linkPage === currentPath ||
      (currentPath === 'index.html' && (href === '/' || href === '#' || linkPage === '')) ||
      (currentPath === '' && (href === '/' || href === '#' || linkPage === ''))
    ) {
      link.classList.add('active');
    }
  });

  // Mobile hamburger
  const hamburger = $('.nav__hamburger');
  const mobileMenu = $('.nav__mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    $$('.nav__mobile .nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = $(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

/* ============================================================
   SCROLL ANIMATIONS — IntersectionObserver fade-up
   ============================================================ */
function initScrollAnimations() {
  const elements = $$('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   SKILLS TABS
   ============================================================ */
function initSkillsTabs() {
  const tabs = $$('.skills__tab');
  const panels = $$('.skills__panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = $(`[data-panel="${target}"]`);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ============================================================
   HERO typewriter / role cycling
   ============================================================ */
function initHeroRoles() {
  const el = $('.hero__role-cycle');
  if (!el) return;

  const roles = el.dataset.roles ? JSON.parse(el.dataset.roles) : [];
  if (!roles.length) return;

  let idx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = 0;

  function tick() {
    const current = roles[idx];
    if (deleting) {
      charIdx--;
    } else {
      charIdx++;
    }

    el.textContent = current.slice(0, charIdx);

    let speed = deleting ? 40 : 80;

    if (!deleting && charIdx === current.length) {
      pause++;
      if (pause < 20) {
        setTimeout(tick, 100);
        return;
      }
      pause = 0;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      idx = (idx + 1) % roles.length;
      speed = 300;
    }

    setTimeout(tick, speed);
  }

  tick();
}

/* ============================================================
   CONTACT FORM — basic client-side handling
   ============================================================ */
function initContactForm() {
  const form = $('.contact__form-el');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Placeholder — wire to Formspree or similar
    await new Promise(r => setTimeout(r, 1200));
    btn.textContent = 'Message sent!';
    form.reset();
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 3000);
  });
}

/* ============================================================
   STAT COUNTERS
   ============================================================ */
function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (value % 1 === 0 || progress === 1)
          ? Math.round(value) + suffix
          : value.toFixed(1) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initSmoothScroll();
  initScrollAnimations();
  initSkillsTabs();
  initHeroRoles();
  initContactForm();
  initCounters();
});
