-- CappaWork Client Portal Schema
-- This migration creates all tables needed for project management, client access, and blog publishing

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (synced from Clerk)
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text unique not null,
  email text not null,
  name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Projects table
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'completed', 'on_hold')),
  prd_content jsonb, -- Rich text content from TipTap
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Project members (links clients to projects)
create table if not exists public.project_members (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'client' check (role in ('client', 'viewer')),
  created_at timestamptz not null default now(),
  unique(project_id, profile_id)
);

-- Project phases (Kanban columns)
create table if not exists public.project_phases (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

-- Project tasks (Kanban cards)
create table if not exists public.project_tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  phase_id uuid not null references public.project_phases(id) on delete cascade,
  title text not null,
  description text,
  is_completed boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Project secrets (encrypted API keys and credentials)
create table if not exists public.project_secrets (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  value_encrypted text not null, -- AES-256-GCM encrypted
  type text not null default 'api_key' check (type in ('api_key', 'password', 'token', 'url', 'other')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Project URLs
create table if not exists public.project_urls (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  label text not null,
  url text not null,
  type text not null default 'other' check (type in ('repo', 'staging', 'production', 'docs', 'design', 'other')),
  created_at timestamptz not null default now()
);

-- Project design (client's selected theme and customizations)
create table if not exists public.project_design (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid unique not null references public.projects(id) on delete cascade,
  theme_id text,
  primary_color text,
  accent_color text,
  heading_font text,
  body_font text,
  corner_radius text check (corner_radius in ('none', 'sm', 'md', 'lg', 'xl', 'full')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Design themes (predefined base themes)
create table if not exists public.design_themes (
  id text primary key,
  name text not null,
  description text,
  preview_colors jsonb, -- Array of color swatches
  created_at timestamptz not null default now()
);

-- Blog posts (replaces Sanity)
create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text,
  content jsonb not null, -- TipTap rich text JSON
  featured_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_profiles_clerk_user_id on public.profiles(clerk_user_id);
create index if not exists idx_project_members_project_id on public.project_members(project_id);
create index if not exists idx_project_members_profile_id on public.project_members(profile_id);
create index if not exists idx_project_phases_project_id on public.project_phases(project_id);
create index if not exists idx_project_tasks_project_id on public.project_tasks(project_id);
create index if not exists idx_project_tasks_phase_id on public.project_tasks(phase_id);
create index if not exists idx_project_secrets_project_id on public.project_secrets(project_id);
create index if not exists idx_project_urls_project_id on public.project_urls(project_id);
create index if not exists idx_blog_posts_slug on public.blog_posts(slug);
create index if not exists idx_blog_posts_published on public.blog_posts(published, published_at desc);

-- Row Level Security (RLS) - Enable for all tables
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.project_phases enable row level security;
alter table public.project_tasks enable row level security;
alter table public.project_secrets enable row level security;
alter table public.project_urls enable row level security;
alter table public.project_design enable row level security;
alter table public.design_themes enable row level security;
alter table public.blog_posts enable row level security;

-- RLS Policies
-- Note: Since we use Clerk (not Supabase Auth), we'll enforce access via service role in server code
-- These policies allow service role to access everything, but we'll enforce access control in application code

-- Service role can do everything
create policy "Service role full access" on public.profiles
  for all using (true) with check (true);

create policy "Service role full access" on public.projects
  for all using (true) with check (true);

create policy "Service role full access" on public.project_members
  for all using (true) with check (true);

create policy "Service role full access" on public.project_phases
  for all using (true) with check (true);

create policy "Service role full access" on public.project_tasks
  for all using (true) with check (true);

create policy "Service role full access" on public.project_secrets
  for all using (true) with check (true);

create policy "Service role full access" on public.project_urls
  for all using (true) with check (true);

create policy "Service role full access" on public.project_design
  for all using (true) with check (true);

create policy "Service role full access" on public.design_themes
  for all using (true) with check (true);

-- Blog posts: public read access for published posts
create policy "Public can read published posts" on public.blog_posts
  for select using (published = true);

-- Service role can manage blog posts
create policy "Service role can manage blog posts" on public.blog_posts
  for all using (true) with check (true);

-- Insert default design themes
insert into public.design_themes (id, name, description, preview_colors) values
  ('minimal', 'Minimal', 'Clean and simple with plenty of white space', '["#000000", "#FFFFFF", "#F5F5F5"]'),
  ('modern', 'Modern', 'Bold colors with contemporary styling', '["#3B82F6", "#1E40AF", "#EFF6FF"]'),
  ('warm', 'Warm', 'Earthy tones with friendly feel', '["#D97706", "#92400E", "#FEF3C7"]'),
  ('professional', 'Professional', 'Corporate blue with trust-building aesthetic', '["#1E3A8A", "#3B82F6", "#DBEAFE"]'),
  ('creative', 'Creative', 'Vibrant and expressive color palette', '["#EC4899", "#8B5CF6", "#FCE7F3"]')
on conflict (id) do nothing;

