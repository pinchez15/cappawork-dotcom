-- Discovery hangs off Pipeline deals (bd_deals), where leads are worked day to day.
-- 025 attached it to gtm_accounts; that link stays optional for when the CRM is built out.

alter table discovery_deals alter column account_id drop not null;

alter table discovery_deals
  add column if not exists bd_deal_id uuid unique references bd_deals(id) on delete cascade;

alter table discovery_deals drop constraint if exists discovery_deals_has_parent;
alter table discovery_deals
  add constraint discovery_deals_has_parent check (account_id is not null or bd_deal_id is not null);

create or replace function discovery_ensure_bd_deal(p_bd_deal_id uuid)
returns discovery_deals language plpgsql as $$
declare
  v_deal discovery_deals;
begin
  insert into discovery_deals (bd_deal_id) values (p_bd_deal_id)
  on conflict (bd_deal_id) do nothing;
  select * into v_deal from discovery_deals where bd_deal_id = p_bd_deal_id;
  return v_deal;
end;
$$;

revoke execute on function discovery_ensure_bd_deal(uuid) from public, anon, authenticated;
