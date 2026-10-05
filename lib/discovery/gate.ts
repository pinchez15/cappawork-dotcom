import { hasEvidence, type ConstraintRecord, type Extraction } from "./schema";

// The go/no-go gate, computed in code so every decision traces to fields.
// The model supplies three judgments (gate_signals); everything else is read off the record.

export type Decision = "build" | "recap_first" | "deprioritize" | "refer_out";

export type GateTest = {
  n: number;
  test: string;
  passed: boolean;
  fields: string[];
  detail: string;
};

export type GateResult = { tests: GateTest[]; decision: Decision };

// Recap carries up to three questions, so test 7 passes with at most three gaps.
export const RECAP_QUESTION_LIMIT = 3;

export function primaryConstraint(constraints: ConstraintRecord[]): ConstraintRecord | undefined {
  return constraints.find((c) => c.primary) ?? constraints[0];
}

/** First dollar figure in a string: "$8,750 a month", "about $12K", "$1.2M" → number. */
export function parseUsd(text: string): number | null {
  const m = text.match(/\$\s*([\d,]+(?:\.\d+)?)\s*([kKmM])?\b/) ?? text.match(/([\d,]+(?:\.\d+)?)\s*([kKmM])?\b/);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ""));
  if (!Number.isFinite(n)) return null;
  const unit = m[2]?.toLowerCase();
  return unit === "k" ? n * 1_000 : unit === "m" ? n * 1_000_000 : n;
}

/**
 * Must fields from the question bank ("deal.trigger", "constraint.effort") that lack evidence.
 * Constraint fields are read off the primary constraint.
 */
export function uncoveredMustFields(result: Extraction, mustFields: string[]): string[] {
  const deal = result.deal as Record<string, unknown>;
  const primary = primaryConstraint(result.deal.constraints) as Record<string, unknown> | undefined;

  return mustFields.filter((qualified) => {
    const [record, key] = qualified.split(".");
    const source = record === "constraint" ? primary : deal;
    const v = source?.[key];
    if (v == null) return true;
    if (typeof v === "string") return v === "not done"; // validation enum
    if (Array.isArray(v)) return !v.some((s) => hasEvidence(s));
    return !hasEvidence(v as { value: string });
  });
}

export function evaluateGate(input: {
  result: Extraction;
  priceUsd: number;
  uncoveredMust: string[];
}): GateResult {
  const { deal, gate_signals: signals } = input.result;
  const primary = primaryConstraint(deal.constraints);
  const unlockedMonthly = parseUsd(deal.unlocked_value_monthly.value);
  const threshold = input.priceUsd * 3;
  const growing = !!primary && hasEvidence(primary.trend) && /grow|worse|increas|rising/i.test(primary.trend.value);

  const tests: GateTest[] = [
    {
      n: 1,
      test: "Defined excess demand",
      passed: hasEvidence(deal.unserved_demand) && hasEvidence(deal.unserved_volume) && signals.unserved_volume_is_number,
      fields: ["deal.unserved_demand", "deal.unserved_volume"],
      detail: `${deal.unserved_demand.value} · ${deal.unserved_volume.value}`,
    },
    {
      n: 2,
      test: "Ops is the constraint",
      passed: !!primary && primary.fixable !== "no" && !signals.primary_causes_are_people_or_skills,
      fields: ["constraint.fixable"],
      detail: primary
        ? `fixable: ${primary.fixable}${signals.primary_causes_are_people_or_skills ? "; cause is people or skills" : ""}`
        : "No constraint found",
    },
    {
      n: 3,
      test: "They agree",
      passed: deal.validation === "confirmed" || deal.validation === "corrected",
      fields: ["deal.validation"],
      detail: deal.validation,
    },
    {
      n: 4,
      test: "Urgency",
      passed: hasEvidence(deal.trigger) || hasEvidence(deal.timeline_driver) || growing,
      fields: ["deal.trigger", "constraint.trend"],
      detail: `trigger: ${deal.trigger.value}; trend: ${primary?.trend.value ?? "no constraint"}`,
    },
    {
      n: 5,
      test: "Commitment",
      passed: hasEvidence(deal.demo_artifacts) && signals.decision_maker_attends_call2,
      fields: ["deal.demo_artifacts", "deal.stakeholders"],
      detail: `artifacts: ${deal.demo_artifacts.value}; decision-maker on call 2: ${signals.decision_maker_attends_call2 ? "yes" : "no"}`,
    },
    {
      n: 6,
      test: "The math clears the price",
      passed: unlockedMonthly != null && unlockedMonthly * 12 >= threshold,
      fields: ["deal.unlocked_value_monthly"],
      detail:
        unlockedMonthly == null
          ? `Could not read a dollar figure from "${deal.unlocked_value_monthly.value}"`
          : `$${Math.round(unlockedMonthly * 12).toLocaleString("en-US")} a year vs $${threshold.toLocaleString("en-US")} (3 × price)`,
    },
    {
      n: 7,
      test: "The record is complete",
      passed: input.uncoveredMust.length <= RECAP_QUESTION_LIMIT,
      fields: ["deal.coverage"],
      detail: input.uncoveredMust.length
        ? `Uncovered: ${input.uncoveredMust.join(", ")}`
        : "Every Must field has evidence",
    },
  ];

  let decision: Decision;
  if (tests.every((t) => t.passed)) decision = "build";
  else if (!tests[0].passed) decision = "deprioritize";
  else if (!tests[1].passed && signals.primary_causes_are_people_or_skills) decision = "refer_out";
  else decision = "recap_first";

  return { tests, decision };
}
