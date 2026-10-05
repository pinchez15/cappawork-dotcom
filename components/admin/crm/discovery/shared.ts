import type {
  DiscoveryAnswer,
  DiscoveryConstraint,
  DiscoveryQuestion,
  DiscoveryView,
} from "@/server/repos/discovery";

export const SENTINELS = new Set(["not covered", "no answer"]);

export const LIST_FIELDS = new Set([
  "deal.objections",
  "deal.stakeholders",
  "deal.must_work_with",
  "constraint.root_causes",
]);

export const TIER_LABELS: Record<DiscoveryQuestion["tier"], string> = {
  must: "Must",
  if_time: "If time",
  confirm: "Confirm",
  fallback: "Fallback",
  once: "Once",
};

export const DECISION_LABELS: Record<string, { label: string; className: string }> = {
  build: { label: "Build", className: "bg-green-100 text-green-800" },
  recap_first: { label: "Recap first", className: "bg-amber-100 text-amber-800" },
  deprioritize: { label: "Deprioritize", className: "bg-stone-200 text-stone-700" },
  refer_out: { label: "Refer out", className: "bg-blue-100 text-blue-800" },
};

export function humanize(field: string): string {
  const key = field.split(".")[1] ?? field;
  const s = key.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** The constraint call mode and Must coverage read from: confirmed or proposed primary, else the first. */
export function focusConstraint(constraints: DiscoveryConstraint[]): DiscoveryConstraint | undefined {
  return constraints.find((c) => c.is_primary) ?? constraints[0];
}

export function answersFor(
  answers: DiscoveryAnswer[],
  field: string,
  constraintId: string | null
): DiscoveryAnswer[] {
  return answers.filter((a) => a.field === field && a.constraint_id === constraintId);
}

export function isFilled(list: DiscoveryAnswer[]): boolean {
  return list.some((a) => !SENTINELS.has(a.value.trim().toLowerCase()));
}

/** Is this qualified field filled on the deal (constraint fields read off the focus constraint)? */
export function fieldFilled(view: DiscoveryView, field: string): boolean {
  if (field.startsWith("constraint.")) {
    const c = focusConstraint(view.constraints);
    return !!c && isFilled(answersFor(view.answers, field, c.id));
  }
  return isFilled(answersFor(view.answers, field, null));
}

/** Stages in bank order, each with its questions. */
export function groupByStage(questions: DiscoveryQuestion[]): { stage: string; questions: DiscoveryQuestion[] }[] {
  const groups: { stage: string; questions: DiscoveryQuestion[] }[] = [];
  for (const q of questions) {
    const last = groups[groups.length - 1];
    if (last?.stage === q.stage) last.questions.push(q);
    else groups.push({ stage: q.stage, questions: [q] });
  }
  return groups;
}

export const PPPP_STAGES = new Set(["Profit", "Possibility", "Pain", "Proof"]);
