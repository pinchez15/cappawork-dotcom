import { supabaseAdmin } from "@/lib/db/client";

export type Prospect = {
  id: string;
  vertical_id: string | null;
  company_name: string;
  estimated_revenue: string | null;
  location: string | null;
  website: string | null;
  decision_maker_name: string | null;
  decision_maker_title: string | null;
  linkedin_url: string | null;
  email_verified: string | null;
  email_source: string | null;
  key_pain_point: string | null;
  why_closes_fast: string | null;
  trigger_event: string | null;
  trigger_event_source: string | null;
  trigger_event_date: string | null;
  tech_stack_signal: string | null;
  tech_stack_source: string | null;
  personalized_first_line: string | null;
  cold_email_hook: string | null;
  sales_nav_search_tip: string | null;
  priority_score: number;
  score_breakdown: Record<string, number>;
  sequence_stage: string;
  enrichment_status: string;
  last_enriched_at: string | null;
  ai_enrichment_log: Record<string, unknown>[];
  created_at: string;
  updated_at: string;
};

export type ProspectWithVertical = Prospect & {
  vertical_name: string | null;
  vertical_tier: number | null;
};

export const SEQUENCE_STAGES = [
  { value: "not_started", label: "Not Started", color: "bg-stone-100 text-stone-600" },
  { value: "warming_up", label: "Warming Up", color: "bg-blue-100 text-blue-700" },
  { value: "connected", label: "Connected", color: "bg-blue-200 text-blue-800" },
  { value: "dm_sent", label: "DM Sent", color: "bg-indigo-100 text-indigo-700" },
  { value: "email_sent", label: "Email Sent", color: "bg-purple-100 text-purple-700" },
  { value: "follow_up_sent", label: "Follow-up Sent", color: "bg-amber-100 text-amber-700" },
  { value: "breakup_sent", label: "Breakup Sent", color: "bg-orange-100 text-orange-700" },
  { value: "nurture", label: "Nurture", color: "bg-teal-100 text-teal-700" },
  { value: "call_booked", label: "Call Booked", color: "bg-green-100 text-green-700" },
  { value: "diagnostic_sold", label: "Diagnostic Sold", color: "bg-green-200 text-green-800" },
  { value: "lost", label: "Lost", color: "bg-red-100 text-red-700" },
  { value: "disqualified", label: "Disqualified", color: "bg-stone-200 text-stone-500" },
] as const;

export const ENRICHMENT_STATUSES = [
  { value: "raw", label: "Raw", color: "bg-stone-100 text-stone-600" },
  { value: "partially_enriched", label: "Partial", color: "bg-amber-100 text-amber-700" },
  { value: "fully_enriched", label: "Enriched", color: "bg-green-100 text-green-700" },
  { value: "stale", label: "Stale", color: "bg-red-100 text-red-700" },
] as const;

// Priority score calculation
export function calculatePriorityScore(
  prospect: Partial<Prospect>,
  verticalTier: number | null
): { score: number; breakdown: Record<string, number> } {
  const breakdown: Record<string, number> = {};

  // Base score from tier
  const tier = verticalTier || 3;
  breakdown.tier = tier === 1 ? 40 : tier === 2 ? 25 : 15;

  // Trigger event
  if (prospect.trigger_event) {
    breakdown.trigger =
      prospect.trigger_event_source !== "ai_generated" ? 15 : 5;
  }

  // Email
  if (prospect.email_verified) {
    breakdown.email = 10;
  }

  // Tech stack
  if (prospect.tech_stack_signal) {
    breakdown.tech_stack =
      prospect.tech_stack_source !== "ai_generated" ? 10 : 3;
  }

  // Decision maker
  if (prospect.decision_maker_name) {
    breakdown.decision_maker = 10;
  }

  // LinkedIn
  if (prospect.linkedin_url) {
    breakdown.linkedin = 5;
  }

  const score = Math.min(
    100,
    Object.values(breakdown).reduce((sum, v) => sum + v, 0)
  );

  return { score, breakdown };
}

// Enrichment status calculation
export function calculateEnrichmentStatus(prospect: Partial<Prospect>): string {
  const enrichmentFields = [
    prospect.decision_maker_name,
    prospect.trigger_event,
    prospect.tech_stack_signal,
    prospect.personalized_first_line,
    prospect.cold_email_hook,
    prospect.key_pain_point,
  ];

  const filled = enrichmentFields.filter(Boolean).length;

  // Check staleness
  if (prospect.last_enriched_at) {
    const enrichedDate = new Date(prospect.last_enriched_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (enrichedDate < thirtyDaysAgo && filled > 0) return "stale";
  }

  if (filled === 0) return "raw";
  if (filled >= 5) return "fully_enriched";
  return "partially_enriched";
}

export async function getProspects(filters?: {
  vertical_id?: string;
  tier?: number;
  sequence_stage?: string;
  enrichment_status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ prospects: ProspectWithVertical[]; total: number }> {
  let query = supabaseAdmin
    .from("prospects")
    .select("*, verticals(name, tier)", { count: "exact" });

  if (filters?.vertical_id) {
    query = query.eq("vertical_id", filters.vertical_id);
  }
  if (filters?.sequence_stage) {
    query = query.eq("sequence_stage", filters.sequence_stage);
  }
  if (filters?.enrichment_status) {
    query = query.eq("enrichment_status", filters.enrichment_status);
  }

  query = query.order("priority_score", { ascending: false });

  if (filters?.limit) {
    const offset = filters.offset || 0;
    query = query.range(offset, offset + filters.limit - 1);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  const prospects = (data || []).map((row: Record<string, unknown>) => {
    const vertical = row.verticals as { name: string; tier: number } | null;
    const { verticals: _, ...rest } = row;
    return {
      ...rest,
      vertical_name: vertical?.name || null,
      vertical_tier: vertical?.tier || null,
    } as ProspectWithVertical;
  });

  // Filter by tier client-side (join filter)
  const filtered = filters?.tier
    ? prospects.filter((p) => p.vertical_tier === filters.tier)
    : prospects;

  return { prospects: filtered, total: count || 0 };
}

export async function getProspect(id: string): Promise<ProspectWithVertical | null> {
  const { data, error } = await supabaseAdmin
    .from("prospects")
    .select("*, verticals(name, tier)")
    .eq("id", id)
    .single();

  if (error) return null;

  const vertical = (data as Record<string, unknown>).verticals as {
    name: string;
    tier: number;
  } | null;
  const { verticals: _, ...rest } = data as Record<string, unknown>;

  return {
    ...rest,
    vertical_name: vertical?.name || null,
    vertical_tier: vertical?.tier || null,
  } as ProspectWithVertical;
}

export async function createProspect(
  prospect: Omit<Prospect, "id" | "priority_score" | "score_breakdown" | "enrichment_status" | "ai_enrichment_log" | "last_enriched_at" | "created_at" | "updated_at"> & {
    priority_score?: number;
    score_breakdown?: Record<string, number>;
    enrichment_status?: string;
  }
): Promise<Prospect> {
  const { data, error } = await supabaseAdmin
    .from("prospects")
    .insert({
      ...prospect,
      priority_score: prospect.priority_score || 0,
      score_breakdown: prospect.score_breakdown || {},
      enrichment_status: prospect.enrichment_status || "raw",
      ai_enrichment_log: [],
    })
    .select()
    .single();

  if (error) throw error;
  return data as Prospect;
}

export async function updateProspect(
  id: string,
  updates: Partial<Omit<Prospect, "id" | "created_at">>
): Promise<Prospect> {
  const { data, error } = await supabaseAdmin
    .from("prospects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Prospect;
}

export async function deleteProspect(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("prospects")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function getProspectStats() {
  const { data, error } = await supabaseAdmin
    .from("prospects")
    .select("enrichment_status, sequence_stage, priority_score");

  if (error) throw error;
  const prospects = (data || []) as {
    enrichment_status: string;
    sequence_stage: string;
    priority_score: number;
  }[];

  return {
    total: prospects.length,
    enriched: prospects.filter(
      (p) =>
        p.enrichment_status === "fully_enriched" ||
        p.enrichment_status === "partially_enriched"
    ).length,
    raw: prospects.filter((p) => p.enrichment_status === "raw").length,
    stale: prospects.filter((p) => p.enrichment_status === "stale").length,
    activeSequences: prospects.filter(
      (p) =>
        p.sequence_stage !== "not_started" &&
        p.sequence_stage !== "diagnostic_sold" &&
        p.sequence_stage !== "lost" &&
        p.sequence_stage !== "disqualified"
    ).length,
    callsBooked: prospects.filter((p) => p.sequence_stage === "call_booked")
      .length,
    sold: prospects.filter((p) => p.sequence_stage === "diagnostic_sold")
      .length,
    avgScore: prospects.length
      ? Math.round(
          prospects.reduce((sum, p) => sum + p.priority_score, 0) /
            prospects.length
        )
      : 0,
  };
}

export async function getProspectsForEnrichment(
  limit = 20
): Promise<Prospect[]> {
  // Get raw prospects first (highest tier), then stale
  const { data, error } = await supabaseAdmin
    .from("prospects")
    .select("*, verticals(tier)")
    .in("enrichment_status", ["raw", "stale"])
    .order("enrichment_status", { ascending: true }) // raw before stale
    .order("priority_score", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return ((data || []) as Record<string, unknown>[]).map((row) => {
    const { verticals: _, ...rest } = row;
    return rest as Prospect;
  });
}
