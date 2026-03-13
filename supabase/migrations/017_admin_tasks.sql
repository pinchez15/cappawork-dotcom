-- Admin tasks table (separate from per-project tasks)
create table if not exists admin_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  project_id uuid references projects(id) on delete set null,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'blocked', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date date,
  source text not null default 'manual' check (source in ('manual', 'mcp', 'diagnostic', 'client_request')),
  notes text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index idx_admin_tasks_status on admin_tasks(status);
create index idx_admin_tasks_priority on admin_tasks(priority);
create index idx_admin_tasks_project_id on admin_tasks(project_id);
create index idx_admin_tasks_due_date on admin_tasks(due_date);

-- RLS
alter table admin_tasks enable row level security;

create policy "Service role full access on admin_tasks"
  on admin_tasks
  for all
  using (true)
  with check (true);
