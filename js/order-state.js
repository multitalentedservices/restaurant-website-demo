/* Saffron House (Demo) — shared order state (localStorage) used by menu + order pages. */
(function () {
  'use strict';
  var KEY = 'saffron_order';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(order) { try { localStorage.setItem(KEY, JSON.stringify(order)); } catch (e) {} }
  window.SaffronOrder = {
    load: load, save: save,
    add: function (id) { var o = load(); o[id] = (o[id] || 0) + 1; save(o); return o; },
    setQty: function (id, qty) { var o = load(); if (qty <= 0) delete o[id]; else o[id] = qty; save(o); return o; }
  };
})();
