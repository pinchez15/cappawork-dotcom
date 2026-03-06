import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { updateDeal, deleteDeal } from "@/server/repos/bd-deals";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    await requireAdmin();
    const { dealId } = await params;
    const body = await request.json();
    const deal = await updateDeal(dealId, body);
    return NextResponse.json(deal);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    await requireAdmin();
    const { dealId } = await params;
    await deleteDeal(dealId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
