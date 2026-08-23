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

## Decisions so far

<!-- empty at charting; one line per closed ticket -->

## Not yet specified

- Dashboard UI, once the match rule exists
- Memo / README copy
- Fictional brand name
- Whether UTM coverage appears as a quality strip, not the hero
- Final mock payload shape (after [Public mock for event-shaped payloads](issues/02-public-mock-events.md) and [CAPI match-rate logic demo](issues/03-capi-match-rate-logic.md))

## Out of scope

- Checkout autopsy and any checkout+dashboard hybrid (the take-home is OR; we took dashboard)
- JSONPlaceholder posts-as-commerce
- Cloning Corvela Labs / Ritual Labs / ritual.com
- Fabricated git dates
- Design system, auth, payments, real PII, Meta tokens
- Tests and error handling beyond what keeps the prototype and app runnable
