# Public mock for event-shaped payloads

Type: research
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

## Comments
