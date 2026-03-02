"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "./kanban-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";

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
  onCardClick: (task: Task) => void;
  isExpanded: boolean;
  isCollapsed: boolean;
  onToggleExpand: () => void;
}

export function KanbanColumn({
  phase,
  tasks,
  projectId,
  onTaskUpdate,
  onCardClick,
  isExpanded,
  isCollapsed,
  onToggleExpand,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: phase.id,
  });

  // Collapsed view — narrow vertical label
  if (isCollapsed) {
    return (
      <Card
        ref={setNodeRef}
        className={`w-[60px] flex-shrink-0 cursor-pointer hover:bg-stone-50 transition-colors ${
          isOver ? "ring-2 ring-blue-500" : ""
        }`}
        onClick={onToggleExpand}
      >
        <div className="flex flex-col items-center py-4 px-1 min-h-[400px]">
          <Badge variant="secondary" className="mb-3 text-xs tabular-nums">
            {tasks.length}
          </Badge>
          <span
            className="text-xs font-medium text-stone-600 whitespace-nowrap"
            style={{ writingMode: "vertical-lr" }}
          >
            {phase.name}
          </span>
        </div>
      </Card>
    );
  }

  // Expanded or neutral view
  return (
    <Card
      ref={setNodeRef}
      className={`flex-shrink-0 ${
        isExpanded ? "flex-1 min-w-0" : "min-w-[272px] w-[272px]"
      } ${isOver ? "ring-2 ring-blue-500" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle
            className="text-base cursor-pointer hover:text-blue-600 transition-colors"
            onClick={onToggleExpand}
          >
            {phase.name}
          </CardTitle>
          {isExpanded && (
            <button
              onClick={onToggleExpand}
              className="ml-auto text-stone-400 hover:text-stone-600 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="text-sm text-stone-500">{tasks.length} tasks</div>
      </CardHeader>
      <CardContent className="space-y-2 min-h-[400px] max-h-[70vh] overflow-y-auto">
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
              onCardClick={onCardClick}
            />
          ))}
        </SortableContext>
      </CardContent>
    </Card>
  );
}
