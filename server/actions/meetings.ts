"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { assignMeetingToProject } from "@/server/repos/meetings";
import { revalidatePath } from "next/cache";

export async function assignMeetingToProjectAction(
  meetingId: string,
  projectId: string
) {
  await requireAdmin();

  await assignMeetingToProject(meetingId, projectId);

  revalidatePath(`/admin/projects/${projectId}`);
}
