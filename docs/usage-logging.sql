create table if not exists usage_events (
  id uuid primary key,
  name text not null,
  occurred_at timestamptz not null,
  session_id text not null,
  path text not null,
  referrer text,
  locale text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists usage_events_occurred_at_idx
  on usage_events (occurred_at desc);

create index if not exists usage_events_name_idx
  on usage_events (name);

create index if not exists usage_events_session_id_idx
  on usage_events (session_id);
