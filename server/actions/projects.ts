"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { deleteProject } from "@/server/repos/projects";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProjectAction(projectId: string) {
  await requireAdmin();

  await deleteProject(projectId);

  revalidatePath("/admin");
  redirect("/admin");
}
