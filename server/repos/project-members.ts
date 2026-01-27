import { supabaseAdmin } from "@/lib/db/client";

export async function addProjectMember(
  projectId: string,
  profileId: string,
  role: "client" | "viewer" = "client"
) {
  const { data, error } = await supabaseAdmin
    .from("project_members")
    .insert({
      project_id: projectId,
      profile_id: profileId,
      role,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeProjectMember(projectId: string, profileId: string) {
  const { error } = await supabaseAdmin
    .from("project_members")
    .delete()
    .eq("project_id", projectId)
    .eq("profile_id", profileId);

  if (error) throw error;
}

export async function getProjectMembers(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from("project_members")
    .select(
      `
      *,
      profile:profiles(*)
    `
    )
    .eq("project_id", projectId);

  if (error) throw error;
  return data || [];
}

export async function checkProjectAccess(
  projectId: string,
  profileId: string
): Promise<boolean> {
  // Check if user is admin
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("is_admin")
    .eq("id", profileId)
    .single();

  if (profile?.is_admin) return true;

  // Check if user is a member
  const { data: membership } = await supabaseAdmin
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("profile_id", profileId)
    .single();

  return !!membership;
}

