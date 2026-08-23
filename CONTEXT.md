# Harborwell connect rate

Ops language for whether a website Purchase can be matched to a person in Meta. Fictional DTC supplement brand; not a clone of a live store.

## Language

**Connect rate**:
The share of accepted website Purchases that carry at least one well-formed identifier Meta could use to match the event to an account, after collapsing pixel and CAPI twins.
_Avoid_: Event match quality, conversion rate, ROAS, pixel health

**Purchase**:
A website commerce event named Purchase with a numeric value and an ISO currency.
_Avoid_: Order, transaction, sale

**Accepted payload**:
A Purchase whose customer fields are present and not a geo-or-user-agent-only reject set.
_Avoid_: Valid event, tracked event, fired event

**Matched event**:
An accepted Purchase with at least one well-formed High, Medium, or web match key.
_Avoid_: Attributed, converted, identified customer

**CAPI event**:
The server copy of an event.
_Avoid_: Postback, server pixel

**Pixel event**:
The browser copy of an event.
_Avoid_: Tag, client event
