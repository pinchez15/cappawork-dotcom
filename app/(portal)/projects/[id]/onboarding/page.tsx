import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProjectById } from "@/server/repos/projects";
import { getDesignForProject } from "@/server/repos/design";
import { getAllThemes } from "@/server/repos/design";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { supabaseAdmin } from "@/lib/db/client";
import { DesignWizard } from "@/components/client/design-wizard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;

  // Get profile to check access
  const profile = await getProfileByClerkId(userId);
  
  if (!profile) {
    redirect("/projects");
  }

  // Check access: admins can access all, clients only their assigned projects
  if (!profile.is_admin) {
    const { data: membership } = await supabaseAdmin
      .from("project_members")
      .select("id")
      .eq("project_id", id)
      .eq("profile_id", profile.id)
      .single();
    
    if (!membership) {
      redirect("/projects");
    }
  }

  const [project, design, themes] = await Promise.all([
    getProjectById(id),
    getDesignForProject(id),
    getAllThemes(),
  ]);

  if (!project) {
    redirect("/projects");
  }

  // If already completed, redirect to project view
  if (design?.onboarding_completed) {
    redirect(`/projects/${id}`);
  }

  return <DesignWizard projectId={id} themes={themes} initialDesign={design} />;
}
