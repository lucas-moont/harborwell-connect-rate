"use client";

import { useState } from "react";
import type { FieldCheck } from "../lib/matchRate";

export type CaseView = {
  index: number;
  label: string;
  source: string;
  eventId: string;
  value: number | null;
  counted: string;
  matched: boolean;
  accepted: boolean;
  collapsed: boolean;
  why: string;
  email: string;
  phone: string;
  clickId: string;
  customerId: string;
  fields: FieldCheck[];
};

type Props = {
  rate: string;
  matchedCount: number;
  acceptedCount: number;
  droppedCount: number;
  gistUrl: string;
  cases: CaseView[];
};

export function Console({
  rate,
  matchedCount,
  acceptedCount,
  droppedCount,
  gistUrl,
  cases,
}: Props) {
  const [selected, setSelected] = useState(0);
  const current = cases[selected] ?? cases[0];

  return (
    <div className="b-shell">
      <aside className="b-rail">
        <span className="pill">Ops console</span>
        <p className="rail-title">Inspect a purchase</p>
        <div className="muted small">
          <p>Click a case. The inspector on the right should move. Try these three:</p>
          <ol>
            <li>iPhone, no click id → still matched (email).</li>
            <li>No customer fields → not accepted.</li>
            <li>Broken hash → looks hashed, not matched.</li>
          </ol>
        </div>
        <div className="b-btns">
          {cases.map((item) => (
            <button
              key={`${item.eventId}-${item.source}-${item.index}`}
              type="button"
              className={item.index === selected ? "chip on" : "chip"}
              onClick={() => setSelected(item.index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      <main className="b-main">
        <div className="b-pipe">
          <div className="b-node">
            <b>1 · Source</b>
            Public gist · CAPI JSON
          </div>
          <div className="b-node">
            <b>2 · Fetch</b>
            Server, no-store. Fail ≠ 0%
          </div>
          <div className="b-node">
            <b>3 · Collapse</b>
            Same id within 48h → one
          </div>
          <div className="b-node">
            <b>4 · Classify</b>
            Accepted? Then matched?
          </div>
          <div className="b-node">
            <b>5 · Rate</b>
            {rate}
          </div>
        </div>

        <div className="b-rate">
          {rate.replace("%", "")}
          <span>%</span>
        </div>
        <div className="b-formula">
          {matchedCount} matched <span>÷</span> {acceptedCount} accepted
          {droppedCount ? ` · ${droppedCount} twin collapsed` : ""}
        </div>

        <div className="tape">
          {cases.map((item) => (
            <button
              key={`tape-${item.index}`}
              type="button"
              className={`pill ${item.matched ? "ok" : item.accepted ? "mute" : "no"}${item.index === selected ? " on" : ""}`}
              onClick={() => setSelected(item.index)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="b-brief">
          <details open>
            <summary>What is this?</summary>
            <p>
              A take-home for Visual E-commerce: one ops number for a fictional DTC called Harborwell.
              It is not a storefront and not Meta&apos;s real account graph. It answers: of the website
              Purchases we would have sent toward CAPI, how many carried a well-formed identifier?
            </p>
          </details>
          <details>
            <summary>How it was made</summary>
            <p>
              Next.js + TypeScript. A public gist of CAPI-shaped JSON is fetched on the server. A pure
              <code> summarize()</code> collapses pixel/CAPI twins, then classifies each survivor. Git is
              meant to read as: scaffold → types → fetch → rate function → UI → memo.
            </p>
          </details>
          <details>
            <summary>Where the data comes from</summary>
            <p>
              Events come from a gist we authored — not JSONPlaceholder <code>/posts</code>. Posts are
              blog entries; mapping them to orders would invent commerce. Debug fields{" "}
              <code>raw_email</code> / <code>raw_phone</code> exist so hash quality can be checked. They
              would not be posted to Meta.
            </p>
            <p className="break">
              <a href={gistUrl} target="_blank" rel="noreferrer">
                Open the fixture JSON
              </a>
            </p>
          </details>
          <details>
            <summary>How the logic works</summary>
            <p>
              <b>Connect rate = matched ÷ accepted</b>, after collapsing twins that share a purchase id
              within 48h.
            </p>
            <ul>
              <li>
                <b>Accepted</b> — customer payload present, not geo/UA-only.
              </li>
              <li>
                <b>Matched</b> — well-formed email (SHA-256 of trimmed+lowercased raw), click id, phone
                with country code, customer id, browser id, Facebook login, or IP+UA.
              </li>
              <li>Empty payloads are out of the denominator. Broken hashes look like coverage and still fail match.</li>
            </ul>
          </details>
        </div>
      </main>

      <aside className="b-inspect">
        {current ? <Inspector item={current} /> : <p className="muted">No events loaded.</p>}
      </aside>
    </div>
  );
}

function Inspector({ item }: { item: CaseView }) {
  return (
    <div className="inspect">
      <p className="inspect-kicker">Selected purchase</p>
      <h2>{item.label}</h2>
      <div className="inspect-pills">
        <span className={`pill ${item.accepted ? "ok" : "mute"}`}>{item.counted}</span>
        <span className={`pill ${item.matched ? "ok" : "no"}`}>
          {item.matched ? "matched" : "not matched"}
        </span>
      </div>
      <p className="inspect-why">{item.why}</p>
      <dl>
        <dt>Source</dt>
        <dd>{item.source}</dd>
        <dt>Purchase id</dt>
        <dd>{item.eventId}</dd>
        <dt>Value</dt>
        <dd>{item.value === null ? "—" : `$${item.value}`}</dd>
        <dt>Email</dt>
        <dd>{item.email}</dd>
        <dt>Phone</dt>
        <dd>{item.phone}</dd>
        <dt>Click id</dt>
        <dd>{item.clickId}</dd>
        <dt>Customer id</dt>
        <dd>{item.customerId}</dd>
      </dl>
      <p className="inspect-label">Match keys</p>
      <ul className="inspect-keys">
        {item.fields.map((field) => (
          <li key={field.id} className={field.status}>
            <strong>
              {field.status === "ok" ? "usable" : field.status === "bad" ? "broken" : "missing"}
            </strong>
            <span>
              {field.label}
              {field.note ? ` — ${field.note}` : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
