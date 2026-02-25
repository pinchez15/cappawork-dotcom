import { redirect } from "next/navigation";
import { getProjectById } from "@/server/repos/projects";
import { getPhasesForProject, getTasksForProject } from "@/server/repos/kanban";
import { getSecretsForProject } from "@/server/repos/secrets";
import { getUrlsForProject } from "@/server/repos/urls";
import { getDesignForProject } from "@/server/repos/design";
import { getAttachmentsForProject } from "@/server/repos/attachments";
import { getAllOrganizations, getOrganizationById } from "@/server/repos/organizations";
import { ProjectDetailView } from "@/components/admin/project-detail-view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, phases, tasks, secrets, urls, design, attachments, allOrganizations] = await Promise.all([
    getProjectById(id),
    getPhasesForProject(id),
    getTasksForProject(id),
    getSecretsForProject(id),
    getUrlsForProject(id),
    getDesignForProject(id),
    getAttachmentsForProject(id),
    getAllOrganizations(),
  ]);

  if (!project) {
    redirect("/admin");
  }

  // If assigned to an org, fetch the org details
  const currentOrganization = project.organization_id
    ? await getOrganizationById(project.organization_id)
    : null;

  return (
    <ProjectDetailView
      project={project}
      phases={phases}
      tasks={tasks}
      secrets={secrets}
      urls={urls}
      design={design}
      attachments={attachments}
      currentOrganization={currentOrganization}
      allOrganizations={allOrganizations}
    />
  );
}
