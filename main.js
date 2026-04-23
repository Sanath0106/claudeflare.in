/* claudeflare.in */

(function () {
  'use strict';

  // ===== CONSOLE PROTECTION =====
  var noop = function () {};
  var _log = console.log.bind(console);
  var blocked = ['warn','error','table','dir','dirxml','group','groupEnd',
    'groupCollapsed','time','timeEnd','profile','profileEnd','count','assert','trace'];

  Object.defineProperty(window, 'console', {
    get: function () {
      return {
        log: function () {
          _log('%cHey. Nothing to see here.', 'color:#111;font-size:14px;font-weight:700;');
          _log('%cStatic site. No secrets. No tokens. No fun.', 'color:#999;font-size:11px;');
        },
        ...blocked.reduce(function (acc, k) { acc[k] = noop; return acc; }, {})
      };
    },
    set: noop,
    configurable: false
  });

  // DevTools timing detection
  var devOpen = false;
  setInterval(function () {
    var t = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    if (performance.now() - t > 80 && !devOpen) {
      devOpen = true;
      var el = document.getElementById('devtools-warn');
      if (el) el.style.display = 'flex';
    }
  }, 1500);

  // Block right-click and devtools shortcuts
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  document.addEventListener('keydown', function (e) {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) ||
      (e.ctrlKey && e.key === 'U')
    ) { e.preventDefault(); }
  });

  // ===== HAMBURGER NAV =====
  function initNav() {
    var btn   = document.getElementById('nav-hamburger');
    var links = document.getElementById('nav-links');
    if (!btn || !links) return;

    function close() {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }

    function open() {
      links.classList.add('open');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }

    btn.addEventListener('click', function () {
      links.classList.contains('open') ? close() : open();
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });

    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      if (Math.abs(window.scrollY - lastY) > 8) {
        close();
        lastY = window.scrollY;
      }
    }, { passive: true });

    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !links.contains(e.target)) close();
    });
  }

  // ===== SLIDER =====
  function initSlider() {
    var panels = document.querySelectorAll('.slider-panel');
    if (!panels.length) return;

    function activate(panel) {
      panels.forEach(function (p) {
        p.classList.remove('active');
        p.setAttribute('aria-expanded', 'false');
      });
      panel.classList.add('active');
      panel.setAttribute('aria-expanded', 'true');
    }

    panels.forEach(function (panel) {
      panel.addEventListener('mouseenter', function () { activate(panel); });
      panel.addEventListener('click',      function () { activate(panel); });
      panel.addEventListener('keydown',    function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(panel); }
      });
    });
  }

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initSlider();
  });

}());
