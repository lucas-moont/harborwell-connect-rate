# Meta EMQ and CAPI failure modes

Type: research
Status: resolved
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

## Answer

A website CAPI `Purchase` is **matchable** when `user_data` is accepted (at least one customer-information parameter, not a geo/UA-only reject set) and at least one well-formed High/Medium/web key is present: SHA-256 of trimmed+lowercased email, unhashed `fbc` from `fbclid`, phone hashed **with country code**, `external_id`, `fbp`, or IP+UA. `value`/`currency` make it a Purchase; they do not match a person.

Pixel + CAPI with the same `event_id`+`event_name` on the same dataset within 48h count **once**. Missing `event_id` double-counts; reused `event_id` on an upsell under-counts.

EMQ collapses when High Click ID is absent (iOS/no `fbc`, subscription reorder), phone is missing or has no country code, or `em` is a hash of an un-normalised/invalid email.

Full notes: `.scratch/connect-rate-takehome/research/meta-emq-capi-failures.md` on branch `research/meta-emq-capi-failures` (`git show research/meta-emq-capi-failures:.scratch/connect-rate-takehome/research/meta-emq-capi-failures.md`).

## Comments

Resolved by research subagent on throwaway branch `research/meta-emq-capi-failures`. No PR.
