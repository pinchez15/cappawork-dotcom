import { redirect } from "next/navigation";
import { requireProjectAccess } from "@/lib/auth/guards";
import { getProjectById } from "@/server/repos/projects";
import { getPhasesForProject, getTasksForProject } from "@/server/repos/kanban";
import { getUrlsForProject } from "@/server/repos/urls";
import { getDesignForProject } from "@/server/repos/design";
import { ClientProjectView } from "@/components/client/client-project-view";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ClientProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireProjectAccess(id);

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

