import { NextRequest, NextResponse } from "next/server";
import { getSowDocumentByToken } from "@/server/repos/sow";
import { supabaseAdmin } from "@/lib/db/client";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const sow = await getSowDocumentByToken(token);
    if (!sow) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
    }

    if (
      sow.signing_token_expires_at &&
      new Date(sow.signing_token_expires_at) < new Date()
    ) {
      return NextResponse.json({ error: "Link expired" }, { status: 410 });
    }

    if (!sow.draft_storage_path) {
      return NextResponse.json({ error: "No PDF available" }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin.storage
      .from("project-attachments")
      .createSignedUrl(sow.draft_storage_path, 3600);

    if (error) throw error;

    return NextResponse.json({ url: data.signedUrl });
  } catch {
    return NextResponse.json({ error: "Failed to get PDF" }, { status: 500 });
  }
}
