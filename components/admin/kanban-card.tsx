"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleTaskAction } from "@/server/actions/kanban";
import { GripVertical } from "lucide-react";

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
  onCardClick: (task: Task) => void;
}

export function KanbanCard({ task, projectId, onUpdate, onCardClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
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
      const updated = await toggleTaskAction(task.id, checked);
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
      className={`cursor-pointer hover:ring-1 hover:ring-stone-300 transition-shadow ${
        task.is_completed ? "opacity-60" : ""
      }`}
      onClick={() => onCardClick(task)}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <button
            ref={setActivatorNodeRef}
            {...listeners}
            className="mt-0.5 cursor-grab active:cursor-grabbing text-stone-300 hover:text-stone-500 transition-colors shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <Checkbox
            checked={task.is_completed}
            onCheckedChange={handleToggleComplete}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div
              className={`text-sm font-medium ${
                task.is_completed ? "line-through text-muted-foreground" : "text-card-foreground"
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
