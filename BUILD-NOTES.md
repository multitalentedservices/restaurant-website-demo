# BUILD NOTES — Saffron House (Demo) · Portfolio Queue #3

**Restaurant (fictional):** Saffron House — Grill & Kitchen, 14-B Main Boulevard, Gulberg III, Lahore. Demo phone 0300 123 4567. All copy, menu, prices and reviews are fictional demo data.

## Design identity (own system — NOT Gift Basket's)
Gift Basket used cream #FAF7F2 / emerald #1E3F32 / terracotta #D96B52. This build uses a darker, print-menu editorial system:

| Token | Value | Role |
|---|---|---|
| `--ink` | #1E1B18 | near-black warm charcoal — text, dark sections |
| `--ink-2` | #2A2521 | raised dark surface |
| `--paper` | #F6F1E8 | warm parchment page background |
| `--paper-2` | #EFE6D8 | parchment tint — cards, bands |
| `--clay` | #9C3D2E | deep brick-clay — primary accent, buttons, prices |
| `--clay-dark` | #7E2F24 | clay shade — hover |
| `--clay-tint` | #F3DDD6 | clay tint — badges, demo ribbon |
| `--stone` | #6B6259 | muted warm grey — secondary text |
| `--line` | #DDD2C0 | hairlines, dotted menu leaders |
| error | #B3261E | semantic error red — the ONLY extra hue |

**Type pairing:** Fraunces (editorial serif, display + menu item names) + Public Sans (UI/body). Distinct from Gift Basket's pairing.

**Photography:** 8 generated photos, ONE style — editorial food photography, dark charcoal table/backdrop, warm soft window light, parchment + brick-red accents, no faces, no text. Compressed JPEG ≤120 KB each, ~905 KB total. No video (region-blocked 403 — settled fact); hero uses a subtle Ken Burns CSS motion, disabled under reduced motion.

## References consulted (Gate 2 record)
1. **Eleven Madison Park** (elevenmadisonpark.com, opened 2026-11-21; also Design Inspiration Library R1) — restraint, photography-led story, reservation path permanently one click away. Taken: persistent "Reserve a table" CTA in the header; experience-first homepage order (hero → signatures → story → reviews → visit).
2. **Noma** (via ManyPixels restaurant collection, opened 2026-11-21) — "more editorial than commercial": minimal text, bold photography, generous space. Taken: menu composed like a printed editorial menu (serif names, dotted leaders, prices in PKR) rather than e-commerce cards.
3. Design Inspiration Library R2 (One White Street) — practical facts (hours, address) in the first screen. Taken: hero facts strip (open today / find us / call us).

## ONE conversion goal
**Primary: a completed reservation** (reservations.html form → confirmation state). WhatsApp ordering is the secondary path, fully working, one tap from every page.

## Pages (6)
- `index.html` — Home: hero, signature dishes, story teaser, reviews, visit panel
- `menu.html` — Full menu from `js/data.js`, category filter tabs + search, add-to-order
- `order.html` — WhatsApp ordering: build an order, quantities, live total, wa.me link, order log
- `reservations.html` — Reservation form with live validation + demo confirmation
- `gallery.html` — Photo gallery (the 8 project photos)
- `visit.html` — About/Visit + Contact: story, hours, styled map panel (Open in Google Maps link — no iframe, so it can never render broken), contact details

## Integrations (demo data only)
- Menu: rendered client-side from `js/data.js` (31 items, 6 categories, PKR prices)
- Reservations: client-side validation + demo confirmation state, labelled demo
- WhatsApp: order builds a real `wa.me/923001234567` link with the order prefilled; every click is recorded to a localStorage order log (`saffron_order_log`) shown on order.html — the "tracking" integration, demo data
- Google Maps: styled visit panel + `https://www.google.com/maps/search/?api=1&query=...` link (no iframe)
- Google reviews: review cards with demo reviews, labelled as demo reviews

## DEMO labelling
Demo ribbon on every page + footer demo note on every page + "Demo" in every page title.

## Photos & GitHub
Photos are local files in `assets/`. The GitHub connector pushes TEXT files only, so the 8 JPGs are NOT in the GitHub push — the pushed HTML references them by relative path and they live in this workspace folder. Never claim the photos were pushed.
