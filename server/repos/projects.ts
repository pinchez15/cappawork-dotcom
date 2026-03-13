import { supabaseAdmin } from "@/lib/db/client";
import { getAllPhases, getAllProjectTasks } from "@/server/repos/kanban";

export type ServiceTier = "portal_build" | "diagnostic" | "implementation";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "completed" | "on_hold";
  service_tier: ServiceTier | null;
  prd_content: any;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function createProject(data: {
  name: string;
  description?: string;
  status?: "active" | "completed" | "on_hold";
  service_tier?: ServiceTier;
}) {
  const { data: project, error } = await supabaseAdmin
    .from("projects")
    .insert({
      name: data.name,
      description: data.description || null,
      status: data.status || "active",
      service_tier: data.service_tier || null,
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

export type ProjectProgress = {
  id: string;
  name: string;
  status: string;
  activePhase: string | null;
  phases: { name: string; completed: number; total: number }[];
  completedTasks: number;
  totalTasks: number;
  progressPercent: number;
};

export async function getProjectsWithProgress(): Promise<ProjectProgress[]> {
  const [projects, phases, tasks] = await Promise.all([
    getAllProjects(),
    getAllPhases(),
    getAllProjectTasks(),
  ]);

  // Group phases and tasks by project_id
  const phasesByProject = new Map<string, typeof phases>();
  for (const phase of phases) {
    const arr = phasesByProject.get(phase.project_id) || [];
    arr.push(phase);
    phasesByProject.set(phase.project_id, arr);
  }

  const tasksByPhase = new Map<string, typeof tasks>();
  for (const task of tasks) {
    const arr = tasksByPhase.get(task.phase_id) || [];
    arr.push(task);
    tasksByPhase.set(task.phase_id, arr);
  }

  return projects
    .filter((p) => phasesByProject.has(p.id))
    .map((p) => {
      const projectPhases = phasesByProject.get(p.id) || [];
      let totalTasks = 0;
      let completedTasks = 0;
      let activePhase: string | null = null;

      const phaseProgress = projectPhases.map((phase) => {
        const phaseTasks = tasksByPhase.get(phase.id) || [];
        const completed = phaseTasks.filter((t) => t.is_completed).length;
        totalTasks += phaseTasks.length;
        completedTasks += completed;

        if (!activePhase && completed < phaseTasks.length) {
          activePhase = phase.name;
        }

        return { name: phase.name, completed, total: phaseTasks.length };
      });

      return {
        id: p.id,
        name: p.name,
        status: p.status,
        activePhase,
        phases: phaseProgress,
        completedTasks,
        totalTasks,
        progressPercent: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      };
    });
}

