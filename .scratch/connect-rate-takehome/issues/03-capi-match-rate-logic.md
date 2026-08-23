# CAPI match-rate logic demo

Type: prototype
Label: wayfinder:prototype
Blocked by: 01

## Question

Does this definition of "matched" hold when you actually click through the awkward cases?

Build a **logic** prototype (single HTML file, per `/prototype` LOGIC.md): a pure reducer/function, free-play buttons, and guided walkthroughs. No Next.js, no persistence.

The question to answer by clicking:

> A `Purchase` is matched iff it carries enough customer information that Meta could match it to an account. Does that rule still make sense for: duplicate upsell `Purchase`, email without `fbc`, subscription reorder, pixel + CAPI sharing one `event_id`, hashed-but-wrong email?

Walkthroughs to include at minimum:

- Happy path (email + phone + `fbp` + `fbc`)
- iOS / ITP: email present, no `fbc`
- Upsell: two `Purchase` events, same session, different `event_id`
- Dedup: pixel + CAPI, same `event_id` (count once in the denominator)
- Reorder: subscription, no click IDs
- Missing phone, email only
- Empty identifiers (should not match)

Surface full state after every action. Link the HTML as an asset on this ticket. The winning match rule lifts into the app; the HTML stays on a throwaway branch.

Do not resolve this ticket by picking the rule yourself — the human has to click and say what feels right.

## Comments
