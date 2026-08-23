# Harborwell connect rate

A one-screen ops dashboard for **Harborwell**, a fictional DTC supplement brand. It answers a single question: of the website Purchases we sent toward Meta, how many could actually be matched to a person?

Live fixture: [CAPI-shaped events gist](https://gist.githubusercontent.com/lucas-moont/cfd60555fc517775496777fc38a2fbd2/raw/events.json).

## The number

**Connect rate = matched Purchases / accepted Purchases**, after collapsing pixel + CAPI twins that share a purchase id within 48 hours.

- **Purchase** — `event_name` Purchase, numeric value, ISO currency.
- **Accepted** — customer fields are present and not a geo/user-agent-only reject set.
- **Matched** — accepted website Purchase with at least one well-formed High/Medium/web key: email (SHA-256 of trimmed, lowercased raw), click id (`fbc`), phone hashed with country code, customer id, browser id (`fbp`), Facebook login, or IP + user agent.

This is **structural matchability**, not Meta's private account graph. We cannot see whether Meta actually bound the event. We can see whether the payload was good enough to try.

## What is excluded

Empty customer payloads are not accepted, so they do not sit in the denominator. That is deliberate: they never became matchable events.

Pixel and CAPI copies of the same purchase id count once. Missing `event_id` on one of the twins would double-count — that is a tracking bug, and the dashboard would show it.

## What would make this number lie

- Hashing email without normalising (the fixture includes that case: coverage looks fine, match is no).
- Phone without a country code.
- Treating JSONPlaceholder `/posts` as orders. Those objects are blog posts. Mapping `title` to a SKU would invent commerce that was never sent.
- Reporting Event Match Quality as connect rate. EMQ is Meta's 0–10 score. Connect rate here is the share of accepted Purchases with a usable key. An iPhone checkout without `fbc` still matches on email; EMQ would drop anyway.

## The fixture on purpose

The public JSON is ugly on purpose: a clean checkout, an iPhone checkout with no click id, a pixel/server twin, an upsell, a subscription renewal, email-only, an empty payload, a broken email hash, and a phone missing its country code.

`raw_email` / `raw_phone` are debug fields so we can check hash quality. They are not part of a real CAPI post.

## Run

```bash
npm install
npm run dev
```
