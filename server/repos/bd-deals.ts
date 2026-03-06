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

export async function deleteDeal(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("bd_deals")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function getPipelineStats() {
  const { data, error } = await supabaseAdmin
    .from("bd_deals")
    .select("stage, value");

  if (error) throw error;
  const deals = (data || []) as { stage: string; value: number | null }[];

  const total = deals.length;
  const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
  const won = deals.filter((d) => d.stage === "won");
  const wonValue = won.reduce((sum, d) => sum + (d.value || 0), 0);
  const active = deals.filter(
    (d) => d.stage !== "won" && d.stage !== "lost"
  ).length;

  return { total, totalValue, wonCount: won.length, wonValue, active };
}
