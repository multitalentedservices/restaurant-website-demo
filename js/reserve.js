/* Saffron House (Demo) — reservation form: live-clearing validation + demo confirmation state. */
(function () {
  'use strict';
  var L = window.SAFFRON_LOGIC;
  var form = document.getElementById('reserveForm');
  var confirmBox = document.getElementById('confirmBox');
  var fields = ['name', 'phone', 'date', 'time', 'guests'];
  var dateEl = document.getElementById('f-date');
  if (dateEl) dateEl.min = new Date().toISOString().slice(0, 10);

  function values() {
    return {
      name: document.getElementById('f-name').value,
      phone: document.getElementById('f-phone').value,
      date: document.getElementById('f-date').value,
      time: document.getElementById('f-time').value,
      guests: document.getElementById('f-guests').value
    };
  }
  function showErrors(errors) {
    fields.forEach(function (f) {
      var wrap = document.getElementById('field-' + f);
      var msg = document.getElementById('err-' + f);
      if (errors[f]) { wrap.classList.add('invalid'); msg.textContent = errors[f]; }
      else { wrap.classList.remove('invalid'); msg.textContent = ''; }
    });
  }
  /* Live clearing: re-validate ONLY the edited field; clear its error the moment it becomes valid. */
  fields.forEach(function (f) {
    var input = document.getElementById('f-' + f);
    input.addEventListener('input', function () {
      var wrap = document.getElementById('field-' + f);
      if (!wrap.classList.contains('invalid')) return;
      var errors = L.validateReservation(values());
      if (!errors[f]) { wrap.classList.remove('invalid'); document.getElementById('err-' + f).textContent = ''; }
    });
    input.addEventListener('blur', function () {
      var errors = L.validateReservation(values());
      if (errors[f] && input.value) showErrors(pick(errors, f));
    });
  });
  function pick(obj, key) { var o = {}; if (obj[key]) o[key] = obj[key]; return o; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = values();
    var errors = L.validateReservation(v);
    showErrors(errors);
    if (Object.keys(errors).length) {
      var first = document.querySelector('.field.invalid input, .field.invalid select');
      if (first) first.focus();
      return;
    }
    document.getElementById('c-name').textContent = v.name.trim();
    document.getElementById('c-when').textContent = v.date + ' at ' + v.time;
    document.getElementById('c-guests').textContent = v.guests;
    document.getElementById('c-phone').textContent = v.phone.trim();
    document.getElementById('c-ref').textContent = 'SH-DEMO-' + Math.floor(1000 + Math.random() * 9000);
    form.hidden = true;
    confirmBox.hidden = false;
    confirmBox.setAttribute('tabindex', '-1');
    confirmBox.focus();
    window.scrollTo({ top: confirmBox.offsetTop - 90, behavior: 'smooth' });
  });
  document.getElementById('bookAnother').addEventListener('click', function () {
    form.reset(); showErrors({}); form.hidden = false; confirmBox.hidden = true;
  });
})();
