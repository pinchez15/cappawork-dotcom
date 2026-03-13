"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, List, Columns3, AlertTriangle, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TASK_STATUSES,
  TASK_PRIORITIES,
  type AdminTaskWithProject,
} from "@/server/repos/admin-tasks";
import { TaskListView } from "@/components/admin/task-list-view";
import { TaskKanbanView } from "@/components/admin/task-kanban-view";
import { TaskFormDialog } from "@/components/admin/task-form-dialog";

type Props = {
  initialTasks: AdminTaskWithProject[];
  stats: {
    todo: number;
    inProgress: number;
    blocked: number;
    done: number;
    overdue: number;
    urgent: number;
    total: number;
  };
  projects: { id: string; name: string }[];
};

type ViewMode = "list" | "kanban";

export function TaskDashboard({ initialTasks, stats, projects }: Props) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [view, setView] = useState<ViewMode>("list");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<AdminTaskWithProject | null>(null);

  // Filters
  const [filterProject, setFilterProject] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");

  const hasFilters = filterProject || filterStatus || filterPriority;

  const filteredTasks = tasks.filter((t) => {
    if (filterProject && t.project_id !== filterProject) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    return true;
  });

  const refreshTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch {
      // silent
    }
  }, []);

  const handleEdit = useCallback((task: AdminTaskWithProject) => {
    setEditingTask(task);
    setDialogOpen(true);
  }, []);

  const handleSaved = useCallback(() => {
    setDialogOpen(false);
    setEditingTask(null);
    refreshTasks();
    router.refresh();
  }, [refreshTasks, router]);

  const handleDeleted = useCallback(() => {
    setDialogOpen(false);
    setEditingTask(null);
    refreshTasks();
    router.refresh();
  }, [refreshTasks, router]);

  const handleStatusChange = useCallback(
    async (taskId: string, newStatus: string) => {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );

      try {
        await fetch(`/api/admin/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch {
        // Revert on error
        setTasks(initialTasks);
      }
    },
    [initialTasks]
  );

  const clearFilters = () => {
    setFilterProject("");
    setFilterStatus("");
    setFilterPriority("");
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-semibold text-stone-900">Tasks</h1>
          <div className="flex items-center gap-2">
            {stats.overdue > 0 && (
              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {stats.overdue} overdue
              </Badge>
            )}
            {stats.urgent > 0 && (
              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                <Clock className="h-3 w-3 mr-1" />
                {stats.urgent} urgent
              </Badge>
            )}
            <Badge variant="outline" className="text-stone-500">
              {stats.total} total
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                view === "list"
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-500 hover:text-stone-700"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                view === "kanban"
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-500 hover:text-stone-700"
              }`}
            >
              <Columns3 className="h-3.5 w-3.5" />
              Board
            </button>
          </div>

          <Button
            onClick={() => {
              setEditingTask(null);
              setDialogOpen(true);
            }}
            className="rounded-full bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Task
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-4">
        <Select
          value={filterProject || "all"}
          onValueChange={(v) => setFilterProject(v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterStatus || "all"}
          onValueChange={(v) => setFilterStatus(v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {TASK_STATUSES.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterPriority || "all"}
          onValueChange={(v) => setFilterPriority(v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {TASK_PRIORITIES.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-stone-400 hover:text-stone-600"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        )}

        <span className="text-xs text-stone-400 ml-auto">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Content */}
      {view === "list" ? (
        <TaskListView tasks={filteredTasks} onEdit={handleEdit} />
      ) : (
        <TaskKanbanView
          tasks={filteredTasks}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
        />
      )}

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        projects={projects}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
      />
    </>
  );
}
