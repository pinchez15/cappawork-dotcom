-- Organizations, Subscriptions, Waitlists, and Roles Schema
-- This migration adds support for Clerk organizations, billing, and waitlists

-- Organizations table (synced from Clerk)
create table if not exists public.organizations (
  id uuid primary key default uuid_generate_v4(),
  clerk_org_id text unique not null,
  name text not null,
  slug text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Organization members (synced from Clerk org memberships)
create table if not exists public.organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  clerk_membership_id text unique not null,
  role text not null, -- e.g., 'org:admin', 'org:member', etc.
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, profile_id)
);

-- Subscriptions (from Clerk Billing)
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  clerk_subscription_id text unique not null,
  status text not null, -- 'active', 'past_due', 'canceled', etc.
  plan_id text,
  plan_name text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Payment attempts (from Clerk Billing)
create table if not exists public.payment_attempts (
  id uuid primary key default uuid_generate_v4(),
  subscription_id uuid references public.subscriptions(id) on delete set null,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  clerk_payment_attempt_id text unique not null,
  amount integer not null, -- in cents
  currency text not null default 'usd',
  status text not null, -- 'succeeded', 'failed', 'pending', etc.
  payment_method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Waitlist entries
create table if not exists public.waitlist_entries (
  id uuid primary key default uuid_generate_v4(),
  clerk_waitlist_entry_id text unique,
  email text not null,
  profile_id uuid references public.profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  status text not null default 'pending', -- 'pending', 'invited', 'converted', 'removed'
  metadata jsonb, -- Additional data from Clerk
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Roles (custom roles beyond Clerk defaults)
create table if not exists public.roles (
  id uuid primary key default uuid_generate_v4(),
  clerk_role_id text unique,
  name text not null,
  key text not null unique, -- e.g., 'admin', 'member', 'viewer'
  description text,
  permissions jsonb, -- Array of permission strings
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_organizations_clerk_org_id on public.organizations(clerk_org_id);
create index if not exists idx_organization_members_org_id on public.organization_members(organization_id);
create index if not exists idx_organization_members_profile_id on public.organization_members(profile_id);
create index if not exists idx_organization_members_clerk_id on public.organization_members(clerk_membership_id);
create index if not exists idx_subscriptions_org_id on public.subscriptions(organization_id);
create index if not exists idx_subscriptions_clerk_id on public.subscriptions(clerk_subscription_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);
create index if not exists idx_payment_attempts_subscription_id on public.payment_attempts(subscription_id);
create index if not exists idx_payment_attempts_org_id on public.payment_attempts(organization_id);
create index if not exists idx_waitlist_entries_email on public.waitlist_entries(email);
create index if not exists idx_waitlist_entries_profile_id on public.waitlist_entries(profile_id);
create index if not exists idx_waitlist_entries_status on public.waitlist_entries(status);
create index if not exists idx_roles_clerk_id on public.roles(clerk_role_id);
create index if not exists idx_roles_key on public.roles(key);

-- Enable RLS
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.waitlist_entries enable row level security;
alter table public.roles enable row level security;

-- RLS Policies (service role access)
create policy "Service role full access" on public.organizations
  for all using (true) with check (true);

create policy "Service role full access" on public.organization_members
  for all using (true) with check (true);

create policy "Service role full access" on public.subscriptions
  for all using (true) with check (true);

create policy "Service role full access" on public.payment_attempts
  for all using (true) with check (true);

create policy "Service role full access" on public.waitlist_entries
  for all using (true) with check (true);

create policy "Service role full access" on public.roles
  for all using (true) with check (true);

