import { supabaseAdmin } from "@/lib/db/client";

export async function getMessagesForProject(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from("project_messages")
    .select(
      `
      *,
      sender:profiles!sender_profile_id(id, name, email, is_admin)
    `
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createMessage(data: {
  project_id: string;
  sender_profile_id: string;
  content: string;
}) {
  const { data: message, error } = await supabaseAdmin
    .from("project_messages")
    .insert({
      project_id: data.project_id,
      sender_profile_id: data.sender_profile_id,
      content: data.content,
    })
    .select()
    .single();

  if (error) throw error;
  return message;
}

export async function markMessagesAsRead(
  projectId: string,
  readerProfileId: string
) {
  const { error } = await supabaseAdmin
    .from("project_messages")
    .update({ is_read: true })
    .eq("project_id", projectId)
    .eq("is_read", false)
    .neq("sender_profile_id", readerProfileId);

  if (error) throw error;
}

export async function getUnreadCountForProject(
  projectId: string,
  profileId: string
) {
  const { count, error } = await supabaseAdmin
    .from("project_messages")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId)
    .eq("is_read", false)
    .neq("sender_profile_id", profileId);

  if (error) throw error;
  return count || 0;
}
