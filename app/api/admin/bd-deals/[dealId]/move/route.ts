import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { moveDeal } from "@/server/repos/bd-deals";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    await requireAdmin();
    const { dealId } = await params;
    const { stage, order } = await request.json();

    if (!stage || typeof stage !== "string") {
      return NextResponse.json({ error: "Stage is required" }, { status: 400 });
    }

    await moveDeal(dealId, stage, order ?? 0);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to move deal" }, { status: 500 });
  }
}
