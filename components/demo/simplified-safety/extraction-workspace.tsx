"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import {
  AnnotationOverlay,
  FeaturePanel,
  KIND_META,
  type LayerVisibility,
} from "./annotation-overlay";
import type { ExtractionResult } from "@/lib/demo/simplified-safety/types";

type Props = {
  imageSrc: string;
  imageName: string;
  extraction: ExtractionResult;
  sourceLabel: string;
  notice: string | null;
  onBack: () => void;
  onContinue: () => void;
};

export function ExtractionWorkspace({
  imageSrc,
  imageName,
  extraction,
  sourceLabel,
  notice,
  onBack,
  onContinue,
}: Props) {
  const [layers, setLayers] = useState<LayerVisibility>({
    edges: true,
    openings: true,
    equipment: true,
    labels: true,
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAssumptions, setShowAssumptions] = useState(false);

  const counts = useMemo(() => {
    const edges = extraction.features.filter((f) => f.kind === "edge").length;
    const openings = extraction.features.filter((f) =>
      ["hatch", "skylight", "access"].includes(f.kind),
    ).length;
    const equipment = extraction.features.filter((f) => f.kind === "hvac").length;
    return { edges, openings, equipment };
  }, [extraction.features]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Compact title row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-semibold text-stone-900">
              {extraction.title}
            </h2>
            <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
              {sourceLabel}
            </span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs text-stone-500">{extraction.summary}</p>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-stone-200 bg-white p-0.5 text-[11px]">
          {(
            [
              ["edges", "Edges"],
              ["openings", "Openings"],
              ["equipment", "RTUs"],
              ["labels", "Labels"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setLayers((l) => ({ ...l, [key]: !l[key] }))}
              className={`rounded px-2 py-1 font-medium transition ${
                layers[key]
                  ? "bg-stone-900 text-white"
                  : "text-stone-500 hover:bg-stone-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {notice}
        </div>
      )}

      {/* Drawing + inspector: fills remaining viewport */}
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="relative min-h-[420px] lg:min-h-0">
          <AnnotationOverlay
            imageSrc={imageSrc}
            extraction={extraction}
            alt={imageName}
            layers={layers}
            activeId={activeId}
            onHover={setActiveId}
          />
          <div className="pointer-events-none absolute bottom-2 left-2 z-[3] flex gap-2 rounded bg-white/90 px-2 py-1 text-[10px] text-stone-600 shadow-sm backdrop-blur">
            <LegendSwatch color={KIND_META.edge.color} label="Perimeter" />
            <LegendSwatch color={KIND_META.skylight.color} label="Opening" />
            <LegendSwatch color={KIND_META.hvac.color} label="RTU" dashed />
            <LegendSwatch color={KIND_META.parapet.color} label="Parapet" dashed />
          </div>
        </div>

        <aside className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-stone-200 bg-white">
          {/* Metrics strip */}
          <div className="grid grid-cols-2 gap-px border-b border-stone-200 bg-stone-100">
            <Metric label="Perimeter" value={`${extraction.perimeterFt.toLocaleString()} lf`} />
            <Metric
              label="Area"
              value={`${extraction.estimatedAreaSqFt.toLocaleString()} sf`}
            />
            <Metric
              label="Edges / openings"
              value={`${counts.edges} / ${counts.openings}`}
            />
            <Metric label="Scale" value={shortScale(extraction.scale.basis)} />
          </div>

          {/* Feature list scrolls inside the panel only */}
          <div className="min-h-0 flex-1 overflow-y-auto px-1 py-2">
            <FeaturePanel
              features={extraction.features}
              edgeSegmentsCount={extraction.edgeLengthsFt.length}
              activeId={activeId}
              onHover={setActiveId}
            />
          </div>

          <div className="border-t border-stone-200">
            <button
              type="button"
              onClick={() => setShowAssumptions((v) => !v)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-[11px] font-medium text-stone-600 hover:bg-stone-50"
            >
              Assumptions ({extraction.assumptions.length})
              {showAssumptions ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
            {showAssumptions && (
              <ul className="max-h-28 space-y-1 overflow-y-auto px-3 pb-2 text-[11px] text-stone-500">
                {extraction.assumptions.map((a) => (
                  <li key={a} className="list-disc ml-3">
                    {a}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-2 border-t border-stone-200 p-3">
            <button
              type="button"
              onClick={onBack}
              className="rounded-md border border-stone-300 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              Start over
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Confirm takeoff
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-stone-500">{label}</div>
      <div className="truncate font-mono text-sm font-semibold tabular-nums text-stone-900">
        {value}
      </div>
    </div>
  );
}

function LegendSwatch({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="inline-block h-0.5 w-3"
        style={{
          backgroundColor: dashed ? "transparent" : color,
          borderTop: dashed ? `1.5px dashed ${color}` : undefined,
        }}
      />
      {label}
    </span>
  );
}

function shortScale(basis: string) {
  if (basis.length <= 28) return basis;
  return `${basis.slice(0, 26)}…`;
}
