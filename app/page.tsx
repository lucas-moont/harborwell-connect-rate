import { fetchEvents } from "../lib/fetchEvents";
import { explain, isAcceptedUserData, isStructurallyMatchable, summarize } from "../lib/matchRate";

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
      <main className="wrap">
        <p className="tag">Harborwell · ops</p>
        <h1>Connect rate is unavailable</h1>
        <p className="lede">
          The public event fixture did not load. This screen is the failure, not a fake 0%.
        </p>
        <p className="error">{message}</p>
      </main>
    );
  }

  const report = summarize(fixture.events);

  return (
    <main className="wrap">
      <p className="tag">Harborwell · ops</p>
      <h1>Connect rate</h1>
      <p className="lede">
        Share of accepted website Purchases that carry at least one well-formed
        identifier Meta could use to match the event to a person, after collapsing
        pixel and CAPI twins.
      </p>

      <section className="board">
        <div className="hero">
          <strong>{pct(report.rate)}</strong>
          <span>
            {report.matchedCount} matched / {report.acceptedCount} accepted
            {report.droppedCount ? ` · ${report.droppedCount} twin collapsed` : ""}
          </span>
        </div>
      </section>

      <section>
        <h2>What is in this number</h2>
        <ul>
          <li>
            <b>Numerator</b> — accepted website Purchases with a well-formed email,
            click id, phone (country code), customer id, browser id, or IP+UA.
          </li>
          <li>
            <b>Denominator</b> — Purchases whose customer payload is present and not
            a geo/UA-only reject set.
          </li>
          <li>
            <b>Collapsed</b> — pixel + CAPI copies that share a purchase id within 48h
            count once.
          </li>
        </ul>
      </section>

      <section>
        <h2>Event log</h2>
        <table>
          <thead>
            <tr>
              <th>What fired</th>
              <th>Source</th>
              <th>Purchase id</th>
              <th>Counted?</th>
              <th>Matched?</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            {report.rows.map((row, index) => {
              const collapsed = row.dropped;
              const accepted = !collapsed && isAcceptedUserData(row.event);
              const matched = accepted && isStructurallyMatchable(row.event);
              const why = collapsed ? row.dropReason : explain(row.event);
              const countedLabel = collapsed ? "collapsed" : accepted ? "in the rate" : "not accepted";
              return (
                <tr key={`${row.event.event_id}-${row.event.source}-${index}`} className={collapsed || !accepted ? "drop" : ""}>
                  <td>
                    {row.event.label ?? "Purchase"}
                    {typeof row.event.value === "number" ? ` · $${row.event.value}` : ""}
                  </td>
                  <td>{row.event.source}</td>
                  <td>{row.event.event_id || "(none)"}</td>
                  <td>
                    <span className={accepted ? "pill yes" : "pill mute"}>
                      {countedLabel}
                    </span>
                  </td>
                  <td>
                    <span className={matched ? "pill yes" : "pill no"}>
                      {matched ? "yes" : "no"}
                    </span>
                  </td>
                  <td>{why}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}
