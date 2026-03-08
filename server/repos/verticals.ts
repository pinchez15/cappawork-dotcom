import { supabaseAdmin } from "@/lib/db/client";

export type Vertical = {
  id: string;
  name: string;
  tier: number;
  close_speed: number;
  ai_awareness: number;
  automation_pain: number;
  composite_score: number;
  rationale: string | null;
  sales_nav_boolean: string | null;
  google_alert_string: string | null;
  job_posting_keywords: string[];
  signal_indicators: string[];
  created_at: string;
  updated_at: string;
};

export type VerticalWithCounts = Vertical & {
  prospect_count: number;
  enriched_count: number;
};

export async function getVerticals(): Promise<Vertical[]> {
  const { data, error } = await supabaseAdmin
    .from("verticals")
    .select("*")
    .order("tier", { ascending: true })
    .order("composite_score", { ascending: false });

  if (error) throw error;
  return (data as Vertical[]) || [];
}

export async function getVerticalsWithCounts(): Promise<VerticalWithCounts[]> {
  const [verticals, prospects] = await Promise.all([
    getVerticals(),
    supabaseAdmin
      .from("prospects")
      .select("vertical_id, enrichment_status")
      .then(({ data }) => data || []),
  ]);

  return verticals.map((v) => {
    const vProspects = (
      prospects as { vertical_id: string | null; enrichment_status: string }[]
    ).filter((p) => p.vertical_id === v.id);
    return {
      ...v,
      prospect_count: vProspects.length,
      enriched_count: vProspects.filter(
        (p) =>
          p.enrichment_status === "fully_enriched" ||
          p.enrichment_status === "partially_enriched"
      ).length,
    };
  });
}

export async function getVertical(id: string): Promise<Vertical | null> {
  const { data, error } = await supabaseAdmin
    .from("verticals")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Vertical;
}

export async function createVertical(
  vertical: Omit<Vertical, "id" | "composite_score" | "created_at" | "updated_at">
): Promise<Vertical> {
  const { data, error } = await supabaseAdmin
    .from("verticals")
    .insert(vertical)
    .select()
    .single();

  if (error) throw error;
  return data as Vertical;
}

export async function updateVertical(
  id: string,
  updates: Partial<Omit<Vertical, "id" | "composite_score" | "created_at">>
): Promise<Vertical> {
  const { data, error } = await supabaseAdmin
    .from("verticals")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Vertical;
}

export async function deleteVertical(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("verticals")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
