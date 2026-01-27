"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface ClientKanbanViewProps {
  phases: any[];
  tasks: any[];
}

export function ClientKanbanView({ phases, tasks }: ClientKanbanViewProps) {
  const getTasksForPhase = (phaseId: string) => {
    return tasks
      .filter((t) => t.phase_id === phaseId)
      .sort((a, b) => a.order_index - b.order_index);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {phases.map((phase) => {
        const phaseTasks = getTasksForPhase(phase.id);
        const completedCount = phaseTasks.filter((t) => t.is_completed).length;

        return (
          <Card key={phase.id} className="w-80 flex-shrink-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{phase.name}</CardTitle>
              <div className="text-sm text-stone-500">
                {completedCount} of {phaseTasks.length} completed
              </div>
            </CardHeader>
            <CardContent className="space-y-2 min-h-[400px]">
              {phaseTasks.map((task) => (
                <div
                  key={task.id}
                  className={`border border-stone-200 rounded-lg p-3 ${
                    task.is_completed ? "opacity-60 bg-stone-50" : "bg-white"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Checkbox checked={task.is_completed} disabled />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-medium ${
                          task.is_completed
                            ? "line-through text-stone-500"
                            : "text-stone-900"
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
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

