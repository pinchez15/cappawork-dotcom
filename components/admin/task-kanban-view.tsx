"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
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

function TaskCard({
  task,
  onEdit,
  phaseByProject,
}: {
  task: AdminTaskWithProject;
  onEdit: (task: AdminTaskWithProject) => void;
  phaseByProject?: Record<string, string | null>;
}) {
  const priorityDef = TASK_PRIORITIES.find((p) => p.id === task.priority);
  const today = new Date().toISOString().split("T")[0];
  const isOverdue = task.due_date && task.due_date < today && task.status !== "done";

  return (
    <div
      onClick={() => onEdit(task)}
      className="bg-white rounded-lg border border-stone-200 p-3 cursor-pointer hover:shadow-sm transition-shadow"
    >
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
    </div>
  );
}

function DroppableColumn({
  statusId,
  label,
  tasks,
  onEdit,
  phaseByProject,
}: {
  statusId: string;
  label: string;
  tasks: AdminTaskWithProject[];
  onEdit: (task: AdminTaskWithProject) => void;
  phaseByProject: Record<string, string | null>;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: statusId });
  const statusDef = TASK_STATUSES.find((s) => s.id === statusId);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border border-stone-200 bg-stone-50/50 min-w-0 flex-1 transition-shadow ${
        isOver ? "ring-2 ring-blue-400 shadow-md" : ""
      }`}
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
          </div>
          <span className="text-xs font-medium text-stone-400">
            {tasks.length}
          </span>
        </div>
      </div>
      <div className="flex-1 p-2 space-y-2 min-h-[120px] overflow-y-auto max-h-[calc(100vh-300px)]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} phaseByProject={phaseByProject} />
        ))}
      </div>
    </div>
  );
}

export function TaskKanbanView({ tasks, onEdit, onStatusChange, phaseByProject }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

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
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80 rotate-2">
            <TaskCard task={activeTask} onEdit={() => {}} phaseByProject={phaseByProject} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
