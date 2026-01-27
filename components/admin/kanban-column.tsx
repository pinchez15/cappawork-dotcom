"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "./kanban-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Phase {
  id: string;
  name: string;
  order_index: number;
}

interface Task {
  id: string;
  phase_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  order_index: number;
}

interface KanbanColumnProps {
  phase: Phase;
  tasks: Task[];
  projectId: string;
  onTaskUpdate: (task: Task) => void;
}

export function KanbanColumn({
  phase,
  tasks,
  projectId,
  onTaskUpdate,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: phase.id,
  });

  return (
    <Card
      ref={setNodeRef}
      className={`w-80 flex-shrink-0 ${isOver ? "ring-2 ring-blue-500" : ""}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{phase.name}</CardTitle>
        <div className="text-sm text-stone-500">{tasks.length} tasks</div>
      </CardHeader>
      <CardContent className="space-y-2 min-h-[400px]">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              projectId={projectId}
              onUpdate={onTaskUpdate}
            />
          ))}
        </SortableContext>
      </CardContent>
    </Card>
  );
}

