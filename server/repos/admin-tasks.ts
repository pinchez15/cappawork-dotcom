import { supabaseAdmin } from "@/lib/db/client";

export type AdminTask = {
  id: string;
  title: string;
  description: string | null;
  project_id: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  source: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminTaskWithProject = AdminTask & {
  project_name: string | null;
};

export const TASK_STATUSES = [
  { id: "todo", label: "To Do", color: "bg-stone-100 text-stone-700" },
  { id: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-700" },
  { id: "blocked", label: "Blocked", color: "bg-red-100 text-red-700" },
  { id: "done", label: "Done", color: "bg-green-100 text-green-700" },
] as const;

export const TASK_PRIORITIES = [
  { id: "low", label: "Low", color: "bg-stone-100 text-stone-600" },
  { id: "medium", label: "Medium", color: "bg-blue-100 text-blue-600" },
  { id: "high", label: "High", color: "bg-amber-100 text-amber-700" },
  { id: "urgent", label: "Urgent", color: "bg-red-100 text-red-700" },
] as const;

export const TASK_SOURCES = [
  { id: "manual", label: "Manual" },
  { id: "mcp", label: "MCP" },
  { id: "diagnostic", label: "Diagnostic" },
  { id: "client_request", label: "Client Request" },
] as const;

type TaskFilters = {
  status?: string;
  priority?: string;
  project_id?: string;
};

export async function getTasks(filters?: TaskFilters): Promise<AdminTaskWithProject[]> {
  let query = supabaseAdmin
    .from("admin_tasks")
    .select("*, project:projects(name)")
    .order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.priority) {
    query = query.eq("priority", filters.priority);
  }
  if (filters?.project_id) {
    query = query.eq("project_id", filters.project_id);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((row: any) => ({
    ...row,
    project_name: row.project?.name || null,
    project: undefined,
  }));
}

export async function getTask(id: string): Promise<AdminTask | null> {
  const { data, error } = await supabaseAdmin
    .from("admin_tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as AdminTask;
}

export async function createTask(
  task: Omit<AdminTask, "id" | "created_at" | "updated_at">
): Promise<AdminTask> {
  const { data, error } = await supabaseAdmin
    .from("admin_tasks")
    .insert(task)
    .select()
    .single();

  if (error) throw error;
  return data as AdminTask;
}

export async function updateTask(
  id: string,
  updates: Partial<Omit<AdminTask, "id" | "created_at">>
): Promise<AdminTask> {
  const { data, error } = await supabaseAdmin
    .from("admin_tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as AdminTask;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("admin_tasks")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function getTaskStats() {
  const { data, error } = await supabaseAdmin
    .from("admin_tasks")
    .select("status, priority, due_date");

  if (error) throw error;
  const tasks = (data || []) as { status: string; priority: string; due_date: string | null }[];

  const today = new Date().toISOString().split("T")[0];
  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const blocked = tasks.filter((t) => t.status === "blocked").length;
  const done = tasks.filter((t) => t.status === "done").length;
  const overdue = tasks.filter(
    (t) => t.due_date && t.due_date < today && t.status !== "done" && t.status !== "in_progress"
  ).length;
  const urgent = tasks.filter(
    (t) => t.priority === "urgent" && t.status !== "done"
  ).length;

  return { todo, inProgress, blocked, done, overdue, urgent, total: tasks.length };
}
