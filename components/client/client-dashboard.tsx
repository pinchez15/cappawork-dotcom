"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadialProgress } from "@/components/ui/progress";
import { getTierInfo, animations, getStaggerDelay } from "@/lib/animations";
import {
  FileText,
  Link2,
  Palette,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface ClientDashboardProps {
  project: any;
  phases: any[];
  tasks: any[];
  onTabChange?: (tab: string) => void;
}

export function ClientDashboard({
  project,
  phases,
  tasks,
  onTabChange,
}: ClientDashboardProps) {
  // Calculate overall progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.is_completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get tier info
  const tierInfo = getTierInfo(project.service_tier);

  // Get current active phase (first incomplete phase)
  const sortedPhases = [...phases].sort((a, b) => a.order_index - b.order_index);
  const getPhaseProgress = (phaseId: string) => {
    const phaseTasks = tasks.filter((t) => t.phase_id === phaseId);
    const completed = phaseTasks.filter((t) => t.is_completed).length;
    return { completed, total: phaseTasks.length };
  };

  const currentPhase = sortedPhases.find((phase) => {
    const progress = getPhaseProgress(phase.id);
    return progress.completed < progress.total;
  }) || sortedPhases[sortedPhases.length - 1];

  // Get variant for radial progress based on tier
  const getRadialVariant = () => {
    switch (project.service_tier) {
      case "internal_tool": return "tier-internal" as const;
      case "scale_ready": return "tier-scale" as const;
      case "commercial_product": return "tier-commercial" as const;
      default: return "default" as const;
    }
  };

  return (
    <div className={`space-y-6 ${animations.fadeInUp}`}>
      {/* Hero Card */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-stone-50 to-stone-100">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Radial Progress */}
            <div className="flex-shrink-0">
              <RadialProgress
                value={progressPercent}
                size={160}
                strokeWidth={14}
                variant={getRadialVariant()}
              />
            </div>

            {/* Project Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <h2 className="text-2xl font-bold text-stone-900">{project.name}</h2>
                <Badge className={`${tierInfo.colors.bg} text-white`}>
                  {tierInfo.label}
                </Badge>
              </div>
              {project.description && (
                <p className="text-stone-600 mb-4 max-w-xl">{project.description}</p>
              )}

              {/* Key Metrics */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-phase-completed" />
                  <span className="text-stone-600">
                    <span className="font-semibold text-stone-900">{completedTasks}</span> of{" "}
                    <span className="font-semibold text-stone-900">{totalTasks}</span> tasks
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-phase-active" />
                  <span className="text-stone-600">
                    Current: <span className="font-semibold text-stone-900">{currentPhase?.name}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Timeline */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Project Phases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sortedPhases.map((phase, index) => {
              const progress = getPhaseProgress(phase.id);
              const isComplete = progress.completed === progress.total && progress.total > 0;
              const isCurrent = phase.id === currentPhase?.id;
              const isPending = !isComplete && !isCurrent;

              return (
                <div
                  key={phase.id}
                  className={`flex-1 min-w-[120px] ${animations.fadeIn}`}
                  style={getStaggerDelay(index, 50)}
                >
                  <div
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      isComplete
                        ? "bg-green-50 border-phase-completed"
                        : isCurrent
                        ? "bg-blue-50 border-phase-active shadow-md"
                        : "bg-stone-50 border-stone-200"
                    }`}
                  >
                    {/* Status Icon */}
                    <div className="flex items-center gap-2 mb-2">
                      {isComplete ? (
                        <CheckCircle2 className="h-5 w-5 text-phase-completed" />
                      ) : isCurrent ? (
                        <div className="h-5 w-5 rounded-full bg-phase-active animate-pulse-subtle" />
                      ) : (
                        <Circle className="h-5 w-5 text-phase-pending" />
                      )}
                      <span className="text-xs font-medium text-stone-500">
                        {index + 1}/{sortedPhases.length}
                      </span>
                    </div>

                    {/* Phase Name */}
                    <div className={`font-medium text-sm ${
                      isComplete ? "text-green-800" : isCurrent ? "text-blue-800" : "text-stone-600"
                    }`}>
                      {phase.name}
                    </div>

                    {/* Progress */}
                    <div className="text-xs text-stone-500 mt-1">
                      {progress.completed}/{progress.total} tasks
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isComplete ? "bg-phase-completed" : isCurrent ? "bg-phase-active" : "bg-phase-pending"
                        }`}
                        style={{
                          width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Connector */}
                  {index < sortedPhases.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                      <ArrowRight className="h-4 w-4 text-stone-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickActionCard
          icon={FileText}
          title="Files"
          description="Project documents and assets"
          onClick={() => onTabChange?.("files")}
          delay={0}
        />
        <QuickActionCard
          icon={Link2}
          title="Links"
          description="Project URLs and resources"
          onClick={() => onTabChange?.("urls")}
          delay={1}
        />
        <QuickActionCard
          icon={Palette}
          title="Design"
          description="Theme and styling preview"
          onClick={() => onTabChange?.("design")}
          delay={2}
        />
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick?: () => void;
  delay?: number;
}

function QuickActionCard({ icon: Icon, title, description, onClick, delay = 0 }: QuickActionCardProps) {
  return (
    <Card
      className={`cursor-pointer hover:shadow-md hover:border-primary/50 transition-all group ${animations.fadeInUp}`}
      style={getStaggerDelay(delay, 100)}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-stone-100 group-hover:bg-primary/10 transition-colors">
            <Icon className="h-5 w-5 text-stone-600 group-hover:text-primary transition-colors" />
          </div>
          <div>
            <div className="font-medium text-stone-900">{title}</div>
            <div className="text-sm text-stone-500">{description}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
