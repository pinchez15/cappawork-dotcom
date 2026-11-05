import { supabaseAdmin } from "@/lib/db/client";

export type GtmOutreachActivity = {
  id: string;
  contact_id: string;
  account_id: string;
  step_number: number | null;
  channel: string | null;
  action_type: string | null;
  content: string | null;
  status: string;
  response_text: string | null;
  responded_at: string | null;
  scheduled_for: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function createGtmOutreachActivity(input: {
  contact_id: string;
  account_id: string;
  channel?: string;
  action_type?: string;
  content?: string | null;
  status?: string;
  sent_at?: string | null;
  responded_at?: string | null;
  response_text?: string | null;
}): Promise<GtmOutreachActivity> {
  const { data, error } = await supabaseAdmin
    .from("gtm_outreach_activities")
    .insert({
      contact_id: input.contact_id,
      account_id: input.account_id,
      channel: input.channel || "linkedin_dm",
      action_type: input.action_type || "status_update",
      content: input.content ?? null,
      status: input.status || "sent",
      sent_at: input.sent_at ?? new Date().toISOString(),
      responded_at: input.responded_at ?? null,
      response_text: input.response_text ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as GtmOutreachActivity;
}

export async function getActivitiesForContact(
  contactId: string
): Promise<GtmOutreachActivity[]> {
  const { data, error } = await supabaseAdmin
    .from("gtm_outreach_activities")
    .select("*")
    .eq("contact_id", contactId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as GtmOutreachActivity[]) || [];
}

export async function getActivitiesForAccount(
  accountId: string
): Promise<GtmOutreachActivity[]> {
  const { data, error } = await supabaseAdmin
    .from("gtm_outreach_activities")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as GtmOutreachActivity[]) || [];
}
