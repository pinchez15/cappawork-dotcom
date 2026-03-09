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

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { ids, updates } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids array is required" },
        { status: 400 }
      );
    }

    let updated = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        const existing = await getProspect(id);
        if (!existing) {
          failed++;
          continue;
        }

        const merged = { ...existing, ...updates };
        const { score, breakdown } = calculatePriorityScore(
          merged,
          merged.vertical_tier
        );
        const enrichmentStatus = calculateEnrichmentStatus(merged);

        await updateProspect(id, {
          ...updates,
          priority_score: score,
          score_breakdown: breakdown,
          enrichment_status: enrichmentStatus,
        });
        updated++;
      } catch {
        failed++;
      }
    }

    return NextResponse.json({ updated, failed });
  } catch {
    return NextResponse.json(
      { error: "Bulk update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids array is required" },
        { status: 400 }
      );
    }

    let deleted = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        await deleteProspect(id);
        deleted++;
      } catch {
        failed++;
      }
    }

    return NextResponse.json({ deleted, failed });
  } catch {
    return NextResponse.json(
      { error: "Bulk delete failed" },
      { status: 500 }
    );
  }
}
