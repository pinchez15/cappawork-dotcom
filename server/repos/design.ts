import { supabaseAdmin } from "@/lib/db/client";

export interface ProjectDesign {
  id: string;
  project_id: string;
  theme_id: string | null;
  primary_color: string | null;
  accent_color: string | null;
  heading_font: string | null;
  body_font: string | null;
  corner_radius: "none" | "sm" | "md" | "lg" | "xl" | "full" | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export async function getDesignForProject(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from("project_design")
    .select("*")
    .eq("project_id", projectId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function upsertDesign(
  projectId: string,
  data: Partial<{
    theme_id: string;
    primary_color: string;
    accent_color: string;
    heading_font: string;
    body_font: string;
    corner_radius: ProjectDesign["corner_radius"];
    onboarding_completed: boolean;
  }>
) {
  const { data: design, error } = await supabaseAdmin
    .from("project_design")
    .upsert(
      {
        project_id: projectId,
        ...data,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "project_id",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return design;
}

export async function getAllThemes() {
  const { data, error } = await supabaseAdmin
    .from("design_themes")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getThemeById(themeId: string) {
  const { data, error } = await supabaseAdmin
    .from("design_themes")
    .select("*")
    .eq("id", themeId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

