import { supabaseAdmin } from "@/lib/db/client";

export type OutreachActivity = {
  id: string;
  prospect_id: string;
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

export const CHANNELS = [
  { value: "linkedin_engage", label: "LinkedIn Engage" },
  { value: "linkedin_connect", label: "LinkedIn Connect" },
  { value: "linkedin_dm", label: "LinkedIn DM" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "other", label: "Other" },
] as const;

export const ACTIVITY_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "opened", label: "Opened" },
  { value: "replied", label: "Replied" },
  { value: "bounced", label: "Bounced" },
  { value: "no_response", label: "No Response" },
] as const;

export async function getActivitiesForProspect(
  prospectId: string
): Promise<OutreachActivity[]> {
  const { data, error } = await supabaseAdmin
    .from("outreach_activities")
    .select("*")
    .eq("prospect_id", prospectId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as OutreachActivity[]) || [];
}

export async function createActivity(
  activity: Omit<OutreachActivity, "id" | "created_at" | "updated_at">
): Promise<OutreachActivity> {
  const { data, error } = await supabaseAdmin
    .from("outreach_activities")
    .insert(activity)
    .select()
    .single();

  if (error) throw error;
  return data as OutreachActivity;
}

export async function updateActivity(
  id: string,
  updates: Partial<Omit<OutreachActivity, "id" | "created_at">>
): Promise<OutreachActivity> {
  const { data, error } = await supabaseAdmin
    .from("outreach_activities")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as OutreachActivity;
}

export async function deleteActivity(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("outreach_activities")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
