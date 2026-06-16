(function(){'use strict';

/* ── Theme ──────────────────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('dristi-theme', theme);
  if (sunIcon && moonIcon) {
    sunIcon.style.display = theme === 'light' ? 'block' : 'none';
    moonIcon.style.display = theme === 'light' ? 'none' : 'block';
  }
}

const saved = localStorage.getItem('dristi-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(saved || (prefersDark ? 'dark' : 'light'));

if (themeToggle) {
  themeToggle.addEventListener('click', function(e) {
    e.preventDefault();
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
}

/* ── Mobile nav ─────────────────────────────────────────────────── */
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
if (mobileToggle && navLinks) {
  mobileToggle.addEventListener('click', function() {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() { navLinks.classList.remove('open'); });
  });
}

/* ── Active nav link ────────────────────────────────────────────── */
(function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.toggle('active',
      path === '/' ? a.getAttribute('href') === '/' :
      a.getAttribute('href') !== '/' && path.startsWith(a.getAttribute('href').replace(/\.html$/, ''))
    );
  });
})();

/* ── Scroll animations (Intersection Observer) ──────────────────── */
const fadeElements = document.querySelectorAll('.fade-in');
if (fadeElements.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  fadeElements.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}

/* ── Counter animation ──────────────────────────────────────────── */
const statNumbers = document.querySelectorAll('.stat-number[data-count]');
if (statNumbers.length && 'IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver(function(entries, obs) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1500;
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }
        requestAnimationFrame(update);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(function(el) { counterObserver.observe(el); });
}

/* ── Hero entrance animation ────────────────────────────────────── */
(function animateHero() {
  const badge = document.getElementById('heroBadge');
  const title = document.getElementById('heroTitle');
  const sub = document.getElementById('heroSub');
  const actions = document.getElementById('heroActions');
  const terminal = document.getElementById('heroTerminal');
  const delay = function(ms) { return new Promise(function(r) { setTimeout(r, ms); }); };
  (async function() {
    if (badge) { badge.style.transition = 'opacity 0.6s'; badge.style.opacity = '1'; }
    await delay(200);
    if (title) { title.style.transition = 'opacity 0.8s, transform 0.8s'; title.style.opacity = '1'; }
    await delay(300);
    if (sub) { sub.style.transition = 'opacity 0.6s'; sub.style.opacity = '1'; }
    await delay(200);
    if (actions) { actions.style.transition = 'opacity 0.6s, transform 0.6s'; actions.style.opacity = '1'; actions.style.transform = 'translateY(0)'; }
    await delay(300);
    if (terminal) { terminal.style.transition = 'opacity 0.8s, transform 0.8s'; terminal.style.opacity = '1'; terminal.style.transform = 'translateY(0)'; }
/* ── Dashboard tab switching ─────────────────────────────────────── */
(function() {
  const tabs = document.querySelectorAll('.dash-tab');
  if (!tabs.length) return;
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      const target = this.getAttribute('data-tab');
      tabs.forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
      var panel = document.getElementById('panel-' + target);
      if (panel) panel.classList.add('active');
    });
  });
})();

})();
})();

})();
