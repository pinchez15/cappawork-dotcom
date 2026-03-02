import { auth } from "@clerk/nextjs/server";
import { getProjectById } from "@/server/repos/projects";
import { getPhasesForProject, getTasksForProject } from "@/server/repos/kanban";
import { getUrlsForProject } from "@/server/repos/urls";
import { getDesignForProject } from "@/server/repos/design";
import { getAttachmentsForProject } from "@/server/repos/attachments";
import { getMessagesForProject } from "@/server/repos/messages";
import { getMeetingsForProject } from "@/server/repos/meetings";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { ClientProjectView } from "@/components/client/client-project-view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ClientProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  // Fetch all project data
  // Note: Access control is handled in the layout
  const [project, phases, tasks, urls, design, attachments, messages, meetings] = await Promise.all([
    getProjectById(id),
    getPhasesForProject(id),
    getTasksForProject(id),
    getUrlsForProject(id),
    getDesignForProject(id),
    getAttachmentsForProject(id),
    getMessagesForProject(id),
    getMeetingsForProject(id),
  ]);

  if (!project) {
    return null;
  }

  // Get current user's profile ID
  const profile = userId ? await getProfileByClerkId(userId) : null;

  return (
    <ClientProjectView
      project={project}
      phases={phases}
      tasks={tasks}
      urls={urls}
      design={design}
      attachments={attachments}
      messages={messages}
      meetings={meetings}
      currentProfileId={profile?.id}
      currentUserName={profile?.name || ""}
      currentUserEmail={profile?.email || ""}
    />
  );
}
