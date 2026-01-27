import { supabaseAdmin } from "@/lib/db/client";

export async function upsertWaitlistEntry(data: {
  clerkWaitlistEntryId?: string;
  email: string;
  clerkUserId?: string | null;
  clerkOrgId?: string | null;
  status?: string;
  metadata?: any;
}) {
  let profileId = null;
  let organizationId = null;

  if (data.clerkUserId) {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("clerk_user_id", data.clerkUserId)
      .single();
    profileId = profile?.id || null;
  }

  if (data.clerkOrgId) {
    const { data: org } = await supabaseAdmin
      .from("organizations")
      .select("id")
      .eq("clerk_org_id", data.clerkOrgId)
      .single();
    organizationId = org?.id || null;
  }

  const { data: entry, error } = await supabaseAdmin
    .from("waitlist_entries")
    .upsert(
      {
        clerk_waitlist_entry_id: data.clerkWaitlistEntryId || null,
        email: data.email,
        profile_id: profileId,
        organization_id: organizationId,
        status: data.status || "pending",
        metadata: data.metadata || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "clerk_waitlist_entry_id",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return entry;
}

