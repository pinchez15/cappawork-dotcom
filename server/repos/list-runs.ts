import { supabaseAdmin } from "@/lib/db/client";

export type ListRun = {
  id: string;
  list_id: string;
  run_type: string;
  provider: string | null;
  inngest_run_id: string | null;
  status: string;
  input_criteria: Record<string, unknown>;
  records_processed: number;
  records_total: number | null;
  credits_consumed: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
};

export async function createListRun(
  run: Omit<
    ListRun,
    | "id"
    | "records_processed"
    | "credits_consumed"
    | "error_message"
    | "started_at"
    | "completed_at"
    | "created_at"
  >
): Promise<ListRun> {
  const { data, error } = await supabaseAdmin
    .from("list_runs")
    .insert({
      ...run,
      status: run.status || "pending",
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as ListRun;
}

export async function updateListRun(
  id: string,
  updates: Partial<Omit<ListRun, "id" | "created_at">>
): Promise<ListRun> {
  const { data, error } = await supabaseAdmin
    .from("list_runs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as ListRun;
}

export async function getRunsForList(listId: string): Promise<ListRun[]> {
  const { data, error } = await supabaseAdmin
    .from("list_runs")
    .select("*")
    .eq("list_id", listId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as ListRun[];
}

export async function getListRun(id: string): Promise<ListRun | null> {
  const { data, error } = await supabaseAdmin
    .from("list_runs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as ListRun | null;
}

export async function logEnrichmentEvent(event: {
  list_run_id?: string;
  account_id?: string;
  contact_id?: string;
  provider: string;
  event_type: string;
  fields_updated?: string[];
  credits_consumed?: number;
  success?: boolean;
  error_message?: string;
  raw_response?: Record<string, unknown>;
}): Promise<void> {
  const { error } = await supabaseAdmin.from("enrichment_events").insert(event);
  if (error) console.error("Failed to log enrichment event:", error);
}
