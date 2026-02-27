"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CheckCircle2, Circle, Clock, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import gsap from "gsap";

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
    header: "bg-gradient-to-r from-emerald-50 to-emerald-50/40 border-emerald-200",
    headerText: "text-emerald-800",
    badge: "bg-emerald-100 text-emerald-700",
    progress: "bg-phase-completed",
    accent: "from-emerald-400 to-emerald-500",
  },
  active: {
    header: "bg-gradient-to-r from-gold/10 to-gold/5 border-gold/40",
    headerText: "text-gold",
    badge: "bg-gold/20 text-gold",
    progress: "bg-phase-active",
    accent: "from-gold to-gold/80",
  },
  pending: {
    header: "bg-muted/50 border-border",
    headerText: "text-stone-500",
    badge: "bg-stone-100 text-stone-500",
    progress: "bg-phase-pending",
    accent: "from-stone-300 to-stone-400",
  },
};

export function ClientKanbanView({ phases, tasks }: ClientKanbanViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  const sortedPhases = [...phases].sort(
    (a, b) => a.order_index - b.order_index
  );

  const getTasksForPhase = (phaseId: string) => {
    return tasks
      .filter((t) => t.phase_id === phaseId)
      .sort((a, b) => a.order_index - b.order_index);
  };

  const getPhaseStatus = (
    phaseId: string,
    phaseIndex: number
  ): "completed" | "active" | "pending" => {
    const phaseTasks = getTasksForPhase(phaseId);
    if (phaseTasks.length === 0) return "pending";
    const completedCount = phaseTasks.filter((t) => t.is_completed).length;
    if (completedCount === phaseTasks.length) return "completed";

    // First phase with incomplete tasks is active
    const isFirstIncomplete = sortedPhases.findIndex((p) => {
      const pt = getTasksForPhase(p.id);
      const cc = pt.filter((t) => t.is_completed).length;
      return pt.length > 0 && cc < pt.length;
    });

    return isFirstIncomplete === phaseIndex ? "active" : "pending";
  };

  // GSAP staggered entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger columns
      const columns = containerRef.current?.querySelectorAll("[data-column]");
      if (columns && columns.length > 0) {
        gsap.fromTo(
          columns,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          }
        );

        // Then stagger tasks within each column
        columns.forEach((col, colIndex) => {
          const taskCards = col.querySelectorAll("[data-task]");
          if (taskCards.length > 0) {
            gsap.fromTo(
              taskCards,
              { y: 16, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.35,
                stagger: 0.05,
                delay: 0.3 + colIndex * 0.08,
                ease: "power2.out",
              }
            );
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const TaskDetailContent = ({ task }: { task: Task }) => {
    const phase = phases.find((p) => p.id === task.phase_id);
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {task.is_completed ? (
            <CheckCircle2 className="h-6 w-6 text-phase-completed" />
          ) : (
            <div className="relative h-6 w-6">
              <div className="absolute inset-0 rounded-full bg-gold animate-ping opacity-20" />
              <Circle className="relative h-6 w-6 text-phase-active" />
            </div>
          )}
          <Badge variant={task.is_completed ? "secondary" : "outline"}>
            {task.is_completed ? "Completed" : "In Progress"}
          </Badge>
        </div>

        {task.description && (
          <div>
            <h4 className="text-sm font-medium text-stone-400 mb-1">
              Description
            </h4>
            <p className="text-stone-700 leading-relaxed">{task.description}</p>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-stone-400 mb-1">Phase</h4>
          <p className="text-stone-700">{phase?.name || "Unknown"}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div ref={containerRef} className="flex gap-5 overflow-x-auto pb-4 px-1">
        {sortedPhases.map((phase, index) => {
          const phaseTasks = getTasksForPhase(phase.id);
          const completedCount = phaseTasks.filter(
            (t) => t.is_completed
          ).length;
          const progressPercent =
            phaseTasks.length > 0
              ? Math.round((completedCount / phaseTasks.length) * 100)
              : 0;
          const status = getPhaseStatus(phase.id, index);
          const colors = phaseColors[status];
          const isActive = status === "active";

          return (
            <div
              key={phase.id}
              data-column
              style={{ opacity: 0 }}
              className="w-80 flex-shrink-0"
            >
              <Card
                className={`transition-all duration-300 overflow-hidden ${
                  isActive
                    ? "shadow-lg ring-2 ring-gold/40 ring-offset-2"
                    : "shadow-sm hover:shadow-md"
                }`}
              >
                {/* Colored accent bar */}
                <div
                  className={`h-1 bg-gradient-to-r ${colors.accent}`}
                />

                <CardHeader className={`pb-3 ${colors.header} border-b`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-base font-semibold ${colors.headerText}`}>
                      {phase.name}
                    </CardTitle>
                    {isActive && (
                      <Badge className="bg-gold text-navy shadow-sm text-xs">
                        Active
                      </Badge>
                    )}
                    {status === "completed" && (
                      <Badge className="bg-emerald-500 text-white shadow-sm text-xs">
                        Done
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={colors.headerText}>
                        {completedCount} of {phaseTasks.length} completed
                      </span>
                      <span className={`font-semibold ${colors.headerText}`}>
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
                <CardContent className="space-y-2.5 min-h-[280px] pt-4 bg-card/50">
                  {phaseTasks.map((task) => (
                    <div
                      key={task.id}
                      data-task
                      onClick={() => setSelectedTask(task)}
                      style={{ opacity: 0 }}
                      className={`border rounded-xl p-3.5 cursor-pointer transition-all duration-200 group ${
                        task.is_completed
                          ? "bg-muted border-border/80 opacity-60"
                          : "bg-card border-border hover:shadow-md hover:border-gold/40 hover:-translate-y-px"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="pt-0.5">
                          {task.is_completed ? (
                            <CheckCircle2 className="h-[18px] w-[18px] text-emerald-500" />
                          ) : (
                            <Circle className="h-[18px] w-[18px] text-stone-300 group-hover:text-gold transition-colors" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-sm font-medium flex items-center justify-between ${
                              task.is_completed
                                ? "line-through text-stone-400"
                                : "text-stone-800"
                            }`}
                          >
                            <span>{task.title}</span>
                            <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-stone-500 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5" />
                          </div>
                          {task.description && (
                            <div className="text-xs text-stone-400 mt-1 line-clamp-2">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {phaseTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-stone-300">
                      <Clock className="h-8 w-8 mb-2" />
                      <span className="text-sm font-medium">No tasks yet</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Task Detail - Sheet on mobile, Dialog on desktop */}
      {isMobile ? (
        <Sheet
          open={!!selectedTask}
          onOpenChange={() => setSelectedTask(null)}
        >
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
        <Dialog
          open={!!selectedTask}
          onOpenChange={() => setSelectedTask(null)}
        >
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
