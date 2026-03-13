"use server";

import { requireAdmin } from "@/lib/auth/guards";
import {
  createBillingLink,
  updateBillingLink,
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

  const ALLOWED_PAYMENT_DOMAINS = [
    "buy.stripe.com",
    "checkout.stripe.com",
    "invoice.stripe.com",
    "pay.squareup.com",
    "squareup.com",
    "paypal.com",
    "paypal.me",
    "invoice.zoho.com",
    "bill.com",
  ];
  try {
    const urlObj = new URL(trimmedUrl);
    if (!ALLOWED_PAYMENT_DOMAINS.some((d) => urlObj.hostname === d || urlObj.hostname.endsWith("." + d))) {
      throw new Error("URL must be from an approved payment provider");
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes("approved payment")) throw e;
    throw new Error("Invalid URL format");
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

export async function updateBillingLinkAction(params: {
  linkId: string;
  orgId: string;
  url?: string;
  label?: string;
  type?: "one_time" | "subscription";
  amountDisplay?: string | null;
  projectId?: string | null;
  notes?: string | null;
}) {
  await requireAdmin();

  if (params.url) {
    const trimmedUrl = params.url.trim();
    if (!trimmedUrl.startsWith("https://")) {
      throw new Error("URL must be a valid HTTPS link");
    }
  }

  await updateBillingLink(params.linkId, {
    ...(params.url && { url: params.url.trim() }),
    ...(params.label && { label: params.label.trim() }),
    ...(params.type && { type: params.type }),
    ...(params.amountDisplay !== undefined && { amount_display: params.amountDisplay?.trim() || null }),
    ...(params.projectId !== undefined && { project_id: params.projectId }),
    ...(params.notes !== undefined && { notes: params.notes?.trim() || null }),
  });

  revalidatePath(`/admin/clients/${params.orgId}`);
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
