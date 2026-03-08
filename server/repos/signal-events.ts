import { supabaseAdmin } from "@/lib/db/client";

export type SignalEvent = {
  id: string;
  prospect_id: string;
  signal_type: string | null;
  signal_description: string | null;
  signal_url: string | null;
  signal_strength: number;
  detected_at: string;
  detected_by: string;
  actioned: boolean;
  actioned_at: string | null;
  action_taken: string | null;
  created_at: string;
};

export const SIGNAL_TYPES = [
  { value: "linkedin_post", label: "LinkedIn Post" },
  { value: "linkedin_comment", label: "LinkedIn Comment" },
  { value: "job_posting", label: "Job Posting" },
  { value: "news_mention", label: "News Mention" },
  { value: "google_alert", label: "Google Alert" },
  { value: "website_change", label: "Website Change" },
  { value: "growth_announcement", label: "Growth Announcement" },
  { value: "ai_detected", label: "AI Detected" },
] as const;

export async function getSignalsForProspect(
  prospectId: string
): Promise<SignalEvent[]> {
  const { data, error } = await supabaseAdmin
    .from("signal_events")
    .select("*")
    .eq("prospect_id", prospectId)
    .order("detected_at", { ascending: false });

  if (error) throw error;
  return (data as SignalEvent[]) || [];
}

export async function getUnactionedSignals(): Promise<
  (SignalEvent & { company_name: string })[]
> {
  const { data, error } = await supabaseAdmin
    .from("signal_events")
    .select("*, prospects(company_name)")
    .eq("actioned", false)
    .order("signal_strength", { ascending: false })
    .order("detected_at", { ascending: false });

  if (error) throw error;

  return ((data || []) as Record<string, unknown>[]).map((row) => {
    const prospect = row.prospects as { company_name: string } | null;
    const { prospects: _, ...rest } = row;
    return {
      ...rest,
      company_name: prospect?.company_name || "Unknown",
    } as SignalEvent & { company_name: string };
  });
}

export async function createSignal(
  signal: Omit<SignalEvent, "id" | "created_at">
): Promise<SignalEvent> {
  const { data, error } = await supabaseAdmin
    .from("signal_events")
    .insert(signal)
    .select()
    .single();

  if (error) throw error;
  return data as SignalEvent;
}

export async function actionSignal(
  id: string,
  actionTaken: string
): Promise<SignalEvent> {
  const { data, error } = await supabaseAdmin
    .from("signal_events")
    .update({
      actioned: true,
      actioned_at: new Date().toISOString(),
      action_taken: actionTaken,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as SignalEvent;
}
