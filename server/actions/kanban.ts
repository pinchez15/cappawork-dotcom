"use server";

import { revalidatePath } from "next/cache";
import { reorderTasks, updateTask, deleteTask } from "@/server/repos/kanban";

export async function reorderTasksAction(
  updates: Array<{ id: string; phase_id: string; order_index: number }>
) {
  await reorderTasks(updates);
}

export async function toggleTaskAction(taskId: string, isCompleted: boolean) {
  const updated = await updateTask(taskId, { is_completed: isCompleted });
  return updated;
}

export async function deleteTaskAction(taskId: string) {
  await deleteTask(taskId);
  revalidatePath("/admin/projects");
}

export async function updateTaskAction(
  taskId: string,
  updates: { title?: string; description?: string }
) {
  const updated = await updateTask(taskId, updates);
  return updated;
}

