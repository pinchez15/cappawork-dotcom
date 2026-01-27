import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProjectById } from "@/server/repos/projects";
import { getPhasesForProject, getTasksForProject } from "@/server/repos/kanban";
import { getUrlsForProject } from "@/server/repos/urls";
import { getDesignForProject } from "@/server/repos/design";
import { getAttachmentsForProject } from "@/server/repos/attachments";
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

  // Check access: admins can access all, clients need project or organization membership
  if (!profile.is_admin) {
    // Check direct project membership
    const { data: directMembership } = await supabaseAdmin
      .from("project_members")
      .select("id")
      .eq("project_id", id)
      .eq("profile_id", profile.id)
      .single();

    if (!directMembership) {
      // Check organization membership
      const { data: project } = await supabaseAdmin
        .from("projects")
        .select("organization_id")
        .eq("id", id)
        .single();

      if (project?.organization_id) {
        const { data: orgMembership } = await supabaseAdmin
          .from("organization_members")
          .select("id")
          .eq("organization_id", project.organization_id)
          .eq("profile_id", profile.id)
          .single();

        if (!orgMembership) {
          redirect("/projects");
        }
      } else {
        redirect("/projects");
      }
    }
  }

  const [project, phases, tasks, urls, design, attachments] = await Promise.all([
    getProjectById(id),
    getPhasesForProject(id),
    getTasksForProject(id),
    getUrlsForProject(id),
    getDesignForProject(id),
    getAttachmentsForProject(id),
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
      attachments={attachments}
    />
  );
}
