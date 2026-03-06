"use client";

import { Flag } from "lucide-react";

const PIPELINE_TARGET = 2_000_000;

type Props = {
  activeValue: number;
  weightedValue: number;
  wonValue: number;
};

export function PipelineGoal({ activeValue, weightedValue, wonValue }: Props) {
  const totalPipeline = activeValue + wonValue;
  const pctTotal = Math.min(
    Math.round((totalPipeline / PIPELINE_TARGET) * 100),
    100
  );
  const pctWon = Math.min(
    Math.round((wonValue / PIPELINE_TARGET) * 100),
    100
  );
  const pctWeighted = Math.min(
    Math.round((weightedValue / PIPELINE_TARGET) * 100),
    100
  );

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-bold text-stone-900">
            $2M Pipeline Goal
          </span>
        </div>
        <span className="text-sm font-bold text-stone-900">
          ${totalPipeline.toLocaleString()}{" "}
          <span className="text-stone-400 font-normal">
            / $2,000,000
          </span>
        </span>
      </div>

      {/* Stacked progress bar */}
      <div className="relative h-4 bg-stone-100 rounded-full overflow-hidden">
        {/* Total pipeline (lightest) */}
        <div
          className="absolute inset-y-0 left-0 bg-blue-100 transition-all duration-500"
          style={{ width: `${pctTotal}%` }}
        />
        {/* Weighted value (medium) */}
        <div
          className="absolute inset-y-0 left-0 bg-blue-400 transition-all duration-500"
          style={{ width: `${pctWeighted}%` }}
        />
        {/* Won (darkest) */}
        <div
          className="absolute inset-y-0 left-0 bg-green-500 transition-all duration-500"
          style={{ width: `${pctWon}%` }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-[11px] text-stone-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          Won ${wonValue.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
          Weighted ${weightedValue.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-100 inline-block" />
          Total Pipeline ${totalPipeline.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
