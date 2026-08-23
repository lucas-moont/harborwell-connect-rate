# Git history the hiring manager reads

Type: grilling
Status: resolved
Label: wayfinder:grilling

## Question

What should `git log` look like when the hiring manager opens the repo?

This is a take-home. They will read commits as a proxy for how you work. The history has to be historically logical — one concern per commit, messages that say why — without fabricating dates or a fake multi-day narrative.

Default to defend, one question at a time:

- Honest single session versus staged "day 1 / day 2" timestamps.
- Suggested sequence: `scaffold` → event types → fetch → pure `matchRate()` → minimal UI → memo.
- Whether the throwaway logic HTML belongs in `main` or only on `prototype/capi-match-rate`.
- Whether research branches are linked from the README or stay off `main`.
- Conventional Commits versus plain English.

Resolve when the human has locked a commit recipe the implementation session will follow.

## Answer

Honest single session. No fake timestamps.

Commit recipe for the app: `scaffold` → event types → fetch from the public fixture → pure `matchRate()` → minimal UI → memo.

Throwaway HTML stays on `prototype/capi-match-rate-logic`, not `master`. Research stays on `research/*`. README may point at those branches in one line; it does not merge them.

Commit messages in plain English, one concern each.

## Comments

Resolved from the default the human already asked to defend, with autonomy to lock it.
