import { supabaseAdmin } from "@/lib/db/client";
import type { ListSearchCriteria } from "@/lib/validators/list-builder";

export type List = {
  id: string;
  name: string;
  vertical_id: string | null;
  description: string | null;
  icp_template: string | null;
  source_provider: string;
  status: string;
  total_accounts: number;
  total_contacts: number;
  avg_fit_score: number;
  enrichment_status: string;
  signal_status: string;
  notes: string | null;
  created_by: string;
  last_run_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ListWithCriteria = List & {
  criteria: ListSearchCriteria | null;
  vertical_name: string | null;
};

export const LIST_STATUSES = [
  { value: "draft", label: "Draft", color: "bg-stone-100 text-stone-600" },
  { value: "generating", label: "Generating", color: "bg-blue-100 text-blue-700" },
  { value: "review", label: "Review", color: "bg-amber-100 text-amber-700" },
  { value: "enriching", label: "Enriching", color: "bg-indigo-100 text-indigo-700" },
  { value: "scoring", label: "Scoring", color: "bg-purple-100 text-purple-700" },
  { value: "ready", label: "Ready", color: "bg-green-100 text-green-700" },
  { value: "synced", label: "Synced", color: "bg-teal-100 text-teal-700" },
  { value: "archived", label: "Archived", color: "bg-stone-200 text-stone-500" },
] as const;

export async function getLists(filters?: {
  status?: string;
  limit?: number;
}): Promise<List[]> {
  let query = supabaseAdmin
    .from("lists")
    .select("*")
    .order("updated_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data as List[];
}

export async function getList(id: string): Promise<ListWithCriteria | null> {
  const { data: list, error } = await supabaseAdmin
    .from("lists")
    .select("*, verticals(name)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!list) return null;

  const { data: criteria } = await supabaseAdmin
    .from("list_search_criteria")
    .select("*")
    .eq("list_id", id)
    .maybeSingle();

  const row = list as List & { verticals: { name: string } | null };
  return {
    ...row,
    vertical_name: row.verticals?.name ?? null,
    criteria: criteria
      ? {
          industries: criteria.industries ?? [],
          geographies: criteria.geographies ?? [],
          employee_min: criteria.employee_min ?? undefined,
          employee_max: criteria.employee_max ?? undefined,
          revenue_min: criteria.revenue_min ?? undefined,
          revenue_max: criteria.revenue_max ?? undefined,
          company_keywords: criteria.company_keywords ?? [],
          excluded_keywords: criteria.excluded_keywords ?? [],
          technologies: criteria.technologies ?? [],
          job_titles: criteria.job_titles ?? [],
          seniority_levels: criteria.seniority_levels ?? [],
          departments: criteria.departments ?? [],
          founder_led_min_score: criteria.founder_led_min_score ?? undefined,
          website_keywords: criteria.website_keywords ?? [],
          signals_required: criteria.signals_required ?? [],
          signals_excluded: criteria.signals_excluded ?? [],
          case_study_match: criteria.case_study_match ?? undefined,
          min_fit_score: criteria.min_fit_score ?? undefined,
          max_records: criteria.max_records ?? 100,
          enrichment_depth: criteria.enrichment_depth ?? "standard",
        }
      : null,
  };
}

export async function createList(
  list: Omit<List, "id" | "total_accounts" | "total_contacts" | "avg_fit_score" | "enrichment_status" | "signal_status" | "crm_sync_status" | "last_run_at" | "created_at" | "updated_at">,
  criteria: ListSearchCriteria
): Promise<ListWithCriteria> {
  const { data: created, error } = await supabaseAdmin
    .from("lists")
    .insert({
      name: list.name,
      vertical_id: list.vertical_id,
      description: list.description,
      icp_template: list.icp_template,
      source_provider: list.source_provider,
      status: list.status || "draft",
      notes: list.notes,
      created_by: list.created_by,
    })
    .select()
    .single();

  if (error) throw error;

  const { error: criteriaError } = await supabaseAdmin
    .from("list_search_criteria")
    .insert({ list_id: created.id, ...criteria });

  if (criteriaError) throw criteriaError;

  const result = await getList(created.id);
  if (!result) throw new Error("Failed to fetch created list");
  return result;
}

export async function updateList(
  id: string,
  updates: Partial<Omit<List, "id" | "created_at" | "created_by">>
): Promise<List> {
  const { data, error } = await supabaseAdmin
    .from("lists")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as List;
}

export async function cloneList(
  id: string,
  createdBy: string
): Promise<ListWithCriteria> {
  const source = await getList(id);
  if (!source || !source.criteria) throw new Error("List not found");

  return createList(
    {
      name: `${source.name} (copy)`,
      vertical_id: source.vertical_id,
      description: source.description,
      icp_template: source.icp_template,
      source_provider: source.source_provider,
      status: "draft",
      notes: source.notes,
      created_by: createdBy,
    },
    source.criteria
  );
}

export async function deleteList(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("lists").delete().eq("id", id);
  if (error) throw error;
}

export async function getListStats(): Promise<{
  total: number;
  active: number;
  totalAccounts: number;
  inPipeline: number;
}> {
  const { data: lists, error } = await supabaseAdmin.from("lists").select("*");
  if (error) throw error;

  const all = lists as List[];
  const { count: pipelineCount } = await supabaseAdmin
    .from("gtm_accounts")
    .select("*", { count: "exact", head: true })
    .not("gtm_stage", "in", '("discovered","list_built","disqualified")');

  return {
    total: all.length,
    active: all.filter((l) => !["archived", "draft"].includes(l.status)).length,
    totalAccounts: all.reduce((sum, l) => sum + (l.total_accounts || 0), 0),
    inPipeline: pipelineCount || 0,
  };
}

export async function refreshListCounts(listId: string): Promise<void> {
  const { count: accountCount } = await supabaseAdmin
    .from("list_memberships")
    .select("*", { count: "exact", head: true })
    .eq("list_id", listId);

  const { data: memberships } = await supabaseAdmin
    .from("list_memberships")
    .select("account_id")
    .eq("list_id", listId);

  const accountIds = (memberships || []).map((m) => m.account_id);
  let contactCount = 0;
  let avgFit = 0;

  if (accountIds.length) {
    const { count } = await supabaseAdmin
      .from("gtm_contacts")
      .select("*", { count: "exact", head: true })
      .in("account_id", accountIds);
    contactCount = count || 0;

    const { data: scores } = await supabaseAdmin
      .from("gtm_accounts")
      .select("fit_score")
      .in("id", accountIds)
      .gt("fit_score", 0);

    avgFit =
      scores && scores.length > 0
        ? Math.round(scores.reduce((s, r) => s + (r.fit_score || 0), 0) / scores.length)
        : 0;
  }

  await updateList(listId, {
    total_accounts: accountCount || 0,
    total_contacts: contactCount,
    avg_fit_score: avgFit,
  });
}
