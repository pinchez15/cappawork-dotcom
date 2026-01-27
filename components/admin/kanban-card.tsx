"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { updateTask } from "@/server/repos/kanban";
import { useState } from "react";

interface Task {
  id: string;
  phase_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  order_index: number;
}

interface KanbanCardProps {
  task: Task;
  projectId: string;
  onUpdate: (task: Task) => void;
}

export function KanbanCard({ task, projectId, onUpdate }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggleComplete = async (checked: boolean) => {
    try {
      const updated = await updateTask(task.id, { is_completed: checked });
      onUpdate(updated);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${
        task.is_completed ? "opacity-60" : ""
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <Checkbox
            checked={task.is_completed}
            onCheckedChange={handleToggleComplete}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex-1 min-w-0">
            <div
              className={`text-sm font-medium ${
                task.is_completed ? "line-through text-stone-500" : "text-stone-900"
              }`}
            >
              {task.title}
            </div>
            {task.description && (
              <div className="text-xs text-stone-500 mt-1 line-clamp-2">
                {task.description}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

