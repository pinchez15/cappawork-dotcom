import { z } from "zod";

// Schema from the playbook's extraction pass (lib/docs/CappaWork-Discovery-Playbook.md).
// Keep this file free of app imports so the extraction can run outside the site (Pigeon).

export const NOT_COVERED = "not covered";
export const NO_ANSWER = "no answer";

// A buyer statement plus the evidence behind it.
export const stated = z.object({
  value: z.string(), // "not covered" or "no answer" when absent
  quote: z.string().optional(),
  at: z.string().optional(), // transcript timestamp
});

// A calculation, never mixed with buyer statements.
export const computed = z.object({
  value: z.string(),
  math: z.string(),
  assumptions: z.array(z.string()),
});

export const Constraint = z.object({
  constraint: stated, // where work piles up, in their words
  example: stated,
  consequences: stated,
  wait_time: stated,
  owner_role: stated,
  effort: stated,
  trend: stated,
  root_causes: z.array(stated), // processes and tools
  prior_attempts: stated,
  tied_to_capacity: z.boolean(),
  profit_lever: z.enum(["customers", "avg_job_value", "frequency", "margin"]),
  capacity_unlocked: computed,
  impact_monthly: computed,
  fixable: z.enum(["yes", "partial", "no"]),
  primary: z.boolean(),
});

export const Deal = z.object({
  hypothesis: z.string(),
  trigger: stated,
  timeline_driver: stated,
  team: stated,
  systems: stated,
  demand_volume: stated,
  delivered_volume: stated,
  avg_job_value: stated,
  margin: stated,
  workflow_map: stated,
  unserved_demand: stated,
  unserved_volume: stated,
  unserved_outcome: stated,
  ideal_state: stated,
  ideal_workflow: stated,
  emotional_state: stated,
  success_metric: stated,
  validation: z.enum(["confirmed", "corrected", "disputed", "not done"]),
  demo_acceptance: stated,
  objections: z.array(stated),
  stakeholders: z.array(stated),
  decision_process: stated,
  demo_artifacts: stated,
  must_work_with: z.array(stated),
  call2_at: stated,
  constraints: z.array(Constraint).max(3),
  hypothesis_result: z.enum(["confirmed", "partial", "wrong"]),
  unserved_value_monthly: computed,
  unlocked_value_monthly: computed,
  change_risk: computed,
  case_summary: z.string(),
  coverage: z.number().min(0).max(1),
  decision: z.enum(["build", "recap_first", "deprioritize", "refer_out"]),
});

// What the extraction returns: the Deal, the hypothesis check (output B), and the
// three gate facts that need judgment. The gate itself is computed in code (gate.ts).
export const ExtractionResult = z.object({
  deal: Deal,
  hypothesis_check: z.object({
    result: z.enum(["confirmed", "partial", "wrong"]),
    evidence: z.string(),
  }),
  gate_signals: z.object({
    unserved_volume_is_number: z
      .boolean()
      .describe("True when the buyer put a number or a bracket on the work they turn away or defer."),
    decision_maker_attends_call2: z
      .boolean()
      .describe("True only when the buyer said the decision-maker will join call 2, or is the decision-maker."),
    primary_causes_are_people_or_skills: z
      .boolean()
      .describe("True when the primary constraint is a missing hire or skill rather than a process or tool."),
  }),
});

export type Stated = z.infer<typeof stated>;
export type Computed = z.infer<typeof computed>;
export type ConstraintRecord = z.infer<typeof Constraint>;
export type DealRecord = z.infer<typeof Deal>;
export type Extraction = z.infer<typeof ExtractionResult>;

export const RecapEmail = z.object({
  subject: z.string(),
  body: z.string(),
});
export type RecapEmailDraft = z.infer<typeof RecapEmail>;

export function hasEvidence(s: Stated | undefined): boolean {
  if (!s) return false;
  const v = s.value.trim().toLowerCase();
  return v.length > 0 && v !== NOT_COVERED && v !== NO_ANSWER;
}

// Stated fields on each record, as written to discovery_answers ("deal.<key>").
export const DEAL_STATED_FIELDS = [
  "trigger", "timeline_driver", "team", "systems", "demand_volume", "delivered_volume",
  "avg_job_value", "margin", "workflow_map", "unserved_demand", "unserved_volume",
  "unserved_outcome", "ideal_state", "ideal_workflow", "emotional_state", "success_metric",
  "validation", "demo_acceptance", "objections", "stakeholders", "decision_process",
  "demo_artifacts", "must_work_with", "call2_at",
] as const satisfies readonly (keyof DealRecord)[];

export const CONSTRAINT_STATED_FIELDS = [
  "constraint", "example", "consequences", "wait_time", "owner_role", "effort", "trend",
  "root_causes", "prior_attempts",
] as const satisfies readonly (keyof ConstraintRecord)[];
