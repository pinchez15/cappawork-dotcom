"use client";

import { Badge } from "@/components/ui/badge";
import {
  TASK_STATUSES,
  TASK_PRIORITIES,
  type AdminTaskWithProject,
} from "@/server/repos/admin-tasks";

type Props = {
  tasks: AdminTaskWithProject[];
  onEdit: (task: AdminTaskWithProject) => void;
};

function StatusBadge({ status }: { status: string }) {
  const def = TASK_STATUSES.find((s) => s.id === status);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${def?.color || "bg-stone-100 text-stone-600"}`}>
      {def?.label || status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const def = TASK_PRIORITIES.find((p) => p.id === priority);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${def?.color || "bg-stone-100 text-stone-600"}`}>
      {def?.label || priority}
    </span>
  );
}

export function TaskListView({ tasks, onEdit }: Props) {
  const today = new Date().toISOString().split("T")[0];

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-stone-400">
        No tasks found
      </div>
    );
  }

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-stone-50 border-b border-stone-200">
            <th className="text-left px-4 py-3 font-medium text-stone-500">Priority</th>
            <th className="text-left px-4 py-3 font-medium text-stone-500">Title</th>
            <th className="text-left px-4 py-3 font-medium text-stone-500">Project</th>
            <th className="text-left px-4 py-3 font-medium text-stone-500">Status</th>
            <th className="text-left px-4 py-3 font-medium text-stone-500">Due</th>
            <th className="text-left px-4 py-3 font-medium text-stone-500">Source</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const isDone = task.status === "done";
            const isOverdue =
              task.due_date && task.due_date < today && !isDone;

            return (
              <tr
                key={task.id}
                onClick={() => onEdit(task)}
                className={`border-b border-stone-100 cursor-pointer hover:bg-stone-50 transition-colors ${
                  isDone ? "opacity-50" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-4 py-3 font-medium text-stone-900">
                  {task.title}
                </td>
                <td className="px-4 py-3 text-stone-500">
                  {task.project_name || "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={task.status} />
                </td>
                <td className={`px-4 py-3 ${isOverdue ? "text-red-600 font-medium" : "text-stone-500"}`}>
                  {task.due_date || "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-xs">
                    {task.source}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
