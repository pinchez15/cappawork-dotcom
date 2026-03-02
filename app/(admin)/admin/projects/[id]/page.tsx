import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProjectById } from "@/server/repos/projects";
import { getPhasesForProject, getTasksForProject } from "@/server/repos/kanban";
import { getSecretsForProject } from "@/server/repos/secrets";
import { getUrlsForProject } from "@/server/repos/urls";
import { getDesignForProject } from "@/server/repos/design";
import { getAttachmentsForProject } from "@/server/repos/attachments";
import { getAllOrganizations, getOrganizationById } from "@/server/repos/organizations";
import { getMessagesForProject } from "@/server/repos/messages";
import { getMeetingsForProject, getUnassignedMeetings } from "@/server/repos/meetings";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { ProjectDetailView } from "@/components/admin/project-detail-view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { userId } = await auth();

  const [project, phases, tasks, secrets, urls, design, attachments, allOrganizations, messages, meetings, unassignedMeetings] = await Promise.all([
    getProjectById(id),
    getPhasesForProject(id),
    getTasksForProject(id),
    getSecretsForProject(id),
    getUrlsForProject(id),
    getDesignForProject(id),
    getAttachmentsForProject(id),
    getAllOrganizations(),
    getMessagesForProject(id),
    getMeetingsForProject(id),
    getUnassignedMeetings(),
  ]);

  if (!project) {
    redirect("/admin");
  }

  // Get admin profile ID
  const profile = userId ? await getProfileByClerkId(userId) : null;

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
      messages={messages}
      meetings={meetings}
      unassignedMeetings={unassignedMeetings}
      currentProfileId={profile?.id}
    />
  );
}
