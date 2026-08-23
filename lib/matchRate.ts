import { createHash } from "crypto";
import type { TrackingEvent, UserData } from "./types";

const HEX64 = /^[a-f0-9]{64}$/;
const FBC = /^fb\.\d+\.\d+\..+/;
const FBP = /^fb\.\d+\.\d+\.\d+$/;
const ISO = /^[A-Z]{3}$/;

export function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function keysOf(user: UserData): string[] {
  return Object.keys(user).filter((key) => {
    const value = user[key as keyof UserData];
    return value !== undefined && value !== null && value !== "";
  });
}

function subset(keys: string[], allowed: string[]): boolean {
  return keys.length > 0 && keys.every((key) => allowed.includes(key));
}

export function isPurchase(event: TrackingEvent): boolean {
  return (
    event.event_name === "Purchase" &&
    typeof event.value === "number" &&
    ISO.test(event.currency ?? "")
  );
}

export function isAcceptedUserData(event: TrackingEvent): boolean {
  const keys = keysOf(event.user_data);
  if (keys.length < 1) return false;
  if (subset(keys, ["ct", "country", "st", "zp", "ge", "client_user_agent"])) return false;
  if (subset(keys, ["db", "client_user_agent"])) return false;
  if (subset(keys, ["fn", "ge"])) return false;
  if (subset(keys, ["ln", "ge"])) return false;
  return true;
}

function wellEmail(user: UserData): boolean {
  if (!HEX64.test(user.em ?? "") || !user.raw_email) return false;
  return user.em === sha256(user.raw_email.trim().toLowerCase());
}

function wellPhone(user: UserData): boolean {
  if (!HEX64.test(user.ph ?? "") || !user.raw_phone) return false;
  const digits = user.raw_phone.replace(/\D/g, "");
  if (digits.length < 11) return false;
  return user.ph === sha256(digits);
}

function wellFbc(user: UserData): boolean {
  return FBC.test(user.fbc ?? "");
}

function wellFbp(user: UserData): boolean {
  return FBP.test(user.fbp ?? "");
}

function wellExternalId(user: UserData): boolean {
  return Boolean(user.external_id);
}

function wellIp(user: UserData): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(user.client_ip_address ?? "");
}

function wellUa(user: UserData): boolean {
  return Boolean(user.client_user_agent && user.client_user_agent.length > 3);
}

function wellLogin(user: UserData): boolean {
  return Boolean(user.fb_login_id);
}

export function isStructurallyMatchable(event: TrackingEvent): boolean {
  if (!isPurchase(event) || event.action_source !== "website" || !isAcceptedUserData(event)) {
    return false;
  }
  const user = event.user_data;
  return (
    wellEmail(user) ||
    wellFbc(user) ||
    wellPhone(user) ||
    wellExternalId(user) ||
    wellFbp(user) ||
    wellLogin(user) ||
    (wellIp(user) && wellUa(user))
  );
}

export function matchKeyList(user: UserData): string[] {
  const keys: string[] = [];
  if (wellEmail(user)) keys.push("email");
  if (wellFbc(user)) keys.push("click id");
  if (wellPhone(user)) keys.push("phone");
  if (wellExternalId(user)) keys.push("customer id");
  if (wellFbp(user)) keys.push("browser id");
  if (wellLogin(user)) keys.push("Facebook login");
  if (wellIp(user) && wellUa(user)) keys.push("IP + browser");
  return keys;
}

type Row = {
  event: TrackingEvent;
  dropped: boolean;
  dropReason: string;
};

function collapse(events: TrackingEvent[]): Row[] {
  const rows: Row[] = [];
  const indexByKey: Record<string, number> = {};

  for (const event of events) {
    const key = event.event_id ? `${event.event_name}|${event.event_id}` : null;
    const row: Row = { event, dropped: false, dropReason: "" };
    if (!key) {
      rows.push(row);
      continue;
    }
    if (indexByKey[key] === undefined) {
      indexByKey[key] = rows.length;
      rows.push(row);
      continue;
    }
    const previous = rows[indexByKey[key]];
    const delta = Math.abs((event.event_time ?? 0) - (previous.event.event_time ?? 0));
    if (delta > 48 * 3600) {
      rows.push(row);
      continue;
    }
    row.dropped = true;
    row.dropReason = `Same purchase id as the earlier ${previous.event.source} event — counted once`;
    if (event.source === "pixel" && previous.event.source !== "pixel" && delta <= 300) {
      previous.dropped = true;
      previous.dropReason = "Pixel twin arrived within 5 minutes — pixel kept";
      row.dropped = false;
      row.dropReason = "";
      rows[indexByKey[key]] = row;
      rows.push(previous);
      indexByKey[key] = rows.indexOf(row);
    } else {
      rows.push(row);
    }
  }

  return rows;
}

export function explain(event: TrackingEvent): string {
  if (!isPurchase(event)) return "Not a purchase";
  if (!isAcceptedUserData(event)) return "Customer fields too thin — not an accepted payload";
  if (event.action_source !== "website") return "Not a website event";
  if (!isStructurallyMatchable(event)) return "No well-formed match key";
  return `Matched on ${matchKeyList(event.user_data).join(", ")}`;
}

export type Report = {
  rows: Row[];
  acceptedCount: number;
  matchedCount: number;
  droppedCount: number;
  rate: number | null;
};

export function summarize(events: TrackingEvent[]): Report {
  const rows = collapse(events);
  const survivors = rows.filter((row) => !row.dropped).map((row) => row.event);
  const accepted = survivors.filter((event) => isPurchase(event) && isAcceptedUserData(event));
  const matched = accepted.filter(isStructurallyMatchable);
  return {
    rows,
    acceptedCount: accepted.length,
    matchedCount: matched.length,
    droppedCount: rows.filter((row) => row.dropped).length,
    rate: accepted.length ? matched.length / accepted.length : null,
  };
}
