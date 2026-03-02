import { supabaseAdmin } from "@/lib/db/client";

export async function createActivityEvent(data: {
  profile_id: string;
  project_id?: string | null;
  event_type: "page_view" | "login" | "file_download";
  metadata?: Record<string, unknown>;
}) {
  const { error } = await supabaseAdmin.from("activity_events").insert({
    profile_id: data.profile_id,
    project_id: data.project_id || null,
    event_type: data.event_type,
    metadata: data.metadata || {},
  });

  if (error) throw error;
}

export async function getRecentActivity(options?: {
  projectId?: string;
  limit?: number;
}) {
  const limit = options?.limit || 100;

  let query = supabaseAdmin
    .from("activity_events")
    .select(
      `
      *,
      profile:profiles(id, name, email),
      project:projects(id, name)
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options?.projectId) {
    query = query.eq("project_id", options.projectId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}
