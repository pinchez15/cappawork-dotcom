"use server";

import { requireProjectAccess } from "@/lib/auth/guards";
import {
  createMessage,
  markMessagesAsRead,
} from "@/server/repos/messages";
import { revalidatePath } from "next/cache";

export async function sendMessageAction(projectId: string, content: string) {
  const user = await requireProjectAccess(projectId);

  if (!user.profileId) {
    throw new Error("Profile not found");
  }

  const trimmed = content.trim();
  if (!trimmed || trimmed.length > 5000) {
    throw new Error("Message must be between 1 and 5000 characters");
  }

  await createMessage({
    project_id: projectId,
    sender_profile_id: user.profileId,
    content: trimmed,
  });

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}`);
}

export async function markMessagesReadAction(projectId: string) {
  const user = await requireProjectAccess(projectId);

  if (!user.profileId) {
    throw new Error("Profile not found");
  }

  await markMessagesAsRead(projectId, user.profileId);

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}`);
}
