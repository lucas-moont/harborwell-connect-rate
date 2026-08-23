# Connect-rate take-home

Label: wayfinder:map

## Destination

A short, deployed Next.js dashboard (Vercel) plus a one-page memo a Head of Ops would actually read. The hero number is CAPI match rate on `Purchase`: events with enough identifiers to match in Meta ÷ all `Purchase` events. The live URL pastes into the Vision Ecommerce take-home. Thinking visible; polish not.

## Notes

- Domain: DTC supplements, growth engineering, pixel/CAPI tracking and attribution. Fictional brand only — do not clone Corvela Labs, Ritual Labs, or ritual.com.
- Skills every session should consult: grilling, domain-modeling, prototype (logic branch), research.
- Tracker: local markdown under `.scratch/connect-rate-takehome/` (no GitHub/Linear on this repo).
- This map **carries execution** once the way is clear: build and deploy are in-scope because the destination is a pasteable URL. Until then, tickets decide; they do not ship the app.
- Artifact language: English (job differentiator). README is a note to the Head of Ops: definition, numerator/denominator, exclusions, what would make the number lie.
- Stack default: Next.js App Router, TypeScript, Vercel.
- Git default to defend in grilling: honest session, one concern per commit, no fabricated timestamps.
- JSONPlaceholder `/posts` is not the event source. The test allows any public mock; pick one whose shape can support CAPI-like events.
- Refer to tickets by **name**, never by bare number.
- Brand: Harborwell (fictional). No UTM strip on v1 — connect rate is the only hero.

## Decisions so far

- [Meta EMQ and CAPI failure modes](issues/01-meta-emq-capi-failures.md) — CAPI match is `user_data` quality, not `value`/`currency`; High keys are email + `fbc`; pixel+CAPI dedup needs shared `event_id` within 48h. Notes: `research/meta-emq-capi-failures`.
- [Public mock for event-shaped payloads](issues/02-public-mock-events.md) — no stock mock is CAPI-shaped; host our own fixture on GitHub raw/gist. Notes: `research/public-mock-events`.
- [CAPI match-rate logic demo](issues/03-capi-match-rate-logic.md) — connect rate is matched ÷ accepted after collapsing twins; email-without-click-id still matches; empty payloads leave the denominator; broken hashes do not match. Demo: `prototype/capi-match-rate-logic`.
- [Git history the hiring manager reads](issues/04-git-history-narrative.md) — honest session; scaffold → types → fetch → `matchRate()` → UI → memo; HTML and research stay off `master`.
- [Where the dashboard fetches events](issues/05-event-source.md) — public gist of CAPI-shaped JSON; fail visibly; derive the rate from the payload. Raw: `https://gist.githubusercontent.com/lucas-moont/cfd60555fc517775496777fc38a2fbd2/raw/events.json`.

## Not yet specified

- Live deploy URL

## Out of scope

- Checkout autopsy and any checkout+dashboard hybrid (the take-home is OR; we took dashboard)
- JSONPlaceholder posts-as-commerce
- Cloning Corvela Labs / Ritual Labs / ritual.com
- Fabricated git dates
- Design system, auth, payments, real PII, Meta tokens
- Tests and error handling beyond what keeps the prototype and app runnable
- UTM coverage as a second hero
