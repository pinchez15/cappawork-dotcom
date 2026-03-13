"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { supabaseAdmin } from "@/lib/db/client";
import {
  createSowDocument,
  getSowDocumentById,
  getSowDocumentByToken,
  updateSowDocument,
  voidSowDocument as voidSowRepo,
} from "@/server/repos/sow";
import { createAttachment } from "@/server/repos/attachments";
import { renderSowPdf } from "@/lib/sow/render-pdf";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import type { SowData } from "@/server/repos/sow";

export async function createSowAction(params: {
  projectId: string;
  title: string;
  sowData: SowData;
}) {
  const admin = await requireAdmin();

  if (!params.title.trim()) {
    throw new Error("Title is required");
  }

  // Render draft PDF
  const pdfBuffer = await renderSowPdf(params.sowData);

  // Upload to Supabase Storage
  const storagePath = `sow/${params.projectId}/${randomUUID()}-draft.pdf`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from("project-attachments")
    .upload(storagePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  await createSowDocument({
    project_id: params.projectId,
    title: params.title.trim(),
    sow_data: params.sowData,
    draft_storage_path: storagePath,
    created_by: admin.profileId!,
  });

  revalidatePath(`/admin/projects/${params.projectId}`);
}

export async function sendSowForSigningAction(sowId: string) {
  await requireAdmin();

  const sow = await getSowDocumentById(sowId);
  if (!sow) throw new Error("SOW not found");
  if (sow.status !== "draft") throw new Error("Only draft SOWs can be sent for signing");

  const token = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30-day expiry

  await updateSowDocument(sowId, {
    status: "sent",
    signing_token: token,
    signing_token_expires_at: expiresAt.toISOString(),
    sent_at: new Date().toISOString(),
  });

  revalidatePath(`/admin/projects/${sow.project_id}`);

  return { token };
}

export async function voidSowAction(sowId: string) {
  await requireAdmin();

  const sow = await getSowDocumentById(sowId);
  if (!sow) throw new Error("SOW not found");
  if (sow.status === "voided") throw new Error("SOW is already voided");

  await voidSowRepo(sowId);

  revalidatePath(`/admin/projects/${sow.project_id}`);
}

export async function signSowAction(params: {
  token: string;
  signerName: string;
  signerEmail: string;
  signatureDataUrl: string;
  signerIp: string;
}) {
  // No auth guard — token-based auth
  if (!params.token) throw new Error("Token is required");
  if (!params.signerName.trim()) throw new Error("Name is required");
  if (!params.signerEmail.trim()) throw new Error("Email is required");
  if (!params.signatureDataUrl) throw new Error("Signature is required");

  const sow = await getSowDocumentByToken(params.token);
  if (!sow) throw new Error("Invalid or expired signing link");

  // Check expiry
  if (
    sow.signing_token_expires_at &&
    new Date(sow.signing_token_expires_at) < new Date()
  ) {
    throw new Error("Signing link has expired");
  }

  const signedAt = new Date().toISOString();

  // Store signature image
  const sigPath = `sow/${sow.project_id}/${sow.id}-signature.png`;
  const sigBuffer = Buffer.from(
    params.signatureDataUrl.replace(/^data:image\/png;base64,/, ""),
    "base64"
  );
  const { error: sigUploadError } = await supabaseAdmin.storage
    .from("project-attachments")
    .upload(sigPath, sigBuffer, {
      contentType: "image/png",
      upsert: true,
    });
  if (sigUploadError) throw sigUploadError;

  // Re-render PDF with signature
  const signedPdfBuffer = await renderSowPdf(sow.sow_data, {
    signatureDataUrl: params.signatureDataUrl,
    signedByName: params.signerName.trim(),
    signedAt,
  });

  const signedStoragePath = `sow/${sow.project_id}/${sow.id}-signed.pdf`;
  const { error: pdfUploadError } = await supabaseAdmin.storage
    .from("project-attachments")
    .upload(signedStoragePath, signedPdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });
  if (pdfUploadError) throw pdfUploadError;

  // Create attachment in Files tab
  const attachment = await createAttachment({
    projectId: sow.project_id,
    uploadedBy: sow.created_by || "",
    name: `${sow.title} (Signed)`,
    fileName: `${sow.title.replace(/[^a-zA-Z0-9-_ ]/g, "")}-signed.pdf`,
    fileSize: signedPdfBuffer.length,
    mimeType: "application/pdf",
    storagePath: signedStoragePath,
    category: "contract",
    description: `Signed SOW — ${params.signerName.trim()} on ${new Date(signedAt).toLocaleDateString("en-US")}`,
  });

  // Update SOW record
  await updateSowDocument(sow.id, {
    status: "signed",
    signed_storage_path: signedStoragePath,
    attachment_id: attachment.id,
    signing_token: null,
    signing_token_expires_at: null,
    signed_by_name: params.signerName.trim(),
    signed_by_email: params.signerEmail.trim(),
    signed_by_ip: params.signerIp,
    signed_at: signedAt,
    signature_image_path: sigPath,
  });

  revalidatePath(`/admin/projects/${sow.project_id}`);
}
