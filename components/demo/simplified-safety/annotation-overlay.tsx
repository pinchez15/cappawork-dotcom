"use client";

import type { ExtractionResult, RoofFeature } from "@/lib/demo/simplified-safety/types";

const KIND_COLOR: Record<RoofFeature["kind"], string> = {
  edge: "#1d4ed8",
  parapet: "#7c3aed",
  hatch: "#c2410c",
  skylight: "#0369a1",
  hvac: "#57534e",
  access: "#15803d",
};

type Props = {
  imageSrc: string;
  extraction: ExtractionResult;
  alt: string;
};

export function AnnotationOverlay({ imageSrc, extraction, alt }: Props) {
  const outline = extraction.roofOutline;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageSrc} alt={alt} className="block h-auto w-full" />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        aria-hidden
      >
        {outline.length >= 3 && (
          <polygon
            points={outline.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="rgba(29, 78, 216, 0.08)"
            stroke="#1d4ed8"
            strokeWidth={0.004}
          />
        )}
        {extraction.features.map((f, idx) => {
          const color = KIND_COLOR[f.kind];
          return (
            <g key={f.id}>
              <rect
                x={f.bbox.x}
                y={f.bbox.y}
                width={f.bbox.w}
                height={f.bbox.h}
                fill={`${color}22`}
                stroke={color}
                strokeWidth={0.003}
              />
              <circle
                cx={f.bbox.x + 0.012}
                cy={f.bbox.y + 0.012}
                r={0.012}
                fill={color}
              />
              <text
                x={f.bbox.x + 0.012}
                y={f.bbox.y + 0.016}
                textAnchor="middle"
                fontSize={0.018}
                fill="#fff"
                fontFamily="system-ui, sans-serif"
                fontWeight={700}
              >
                {idx + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function FeatureLegend({ features }: { features: RoofFeature[] }) {
  return (
    <ol className="space-y-2 text-sm">
      {features.map((f, idx) => (
        <li key={f.id} className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: KIND_COLOR[f.kind] }}
          >
            {idx + 1}
          </span>
          <div className="min-w-0">
            <div className="font-medium text-stone-900">{f.label}</div>
            <div className="text-stone-500">
              {f.kind}
              {f.lengthFt != null ? ` · ${f.lengthFt} ft` : ""}
              {f.heightIn != null ? ` · ${f.heightIn} in` : ""}
              {" · "}
              {Math.round(f.confidence * 100)}% conf.
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
