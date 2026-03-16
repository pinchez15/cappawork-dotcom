import { NextRequest, NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/auth/guards";
import { getSowDocumentById } from "@/server/repos/sow";
import { supabaseAdmin } from "@/lib/db/client";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sowId: string }> }
) {
  try {
    const { sowId } = await params;

    const sow = await getSowDocumentById(sowId);
    if (!sow) {
      return NextResponse.json({ error: "SOW not found" }, { status: 404 });
    }

    const access = await requireProjectAccess(sow.project_id);

    // Clients can only access published SOWs
    if (!access.isAdmin && !sow.client_visible) {
      return NextResponse.json({ error: "Not available" }, { status: 403 });
    }

    // Use signed PDF if available, otherwise draft
    const storagePath = sow.signed_storage_path || sow.draft_storage_path;
    if (!storagePath) {
      return NextResponse.json({ error: "No PDF available" }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin.storage
      .from("project-attachments")
      .createSignedUrl(storagePath, 3600);

    if (error) throw error;

    return NextResponse.json({ url: data.signedUrl });
  } catch {
    return NextResponse.json({ error: "Failed to get PDF" }, { status: 500 });
  }
}
