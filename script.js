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
      // Index characters for staggered name reveal
      document.querySelectorAll('.hero-name .char').forEach((c, i) => {
        c.style.setProperty('--i', i);
      });
      // Trigger after a tick so transitions register
      requestAnimationFrame(() => {
        requestAnimationFrame(() => hero.classList.add('loaded'));
      });
    }
  });

  /* ---------- Custom cursor ---------- */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (dot && ring && window.matchMedia('(min-width: 901px)').matches) {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    const animateRing = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Enlarge cursor near interactive elements
    const hoverables = 'a, button, .project-card, .discipline, .btn, .hero-secondary';
    document.body.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) document.body.classList.add('cursor-hover');
    });
    document.body.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) document.body.classList.remove('cursor-hover');
    });

    // Fade cursor on window leave
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = 0; ring.style.opacity = 0;
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = 1; ring.style.opacity = 0.6;
    });
  }

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.nav-burger');
  const menu   = document.querySelector('.mobile-menu');
  const close  = document.querySelector('.mobile-close');

  if (burger && menu) {
    burger.addEventListener('click', () => {
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });
  }
  if (close && menu) {
    close.addEventListener('click', () => {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      if (burger) burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  }
  if (menu) {
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

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
    });
  }

  /* ---------- IntersectionObserver reveals ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);

          // Stat counters
          if (entry.target.matches('.hero-stats') || entry.target.querySelector?.('.stat-num')) {
            entry.target.querySelectorAll('.stat-num').forEach(animateCount);
          }

          // Projects divider expand
          if (entry.target.classList.contains('projects-divider')) {
            entry.target.classList.add('in');
          }
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .projects-divider').forEach(el => io.observe(el));

    // Also observe stats container for counter trigger
    const stats = document.querySelector('.hero-stats');
    if (stats) {
      const statIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num').forEach(animateCount);
            statIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
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
      const value = Math.round(target * eased);
      el.textContent = value;
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

  /* ---------- Magnetic buttons (subtle) ---------- */
  if (window.matchMedia('(min-width: 901px)').matches) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- Disciplines: keyboard focus shifts active state ---------- */
  const disciplines = document.querySelectorAll('.discipline');
  disciplines.forEach(d => {
    d.addEventListener('mouseenter', () => {
      disciplines.forEach(o => o.classList.remove('discipline-hover-active'));
      d.classList.add('discipline-hover-active');
    });
  });

})();
