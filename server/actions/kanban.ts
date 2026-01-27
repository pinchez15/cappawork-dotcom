"use server";

import { reorderTasks } from "@/server/repos/kanban";

export async function reorderTasksAction(
  updates: Array<{ id: string; phase_id: string; order_index: number }>
) {
  await reorderTasks(updates);
}

