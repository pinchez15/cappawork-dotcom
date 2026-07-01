import { supabaseAdmin } from "@/lib/db/client";

export const GTM_STAGES = [
  { value: "discovered", label: "Discovered", color: "bg-stone-100 text-stone-600" },
  { value: "list_built", label: "List Built", color: "bg-stone-200 text-stone-700" },
  { value: "enriched", label: "Enriched", color: "bg-blue-100 text-blue-700" },
  { value: "signal_found", label: "Signal Found", color: "bg-indigo-100 text-indigo-700" },
  { value: "hypothesis_ready", label: "Hypothesis Ready", color: "bg-purple-100 text-purple-700" },
  { value: "outreach_ready", label: "Outreach Ready", color: "bg-violet-100 text-violet-700" },
  { value: "contacted", label: "Contacted", color: "bg-amber-100 text-amber-700" },
  { value: "replied", label: "Replied", color: "bg-teal-100 text-teal-700" },
  { value: "audit_booked", label: "Audit Booked", color: "bg-green-100 text-green-700" },
  { value: "audit_completed", label: "Audit Completed", color: "bg-green-200 text-green-800" },
  { value: "roi_brief_sent", label: "ROI Brief Sent", color: "bg-emerald-100 text-emerald-700" },
  { value: "discover_proposed", label: "Discover Proposed", color: "bg-cyan-100 text-cyan-700" },
  { value: "build_proposed", label: "Build Proposed", color: "bg-sky-100 text-sky-700" },
  { value: "closed_won", label: "Closed Won", color: "bg-green-300 text-green-900" },
  { value: "closed_lost", label: "Closed Lost", color: "bg-red-100 text-red-700" },
  { value: "disqualified", label: "Disqualified", color: "bg-stone-200 text-stone-500" },
] as const;

export type GtmAccount = {
  id: string;
  vertical_id: string | null;
  company_name: string;
  domain: string | null;
  linkedin_url: string | null;
  industry: string | null;
  sub_industry: string | null;
  location: string | null;
  employee_count: number | null;
  revenue_estimate: string | null;
  description: string | null;
  founder_led_score: number;
  fit_score: number;
  pain_score: number;
  fit_score_breakdown: Record<string, number>;
  pain_score_breakdown: Record<string, number>;
  case_study_match: string | null;
  signal_count: number;
  gtm_stage: string;
  enrichment_status: string;
  last_enriched_at: string | null;
  next_action: string | null;
  owner: string | null;
  primary_contact_id: string | null;
  project_id: string | null;
  bd_deal_id: string | null;
  first_source: string;
  apollo_id: string | null;
  provider_data: Record<string, unknown>;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GtmAccountWithVertical = GtmAccount & {
  vertical_name: string | null;
  vertical_tier: number | null;
  primary_contact_name: string | null;
  primary_contact_title: string | null;
};

export function normalizeDomain(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const withProtocol = url.startsWith("http") ? url : `https://${url}`;
    const hostname = new URL(withProtocol).hostname.toLowerCase();
    return hostname.replace(/^www\./, "");
  } catch {
    return (
      url
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, "")
        .split("/")[0] || null
    );
  }
}

export async function getGtmAccounts(filters?: {
  gtm_stage?: string;
  vertical_id?: string;
  min_fit_score?: number;
  limit?: number;
  offset?: number;
}): Promise<{ accounts: GtmAccountWithVertical[]; total: number }> {
  let query = supabaseAdmin
    .from("gtm_accounts")
    .select("*, verticals(name, tier), gtm_contacts!gtm_accounts_primary_contact_fk(name, title)", {
      count: "exact",
    });

  if (filters?.gtm_stage) query = query.eq("gtm_stage", filters.gtm_stage);
  if (filters?.vertical_id) query = query.eq("vertical_id", filters.vertical_id);
  if (filters?.min_fit_score) query = query.gte("fit_score", filters.min_fit_score);

  query = query.order("fit_score", { ascending: false });

  if (filters?.limit) {
    const offset = filters.offset || 0;
    query = query.range(offset, offset + filters.limit - 1);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  const accounts = (data || []).map((row: Record<string, unknown>) => {
    const vertical = row.verticals as { name: string; tier: number } | null;
    const contact = row.gtm_contacts as { name: string; title: string } | null;
    const { verticals: _v, gtm_contacts: _c, ...rest } = row;
    return {
      ...rest,
      vertical_name: vertical?.name ?? null,
      vertical_tier: vertical?.tier ?? null,
      primary_contact_name: contact?.name ?? null,
      primary_contact_title: contact?.title ?? null,
    } as GtmAccountWithVertical;
  });

  return { accounts, total: count || 0 };
}

export async function getGtmAccount(id: string): Promise<GtmAccountWithVertical | null> {
  const { data, error } = await supabaseAdmin
    .from("gtm_accounts")
    .select("*, verticals(name, tier)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const vertical = (data as Record<string, unknown>).verticals as {
    name: string;
    tier: number;
  } | null;
  const { verticals: _, ...rest } = data as Record<string, unknown>;

  let primaryContact = null;
  if (rest.primary_contact_id) {
    const { data: contact } = await supabaseAdmin
      .from("gtm_contacts")
      .select("name, title")
      .eq("id", rest.primary_contact_id as string)
      .maybeSingle();
    primaryContact = contact;
  }

  return {
    ...rest,
    vertical_name: vertical?.name ?? null,
    vertical_tier: vertical?.tier ?? null,
    primary_contact_name: primaryContact?.name ?? null,
    primary_contact_title: primaryContact?.title ?? null,
  } as GtmAccountWithVertical;
}

export async function getGtmAccountDetail(id: string) {
  const account = await getGtmAccount(id);
  if (!account) return null;

  const [contacts, signals, hypotheses, sources] = await Promise.all([
    supabaseAdmin.from("gtm_contacts").select("*").eq("account_id", id).order("relevance_score", { ascending: false }),
    supabaseAdmin.from("gtm_signals").select("*").eq("account_id", id).order("confidence_score", { ascending: false }),
    supabaseAdmin.from("gtm_hypotheses").select("*").eq("account_id", id).order("created_at", { ascending: false }).limit(1),
    supabaseAdmin.from("account_source_history").select("*, lists(name)").eq("account_id", id).order("added_at", { ascending: false }),
  ]);

  return {
    ...account,
    contacts: contacts.data || [],
    signals: signals.data || [],
    hypothesis: hypotheses.data?.[0] || null,
    source_history: (sources.data || []).map((s: Record<string, unknown>) => ({
      ...s,
      list_name: (s.lists as { name: string } | null)?.name ?? null,
    })),
  };
}

export async function findAccountByDomain(
  domain: string | null
): Promise<GtmAccount | null> {
  const normalized = normalizeDomain(domain);
  if (!normalized) return null;

  const { data, error } = await supabaseAdmin
    .from("gtm_accounts")
    .select("*")
    .eq("domain", normalized)
    .maybeSingle();

  if (error) throw error;
  return data as GtmAccount | null;
}

export async function upsertGtmAccount(
  input: Omit<
    GtmAccount,
    | "id"
    | "founder_led_score"
    | "fit_score"
    | "pain_score"
    | "fit_score_breakdown"
    | "pain_score_breakdown"
    | "signal_count"
    | "gtm_stage"
    | "enrichment_status"
    | "last_enriched_at"
    | "next_action"
    | "owner"
    | "primary_contact_id"
    | "project_id"
    | "bd_deal_id"
    | "created_at"
    | "updated_at"
  > & {
    founder_led_score?: number;
    fit_score?: number;
    pain_score?: number;
    gtm_stage?: string;
    enrichment_status?: string;
  }
): Promise<GtmAccount> {
  const domain = normalizeDomain(input.domain);
  const existing = domain ? await findAccountByDomain(domain) : null;

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from("gtm_accounts")
      .update({
        company_name: input.company_name,
        linkedin_url: input.linkedin_url ?? existing.linkedin_url,
        industry: input.industry ?? existing.industry,
        sub_industry: input.sub_industry ?? existing.sub_industry,
        location: input.location ?? existing.location,
        employee_count: input.employee_count ?? existing.employee_count,
        revenue_estimate: input.revenue_estimate ?? existing.revenue_estimate,
        description: input.description ?? existing.description,
        vertical_id: input.vertical_id ?? existing.vertical_id,
        apollo_id: input.apollo_id ?? existing.apollo_id,
        provider_data: input.provider_data ?? existing.provider_data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return data as GtmAccount;
  }

  const { data, error } = await supabaseAdmin
    .from("gtm_accounts")
    .insert({
      ...input,
      domain,
      gtm_stage: input.gtm_stage || "discovered",
      enrichment_status: input.enrichment_status || "raw",
      founder_led_score: input.founder_led_score || 0,
      fit_score: input.fit_score || 0,
      pain_score: input.pain_score || 0,
      fit_score_breakdown: input.fit_score_breakdown || {},
      pain_score_breakdown: input.pain_score_breakdown || {},
      signal_count: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data as GtmAccount;
}

export async function updateGtmAccount(
  id: string,
  updates: Partial<Omit<GtmAccount, "id" | "created_at">>
): Promise<GtmAccount> {
  const { data, error } = await supabaseAdmin
    .from("gtm_accounts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as GtmAccount;
}

export async function getGtmStats() {
  const { data, error } = await supabaseAdmin
    .from("gtm_accounts")
    .select("gtm_stage, fit_score, enrichment_status");

  if (error) throw error;
  const accounts = data || [];

  return {
    total: accounts.length,
    outreachReady: accounts.filter((a) =>
      ["outreach_ready", "contacted", "replied"].includes(a.gtm_stage)
    ).length,
    auditBooked: accounts.filter((a) =>
      ["audit_booked", "audit_completed"].includes(a.gtm_stage)
    ).length,
    closedWon: accounts.filter((a) => a.gtm_stage === "closed_won").length,
    highFit: accounts.filter((a) => a.fit_score >= 70).length,
    avgFit: accounts.length
      ? Math.round(accounts.reduce((s, a) => s + (a.fit_score || 0), 0) / accounts.length)
      : 0,
  };
}

export async function findExistingDomains(domains: string[]): Promise<Set<string>> {
  const normalized = domains
    .map((d) => normalizeDomain(d))
    .filter(Boolean) as string[];
  if (!normalized.length) return new Set();

  const { data } = await supabaseAdmin
    .from("gtm_accounts")
    .select("domain")
    .in("domain", normalized);

  return new Set((data || []).map((r) => r.domain).filter(Boolean) as string[]);
}
