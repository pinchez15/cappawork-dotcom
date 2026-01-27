import { supabaseAdmin } from "@/lib/db/client";

export interface OrganizationInvite {
  id: string;
  organization_id: string;
  email: string;
  clerk_invitation_id: string | null;
  status: "pending" | "accepted" | "expired" | "revoked";
  invited_by: string | null;
  created_at: string;
  updated_at: string;
}

export async function createInviteRecord(data: {
  organizationId: string;
  email: string;
  clerkInvitationId?: string;
  invitedBy?: string;
}) {
  const { data: invite, error } = await supabaseAdmin
    .from("organization_invites")
    .insert({
      organization_id: data.organizationId,
      email: data.email,
      clerk_invitation_id: data.clerkInvitationId || null,
      invited_by: data.invitedBy || null,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return invite as OrganizationInvite;
}

export async function getInvitesForOrganization(organizationId: string) {
  const { data, error } = await supabaseAdmin
    .from("organization_invites")
    .select(
      `
      *,
      invited_by_profile:profiles!organization_invites_invited_by_fkey(id, name, email)
    `
    )
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateInviteStatus(
  inviteId: string,
  status: "pending" | "accepted" | "expired" | "revoked"
) {
  const { data, error } = await supabaseAdmin
    .from("organization_invites")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", inviteId)
    .select()
    .single();

  if (error) throw error;
  return data as OrganizationInvite;
}

export async function updateInviteStatusByClerkId(
  clerkInvitationId: string,
  status: "pending" | "accepted" | "expired" | "revoked"
) {
  const { data, error } = await supabaseAdmin
    .from("organization_invites")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_invitation_id", clerkInvitationId)
    .select()
    .single();

  // Don't throw if not found - invite might not exist locally
  if (error && error.code !== "PGRST116") throw error;
  return data as OrganizationInvite | null;
}

export async function getInviteById(inviteId: string) {
  const { data, error } = await supabaseAdmin
    .from("organization_invites")
    .select("*")
    .eq("id", inviteId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as OrganizationInvite | null;
}

export async function deleteInvite(inviteId: string) {
  const { error } = await supabaseAdmin
    .from("organization_invites")
    .delete()
    .eq("id", inviteId);

  if (error) throw error;
}
