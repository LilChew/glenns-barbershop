const test = require('node:test');
const assert = require('node:assert');
const B = require('../booking.js');

test('available slots run from 09:00 to 16:00 and skip booked ones', () => {
  const all = B.availableSlots([]);
  assert.strictEqual(all[0], '09:00');
  assert.strictEqual(all[all.length - 1], '16:00');
  assert.strictEqual(all.length, 8);
  assert.ok(!B.availableSlots(['10:00']).includes('10:00'));
});

test('same-day and future dates are accepted, past dates are not', () => {
  const now = new Date(2026, 2, 10, 14, 30); // 10 March 2026, 2:30pm
  assert.strictEqual(B.isFutureDate('2026-03-10', now), true);
  assert.strictEqual(B.isFutureDate('2026-03-11', now), true);
  assert.strictEqual(B.isFutureDate('2026-03-09', now), false);
  assert.strictEqual(B.isFutureDate('', now), false);
});

test('phone numbers: dashes, spaces and a leading + are fine; letters are not', () => {
  assert.strictEqual(B.isValidPhone('408-555-0123'), true);
  assert.strictEqual(B.isValidPhone('+1 408 555 0123'), true);
  assert.strictEqual(B.isValidPhone('4085550123'), true);
  assert.strictEqual(B.isValidPhone('call me'), false);
  assert.strictEqual(B.isValidPhone('123'), false);
});

test('total adds the tip as a number, even when it arrives as text', () => {
  assert.strictEqual(B.total(['haircut'], ''), 30);
  assert.strictEqual(B.total(['haircut', 'beard'], '5'), 50);
  assert.strictEqual(B.total(['beard'], '2.5'), 17.5);
});

test('confirmation message uses the customer name', () => {
  const msg = B.confirmation({ name: ' Dana ', service: 'haircut', date: '2026-03-11', slot: '10:00' });
  assert.ok(msg.includes('Thanks Dana,'), msg);
  assert.ok(!msg.includes('undefined'), msg);
});

test('submitBooking books a valid slot once and rejects a double booking', () => {
  const now = new Date(2026, 2, 10, 9, 0);
  const booked = [];
  const form = { name: 'Dana', phone: '408-555-0123', service: 'haircut', date: '2026-03-10', slot: '10:00', tip: '' };
  const first = B.submitBooking(form, booked, now);
  assert.strictEqual(first.ok, true);
  assert.deepStrictEqual(booked, ['10:00']);
  const second = B.submitBooking(form, booked, now);
  assert.strictEqual(second.ok, false);
  assert.ok(second.errors.slot);
});
