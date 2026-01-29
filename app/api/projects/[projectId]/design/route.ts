import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { getProjectById } from "@/server/repos/projects";
import { upsertDesign, getDesignForProject } from "@/server/repos/design";
import { supabaseAdmin } from "@/lib/db/client";

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

    const profile = await getProfileByClerkId(userId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { projectId } = await params;

    // Verify user has access to this project
    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check access - admin always has access, otherwise check membership
    if (!profile.is_admin) {
      const { data: directMembership } = await supabaseAdmin
        .from("project_members")
        .select("id")
        .eq("project_id", projectId)
        .eq("profile_id", profile.id)
        .single();

      if (!directMembership) {
        if (project.organization_id) {
          const { data: orgMembership } = await supabaseAdmin
            .from("organization_members")
            .select("id")
            .eq("organization_id", project.organization_id)
            .eq("profile_id", profile.id)
            .single();

          if (!orgMembership) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
          }
        } else {
          return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }
      }
    }

    // Check if design is already finalized - clients can't change finalized designs
    const existingDesign = await getDesignForProject(projectId);
    if (existingDesign?.onboarding_completed && !profile.is_admin) {
      return NextResponse.json(
        { error: "Design has been finalized and cannot be changed" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Clients can only set certain fields - not finalize
    const design = await upsertDesign(projectId, {
      theme_id: body.theme_id,
      primary_color: body.primary_color,
      accent_color: body.accent_color,
      heading_font: body.heading_font,
      body_font: body.body_font,
      corner_radius: body.corner_radius,
      // Clients cannot set onboarding_completed - only admin can finalize
      onboarding_completed: profile.is_admin ? body.onboarding_completed : false,
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
