/* Saffron House (Demo) — menu page: render from data, filter tabs + search, add-to-order. */
(function () {
  'use strict';
  var D = window.SAFFRON_DATA, L = window.SAFFRON_LOGIC;
  var listEl = document.getElementById('menuResults');
  var countEl = document.getElementById('menuCount');
  var searchEl = document.getElementById('menuSearch');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var activeCat = 'all';

  function tagText(item) {
    var parts = [];
    item.tags.forEach(function (t) { parts.push(t === 'V' ? '(V) vegetarian' : '(S) spicy'); });
    if (item.signature) parts.push('House signature');
    return parts.join(' · ');
  }
  function render() {
    var items = L.filterMenu(D.MENU, activeCat, searchEl ? searchEl.value : '');
    countEl.textContent = items.length + (items.length === 1 ? ' dish' : ' dishes');
    if (!items.length) { listEl.innerHTML = '<p>No dishes match — try another category or search.</p>'; return; }
    var html = '', lastCat = null;
    items.forEach(function (item) {
      if (item.cat !== lastCat) {
        var cat = D.CATEGORIES.find(function (c) { return c.id === item.cat; });
        html += '<div class="menu-cat"><h3>' + cat.label + '</h3></div>';
        lastCat = item.cat;
      }
      html += '<div class="mi"><div class="mi-main"><p class="mi-name">' + item.name + '</p>' +
        '<p class="mi-desc">' + item.desc + (tagText(item) ? ' · <em>' + tagText(item) + '</em>' : '') + '</p></div>' +
        '<span class="mi-dots" aria-hidden="true"></span><p class="mi-price">' + L.formatPKR(item.price) + '</p>' +
        '<button class="add-btn" data-add="' + item.id + '" aria-label="Add ' + item.name + ' to your WhatsApp order">Add +</button></div>';
    });
    listEl.innerHTML = html;
  }
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      activeCat = chip.getAttribute('data-cat');
      render();
    });
  });
  if (searchEl) searchEl.addEventListener('input', render);
  listEl.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-add]');
    if (!btn) return;
    window.SaffronOrder.add(btn.getAttribute('data-add'));
    btn.textContent = 'Added ✓';
    setTimeout(function () { btn.textContent = 'Add +'; }, 1200);
    updateOrderLink();
  });
  var orderLink = document.getElementById('menuOrderLink');
  function updateOrderLink() {
    if (!orderLink) return;
    var n = L.orderCount(window.SaffronOrder.load());
    orderLink.textContent = n > 0 ? 'View your order (' + n + ' items)' : 'Start a WhatsApp order';
  }
  render(); updateOrderLink();
})();
