import { supabaseAdmin } from "@/lib/db/client";
import {
  CONSTRAINT_STATED_FIELDS,
  DEAL_STATED_FIELDS,
  NO_ANSWER,
  NOT_COVERED,
  type Extraction,
  type Stated,
} from "@/lib/discovery/schema";

export type DiscoveryQuestion = {
  question_id: string;
  sort_order: number;
  stage: string;
  kind: string;
  tier: "must" | "if_time" | "confirm" | "fallback" | "once";
  fields: string[];
  ask: string;
  cue: string;
  follow_up: string | null;
};

export type DiscoveryBank = {
  version: string;
  name: string;
  frame: string | null;
  guardrails: string[];
  questions: DiscoveryQuestion[];
};

export type DiscoveryAnswer = {
  id: string;
  constraint_id: string | null;
  field: string;
  item_index: number;
  value: string;
  quote: string | null;
  transcript_at: string | null;
  bank_version: string;
  source: "extraction" | "manual" | "call" | "mcp" | "recap";
  recorded_at: string;
};

export type ComputedValue = { value: string; math: string; assumptions: string[] };

export type DiscoveryConstraint = {
  id: string;
  deal_id: string;
  position: number;
  tied_to_capacity: boolean | null;
  profit_lever: string | null;
  capacity_unlocked: ComputedValue | null;
  impact_monthly: ComputedValue | null;
  fixable: "yes" | "partial" | "no" | null;
  is_primary: boolean;
  primary_confirmed_at: string | null;
};

export type DiscoveryDeal = {
  id: string;
  account_id: string;
  hypothesis: string | null;
  price_usd: number;
  hypothesis_result: "confirmed" | "partial" | "wrong" | null;
  unserved_value_monthly: ComputedValue | null;
  unlocked_value_monthly: ComputedValue | null;
  change_risk: ComputedValue | null;
  case_summary: string | null;
  coverage: number | null;
  decision: "build" | "recap_first" | "deprioritize" | "refer_out" | null;
  outcome_notes: string | null;
  outcome_recorded_at: string | null;
  updated_at: string;
};

export type DiscoveryRun = {
  id: string;
  status: string;
  price_usd: number;
  bank_version: string;
  model: string | null;
  hypothesis_check: { result: string; evidence: string } | null;
  recap_subject: string | null;
  recap_body: string | null;
  gate: { tests: { n: number; test: string; passed: boolean; fields: string[]; detail: string }[]; decision: string } | null;
  demo_brief: string | null;
  error: string | null;
  created_at: string;
  completed_at: string | null;
};

export type DiscoveryView = {
  bank: DiscoveryBank | null;
  deal: DiscoveryDeal | null;
  constraints: DiscoveryConstraint[];
  answers: DiscoveryAnswer[];
  runs: DiscoveryRun[];
};

// ─── Bank ───────────────────────────────────────────────────────────────────

export async function getActiveBank(): Promise<DiscoveryBank | null> {
  const { data: bank, error } = await supabaseAdmin
    .from("discovery_question_banks")
    .select("version, name, frame, guardrails")
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  if (!bank) return null;

  const { data: questions, error: qErr } = await supabaseAdmin
    .from("discovery_questions")
    .select("question_id, sort_order, stage, kind, tier, fields, ask, cue, follow_up")
    .eq("bank_version", bank.version)
    .order("sort_order");
  if (qErr) throw qErr;

  return { ...bank, questions: (questions ?? []) as DiscoveryQuestion[] } as DiscoveryBank;
}

/** Fully qualified Must fields ("deal.trigger", "constraint.effort") in bank order. */
export function mustFields(bank: DiscoveryBank): string[] {
  return [...new Set(bank.questions.filter((q) => q.tier === "must").flatMap((q) => q.fields))];
}

// ─── Reads ──────────────────────────────────────────────────────────────────

export async function getDealByAccount(accountId: string): Promise<DiscoveryDeal | null> {
  const { data, error } = await supabaseAdmin
    .from("discovery_deals")
    .select("*")
    .eq("account_id", accountId)
    .maybeSingle();
  if (error) throw error;
  return data as DiscoveryDeal | null;
}

export async function ensureDeal(accountId: string): Promise<DiscoveryDeal> {
  const { data, error } = await supabaseAdmin.rpc("discovery_ensure_deal", { p_account_id: accountId });
  if (error) throw error;
  return data as DiscoveryDeal;
}

export async function getDealState(dealId: string) {
  const [constraints, answers] = await Promise.all([
    supabaseAdmin.from("discovery_constraints").select("*").eq("deal_id", dealId).order("position"),
    supabaseAdmin
      .from("discovery_answers")
      .select("id, constraint_id, field, item_index, value, quote, transcript_at, bank_version, source, recorded_at")
      .eq("deal_id", dealId)
      .is("superseded_at", null)
      .order("field")
      .order("item_index"),
  ]);
  if (constraints.error) throw constraints.error;
  if (answers.error) throw answers.error;
  return {
    constraints: (constraints.data ?? []) as DiscoveryConstraint[],
    answers: (answers.data ?? []) as DiscoveryAnswer[],
  };
}

export async function getDiscoveryView(accountId: string): Promise<DiscoveryView> {
  const [bank, deal] = await Promise.all([getActiveBank(), getDealByAccount(accountId)]);
  if (!deal) return { bank, deal: null, constraints: [], answers: [], runs: [] };

  const [state, runs] = await Promise.all([
    getDealState(deal.id),
    supabaseAdmin
      .from("discovery_runs")
      .select(
        "id, status, price_usd, bank_version, model, hypothesis_check, recap_subject, recap_body, gate, demo_brief, error, created_at, completed_at"
      )
      .eq("deal_id", deal.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  if (runs.error) throw runs.error;

  return { bank, deal, ...state, runs: (runs.data ?? []) as DiscoveryRun[] };
}

// ─── Writes ─────────────────────────────────────────────────────────────────

export type AnswerItem = { value: string; quote?: string; at?: string };

export async function setField(input: {
  dealId: string;
  field: string;
  items: AnswerItem[];
  source: DiscoveryAnswer["source"];
  constraintId?: string | null;
  runId?: string | null;
}) {
  const { data, error } = await supabaseAdmin.rpc("discovery_set_field", {
    p_deal_id: input.dealId,
    p_field: input.field,
    p_items: input.items,
    p_source: input.source,
    p_constraint_id: input.constraintId ?? null,
    p_run_id: input.runId ?? null,
  });
  if (error) throw error;
  return data as DiscoveryAnswer[];
}

export async function addConstraint(dealId: string): Promise<DiscoveryConstraint> {
  const { data: existing, error } = await supabaseAdmin
    .from("discovery_constraints")
    .select("position")
    .eq("deal_id", dealId);
  if (error) throw error;

  const taken = new Set((existing ?? []).map((c) => c.position as number));
  const position = [1, 2, 3].find((p) => !taken.has(p));
  if (!position) throw new Error("A deal holds at most 3 constraints");

  const { data, error: insErr } = await supabaseAdmin
    .from("discovery_constraints")
    .insert({ deal_id: dealId, position, is_primary: taken.size === 0 })
    .select("*")
    .single();
  if (insErr) throw insErr;
  return data as DiscoveryConstraint;
}

export async function confirmPrimaryConstraint(dealId: string, constraintId: string) {
  // Clear first: the partial unique index allows one primary per deal.
  const clear = await supabaseAdmin
    .from("discovery_constraints")
    .update({ is_primary: false, primary_confirmed_at: null })
    .eq("deal_id", dealId)
    .neq("id", constraintId);
  if (clear.error) throw clear.error;

  const { error } = await supabaseAdmin
    .from("discovery_constraints")
    .update({ is_primary: true, primary_confirmed_at: new Date().toISOString() })
    .eq("id", constraintId)
    .eq("deal_id", dealId);
  if (error) throw error;
}

export async function updateDeal(
  dealId: string,
  patch: Partial<Omit<DiscoveryDeal, "id" | "account_id" | "updated_at">>
): Promise<DiscoveryDeal> {
  const { data, error } = await supabaseAdmin
    .from("discovery_deals")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", dealId)
    .select("*")
    .single();
  if (error) throw error;
  return data as DiscoveryDeal;
}

// ─── Runs ───────────────────────────────────────────────────────────────────

export async function createRun(input: {
  dealId: string;
  transcript: string;
  research?: string | null;
  constraintMap?: string | null;
  defaults?: Record<string, number>;
  priceUsd: number;
  bankVersion: string;
  source?: "manual" | "google_meet" | "webhook";
  sourceRef?: string | null;
}): Promise<{ id: string }> {
  const { data, error } = await supabaseAdmin
    .from("discovery_runs")
    .insert({
      deal_id: input.dealId,
      transcript: input.transcript,
      research: input.research ?? null,
      constraint_map: input.constraintMap ?? null,
      defaults: input.defaults ?? {},
      price_usd: input.priceUsd,
      bank_version: input.bankVersion,
      source: input.source ?? "manual",
      source_ref: input.sourceRef ?? null,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data as { id: string };
}

export async function findRunBySourceRef(sourceRef: string): Promise<{ id: string; deal_id: string } | null> {
  const { data, error } = await supabaseAdmin
    .from("discovery_runs")
    .select("id, deal_id")
    .eq("source_ref", sourceRef)
    .maybeSingle();
  if (error) throw error;
  return data as { id: string; deal_id: string } | null;
}

export async function getRunForJob(runId: string) {
  const { data, error } = await supabaseAdmin
    .from("discovery_runs")
    .select("*, discovery_deals!inner(id, account_id, hypothesis)")
    .eq("id", runId)
    .single();
  if (error) throw error;
  return data as {
    id: string;
    deal_id: string;
    transcript: string;
    research: string | null;
    constraint_map: string | null;
    defaults: Record<string, number>;
    price_usd: number;
    extraction: Extraction | null;
    discovery_deals: { id: string; account_id: string; hypothesis: string | null };
  };
}

export async function updateRun(runId: string, patch: Record<string, unknown>) {
  const { error } = await supabaseAdmin.from("discovery_runs").update(patch).eq("id", runId);
  if (error) throw error;
}

// ─── Extraction → records ───────────────────────────────────────────────────

const isSentinel = (s: Stated, sentinel: string) => s.value.trim().toLowerCase() === sentinel;

function toItems(v: Stated | Stated[]): AnswerItem[] {
  const list = Array.isArray(v) ? v : [v];
  return list.map((s) => ({ value: s.value.trim() || NOT_COVERED, quote: s.quote, at: s.at }));
}

/**
 * Should an extracted value replace what's on the record?
 * "not covered" never overwrites: absence already reads as not covered.
 * "no answer" only fills a field that has no real answer yet.
 */
function shouldWrite(next: Stated[], current: DiscoveryAnswer[]): boolean {
  if (next.length === 0 || next.every((s) => isSentinel(s, NOT_COVERED))) return false;
  if (next.every((s) => isSentinel(s, NO_ANSWER) || isSentinel(s, NOT_COVERED))) {
    return !current.some((a) => a.value !== NO_ANSWER && a.value !== NOT_COVERED);
  }
  return true;
}

/**
 * Write an extraction onto a deal. Constraints map by position (extraction's 1st → position 1);
 * missing positions are created up to three. A primary you already confirmed is kept.
 */
export async function writeExtraction(dealId: string, runId: string, result: Extraction, coverage: number) {
  const deal = result.deal;
  const { constraints: existing, answers } = await getDealState(dealId);
  const current = (field: string, constraintId: string | null) =>
    answers.filter((a) => a.field === field && a.constraint_id === constraintId);

  for (const key of DEAL_STATED_FIELDS) {
    const field = `deal.${key}`;
    const raw = deal[key];
    // validation is an enum on the schema; store it as a stated value without a quote.
    const items: Stated[] = typeof raw === "string" ? [{ value: raw === "not done" ? NOT_COVERED : raw }] : toItems(raw);
    if (!shouldWrite(items, current(field, null))) continue;
    await setField({ dealId, field, items: toItems(items), source: "extraction", runId });
  }

  const confirmedPrimary = existing.find((c) => c.primary_confirmed_at);
  const rows: DiscoveryConstraint[] = [...existing];

  for (const [i, c] of deal.constraints.slice(0, 3).entries()) {
    let row = rows.find((r) => r.position === i + 1);
    if (!row) {
      row = await addConstraint(dealId);
      rows.push(row);
    }

    const { error } = await supabaseAdmin
      .from("discovery_constraints")
      .update({
        tied_to_capacity: c.tied_to_capacity,
        profit_lever: c.profit_lever,
        capacity_unlocked: c.capacity_unlocked,
        impact_monthly: c.impact_monthly,
        fixable: c.fixable,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    if (error) throw error;

    for (const key of CONSTRAINT_STATED_FIELDS) {
      const field = `constraint.${key}`;
      const items = toItems(c[key]);
      if (!shouldWrite(items, current(field, row.id))) continue;
      await setField({ dealId, field, items, source: "extraction", constraintId: row.id, runId });
    }
  }

  if (!confirmedPrimary) {
    const proposedIndex = deal.constraints.findIndex((c) => c.primary);
    const proposed = rows.find((r) => r.position === (proposedIndex >= 0 ? proposedIndex : 0) + 1);
    if (proposed) {
      await supabaseAdmin.from("discovery_constraints").update({ is_primary: false }).eq("deal_id", dealId);
      await supabaseAdmin.from("discovery_constraints").update({ is_primary: true }).eq("id", proposed.id);
    }
  }

  await updateDeal(dealId, {
    unserved_value_monthly: deal.unserved_value_monthly,
    unlocked_value_monthly: deal.unlocked_value_monthly,
    change_risk: deal.change_risk,
    case_summary: deal.case_summary,
    hypothesis_result: result.hypothesis_check.result,
    coverage,
  });
}
