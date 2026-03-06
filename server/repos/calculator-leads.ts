import { supabaseAdmin } from "@/lib/db/client";

export type CalculatorLead = {
  id: string;
  first_name: string;
  email: string;
  company: string;
  inputs: Record<string, unknown>;
  results: Record<string, unknown>;
  created_at: string;
};

export async function getCalculatorLeadCount(): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from("calculator_leads")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count || 0;
}

export async function getRecentCalculatorLeads(
  limit = 20
): Promise<CalculatorLead[]> {
  const { data, error } = await supabaseAdmin
    .from("calculator_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as CalculatorLead[]) || [];
}
