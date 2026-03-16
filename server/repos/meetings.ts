import { supabaseAdmin } from "@/lib/db/client";

export async function upsertMeeting(data: {
  calendly_event_id: string;
  project_id?: string | null;
  organization_id?: string | null;
  title: string;
  start_time: string;
  end_time: string;
  location_url?: string | null;
  status?: string;
  invitee_name?: string | null;
  invitee_email?: string | null;
  calendly_event_url?: string | null;
  calendly_cancel_url?: string | null;
  event_type_name?: string | null;
}) {
  const { data: meeting, error } = await supabaseAdmin
    .from("meetings")
    .upsert(
      {
        calendly_event_id: data.calendly_event_id,
        project_id: data.project_id || null,
        organization_id: data.organization_id || null,
        title: data.title,
        start_time: data.start_time,
        end_time: data.end_time,
        location_url: data.location_url || null,
        status: data.status || "scheduled",
        invitee_name: data.invitee_name || null,
        invitee_email: data.invitee_email || null,
        calendly_event_url: data.calendly_event_url || null,
        calendly_cancel_url: data.calendly_cancel_url || null,
        event_type_name: data.event_type_name || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "calendly_event_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return meeting;
}

export async function getMeetingsForProject(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from("meetings")
    .select("*")
    .eq("project_id", projectId)
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getUnassignedMeetings() {
  const { data, error } = await supabaseAdmin
    .from("meetings")
    .select("*")
    .is("project_id", null)
    .order("start_time", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function assignMeetingToProject(
  meetingId: string,
  projectId: string
) {
  const { error } = await supabaseAdmin
    .from("meetings")
    .update({ project_id: projectId, updated_at: new Date().toISOString() })
    .eq("id", meetingId);

  if (error) throw error;
}

export async function cancelMeeting(calendlyEventId: string) {
  const { error } = await supabaseAdmin
    .from("meetings")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("calendly_event_id", calendlyEventId);

  if (error) throw error;
}

/**
 * Auto-assign a meeting to an organization and project by matching
 * invitee email to profiles → organization_members / project_members.
 */
export async function autoAssignMeetingByEmail(meeting: {
  id: string;
  invitee_email: string | null;
}) {
  if (!meeting.invitee_email) return;

  // Find profile by email
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", meeting.invitee_email)
    .maybeSingle();

  if (!profile) return;

  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  // Check direct project membership first
  const { data: directProjects } = await supabaseAdmin
    .from("project_members")
    .select("project_id")
    .eq("profile_id", profile.id);

  if (directProjects && directProjects.length === 1) {
    updates.project_id = directProjects[0].project_id;
  }

  // Find org membership
  const { data: orgMember } = await supabaseAdmin
    .from("organization_members")
    .select("organization_id")
    .eq("profile_id", profile.id)
    .limit(1)
    .maybeSingle();

  if (orgMember) {
    updates.organization_id = orgMember.organization_id;

    // If no direct project match, try org's active projects
    if (!updates.project_id) {
      const { data: orgProjects } = await supabaseAdmin
        .from("projects")
        .select("id")
        .eq("organization_id", orgMember.organization_id)
        .eq("status", "active");

      if (orgProjects && orgProjects.length === 1) {
        updates.project_id = orgProjects[0].id;
      }
    }
  }

  // Only update if we found something to assign
  if (updates.organization_id || updates.project_id) {
    const { error } = await supabaseAdmin
      .from("meetings")
      .update(updates)
      .eq("id", meeting.id);

    if (error) throw error;
  }
}
