import { getProduct } from "./catalog";
import { oshaForGate, oshaForGuardrail, oshaForHatch, oshaForSkylight } from "./osha";
import type {
  ClarifyingAnswers,
  ExtractionResult,
  QuoteLineItem,
  QuoteResult,
} from "./types";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** Greedy pack of perimeter into 21 / 16 / 10 ft KeeGuard kits. */
function packGuardrailKits(perimeterFt: number): { productId: string; qty: number }[] {
  let remaining = Math.max(0, Math.ceil(perimeterFt));
  const kits: { productId: string; len: number }[] = [
    { productId: "kg-21ft-kit", len: 21 },
    { productId: "kg-16ft-kit", len: 16 },
    { productId: "kg-10ft-kit", len: 10 },
  ];
  const counts = new Map<string, number>();

  for (const kit of kits) {
    const n = Math.floor(remaining / kit.len);
    if (n > 0) {
      counts.set(kit.productId, n);
      remaining -= n * kit.len;
    }
  }
  if (remaining > 0) {
    counts.set("kg-10ft-kit", (counts.get("kg-10ft-kit") ?? 0) + 1);
  }

  return [...counts.entries()].map(([productId, qty]) => ({ productId, qty }));
}

function pickHatchKit(widthFt?: number, lengthFt?: number): string {
  const wIn = (widthFt ?? 3) * 12;
  const lIn = (lengthFt ?? 3.5) * 12;
  const max = Math.max(wIn, lIn);
  const min = Math.min(wIn, lIn);
  if (min <= 36 && max <= 40) return "keehatch-36x40";
  if (min <= 36 && max <= 52) return "keehatch-36x52";
  return "keehatch-52x52";
}

function pickSkylightProduct(preferScreens: boolean): string {
  return preferScreens ? "skylight-screen-sts" : "keedome-8x8";
}

function lineFromProduct(
  productId: string,
  qty: number,
  osha: ReturnType<typeof oshaForGuardrail>,
  rationale: string,
): QuoteLineItem {
  const p = getProduct(productId);
  const unitPrice = p.unitPrice;
  return {
    id: `${productId}-${rationale.slice(0, 12)}`,
    productId: p.id,
    sku: p.sku,
    name: p.name,
    qty,
    unit: p.unit,
    unitPrice,
    lineTotal: round2(unitPrice * qty),
    priceKind: p.priceKind,
    sourceUrl: p.sourceUrl,
    osha,
    rationale,
  };
}

/**
 * Deterministic rules engine: extraction + clarifying answers → priced BOM.
 * Mirrors the proposal: AI extracts, rules decide parts and OSHA citations.
 */
export function buildQuote(
  extraction: ExtractionResult,
  answers: ClarifyingAnswers,
  projectName = "Simplified Safety — Plan-to-Order Demo",
): QuoteResult {
  const basePerimeter = extraction.perimeterFt;
  const baseLongEdge = Math.max(...extraction.edgeLengthsFt, 1);

  // Recalibrate lengths if the rep provides a known dimension.
  let scaleFactor = 1;
  if (answers.knownDimensionFt && answers.knownDimensionFt > 0) {
    scaleFactor = answers.knownDimensionFt / baseLongEdge;
  }

  const perimeterFt = round2(basePerimeter * scaleFactor);
  const parapetOk = answers.parapetHeightIn >= 21;
  // If parapet ≥ 21 in, midrail may not be required — still quote full KeeGuard
  // as perimeter protection unless parapet itself meets guardrail height (39–45 in).
  const parapetIsGuardrail = answers.parapetHeightIn >= 39;
  const guardedPerimeterFt = parapetIsGuardrail ? 0 : perimeterFt;

  const lineItems: QuoteLineItem[] = [];
  const assumptions = [
    ...extraction.assumptions,
    `Scale factor applied: ${scaleFactor.toFixed(3)}× (known dimension ${
      answers.knownDimensionFt ? `${answers.knownDimensionFt} ft` : "not set — using extracted lengths"
    }).`,
    `Roof profile: ${answers.roofProfile}${
      answers.roofProfile === "pitched" ? ` @ ${answers.pitchDegrees}°` : ""
    }. KeeGuard freestanding is rated to 5°; steeper roofs need metal-roof / fixed bases.`,
    `Parapet height: ${answers.parapetHeightIn} in.${
      parapetIsGuardrail
        ? " Treated as meeting guardrail height — perimeter KeeGuard omitted."
        : parapetOk
          ? " ≥21 in so midrail may be waived in places; full KeeGuard still quoted for unprotected edges."
          : " <21 in — midrail required on KeeGuard runs (1910.29(b)(2))."
    }`,
    `Mounting: ${
      answers.mountingType === "non_penetrating"
        ? "non-penetrating counterweighted KeeGuard"
        : "fixed / top-fix (requires engineered base selection)"
    }.`,
    `Permanence: ${answers.permanence}. Finish: ${answers.finish}.`,
  ];

  if (answers.pitchDegrees > 5 && answers.mountingType === "non_penetrating") {
    assumptions.push(
      "WARNING: Pitch >5° exceeds standard KeeGuard freestanding rating — confirm KeeGuard Metal Roof / S5U clamps with SSI engineering.",
    );
  }

  // 1) Perimeter guardrail
  if (guardedPerimeterFt > 0) {
    if (answers.mountingType === "non_penetrating") {
      const kits = packGuardrailKits(guardedPerimeterFt);
      for (const k of kits) {
        lineItems.push(
          lineFromProduct(
            k.productId,
            k.qty,
            oshaForGuardrail(),
            `Perimeter protection for ${guardedPerimeterFt} lf of unprotected roof edge (packed into standard KeeGuard kit lengths).`,
          ),
        );
      }
    } else {
      // Fixed: quote pipe + bases as a simplified fixed-mount BOM
      const uprights = Math.ceil(guardedPerimeterFt / 8) + 4; // ~8 ft spacing + corners
      const pipe21 = Math.ceil((guardedPerimeterFt * 2) / 21); // top + mid
      lineItems.push(
        lineFromProduct(
          "kg-pipe-21",
          pipe21,
          oshaForGuardrail(),
          `Fixed-mount top/mid rail stock for ${guardedPerimeterFt} lf.`,
        ),
      );
      lineItems.push(
        lineFromProduct(
          "kg-upright",
          uprights,
          oshaForGuardrail(),
          `Fixed uprights at ~8 ft spacing along ${guardedPerimeterFt} lf.`,
        ),
      );
      lineItems.push(
        lineFromProduct(
          "kk-64-8",
          uprights,
          oshaForGuardrail(),
          "Fixed vertical railing bases for uprights (parapet / deck fix).",
        ),
      );
    }
  }

  // 2) Hatches
  const hatches = extraction.features.filter((f) => f.kind === "hatch");
  for (const h of hatches) {
    const pid = pickHatchKit(h.widthFt, h.lengthFt);
    lineItems.push(
      lineFromProduct(
        pid,
        1,
        oshaForHatch(),
        `${h.label}: hatchway guardrail with self-closing gate.`,
      ),
    );
  }

  // 3) Access gates on perimeter (if hatch kit doesn't already cover, and access exists)
  const accesses = extraction.features.filter((f) => f.kind === "access");
  const gateProduct = answers.finish === "safety_yellow" ? "keegate-yellow" : "keegate-galv";
  // Only add a separate perimeter gate when there is ladder access AND we didn't
  // already cover the hatch with a gated hatch kit for that same location.
  // Demo rule: one perimeter gate per access that is not co-located with a hatch.
  const extraGates = Math.max(0, accesses.length - (hatches.length > 0 ? 0 : 0));
  // Always add one perimeter gate when there's an access point on the edge run
  // (hatch kits protect the hatch opening; perimeter ladder still needs a gate).
  if (accesses.length > 0 && guardedPerimeterFt > 0) {
    lineItems.push(
      lineFromProduct(
        gateProduct,
        Math.max(1, extraGates || 1),
        oshaForGate(),
        "Self-closing gate at roof-edge / ladder access opening in the KeeGuard run (1910.29(b)(13)).",
      ),
    );
  }

  // 4) Skylights — prefer Kee Dome for permanent; screens as alternate for temporary
  const skylights = extraction.features.filter((f) => f.kind === "skylight");
  const preferScreens = answers.permanence === "temporary";
  if (skylights.length > 0) {
    const pid = pickSkylightProduct(preferScreens);
    lineItems.push(
      lineFromProduct(
        pid,
        skylights.length,
        oshaForSkylight(),
        preferScreens
          ? `${skylights.length} skylight(s): curb-style safety screens (temporary / lighter footprint).`
          : `${skylights.length} skylight(s): Kee Dome freestanding skylight guardrail kits.`,
      ),
    );
  }

  // Deduplicate identical product lines
  const merged = new Map<string, QuoteLineItem>();
  for (const item of lineItems) {
    const key = item.productId;
    const existing = merged.get(key);
    if (existing) {
      existing.qty += item.qty;
      existing.lineTotal = round2(existing.unitPrice * existing.qty);
      existing.rationale = `${existing.rationale} ${item.rationale}`;
    } else {
      merged.set(key, { ...item, id: item.productId });
    }
  }
  const finalItems = [...merged.values()];

  const subtotal = round2(finalItems.reduce((s, i) => s + i.lineTotal, 0));
  const publishedSubtotal = round2(
    finalItems.filter((i) => i.priceKind === "published").reduce((s, i) => s + i.lineTotal, 0),
  );
  const estimatedSubtotal = round2(
    finalItems.filter((i) => i.priceKind === "estimated").reduce((s, i) => s + i.lineTotal, 0),
  );

  return {
    projectName,
    generatedAt: new Date().toISOString(),
    perimeterFt,
    guardedPerimeterFt,
    answers,
    scaleFactor,
    lineItems: finalItems,
    subtotal,
    publishedSubtotal,
    estimatedSubtotal,
    assumptions,
    disclaimer:
      "Budgetary estimate only. Quantities are derived from plan/photo takeoff and OSHA 29 CFR 1910.28 / 1910.29 (and 1926.501 / 1926.502 where construction applies). Prices marked Published are public list prices from Simplified Safety / Simplified Building (or a KeeGuard kit list proxy). Prices marked Estimated are budgetary. Final configuration, wind load engineering, site verification, and compliance decisions remain with Simplified Safety staff. Not a stamped engineering drawing.",
  };
}
