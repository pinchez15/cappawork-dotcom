import { auth } from "@clerk/nextjs/server";
import { getProjectById } from "@/server/repos/projects";
import { getPhasesForProject, getTasksForProject } from "@/server/repos/kanban";
import { getUrlsForProject } from "@/server/repos/urls";
import { getDesignForProject } from "@/server/repos/design";
import { getAttachmentsForProject } from "@/server/repos/attachments";
import { getMessagesForProject } from "@/server/repos/messages";
import { getMeetingsForProject } from "@/server/repos/meetings";
import { getQuestionnaireForProject } from "@/server/repos/questionnaire";
import { getClientVisibleSowsForProject } from "@/server/repos/sow";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { getBillingLinksForOrganization } from "@/server/repos/billing-links";
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
  const [project, phases, tasks, urls, design, questionnaire, attachments, messages, meetings, sowDocuments] = await Promise.all([
    getProjectById(id),
    getPhasesForProject(id),
    getTasksForProject(id),
    getUrlsForProject(id),
    getDesignForProject(id),
    getQuestionnaireForProject(id),
    getAttachmentsForProject(id),
    getMessagesForProject(id),
    getMeetingsForProject(id),
    getClientVisibleSowsForProject(id),
  ]);

  if (!project) {
    return null;
  }

  // Get current user's profile ID and billing links
  const profile = userId ? await getProfileByClerkId(userId) : null;
  const billingLinks = project.organization_id
    ? await getBillingLinksForOrganization(project.organization_id)
    : [];

  return (
    <ClientProjectView
      project={project}
      phases={phases}
      tasks={tasks}
      urls={urls}
      design={design}
      questionnaire={questionnaire}
      attachments={attachments}
      messages={messages}
      meetings={meetings}
      sowDocuments={sowDocuments}
      billingLinks={billingLinks}
      currentProfileId={profile?.id}
      currentUserName={profile?.name || ""}
      currentUserEmail={profile?.email || ""}
    />
  );
}
