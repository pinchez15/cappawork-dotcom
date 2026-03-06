import { supabaseAdmin } from "@/lib/db/client";

export interface ProjectQuestionnaire {
  id: string;
  project_id: string;
  responses: Record<string, string>;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function getQuestionnaireForProject(
  projectId: string
): Promise<ProjectQuestionnaire | null> {
  const { data, error } = await supabaseAdmin
    .from("project_questionnaire")
    .select("*")
    .eq("project_id", projectId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertQuestionnaire(
  projectId: string,
  responses: Record<string, string>,
  submit: boolean = false
): Promise<ProjectQuestionnaire> {
  const { data, error } = await supabaseAdmin
    .from("project_questionnaire")
    .upsert(
      {
        project_id: projectId,
        responses,
        submitted_at: submit ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "project_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
