-- Prospect Intelligence System
-- Replaces Clay with self-hosted AI-enriched prospecting

-- Verticals table
create table if not exists verticals (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  tier smallint not null default 2 check (tier between 1 and 3),
  close_speed smallint not null default 5 check (close_speed between 1 and 10),
  ai_awareness smallint not null default 5 check (ai_awareness between 1 and 10),
  automation_pain smallint not null default 5 check (automation_pain between 1 and 10),
  composite_score numeric generated always as (
    (close_speed + ai_awareness + automation_pain) / 3.0
  ) stored,
  rationale text,
  sales_nav_boolean text,
  google_alert_string text,
  job_posting_keywords text[] default '{}',
  signal_indicators text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_verticals_tier on verticals(tier);

-- Prospects table
create table if not exists prospects (
  id uuid primary key default gen_random_uuid(),
  vertical_id uuid references verticals(id) on delete set null,

  -- Company info
  company_name text not null,
  estimated_revenue text,
  location text,
  website text,

  -- Decision maker (enrichment)
  decision_maker_name text,
  decision_maker_title text,
  linkedin_url text,
  email_verified text,
  email_source text,

  -- AI-generated intelligence
  key_pain_point text,
  why_closes_fast text,
  trigger_event text,
  trigger_event_source text check (trigger_event_source in ('linkedin_post', 'job_posting', 'news', 'manual', 'ai_generated')),
  trigger_event_date date,
  tech_stack_signal text,
  tech_stack_source text check (tech_stack_source in ('job_posting', 'website', 'linkedin', 'ai_generated')),
  personalized_first_line text,
  cold_email_hook text,
  sales_nav_search_tip text,

  -- Scoring
  priority_score smallint default 0 check (priority_score between 0 and 100),
  score_breakdown jsonb default '{}',

  -- Sequence
  sequence_stage text default 'not_started' check (sequence_stage in (
    'not_started', 'warming_up', 'connected', 'dm_sent', 'email_sent',
    'follow_up_sent', 'breakup_sent', 'nurture', 'call_booked',
    'diagnostic_sold', 'lost', 'disqualified'
  )),

  -- Enrichment
  enrichment_status text default 'raw' check (enrichment_status in (
    'raw', 'partially_enriched', 'fully_enriched', 'stale'
  )),
  last_enriched_at timestamptz,
  ai_enrichment_log jsonb default '[]',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_prospects_vertical on prospects(vertical_id);
create index idx_prospects_priority on prospects(priority_score desc);
create index idx_prospects_stage on prospects(sequence_stage);
create index idx_prospects_enrichment on prospects(enrichment_status);

-- Outreach activities
create table if not exists outreach_activities (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid references prospects(id) on delete cascade not null,
  step_number smallint,
  channel text check (channel in (
    'linkedin_engage', 'linkedin_connect', 'linkedin_dm', 'email', 'phone', 'other'
  )),
  action_type text,
  content text,
  status text default 'draft' check (status in (
    'draft', 'sent', 'opened', 'replied', 'bounced', 'no_response'
  )),
  response_text text,
  responded_at timestamptz,
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_outreach_prospect on outreach_activities(prospect_id);
create index idx_outreach_status on outreach_activities(status);

-- Signal events
create table if not exists signal_events (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid references prospects(id) on delete cascade not null,
  signal_type text check (signal_type in (
    'linkedin_post', 'linkedin_comment', 'job_posting', 'news_mention',
    'google_alert', 'website_change', 'growth_announcement', 'ai_detected'
  )),
  signal_description text,
  signal_url text,
  signal_strength smallint default 5 check (signal_strength between 1 and 10),
  detected_at timestamptz default now(),
  detected_by text default 'manual' check (detected_by in ('manual', 'ai_scan')),
  actioned boolean default false,
  actioned_at timestamptz,
  action_taken text,
  created_at timestamptz default now()
);

create index idx_signals_prospect on signal_events(prospect_id);
create index idx_signals_actioned on signal_events(actioned) where actioned = false;

-- Outreach templates
create table if not exists outreach_templates (
  id uuid primary key default gen_random_uuid(),
  vertical_id uuid references verticals(id) on delete set null,
  sequence_tier smallint check (sequence_tier between 1 and 3),
  step_number smallint not null,
  channel text check (channel in (
    'linkedin_engage', 'linkedin_connect', 'linkedin_dm', 'email', 'phone', 'other'
  )),
  template_name text not null,
  subject_line text,
  body_template text not null,
  times_used integer default 0,
  reply_count integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_templates_tier_step on outreach_templates(sequence_tier, step_number);

-- RLS
alter table verticals enable row level security;
alter table prospects enable row level security;
alter table outreach_activities enable row level security;
alter table signal_events enable row level security;
alter table outreach_templates enable row level security;

create policy "Allow all for service role" on verticals for all using (true) with check (true);
create policy "Allow all for service role" on prospects for all using (true) with check (true);
create policy "Allow all for service role" on outreach_activities for all using (true) with check (true);
create policy "Allow all for service role" on signal_events for all using (true) with check (true);
create policy "Allow all for service role" on outreach_templates for all using (true) with check (true);
