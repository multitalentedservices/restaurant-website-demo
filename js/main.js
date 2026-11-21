/* Saffron House (Demo) — shared behaviour: mobile nav, reveal-by-default, footer year. */
(function () {
  'use strict';
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* Reveal: content is visible by default; .js class (set inline in <head>) enables the hidden start state. */
  var reveals = document.querySelectorAll('.reveal');
  function revealAll() { reveals.forEach(function (el) { el.classList.add('revealed'); }); }
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px 300px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    setTimeout(revealAll, 2000); /* unconditional safety fallback */
  }
})();
