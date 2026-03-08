import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import {
  getProspect,
  updateProspect,
  deleteProspect,
  calculatePriorityScore,
  calculateEnrichmentStatus,
} from "@/server/repos/prospects";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ prospectId: string }> }
) {
  try {
    await requireAdmin();
    const { prospectId } = await params;
    const prospect = await getProspect(prospectId);
    if (!prospect) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(prospect);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ prospectId: string }> }
) {
  try {
    await requireAdmin();
    const { prospectId } = await params;
    const body = await request.json();

    // Recalculate score and enrichment status
    const existing = await getProspect(prospectId);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const merged = { ...existing, ...body };
    const { score, breakdown } = calculatePriorityScore(
      merged,
      merged.vertical_tier
    );
    const enrichmentStatus = calculateEnrichmentStatus(merged);

    const prospect = await updateProspect(prospectId, {
      ...body,
      priority_score: score,
      score_breakdown: breakdown,
      enrichment_status: enrichmentStatus,
    });

    return NextResponse.json(prospect);
  } catch {
    return NextResponse.json(
      { error: "Failed to update prospect" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ prospectId: string }> }
) {
  try {
    await requireAdmin();
    const { prospectId } = await params;
    await deleteProspect(prospectId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete prospect" },
      { status: 500 }
    );
  }
}
