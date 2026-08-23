export type EventSource = "pixel" | "capi";

export type UserData = {
  em?: string;
  raw_email?: string;
  ph?: string;
  raw_phone?: string;
  fbc?: string;
  fbp?: string;
  external_id?: string;
  fb_login_id?: string;
  client_ip_address?: string;
  client_user_agent?: string;
  ct?: string;
  country?: string;
  st?: string;
  zp?: string;
  ge?: string;
  db?: string;
  fn?: string;
  ln?: string;
};

export type TrackingEvent = {
  label?: string;
  event_name: string;
  event_time: number;
  action_source: string;
  event_id?: string;
  source: EventSource;
  value?: number;
  currency?: string;
  user_data: UserData;
};

export type Fixture = {
  brand?: string;
  note?: string;
  events: TrackingEvent[];
};
