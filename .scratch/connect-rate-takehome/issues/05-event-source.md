# Where the dashboard fetches events

Type: grilling
Status: resolved
Label: wayfinder:grilling
Blocked by: 02

## Question

Where does the deployed dashboard `fetch` its events from?

The take-home says "pulls from a public mock API". Options will come from [Public mock for event-shaped payloads](02-public-mock-events.md). Pick one.

Default to defend: a public fixture whose shape is CAPI-like (GitHub raw or gist), plus one sentence in the memo explaining why JSONPlaceholder `/posts` is the wrong grain.

Grill until the human has locked:

- The exact URL (or the decision to publish a gist/raw file as that URL).
- What happens if the mock is down (fail visibly, not silently empty).
- Whether the app may reshape the payload client-side or must display the mock as-is.

## Answer

Public GitHub gist (raw URL) of a CAPI-shaped JSON fixture we author. JSONPlaceholder `/posts` is blog posts — mapping that to purchases would be a lie.

If the gist is down or returns non-JSON, the dashboard shows an error. It does not render 0%.

The app **may** derive connect rate from the payload (that is the work). Event rows in the UI follow the fixture fields; we do not invent commerce data that was not sent.

Exact gist URL is recorded in the app once published (task of implementation).

## Comments

Resolved from research + the default we already chose to defend.
