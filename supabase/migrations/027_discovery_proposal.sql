-- Proposal brief: recommendation, build plan, hours cap and impact price for the follow-up presentation.
-- Written on every run, whatever the gate decides. pricing holds the code-computed anchors.

alter table discovery_runs
  add column if not exists proposal_brief text,
  add column if not exists pricing jsonb;
