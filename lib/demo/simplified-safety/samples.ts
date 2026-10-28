import type { ClarifyingAnswers, ExtractionResult } from "./types";

export type SampleImage = {
  id: string;
  name: string;
  description: string;
  kind: "satellite" | "blueprint";
  imagePath: string;
  defaultAnswers: ClarifyingAnswers;
  extraction: ExtractionResult;
};

const warehouseDefaults: ClarifyingAnswers = {
  roofProfile: "flat",
  pitchDegrees: 0,
  parapetHeightIn: 12,
  knownDimensionFt: 180,
  knownDimensionLabel: "Long edge (North / South)",
  mountingType: "non_penetrating",
  permanence: "permanent",
  finish: "galvanized",
};

const retailDefaults: ClarifyingAnswers = {
  roofProfile: "flat",
  pitchDegrees: 2,
  parapetHeightIn: 8,
  knownDimensionFt: 110,
  knownDimensionLabel: "Longest outer edge (south / west run)",
  mountingType: "non_penetrating",
  permanence: "permanent",
  finish: "galvanized",
};

export const SAMPLES: SampleImage[] = [
  {
    id: "warehouse-satellite",
    name: "Warehouse roof — satellite",
    description: "Rectangular low-slope membrane warehouse with RTUs, skylights, and a roof hatch.",
    kind: "satellite",
    imagePath: "/demo/simplified-safety/samples/warehouse-satellite.png",
    defaultAnswers: warehouseDefaults,
    extraction: {
      sampleId: "warehouse-satellite",
      source: "precomputed",
      title: "Warehouse roof — satellite takeoff",
      summary:
        "Rectangular low-slope roof ~180 ft × 120 ft. Unprotected perimeter needs KeeGuard. Six skylights and one roof hatch require opening protection. Six RTUs noted as obstacles (no product added).",
      assumptions: [
        "Scale calibrated from labeled 180 ft long edge on the sample illustration.",
        "Parapet appears ≤21 in; midrail required on full KeeGuard runs.",
        "All four edges treated as unprotected (no adjacent higher roof).",
        "Hatch assumed to be the primary ladder access point.",
        "RTUs are obstacles only — not fall hazards requiring product.",
      ],
      roofOutline: [
        { x: 0.033, y: 0.089 },
        { x: 0.967, y: 0.089 },
        { x: 0.967, y: 0.911 },
        { x: 0.033, y: 0.911 },
      ],
      perimeterFt: 600,
      edgeLengthsFt: [180, 120, 180, 120],
      estimatedAreaSqFt: 21600,
      scale: {
        pixelsPerFoot: 1200 / 180,
        basis: "Sample label: long edge = 180 ft",
      },
      features: [
        {
          id: "e1",
          kind: "edge",
          label: "North edge — 180 ft",
          bbox: { x: 0.05, y: 0.07, w: 0.9, h: 0.05 },
          lengthFt: 180,
          confidence: 0.94,
        },
        {
          id: "e2",
          kind: "edge",
          label: "East edge — 120 ft",
          bbox: { x: 0.93, y: 0.1, w: 0.05, h: 0.8 },
          lengthFt: 120,
          confidence: 0.93,
        },
        {
          id: "e3",
          kind: "edge",
          label: "South edge — 180 ft",
          bbox: { x: 0.05, y: 0.88, w: 0.9, h: 0.05 },
          lengthFt: 180,
          confidence: 0.94,
        },
        {
          id: "e4",
          kind: "edge",
          label: "West edge — 120 ft",
          bbox: { x: 0.02, y: 0.1, w: 0.05, h: 0.8 },
          lengthFt: 120,
          confidence: 0.93,
        },
        {
          id: "p1",
          kind: "parapet",
          label: "Low parapet (~12 in)",
          bbox: { x: 0.03, y: 0.08, w: 0.94, h: 0.03 },
          heightIn: 12,
          notes: "Below 21 in — midrail required on guardrail",
          confidence: 0.72,
        },
        {
          id: "h1",
          kind: "hatch",
          label: "Roof hatch ~36×54 in",
          bbox: { x: 0.46, y: 0.7, w: 0.08, h: 0.1 },
          widthFt: 3,
          lengthFt: 4.5,
          confidence: 0.88,
        },
        {
          id: "a1",
          kind: "access",
          label: "Ladder access (south)",
          bbox: { x: 0.47, y: 0.88, w: 0.06, h: 0.06 },
          confidence: 0.8,
        },
        ...[0, 1, 2, 3, 4, 5].map((i) => {
          const cols = [0.766, 0.866];
          const rows = [0.222, 0.378, 0.533];
          const x = cols[i % 2];
          const y = rows[Math.floor(i / 2)];
          return {
            id: `sk${i + 1}`,
            kind: "skylight" as const,
            label: `Skylight SK-${i + 1} ~4×6 ft`,
            bbox: { x, y, w: 0.06, h: 0.1 },
            widthFt: 4,
            lengthFt: 6,
            confidence: 0.86,
          };
        }),
        ...[
          [0.15, 0.2],
          [0.317, 0.2],
          [0.483, 0.2],
          [0.65, 0.2],
          [0.15, 0.578],
          [0.317, 0.578],
        ].map((xy, i) => ({
          id: `hv${i + 1}`,
          kind: "hvac" as const,
          label: `RTU HVAC-${i + 1}`,
          bbox: { x: xy[0], y: xy[1], w: 0.075, h: 0.078 },
          confidence: 0.9,
        })),
      ],
    },
  },
  {
    id: "warehouse-blueprint",
    name: "Warehouse roof — blueprint",
    description: "Dimensioned roof plan with HVAC, skylights, hatch, and ladder callouts.",
    kind: "blueprint",
    imagePath: "/demo/simplified-safety/samples/warehouse-blueprint.png",
    defaultAnswers: warehouseDefaults,
    extraction: {
      sampleId: "warehouse-blueprint",
      source: "precomputed",
      title: "Warehouse roof — blueprint takeoff",
      summary:
        "Plan shows 180'-0\" × 120'-0\" roof. Six RTUs, six skylights, one hatch, ladder access at south. Perimeter 600 lf for KeeGuard; openings require Kee Dome / hatch rails.",
      assumptions: [
        "Scale taken from plan dimensions 180'-0\" and 120'-0\".",
        "Parapet note on drawing: ~12 in (confirm on site).",
        "Hatch labeled 36\"×54\" — mapped to nearest Kee Dome hatch kit.",
        "Ladder access at south edge needs a self-closing gate in the perimeter run.",
      ],
      // Outline matches regenerated blueprint building box (100,90)–(1080,760) on 1200×900
      roofOutline: [
        { x: 100 / 1200, y: 90 / 900 },
        { x: 1080 / 1200, y: 90 / 900 },
        { x: 1080 / 1200, y: 760 / 900 },
        { x: 100 / 1200, y: 760 / 900 },
      ],
      perimeterFt: 600,
      edgeLengthsFt: [180, 120, 180, 120],
      estimatedAreaSqFt: 21600,
      scale: {
        pixelsPerFoot: 980 / 180,
        basis: "Plan dimension 180'-0\"",
      },
      features: [
        {
          id: "e1",
          kind: "edge",
          label: "North — 180'-0\"",
          bbox: { x: 100 / 1200, y: 80 / 900, w: 980 / 1200, h: 20 / 900 },
          lengthFt: 180,
          confidence: 0.98,
        },
        {
          id: "e2",
          kind: "edge",
          label: "East — 120'-0\"",
          bbox: { x: 1070 / 1200, y: 90 / 900, w: 20 / 1200, h: 670 / 900 },
          lengthFt: 120,
          confidence: 0.98,
        },
        {
          id: "e3",
          kind: "edge",
          label: "South — 180'-0\"",
          bbox: { x: 100 / 1200, y: 750 / 900, w: 980 / 1200, h: 20 / 900 },
          lengthFt: 180,
          confidence: 0.98,
        },
        {
          id: "e4",
          kind: "edge",
          label: "West — 120'-0\"",
          bbox: { x: 90 / 1200, y: 90 / 900, w: 20 / 1200, h: 670 / 900 },
          lengthFt: 120,
          confidence: 0.98,
        },
        {
          id: "p1",
          kind: "parapet",
          label: "Parapet ~12 in (per note)",
          bbox: { x: 100 / 1200, y: 90 / 900, w: 980 / 1200, h: 12 / 900 },
          heightIn: 12,
          confidence: 0.85,
        },
        {
          id: "h1",
          kind: "hatch",
          label: "HATCH 36\"×54\"",
          bbox: { x: 520 / 1200, y: 580 / 900, w: 100 / 1200, h: 100 / 900 },
          widthFt: 3,
          lengthFt: 4.5,
          confidence: 0.96,
        },
        {
          id: "a1",
          kind: "access",
          label: "LAD — ladder access",
          bbox: { x: 540 / 1200, y: 760 / 900, w: 80 / 1200, h: 30 / 900 },
          confidence: 0.92,
        },
        ...[0, 1, 2, 3, 4, 5].map((i) => {
          const cols = [800, 920];
          const rows = [180, 320, 460];
          const x = cols[i % 2];
          const y = rows[Math.floor(i / 2)];
          return {
            id: `sk${i + 1}`,
            kind: "skylight" as const,
            label: `SK-${i + 1}`,
            bbox: { x: x / 1200, y: y / 900, w: 80 / 1200, h: 100 / 900 },
            widthFt: 4,
            lengthFt: 6,
            confidence: 0.95,
          };
        }),
        ...[
          [160, 160],
          [320, 160],
          [480, 160],
          [640, 160],
          [160, 440],
          [320, 440],
        ].map((xy, i) => ({
          id: `hv${i + 1}`,
          kind: "hvac" as const,
          label: `HVAC-${i + 1}`,
          bbox: { x: xy[0] / 1200, y: xy[1] / 900, w: 100 / 1200, h: 80 / 900 },
          confidence: 0.97,
        })),
      ],
    },
  },
  {
    id: "retail-satellite",
    name: "Retail roof — L-shape satellite",
    description: "L-shaped retail / office roof with four RTUs, two skylights, and a hatch.",
    kind: "satellite",
    imagePath: "/demo/simplified-safety/samples/retail-satellite.png",
    defaultAnswers: retailDefaults,
    extraction: {
      sampleId: "retail-satellite",
      source: "precomputed",
      title: "L-shaped retail roof — satellite takeoff",
      summary:
        "L-plan roof: ~100×70 ft main plus ~50×40 ft wing. Perimeter ≈ 420 lf. Two skylights, one hatch, four RTUs. Low parapet on most edges.",
      assumptions: [
        "Scale from labeled ~100 ft main long edge.",
        "Inside corner of L does not need guardrail (no fall exposure).",
        "Outer perimeter only is guarded.",
        "Pitch assumed ≤2° (KeeGuard freestanding limit is 5°).",
      ],
      roofOutline: [
        { x: 0.167, y: 0.167 },
        { x: 0.75, y: 0.167 },
        { x: 0.75, y: 0.5 },
        { x: 0.458, y: 0.5 },
        { x: 0.458, y: 0.778 },
        { x: 0.167, y: 0.778 },
      ],
      perimeterFt: 420,
      edgeLengthsFt: [100, 70, 50, 40, 50, 110],
      estimatedAreaSqFt: 9000,
      scale: {
        pixelsPerFoot: 700 / 100,
        basis: "Sample label: main wing ≈ 100 ft",
      },
      features: [
        {
          id: "e1",
          kind: "edge",
          label: "North main — ~100 ft",
          bbox: { x: 0.17, y: 0.15, w: 0.58, h: 0.04 },
          lengthFt: 100,
          confidence: 0.9,
        },
        {
          id: "e2",
          kind: "edge",
          label: "East short — ~70 ft",
          bbox: { x: 0.73, y: 0.17, w: 0.04, h: 0.33 },
          lengthFt: 70,
          confidence: 0.88,
        },
        {
          id: "e3",
          kind: "edge",
          label: "South wing — ~110 ft total outer",
          bbox: { x: 0.17, y: 0.76, w: 0.29, h: 0.04 },
          lengthFt: 110,
          confidence: 0.85,
        },
        {
          id: "p1",
          kind: "parapet",
          label: "Low parapet ~8 in",
          bbox: { x: 0.17, y: 0.16, w: 0.57, h: 0.025 },
          heightIn: 8,
          confidence: 0.7,
        },
        {
          id: "h1",
          kind: "hatch",
          label: "Roof hatch",
          bbox: { x: 0.208, y: 0.667, w: 0.05, h: 0.067 },
          widthFt: 3,
          lengthFt: 3.5,
          confidence: 0.84,
        },
        {
          id: "a1",
          kind: "access",
          label: "Hatch access (west wing)",
          bbox: { x: 0.2, y: 0.72, w: 0.06, h: 0.05 },
          confidence: 0.78,
        },
        {
          id: "sk1",
          kind: "skylight",
          label: "Skylight SK-1",
          bbox: { x: 0.583, y: 0.311, w: 0.05, h: 0.089 },
          widthFt: 4,
          lengthFt: 5,
          confidence: 0.87,
        },
        {
          id: "sk2",
          kind: "skylight",
          label: "Skylight SK-2",
          bbox: { x: 0.667, y: 0.311, w: 0.05, h: 0.089 },
          widthFt: 4,
          lengthFt: 5,
          confidence: 0.87,
        },
        ...[
          [0.233, 0.244],
          [0.35, 0.244],
          [0.542, 0.244],
          [0.233, 0.578],
        ].map((xy, i) => ({
          id: `hv${i + 1}`,
          kind: "hvac" as const,
          label: `RTU HVAC-${i + 1}`,
          bbox: { x: xy[0], y: xy[1], w: 0.067, h: 0.067 },
          confidence: 0.9,
        })),
      ],
    },
  },
];

export function getSample(id: string): SampleImage | undefined {
  return SAMPLES.find((s) => s.id === id);
}

export const DEFAULT_ANSWERS: ClarifyingAnswers = {
  roofProfile: "flat",
  pitchDegrees: 0,
  parapetHeightIn: 12,
  knownDimensionFt: null,
  knownDimensionLabel: "Longest measured edge",
  mountingType: "non_penetrating",
  permanence: "permanent",
  finish: "galvanized",
};

/** Simulated extraction used when a live upload has no API key. */
export function buildSimulatedExtraction(fileName: string): ExtractionResult {
  return {
    source: "simulated",
    title: `Simulated takeoff — ${fileName || "uploaded image"}`,
    summary:
      "No vision API key is configured, so this is a simulated extraction for demo purposes. Perimeter assumed at 400 lf on a rectangular low-slope roof with 2 skylights, 1 hatch, and 3 RTUs.",
    assumptions: [
      "SIMULATED — not derived from the uploaded pixels.",
      "Assumed rectangular roof 120 ft × 80 ft (perimeter 400 lf).",
      "Assumed 2 skylights (~4×6 ft), 1 hatch (36×40 in), 1 ladder access, parapet 12 in.",
      "Set a known dimension in the next step to rescale, or use a preloaded sample for a verified takeoff.",
    ],
    roofOutline: [
      { x: 0.1, y: 0.15 },
      { x: 0.9, y: 0.15 },
      { x: 0.9, y: 0.85 },
      { x: 0.1, y: 0.85 },
    ],
    perimeterFt: 400,
    edgeLengthsFt: [120, 80, 120, 80],
    estimatedAreaSqFt: 9600,
    scale: {
      pixelsPerFoot: 10,
      basis: "Simulated default (no calibration)",
    },
    features: [
      {
        id: "e1",
        kind: "edge",
        label: "North — 120 ft (simulated)",
        bbox: { x: 0.1, y: 0.12, w: 0.8, h: 0.05 },
        lengthFt: 120,
        confidence: 0.4,
      },
      {
        id: "e2",
        kind: "edge",
        label: "East — 80 ft (simulated)",
        bbox: { x: 0.88, y: 0.15, w: 0.05, h: 0.7 },
        lengthFt: 80,
        confidence: 0.4,
      },
      {
        id: "e3",
        kind: "edge",
        label: "South — 120 ft (simulated)",
        bbox: { x: 0.1, y: 0.83, w: 0.8, h: 0.05 },
        lengthFt: 120,
        confidence: 0.4,
      },
      {
        id: "e4",
        kind: "edge",
        label: "West — 80 ft (simulated)",
        bbox: { x: 0.07, y: 0.15, w: 0.05, h: 0.7 },
        lengthFt: 80,
        confidence: 0.4,
      },
      {
        id: "p1",
        kind: "parapet",
        label: "Parapet ~12 in (assumed)",
        bbox: { x: 0.1, y: 0.14, w: 0.8, h: 0.03 },
        heightIn: 12,
        confidence: 0.3,
      },
      {
        id: "h1",
        kind: "hatch",
        label: "Roof hatch (simulated)",
        bbox: { x: 0.45, y: 0.65, w: 0.08, h: 0.1 },
        widthFt: 3,
        lengthFt: 3.5,
        confidence: 0.35,
      },
      {
        id: "a1",
        kind: "access",
        label: "Access opening (simulated)",
        bbox: { x: 0.46, y: 0.82, w: 0.08, h: 0.06 },
        confidence: 0.35,
      },
      {
        id: "sk1",
        kind: "skylight",
        label: "Skylight 1 (simulated)",
        bbox: { x: 0.65, y: 0.3, w: 0.08, h: 0.1 },
        widthFt: 4,
        lengthFt: 6,
        confidence: 0.35,
      },
      {
        id: "sk2",
        kind: "skylight",
        label: "Skylight 2 (simulated)",
        bbox: { x: 0.76, y: 0.3, w: 0.08, h: 0.1 },
        widthFt: 4,
        lengthFt: 6,
        confidence: 0.35,
      },
      {
        id: "hv1",
        kind: "hvac",
        label: "RTU 1 (simulated)",
        bbox: { x: 0.2, y: 0.3, w: 0.08, h: 0.08 },
        confidence: 0.35,
      },
      {
        id: "hv2",
        kind: "hvac",
        label: "RTU 2 (simulated)",
        bbox: { x: 0.32, y: 0.3, w: 0.08, h: 0.08 },
        confidence: 0.35,
      },
      {
        id: "hv3",
        kind: "hvac",
        label: "RTU 3 (simulated)",
        bbox: { x: 0.2, y: 0.5, w: 0.08, h: 0.08 },
        confidence: 0.35,
      },
    ],
  };
}
