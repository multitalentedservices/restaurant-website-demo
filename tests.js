/* Saffron House (Demo) — Node test battery. Run: node tests.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = __dirname;
const D = require(path.join(ROOT, 'js/data.js'));
const L = require(path.join(ROOT, 'js/logic.js'));
let pass = 0, fail = 0; const failures = [];
function ok(name, cond) { if (cond) { pass++; console.log('PASS  ' + name); } else { fail++; failures.push(name); console.log('FAIL  ' + name); } }
function eq(name, a, b) { ok(name + ' [' + JSON.stringify(a) + ' === ' + JSON.stringify(b) + ']', a === b); }

/* --- Menu data integrity --- */
ok('menu has >= 28 items', D.MENU.length >= 28);
eq('menu item count is 31', D.MENU.length, 31);
ok('all ids unique', new Set(D.MENU.map(m => m.id)).size === D.MENU.length);
ok('every item has name/desc/price>0', D.MENU.every(m => m.name && m.desc && m.price > 0));
ok('every item category exists', D.MENU.every(m => D.CATEGORIES.some(c => c.id === m.cat)));
ok('every category has >= 4 items', D.CATEGORIES.every(c => D.MENU.filter(m => m.cat === c.id).length >= 4));
ok('at least 3 signature dishes', D.MENU.filter(m => m.signature).length >= 3);
ok('reviews: 4 demo reviews, stars 1-5', D.REVIEWS.length === 4 && D.REVIEWS.every(r => r.stars >= 1 && r.stars <= 5));

/* --- Filter logic --- */
eq('filter all returns all', L.filterMenu(D.MENU, 'all', '').length, 31);
eq('filter grill returns 5', L.filterMenu(D.MENU, 'grill', '').length, 5);
eq('filter desserts returns 4', L.filterMenu(D.MENU, 'desserts', '').length, 4);
ok('search karahi finds karahis', L.filterMenu(D.MENU, 'all', 'karahi').length >= 2);
eq('search within category respects both', L.filterMenu(D.MENU, 'breads', 'naan').length, 2);
eq('search no match returns 0', L.filterMenu(D.MENU, 'all', 'sushi-zzz').length, 0);

/* --- Order math --- */
const order = { 'beef-seekh-kebab': 2, 'roghni-naan': 4, 'kashmiri-chai': 1 };
eq('order total 2*995+4*145+1*445', L.orderTotal(D.MENU, order), 3015);
eq('order count', L.orderCount(order), 7);
eq('order lines count', L.orderLines(D.MENU, order).length, 3);
eq('empty order total 0', L.orderTotal(D.MENU, {}), 0);
eq('unknown id ignored', L.orderTotal(D.MENU, { 'nope': 3 }), 0);
eq('zero qty ignored', L.orderTotal(D.MENU, { 'lassi': 0 }), 0);

/* --- WhatsApp construction --- */
const msg = L.buildWhatsAppMessage(D.MENU, order, 'Ahmed');
ok('message lists kebab line', msg.includes('2 x Beef Seekh Kebab'));
ok('message has formatted total', msg.includes('Total: Rs 3,015'));
ok('message includes name', msg.includes('Name: Ahmed'));
const url = L.buildWhatsAppURL(D.MENU, order, '');
ok('URL starts with wa.me demo number', url.startsWith('https://wa.me/923001234567?text='));
ok('URL is encoded (no raw newlines)', !url.includes('\n') && url.includes('%0A'));

/* --- Reservation validation (today fixed for determinism) --- */
const TODAY = '2026-11-21';
const good = { name: 'Ahmed Raza', phone: '0300 1234567', date: '2026-11-22', time: '20:00', guests: '4' };
eq('valid reservation passes', Object.keys(L.validateReservation(good, TODAY)).length, 0);
ok('past date rejected', !!L.validateReservation({ ...good, date: '2026-11-20' }, TODAY).date);
ok('today accepted', !L.validateReservation({ ...good, date: TODAY }, TODAY).date);
ok('empty name rejected', !!L.validateReservation({ ...good, name: '' }, TODAY).name);
ok('1-char name rejected', !!L.validateReservation({ ...good, name: 'A' }, TODAY).name);
ok('bad phone rejected', !!L.validateReservation({ ...good, phone: '12345' }, TODAY).phone);
ok('+92 phone accepted', !L.validateReservation({ ...good, phone: '+923001234567' }, TODAY).phone);
ok('landline rejected', !!L.validateReservation({ ...good, phone: '04235750123' }, TODAY).phone);
ok('missing time rejected', !!L.validateReservation({ ...good, time: '' }, TODAY).time);
ok('too-early time rejected', !!L.validateReservation({ ...good, time: '09:00' }, TODAY).time);
ok('0 guests rejected', !!L.validateReservation({ ...good, guests: '0' }, TODAY).guests);
ok('21 guests rejected', !!L.validateReservation({ ...good, guests: '21' }, TODAY).guests);

/* --- Link integrity across all pages --- */
const pages = ['index.html', 'menu.html', 'order.html', 'reservations.html', 'gallery.html', 'visit.html'];
let linkChecks = 0, linkBad = [];
pages.forEach(p => {
  const html = fs.readFileSync(path.join(ROOT, p), 'utf8');
  const refs = [...html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)].map(m => m[1]);
  refs.forEach(r => {
    if (/^(https?:|tel:|mailto:)/.test(r)) return;
    linkChecks++;
    const target = path.join(ROOT, decodeURIComponent(r.split('?')[0]));
    if (!fs.existsSync(target)) linkBad.push(p + ' -> ' + r);
  });
  /* demo labelling + title per page */
  ok(p + ' has demo ribbon', html.includes('demo-ribbon'));
  ok(p + ' has footer demo note', html.includes('Demo note'));
  ok(p + ' has a <title>', /<title>.+<\/title>/.test(html));
});
ok('all internal href/src resolve (' + linkChecks + ' refs)', linkBad.length === 0);
if (linkBad.length) console.log('  broken: ' + linkBad.join('; '));
const titles = pages.map(p => (fs.readFileSync(path.join(ROOT, p), 'utf8').match(/<title>(.+)<\/title>/) || [])[1]);
ok('page titles unique', new Set(titles).size === pages.length);

/* --- Weights + assets --- */
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
const codeFiles = walk(ROOT).filter(f => /\.(html|css|js)$/.test(f) && !f.includes('tests.js') && !f.includes('shoot'));
const codeBytes = codeFiles.reduce((s, f) => s + fs.statSync(f).size, 0);
ok('code weight < 400 KB (actual ' + (codeBytes / 1024).toFixed(1) + ' KB)', codeBytes < 400 * 1024);
const imgs = walk(path.join(ROOT, 'assets')).filter(f => /\.jpg$/.test(f));
const imgBytes = imgs.reduce((s, f) => s + fs.statSync(f).size, 0);
ok('8 photos present', imgs.length === 8);
ok('each photo <= 120 KB (max ' + Math.round(Math.max(...imgs.map(f => fs.statSync(f).size)) / 1024) + ' KB)', imgs.every(f => fs.statSync(f).size <= 120 * 1024));
ok('media total <= 1.6 MB (actual ' + (imgBytes / 1024).toFixed(0) + ' KB)', imgBytes <= 1.6 * 1024 * 1024);
ok('sitemap.xml exists', fs.existsSync(path.join(ROOT, 'sitemap.xml')));
ok('robots.txt exists', fs.existsSync(path.join(ROOT, 'robots.txt')));
ok('index has Restaurant JSON-LD', fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').includes('"@type":"Restaurant"'));
ok('no lorem ipsum anywhere', !pages.some(p => /lorem/i.test(fs.readFileSync(path.join(ROOT, p), 'utf8'))));

console.log('\n=== ' + pass + ' passed, ' + fail + ' failed ===');
if (failures.length) console.log('Failures: ' + failures.join(' | '));
process.exit(fail ? 1 : 0);
