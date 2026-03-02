"use server";

import { requireAdmin } from "@/lib/auth/guards";
import {
  createBillingLink,
  updateBillingLinkStatus,
  deleteBillingLink,
} from "@/server/repos/billing-links";
import { revalidatePath } from "next/cache";

export async function addBillingLinkAction(params: {
  organizationId: string;
  projectId?: string | null;
  url: string;
  label: string;
  type: "one_time" | "subscription";
  amountDisplay?: string | null;
  notes?: string | null;
}) {
  await requireAdmin();

  const trimmedUrl = params.url.trim();
  if (!trimmedUrl || !trimmedUrl.startsWith("https://")) {
    throw new Error("URL must be a valid HTTPS link");
  }

  const trimmedLabel = params.label.trim();
  if (!trimmedLabel) {
    throw new Error("Label is required");
  }

  await createBillingLink({
    organization_id: params.organizationId,
    project_id: params.projectId || null,
    url: trimmedUrl,
    label: trimmedLabel,
    type: params.type,
    amount_display: params.amountDisplay?.trim() || null,
    notes: params.notes?.trim() || null,
  });

  revalidatePath(`/admin/clients/${params.organizationId}`);
  revalidatePath("/billing");
}

export async function updateBillingLinkStatusAction(
  linkId: string,
  status: "active" | "paid" | "archived",
  orgId: string
) {
  await requireAdmin();

  await updateBillingLinkStatus(linkId, status);

  revalidatePath(`/admin/clients/${orgId}`);
  revalidatePath("/billing");
}

export async function removeBillingLinkAction(linkId: string, orgId: string) {
  await requireAdmin();

  await deleteBillingLink(linkId);

  revalidatePath(`/admin/clients/${orgId}`);
  revalidatePath("/billing");
}
