"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { ProjectProgress } from "@/server/repos/projects";

type Props = {
  progress: ProjectProgress[];
  filterProject: string;
};

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 rounded-full transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function CompactCard({ project }: { project: ProjectProgress }) {
  return (
    <div className="border border-stone-200 rounded-xl p-3 min-w-[200px] flex-shrink-0">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <Link
          href={`/admin/projects/${project.id}`}
          className="text-sm font-medium text-stone-900 truncate hover:text-blue-600 transition-colors"
        >
          {project.name}
        </Link>
        <span className="text-xs text-stone-400 shrink-0">
          {project.progressPercent}%
        </span>
      </div>
      {project.activePhase && (
        <span className="inline-flex items-center text-[10px] bg-stone-100 text-stone-500 rounded-full px-1.5 py-0.5 mb-1.5">
          {project.activePhase}
        </span>
      )}
      <ProgressBar percent={project.progressPercent} />
    </div>
  );
}

function ExpandedCard({ project }: { project: ProjectProgress }) {
  return (
    <div className="border border-stone-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <Link
          href={`/admin/projects/${project.id}`}
          className="text-sm font-semibold text-stone-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5 group"
        >
          {project.name}
          <ExternalLink className="h-3 w-3 text-stone-400 group-hover:text-blue-600 transition-colors" />
        </Link>
        <span className="text-xs text-stone-400">
          {project.completedTasks}/{project.totalTasks} tasks ({project.progressPercent}%)
        </span>
      </div>
      <ProgressBar percent={project.progressPercent} />
      <div className="mt-3 space-y-2">
        {project.phases.map((phase) => {
          const pct = phase.total > 0 ? Math.round((phase.completed / phase.total) * 100) : 0;
          const isActive = phase.name === project.activePhase;
          return (
            <div key={phase.name} className="flex items-center gap-3">
              <span
                className={`text-xs w-32 truncate ${
                  isActive ? "font-medium text-stone-700" : "text-stone-400"
                }`}
              >
                {phase.name}
              </span>
              <div className="flex-1">
                <ProgressBar percent={pct} />
              </div>
              <span className="text-[10px] text-stone-400 w-12 text-right">
                {phase.completed}/{phase.total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProjectProgressStrip({ progress, filterProject }: Props) {
  if (progress.length === 0) return null;

  if (filterProject) {
    const project = progress.find((p) => p.id === filterProject);
    if (!project) return null;
    return (
      <div className="mb-4">
        <ExpandedCard project={project} />
      </div>
    );
  }

  return (
    <div className="mb-4 flex gap-3 overflow-x-auto pb-1">
      {progress.map((project) => (
        <CompactCard key={project.id} project={project} />
      ))}
    </div>
  );
}
