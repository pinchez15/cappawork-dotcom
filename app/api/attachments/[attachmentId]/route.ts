import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { deleteAttachment, getAttachmentById } from "@/server/repos/attachments";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ attachmentId: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    // Require admin access for deletion
    await requireAdmin();

    const { attachmentId } = await params;

    // Check attachment exists
    const attachment = await getAttachmentById(attachmentId);
    if (!attachment) {
      return NextResponse.json(
        { error: "Attachment not found" },
        { status: 404 }
      );
    }

    // Delete the attachment
    await deleteAttachment(attachmentId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    const message = error instanceof Error ? error.message : "Delete failed";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (message.includes("FORBIDDEN")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
