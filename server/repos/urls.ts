import { supabaseAdmin } from "@/lib/db/client";

export interface ProjectUrl {
  id: string;
  project_id: string;
  label: string;
  url: string;
  type: "repo" | "staging" | "production" | "docs" | "design" | "other";
  created_at: string;
}

export async function createUrl(
  projectId: string,
  data: {
    label: string;
    url: string;
    type?: ProjectUrl["type"];
  }
) {
  const { data: url, error } = await supabaseAdmin
    .from("project_urls")
    .insert({
      project_id: projectId,
      label: data.label,
      url: data.url,
      type: data.type || "other",
    })
    .select()
    .single();

  if (error) throw error;
  return url;
}

export async function getUrlsForProject(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from("project_urls")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateUrl(
  urlId: string,
  updates: Partial<{
    label: string;
    url: string;
    type: ProjectUrl["type"];
  }>
) {
  const { data, error } = await supabaseAdmin
    .from("project_urls")
    .update(updates)
    .eq("id", urlId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUrl(urlId: string) {
  const { error } = await supabaseAdmin
    .from("project_urls")
    .delete()
    .eq("id", urlId);

  if (error) throw error;
}

