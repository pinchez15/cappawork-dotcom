"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Maximize2, Minimize2, ArrowUpDown } from "lucide-react";
import {
  TASK_STATUSES,
  TASK_PRIORITIES,
  type AdminTaskWithProject,
} from "@/server/repos/admin-tasks";

type Props = {
  tasks: AdminTaskWithProject[];
  onEdit: (task: AdminTaskWithProject) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  phaseByProject: Record<string, string | null>;
};

type SortKey = "priority" | "due_date" | "title" | "project";

const PRIORITY_ORDER: Record<string, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function sortTasks(tasks: AdminTaskWithProject[], sortBy: SortKey): AdminTaskWithProject[] {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        return (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9);
      case "due_date": {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return a.due_date.localeCompare(b.due_date);
      }
      case "title":
        return a.title.localeCompare(b.title);
      case "project":
        return (a.project_name || "").localeCompare(b.project_name || "");
      default:
        return 0;
    }
  });
}

function TaskCardContent({
  task,
  phaseByProject,
}: {
  task: AdminTaskWithProject;
  phaseByProject?: Record<string, string | null>;
}) {
  const priorityDef = TASK_PRIORITIES.find((p) => p.id === task.priority);
  const today = new Date().toISOString().split("T")[0];
  // Only show overdue styling for todo and blocked — not in_progress or done
  const isOverdue =
    task.due_date &&
    task.due_date < today &&
    task.status !== "done" &&
    task.status !== "in_progress";

  return (
    <>
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-sm font-medium text-stone-900 leading-tight">
          {task.title}
        </span>
        <span
          className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
            priorityDef?.color || "bg-stone-100 text-stone-600"
          }`}
        >
          {priorityDef?.label || task.priority}
        </span>
      </div>
      {task.project_name && (
        <div className="text-xs text-stone-400 mb-1">
          {task.project_name}
          {task.project_id && phaseByProject?.[task.project_id] && (
            <span className="ml-1 text-[10px] bg-stone-100 text-stone-500 rounded-full px-1.5 py-0.5">
              {phaseByProject[task.project_id]}
            </span>
          )}
        </div>
      )}
      {task.due_date && (
        <div
          className={`text-xs ${
            isOverdue ? "text-red-600 font-medium" : "text-stone-400"
          }`}
        >
          Due {task.due_date}
        </div>
      )}
    </>
  );
}

function TaskCard({
  task,
  onEdit,
  phaseByProject,
  isDragOverlay,
}: {
  task: AdminTaskWithProject;
  onEdit: (task: AdminTaskWithProject) => void;
  phaseByProject?: Record<string, string | null>;
  isDragOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => {
        if (!isDragging) onEdit(task);
      }}
      className={`bg-white rounded-lg border border-stone-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow touch-none ${
        isDragging && !isDragOverlay ? "opacity-30" : ""
      }`}
    >
      <TaskCardContent task={task} phaseByProject={phaseByProject} />
    </div>
  );
}

function DroppableColumn({
  statusId,
  label,
  tasks,
  onEdit,
  phaseByProject,
  isExpanded,
  onToggleExpand,
  sortBy,
  onSortChange,
}: {
  statusId: string;
  label: string;
  tasks: AdminTaskWithProject[];
  onEdit: (task: AdminTaskWithProject) => void;
  phaseByProject: Record<string, string | null>;
  isExpanded: boolean;
  onToggleExpand: () => void;
  sortBy: SortKey;
  onSortChange: (key: SortKey) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: statusId });
  const statusDef = TASK_STATUSES.find((s) => s.id === statusId);
  const sortedTasks = sortTasks(tasks, sortBy);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border border-stone-200 bg-stone-50/50 transition-all duration-200 ${
        isExpanded ? "min-w-[480px] flex-[3]" : "min-w-0 flex-1"
      } ${isOver ? "ring-2 ring-blue-400 shadow-md" : ""}`}
    >
      <div className="px-3 py-3 border-b border-stone-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                statusDef?.color || ""
              }`}
            >
              {label}
            </span>
            <span className="text-xs font-medium text-stone-400">
              {tasks.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {isExpanded && (
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortKey)}
                className="text-[10px] px-1.5 py-0.5 rounded border border-stone-200 bg-white text-stone-500 cursor-pointer"
              >
                <option value="priority">Priority</option>
                <option value="due_date">Due date</option>
                <option value="title">Title</option>
                <option value="project">Project</option>
              </select>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              className="p-1 rounded hover:bg-stone-200/60 text-stone-400 hover:text-stone-600 transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <Minimize2 className="h-3 w-3" />
              ) : (
                <Maximize2 className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className={`flex-1 p-2 space-y-2 min-h-[120px] overflow-y-auto ${
        isExpanded ? "max-h-[calc(100vh-260px)]" : "max-h-[calc(100vh-300px)]"
      }`}>
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} phaseByProject={phaseByProject} />
        ))}
      </div>
    </div>
  );
}

export function TaskKanbanView({ tasks, onEdit, onStatusChange, phaseByProject }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedColumn, setExpandedColumn] = useState<string | null>(null);
  const [columnSorts, setColumnSorts] = useState<Record<string, SortKey>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const activeTask = activeId
    ? tasks.find((t) => t.id === activeId)
    : null;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id as string;
      const destStatus = over.id as string;

      const task = tasks.find((t) => t.id === taskId);
      if (!task || task.status === destStatus) return;

      onStatusChange(taskId, destStatus);
    },
    [tasks, onStatusChange]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3">
        {TASK_STATUSES.map((status) => (
          <DroppableColumn
            key={status.id}
            statusId={status.id}
            label={status.label}
            tasks={tasks.filter((t) => t.status === status.id)}
            onEdit={onEdit}
            phaseByProject={phaseByProject}
            isExpanded={expandedColumn === status.id}
            onToggleExpand={() =>
              setExpandedColumn((prev) =>
                prev === status.id ? null : status.id
              )
            }
            sortBy={columnSorts[status.id] || "priority"}
            onSortChange={(key) =>
              setColumnSorts((prev) => ({ ...prev, [status.id]: key }))
            }
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="rotate-2 shadow-lg rounded-lg">
            <TaskCard task={activeTask} onEdit={() => {}} phaseByProject={phaseByProject} isDragOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
