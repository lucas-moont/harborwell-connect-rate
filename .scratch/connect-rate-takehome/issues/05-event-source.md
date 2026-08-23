# Where the dashboard fetches events

Type: grilling
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

## Comments
