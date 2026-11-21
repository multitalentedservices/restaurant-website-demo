/* Saffron House (Demo) — order page: pick dishes, quantities, live total, WhatsApp link + order log (tracking, demo). */
(function () {
  'use strict';
  var D = window.SAFFRON_DATA, L = window.SAFFRON_LOGIC;
  var pickEl = document.getElementById('pickList');
  var linesEl = document.getElementById('orderLines');
  var totalEl = document.getElementById('orderTotal');
  var waBtn = document.getElementById('waOrderBtn');
  var nameEl = document.getElementById('orderName');
  var logEl = document.getElementById('orderLog');
  var LOG_KEY = 'saffron_order_log';

  /* Pick list grouped by category */
  var html = '';
  D.CATEGORIES.forEach(function (cat) {
    html += '<div class="menu-cat"><h3>' + cat.label + '</h3></div>';
    D.MENU.filter(function (m) { return m.cat === cat.id; }).forEach(function (item) {
      html += '<div class="mi"><div class="mi-main"><p class="mi-name">' + item.name + '</p><p class="mi-desc">' + item.desc + '</p></div>' +
        '<span class="mi-dots" aria-hidden="true"></span><p class="mi-price">' + L.formatPKR(item.price) + '</p>' +
        '<button class="add-btn" data-add="' + item.id + '" aria-label="Add ' + item.name + '">Add +</button></div>';
    });
  });
  pickEl.innerHTML = html;
  pickEl.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-add]');
    if (!btn) return;
    window.SaffronOrder.add(btn.getAttribute('data-add'));
    render();
  });

  function renderLog() {
    var log = [];
    try { log = JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch (e) {}
    if (!log.length) { logEl.innerHTML = '<li>No WhatsApp orders sent yet from this browser (demo log).</li>'; return; }
    logEl.innerHTML = log.slice(-5).reverse().map(function (entry) {
      return '<li>' + entry.when + ' — ' + entry.items + ' items · ' + L.formatPKR(entry.total) + ' (demo log)</li>';
    }).join('');
  }

  function render() {
    var order = window.SaffronOrder.load();
    var lines = L.orderLines(D.MENU, order);
    if (!lines.length) {
      linesEl.innerHTML = '<p>Your order is empty — add a dish from the list.</p>';
    } else {
      linesEl.innerHTML = lines.map(function (l) {
        return '<div class="order-line"><span class="ol-name">' + l.name + '<br><small>' + L.formatPKR(l.price) + ' each</small></span>' +
          '<button class="qty-btn" data-dec="' + l.id + '" aria-label="One less ' + l.name + '">−</button>' +
          '<strong aria-label="Quantity">' + l.qty + '</strong>' +
          '<button class="qty-btn" data-inc="' + l.id + '" aria-label="One more ' + l.name + '">+</button>' +
          '<span class="price" style="color:var(--clay-tint)">' + L.formatPKR(l.lineTotal) + '</span></div>';
      }).join('');
    }
    var total = L.orderTotal(D.MENU, order);
    totalEl.textContent = L.formatPKR(total);
    if (lines.length) {
      waBtn.removeAttribute('disabled');
      waBtn.setAttribute('href', L.buildWhatsAppURL(D.MENU, order, nameEl.value));
    } else {
      waBtn.setAttribute('disabled', '');
      waBtn.removeAttribute('href');
    }
    renderLog();
  }
  linesEl.addEventListener('click', function (e) {
    var inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]');
    var order = window.SaffronOrder.load();
    if (inc) window.SaffronOrder.setQty(inc.getAttribute('data-inc'), (order[inc.getAttribute('data-inc')] || 0) + 1);
    if (dec) window.SaffronOrder.setQty(dec.getAttribute('data-dec'), (order[dec.getAttribute('data-dec')] || 0) - 1);
    if (inc || dec) render();
  });
  nameEl.addEventListener('input', render);
  waBtn.addEventListener('click', function () {
    var order = window.SaffronOrder.load();
    var lines = L.orderLines(D.MENU, order);
    if (!lines.length) return;
    var log = [];
    try { log = JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch (e) {}
    log.push({ when: new Date().toLocaleString('en-PK'), items: L.orderCount(order), total: L.orderTotal(D.MENU, order) });
    try { localStorage.setItem(LOG_KEY, JSON.stringify(log)); } catch (e) {}
    renderLog();
  });
  render();
})();
