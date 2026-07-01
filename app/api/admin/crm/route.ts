import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { getGtmAccounts, getGtmStats } from "@/server/repos/gtm-accounts";
import { getVerticals } from "@/server/repos/verticals";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const gtm_stage = url.searchParams.get("gtm_stage") || undefined;
    const vertical_id = url.searchParams.get("vertical_id") || undefined;
    const min_fit_score = url.searchParams.get("min_fit_score")
      ? parseInt(url.searchParams.get("min_fit_score")!)
      : undefined;

    const [result, stats, verticals] = await Promise.all([
      getGtmAccounts({ gtm_stage, vertical_id, min_fit_score, limit: 200 }),
      getGtmStats(),
      getVerticals(),
    ]);

    return NextResponse.json({ ...result, stats, verticals });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
