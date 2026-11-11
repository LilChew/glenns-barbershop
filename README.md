# Glenn's Barbershop booking page

A small static page where customers book a haircut or beard trim.

- `index.html`: the page (open it in a browser, no build step)
- `booking.js`: booking rules (slots, dates, phone check, price, confirmation text)
- `tests/`: unit tests, run with `npm test` (Node 18+)

Rules: open 09:00–17:00 with hourly slots (the last slot starts at 16:00); same-day bookings are allowed;
phone numbers may contain spaces, dashes and a leading +; the tip is added to the price of the service.
