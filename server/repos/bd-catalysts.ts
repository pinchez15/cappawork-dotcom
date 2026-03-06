import { supabaseAdmin } from "@/lib/db/client";

export type BDCatalyst = {
  id: string;
  name: string;
  company: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  category: string;
  relationship: string;
  notes: string | null;
  last_contact_date: string | null;
  next_contact_date: string | null;
  next_action: string | null;
  created_at: string;
  updated_at: string;
};

export type CatalystWithStats = BDCatalyst & {
  deal_count: number;
  won_count: number;
  total_value: number;
};

export const CATEGORIES = [
  { value: "cpa", label: "CPA / Accountant" },
  { value: "attorney", label: "Attorney" },
  { value: "coach", label: "Business Coach" },
  { value: "fractional", label: "Fractional Executive" },
  { value: "eos", label: "EOS Implementer" },
  { value: "insurance", label: "Insurance Broker" },
  { value: "banker", label: "Banker" },
  { value: "consultant", label: "Consultant" },
  { value: "peer", label: "Peer / Founder" },
  { value: "other", label: "Other" },
] as const;

export const RELATIONSHIPS = [
  { value: "cold", label: "Cold", color: "bg-stone-100 text-stone-600" },
  { value: "warm", label: "Warm", color: "bg-amber-100 text-amber-700" },
  { value: "strong", label: "Strong", color: "bg-blue-100 text-blue-700" },
  { value: "champion", label: "Champion", color: "bg-green-100 text-green-700" },
] as const;

export async function getCatalysts(): Promise<BDCatalyst[]> {
  const { data, error } = await supabaseAdmin
    .from("bd_catalysts")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data as BDCatalyst[]) || [];
}

export async function getCatalystsWithStats(): Promise<CatalystWithStats[]> {
  const [catalysts, deals] = await Promise.all([
    getCatalysts(),
    supabaseAdmin
      .from("bd_deals")
      .select("catalyst_id, stage, value")
      .not("catalyst_id", "is", null)
      .then(({ data }) => data || []),
  ]);

  return catalysts.map((c) => {
    const linked = (deals as { catalyst_id: string; stage: string; value: number | null }[])
      .filter((d) => d.catalyst_id === c.id);
    return {
      ...c,
      deal_count: linked.length,
      won_count: linked.filter((d) => d.stage === "won").length,
      total_value: linked.reduce((sum, d) => sum + (d.value || 0), 0),
    };
  });
}

export async function getCatalyst(id: string): Promise<BDCatalyst | null> {
  const { data, error } = await supabaseAdmin
    .from("bd_catalysts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as BDCatalyst;
}

export async function createCatalyst(
  catalyst: Omit<BDCatalyst, "id" | "created_at" | "updated_at">
): Promise<BDCatalyst> {
  const { data, error } = await supabaseAdmin
    .from("bd_catalysts")
    .insert(catalyst)
    .select()
    .single();

  if (error) throw error;
  return data as BDCatalyst;
}

export async function updateCatalyst(
  id: string,
  updates: Partial<Omit<BDCatalyst, "id" | "created_at">>
): Promise<BDCatalyst> {
  const { data, error } = await supabaseAdmin
    .from("bd_catalysts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as BDCatalyst;
}

export async function deleteCatalyst(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("bd_catalysts")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function getCatalystsDueForContact(): Promise<BDCatalyst[]> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabaseAdmin
    .from("bd_catalysts")
    .select("*")
    .lte("next_contact_date", today)
    .order("next_contact_date", { ascending: true });

  if (error) throw error;
  return (data as BDCatalyst[]) || [];
}
