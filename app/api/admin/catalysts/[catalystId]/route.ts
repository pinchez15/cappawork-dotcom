import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { updateCatalyst, deleteCatalyst } from "@/server/repos/bd-catalysts";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ catalystId: string }> }
) {
  try {
    await requireAdmin();
    const { catalystId } = await params;
    const body = await request.json();
    const catalyst = await updateCatalyst(catalystId, body);
    return NextResponse.json(catalyst);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ catalystId: string }> }
) {
  try {
    await requireAdmin();
    const { catalystId } = await params;
    await deleteCatalyst(catalystId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
