import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { updateVertical, deleteVertical } from "@/server/repos/verticals";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ verticalId: string }> }
) {
  try {
    await requireAdmin();
    const { verticalId } = await params;
    const body = await request.json();
    const vertical = await updateVertical(verticalId, body);
    return NextResponse.json(vertical);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ verticalId: string }> }
) {
  try {
    await requireAdmin();
    const { verticalId } = await params;
    await deleteVertical(verticalId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
