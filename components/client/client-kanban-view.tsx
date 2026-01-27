"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { animations, getStaggerDelay } from "@/lib/animations";
import { CheckCircle2, Circle, Clock, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ClientKanbanViewProps {
  phases: any[];
  tasks: any[];
}

interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  phase_id: string;
  order_index: number;
}

// Phase status colors
const phaseColors = {
  completed: {
    header: "bg-green-50 border-green-200",
    headerText: "text-green-800",
    badge: "bg-green-100 text-green-700",
    progress: "bg-phase-completed",
  },
  active: {
    header: "bg-blue-50 border-blue-200",
    headerText: "text-blue-800",
    badge: "bg-blue-100 text-blue-700",
    progress: "bg-phase-active",
  },
  pending: {
    header: "bg-stone-50 border-stone-200",
    headerText: "text-stone-600",
    badge: "bg-stone-100 text-stone-600",
    progress: "bg-phase-pending",
  },
};

export function ClientKanbanView({ phases, tasks }: ClientKanbanViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const isMobile = useIsMobile();

  const sortedPhases = [...phases].sort((a, b) => a.order_index - b.order_index);

  const getTasksForPhase = (phaseId: string) => {
    return tasks
      .filter((t) => t.phase_id === phaseId)
      .sort((a, b) => a.order_index - b.order_index);
  };

  const getPhaseStatus = (phaseId: string): "completed" | "active" | "pending" => {
    const phaseTasks = getTasksForPhase(phaseId);
    if (phaseTasks.length === 0) return "pending";
    const completedCount = phaseTasks.filter((t) => t.is_completed).length;
    if (completedCount === phaseTasks.length) return "completed";
    if (completedCount > 0) return "active";
    return "pending";
  };

  // Find current active phase
  const currentPhaseId = sortedPhases.find(
    (phase) => getPhaseStatus(phase.id) === "active"
  )?.id;

  const TaskDetailContent = ({ task }: { task: Task }) => {
    const phase = phases.find((p) => p.id === task.phase_id);
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {task.is_completed ? (
            <CheckCircle2 className="h-6 w-6 text-phase-completed" />
          ) : (
            <Circle className="h-6 w-6 text-phase-pending" />
          )}
          <Badge variant={task.is_completed ? "secondary" : "outline"}>
            {task.is_completed ? "Completed" : "In Progress"}
          </Badge>
        </div>

        {task.description && (
          <div>
            <h4 className="text-sm font-medium text-stone-500 mb-1">Description</h4>
            <p className="text-stone-700">{task.description}</p>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-stone-500 mb-1">Phase</h4>
          <p className="text-stone-700">{phase?.name || "Unknown"}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {sortedPhases.map((phase, index) => {
          const phaseTasks = getTasksForPhase(phase.id);
          const completedCount = phaseTasks.filter((t) => t.is_completed).length;
          const progressPercent =
            phaseTasks.length > 0
              ? Math.round((completedCount / phaseTasks.length) * 100)
              : 0;
          const status = getPhaseStatus(phase.id);
          const colors = phaseColors[status];
          const isCurrentPhase = phase.id === currentPhaseId;

          return (
            <Card
              key={phase.id}
              className={`w-80 flex-shrink-0 transition-all duration-300 ${animations.fadeIn} ${
                isCurrentPhase ? "ring-2 ring-phase-active ring-offset-2" : ""
              }`}
              style={getStaggerDelay(index, 50)}
            >
              <CardHeader className={`pb-3 rounded-t-lg ${colors.header}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-base ${colors.headerText}`}>
                    {phase.name}
                  </CardTitle>
                  {isCurrentPhase && (
                    <Badge className="bg-phase-active text-white animate-pulse-subtle">
                      Active
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={colors.headerText}>
                      {completedCount} of {phaseTasks.length} completed
                    </span>
                    <span className={`font-medium ${colors.headerText}`}>
                      {progressPercent}%
                    </span>
                  </div>
                  <Progress
                    value={progressPercent}
                    size="sm"
                    variant={
                      status === "completed"
                        ? "success"
                        : status === "active"
                        ? "default"
                        : "default"
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 min-h-[300px] pt-4">
                {phaseTasks.map((task, taskIndex) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md hover:border-primary/50 group ${
                      task.is_completed
                        ? "opacity-70 bg-stone-50 border-stone-200"
                        : "bg-white border-stone-200 hover:bg-stone-50/50"
                    } ${animations.fadeIn}`}
                    style={getStaggerDelay(taskIndex, 30)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        {task.is_completed ? (
                          <CheckCircle2 className="h-4 w-4 text-phase-completed" />
                        ) : (
                          <Circle className="h-4 w-4 text-stone-300 group-hover:text-phase-active transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium flex items-center justify-between ${
                            task.is_completed
                              ? "line-through text-stone-500"
                              : "text-stone-900"
                          }`}
                        >
                          <span>{task.title}</span>
                          <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-stone-500 transition-colors opacity-0 group-hover:opacity-100" />
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

                {phaseTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-stone-400">
                    <Clock className="h-8 w-8 mb-2" />
                    <span className="text-sm">No tasks yet</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Task Detail - Sheet on mobile, Dialog on desktop */}
      {isMobile ? (
        <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <SheetContent side="bottom" className="h-[50vh]">
            {selectedTask && (
              <>
                <SheetHeader>
                  <SheetTitle>{selectedTask.title}</SheetTitle>
                  <SheetDescription>Task details</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <TaskDetailContent task={selectedTask} />
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="sm:max-w-md">
            {selectedTask && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedTask.title}</DialogTitle>
                  <DialogDescription>Task details</DialogDescription>
                </DialogHeader>
                <TaskDetailContent task={selectedTask} />
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
