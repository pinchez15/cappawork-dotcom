# LinkedIn Signals (admin)

Ranked companies with real buying signals for manual LinkedIn outreach.

## Admin URL

`/admin/signals`

## What it uses

- `gtm_accounts` (signal_score, signal_research_status)
- `gtm_contacts` (best person, linkedin_url, outreach_stage)
- `gtm_signals` (plain-language signals + sources[])
- `gtm_outreach_activities` (linkedin_dm status history)

## Status mapping

| UI button   | Contact outreach_stage | Account gtm_stage |
|-------------|------------------------|-------------------|
| To message  | not_started            | signal_found      |
| Messaged    | dm_sent                | contacted         |
| Replied     | replied                | replied           |
| Booked      | call_booked            | audit_booked      |

No AI message drafts. Nate opens LinkedIn and sends himself.

## Migration

Run in Supabase SQL Editor (same as other migrations):

`supabase/migrations/028_li_signals.sql`

## Seed data

Building-products research lives in:

- `supabase/seed/li_signals.json`
- `supabase/seed/nosig.json`

Load from the Signals page (**Load building-products seed**) or:

```bash
node scripts/seed-li-signals.mjs --post https://cappawork.com/api/admin/signals/import --cookie "<admin session cookie>"
```

## Research

- Per account: CRM account page → **Research signals**, or row **Re-research** on Signals
- Per list selection: List Builder → **Research signals**
- Uses Anthropic web search (same pattern as `/api/admin/prospects/enrich`)
- Optionally reads free Apollo org enrich (no email reveal)

Requires `ANTHROPIC_API_KEY`. Apollo is optional (`APOLLO_API_KEY` or Provider Settings).
