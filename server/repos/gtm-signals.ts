import { supabaseAdmin } from "@/lib/db/client";

export type GtmSignal = {
  id: string;
  account_id: string;
  list_id: string | null;
  signal_type: string;
  signal_source: string;
  signal_date: string;
  evidence_url: string | null;
  evidence_summary: string | null;
  confidence_score: number;
  why_now_summary: string | null;
  pain_hypothesis: string | null;
  action_recommendation: string | null;
  review_status: string;
  reviewed_at: string | null;
  created_at: string;
};

export type GtmSignalWithAccount = GtmSignal & {
  company_name: string;
  account_fit_score: number;
};

export async function createGtmSignal(
  signal: Omit<GtmSignal, "id" | "reviewed_at" | "created_at">
): Promise<GtmSignal> {
  const { data, error } = await supabaseAdmin
    .from("gtm_signals")
    .insert(signal)
    .select()
    .single();

  if (error) throw error;
  return data as GtmSignal;
}

export async function getSignalsForAccount(accountId: string): Promise<GtmSignal[]> {
  const { data, error } = await supabaseAdmin
    .from("gtm_signals")
    .select("*")
    .eq("account_id", accountId)
    .order("confidence_score", { ascending: false });

  if (error) throw error;
  return data as GtmSignal[];
}

export async function getPendingSignals(): Promise<GtmSignalWithAccount[]> {
  const { data, error } = await supabaseAdmin
    .from("gtm_signals")
    .select("*, gtm_accounts(company_name, fit_score)")
    .eq("review_status", "pending")
    .order("confidence_score", { ascending: false });

  if (error) throw error;

  return (data || []).map((row) => {
    const account = row.gtm_accounts as { company_name: string; fit_score: number } | null;
    const { gtm_accounts: _, ...signal } = row;
    return {
      ...(signal as GtmSignal),
      company_name: account?.company_name || "Unknown",
      account_fit_score: account?.fit_score || 0,
    };
  });
}

export async function reviewGtmSignal(
  id: string,
  reviewStatus: "accepted" | "rejected" | "snoozed"
): Promise<GtmSignal> {
  const { data, error } = await supabaseAdmin
    .from("gtm_signals")
    .update({
      review_status: reviewStatus,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as GtmSignal;
}

export async function incrementAccountSignalCount(accountId: string): Promise<void> {
  const { data } = await supabaseAdmin
    .from("gtm_accounts")
    .select("signal_count")
    .eq("id", accountId)
    .single();

  await supabaseAdmin
    .from("gtm_accounts")
    .update({ signal_count: (data?.signal_count || 0) + 1 })
    .eq("id", accountId);
}
