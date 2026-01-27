import { supabaseAdmin } from "@/lib/db/client";

export async function upsertOrganizationMember(data: {
  clerkMembershipId: string;
  clerkOrgId: string;
  clerkUserId: string;
  role: string;
}) {
  // Get organization and profile IDs
  const [org, profile] = await Promise.all([
    supabaseAdmin
      .from("organizations")
      .select("id")
      .eq("clerk_org_id", data.clerkOrgId)
      .single(),
    supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("clerk_user_id", data.clerkUserId)
      .single(),
  ]);

  if (org.error || !org.data) throw new Error("Organization not found");
  if (profile.error || !profile.data) throw new Error("Profile not found");

  const { data: membership, error } = await supabaseAdmin
    .from("organization_members")
    .upsert(
      {
        clerk_membership_id: data.clerkMembershipId,
        organization_id: org.data.id,
        profile_id: profile.data.id,
        role: data.role,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "clerk_membership_id",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return membership;
}

export async function deleteOrganizationMember(clerkMembershipId: string) {
  const { error } = await supabaseAdmin
    .from("organization_members")
    .delete()
    .eq("clerk_membership_id", clerkMembershipId);

  if (error) throw error;
}

