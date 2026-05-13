/* =========================================================
   Ayham Rami Aldarwesh — script.js
   Vanilla JS — no external libraries.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Hero load ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    const hero = document.querySelector('.hero');
    if (hero) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => hero.classList.add('hero-loaded'));
      });
    }
  });

  /* ---------- Custom cursor ---------- */
  initCursor();

  function initCursor() {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    const skip = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 900px)');
    if (skip.matches) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    document.body.classList.add('cursor-enabled');

    const HOVER_SEL = 'a, button, .featured-card, .service, input, textarea, select, label[for]';

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let hoverState = false;
    let firstMove = false;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      if (!firstMove) {
        firstMove = true;
        rx = mx; ry = my;
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        document.body.classList.add('cursor-active');
      }
    }, { passive: true });

    document.addEventListener('mouseover', (e) => {
      const isHover = !!(e.target.closest && e.target.closest(HOVER_SEL));
      if (isHover !== hoverState) {
        hoverState = isHover;
        document.body.classList.toggle('cursor-hover', isHover);
      }
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-active');
    });
    document.documentElement.addEventListener('mouseenter', () => {
      if (firstMove) document.body.classList.add('cursor-active');
    });

    function tick() {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(tick);
    }
    tick();

    skip.addEventListener?.('change', (ev) => {
      if (ev.matches) {
        document.body.classList.remove('cursor-enabled', 'cursor-active', 'cursor-hover');
        dot.style.display = 'none';
        ring.style.display = 'none';
      }
    });
  }

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.nav-burger');
  const menu   = document.querySelector('.mobile-menu');
  const close  = document.querySelector('.mobile-close');

  function openMenu() {
    if (!menu) return;
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (burger) burger.addEventListener('click', openMenu);
  if (close)  close.addEventListener('click', closeMenu);
  if (menu)   menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Nav scroll state ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastY = window.scrollY;
    let ticking = false;
    function onScroll() {
      const y = window.scrollY;
      // Background appears after scrolling past 40px
      if (y > 40) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
      // Hide on scroll down (after passing hero), show on scroll up
      if (y > 400 && y > lastY) nav.classList.add('nav-hidden');
      else nav.classList.remove('nav-hidden');
      lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
    onScroll();
  }

  /* ---------- IntersectionObserver reveals ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  /* ---------- Local time (Abingdon) ---------- */
  function updateTime() {
    const el = document.getElementById('local-time');
    if (!el) return;
    const opts = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/London' };
    el.textContent = new Date().toLocaleTimeString('en-GB', opts);
  }
  updateTime();
  setInterval(updateTime, 30000);

  /* ---------- Stagger reveal for featured cards ---------- */
  document.querySelectorAll('.featured-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
  });

  /* ---------- Stagger reveal for service items ---------- */
  document.querySelectorAll('.service').forEach((item, i) => {
    item.style.transitionDelay = (i * 0.06) + 's';
  });

})();
