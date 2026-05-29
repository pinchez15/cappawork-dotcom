-- Cohort products (AI for Business Leaders, AI Literacy Bootcamp)
-- Net-new infrastructure built on top of existing Clerk auth + Supabase.
-- Access is enforced in application code (service role); RLS mirrors the
-- existing "Service role full access" pattern used across the schema.

create extension if not exists "uuid-ossp";

-- People who requested a seat but haven't paid yet.
-- name is nullable: the request form collects LinkedIn + email only.
create table if not exists public.cohort_leads (
  id uuid primary key default uuid_generate_v4(),
  name text,
  linkedin_url text not null,
  email text not null,
  cohort_type text not null check (cohort_type in ('build', 'literacy')),
  source text default 'landing_page',
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'paid', 'declined')),
  notes text,
  created_at timestamptz not null default now(),
  contacted_at timestamptz,
  converted_at timestamptz
);

-- Actual cohort instances. One row per run (e.g. "AI for Business Leaders — June 2026").
create table if not exists public.cohorts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null check (type in ('build', 'literacy')),
  start_date date not null,
  end_date date not null,
  session_count int not null,
  zoom_link text,
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'completed')),
  created_at timestamptz not null default now()
);

-- Who is in which cohort. clerk_user_id is nullable: participants are enrolled
-- by email (manual or via Stripe) before they've signed in, and the portal gate
-- matches on email OR clerk_user_id. Uniqueness is on (cohort_id, email).
create table if not exists public.cohort_participants (
  id uuid primary key default uuid_generate_v4(),
  cohort_id uuid not null references public.cohorts(id) on delete restrict,
  clerk_user_id text,
  email text not null,
  joined_at timestamptz not null default now(),
  access_expires_at timestamptz not null,
  unique (cohort_id, email)
);

-- Videos, worksheets, framework PDFs, session recordings.
-- cohort_id null = shared library (e.g. AI Basics), scoped by cohort_type.
-- published_at null (or in the future) = not yet visible to participants.
create table if not exists public.cohort_materials (
  id uuid primary key default uuid_generate_v4(),
  cohort_id uuid references public.cohorts(id) on delete cascade,
  cohort_type text check (cohort_type in ('build', 'literacy')),
  section text not null,
  title text not null,
  description text,
  type text not null check (type in ('video', 'pdf', 'worksheet', 'recording')),
  url text not null,
  published_at timestamptz,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_cohort_leads_status on public.cohort_leads(status);
create index if not exists idx_cohort_leads_cohort_type on public.cohort_leads(cohort_type);
create index if not exists idx_cohort_leads_email on public.cohort_leads(email);
create index if not exists idx_cohort_participants_clerk_user_id on public.cohort_participants(clerk_user_id);
create index if not exists idx_cohort_participants_email on public.cohort_participants(email);
create index if not exists idx_cohort_participants_cohort_id on public.cohort_participants(cohort_id);
create index if not exists idx_cohort_materials_cohort_id on public.cohort_materials(cohort_id);
create index if not exists idx_cohort_materials_cohort_type on public.cohort_materials(cohort_type);

-- Row Level Security
-- Clerk (not Supabase Auth) is the identity source, so access is enforced in
-- server code via the service role. Each new table gets its own narrow policy.
alter table public.cohort_leads enable row level security;
alter table public.cohorts enable row level security;
alter table public.cohort_participants enable row level security;
alter table public.cohort_materials enable row level security;

create policy "Service role full access" on public.cohort_leads
  for all using (true) with check (true);

create policy "Service role full access" on public.cohorts
  for all using (true) with check (true);

create policy "Service role full access" on public.cohort_participants
  for all using (true) with check (true);

create policy "Service role full access" on public.cohort_materials
  for all using (true) with check (true);
