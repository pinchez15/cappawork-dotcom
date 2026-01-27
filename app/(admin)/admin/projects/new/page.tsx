import { redirect } from "next/navigation";
import { createProject } from "@/server/repos/projects";
import { initializeKanbanForProject } from "@/server/services/kanban-templates";
import { ProjectForm } from "@/components/admin/project-form";

export const runtime = "nodejs";

export default function NewProjectPage() {
  async function createProjectAction(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name) {
      throw new Error("Project name is required");
    }

    const project = await createProject({
      name,
      description: description || undefined,
    });

    // Initialize kanban board with template
    await initializeKanbanForProject(project.id);

    redirect(`/admin/projects/${project.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold text-stone-900 mb-8">
        Create New Project
      </h1>
      <ProjectForm action={createProjectAction} />
    </div>
  );
}

