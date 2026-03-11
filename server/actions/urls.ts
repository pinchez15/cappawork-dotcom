"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { createUrl, deleteUrl } from "@/server/repos/urls";
import { revalidatePath } from "next/cache";

export async function createUrlAction(
  projectId: string,
  data: { label: string; url: string; type: string }
) {
  await requireAdmin();
  const url = await createUrl(projectId, {
    label: data.label,
    url: data.url,
    type: data.type as any,
  });
  revalidatePath(`/admin/projects/${projectId}`);
  return url;
}

export async function deleteUrlAction(urlId: string) {
  await requireAdmin();
  await deleteUrl(urlId);
}
