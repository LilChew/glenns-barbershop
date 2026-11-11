// Booking logic for the barbershop page. Pure functions, so they can be tested without a browser.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Booking = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var PRICES = { haircut: 30, beard: 15, 'haircut+beard': 40 };
  var OPEN_HOUR = 9;   // first slot starts at 09:00
  var CLOSE_HOUR = 17; // shop closes at 17:00, so the last slot starts at 16:00

  function pad(n) { return String(n).padStart(2, '0'); }

  function today(now) {
    return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  }

  // Hourly slots that are not already booked.
  function availableSlots(booked) {
    var slots = [];
    for (var h = OPEN_HOUR; h < CLOSE_HOUR - 1; h++) {
      var s = pad(h) + ':00';
      if (booked.indexOf(s) === -1) slots.push(s);
    }
    return slots;
  }

  // Same-day bookings are allowed; past days are not. dateStr is YYYY-MM-DD.
  function isFutureDate(dateStr, now) {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && new Date(dateStr) > now;
  }

  // Accepts +1 408 555 0123, 408-555-0123, 4085550123 ...
  function isValidPhone(phone) {
    return /^\+?[0-9][0-9\s]{6,14}[0-9]$/.test(String(phone || '').trim());
  }

  // services: list of keys from PRICES. tip: dollars, as typed in the form (a string).
  function total(services, tip) {
    var sum = 0;
    services.forEach(function (s) { sum += PRICES[s] || 0; });
    return Math.round((sum + (tip || 0)) * 100) / 100;
  }

  function validate(form, booked, now) {
    var errors = {};
    if (!String(form.name || '').trim()) errors.name = 'Please enter your name.';
    if (!isValidPhone(form.phone)) errors.phone = 'Please enter a valid phone number.';
    if (!PRICES[form.service]) errors.service = 'Please pick a service.';
    if (!isFutureDate(form.date, now)) errors.date = 'Please pick today or a future date.';
    if (availableSlots(booked).indexOf(form.slot) === -1) errors.slot = 'That time is not available.';
    return { ok: Object.keys(errors).length === 0, errors: errors };
  }

  function confirmation(form) {
    return 'Thanks ' + form.fullName + ', you are booked for ' + form.service +
      ' on ' + form.date + ' at ' + form.slot + '.';
  }

  // Books the slot (adds it to `booked`) when the form is valid.
  function submitBooking(form, booked, now) {
    var v = validate(form, booked, now);
    if (!v.ok) return { ok: false, errors: v.errors, message: 'Please fix the highlighted fields.' };
    booked.push(form.slot);
    return { ok: true, errors: {}, message: confirmation(form), total: total([form.service], form.tip) };
  }

  return { PRICES: PRICES, availableSlots: availableSlots, isFutureDate: isFutureDate,
           isValidPhone: isValidPhone, total: total, validate: validate,
           confirmation: confirmation, submitBooking: submitBooking };
});
