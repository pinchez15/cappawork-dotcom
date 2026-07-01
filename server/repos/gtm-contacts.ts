import { supabaseAdmin } from "@/lib/db/client";

export type GtmContact = {
  id: string;
  account_id: string;
  name: string;
  title: string | null;
  email: string | null;
  linkedin_url: string | null;
  phone: string | null;
  seniority: string | null;
  department: string | null;
  relevance_score: number;
  role_hypothesis: string | null;
  is_primary: boolean;
  outreach_stage: string;
  source: string;
  apollo_id: string | null;
  enrichment_confidence: number;
  provider_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export const OUTREACH_STAGES = [
  { value: "not_started", label: "Not Started", color: "bg-stone-100 text-stone-600" },
  { value: "warming_up", label: "Warming Up", color: "bg-blue-100 text-blue-700" },
  { value: "connected", label: "Connected", color: "bg-blue-200 text-blue-800" },
  { value: "dm_sent", label: "DM Sent", color: "bg-indigo-100 text-indigo-700" },
  { value: "email_sent", label: "Email Sent", color: "bg-purple-100 text-purple-700" },
  { value: "follow_up_sent", label: "Follow-up", color: "bg-amber-100 text-amber-700" },
  { value: "breakup_sent", label: "Breakup", color: "bg-orange-100 text-orange-700" },
  { value: "nurture", label: "Nurture", color: "bg-teal-100 text-teal-700" },
  { value: "call_booked", label: "Call Booked", color: "bg-green-100 text-green-700" },
  { value: "replied", label: "Replied", color: "bg-green-200 text-green-800" },
  { value: "bounced", label: "Bounced", color: "bg-red-100 text-red-700" },
  { value: "lost", label: "Lost", color: "bg-stone-200 text-stone-500" },
] as const;

export async function getContactsForAccount(accountId: string): Promise<GtmContact[]> {
  const { data, error } = await supabaseAdmin
    .from("gtm_contacts")
    .select("*")
    .eq("account_id", accountId)
    .order("relevance_score", { ascending: false });

  if (error) throw error;
  return data as GtmContact[];
}

export async function createGtmContact(
  contact: Omit<
    GtmContact,
    | "id"
    | "relevance_score"
    | "is_primary"
    | "outreach_stage"
    | "enrichment_confidence"
    | "created_at"
    | "updated_at"
  > & {
    relevance_score?: number;
    is_primary?: boolean;
    outreach_stage?: string;
    enrichment_confidence?: number;
  }
): Promise<GtmContact> {
  const { data, error } = await supabaseAdmin
    .from("gtm_contacts")
    .insert({
      ...contact,
      relevance_score: contact.relevance_score ?? 0,
      is_primary: contact.is_primary ?? false,
      outreach_stage: contact.outreach_stage ?? "not_started",
      enrichment_confidence: contact.enrichment_confidence ?? 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data as GtmContact;
}

export async function upsertGtmContact(
  accountId: string,
  contact: {
    name: string;
    title?: string | null;
    email?: string | null;
    linkedin_url?: string | null;
    phone?: string | null;
    seniority?: string | null;
    department?: string | null;
    relevance_score?: number;
    role_hypothesis?: string | null;
    source?: string;
    apollo_id?: string | null;
    enrichment_confidence?: number;
    provider_data?: Record<string, unknown>;
  }
): Promise<GtmContact> {
  if (contact.email) {
    const { data: existing } = await supabaseAdmin
      .from("gtm_contacts")
      .select("*")
      .eq("account_id", accountId)
      .eq("email", contact.email)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabaseAdmin
        .from("gtm_contacts")
        .update({
          name: contact.name,
          title: contact.title ?? existing.title,
          linkedin_url: contact.linkedin_url ?? existing.linkedin_url,
          relevance_score: contact.relevance_score ?? existing.relevance_score,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return data as GtmContact;
    }
  }

  return createGtmContact({
    account_id: accountId,
    name: contact.name,
    title: contact.title ?? null,
    email: contact.email ?? null,
    linkedin_url: contact.linkedin_url ?? null,
    phone: contact.phone ?? null,
    seniority: contact.seniority ?? null,
    department: contact.department ?? null,
    role_hypothesis: contact.role_hypothesis ?? null,
    source: contact.source || "apollo",
    apollo_id: contact.apollo_id ?? null,
    provider_data: contact.provider_data || {},
    relevance_score: contact.relevance_score,
    enrichment_confidence: contact.enrichment_confidence,
  });
}

export async function setPrimaryContact(
  accountId: string,
  contactId: string
): Promise<void> {
  await supabaseAdmin
    .from("gtm_contacts")
    .update({ is_primary: false })
    .eq("account_id", accountId);

  await supabaseAdmin
    .from("gtm_contacts")
    .update({ is_primary: true })
    .eq("id", contactId);

  await supabaseAdmin
    .from("gtm_accounts")
    .update({ primary_contact_id: contactId })
    .eq("id", accountId);
}

export async function updateGtmContact(
  id: string,
  updates: Partial<Omit<GtmContact, "id" | "created_at">>
): Promise<GtmContact> {
  const { data, error } = await supabaseAdmin
    .from("gtm_contacts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as GtmContact;
}
