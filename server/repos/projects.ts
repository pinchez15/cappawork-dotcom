import { supabaseAdmin } from "@/lib/db/client";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "completed" | "on_hold";
  prd_content: any;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function createProject(data: {
  name: string;
  description?: string;
  status?: "active" | "completed" | "on_hold";
}) {
  const { data: project, error } = await supabaseAdmin
    .from("projects")
    .insert({
      name: data.name,
      description: data.description || null,
      status: data.status || "active",
    })
    .select()
    .single();

  if (error) throw error;
  return project;
}

export async function getProjectById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function getAllProjects() {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateProject(
  id: string,
  updates: Partial<{
    name: string;
    description: string;
    status: "active" | "completed" | "on_hold";
    prd_content: any;
  }>
) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function getProjectsForProfile(profileId: string) {
  const { data, error } = await supabaseAdmin
    .from("project_members")
    .select(
      `
      project:projects(*)
    `
    )
    .eq("profile_id", profileId);

  if (error) throw error;
  return (data || []).map((item: any) => item.project);
}

export async function getProjectsForOrganization(organizationId: string) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function assignProjectToOrganization(
  projectId: string,
  organizationId: string | null
) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .update({
      organization_id: organizationId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function getProjectsGroupedByOrganization() {
  // Get all projects with their organization info
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select(
      `
      *,
      organization:organizations(id, name, slug)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getUnassignedProjects() {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .is("organization_id", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

