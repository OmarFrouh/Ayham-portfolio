/* =========================================================
   Ayham Aldarwesh — script.js
   Vanilla JS — no external libraries.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Hero load animation ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    const hero = document.querySelector('.hero');
    if (hero) {
      document.querySelectorAll('.hero-name .char').forEach((c, i) => {
        c.style.setProperty('--i', i);
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => hero.classList.add('loaded'));
      });
    }
  });

  /* ---------- Custom cursor ---------- */
  initCursor();

  function initCursor() {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    // Skip on touch / coarse pointer / small screens
    const skip = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 900px)');
    if (skip.matches) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    document.body.classList.add('cursor-enabled');

    const HOVER_SEL = 'a, button, .project-card, .discipline, input, textarea, select, label[for]';

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let hoverState = false;
    let firstMove = false;

    function onMove(e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      if (!firstMove) {
        firstMove = true;
        rx = mx; ry = my;
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        document.body.classList.add('cursor-active');
      }
    }

    function onOver(e) {
      const isHover = !!(e.target.closest && e.target.closest(HOVER_SEL));
      if (isHover !== hoverState) {
        hoverState = isHover;
        document.body.classList.toggle('cursor-hover', isHover);
      }
    }

    function onLeaveWindow() {
      document.body.classList.remove('cursor-active');
    }
    function onEnterWindow() {
      if (firstMove) document.body.classList.add('cursor-active');
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeaveWindow);
    document.documentElement.addEventListener('mouseenter', onEnterWindow);

    // Hide cursor on mousedown for a touch of feedback
    document.addEventListener('mousedown', () => {
      ring.style.opacity = '';
      document.body.classList.add('cursor-down');
    });
    document.addEventListener('mouseup', () => {
      document.body.classList.remove('cursor-down');
    });

    // Trailing ring loop
    function tick() {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(tick);
    }
    tick();

    // If viewport crosses the breakpoint at runtime, tear down
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

  /* ---------- Hide nav on scroll down, show on scroll up ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastY = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y > lastY && y > 200) {
            nav.classList.add('nav-hidden');
          } else {
            nav.classList.remove('nav-hidden');
          }
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
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
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .projects-divider').forEach(el => io.observe(el));

    const stats = document.querySelector('.hero-stats');
    if (stats) {
      const statIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num').forEach(animateCount);
            statIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      statIO.observe(stats);
    }
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  function animateCount(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Local time ---------- */
  function updateTime() {
    const el = document.getElementById('local-time');
    if (!el) return;
    const opts = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/London' };
    el.textContent = new Date().toLocaleTimeString('en-GB', opts);
  }
  updateTime();
  setInterval(updateTime, 30000);

})();
