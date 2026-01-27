import { supabaseAdmin } from "@/lib/db/client";

export interface Organization {
  id: string;
  clerk_org_id: string;
  name: string;
  slug: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

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

export async function getAllOrganizations() {
  const { data, error } = await supabaseAdmin
    .from("organizations")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data || []) as Organization[];
}

export async function getOrganizationById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as Organization | null;
}

export async function getOrganizationsWithStats() {
  // Get orgs with member count and project count
  const { data: orgs, error: orgsError } = await supabaseAdmin
    .from("organizations")
    .select("*")
    .order("name", { ascending: true });

  if (orgsError) throw orgsError;

  // Get member counts
  const { data: memberCounts, error: memberError } = await supabaseAdmin
    .from("organization_members")
    .select("organization_id");

  if (memberError) throw memberError;

  // Get project counts
  const { data: projectCounts, error: projectError } = await supabaseAdmin
    .from("projects")
    .select("organization_id")
    .not("organization_id", "is", null);

  if (projectError) throw projectError;

  // Aggregate counts
  const memberCountMap = new Map<string, number>();
  const projectCountMap = new Map<string, number>();

  (memberCounts || []).forEach((m: { organization_id: string }) => {
    memberCountMap.set(
      m.organization_id,
      (memberCountMap.get(m.organization_id) || 0) + 1
    );
  });

  (projectCounts || []).forEach((p: { organization_id: string }) => {
    projectCountMap.set(
      p.organization_id,
      (projectCountMap.get(p.organization_id) || 0) + 1
    );
  });

  return (orgs || []).map((org: Organization) => ({
    ...org,
    member_count: memberCountMap.get(org.id) || 0,
    project_count: projectCountMap.get(org.id) || 0,
  }));
}

export async function getOrganizationMembers(organizationId: string) {
  const { data, error } = await supabaseAdmin
    .from("organization_members")
    .select(
      `
      *,
      profile:profiles(id, name, email)
    `
    )
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

