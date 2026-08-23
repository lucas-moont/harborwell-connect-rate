# Meta EMQ and CAPI failure modes

Type: research
Label: wayfinder:research

## Question

What does Meta actually treat as a matchable Conversions API `Purchase`, and which DTC failure modes make Event Match Quality (EMQ) collapse?

Pull from **primary sources** (Meta developer docs, Events Manager / Dataset Quality API docs, CAPI parameter specs) — not agency blogs.

Cover at least:

- Customer information parameters that feed EMQ, and how they must be normalised/hashed.
- Role of `fbp`, `fbc` / `fbclid`, `external_id`, email, phone.
- Pixel + CAPI dedup via `event_id` (and what happens when it fails).
- Typical DTC breakage: upsell as a second `Purchase`, iOS traffic without `fbc`, subscription reorder with no click IDs, missing phone, hashed-but-malformed email.
- A definition of "matched" precise enough to encode as a pure function over a fixture of events (this unblocks [CAPI match-rate logic demo](03-capi-match-rate-logic.md)).

Write one cited Markdown file. Capture it on a throwaway `research/meta-emq-capi-failures` branch. Do **not** open a PR.

## Comments
