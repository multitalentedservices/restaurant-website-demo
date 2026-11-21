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
