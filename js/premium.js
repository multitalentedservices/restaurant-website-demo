/* Saffron House (Demo) — PREMIUM LAYER (2026-11-22 upgrade)
   First Lenis + GSAP site in the portfolio. Loaded ONLY on
   index.html (the hero-led page); every other page keeps the
   untouched vanilla system.
     · Lenis 1.3.27 smooth scroll, synced to ScrollTrigger via
       the documented ticker pattern (lenis.on('scroll',
       ScrollTrigger.update) + gsap.ticker driving lenis.raf).
     · Hero headline: masked line-rise (transform only).
     · Section reveals: GSAP, 800–900ms, stagger 100ms/line,
       fire once at 88% viewport — award-median discipline.
     · Signature moment: ONE pinned chef/tandoor chapter
       (desktop), scrubbed image settle + line rises + a clay
       rule that draws itself. On small screens the same
       chapter is a simple once-only reveal — no pin.
   Honesty guards: if reduced motion is requested, or any
   library failed to load, this file does nothing at all —
   the page is complete and static, and main.js's reveal
   system is unaffected (GSAP targets carry data-motion,
   never the .reveal class, so the two systems never fight). */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Static capture mode (?static=1 / data-static): stand down like reduced
     motion — the complete static page, no pin, no Lenis, no from-states. */
  var STATIC = /[?&]static=1(?:&|$)/.test(window.location.search) || document.documentElement.hasAttribute('data-static');
  if (STATIC) document.documentElement.setAttribute('data-static', '');
  if (reduced || STATIC || !window.gsap || !window.ScrollTrigger || !window.Lenis) return;

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('lenis-on');

  var lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  /* Hero — masked line-rise + quiet supporting rise */
  gsap.from('.hero .lm-in', { yPercent: 112, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.1 });
  gsap.from('.hero-line, .hero-facts, .hero-actions', { y: 22, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.4 });

  /* Restrained section reveals — transform only, fire once */
  gsap.utils.toArray('[data-motion]').forEach(function (el) {
    gsap.from(el, {
      y: 26, duration: 0.85, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
  document.querySelectorAll('[data-motion-group]').forEach(function (group) {
    gsap.from(group.children, {
      y: 26, duration: 0.85, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: group, start: 'top 88%', once: true }
    });
  });

  /* The signature moment — pinned tandoor chapter */
  var chapter = document.getElementById('tandoor-chapter');
  if (chapter) {
    var mm = gsap.matchMedia();
    mm.add('(min-width: 920px)', function () {
      var tl = gsap.timeline({
        scrollTrigger: { trigger: chapter, start: 'top top+=72', end: '+=70%', pin: true, scrub: 0.6, anticipatePin: 1 }
      });
      tl.from(chapter.querySelectorAll('[data-chapter-line]'), { y: 44, duration: 0.9, stagger: 0.12, ease: 'power2.out' }, 0)
        .from(chapter.querySelector('.chapter-img'), { scale: 1.16, duration: 1.4, ease: 'none' }, 0)
        .from(chapter.querySelector('.chapter-rule'), { scaleX: 0, duration: 1.2, ease: 'none' }, 0);
    });
    mm.add('(max-width: 919px)', function () {
      gsap.from(chapter.querySelectorAll('[data-chapter-line]'), {
        y: 24, duration: 0.8, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: chapter, start: 'top 85%', once: true }
      });
    });
  }
})();
