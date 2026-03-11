"use server";

import { requireAdmin } from "@/lib/auth/guards";
import {
  createSecret,
  getDecryptedSecret,
  deleteSecret,
} from "@/server/repos/secrets";
import { revalidatePath } from "next/cache";

export async function createSecretAction(
  projectId: string,
  data: { name: string; value: string; type: string }
) {
  await requireAdmin();
  const secret = await createSecret(projectId, {
    name: data.name,
    value: data.value,
    type: data.type as any,
  });
  revalidatePath(`/admin/projects/${projectId}`);
  return secret;
}

export async function getDecryptedSecretAction(secretId: string) {
  await requireAdmin();
  return getDecryptedSecret(secretId);
}

export async function deleteSecretAction(secretId: string) {
  await requireAdmin();
  await deleteSecret(secretId);
}
