"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { deleteProject, updateProject } from "@/server/repos/projects";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProjectAction(projectId: string) {
  await requireAdmin();

  await deleteProject(projectId);

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProjectAction(
  projectId: string,
  updates: Partial<{
    name: string;
    description: string;
    status: "active" | "completed" | "on_hold";
    prd_content: any;
  }>
) {
  await requireAdmin();
  const project = await updateProject(projectId, updates);
  revalidatePath(`/admin/projects/${projectId}`);
  return project;
}
