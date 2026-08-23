# CAPI match-rate logic demo

Type: prototype
Status: resolved
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

## Answer

**Connect rate** = matched Purchases ÷ accepted Purchases after collapsing pixel+CAPI twins that share `event_name` + `event_id` within 48 hours (keep one).

- **Purchase**: `event_name` Purchase, numeric `value`, ISO currency.
- **Accepted**: `user_data` present and not a geo/UA-only reject set.
- **Matched**: accepted website Purchase with at least one well-formed High/Medium/web key: email (hash of trimmed+lowercased raw), click id (`fbc`), phone hashed with country code, customer id, browser id (`fbp`), Facebook login, or IP+UA.

| Case | Verdict |
| --- | --- |
| Full identifiers | Matched |
| iPhone, email, no click id | Matched. EMQ would drop; connect rate should not. |
| Upsell, two purchase ids | Two rows in the denominator |
| Pixel + server, same id | One row |
| Subscription renewal, no click id | Matched on email/phone/customer id |
| Email only | Matched. Memo notes Meta may still fail in the wild. |
| Empty customer payload | Not accepted — out of the denominator |
| Email hashed without normalising | Coverage-looking, not matched |

We do not bind Meta's private account graph. The number is structural matchability. Demo HTML stays on `prototype/capi-match-rate-logic`.

## Comments

Demo: `.scratch/connect-rate-takehome/prototype/capi-match-rate.html` on `prototype/capi-match-rate-logic`. Locked from the research rule plus those cases. Human asked to proceed without waiting.
