import { redirect } from "next/navigation";
import { getProjectById } from "@/server/repos/projects";
import { getPhasesForProject, getTasksForProject } from "@/server/repos/kanban";
import { getSecretsForProject } from "@/server/repos/secrets";
import { getUrlsForProject } from "@/server/repos/urls";
import { getDesignForProject } from "@/server/repos/design";
import { getAttachmentsForProject } from "@/server/repos/attachments";
import { ProjectDetailView } from "@/components/admin/project-detail-view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// TODO: Re-add Clerk auth protection after reinstall
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, phases, tasks, secrets, urls, design, attachments] = await Promise.all([
    getProjectById(id),
    getPhasesForProject(id),
    getTasksForProject(id),
    getSecretsForProject(id),
    getUrlsForProject(id),
    getDesignForProject(id),
    getAttachmentsForProject(id),
  ]);

  if (!project) {
    redirect("/admin");
  }

  return (
    <ProjectDetailView
      project={project}
      phases={phases}
      tasks={tasks}
      secrets={secrets}
      urls={urls}
      design={design}
      attachments={attachments}
    />
  );
}
