/* Saffron House (Demo) — screenshot + layout-audit runner.
   Usage: node shoot.js <outDir> [--nojs] [--probe320] [--flows]
   Clip-aware overflow audit (excludes skip-link and clipped-by-design elements),
   hidden-reveal audit, broken-image audit; full-page captures after scroll-through. */
const { chromium } = require('/home/hatch/workspace/tools/screenshot-engine/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const ROOT = '/home/hatch/workspace/portfolio-builds/restaurant-website-demo';
const EXEC = '/home/hatch/workspace/tools/screenshot-engine/browsers/chrome-headless-shell-linux64/chrome-headless-shell';
const OUT = process.argv[2];
const NOJS = process.argv.includes('--nojs');
const PROBE = process.argv.includes('--probe320');
const FLOWS = process.argv.includes('--flows');

const PAGES = [
  ['index', 'index.html'], ['menu', 'menu.html'], ['order', 'order.html'],
  ['reservations', 'reservations.html'], ['gallery', 'gallery.html'], ['visit', 'visit.html']
];
const VIEWPORTS = PROBE ? [['probe320', 320, 700]] : [['phone', 390, 844], ['tablet', 768, 1024], ['desktop', 1440, 900]];

async function auditPage(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const overflowX = document.documentElement.scrollWidth - vw;
    const bad = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > vw + 1 || r.left < -1)) {
        if (el.closest('.skip-link')) return;
        let clipped = false;
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const ox = window.getComputedStyle(a).overflowX;
          if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') { clipped = true; break; }
        }
        if (clipped) return;
        bad.push({ el: el.tagName.toLowerCase() + '.' + String(el.className).split(' ').join('.'), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) });
      }
    });
    const hiddenReveals = [];
    document.querySelectorAll('.reveal').forEach((el) => {
      if (parseFloat(window.getComputedStyle(el).opacity) < 0.05) hiddenReveals.push(el.tagName.toLowerCase());
    });
    const brokenImgs = [];
    document.querySelectorAll('img').forEach((im) => { if (im.complete && im.naturalWidth === 0) brokenImgs.push(im.getAttribute('src')); });
    return { overflowX, badEls: bad.slice(0, 12), hiddenCount: hiddenReveals.length, brokenImgs };
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: EXEC, args: ['--proxy-server=http://hatch-egress-proxy:3128', '--no-sandbox', '--force-color-profile=srgb'] });

  if (FLOWS) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    // 1. Menu filtered to Grill
    await page.goto('file://' + path.join(ROOT, 'menu.html'), { waitUntil: 'load' });
    await page.waitForTimeout(600);
    await page.click('.chip[data-cat="grill"]');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, 'flow-menu-filtered-grill.png') });
    console.log('FLOW menu-filtered count=', await page.textContent('#menuCount'));
    // 2. Order with items
    await page.click('#menuResults [data-add="beef-seekh-kebab"]');
    await page.goto('file://' + path.join(ROOT, 'order.html'), { waitUntil: 'load' });
    await page.waitForTimeout(600);
    await page.click('#pickList [data-add="chicken-karahi"]');
    await page.click('#pickList [data-add="roghni-naan"]');
    await page.click('#pickList [data-add="roghni-naan"]');
    await page.waitForTimeout(400);
    await page.locator('.order-panel').screenshot({ path: path.join(OUT, 'flow-order-with-items.png') });
    console.log('FLOW order total=', await page.textContent('#orderTotal'), 'wa href=', (await page.getAttribute('#waOrderBtn', 'href') || '').slice(0, 60));
    // 3. Reservation: invalid submit shows errors, then valid submit confirms
    await page.goto('file://' + path.join(ROOT, 'reservations.html'), { waitUntil: 'load' });
    await page.waitForTimeout(500);
    await page.click('#reserveForm button[type="submit"]');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, 'flow-reservation-errors.png') });
    await page.fill('#f-name', 'Ahmed Raza');
    await page.fill('#f-phone', '0300 1234567');
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    await page.fill('#f-date', tomorrow);
    await page.selectOption('#f-time', '20:00');
    await page.selectOption('#f-guests', '4');
    await page.click('#reserveForm button[type="submit"]');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, 'flow-reservation-confirmation.png') });
    console.log('FLOW confirmation visible=', await page.isVisible('#confirmBox'), 'ref=', await page.textContent('#c-ref'));
    await ctx.close();
    await browser.close();
    console.log('FLOWS DONE ->', OUT);
    return;
  }

  const report = {};
  for (const [vname, w, h] of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: !NOJS });
    const page = await ctx.newPage();
    for (const [pname, file] of PAGES) {
      await page.goto('file://' + path.join(ROOT, file), { waitUntil: 'load', timeout: 30000 }).catch(e => console.log('GOTO-ERR', pname, e.message.split('\n')[0]));
      await page.waitForTimeout(900);
      if (!NOJS) await page.evaluate(async () => {
        const step = Math.floor(window.innerHeight * 0.8);
        for (let y = 0; y <= document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 110)); }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(700);
      /* Wait until every reveal has fully settled (transition finished) — max 5s. */
      await page.waitForFunction(() => [...document.querySelectorAll('.reveal')].every(el => parseFloat(getComputedStyle(el).opacity) >= 0.99), null, { timeout: 5000 }).catch(() => {});
      const audit = await auditPage(page);
      await page.screenshot({ path: path.join(OUT, pname + '-' + vname + '.png'), fullPage: true });
      if (vname === 'phone') { await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(400); await page.screenshot({ path: path.join(OUT, pname + '-phone-top.png') }); }
      report[pname + '@' + vname] = audit;
      console.log('SHOT', pname, vname, 'overflowX=' + audit.overflowX, 'badEls=' + audit.badEls.length, 'hidden=' + audit.hiddenCount, 'broken=' + audit.brokenImgs.length);
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'audit.json'), JSON.stringify(report, null, 2));
  console.log('DONE ->', OUT);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
