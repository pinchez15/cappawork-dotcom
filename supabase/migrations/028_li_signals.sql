-- LinkedIn outreach signals: account-level score + research status,
-- multi-source evidence on gtm_signals, and broader signal sources.

alter table gtm_accounts
  add column if not exists signal_score smallint
    check (signal_score is null or signal_score between 0 and 5);

alter table gtm_accounts
  add column if not exists signal_research_status text
    default 'unresearched'
    check (signal_research_status in ('unresearched', 'has_signal', 'no_signal'));

alter table gtm_accounts
  add column if not exists signal_researched_at timestamptz;

create index if not exists idx_gtm_accounts_signal_score
  on gtm_accounts(signal_score desc nulls last);

create index if not exists idx_gtm_accounts_signal_research
  on gtm_accounts(signal_research_status);

-- Multi-source evidence: [{ "label": "...", "url": "...", "date": "..." }]
alter table gtm_signals
  add column if not exists sources jsonb not null default '[]'::jsonb;

-- Broaden allowed signal sources for researched LinkedIn signals
alter table gtm_signals drop constraint if exists gtm_signals_signal_source_check;
alter table gtm_signals
  add constraint gtm_signals_signal_source_check
  check (signal_source in (
    'apollo', 'whitewhale', 'ai_detected', 'manual', 'job_posting', 'news',
    'linkedin', 'careers', 'press', 'web_search'
  ));

-- Signal types used by LinkedIn outreach (free text allowed; documented here):
-- hiring_estimating | hiring_ai | growth | new_leader | leader_posting

create index if not exists idx_gtm_signals_type on gtm_signals(signal_type);
create index if not exists idx_gtm_signals_date on gtm_signals(signal_date desc);
