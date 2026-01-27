import { redirect } from "next/navigation";
import { getProjectById } from "@/server/repos/projects";
import { getSecretsForProject } from "@/server/repos/secrets";
import { getUrlsForProject } from "@/server/repos/urls";
import { HandoffView } from "@/components/client/handoff-view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// TODO: Re-add Clerk auth protection after reinstall
export default async function HandoffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
