-- Discovery: versioned question bank, Deal + Constraint records, answer history, post-call runs.
-- Spec: lib/docs/CappaWork-Discovery-Playbook.md. Seed: lib/docs/discovery-question-bank.json
-- (import with scripts/import-discovery-bank.mjs; a version imports once and never changes).
--
-- Leads store answers, never copies of questions. An answer points at a field key
-- ("deal.trigger", "constraint.root_causes") and the bank version it was written under.

-- ─── Question bank (immutable per version) ──────────────────────────────────

create table if not exists discovery_question_banks (
  version text primary key,
  name text not null,
  framework text,
  frame text,
  guardrails jsonb not null default '[]',
  kinds jsonb not null default '{}',
  prospecting jsonb not null default '{}',
  content_sha256 text not null,
  is_active boolean not null default false,
  imported_at timestamptz not null default now()
);

create unique index if not exists idx_discovery_banks_one_active
  on discovery_question_banks (is_active) where is_active;

create table if not exists discovery_questions (
  bank_version text not null references discovery_question_banks(version) on delete restrict,
  question_id text not null,
  sort_order int not null,
  stage text not null,
  kind text not null,
  tier text not null check (tier in ('must', 'if_time', 'confirm', 'fallback', 'once')),
  fields text[] not null,
  ask text not null,
  cue text not null,
  follow_up text,
  primary key (bank_version, question_id)
);

create index if not exists idx_discovery_questions_order
  on discovery_questions (bank_version, sort_order);

-- ─── Deal: one per CRM account ──────────────────────────────────────────────

create table if not exists discovery_deals (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null unique references gtm_accounts(id) on delete cascade,

  -- You, pre-call
  hypothesis text,
  price_usd int not null default 35000,

  -- Computed (math with labeled assumptions; never mixed with stated answers)
  hypothesis_result text check (hypothesis_result in ('confirmed', 'partial', 'wrong')),
  unserved_value_monthly jsonb,  -- { value, math, assumptions[] }
  unlocked_value_monthly jsonb,
  change_risk jsonb,
  case_summary text,
  coverage numeric(4, 3) check (coverage between 0 and 1),
  decision text check (decision in ('build', 'recap_first', 'deprioritize', 'refer_out')),

  -- Human-confirmed outcome (record_outcome)
  outcome_notes text,
  outcome_recorded_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Constraint: child of Deal, at most three ───────────────────────────────

create table if not exists discovery_constraints (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references discovery_deals(id) on delete cascade,
  position smallint not null check (position between 1 and 3),

  -- Computed
  tied_to_capacity boolean,
  profit_lever text check (profit_lever in ('customers', 'avg_job_value', 'frequency', 'margin')),
  capacity_unlocked jsonb,
  impact_monthly jsonb,
  fixable text check (fixable in ('yes', 'partial', 'no')),

  -- AI proposes, you confirm
  is_primary boolean not null default false,
  primary_confirmed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (deal_id, position)
);

create unique index if not exists idx_discovery_constraints_one_primary
  on discovery_constraints (deal_id) where is_primary;

create or replace function discovery_constraints_max_three()
returns trigger language plpgsql as $$
begin
  perform 1 from discovery_deals where id = new.deal_id for update;
  if (select count(*) from discovery_constraints where deal_id = new.deal_id) >= 3 then
    raise exception 'A deal holds at most 3 constraints' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_discovery_constraints_max_three on discovery_constraints;
create trigger trg_discovery_constraints_max_three
  before insert on discovery_constraints
  for each row execute function discovery_constraints_max_three();

-- ─── Answers: stated fields, append-only history ────────────────────────────
-- The current value of a field is every row with superseded_at null.
-- List fields (objections, stakeholders, must_work_with, root_causes) hold several rows.
-- Writing a field supersedes the whole current set, so corrections keep their history.

create table if not exists discovery_answers (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references discovery_deals(id) on delete cascade,
  constraint_id uuid references discovery_constraints(id) on delete cascade,
  field text not null,                 -- "deal.trigger" | "constraint.root_causes" ...
  item_index smallint not null default 0,
  value text not null,                 -- "not covered" / "no answer" when absent; never blank
  quote text,                          -- verbatim buyer words
  transcript_at text,                  -- transcript timestamp, e.g. "00:12:41"
  bank_version text not null references discovery_question_banks(version),
  source text not null default 'manual'
    check (source in ('extraction', 'manual', 'call', 'mcp', 'recap')),
  run_id uuid,
  recorded_at timestamptz not null default now(),
  superseded_at timestamptz,
  check (length(trim(value)) > 0),
  check ((field like 'constraint.%') = (constraint_id is not null))
);

create index if not exists idx_discovery_answers_current
  on discovery_answers (deal_id, field) where superseded_at is null;
create index if not exists idx_discovery_answers_constraint
  on discovery_answers (constraint_id) where constraint_id is not null;

-- ─── Post-call runs ─────────────────────────────────────────────────────────

create table if not exists discovery_runs (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references discovery_deals(id) on delete cascade,
  status text not null default 'queued'
    check (status in ('queued', 'extracting', 'writing', 'recap', 'gating', 'brief', 'done', 'failed')),
  transcript text not null,
  research text,
  constraint_map text,
  defaults jsonb not null default '{}',
  price_usd int not null,
  bank_version text not null references discovery_question_banks(version),
  model text,
  source text not null default 'manual' check (source in ('manual', 'google_meet', 'webhook')),
  source_ref text unique, -- e.g. the Meet transcript resource name; repeat posts are ignored

  extraction jsonb,       -- raw structured output, kept for audit
  hypothesis_check jsonb, -- { result, evidence }
  recap_subject text,
  recap_body text,
  gate jsonb,             -- { tests: [...], decision }
  demo_brief text,
  error text,

  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_discovery_runs_deal on discovery_runs (deal_id, created_at desc);

alter table discovery_answers
  add constraint discovery_answers_run_fk
  foreign key (run_id) references discovery_runs(id) on delete set null;

-- ─── Functions shared by the app and the MCP server ─────────────────────────

create or replace function discovery_active_bank_version()
returns text language sql stable as $$
  select version from discovery_question_banks where is_active limit 1;
$$;

-- Import a bank JSON once. Re-importing the same version with the same content is a no-op;
-- different content under an existing version is refused, so versions never drift.
create or replace function discovery_import_bank(p_bank jsonb, p_sha256 text)
returns text language plpgsql as $$
declare
  v_version text := p_bank->>'version';
  v_existing text;
begin
  if v_version is null then
    raise exception 'Bank JSON has no version';
  end if;

  select content_sha256 into v_existing from discovery_question_banks where version = v_version;
  if found then
    if v_existing <> p_sha256 then
      raise exception 'Bank version % is already imported with different content. Bump the version.', v_version;
    end if;
    return 'unchanged';
  end if;

  update discovery_question_banks set is_active = false where is_active;

  insert into discovery_question_banks
    (version, name, framework, frame, guardrails, kinds, prospecting, content_sha256, is_active)
  values (
    v_version,
    p_bank->>'name',
    p_bank->>'framework',
    p_bank->>'frame',
    coalesce(p_bank->'guardrails', '[]'),
    coalesce(p_bank->'kinds', '{}'),
    coalesce(p_bank->'prospecting', '{}'),
    p_sha256,
    true
  );

  insert into discovery_questions
    (bank_version, question_id, sort_order, stage, kind, tier, fields, ask, cue, follow_up)
  select
    v_version,
    q->>'id',
    (q->>'order')::int,
    q->>'stage',
    q->>'kind',
    q->>'tier',
    array(select jsonb_array_elements_text(q->'fields')),
    q->>'ask',
    q->>'cue',
    q->>'follow_up'
  from jsonb_array_elements(p_bank->'discovery') q;

  return 'imported';
end;
$$;

create or replace function discovery_ensure_deal(p_account_id uuid)
returns discovery_deals language plpgsql as $$
declare
  v_deal discovery_deals;
begin
  insert into discovery_deals (account_id) values (p_account_id)
  on conflict (account_id) do nothing;
  select * into v_deal from discovery_deals where account_id = p_account_id;
  return v_deal;
end;
$$;

-- Write one stated field. p_items is a JSON array of { value, quote?, at? }.
-- The field must exist in the active bank; single-value fields take exactly one item.
create or replace function discovery_set_field(
  p_deal_id uuid,
  p_field text,
  p_items jsonb,
  p_source text default 'manual',
  p_constraint_id uuid default null,
  p_run_id uuid default null
)
returns setof discovery_answers language plpgsql as $$
declare
  v_bank text := discovery_active_bank_version();
  v_list_fields text[] := array[
    'deal.objections', 'deal.stakeholders', 'deal.must_work_with', 'constraint.root_causes'
  ];
  v_item jsonb;
  v_i int := 0;
begin
  if v_bank is null then
    raise exception 'No active question bank. Run scripts/import-discovery-bank.mjs';
  end if;

  if not exists (
    select 1 from discovery_questions where bank_version = v_bank and p_field = any(fields)
  ) then
    raise exception 'Unknown field % for bank %', p_field, v_bank;
  end if;

  if p_field like 'constraint.%' then
    if p_constraint_id is null then
      raise exception 'Field % needs a constraint_id', p_field;
    end if;
    if not exists (select 1 from discovery_constraints where id = p_constraint_id and deal_id = p_deal_id) then
      raise exception 'Constraint % does not belong to deal %', p_constraint_id, p_deal_id;
    end if;
  elsif p_constraint_id is not null then
    raise exception 'Field % is a deal field; omit constraint_id', p_field;
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Field % needs at least one item', p_field;
  end if;
  if not (p_field = any(v_list_fields)) and jsonb_array_length(p_items) > 1 then
    raise exception 'Field % takes one value', p_field;
  end if;

  update discovery_answers
     set superseded_at = now()
   where deal_id = p_deal_id
     and field = p_field
     and constraint_id is not distinct from p_constraint_id
     and superseded_at is null;

  for v_item in select * from jsonb_array_elements(p_items) loop
    return query
      insert into discovery_answers
        (deal_id, constraint_id, field, item_index, value, quote, transcript_at, bank_version, source, run_id)
      values (
        p_deal_id, p_constraint_id, p_field, v_i,
        v_item->>'value', nullif(v_item->>'quote', ''), nullif(v_item->>'at', ''),
        v_bank, p_source, p_run_id
      )
      returning *;
    v_i := v_i + 1;
  end loop;

  update discovery_deals set updated_at = now() where id = p_deal_id;
end;
$$;

-- Service role only, like the rest of the CRM.
alter table discovery_question_banks enable row level security;
alter table discovery_questions enable row level security;
alter table discovery_deals enable row level security;
alter table discovery_constraints enable row level security;
alter table discovery_answers enable row level security;
alter table discovery_runs enable row level security;

revoke execute on function discovery_import_bank(jsonb, text) from public, anon, authenticated;
revoke execute on function discovery_ensure_deal(uuid) from public, anon, authenticated;
revoke execute on function discovery_set_field(uuid, text, jsonb, text, uuid, uuid) from public, anon, authenticated;
