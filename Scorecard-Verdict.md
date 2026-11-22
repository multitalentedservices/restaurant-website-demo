VISUAL QUALITY SCORECARD — VERDICT
Build: Saffron House (Demo) — Restaurant Website, Portfolio Queue #3  (client-facing owner: BalanceBit Solutions · production: MTS)
Build type / builder (AICOS-105–111): AICOS-108 (Restaurant & Food Website Builds) — executed by builder worker
Preview URL: none (not deployed — local file:// preview only)   Date of pass: 2026-11-21
Scored by: AICOS-115   Pass #: 1

 1. Visual identity & originality   12 / 15   Evidence: BUILD-NOTES.md design record (own ink/parchment/brick-clay system, Fraunces + Public Sans, references Eleven Madison Park + Noma); screenshots/index-desktop.png + index-phone.png match the record; layout is a printed-menu editorial system that could not belong to another industry. Missing: AICOS-112 formal §0 sign-off.
 2. UI/UX & usability               13 / 15   Evidence: screenshots/flow-menu-filtered-grill.png (filter → "5 dishes"), flow-order-with-items.png (order panel, live total), flow-reservation-errors.png + flow-reservation-confirmation.png (error + success states); ONE conversion goal (reservation) completed end-to-end in the flow run, ref SH-DEMO-9056.
 3. Typography & composition        9 / 10   Evidence: screenshots/menu-phone.png (serif menu names, dotted leaders, PKR prices), index-phone.png hierarchy at phone width; pairing as specified in BUILD-NOTES.md.
 4. Animation & interactions        8 / 10   Evidence: reveal-on-scroll + Ken Burns hero observed in captures (all reveals settled, 0 hidden in screenshots/audit.json); prefers-reduced-motion rules in css/style.css (visible-instant + animation off). Not separately screenshot-verified under emulated reduced motion this pass.
 5. Responsive design               10 / 10   Evidence: screenshots/audit.json — 18 page×viewport combos (390×844 / 768×1024 / 1440×900): 0 overflow, 0 hidden, 0 broken images; screenshots/probe320/audit.json — 6 pages at 320px: 0 overflow; every full-page PNG exactly viewport width (verified by file inspection).
 6. Functionality                   14 / 15   Evidence: tests.js + tests-output.log — 65/65 PASS (menu data, filter, order math, WhatsApp URL construction, reservation validation incl. past-date rejection, 122 internal refs resolve); flow run: order total Rs 3,080 exact (995 + 1,795 + 2×145), wa.me href built, confirmation state reached. WhatsApp click → localStorage order-log write is code-verified and the log renders (flow-order-with-items.png), but the click-through itself was not screenshot-captured (opens an external wa.me tab).
 7. Performance                     5 / 10   Evidence: weights measured — code 68.1 KB (< 400 KB), media 873 KB total, max image 115 KB (tests-output.log). Missing: served-preview Lighthouse / field Core Web Vitals (LCP/INP/CLS) — the build is not deployed, so no CWV numbers exist; not estimated.
 8. Accessibility                   4 / 5   Evidence: semantic HTML, skip link, aria labels/pressed/current, :focus-visible ring, ≥44px touch targets (chips 46px, qty buttons 44px, buttons 52px), alt text on all images, 16px form fonts — visible across screenshots/*.png. No formal keyboard-walk record filed this pass.
 9. SEO                             5 / 5   Evidence: unique title + meta description per page (test-verified), Restaurant JSON-LD on index/visit, sitemap.xml + robots.txt present, internal linking across all 6 pages (122 refs resolve, tests-output.log).
10. Security                        4 / 5   Evidence: zero third-party packages/CDN libraries (Google Fonts only), no secrets or credentials in source, no backend — forms are client-side demo states with validation; no known advisories (no dependencies to audit). HTTPS enforcement is a hosting property and the build is not deployed.

TOTAL: 84 / 100   (target ≥ 90)

BLOCKING FAILURES (security / data integrity / functionality):
- None. The ONE conversion goal (reservation → demo confirmation) completes; the WhatsApp order path completes; no security or data-integrity findings.

UNTESTED AREAS (score invalid without evidence):
- None scored as untested. Areas 1, 4, 6, 7, 8 carry named partial evidence (see above) and were scored down for it rather than marked untested.

VERDICT:  [ ] APPROVE   [X] REJECT   [ ] REJECT — BLOCKED   [ ] REJECT — INCOMPLETE
Reasons (defects as: what is wrong · where · what fixed looks like):
- Score 84 < 90 — evidence-bar rejection, same pattern as Gift Basket #2 (81). No blocking failures and no code defects found in this pass; the missing points are evidence completions, not build defects.
- Missing evidence 1: served-preview Lighthouse/CWV · Area 7 · fixed by deploying a preview (Gate 7, Asad's decision) and filing a measured Lighthouse report.
- Missing evidence 2: AICOS-112 formal §0 sign-off · Area 1 · fixed by the design owner's recorded sign-off against BUILD-NOTES.md.
- Missing evidence 3: reduced-motion emulated capture + keyboard-walk record · Areas 4/8 · fixed by one short QA pass filing both artefacts.
- Minor note (not scored down twice): order.js renders the per-line price span with one inline style attribute (colour only, from the project palette) — cosmetic consistency item for a future tidy pass, no layout impact.

Next step: [ ] To AICOS-025 release gate   [X] Back to Gate 5 (evidence completions only)   [ ] Back to Gate 2

Test-battery disclosure: NO assertion was amended. tests.js was written fresh for this project and passed 65/65 as written (tests-output.log).

---

## Addendum — Re-verification FIX RUN (2026-11-21, later the same day)

Independent re-verification (`Reverification-2026-11-21/REPORT.md`) found 2 visible defects,
both in the header. Both FIXED, re-shot and read; battery **65/65 PASS** unamended after fixes:

- **R-1 (visible) — desktop header mis-built on all 6 pages.** The `<nav class="site-nav">` sat
  OUTSIDE the `.wrap` container as a sibling of the header row, so the nav row started flush at
  x=0 and the CTA pill straddled the header's bottom border. Fix: the nav now lives INSIDE
  `.wrap.header-in` on all 6 pages (flex-wrap row: wordmark · nav · toggle; the mobile panel
  takes a full-width second row inside the same container). Proof (DOM probe, all 6 pages,
  1440px): wordmark left = 180px (container edge), CTA fully inside the header (bottom 95 ≤
  header bottom 107); `fix-restaurant/*-desktop.png` read page by page.
- **R-2 (visible) — header "Reserve a table" label near-black on brick (~2:1), and INVISIBLE
  (solid empty pill) on reservations.html.** Root cause: `.site-nav a{color:ink}` out-specified
  `.btn-primary`, and `.site-nav a[aria-current="page"]{color:clay}` painted the current-page
  CTA brick-on-brick. Fix: nav colour rules now scope to `a:not(.btn)`, so the CTA keeps the
  button system's parchment-on-brick everywhere, current page included. Proof (computed styles,
  all 6 pages + open mobile menu): CTA colour rgb(246,241,232) on rgb(156,61,46), text
  "Reserve a table" present; `fix-restaurant/reservations-desktop.png` shows the labelled pill.
- **Same-family audit fix (no defect was filed against this site):** the scroll reveal gated
  opacity (`.js .reveal{opacity:0}` + IO). Replaced with the v3 pattern — opacity never gated,
  position-only rise — so no section can freeze blank at any scroll speed, matching the fix
  applied to Gift Basket / Real Estate. Re-shoot: 12 page×viewport combos, 0 blank / 0 overflow.

**Score: unchanged at 84/100 — REJECT (evidence bar only).** Held points remain served-preview
CWV, the AICOS-112 §0 sign-off, and keyboard-walk + reduced-motion captures.

---

## Addendum — PREMIUM UPGRADE, Ladder #3 (2026-11-22)

First Lenis + GSAP site in the portfolio, per Premium-Standard-and-Library-Plan §5.
Battery: **65/65 PASS unamended before AND after.** Console: 0 errors, 0 page errors
across all captures. All 6 pages re-shot at 390 + 1440 full-page: 0 overflow.

What was added (index.html only carries the library stack):
- **Lenis 1.3.27 + GSAP 3.15.1 + ScrollTrigger** (vendored in assets/vendor/), synced
  via the documented ticker pattern. Probe-verified live (html carries Lenis classes,
  gsap.version 3.15.1). Reduced-motion probe: Lenis OFF, no pin-spacer, page complete.
- **Signature moment — pinned tandoor chapter**: pin + scrub (image scale 1.16→1,
  chapter lines rise at 120ms stagger, clay rule draws). Mid-pin frame captured and
  read (screenshots/signature-moment.png). One defect found and fixed during the pass:
  the pin originally started at viewport top and the sticky header clipped the chapter
  kicker — pin now starts at top+=72px, re-captured clean. On <920px the chapter is a
  simple once-only reveal (no pin), verified in a phone viewport capture.
- **Hero**: masked two-line rise (900ms, 100ms stagger) + quiet supporting rise;
  transform-only, so a failed library load leaves the headline fully visible.
- **Section reveals**: GSAP, 850ms, 100ms stagger, fire once at 88% viewport,
  transform-only (the v3 no-blank rule preserved; GSAP targets never carry .reveal).
- **Menu as typography** (menu.html, CSS-only): category headings at display serif
  (measured 33.6px), dish names 21.1px, more air — same data, leaders and prices;
  filter re-probed (31 dishes → 5 grill).
- **Booking spine**: a Reserve band (site's own button system + phone link) now ends
  the signatures and reviews sections on index, and closes menu, gallery and visit.

JS weight (gzip, measured): index (hero) **56.4 KB** total (existing 4.4 + GSAP 27.8 +
ScrollTrigger 17.6 + Lenis 5.3 + premium.js 1.4) ≤ 90 budget · plain pages unchanged
at 2.9–5.9 KB ≤ 20. No Alpine/Three.js on this site (not in its §5 outline).

PREMIUM GATE: P1 PASS (base link/list rules untouched; screenshots re-read, 0 default
links) · P2 PASS (Lenis on the hero-led page only; other pages keep native scroll by
plan) · P3 PASS (exactly one pinned scene; reveals at award medians, once, 88%) ·
P4 PARTIAL (Fraunces hero at clamp(2.4rem,7vw,4.2rem) — deliberate fine-dining
restraint per GEM/Zimmerl references, below statement-hero scale; kickers provide the
second voice) · P5 PASS (real charcoal-grill photography + Ken Burns, no slider) ·
P6 PASS (reservation + WhatsApp order depth pre-existing; booking spine deepens the
conversion path) · P7 PARTIAL (hover/focus/active in-system everywhere; View
Transitions not assigned to this site in §5 and not added) · P8 PASS on JS budgets;
CWV still unmeasured (no served preview — held, not estimated) · P9 PASS
(reduced-motion + no-JS captures read; chapter complete and static in both) ·
P10 PASS (fictional/demo labelling untouched; no content or prices changed).

**Re-score: 88 / 100 (was 84) — REJECT, evidence bar only.** Gains: Animation &
interactions 8→10 (real signature scene + disciplined reveals), Typography 9→10
(menu as typography), UI/UX 13→14 (booking spine). Held points unchanged:
served-preview CWV, AICOS-112 §0 sign-off, keyboard-walk record.
