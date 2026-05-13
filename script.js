/* ══════════════════════════════════════════
   HYUNDAI INSTITUTE — script.js
══════════════════════════════════════════ */

/* ── 1. SMOOTH SCROLL ──────────────────── */
function goTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    goTo(id);
    document.getElementById('drawer').classList.remove('open');
  });
});

/* ── 2. CANVAS PARTICLE BG ─────────────── */
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    init();
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r  = Math.random() * 1.2 + 0.3;
    this.alpha = Math.random() * 0.4 + 0.1;
  }

  function init() {
    const n = Math.floor((W * H) / 14000);
    particles = Array.from({ length: n }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const a = (1 - dist / 120) * 0.06;
          ctx.strokeStyle = `rgba(200,169,110,${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,169,110,${p.alpha})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ── 3. CUSTOM CURSOR ──────────────────── */
(function () {
  const dot  = document.getElementById('cDot');
  const ring = document.getElementById('cRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function follow() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(follow);
  })();

  const hoverEls = 'a, button, .acard, .pcard, .tcard, .vcard, .rrow, .org-node, .abar-item, .ft-social a, .ft-col ul li a';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(2.5)';
      dot.style.background = '#e8c98a';
      ring.style.width     = '56px';
      ring.style.height    = '56px';
      ring.style.borderColor = 'rgba(200,169,110,0.55)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(1)';
      dot.style.background = '#c8a96e';
      ring.style.width     = '32px';
      ring.style.height    = '32px';
      ring.style.borderColor = 'rgba(200,169,110,0.4)';
    });
  });
})();

/* ── 4. NAV SCROLL STATE ───────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 60);
  // progress bar
  const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  document.getElementById('progressBar').style.width = (scrolled * 100) + '%';
});

/* ── 5. BURGER / DRAWER ────────────────── */
const burger  = document.getElementById('burger');
const drawer  = document.getElementById('drawer');
const drawerC = document.getElementById('drawerClose');

burger.addEventListener('click',  () => drawer.classList.add('open'));
drawerC.addEventListener('click', () => drawer.classList.remove('open'));

document.querySelectorAll('.d-link').forEach(l => {
  l.addEventListener('click', () => drawer.classList.remove('open'));
});

/* ── 6. COUNTER ANIMATION ──────────────── */
function animCount(el, target, dur = 2000) {
  let start = 0;
  const step = target / (dur / 16);
  const tick = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start >= target) clearInterval(tick);
  }, 16);
}

let counted = false;
const counters = document.querySelectorAll('.hsb-num, .count');
const heroStatsBar = document.querySelector('.hero-stats-bar');

if (heroStatsBar) {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      counters.forEach(el => {
        animCount(el, parseInt(el.dataset.target || el.getAttribute('data-target') || 0));
      });
    }
  }, { threshold: 0.2 });
  obs.observe(heroStatsBar);
}

/* ── 7. SCROLL REVEAL ──────────────────── */
const reveals = document.querySelectorAll('.r');
const revObs  = new IntersectionObserver((entries) => {
  entries.forEach((en, i) => {
    if (en.isIntersecting) {
      const delay = en.target.dataset.delay || 0;
      setTimeout(() => en.target.classList.add('vis'), delay);
      revObs.unobserve(en.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

// Stagger siblings in groups
document.querySelectorAll('.acard, .pcard, .tcard, .vcard, .rrow, .org-node, .ab, .abar-item').forEach((el, i) => {
  el.dataset.delay = (i % 4) * 100;
});

reveals.forEach(el => revObs.observe(el));

/* ── 8. FAQ ACCORDION ──────────────────── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  // close all
  document.querySelectorAll('.faq-item.open').forEach(fi => fi.classList.remove('open'));

  // open this one if it was closed
  if (!isOpen) item.classList.add('open');
}

/* ── 9. FORM SUBMIT ─────────────────────── */
const appForm = document.getElementById('applicationForm');
if (appForm) {
  appForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn    = this.querySelector('.submit-btn');
    const span   = btn.querySelector('span:first-child');
    const arrow  = btn.querySelector('.sb-arr');
    const orig   = span.textContent;

    span.textContent  = 'Submitting…';
    arrow.textContent = '⟳';
    btn.style.opacity = '0.75';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
      span.textContent  = 'Application Received ✓';
      arrow.textContent = '';
      btn.style.opacity = '1';
      btn.style.background = '#3ecf8e';
      btn.style.color      = '#0a0b10';

      setTimeout(() => {
        span.textContent  = orig;
        arrow.textContent = '→';
        btn.style.background  = '';
        btn.style.color       = '';
        btn.style.pointerEvents = '';
        appForm.reset();
      }, 3500);
    }, 1400);
  });
}

/* ── 10. ACTIVE NAV LINK ───────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-ul a');

window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) cur = s.id;
  });
  navLinks.forEach(a => {
    const active = a.getAttribute('href') === '#' + cur;
    a.style.color = active ? 'var(--gold)' : '';
  });
}, { passive: true });

/* ── 11. PARALLAX CANVAS TILT (MOUSE) ─── */
let mouseParallaxX = 0, mouseParallaxY = 0;
document.addEventListener('mousemove', e => {
  mouseParallaxX = (e.clientX / window.innerWidth  - 0.5) * 30;
  mouseParallaxY = (e.clientY / window.innerHeight - 0.5) * 20;
});

(function parallax() {
  const heroC = document.querySelector('.hero-center');
  if (heroC) {
    heroC.style.transform = `translate(${mouseParallaxX * 0.12}px, ${mouseParallaxY * 0.1}px)`;
  }
  requestAnimationFrame(parallax);
})();

/* ── 12. TICKER PAUSE ON HOVER ─────────── */
const ticker = document.querySelector('.ticker-track');
if (ticker) {
  ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
  ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
}

/* ── 13. PAGE LOAD ANIMATION ───────────── */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});