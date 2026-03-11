"use server";

import { upsertDesign } from "@/server/repos/design";
import { revalidatePath } from "next/cache";

export async function upsertDesignAction(
  projectId: string,
  data: Partial<{
    theme_id: string;
    primary_color: string;
    accent_color: string;
    heading_font: string;
    body_font: string;
    corner_radius: string;
    onboarding_completed: boolean;
  }>
) {
  const design = await upsertDesign(projectId, data as any);
  revalidatePath(`/projects/${projectId}`);
  return design;
}
