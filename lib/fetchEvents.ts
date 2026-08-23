import type { Fixture } from "./types";

export const EVENTS_URL =
  "https://gist.githubusercontent.com/lucas-moont/cfd60555fc517775496777fc38a2fbd2/raw/events.json";

export async function fetchEvents(): Promise<Fixture> {
  const response = await fetch(EVENTS_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Event source returned ${response.status}`);
  }
  const body: unknown = await response.json();
  if (
    !body ||
    typeof body !== "object" ||
    !Array.isArray((body as Fixture).events)
  ) {
    throw new Error("Event source did not return a CAPI-shaped events list");
  }
  return body as Fixture;
}
