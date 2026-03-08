import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import {
  getSignalsForProspect,
  createSignal,
} from "@/server/repos/signal-events";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ prospectId: string }> }
) {
  try {
    await requireAdmin();
    const { prospectId } = await params;
    const signals = await getSignalsForProspect(prospectId);
    return NextResponse.json(signals);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ prospectId: string }> }
) {
  try {
    await requireAdmin();
    const { prospectId } = await params;
    const body = await request.json();
    const signal = await createSignal({
      prospect_id: prospectId,
      signal_type: body.signal_type || null,
      signal_description: body.signal_description || null,
      signal_url: body.signal_url || null,
      signal_strength: body.signal_strength || 5,
      detected_at: body.detected_at || new Date().toISOString(),
      detected_by: body.detected_by || "manual",
      actioned: false,
      actioned_at: null,
      action_taken: null,
    });
    return NextResponse.json(signal);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
