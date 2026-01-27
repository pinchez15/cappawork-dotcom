import { supabaseAdmin } from "@/lib/db/client";

export async function upsertOrganization(clerkOrgData: {
  id: string;
  name: string;
  slug?: string | null;
  image_url?: string | null;
}) {
  const { data, error } = await supabaseAdmin
    .from("organizations")
    .upsert(
      {
        clerk_org_id: clerkOrgData.id,
        name: clerkOrgData.name,
        slug: clerkOrgData.slug || null,
        image_url: clerkOrgData.image_url || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "clerk_org_id",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrganizationByClerkId(clerkOrgId: string) {
  const { data, error } = await supabaseAdmin
    .from("organizations")
    .select("*")
    .eq("clerk_org_id", clerkOrgId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function deleteOrganization(clerkOrgId: string) {
  const { error } = await supabaseAdmin
    .from("organizations")
    .delete()
    .eq("clerk_org_id", clerkOrgId);

  if (error) throw error;
}

