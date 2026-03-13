import { redirect } from "next/navigation";
import {
  createProject,
  assignProjectToOrganization,
  ServiceTier,
} from "@/server/repos/projects";
import { getOrganizationByClerkId } from "@/server/repos/organizations";
import { initializeKanbanForProject } from "@/server/services/kanban-templates";
import { requireAdmin } from "@/lib/auth/guards";
import { ProjectForm } from "@/components/admin/project-form";

export const runtime = "nodejs";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; description?: string; service_tier?: string }>;
}) {
  async function createProjectAction(formData: FormData) {
    "use server";
    const user = await requireAdmin();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const serviceTier = formData.get("service_tier") as ServiceTier;

    if (!name) {
      throw new Error("Project name is required");
    }

    if (!serviceTier) {
      throw new Error("Service tier is required");
    }

    const project = await createProject({
      name,
      description: description || undefined,
      service_tier: serviceTier,
    });

    // Auto-assign to admin's org so project is visible in portal for prep
    if (user.orgId) {
      const org = await getOrganizationByClerkId(user.orgId);
      if (org) {
        await assignProjectToOrganization(project.id, org.id);
      }
    }

    // Initialize kanban board with tier-specific template
    await initializeKanbanForProject(project.id, serviceTier);

    redirect(`/admin/projects/${project.id}`);
  }

  const params = await searchParams;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold text-stone-900 mb-8">
        Create New Project
      </h1>
      <ProjectForm
        action={createProjectAction}
        initialData={{
          name: params.name,
          description: params.description,
          service_tier: params.service_tier,
        }}
      />
    </div>
  );
}
