import { getProjectById } from "@/server/repos/projects";
import { getPhasesForProject, getTasksForProject } from "@/server/repos/kanban";
import { getUrlsForProject } from "@/server/repos/urls";
import { getDesignForProject } from "@/server/repos/design";
import { getAttachmentsForProject } from "@/server/repos/attachments";
import { ClientProjectView } from "@/components/client/client-project-view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ClientProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch all project data
  // Note: Access control is handled in the layout
  const [project, phases, tasks, urls, design, attachments] = await Promise.all([
    getProjectById(id),
    getPhasesForProject(id),
    getTasksForProject(id),
    getUrlsForProject(id),
    getDesignForProject(id),
    getAttachmentsForProject(id),
  ]);

  if (!project) {
    return null;
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
