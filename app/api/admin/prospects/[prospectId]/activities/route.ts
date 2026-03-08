import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import {
  getActivitiesForProspect,
  createActivity,
} from "@/server/repos/outreach-activities";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ prospectId: string }> }
) {
  try {
    await requireAdmin();
    const { prospectId } = await params;
    const activities = await getActivitiesForProspect(prospectId);
    return NextResponse.json(activities);
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
    const activity = await createActivity({
      prospect_id: prospectId,
      step_number: body.step_number || null,
      channel: body.channel || null,
      action_type: body.action_type || null,
      content: body.content || null,
      status: body.status || "draft",
      response_text: body.response_text || null,
      responded_at: body.responded_at || null,
      scheduled_for: body.scheduled_for || null,
      sent_at: body.sent_at || null,
    });
    return NextResponse.json(activity);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
