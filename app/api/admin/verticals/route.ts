import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { getVerticals, createVertical } from "@/server/repos/verticals";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const verticals = await getVerticals();
    return NextResponse.json(verticals);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const vertical = await createVertical({
      name: body.name.trim(),
      tier: body.tier || 2,
      close_speed: body.close_speed || 5,
      ai_awareness: body.ai_awareness || 5,
      automation_pain: body.automation_pain || 5,
      rationale: body.rationale || null,
      sales_nav_boolean: body.sales_nav_boolean || null,
      google_alert_string: body.google_alert_string || null,
      job_posting_keywords: body.job_posting_keywords || [],
      signal_indicators: body.signal_indicators || [],
    });
    return NextResponse.json(vertical);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
