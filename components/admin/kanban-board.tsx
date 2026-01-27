"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { reorderTasksAction } from "@/server/actions/kanban";

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

interface KanbanBoardProps {
  projectId: string;
  initialPhases: Phase[];
  initialTasks: Task[];
}

export function KanbanBoard({
  projectId,
  initialPhases,
  initialTasks,
}: KanbanBoardProps) {
  const [phases, setPhases] = useState(initialPhases);
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a phase (column)
    const targetPhase = phases.find((p) => p.id === overId);
    if (targetPhase) {
      // Move task to new phase
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.phase_id !== targetPhase.id) {
        setIsReordering(true);
        try {
          await reorderTasksAction([
            {
              id: taskId,
              phase_id: targetPhase.id,
              order_index: tasks.filter((t) => t.phase_id === targetPhase.id).length,
            },
          ]);
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId
                ? { ...t, phase_id: targetPhase.id, order_index: tasks.filter((t) => t.phase_id === targetPhase.id).length }
                : t
            )
          );
        } catch (error) {
          console.error("Failed to reorder task:", error);
        } finally {
          setIsReordering(false);
        }
      }
      return;
    }

    // Check if dropped on another task (reorder within phase)
    const targetTask = tasks.find((t) => t.id === overId);
    if (targetTask) {
      const sourceTask = tasks.find((t) => t.id === taskId);
      if (!sourceTask || sourceTask.phase_id !== targetTask.phase_id) return;

      const phaseTasks = tasks
        .filter((t) => t.phase_id === sourceTask.phase_id)
        .sort((a, b) => a.order_index - b.order_index);

      const oldIndex = phaseTasks.findIndex((t) => t.id === taskId);
      const newIndex = phaseTasks.findIndex((t) => t.id === overId);

      if (oldIndex !== newIndex) {
        const reordered = arrayMove(phaseTasks, oldIndex, newIndex);
        setIsReordering(true);
        try {
          await reorderTasksAction(
            reordered.map((t, idx) => ({
              id: t.id,
              phase_id: t.phase_id,
              order_index: idx,
            }))
          );
          setTasks((prev) =>
            prev.map((t) => {
              const reorderedTask = reordered.find((rt) => rt.id === t.id);
              return reorderedTask
                ? { ...t, order_index: reorderedTask.order_index }
                : t;
            })
          );
        } catch (error) {
          console.error("Failed to reorder tasks:", error);
        } finally {
          setIsReordering(false);
        }
      }
    }
  };

  const getTasksForPhase = (phaseId: string) => {
    return tasks
      .filter((t) => t.phase_id === phaseId)
      .sort((a, b) => a.order_index - b.order_index);
  };

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {phases.map((phase) => (
            <KanbanColumn
              key={phase.id}
              phase={phase}
              tasks={getTasksForPhase(phase.id)}
              projectId={projectId}
              onTaskUpdate={(updatedTask) => {
                setTasks((prev) =>
                  prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
                );
              }}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="bg-white p-3 rounded border shadow-lg max-w-xs">
              {activeTask.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

