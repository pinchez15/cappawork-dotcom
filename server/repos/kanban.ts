import { supabaseAdmin } from "@/lib/db/client";

export interface Phase {
  id: string;
  project_id: string;
  name: string;
  order_index: number;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  phase_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export async function getPhasesForProject(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from("project_phases")
    .select("*")
    .eq("project_id", projectId)
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getTasksForProject(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from("project_tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createPhase(
  projectId: string,
  name: string,
  orderIndex: number
) {
  const { data, error } = await supabaseAdmin
    .from("project_phases")
    .insert({
      project_id: projectId,
      name,
      order_index: orderIndex,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createTask(
  projectId: string,
  phaseId: string,
  data: {
    title: string;
    description?: string;
    orderIndex?: number;
  }
) {
  const { data: task, error } = await supabaseAdmin
    .from("project_tasks")
    .insert({
      project_id: projectId,
      phase_id: phaseId,
      title: data.title,
      description: data.description || null,
      order_index: data.orderIndex || 0,
    })
    .select()
    .single();

  if (error) throw error;
  return task;
}

export async function updateTask(
  taskId: string,
  updates: Partial<{
    title: string;
    description: string;
    phase_id: string;
    is_completed: boolean;
    order_index: number;
  }>
) {
  const { data, error } = await supabaseAdmin
    .from("project_tasks")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTask(taskId: string) {
  const { error } = await supabaseAdmin
    .from("project_tasks")
    .delete()
    .eq("id", taskId);

  if (error) throw error;
}

export async function reorderTasks(
  updates: Array<{ id: string; phase_id: string; order_index: number }>
) {
  // Update all tasks in a transaction-like manner
  const promises = updates.map((update) =>
    supabaseAdmin
      .from("project_tasks")
      .update({
        phase_id: update.phase_id,
        order_index: update.order_index,
        updated_at: new Date().toISOString(),
      })
      .eq("id", update.id)
  );

  const results = await Promise.all(promises);
  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    throw errors[0].error;
  }
}

