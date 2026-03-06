import { supabaseAdmin } from "@/lib/db/client";

export type BDDeal = {
  id: string;
  name: string;
  company: string | null;
  contact_name: string | null;
  contact_title: string | null;
  email: string | null;
  linkedin_url: string | null;
  value: number | null;
  stage: string;
  stage_order: number;
  source: string;
  referral_partner: string | null;
  catalyst_id: string | null;
  follow_up_date: string | null;
  next_action: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const STAGES = [
  { id: "lead", label: "Lead", color: "bg-stone-100" },
  { id: "contacted", label: "Contacted", color: "bg-blue-50" },
  { id: "discovery", label: "Discovery", color: "bg-amber-50" },
  { id: "proposal", label: "Proposal", color: "bg-purple-50" },
  { id: "won", label: "Won", color: "bg-green-50" },
  { id: "lost", label: "Lost", color: "bg-red-50" },
] as const;

export type DealsByStage = {
  stageId: string;
  deals: BDDeal[];
};

export async function getDealsByStage(): Promise<DealsByStage[]> {
  const { data, error } = await supabaseAdmin
    .from("bd_deals")
    .select("*")
    .order("stage_order", { ascending: true });

  if (error) throw error;
  const deals = (data as BDDeal[]) || [];

  return STAGES.map((stage) => ({
    stageId: stage.id,
    deals: deals.filter((d) => d.stage === stage.id),
  }));
}

export async function getDeal(id: string): Promise<BDDeal | null> {
  const { data, error } = await supabaseAdmin
    .from("bd_deals")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as BDDeal;
}

export async function createDeal(
  deal: Omit<BDDeal, "id" | "created_at" | "updated_at" | "stage_order">
): Promise<BDDeal> {
  // Get max order for the target stage
  const { data: maxRow } = await supabaseAdmin
    .from("bd_deals")
    .select("stage_order")
    .eq("stage", deal.stage)
    .order("stage_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (maxRow?.stage_order ?? -1) + 1;

  const { data, error } = await supabaseAdmin
    .from("bd_deals")
    .insert({ ...deal, stage_order: nextOrder })
    .select()
    .single();

  if (error) throw error;
  return data as BDDeal;
}

export async function updateDeal(
  id: string,
  updates: Partial<Omit<BDDeal, "id" | "created_at">>
): Promise<BDDeal> {
  const { data, error } = await supabaseAdmin
    .from("bd_deals")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as BDDeal;
}

export async function moveDeal(
  id: string,
  newStage: string,
  newOrder: number
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("bd_deals")
    .update({
      stage: newStage,
      stage_order: newOrder,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

export async function getOverdueDeals(): Promise<BDDeal[]> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabaseAdmin
    .from("bd_deals")
    .select("*")
    .lte("follow_up_date", today)
    .not("stage", "in", '("won","lost")')
    .order("follow_up_date", { ascending: true });

  if (error) throw error;
  return (data as BDDeal[]) || [];
}

export async function deleteDeal(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("bd_deals")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

const STAGE_WEIGHTS: Record<string, number> = {
  lead: 0.1,
  contacted: 0.2,
  discovery: 0.4,
  proposal: 0.7,
  won: 1.0,
  lost: 0,
};

export async function getPipelineStats() {
  const { data, error } = await supabaseAdmin
    .from("bd_deals")
    .select("stage, value, created_at");

  if (error) throw error;
  const deals = (data || []) as {
    stage: string;
    value: number | null;
    created_at: string;
  }[];

  const active = deals.filter(
    (d) => d.stage !== "won" && d.stage !== "lost"
  );
  const activeValue = active.reduce((sum, d) => sum + (d.value || 0), 0);

  const weightedValue = active.reduce((sum, d) => {
    const weight = STAGE_WEIGHTS[d.stage] ?? 0;
    return sum + (d.value || 0) * weight;
  }, 0);

  const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString();
  const wonYTD = deals.filter(
    (d) => d.stage === "won" && d.created_at >= yearStart
  );
  const wonValue = wonYTD.reduce((sum, d) => sum + (d.value || 0), 0);

  const withValue = deals.filter(
    (d) => d.stage !== "lost" && d.value && d.value > 0
  ).length;
  const totalActive = active.length;
  const dataCoverage =
    totalActive > 0 ? Math.round((withValue / totalActive) * 100) : 0;

  return {
    activeCount: totalActive,
    activeValue,
    weightedValue: Math.round(weightedValue),
    wonCount: wonYTD.length,
    wonValue,
    dataCoverage,
    totalWithValue: withValue,
  };
}

export async function getTopCatalysts(limit = 5) {
  const { data, error } = await supabaseAdmin
    .from("bd_deals")
    .select("catalyst_id, stage, value")
    .not("catalyst_id", "is", null);

  if (error) throw error;
  const deals = (data || []) as { catalyst_id: string; stage: string; value: number | null }[];

  // Group by catalyst
  const map = new Map<string, { count: number; wonCount: number; totalValue: number }>();
  for (const d of deals) {
    const existing = map.get(d.catalyst_id) || { count: 0, wonCount: 0, totalValue: 0 };
    existing.count++;
    if (d.stage === "won") existing.wonCount++;
    existing.totalValue += d.value || 0;
    map.set(d.catalyst_id, existing);
  }

  // Get catalyst names
  const ids = [...map.keys()];
  if (ids.length === 0) return [];

  const { data: catalysts } = await supabaseAdmin
    .from("bd_catalysts")
    .select("id, name, company, category")
    .in("id", ids);

  return (catalysts || [])
    .map((c: { id: string; name: string; company: string | null; category: string }) => ({
      ...c,
      ...map.get(c.id)!,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
