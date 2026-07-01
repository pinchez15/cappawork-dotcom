import { supabaseAdmin } from "@/lib/db/client";
import type { GtmAccount } from "@/server/repos/gtm-accounts";

export type ListMembership = {
  id: string;
  list_id: string;
  account_id: string;
  review_status: string;
  discovered_at: string;
  source_provider: string;
  next_action: string | null;
  notes: string | null;
};

export type ListAccount = GtmAccount & {
  membership_id: string;
  review_status: string;
  list_next_action: string | null;
  discovered_at: string;
};

export async function addAccountToList(
  listId: string,
  accountId: string,
  sourceProvider: string
): Promise<ListMembership> {
  const { data, error } = await supabaseAdmin
    .from("list_memberships")
    .upsert(
      {
        list_id: listId,
        account_id: accountId,
        source_provider: sourceProvider,
        review_status: "pending",
        discovered_at: new Date().toISOString(),
      },
      { onConflict: "list_id,account_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data as ListMembership;
}

export async function getAccountsForList(
  listId: string,
  filters?: { review_status?: string; min_fit_score?: number }
): Promise<ListAccount[]> {
  let query = supabaseAdmin
    .from("list_memberships")
    .select("*, gtm_accounts(*)")
    .eq("list_id", listId);

  if (filters?.review_status) {
    query = query.eq("review_status", filters.review_status);
  }

  const { data, error } = await query;
  if (error) throw error;

  let results = (data || []).map((row: Record<string, unknown>) => {
    const account = row.gtm_accounts as GtmAccount;
    return {
      ...account,
      membership_id: row.id as string,
      review_status: row.review_status as string,
      list_next_action: row.next_action as string | null,
      discovered_at: row.discovered_at as string,
    } as ListAccount;
  });

  if (filters?.min_fit_score) {
    results = results.filter((a) => a.fit_score >= filters.min_fit_score!);
  }

  return results.sort((a, b) => b.fit_score - a.fit_score);
}

export async function updateListMembership(
  membershipId: string,
  updates: Partial<Omit<ListMembership, "id" | "list_id" | "account_id">>
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("list_memberships")
    .update(updates)
    .eq("id", membershipId);

  if (error) throw error;
}

export async function bulkUpdateMemberships(
  listId: string,
  accountIds: string[],
  updates: Partial<Omit<ListMembership, "id" | "list_id" | "account_id">>
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("list_memberships")
    .update(updates)
    .eq("list_id", listId)
    .in("account_id", accountIds);

  if (error) throw error;
}

export async function recordAccountSource(
  accountId: string,
  listId: string | null,
  sourceType: string,
  sourceName: string | null
): Promise<void> {
  await supabaseAdmin.from("account_source_history").insert({
    account_id: accountId,
    list_id: listId,
    source_type: sourceType,
    source_name: sourceName,
  });
}

export async function getMembershipForAccount(
  listId: string,
  accountId: string
): Promise<ListMembership | null> {
  const { data, error } = await supabaseAdmin
    .from("list_memberships")
    .select("*")
    .eq("list_id", listId)
    .eq("account_id", accountId)
    .maybeSingle();

  if (error) throw error;
  return data as ListMembership | null;
}
