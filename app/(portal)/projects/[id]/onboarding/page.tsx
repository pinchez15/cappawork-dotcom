import { redirect } from "next/navigation";
import { requireProjectAccess } from "@/lib/auth/guards";
import { getProjectById } from "@/server/repos/projects";
import { getDesignForProject } from "@/server/repos/design";
import { getAllThemes } from "@/server/repos/design";
import { DesignWizard } from "@/components/client/design-wizard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireProjectAccess(id);

  const [project, design, themes] = await Promise.all([
    getProjectById(id),
    getDesignForProject(id),
    getAllThemes(),
  ]);

  if (!project) {
    redirect("/projects");
  }

  // If already completed, redirect to project view
  if (design?.onboarding_completed) {
    redirect(`/projects/${id}`);
  }

  return <DesignWizard projectId={id} themes={themes} initialDesign={design} />;
}

