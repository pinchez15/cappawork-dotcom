import { NextRequest, NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/auth/guards";
import {
  upsertQuestionnaire,
  getQuestionnaireForProject,
} from "@/server/repos/questionnaire";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    await requireProjectAccess(projectId);

    const body = await request.json();
    const { responses, submit } = body;

    if (!responses || typeof responses !== "object") {
      return NextResponse.json(
        { error: "Responses object is required" },
        { status: 400 }
      );
    }

    // If already submitted, block further changes
    const existing = await getQuestionnaireForProject(projectId);
    if (existing?.submitted_at) {
      return NextResponse.json(
        { error: "Questionnaire has already been submitted" },
        { status: 403 }
      );
    }

    const questionnaire = await upsertQuestionnaire(
      projectId,
      responses,
      !!submit
    );

    return NextResponse.json({ success: true, questionnaire });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    if (message === "UNAUTHORIZED" || message.includes("FORBIDDEN")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
