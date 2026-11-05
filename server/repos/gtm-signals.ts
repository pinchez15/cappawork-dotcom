import { supabaseAdmin } from "@/lib/db/client";
import type { SignalSource } from "@/lib/validators/li-signals";
import { rankingWeight } from "@/lib/validators/li-signals";

export type GtmSignal = {
  id: string;
  account_id: string;
  list_id: string | null;
  signal_type: string;
  signal_source: string;
  signal_date: string;
  evidence_url: string | null;
  evidence_summary: string | null;
  sources: SignalSource[];
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

export type LiSignalRow = {
  account_id: string;
  company_name: string;
  domain: string | null;
  website: string | null;
  signal_score: number;
  signal_research_status: string;
  signal_researched_at: string | null;
  gtm_stage: string;
  signals: Array<{
    id: string;
    signal_type: string;
    signal_source: string;
    signal_date: string | null;
    evidence_summary: string | null;
    evidence_url: string | null;
    sources: SignalSource[];
    confidence_score: number;
  }>;
  contact: {
    id: string;
    name: string;
    title: string | null;
    linkedin_url: string | null;
    outreach_stage: string;
  } | null;
  signal_types: string[];
  ranking_weight: number;
};

function normalizeSources(
  sources: unknown,
  fallbackUrl: string | null,
  fallbackDate: string | null
): SignalSource[] {
  if (Array.isArray(sources) && sources.length > 0) {
    return sources
      .map((s) => {
        const row = s as Record<string, unknown>;
        return {
          label: String(row.label || "Source"),
          url: String(row.url || ""),
          date: String(row.date || ""),
        };
      })
      .filter((s) => s.url);
  }
  if (fallbackUrl) {
    return [
      {
        label: "Source",
        url: fallbackUrl,
        date: fallbackDate || "",
      },
    ];
  }
  return [];
}

export async function createGtmSignal(signal: {
  account_id: string;
  list_id?: string | null;
  signal_type: string;
  signal_source: string;
  signal_date?: string;
  evidence_url?: string | null;
  evidence_summary?: string | null;
  sources?: SignalSource[];
  confidence_score?: number;
  why_now_summary?: string | null;
  pain_hypothesis?: string | null;
  action_recommendation?: string | null;
  review_status?: string;
}): Promise<GtmSignal> {
  const sources = signal.sources || [];
  const evidence_url =
    signal.evidence_url || sources[0]?.url || null;

  const { data, error } = await supabaseAdmin
    .from("gtm_signals")
    .insert({
      account_id: signal.account_id,
      list_id: signal.list_id ?? null,
      signal_type: signal.signal_type,
      signal_source: signal.signal_source,
      signal_date: signal.signal_date || sources[0]?.date || new Date().toISOString(),
      evidence_url,
      evidence_summary: signal.evidence_summary ?? null,
      sources,
      confidence_score: signal.confidence_score ?? 50,
      why_now_summary: signal.why_now_summary ?? null,
      pain_hypothesis: signal.pain_hypothesis ?? null,
      action_recommendation: signal.action_recommendation ?? null,
      review_status: signal.review_status || "accepted",
    })
    .select()
    .single();

  if (error) throw error;
  return {
    ...(data as GtmSignal),
    sources: normalizeSources(
      (data as GtmSignal).sources,
      (data as GtmSignal).evidence_url,
      (data as GtmSignal).signal_date
    ),
  };
}

export async function getSignalsForAccount(accountId: string): Promise<GtmSignal[]> {
  const { data, error } = await supabaseAdmin
    .from("gtm_signals")
    .select("*")
    .eq("account_id", accountId)
    .order("confidence_score", { ascending: false });

  if (error) throw error;
  return ((data as GtmSignal[]) || []).map((s) => ({
    ...s,
    sources: normalizeSources(s.sources, s.evidence_url, s.signal_date),
  }));
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
    const s = signal as GtmSignal;
    return {
      ...s,
      sources: normalizeSources(s.sources, s.evidence_url, s.signal_date),
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

export async function deleteSignalsForAccount(accountId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("gtm_signals")
    .delete()
    .eq("account_id", accountId);
  if (error) throw error;
}

/**
 * Ranked LinkedIn outreach list: accounts with has_signal research status,
 * joined with accepted (or all) signals and primary/best contact.
 */
export async function getLiSignalRows(filters?: {
  signal_type?: string;
  min_score?: number;
  max_score?: number;
  outreach_status?: string;
  include_no_signal?: boolean;
}): Promise<LiSignalRow[]> {
  let accountQuery = supabaseAdmin
    .from("gtm_accounts")
    .select(
      "id, company_name, domain, linkedin_url, signal_score, signal_research_status, signal_researched_at, gtm_stage, primary_contact_id, provider_data"
    )
    .order("signal_score", { ascending: false, nullsFirst: false });

  if (filters?.include_no_signal) {
    accountQuery = accountQuery.in("signal_research_status", ["has_signal", "no_signal"]);
  } else {
    accountQuery = accountQuery.eq("signal_research_status", "has_signal");
  }

  if (filters?.min_score != null) {
    accountQuery = accountQuery.gte("signal_score", filters.min_score);
  }
  if (filters?.max_score != null) {
    accountQuery = accountQuery.lte("signal_score", filters.max_score);
  }

  const { data: accounts, error } = await accountQuery;
  if (error) throw error;
  if (!accounts?.length) return [];

  const accountIds = accounts.map((a) => a.id);

  const [{ data: signals }, { data: contacts }] = await Promise.all([
    supabaseAdmin
      .from("gtm_signals")
      .select("*")
      .in("account_id", accountIds)
      .neq("review_status", "rejected")
      .order("confidence_score", { ascending: false }),
    supabaseAdmin
      .from("gtm_contacts")
      .select("id, account_id, name, title, linkedin_url, outreach_stage, is_primary, relevance_score")
      .in("account_id", accountIds)
      .order("relevance_score", { ascending: false }),
  ]);

  const signalsByAccount = new Map<string, GtmSignal[]>();
  for (const s of signals || []) {
    const list = signalsByAccount.get(s.account_id) || [];
    list.push({
      ...(s as GtmSignal),
      sources: normalizeSources(
        (s as GtmSignal).sources,
        (s as GtmSignal).evidence_url,
        (s as GtmSignal).signal_date
      ),
    });
    signalsByAccount.set(s.account_id, list);
  }

  const contactsByAccount = new Map<string, typeof contacts>();
  for (const c of contacts || []) {
    const list = contactsByAccount.get(c.account_id) || [];
    list.push(c);
    contactsByAccount.set(c.account_id, list);
  }

  const rows: LiSignalRow[] = [];

  for (const account of accounts) {
    const accountSignals = signalsByAccount.get(account.id) || [];
    const signalTypes = [...new Set(accountSignals.map((s) => s.signal_type))];

    if (filters?.signal_type && filters.signal_type !== "all") {
      if (!signalTypes.includes(filters.signal_type)) continue;
    }

    const accountContacts = contactsByAccount.get(account.id) || [];
    const primary =
      accountContacts.find((c) => c.id === account.primary_contact_id) ||
      accountContacts.find((c) => c.is_primary) ||
      accountContacts[0] ||
      null;

    if (filters?.outreach_status && filters.outreach_status !== "all" && primary) {
      const stage = primary.outreach_stage;
      const want = filters.outreach_status;
      const match =
        (want === "to_message" &&
          ["not_started", "nurture", "lost", "bounced"].includes(stage)) ||
        (want === "messaged" &&
          ["dm_sent", "email_sent", "follow_up_sent", "breakup_sent", "warming_up", "connected"].includes(
            stage
          )) ||
        (want === "replied" && stage === "replied") ||
        (want === "booked" && stage === "call_booked");
      if (!match) continue;
    } else if (filters?.outreach_status && filters.outreach_status !== "all" && !primary) {
      if (filters.outreach_status !== "to_message") continue;
    }

    const websiteDomain = account.domain
      ? `https://${account.domain}`
      : null;

    const score = account.signal_score ?? 0;

    rows.push({
      account_id: account.id,
      company_name: account.company_name,
      domain: account.domain,
      website: websiteDomain,
      signal_score: score,
      signal_research_status: account.signal_research_status,
      signal_researched_at: account.signal_researched_at,
      gtm_stage: account.gtm_stage,
      signals: accountSignals.map((s) => ({
        id: s.id,
        signal_type: s.signal_type,
        signal_source: s.signal_source,
        signal_date: s.signal_date,
        evidence_summary: s.evidence_summary,
        evidence_url: s.evidence_url,
        sources: s.sources,
        confidence_score: s.confidence_score,
      })),
      contact: primary
        ? {
            id: primary.id,
            name: primary.name,
            title: primary.title,
            linkedin_url: primary.linkedin_url,
            outreach_stage: primary.outreach_stage,
          }
        : null,
      signal_types: signalTypes,
      ranking_weight: rankingWeight(score, signalTypes),
    });
  }

  rows.sort((a, b) => b.ranking_weight - a.ranking_weight || a.company_name.localeCompare(b.company_name));
  return rows;
}

export async function getLiSignalStats() {
  const { data, error } = await supabaseAdmin
    .from("gtm_accounts")
    .select("signal_research_status, signal_score")
    .in("signal_research_status", ["has_signal", "no_signal"]);

  if (error) throw error;
  const accounts = data || [];
  const withSignal = accounts.filter((a) => a.signal_research_status === "has_signal");
  const toMessage = withSignal.length; // refined client-side; keep simple counts here

  return {
    withSignal: withSignal.length,
    noSignal: accounts.filter((a) => a.signal_research_status === "no_signal").length,
    highScore: withSignal.filter((a) => (a.signal_score || 0) >= 4).length,
    avgScore: withSignal.length
      ? Math.round(
          (withSignal.reduce((s, a) => s + (a.signal_score || 0), 0) / withSignal.length) * 10
        ) / 10
      : 0,
    researched: accounts.length,
    toMessage,
  };
}
