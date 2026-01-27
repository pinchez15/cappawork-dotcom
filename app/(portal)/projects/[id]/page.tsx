import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProjectById } from "@/server/repos/projects";
import { getPhasesForProject, getTasksForProject } from "@/server/repos/kanban";
import { getUrlsForProject } from "@/server/repos/urls";
import { getDesignForProject } from "@/server/repos/design";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { supabaseAdmin } from "@/lib/db/client";
import { ClientProjectView } from "@/components/client/client-project-view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ClientProjectPage({
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

  const [project, phases, tasks, urls, design] = await Promise.all([
    getProjectById(id),
    getPhasesForProject(id),
    getTasksForProject(id),
    getUrlsForProject(id),
    getDesignForProject(id),
  ]);

  if (!project) {
    redirect("/projects");
  }

  // Check if onboarding is needed
  if (!design || !design.onboarding_completed) {
    redirect(`/projects/${id}/onboarding`);
  }

  return (
    <ClientProjectView
      project={project}
      phases={phases}
      tasks={tasks}
      urls={urls}
      design={design}
    />
  );
}
