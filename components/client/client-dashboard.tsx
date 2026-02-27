"use client";

import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadialProgress } from "@/components/ui/progress";
import { getTierInfo } from "@/lib/animations";
import {
  FileText,
  Link2,
  Palette,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import gsap from "gsap";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const phasesRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Calculate overall progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.is_completed).length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get tier info
  const tierInfo = getTierInfo(project.service_tier);

  // Get current active phase (first incomplete phase)
  const sortedPhases = [...phases].sort(
    (a, b) => a.order_index - b.order_index
  );
  const getPhaseProgress = (phaseId: string) => {
    const phaseTasks = tasks.filter((t) => t.phase_id === phaseId);
    const completed = phaseTasks.filter((t) => t.is_completed).length;
    return { completed, total: phaseTasks.length };
  };

  // First phase that isn't fully complete is the current/active one
  const currentPhase =
    sortedPhases.find((phase) => {
      const progress = getPhaseProgress(phase.id);
      return progress.completed < progress.total;
    }) || sortedPhases[sortedPhases.length - 1];

  // Get variant for radial progress based on tier
  const getRadialVariant = () => {
    switch (project.service_tier) {
      case "portal_build":
        return "tier-portal" as const;
      case "diagnostic":
        return "tier-diagnostic" as const;
      case "implementation":
        return "tier-implementation" as const;
      default:
        return "default" as const;
    }
  };

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Hero card entrance
      if (heroRef.current) {
        tl.fromTo(
          heroRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 }
        );
      }

      // Phase cards stagger
      if (phasesRef.current) {
        const phaseCards = phasesRef.current.querySelectorAll("[data-phase]");
        tl.fromTo(
          phaseCards,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          "-=0.3"
        );
      }

      // Quick action cards stagger
      if (actionsRef.current) {
        const actionCards =
          actionsRef.current.querySelectorAll("[data-action]");
        tl.fromTo(
          actionCards,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          "-=0.2"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Hero Card */}
      <div ref={heroRef} style={{ opacity: 0 }}>
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-warm-white to-card-light">
          <CardContent className="p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Radial Progress */}
              <div className="flex-shrink-0">
                <RadialProgress
                  value={progressPercent}
                  size={172}
                  strokeWidth={14}
                  variant={getRadialVariant()}
                />
              </div>

              {/* Project Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                  <h2 className="text-2xl lg:text-3xl font-bold text-navy tracking-tight">
                    {project.name}
                  </h2>
                  <Badge
                    className={`${tierInfo.colors.bg} text-white shadow-sm`}
                  >
                    {tierInfo.label}
                  </Badge>
                </div>
                {project.description && (
                  <p className="text-stone-500 mb-5 max-w-xl text-base leading-relaxed">
                    {project.description}
                  </p>
                )}

                {/* Key Metrics */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                  <div className="flex items-center gap-2.5 bg-white/80 rounded-full px-4 py-2 shadow-sm border border-stone-200/60">
                    <CheckCircle2 className="h-4 w-4 text-phase-completed" />
                    <span className="text-stone-500">
                      <span className="font-semibold text-navy">
                        {completedTasks}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-navy">
                        {totalTasks}
                      </span>{" "}
                      tasks
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/80 rounded-full px-4 py-2 shadow-sm border border-stone-200/60">
                    <Sparkles className="h-4 w-4 text-phase-active" />
                    <span className="text-stone-500">
                      Current:{" "}
                      <span className="font-semibold text-navy">
                        {currentPhase?.name}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase Timeline */}
      <Card className="border-stone-200/80 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Project Phases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={phasesRef} className="flex gap-3 overflow-x-auto pb-2">
            {sortedPhases.map((phase, index) => {
              const progress = getPhaseProgress(phase.id);
              const isComplete =
                progress.completed === progress.total && progress.total > 0;
              const isCurrent = phase.id === currentPhase?.id;
              const isPast =
                sortedPhases.indexOf(phase) <
                sortedPhases.indexOf(currentPhase);

              return (
                <div
                  key={phase.id}
                  data-phase
                  className="flex-1 min-w-[130px]"
                  style={{ opacity: 0 }}
                >
                  <div
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      isComplete
                        ? "bg-gradient-to-b from-emerald-50 to-white border-emerald-300 shadow-sm"
                        : isCurrent
                          ? "bg-gradient-to-b from-gold/10 to-white border-gold shadow-md ring-1 ring-gold/30"
                          : "bg-stone-50/50 border-stone-200"
                    }`}
                  >
                    {/* Status Icon */}
                    <div className="flex items-center gap-2 mb-2">
                      {isComplete ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : isCurrent ? (
                        <div className="relative h-5 w-5">
                          <div className="absolute inset-0 rounded-full bg-gold animate-ping opacity-25" />
                          <div className="relative h-5 w-5 rounded-full bg-gold" />
                        </div>
                      ) : (
                        <Circle className="h-5 w-5 text-stone-300" />
                      )}
                      <span className="text-xs font-medium text-stone-400">
                        {index + 1}/{sortedPhases.length}
                      </span>
                    </div>

                    {/* Phase Name */}
                    <div
                      className={`font-semibold text-sm ${
                        isComplete
                          ? "text-emerald-700"
                          : isCurrent
                            ? "text-gold"
                            : "text-stone-500"
                      }`}
                    >
                      {phase.name}
                    </div>

                    {/* Progress */}
                    <div className="text-xs text-stone-400 mt-1">
                      {progress.completed}/{progress.total} tasks
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-1.5 bg-stone-200/80 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isComplete
                            ? "bg-emerald-400"
                            : isCurrent
                              ? "bg-gold"
                              : "bg-stone-300"
                        }`}
                        style={{
                          width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div ref={actionsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickActionCard
          icon={FileText}
          title="Files"
          description="Project documents and assets"
          onClick={() => onTabChange?.("files")}
          accentColor="bg-blue-500"
          accentLight="bg-blue-50 group-hover:bg-blue-100"
        />
        <QuickActionCard
          icon={Link2}
          title="Links"
          description="Project URLs and resources"
          onClick={() => onTabChange?.("urls")}
          accentColor="bg-indigo-500"
          accentLight="bg-indigo-50 group-hover:bg-indigo-100"
        />
        <QuickActionCard
          icon={Palette}
          title="Design"
          description="Theme and styling preview"
          onClick={() => onTabChange?.("design")}
          accentColor="bg-violet-500"
          accentLight="bg-violet-50 group-hover:bg-violet-100"
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
  accentColor: string;
  accentLight: string;
}

function QuickActionCard({
  icon: Icon,
  title,
  description,
  onClick,
  accentColor,
  accentLight,
}: QuickActionCardProps) {
  return (
    <Card
      data-action
      className="cursor-pointer border-stone-200/80 shadow-sm hover:shadow-lg hover:border-stone-300 hover:-translate-y-0.5 transition-all duration-200 group"
      style={{ opacity: 0 }}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-xl ${accentLight} transition-colors duration-200`}
          >
            <Icon
              className={`h-5 w-5 text-stone-500 group-hover:text-stone-700 transition-colors`}
            />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-navy">{title}</div>
            <div className="text-sm text-stone-500">{description}</div>
          </div>
          <ArrowRight className="h-4 w-4 text-stone-300 group-hover:text-stone-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </CardContent>
    </Card>
  );
}
