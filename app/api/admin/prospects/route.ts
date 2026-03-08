import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import {
  getProspects,
  createProspect,
  calculatePriorityScore,
  calculateEnrichmentStatus,
} from "@/server/repos/prospects";
import { getVertical } from "@/server/repos/verticals";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const filters = {
      vertical_id: url.searchParams.get("vertical_id") || undefined,
      tier: url.searchParams.get("tier")
        ? parseInt(url.searchParams.get("tier")!)
        : undefined,
      sequence_stage: url.searchParams.get("sequence_stage") || undefined,
      enrichment_status:
        url.searchParams.get("enrichment_status") || undefined,
      limit: url.searchParams.get("limit")
        ? parseInt(url.searchParams.get("limit")!)
        : undefined,
      offset: url.searchParams.get("offset")
        ? parseInt(url.searchParams.get("offset")!)
        : undefined,
    };

    const result = await getProspects(filters);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    if (!body.company_name?.trim()) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    // Calculate priority score
    let verticalTier: number | null = null;
    if (body.vertical_id) {
      const vertical = await getVertical(body.vertical_id);
      verticalTier = vertical?.tier || null;
    }

    const { score, breakdown } = calculatePriorityScore(body, verticalTier);
    const enrichmentStatus = calculateEnrichmentStatus(body);

    const prospect = await createProspect({
      ...body,
      company_name: body.company_name.trim(),
      priority_score: score,
      score_breakdown: breakdown,
      enrichment_status: enrichmentStatus,
    });

    return NextResponse.json(prospect);
  } catch {
    return NextResponse.json(
      { error: "Failed to create prospect" },
      { status: 500 }
    );
  }
}
