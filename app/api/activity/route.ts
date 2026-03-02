import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { createActivityEvent } from "@/server/repos/activity";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getProfileByClerkId(userId);

    if (!profile || profile.is_admin) {
      // Skip tracking for admins or unknown profiles
      return NextResponse.json({ ok: true });
    }

    const body = await req.json();
    const { path, projectId } = body;

    await createActivityEvent({
      profile_id: profile.id,
      project_id: projectId || null,
      event_type: "page_view",
      metadata: { path },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
