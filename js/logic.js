/* Saffron House (Demo) — pure logic: menu filter, order math, WhatsApp message, reservation validation.
   Loaded in the browser (window.SAFFRON_LOGIC) and in Node for the test battery (module.exports). */
(function (global) {
  'use strict';

  function formatPKR(n) {
    return 'Rs ' + Number(n).toLocaleString('en-PK');
  }

  function filterMenu(menu, cat, query) {
    var q = (query || '').trim().toLowerCase();
    return menu.filter(function (item) {
      if (cat && cat !== 'all' && item.cat !== cat) return false;
      if (q && (item.name + ' ' + item.desc).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
  }

  /* Order is an object: { itemId: qty } */
  function orderLines(menu, order) {
    return Object.keys(order).filter(function (id) { return order[id] > 0; }).map(function (id) {
      var item = menu.find(function (m) { return m.id === id; });
      if (!item) return null;
      return { id: id, name: item.name, price: item.price, qty: order[id], lineTotal: item.price * order[id] };
    }).filter(Boolean);
  }

  function orderTotal(menu, order) {
    return orderLines(menu, order).reduce(function (sum, l) { return sum + l.lineTotal; }, 0);
  }

  function orderCount(order) {
    return Object.keys(order).reduce(function (sum, id) { return sum + Math.max(0, order[id] || 0); }, 0);
  }

  var WHATSAPP_NUMBER = '923001234567'; // demo number

  function buildWhatsAppMessage(menu, order, name) {
    var lines = orderLines(menu, order);
    var out = ['Assalam-o-Alaikum Saffron House, I would like to order:'];
    lines.forEach(function (l) {
      out.push(l.qty + ' x ' + l.name + ' — ' + formatPKR(l.lineTotal));
    });
    out.push('Total: ' + formatPKR(orderTotal(menu, order)));
    if (name && name.trim()) out.push('Name: ' + name.trim());
    out.push('(Sent from the Saffron House demo website)');
    return out.join('\n');
  }

  function buildWhatsAppURL(menu, order, name) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildWhatsAppMessage(menu, order, name));
  }

  /* Reservation validation. values: {name, phone, date, time, guests}; todayStr: 'YYYY-MM-DD' (injectable for tests) */
  function validateReservation(values, todayStr) {
    var errors = {};
    var name = (values.name || '').trim();
    if (name.length < 2) errors.name = 'Please enter your name (at least 2 characters).';
    var phone = (values.phone || '').replace(/[\s-]/g, '');
    if (!/^(\+92|0)?3\d{9}$/.test(phone)) errors.phone = 'Please enter a valid Pakistani mobile number, e.g. 0300 1234567.';
    var today = todayStr || new Date().toISOString().slice(0, 10);
    if (!values.date) errors.date = 'Please choose a date.';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) errors.date = 'Please choose a valid date.';
    else if (values.date < today) errors.date = 'That date is in the past — please choose today or later.';
    if (!values.time) errors.time = 'Please choose a time.';
    else if (values.time < '12:00' || values.time > '23:30') errors.time = 'We seat guests between 12:00 pm and 11:30 pm.';
    var guests = parseInt(values.guests, 10);
    if (isNaN(guests) || guests < 1 || guests > 20) errors.guests = 'Guests must be between 1 and 20.';
    return errors;
  }

  var api = {
    formatPKR: formatPKR, filterMenu: filterMenu, orderLines: orderLines,
    orderTotal: orderTotal, orderCount: orderCount, buildWhatsAppMessage: buildWhatsAppMessage,
    buildWhatsAppURL: buildWhatsAppURL, validateReservation: validateReservation,
    WHATSAPP_NUMBER: WHATSAPP_NUMBER
  };
  global.SAFFRON_LOGIC = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
