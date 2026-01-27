import { NextRequest, NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/auth/guards";
import { getAttachmentById, getSignedUrl } from "@/server/repos/attachments";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ attachmentId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { attachmentId } = await params;

    // Get attachment details
    const attachment = await getAttachmentById(attachmentId);

    if (!attachment) {
      return NextResponse.json(
        { error: "Attachment not found" },
        { status: 404 }
      );
    }

    // Verify user has access to the project
    await requireProjectAccess(attachment.project_id);

    // Generate signed URL
    const signedUrl = await getSignedUrl(attachment.storage_path);

    return NextResponse.json({
      url: signedUrl,
      fileName: attachment.file_name,
      mimeType: attachment.mime_type,
    });
  } catch (error) {
    console.error("Download error:", error);
    const message = error instanceof Error ? error.message : "Download failed";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (message.includes("FORBIDDEN")) {
      return NextResponse.json(
        { error: "No access to this file" },
        { status: 403 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
