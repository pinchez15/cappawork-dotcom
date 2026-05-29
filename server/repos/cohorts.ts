import { supabaseAdmin } from "@/lib/db/client";

export type CohortType = "build" | "literacy";

export type CohortLead = {
  id: string;
  name: string | null;
  linkedin_url: string;
  email: string;
  cohort_type: CohortType;
  source: string | null;
  status: "new" | "contacted" | "qualified" | "paid" | "declined";
  notes: string | null;
  created_at: string;
  contacted_at: string | null;
  converted_at: string | null;
};

export type Cohort = {
  id: string;
  name: string;
  type: CohortType;
  start_date: string;
  end_date: string;
  session_count: number;
  zoom_link: string | null;
  status: "upcoming" | "active" | "completed";
  created_at: string;
};

export type CohortParticipant = {
  id: string;
  cohort_id: string;
  clerk_user_id: string | null;
  email: string;
  joined_at: string;
  access_expires_at: string;
};

export type CohortMaterial = {
  id: string;
  cohort_id: string | null;
  cohort_type: CohortType | null;
  section: string;
  title: string;
  description: string | null;
  type: "video" | "pdf" | "worksheet" | "recording";
  url: string;
  published_at: string | null;
  display_order: number;
  created_at: string;
};

// ----------------------------------------------------------------------------
// Leads
// ----------------------------------------------------------------------------

export async function createLead(input: {
  name?: string | null;
  linkedin_url: string;
  email: string;
  cohort_type: CohortType;
  source?: string;
}): Promise<CohortLead> {
  const { data, error } = await supabaseAdmin
    .from("cohort_leads")
    .insert({
      name: input.name ?? null,
      linkedin_url: input.linkedin_url,
      email: input.email,
      cohort_type: input.cohort_type,
      source: input.source ?? "landing_page",
    })
    .select()
    .single();

  if (error) throw error;
  return data as CohortLead;
}

export async function listLeads(filter?: {
  status?: CohortLead["status"];
  cohort_type?: CohortType;
}): Promise<CohortLead[]> {
  let query = supabaseAdmin
    .from("cohort_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter?.status) query = query.eq("status", filter.status);
  if (filter?.cohort_type) query = query.eq("cohort_type", filter.cohort_type);

  const { data, error } = await query;
  if (error) throw error;
  return (data as CohortLead[]) || [];
}

export async function updateLeadStatus(
  id: string,
  status: CohortLead["status"]
): Promise<CohortLead> {
  const updates: Record<string, unknown> = { status };
  if (status === "contacted") updates.contacted_at = new Date().toISOString();
  if (status === "paid") updates.converted_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("cohort_leads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as CohortLead;
}

async function markLeadConvertedByEmail(
  email: string,
  cohortType: CohortType
): Promise<void> {
  // Best-effort: a paid participant may not have an originating lead row.
  await supabaseAdmin
    .from("cohort_leads")
    .update({ status: "paid", converted_at: new Date().toISOString() })
    .eq("email", email)
    .eq("cohort_type", cohortType)
    .neq("status", "paid");
}

// ----------------------------------------------------------------------------
// Cohorts
// ----------------------------------------------------------------------------

export async function listCohorts(): Promise<Cohort[]> {
  const { data, error } = await supabaseAdmin
    .from("cohorts")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) throw error;
  return (data as Cohort[]) || [];
}

export async function getCohort(id: string): Promise<Cohort | null> {
  const { data, error } = await supabaseAdmin
    .from("cohorts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Cohort;
}

export async function createCohort(input: {
  name: string;
  type: CohortType;
  start_date: string;
  end_date: string;
  session_count: number;
  zoom_link?: string | null;
  status?: Cohort["status"];
}): Promise<Cohort> {
  const { data, error } = await supabaseAdmin
    .from("cohorts")
    .insert({
      name: input.name,
      type: input.type,
      start_date: input.start_date,
      end_date: input.end_date,
      session_count: input.session_count,
      zoom_link: input.zoom_link ?? null,
      status: input.status ?? "upcoming",
    })
    .select()
    .single();

  if (error) throw error;
  return data as Cohort;
}

export async function updateCohort(
  id: string,
  updates: Partial<Omit<Cohort, "id" | "created_at">>
): Promise<Cohort> {
  const { data, error } = await supabaseAdmin
    .from("cohorts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Cohort;
}

// ----------------------------------------------------------------------------
// Participants
// ----------------------------------------------------------------------------

export type ParticipationWithCohort = CohortParticipant & { cohort: Cohort };

/**
 * Active cohort enrollments for a signed-in user. Matches on clerk_user_id OR
 * email (participants are enrolled by email before they've signed in), and only
 * returns rows whose access window hasn't expired. This is the portal gate.
 */
export async function getActiveParticipationsForUser(
  clerkUserId: string,
  email: string | null
): Promise<ParticipationWithCohort[]> {
  const nowIso = new Date().toISOString();
  const orClauses = [`clerk_user_id.eq.${clerkUserId}`];
  if (email) orClauses.push(`email.eq.${email}`);

  const { data, error } = await supabaseAdmin
    .from("cohort_participants")
    .select("*, cohort:cohorts(*)")
    .gte("access_expires_at", nowIso)
    .or(orClauses.join(","));

  if (error) throw error;
  return (data as ParticipationWithCohort[]) || [];
}

export async function listParticipants(
  cohortId: string
): Promise<CohortParticipant[]> {
  const { data, error } = await supabaseAdmin
    .from("cohort_participants")
    .select("*")
    .eq("cohort_id", cohortId)
    .order("joined_at", { ascending: true });

  if (error) throw error;
  return (data as CohortParticipant[]) || [];
}

function addDays(dateInput: string, days: number): string {
  const d = new Date(dateInput);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/**
 * Enrolls a participant by email. access_expires_at = cohort end_date + 90 days.
 * Idempotent on (cohort_id, email). Marks any matching lead as paid/converted.
 * Returns the participant row plus its cohort.
 */
export async function enrollParticipant(input: {
  email: string;
  cohortId: string;
  clerkUserId?: string | null;
}): Promise<{ participant: CohortParticipant; cohort: Cohort }> {
  const cohort = await getCohort(input.cohortId);
  if (!cohort) throw new Error("Cohort not found");

  const accessExpiresAt = addDays(cohort.end_date, 90);

  const { data, error } = await supabaseAdmin
    .from("cohort_participants")
    .upsert(
      {
        cohort_id: input.cohortId,
        email: input.email,
        clerk_user_id: input.clerkUserId ?? null,
        access_expires_at: accessExpiresAt,
      },
      { onConflict: "cohort_id,email" }
    )
    .select()
    .single();

  if (error) throw error;

  await markLeadConvertedByEmail(input.email, cohort.type);

  return { participant: data as CohortParticipant, cohort };
}

export async function removeParticipant(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("cohort_participants")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// ----------------------------------------------------------------------------
// Materials
// ----------------------------------------------------------------------------

// Materials that belong to a cohort directly, OR shared-library materials
// (cohort_id null) scoped to the cohort's type.
function cohortMaterialsOrClause(cohort: Cohort): string {
  return `cohort_id.eq.${cohort.id},and(cohort_id.is.null,cohort_type.eq.${cohort.type})`;
}

export async function listPublishedMaterialsForCohort(
  cohort: Cohort
): Promise<CohortMaterial[]> {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from("cohort_materials")
    .select("*")
    .or(cohortMaterialsOrClause(cohort))
    .not("published_at", "is", null)
    .lte("published_at", nowIso)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data as CohortMaterial[]) || [];
}

// All materials (published or not) for the admin view of a cohort.
export async function listMaterialsForCohortAdmin(
  cohort: Cohort
): Promise<CohortMaterial[]> {
  const { data, error } = await supabaseAdmin
    .from("cohort_materials")
    .select("*")
    .or(cohortMaterialsOrClause(cohort))
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data as CohortMaterial[]) || [];
}

export async function getMaterial(id: string): Promise<CohortMaterial | null> {
  const { data, error } = await supabaseAdmin
    .from("cohort_materials")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as CohortMaterial;
}

export async function createMaterial(input: {
  cohort_id: string | null;
  cohort_type: CohortType | null;
  section: string;
  title: string;
  description?: string | null;
  type: CohortMaterial["type"];
  url: string;
  published_at?: string | null;
  display_order?: number;
}): Promise<CohortMaterial> {
  const { data, error } = await supabaseAdmin
    .from("cohort_materials")
    .insert({
      cohort_id: input.cohort_id,
      cohort_type: input.cohort_type,
      section: input.section,
      title: input.title,
      description: input.description ?? null,
      type: input.type,
      url: input.url,
      published_at: input.published_at ?? null,
      display_order: input.display_order ?? 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CohortMaterial;
}

export async function updateMaterial(
  id: string,
  updates: Partial<Omit<CohortMaterial, "id" | "created_at">>
): Promise<CohortMaterial> {
  const { data, error } = await supabaseAdmin
    .from("cohort_materials")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as CohortMaterial;
}

export async function deleteMaterial(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("cohort_materials")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// ----------------------------------------------------------------------------
// Display helpers (shared by portal + admin)
// ----------------------------------------------------------------------------

export const COHORT_TYPE_LABELS: Record<CohortType, string> = {
  build: "AI for Business Leaders",
  literacy: "AI Literacy Bootcamp",
};

export const COHORT_TYPE_LANDING: Record<CohortType, string> = {
  build: "/ai-for-business-leaders",
  literacy: "/ai-literacy-bootcamp",
};

// Human label for a material section key (e.g. "session_1" -> "Session 1").
export function sectionLabel(section: string): string {
  if (section === "ai_basics") return "AI Basics";
  const m = section.match(/^session_(\d+)$/);
  if (m) return `Session ${m[1]}`;
  return section
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Sort key so AI Basics is first, then sessions in order, then everything else.
export function sectionSortKey(section: string): number {
  if (section === "ai_basics") return 0;
  const m = section.match(/^session_(\d+)$/);
  if (m) return 100 + parseInt(m[1], 10);
  return 1000;
}

// Weekly session dates derived from start_date + session_count (no per-session
// table in v1). Returns ISO date strings.
export function sessionDates(cohort: Cohort): string[] {
  const dates: string[] = [];
  for (let i = 0; i < cohort.session_count; i++) {
    dates.push(addDays(cohort.start_date, i * 7).slice(0, 10));
  }
  return dates;
}

// The next upcoming session date (>= today), or null if all have passed.
export function nextSessionDate(cohort: Cohort): string | null {
  const today = new Date().toISOString().slice(0, 10);
  return sessionDates(cohort).find((d) => d >= today) ?? null;
}
