"use client";

import type { ExtractionResult, FeatureKind, RoofFeature } from "@/lib/demo/simplified-safety/types";

/** Drawing space matches sample imagery (1200×900). Keeps stroke widths uniform. */
const VW = 1200;
const VH = 900;

export const KIND_META: Record<
  FeatureKind,
  { color: string; label: string; group: "edges" | "openings" | "equipment" | "notes" }
> = {
  edge: { color: "#0B5FFF", label: "Edge", group: "edges" },
  parapet: { color: "#6D28D9", label: "Parapet", group: "notes" },
  hatch: { color: "#C2410C", label: "Hatch", group: "openings" },
  skylight: { color: "#0369A1", label: "Skylight", group: "openings" },
  access: { color: "#15803D", label: "Access", group: "openings" },
  hvac: { color: "#78716C", label: "RTU", group: "equipment" },
};

export type LayerVisibility = {
  edges: boolean;
  openings: boolean;
  equipment: boolean;
  labels: boolean;
};

type Props = {
  imageSrc: string;
  extraction: ExtractionResult;
  alt: string;
  layers: LayerVisibility;
  activeId: string | null;
  onHover: (id: string | null) => void;
};

function nx(x: number) {
  return x * VW;
}
function ny(y: number) {
  return y * VH;
}

function midpoint(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function edgeSegments(extraction: ExtractionResult) {
  const outline = extraction.roofOutline;
  if (outline.length < 2) return [];
  const edges = extraction.features.filter((f) => f.kind === "edge");
  return outline.map((p, i) => {
    const next = outline[(i + 1) % outline.length];
    const edge = edges[i];
    return {
      id: edge?.id ?? `edge-seg-${i}`,
      a: p,
      b: next,
      lengthFt: edge?.lengthFt ?? extraction.edgeLengthsFt[i],
      label: edge?.label ?? `Edge ${i + 1}`,
    };
  });
}

function Marker({
  x,
  y,
  n,
  color,
  active,
}: {
  x: number;
  y: number;
  n: string;
  color: string;
  active?: boolean;
}) {
  const r = active ? 11 : 9;
  return (
    <g>
      <circle cx={x} cy={y} r={r + 1.5} fill="#fff" />
      <circle cx={x} cy={y} r={r} fill={color} />
      <text
        x={x}
        y={y + 3.5}
        textAnchor="middle"
        fontSize={11}
        fill="#fff"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontWeight={700}
      >
        {n}
      </text>
    </g>
  );
}

export function AnnotationOverlay({
  imageSrc,
  extraction,
  alt,
  layers,
  activeId,
  onHover,
}: Props) {
  const segments = edgeSegments(extraction);
  const openings = extraction.features.filter((f) =>
    ["hatch", "skylight", "access"].includes(f.kind),
  );
  const equipment = extraction.features.filter((f) => f.kind === "hvac");
  const parapet = extraction.features.find((f) => f.kind === "parapet");
  const openingNumbers = new Map(
    openings.map((f, i) => [f.id, String(segments.length + i + 1)]),
  );

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden rounded-lg border border-stone-300 bg-[#D7DEE7]">
      <div className="absolute inset-2 sm:inset-3">
        {/*
          Image and SVG share the same box + 4:3 meet/contain, so stroke geometry
          stays registered to the drawing instead of stretching into fat boxes.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
            {extraction.roofOutline.length >= 3 && (
              <polygon
                points={extraction.roofOutline.map((p) => `${nx(p.x)},${ny(p.y)}`).join(" ")}
                fill="rgba(11, 95, 255, 0.03)"
                stroke="none"
              />
            )}

            {layers.edges &&
              segments.map((seg, i) => {
                const active = activeId === seg.id;
                const mid = midpoint(seg.a, seg.b);
                const dx = seg.b.x - seg.a.x;
                const dy = seg.b.y - seg.a.y;
                const isHoriz = Math.abs(dx) >= Math.abs(dy);
                // Outward normal (away from roof center ~0.5,0.5)
                const len = Math.hypot(dx, dy) || 1;
                let ox = -dy / len;
                let oy = dx / len;
                const toCenterX = 0.5 - mid.x;
                const toCenterY = 0.5 - mid.y;
                if (ox * toCenterX + oy * toCenterY > 0) {
                  ox = -ox;
                  oy = -oy;
                }
                const labelOffset = 0.042;
                const x1 = nx(seg.a.x);
                const y1 = ny(seg.a.y);
                const x2 = nx(seg.b.x);
                const y2 = ny(seg.b.y);
                const mx = nx(mid.x + ox * labelOffset);
                const my = ny(mid.y + oy * labelOffset);
                const markerX = nx(seg.a.x + ox * 0.018 + (isHoriz ? 0.018 : 0));
                const markerY = ny(seg.a.y + oy * 0.018 + (isHoriz ? 0 : 0.018));
                return (
                  <g
                    key={seg.id}
                    onMouseEnter={() => onHover(seg.id)}
                    onMouseLeave={() => onHover(null)}
                    className="cursor-pointer"
                  >
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="transparent"
                      strokeWidth={18}
                    />
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={active ? "#D97706" : "#0B5FFF"}
                      strokeWidth={active ? 3.5 : 2.25}
                      strokeLinecap="square"
                    />
                    {layers.labels && seg.lengthFt != null && (
                      <g>
                        <rect
                          x={mx - 26}
                          y={my - 9}
                          width={52}
                          height={18}
                          rx={2}
                          fill={active ? "#D97706" : "#0B5FFF"}
                        />
                        <text
                          x={mx}
                          y={my + 4}
                          textAnchor="middle"
                          fontSize={11}
                          fill="#fff"
                          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                          fontWeight={600}
                        >
                          {seg.lengthFt}&apos;
                        </text>
                      </g>
                    )}
                    {layers.labels && (
                      <Marker
                        x={markerX}
                        y={markerY}
                        n={String(i + 1)}
                        color={active ? "#D97706" : "#0B5FFF"}
                        active={active}
                      />
                    )}
                  </g>
                );
              })}

            {/* Parapet: dashed perimeter only — never a filled strip over the plan */}
            {layers.edges && parapet && extraction.roofOutline.length >= 3 && (
              <polygon
                points={extraction.roofOutline.map((p) => `${nx(p.x)},${ny(p.y)}`).join(" ")}
                fill="none"
                stroke={activeId === parapet.id ? "#D97706" : "#6D28D9"}
                strokeWidth={1.75}
                strokeDasharray="8 6"
                opacity={0.85}
                onMouseEnter={() => onHover(parapet.id)}
                onMouseLeave={() => onHover(null)}
              />
            )}

            {layers.openings &&
              openings.map((f) => {
                const color = KIND_META[f.kind].color;
                const active = activeId === f.id;
                const n = openingNumbers.get(f.id) ?? "";
                const x = nx(f.bbox.x);
                const y = ny(f.bbox.y);
                const w = f.bbox.w * VW;
                const h = f.bbox.h * VH;
                return (
                  <g
                    key={f.id}
                    onMouseEnter={() => onHover(f.id)}
                    onMouseLeave={() => onHover(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill={active ? `${color}22` : "none"}
                      stroke={active ? "#D97706" : color}
                      strokeWidth={active ? 2.5 : 1.75}
                    />
                    {layers.labels && (
                      <Marker
                        x={x + Math.min(14, w * 0.2)}
                        y={y + Math.min(14, h * 0.2)}
                        n={n}
                        color={active ? "#D97706" : color}
                        active={active}
                      />
                    )}
                  </g>
                );
              })}

            {layers.equipment &&
              equipment.map((f) => {
                const active = activeId === f.id;
                const x = nx(f.bbox.x);
                const y = ny(f.bbox.y);
                const w = f.bbox.w * VW;
                const h = f.bbox.h * VH;
                return (
                  <g
                    key={f.id}
                    onMouseEnter={() => onHover(f.id)}
                    onMouseLeave={() => onHover(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill="none"
                      stroke={active ? "#D97706" : "#A8A29E"}
                      strokeWidth={1.25}
                      strokeDasharray="5 4"
                    />
                  </g>
                );
              })}
        </svg>
      </div>
    </div>
  );
}

export function FeaturePanel({
  features,
  edgeSegmentsCount,
  activeId,
  onHover,
}: {
  features: RoofFeature[];
  edgeSegmentsCount: number;
  activeId: string | null;
  onHover: (id: string | null) => void;
}) {
  const edges = features.filter((f) => f.kind === "edge");
  const openings = features.filter((f) => ["hatch", "skylight", "access"].includes(f.kind));
  const equipment = features.filter((f) => f.kind === "hvac");
  const notes = features.filter((f) => f.kind === "parapet");

  function Row({ f, index }: { f: RoofFeature; index: number | string }) {
    const meta = KIND_META[f.kind];
    const active = activeId === f.id;
    return (
      <button
        type="button"
        onMouseEnter={() => onHover(f.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(f.id)}
        onBlur={() => onHover(null)}
        className={`flex w-full items-start gap-2 rounded px-2 py-1.5 text-left text-[13px] transition ${
          active ? "bg-amber-50 ring-1 ring-amber-300" : "hover:bg-stone-50"
        }`}
      >
        <span
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[10px] font-bold text-white"
          style={{ backgroundColor: meta.color }}
        >
          {index}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-stone-900">{f.label}</span>
          <span className="block text-[11px] text-stone-500">
            {meta.label}
            {f.lengthFt != null ? ` · ${f.lengthFt} ft` : ""}
            {f.heightIn != null ? ` · ${f.heightIn}"` : ""}
          </span>
        </span>
      </button>
    );
  }

  const primaryOpenings = openings.filter((f) => f.kind !== "skylight");
  const skylights = openings.filter((f) => f.kind === "skylight");
  let nextIndex = edges.length + 1;

  return (
    <div className="space-y-3 text-sm">
      <Group title={`Edges (${edges.length || edgeSegmentsCount})`}>
        {edges.map((f, i) => (
          <Row key={f.id} f={f} index={i + 1} />
        ))}
      </Group>
      <Group title={`Openings (${openings.length})`}>
        {primaryOpenings.map((f) => {
          const idx = nextIndex++;
          return <Row key={f.id} f={f} index={idx} />;
        })}
        {skylights.length > 0 && (
          <SkylightSummary
            items={skylights}
            startIndex={nextIndex}
            activeId={activeId}
            onHover={onHover}
          />
        )}
      </Group>
      {notes.length > 0 && (
        <Group title="Conditions">
          {notes.map((f) => (
            <Row key={f.id} f={f} index="P" />
          ))}
        </Group>
      )}
      {equipment.length > 0 && (
        <details className="group/rtu">
          <summary className="cursor-pointer list-none px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400 hover:text-stone-600">
            Obstacles · RTUs ({equipment.length}) — click to expand
          </summary>
          <div className="mt-0.5 space-y-0.5">
            {equipment.map((f) => (
              <Row key={f.id} f={f} index="·" />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function SkylightSummary({
  items,
  startIndex,
  activeId,
  onHover,
}: {
  items: RoofFeature[];
  startIndex: number;
  activeId: string | null;
  onHover: (id: string | null) => void;
}) {
  const active = items.some((f) => f.id === activeId);
  const end = startIndex + items.length - 1;
  return (
    <div
      className={`rounded px-2 py-1.5 ${active ? "bg-amber-50 ring-1 ring-amber-300" : ""}`}
      onMouseEnter={() => onHover(items[0]?.id ?? null)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-start gap-2 text-[13px]">
        <span
          className="mt-0.5 flex h-5 min-w-5 shrink-0 items-center justify-center rounded px-1 font-mono text-[10px] font-bold text-white"
          style={{ backgroundColor: KIND_META.skylight.color }}
        >
          {startIndex}–{end}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium text-stone-900">
            Skylights ×{items.length}
          </span>
          <span className="block text-[11px] text-stone-500">
            {items[0]?.widthFt ?? 4}×{items[0]?.lengthFt ?? 6} ft typ. · Kee Dome / screen each
          </span>
        </span>
      </div>
    </div>
  );
}

function Group({
  title,
  children,
  muted,
}: {
  title: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div>
      <div
        className={`mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${
          muted ? "text-stone-400" : "text-stone-500"
        }`}
      >
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
