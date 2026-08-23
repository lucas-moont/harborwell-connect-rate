import { Console, type CaseView } from "./Console";
import { fetchEvents, EVENTS_URL } from "../lib/fetchEvents";
import {
  explain,
  inspectUser,
  isAcceptedUserData,
  isStructurallyMatchable,
  summarize,
} from "../lib/matchRate";

function pct(rate: number | null): string {
  if (rate === null) return "—";
  return `${Math.round(rate * 100)}%`;
}

export default async function Page() {
  let fixture;
  try {
    fixture = await fetchEvents();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return (
      <main className="fail">
        <p className="pill">Harborwell · ops</p>
        <h1>Connect rate is unavailable</h1>
        <p>The public event fixture did not load. This screen is the failure, not a fake 0%.</p>
        <p className="error">{message}</p>
      </main>
    );
  }

  const report = summarize(fixture.events);
  const cases: CaseView[] = report.rows.map((row, index) => {
    const collapsed = row.dropped;
    const accepted = !collapsed && isAcceptedUserData(row.event);
    const matched = accepted && isStructurallyMatchable(row.event);
    const user = row.event.user_data;
    const fields = inspectUser(user);
    const emailField = fields.find((field) => field.id === "email");
    const phoneField = fields.find((field) => field.id === "phone");
    return {
      index,
      label: row.event.label ?? "Purchase",
      source: row.event.source === "capi" ? "CAPI" : row.event.source,
      eventId: row.event.event_id ?? "(none)",
      value: typeof row.event.value === "number" ? row.event.value : null,
      counted: collapsed ? "collapsed" : accepted ? "in the rate" : "not accepted",
      matched,
      accepted,
      collapsed,
      why: collapsed ? row.dropReason : explain(row.event),
      email:
        !user.raw_email && !user.em
          ? "missing"
          : emailField?.status === "ok"
            ? `${user.raw_email ?? ""} · hash ok`
            : `${user.raw_email ?? "raw missing"} · hash does not match normalised raw`,
      phone:
        !user.raw_phone && !user.ph
          ? "missing"
          : phoneField?.status === "ok"
            ? `${user.raw_phone ?? ""} · country code ok`
            : `${user.raw_phone ?? "raw missing"} · not a well-formed phone key`,
      clickId: user.fbc || "missing",
      customerId: user.external_id || "missing",
      fields,
    };
  });

  return (
    <Console
      rate={pct(report.rate)}
      matchedCount={report.matchedCount}
      acceptedCount={report.acceptedCount}
      droppedCount={report.droppedCount}
      gistUrl={EVENTS_URL}
      cases={cases}
    />
  );
}
