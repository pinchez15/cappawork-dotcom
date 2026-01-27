import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { upsertDesign } from "@/server/repos/design";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin access
    const profile = await getProfileByClerkId(userId);
    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { projectId } = await params;
    const body = await request.json();

    const design = await upsertDesign(projectId, {
      theme_id: body.theme_id,
      primary_color: body.primary_color,
      accent_color: body.accent_color,
      heading_font: body.heading_font,
      body_font: body.body_font,
      corner_radius: body.corner_radius,
      onboarding_completed: body.onboarding_completed,
    });

    return NextResponse.json({ success: true, design });
  } catch (error) {
    console.error("Error saving design:", error);
    return NextResponse.json(
      { error: "Failed to save design" },
      { status: 500 }
    );
  }
}
