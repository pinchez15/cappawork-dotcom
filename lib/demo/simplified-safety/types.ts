export type PriceKind = "published" | "estimated";

export type MountingType = "non_penetrating" | "fixed";
export type Permanence = "permanent" | "temporary";
export type RoofProfile = "flat" | "pitched";
export type FinishColor = "galvanized" | "safety_yellow" | "ral_custom";

export type FeatureKind =
  | "edge"
  | "hatch"
  | "skylight"
  | "hvac"
  | "access"
  | "parapet";

export type RoofFeature = {
  id: string;
  kind: FeatureKind;
  label: string;
  /** Normalized bbox 0–1 relative to image width/height */
  bbox: { x: number; y: number; w: number; h: number };
  /** Optional length in feet (edges) or area (openings) */
  lengthFt?: number;
  widthFt?: number;
  heightIn?: number;
  notes?: string;
  confidence: number;
};

export type ExtractionResult = {
  sampleId?: string;
  source: "precomputed" | "live_ai" | "simulated";
  title: string;
  summary: string;
  assumptions: string[];
  roofOutline: { x: number; y: number }[];
  perimeterFt: number;
  edgeLengthsFt: number[];
  estimatedAreaSqFt: number;
  features: RoofFeature[];
  scale: {
    pixelsPerFoot: number;
    basis: string;
  };
};

export type ClarifyingAnswers = {
  roofProfile: RoofProfile;
  pitchDegrees: number;
  parapetHeightIn: number;
  knownDimensionFt: number | null;
  knownDimensionLabel: string;
  mountingType: MountingType;
  permanence: Permanence;
  finish: FinishColor;
};

export type CatalogProduct = {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category:
    | "guardrail_section"
    | "upright"
    | "counterweight"
    | "gate"
    | "hatch_rail"
    | "skylight_guard"
    | "skylight_screen"
    | "accessory";
  unit: "ea" | "lf" | "kit";
  /** Published list or estimated unit price in USD */
  unitPrice: number;
  priceKind: PriceKind;
  sourceUrl: string;
  sourceLabel: string;
  notes?: string;
  /** Standard length in feet when applicable */
  sectionLengthFt?: number;
};

export type OshaCitation = {
  id: string;
  cfr: string;
  title: string;
  summary: string;
};

export type QuoteLineItem = {
  id: string;
  productId: string;
  sku: string;
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
  priceKind: PriceKind;
  sourceUrl: string;
  osha: OshaCitation[];
  rationale: string;
};

export type QuoteResult = {
  projectName: string;
  generatedAt: string;
  perimeterFt: number;
  guardedPerimeterFt: number;
  answers: ClarifyingAnswers;
  scaleFactor: number;
  lineItems: QuoteLineItem[];
  subtotal: number;
  publishedSubtotal: number;
  estimatedSubtotal: number;
  assumptions: string[];
  disclaimer: string;
};
