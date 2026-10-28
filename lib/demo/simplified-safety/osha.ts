import type { OshaCitation } from "./types";

/** OSHA citations that drive rooftop fall-protection line items in this demo. */
export const OSHA: Record<string, OshaCitation> = {
  unprotectedEdges: {
    id: "unprotectedEdges",
    cfr: "29 CFR 1910.28(b)(1)",
    title: "Unprotected sides and edges",
    summary:
      "General industry: each employee on a walking-working surface with an unprotected side or edge 4 ft or more above a lower level must be protected by guardrail systems, safety net systems, or personal fall protection.",
  },
  constructionEdges: {
    id: "constructionEdges",
    cfr: "29 CFR 1926.501(b)(1)",
    title: "Unprotected sides and edges (construction)",
    summary:
      "Construction: employees on walking/working surfaces with unprotected sides or edges 6 ft or more above a lower level must be protected by guardrail systems, safety net systems, or personal fall arrest systems.",
  },
  lowSlopeRoof: {
    id: "lowSlopeRoof",
    cfr: "29 CFR 1910.28(b)(13)",
    title: "Work on low-slope roofs",
    summary:
      "Work less than 6 ft from the roof edge needs guardrail or equivalent; 6–15 ft and 15 ft+ have defined alternatives (warning lines / designated areas).",
  },
  holesSkylights: {
    id: "holesSkylights",
    cfr: "29 CFR 1910.28(b)(3)",
    title: "Holes and skylights",
    summary:
      "Each employee on a walking-working surface near a hole (including a skylight) must be protected from falling through by covers or a guardrail system on all unprotected sides.",
  },
  hatchways: {
    id: "hatchways",
    cfr: "29 CFR 1910.29(b)(11) / 1910.29(e)",
    title: "Hatchways and floor openings",
    summary:
      "Hatchways must be guarded by a hinged cover with removable railing, or a removable railing with toeboard on exposed sides, or equivalent protection.",
  },
  accessOpenings: {
    id: "accessOpenings",
    cfr: "29 CFR 1910.29(b)(13)",
    title: "Access openings / ladderways",
    summary:
      "Ladderway and access openings in guardrail systems require a self-closing gate or an offset so a person cannot walk directly into the opening.",
  },
  guardrailCriteria: {
    id: "guardrailCriteria",
    cfr: "29 CFR 1910.29(b)(1)–(3)",
    title: "Guardrail system criteria",
    summary:
      "Top edge 42 in ±3 in above the walking-working surface; midrails or equivalent where there is no wall/parapet ≥21 in; top rails must withstand 200 lb in any outward or downward direction.",
  },
  constructionGuardrail: {
    id: "constructionGuardrail",
    cfr: "29 CFR 1926.502(b)",
    title: "Guardrail systems (construction)",
    summary:
      "Construction guardrail criteria: top rail ~42 in, midrail, and strength requirements consistent with 1926.502(b).",
  },
  warningLines: {
    id: "warningLines",
    cfr: "29 CFR 1910.28(b)(13) / 1926.502(f)",
    title: "Warning lines and designated areas",
    summary:
      "Warning lines and designated areas are alternatives only when work is far enough from the edge (typically 6 ft / 15 ft rules). Within 6 ft of the edge, guardrail or equivalent is required for general industry low-slope roof work.",
  },
};

export function oshaForGuardrail() {
  return [OSHA.unprotectedEdges, OSHA.guardrailCriteria, OSHA.lowSlopeRoof, OSHA.constructionEdges];
}

export function oshaForSkylight() {
  return [OSHA.holesSkylights, OSHA.guardrailCriteria];
}

export function oshaForHatch() {
  return [OSHA.hatchways, OSHA.accessOpenings, OSHA.guardrailCriteria];
}

export function oshaForGate() {
  return [OSHA.accessOpenings, OSHA.guardrailCriteria];
}
