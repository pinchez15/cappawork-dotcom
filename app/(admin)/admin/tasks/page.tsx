import { getTasks, getTaskStats } from "@/server/repos/admin-tasks";
import { getAllProjects, getProjectsWithProgress } from "@/server/repos/projects";
import { TaskDashboard } from "@/components/admin/task-dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const [tasks, stats, projects, projectProgress] = await Promise.all([
    getTasks(),
    getTaskStats(),
    getAllProjects(),
    getProjectsWithProgress(),
  ]);

  const projectOptions = projects.map((p: any) => ({
    id: p.id,
    name: p.name,
  }));

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TaskDashboard
        initialTasks={tasks}
        stats={stats}
        projects={projectOptions}
        projectProgress={projectProgress}
      />
    </div>
  );
}
