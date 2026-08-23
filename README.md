# Harborwell connect rate

A take-home ops console for **Harborwell**, a fictional DTC supplement brand. It answers one question: of the website Purchases we would have sent toward Meta CAPI, how many carried a well-formed identifier?

This is **structural matchability**, not Meta's private account graph and not Event Match Quality. We cannot see whether Meta bound the event. We can see whether the payload was good enough to try.

Live: https://harborwell-connect-rate.vercel.app  
Repo: https://github.com/lucas-moont/harborwell-connect-rate  
Fixture: [CAPI-shaped events gist](https://gist.githubusercontent.com/lucas-moont/cfd60555fc517775496777fc38a2fbd2/raw/events.json)

## How it was made

Next.js (App Router) + TypeScript. The server fetches the gist with `cache: "no-store"`. If that fetch fails, the page says so — it does not render a fake 0%.

A pure `summarize()` in `lib/matchRate.ts` collapses pixel/CAPI twins, then classifies each survivor. The UI is a console: click a purchase on the left, read the verdict on the right.

Git is meant to read as: scaffold → types → fetch → rate function → UI → memo → console.

## The number

**Connect rate = matched Purchases ÷ accepted Purchases**, after collapsing pixel + CAPI twins that share `event_name` + `event_id` within 48 hours.

| Term | Meaning |
| --- | --- |
| Purchase | `event_name` Purchase, numeric `value`, ISO `currency` |
| Accepted | `user_data` present and not a geo/UA-only reject set |
| Matched | accepted website Purchase with at least one well-formed key: email (SHA-256 of trimmed, lowercased raw), click id (`fbc`), phone hashed with country code, customer id, browser id (`fbp`), Facebook login, or IP + user agent |
| Collapsed | pixel and CAPI copies of the same purchase id count once |

Empty payloads are **not accepted**, so they do not sit in the denominator. They never became matchable events.

## Where the data comes from

The events are a public gist we authored in CAPI shape. They are not JSONPlaceholder `/posts`. Posts are blog entries; mapping `title` to a SKU would invent commerce that was never sent.

`raw_email` / `raw_phone` are debug fields so hash quality can be checked. They would not be posted to Meta.

## How to audit this yourself

Open the live console. Click a purchase on the left. The inspector on the right should change. These three cases are the review:

1. **iPhone Safari checkout** — no click id, still **matched** on email. EMQ would drop; this number should not.
2. **No customer fields** — **not accepted**, out of the rate. Not a fake 0% in the denominator.
3. **Broken email hash** — looks hashed, **not matched**. Coverage is not quality.

Also worth a click: **Browser pixel Purchase** and **Server copy of the same Purchase** share `evt_twin`. One of them should show as collapsed.

On the current fixture that is **6 matched / 8 accepted → 75%**, with one twin collapsed.

## What would make this number lie

- Hashing email without normalising (the fixture includes that case).
- Phone without a country code.
- Treating JSONPlaceholder `/posts` as orders.
- Reporting Event Match Quality as connect rate. EMQ is Meta's 0–10 score. An iPhone checkout without `fbc` still matches on email here; EMQ would drop anyway.
- Missing `event_id` on one of a pixel/CAPI pair. That would double-count. It is a tracking bug, and the console would show two rows.

## Run

```bash
npm install
npm run dev
```
