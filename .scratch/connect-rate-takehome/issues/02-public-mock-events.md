# Public mock for event-shaped payloads

Type: research
Status: resolved
Label: wayfinder:research

## Question

Which **public** mock (no auth, CORS-friendly, stable URL) can serve a list of CAPI-shaped or funnel-shaped events so a Next.js dashboard can `fetch` it at runtime?

The take-home requires a public mock API. JSONPlaceholder has users/posts/comments — not purchases, UTMs, or user_data. Inventory options and the cost of each.

Cover at least:

- JSONPlaceholder: what it actually returns; why it cannot be the event source without a dishonest mapping.
- DummyJSON, Fake Store API, reqres, GitHub raw / gist JSON, jsonbin, mocky, and any first-party hosted JSON.
- CORS, rate limits, uptime, whether the payload can look like Meta CAPI `user_data` + `custom_data` + `event_id`.
- Whether we should fetch a public URL of our own fixture (raw GitHub / gist) versus stretching an existing fake store.
- A recommendation precise enough to pick in [Where the dashboard fetches events](05-event-source.md).

Write one cited Markdown file. Capture it on a throwaway `research/public-mock-events` branch. Do **not** open a PR.

## Answer

No stock fake-REST catalog (JSONPlaceholder, DummyJSON carts, Fake Store, reqres) returns CAPI-shaped events. Use a **public GitHub gist `raw_url` or `raw.githubusercontent.com` file we author** (CAPI `data[]` with `user_data` + `custom_data` + `event_id`). Do not map JSONPlaceholder `/posts` or DummyJSON/Fake Store carts — that grain is posts and shopping carts, not pixel/CAPI events.

GitHub raw/gist is no-auth and CORS `*`. DummyJSON Custom Response can host JSON but expires in 90 days. reqres `/api/users` is 401 without a key.

Full notes: `.scratch/connect-rate-takehome/research/public-mock-events.md` on branch `research/public-mock-events` (`git show research/public-mock-events:.scratch/connect-rate-takehome/research/public-mock-events.md`).

## Comments

Resolved by research subagent on throwaway branch `research/public-mock-events`. No PR.
