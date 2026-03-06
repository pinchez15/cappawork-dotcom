import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { createActivityEvent } from "@/server/repos/activity";
import { supabaseAdmin } from "@/lib/db/client";

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

    // Validate projectId belongs to user's organization
    let validProjectId: string | null = null;
    if (projectId) {
      const { data: membership } = await supabaseAdmin
        .from("organization_members")
        .select("organization_id")
        .eq("profile_id", profile.id)
        .limit(1)
        .maybeSingle();

      if (membership) {
        const { data: project } = await supabaseAdmin
          .from("projects")
          .select("id")
          .eq("id", projectId)
          .eq("organization_id", membership.organization_id)
          .maybeSingle();

        validProjectId = project?.id || null;
      }
    }

    await createActivityEvent({
      profile_id: profile.id,
      project_id: validProjectId,
      event_type: "page_view",
      metadata: { path },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
