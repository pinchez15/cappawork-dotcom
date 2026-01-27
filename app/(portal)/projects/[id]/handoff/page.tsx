import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProjectById } from "@/server/repos/projects";
import { getSecretsForProject } from "@/server/repos/secrets";
import { getUrlsForProject } from "@/server/repos/urls";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { supabaseAdmin } from "@/lib/db/client";
import { HandoffView } from "@/components/client/handoff-view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function HandoffPage({
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

  const [project, secrets, urls] = await Promise.all([
    getProjectById(id),
    getSecretsForProject(id),
    getUrlsForProject(id),
  ]);

  if (!project) {
    redirect("/projects");
  }

  return <HandoffView project={project} secrets={secrets} urls={urls} />;
}
