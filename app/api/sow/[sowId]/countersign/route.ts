import { NextRequest, NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/auth/guards";
import { getSowDocumentById, updateSowDocument } from "@/server/repos/sow";
import { createAttachment } from "@/server/repos/attachments";
import { supabaseAdmin } from "@/lib/db/client";
import { appendDualSignaturePage } from "@/lib/sow/append-signature";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sowId: string }> }
) {
  try {
    const { sowId } = await params;
    const { signatureDataUrl } = await request.json();

    if (!signatureDataUrl) {
      return NextResponse.json({ error: "Signature is required" }, { status: 400 });
    }

    const sow = await getSowDocumentById(sowId);
    if (!sow) {
      return NextResponse.json({ error: "SOW not found" }, { status: 404 });
    }

    if (sow.status !== "admin_signed") {
      return NextResponse.json({ error: "SOW is not ready for counter-signing" }, { status: 400 });
    }

    // Verify project access
    await requireProjectAccess(sow.project_id);

    // Get current user profile
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const profile = await getProfileByClerkId(userId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 400 });
    }

    const signedAt = new Date().toISOString();
    const signerIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    // Store client signature image
    const clientSigPath = `sow/${sow.project_id}/${sow.id}-client-signature.png`;
    const clientSigBuffer = Buffer.from(
      signatureDataUrl.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );
    const { error: sigUploadError } = await supabaseAdmin.storage
      .from("project-attachments")
      .upload(clientSigPath, clientSigBuffer, { contentType: "image/png", upsert: true });
    if (sigUploadError) throw sigUploadError;

    // Download original draft PDF (not admin-signed, to avoid double-appending)
    if (!sow.draft_storage_path) throw new Error("No draft PDF found");
    const { data: draftData, error: downloadError } = await supabaseAdmin.storage
      .from("project-attachments")
      .download(sow.draft_storage_path);
    if (downloadError) throw downloadError;

    // Download admin signature image for the dual-signature page
    if (!sow.admin_signature_image_path) throw new Error("Admin signature not found");
    const { data: adminSigData, error: adminSigError } = await supabaseAdmin.storage
      .from("project-attachments")
      .download(sow.admin_signature_image_path);
    if (adminSigError) throw adminSigError;

    const adminSigBytes = Buffer.from(await adminSigData.arrayBuffer());
    const adminSigDataUrl = `data:image/png;base64,${adminSigBytes.toString("base64")}`;

    // Build final PDF with both signatures
    const originalPdfBytes = new Uint8Array(await draftData.arrayBuffer());
    const fullySignedPdf = await appendDualSignaturePage(originalPdfBytes, {
      adminSignature: {
        signatureDataUrl: adminSigDataUrl,
        signedByName: sow.admin_signed_by_name!,
        signedAt: sow.admin_signed_at!,
      },
      clientSignature: {
        signatureDataUrl,
        signedByName: profile.name || profile.email,
        signedAt,
      },
    });

    // Upload final signed PDF
    const signedStoragePath = `sow/${sow.project_id}/${sow.id}-signed.pdf`;
    const { error: pdfUploadError } = await supabaseAdmin.storage
      .from("project-attachments")
      .upload(signedStoragePath, fullySignedPdf, {
        contentType: "application/pdf",
        upsert: true,
      });
    if (pdfUploadError) throw pdfUploadError;

    // Create attachment in Files tab
    const attachment = await createAttachment({
      projectId: sow.project_id,
      uploadedBy: profile.id,
      name: `${sow.title} (Fully Executed)`,
      fileName: `${sow.title.replace(/[^a-zA-Z0-9-_ ]/g, "")}-signed.pdf`,
      fileSize: fullySignedPdf.length,
      mimeType: "application/pdf",
      storagePath: signedStoragePath,
      category: "contract",
      description: `Fully executed SOW — ${sow.admin_signed_by_name} & ${profile.name || profile.email} on ${new Date(signedAt).toLocaleDateString("en-US")}`,
    });

    // Update SOW record
    await updateSowDocument(sow.id, {
      status: "countersigned",
      signed_storage_path: signedStoragePath,
      attachment_id: attachment.id,
      signed_by_name: profile.name || profile.email,
      signed_by_email: profile.email,
      signed_by_ip: signerIp,
      signed_at: signedAt,
      signature_image_path: clientSigPath,
    });

    revalidatePath(`/admin/projects/${sow.project_id}`);
    revalidatePath(`/projects/${sow.project_id}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Counter-sign error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to counter-sign" },
      { status: 500 }
    );
  }
}
