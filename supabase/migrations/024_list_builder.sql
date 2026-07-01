-- CappaWork OS GTM Engine
-- Canonical CRM: accounts, contacts, lists, signals, hypotheses, outreach.
-- Lists discover accounts; accounts are the system of record (not prospects).

-- Provider settings (API keys stored server-side only)
create table if not exists provider_settings (
  id uuid primary key default gen_random_uuid(),
  provider text unique not null check (provider in ('apollo', 'whitewhale', 'clay')),
  api_key_encrypted text,
  is_active boolean default true,
  config jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ICP lists: reusable prospecting searches
create table if not exists lists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vertical_id uuid references verticals(id) on delete set null,
  description text,
  icp_template text,
  source_provider text not null default 'apollo'
    check (source_provider in ('apollo', 'csv', 'crm', 'inbound', 'manual')),
  status text not null default 'draft'
    check (status in ('draft', 'generating', 'review', 'enriching', 'scoring', 'ready', 'archived')),
  total_accounts int default 0,
  total_contacts int default 0,
  avg_fit_score smallint default 0,
  enrichment_status text default 'pending'
    check (enrichment_status in ('pending', 'partial', 'complete', 'failed')),
  signal_status text default 'pending'
    check (signal_status in ('pending', 'partial', 'complete', 'failed')),
  notes text,
  created_by text not null,
  last_run_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_lists_status on lists(status);
create index idx_lists_created_by on lists(created_by);

create table if not exists list_search_criteria (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references lists(id) on delete cascade unique not null,
  industries text[] default '{}',
  geographies text[] default '{}',
  employee_min int,
  employee_max int,
  revenue_min numeric,
  revenue_max numeric,
  company_keywords text[] default '{}',
  excluded_keywords text[] default '{}',
  technologies text[] default '{}',
  job_titles text[] default '{}',
  seniority_levels text[] default '{}',
  departments text[] default '{}',
  founder_led_min_score smallint,
  website_keywords text[] default '{}',
  signals_required text[] default '{}',
  signals_excluded text[] default '{}',
  case_study_match text,
  min_fit_score smallint,
  max_records int default 100,
  enrichment_depth text default 'standard'
    check (enrichment_depth in ('minimal', 'standard', 'deep'))
);

create table if not exists list_runs (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references lists(id) on delete cascade not null,
  run_type text not null
    check (run_type in ('generate', 'enrich', 'score', 'signal_fetch', 'hypothesis', 'promote', 'import')),
  provider text,
  inngest_run_id text,
  status text not null default 'pending'
    check (status in ('pending', 'running', 'completed', 'failed', 'cancelled')),
  input_criteria jsonb default '{}',
  records_processed int default 0,
  records_total int,
  credits_consumed numeric default 0,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create index idx_list_runs_list on list_runs(list_id);
create index idx_list_runs_status on list_runs(status);

-- Canonical GTM accounts (system of record)
create table if not exists gtm_accounts (
  id uuid primary key default gen_random_uuid(),
  vertical_id uuid references verticals(id) on delete set null,

  company_name text not null,
  domain text unique,
  linkedin_url text,
  industry text,
  sub_industry text,
  location text,
  employee_count int,
  revenue_estimate text,
  description text,

  founder_led_score smallint default 0 check (founder_led_score between 0 and 100),
  fit_score smallint default 0 check (fit_score between 0 and 100),
  pain_score smallint default 0 check (pain_score between 0 and 100),
  fit_score_breakdown jsonb default '{}',
  pain_score_breakdown jsonb default '{}',
  case_study_match text,
  signal_count int default 0,

  gtm_stage text not null default 'discovered'
    check (gtm_stage in (
      'discovered', 'list_built', 'enriched', 'signal_found', 'hypothesis_ready',
      'outreach_ready', 'contacted', 'replied', 'audit_booked', 'audit_completed',
      'roi_brief_sent', 'discover_proposed', 'build_proposed', 'closed_won', 'closed_lost', 'disqualified'
    )),
  enrichment_status text default 'raw'
    check (enrichment_status in ('raw', 'partial', 'enriched', 'failed', 'stale')),
  last_enriched_at timestamptz,
  next_action text,
  owner text,

  primary_contact_id uuid,
  project_id uuid references projects(id) on delete set null,
  bd_deal_id uuid references bd_deals(id) on delete set null,

  first_source text default 'manual',
  apollo_id text,
  provider_data jsonb default '{}',
  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_gtm_accounts_domain on gtm_accounts(domain);
create index idx_gtm_accounts_fit on gtm_accounts(fit_score desc);
create index idx_gtm_accounts_stage on gtm_accounts(gtm_stage);
create index idx_gtm_accounts_vertical on gtm_accounts(vertical_id);

-- Canonical GTM contacts
create table if not exists gtm_contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references gtm_accounts(id) on delete cascade not null,

  name text not null,
  title text,
  email text,
  linkedin_url text,
  phone text,
  seniority text,
  department text,

  relevance_score smallint default 0 check (relevance_score between 0 and 100),
  role_hypothesis text,
  is_primary boolean default false,

  outreach_stage text default 'not_started'
    check (outreach_stage in (
      'not_started', 'warming_up', 'connected', 'dm_sent', 'email_sent',
      'follow_up_sent', 'breakup_sent', 'nurture', 'call_booked', 'replied', 'bounced', 'lost'
    )),

  source text default 'manual',
  apollo_id text,
  enrichment_confidence smallint default 0,
  provider_data jsonb default '{}',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_gtm_contacts_account on gtm_contacts(account_id);
create unique index idx_gtm_contacts_account_email on gtm_contacts(account_id, email) where email is not null;

alter table gtm_accounts
  add constraint gtm_accounts_primary_contact_fk
  foreign key (primary_contact_id) references gtm_contacts(id) on delete set null;

-- List membership: links discovered accounts to lists
create table if not exists list_memberships (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references lists(id) on delete cascade not null,
  account_id uuid references gtm_accounts(id) on delete cascade not null,

  review_status text default 'pending'
    check (review_status in ('pending', 'accepted', 'rejected', 'snoozed')),
  discovered_at timestamptz default now(),
  source_provider text default 'apollo',
  next_action text,
  notes text,

  unique (list_id, account_id)
);

create index idx_list_memberships_list on list_memberships(list_id);
create index idx_list_memberships_account on list_memberships(account_id);
create index idx_list_memberships_review on list_memberships(review_status);

-- Source attribution history
create table if not exists account_source_history (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references gtm_accounts(id) on delete cascade not null,
  list_id uuid references lists(id) on delete set null,
  source_type text not null,
  source_name text,
  added_at timestamptz default now()
);

create index idx_account_source_history_account on account_source_history(account_id);

-- Buying signals
create table if not exists gtm_signals (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references gtm_accounts(id) on delete cascade not null,
  list_id uuid references lists(id) on delete set null,

  signal_type text not null,
  signal_source text not null default 'manual'
    check (signal_source in ('apollo', 'whitewhale', 'ai_detected', 'manual', 'job_posting', 'news')),
  signal_date timestamptz default now(),
  evidence_url text,
  evidence_summary text,
  confidence_score smallint default 50 check (confidence_score between 0 and 100),
  why_now_summary text,
  pain_hypothesis text,
  action_recommendation text,

  review_status text default 'pending'
    check (review_status in ('pending', 'accepted', 'rejected', 'snoozed', 'stale')),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

create index idx_gtm_signals_account on gtm_signals(account_id);
create index idx_gtm_signals_review on gtm_signals(review_status);

-- AI sales hypotheses
create table if not exists gtm_hypotheses (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references gtm_accounts(id) on delete cascade not null,
  list_id uuid references lists(id) on delete set null,

  likely_pain text,
  relevant_workflow text,
  relevant_proof text,
  recommended_offer text,
  outreach_angle text,
  suggested_first_question text,
  suggested_email_draft text,
  suggested_linkedin_message text,
  confidence_score smallint default 50,
  approval_status text default 'draft'
    check (approval_status in ('draft', 'approved', 'edited', 'discarded')),
  approved_at timestamptz,
  is_ai_generated boolean default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_gtm_hypotheses_account on gtm_hypotheses(account_id);
create index idx_gtm_hypotheses_approval on gtm_hypotheses(approval_status);

-- Outreach activities on contacts
create table if not exists gtm_outreach_activities (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references gtm_contacts(id) on delete cascade not null,
  account_id uuid references gtm_accounts(id) on delete cascade not null,

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

create index idx_gtm_outreach_contact on gtm_outreach_activities(contact_id);
create index idx_gtm_outreach_account on gtm_outreach_activities(account_id);

-- Enrichment audit trail
create table if not exists enrichment_events (
  id uuid primary key default gen_random_uuid(),
  list_run_id uuid references list_runs(id) on delete set null,
  account_id uuid references gtm_accounts(id) on delete cascade,
  contact_id uuid references gtm_contacts(id) on delete cascade,
  provider text not null,
  event_type text not null
    check (event_type in ('org_search', 'people_search', 'org_enrich', 'people_enrich', 'ai_enrich', 'score', 'hypothesis')),
  fields_updated text[] default '{}',
  credits_consumed numeric default 0,
  success boolean default true,
  error_message text,
  raw_response jsonb,
  created_at timestamptz default now()
);

create index idx_enrichment_events_account on enrichment_events(account_id);
create index idx_enrichment_events_run on enrichment_events(list_run_id);

-- RLS
alter table provider_settings enable row level security;
alter table lists enable row level security;
alter table list_search_criteria enable row level security;
alter table list_runs enable row level security;
alter table gtm_accounts enable row level security;
alter table gtm_contacts enable row level security;
alter table list_memberships enable row level security;
alter table account_source_history enable row level security;
alter table gtm_signals enable row level security;
alter table gtm_hypotheses enable row level security;
alter table gtm_outreach_activities enable row level security;
alter table enrichment_events enable row level security;

create policy "Allow all for service role" on provider_settings for all using (true);
create policy "Allow all for service role" on lists for all using (true);
create policy "Allow all for service role" on list_search_criteria for all using (true);
create policy "Allow all for service role" on list_runs for all using (true);
create policy "Allow all for service role" on gtm_accounts for all using (true);
create policy "Allow all for service role" on gtm_contacts for all using (true);
create policy "Allow all for service role" on list_memberships for all using (true);
create policy "Allow all for service role" on account_source_history for all using (true);
create policy "Allow all for service role" on gtm_signals for all using (true);
create policy "Allow all for service role" on gtm_hypotheses for all using (true);
create policy "Allow all for service role" on gtm_outreach_activities for all using (true);
create policy "Allow all for service role" on enrichment_events for all using (true);
