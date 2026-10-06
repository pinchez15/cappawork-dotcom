import { generateText, Output, zodSchema, type LanguageModel } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import {
  ExtractionResult,
  RecapEmail,
  type DealRecord,
  type Extraction,
  type RecapEmailDraft,
} from "./schema";
import { DEMO_BRIEF_SYSTEM, EXTRACTION_SYSTEM, PROPOSAL_SYSTEM, RECAP_SYSTEM } from "./prompt";
import type { PricingAnchors } from "./pricing";
import type { GateResult } from "./gate";

// Standalone discovery AI calls. No database, no Inngest, no app imports: anything that
// has a transcript (the post-call job here, Pigeon later) can call these directly.

export const DEFAULT_DISCOVERY_MODEL = "claude-opus-5-5";

export type DiscoveryDefaults = {
  close_rate?: number; // 0–1
  margin?: number; // 0–1
  owner_revenue_per_hour?: number; // USD
};

export type ExtractDiscoveryInput = {
  transcript: string;
  research?: string;
  hypothesis?: string;
  constraintMap?: string;
  defaults?: DiscoveryDefaults;
  priceUsd: number;
  interviewer?: string; // the CappaWork speaker's name as the transcript labels it
  model?: LanguageModel;
};

// Small schemas (the recap) use structured output. The extraction schema is too large for
// Anthropic's constrained-decoding grammar, and Opus rejects the forced-tool fallback, so the
// extraction asks for plain JSON against the schema and validates it with Zod instead.
const ANTHROPIC_OPTIONS = { anthropic: { structuredOutputMode: "jsonTool" as const } };
const EXTRACTION_JSON_SCHEMA = JSON.stringify(zodSchema(ExtractionResult).jsonSchema);

function parseJsonText(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("Extraction returned no JSON object");
  return JSON.parse(text.slice(start, end + 1));
}

function resolveModel(model?: LanguageModel): LanguageModel {
  return model ?? anthropic(DEFAULT_DISCOVERY_MODEL);
}

function formatDefaults(d: DiscoveryDefaults | undefined): string {
  const lines = [
    d?.close_rate != null ? `Close rate: ${Math.round(d.close_rate * 100)}%` : null,
    d?.margin != null ? `Margin: ${Math.round(d.margin * 100)}%` : null,
    d?.owner_revenue_per_hour != null ? `Owner revenue per hour: $${d.owner_revenue_per_hour}` : null,
  ].filter(Boolean);
  return lines.length ? lines.join("\n") : "None set. Label any assumption you make.";
}

export async function extractDiscovery(input: ExtractDiscoveryInput): Promise<Extraction> {
  const prompt = [
    `INTERVIEWER\n${input.interviewer ?? "Nate Pinches"}`,
    `TRANSCRIPT\n${input.transcript}`,
    `RESEARCH\n${input.research?.trim() || "None provided."}`,
    `HYPOTHESIS\n${input.hypothesis?.trim() || "None written before the call."}`,
    `CONSTRAINT MAP\n${input.constraintMap?.trim() || "None provided."}`,
    `DEFAULTS\n${formatDefaults(input.defaults)}`,
    `PRICE\n$${input.priceUsd.toLocaleString("en-US")}`,
  ].join("\n\n");

  const model = resolveModel(input.model);
  const system = `${EXTRACTION_SYSTEM}

FORMAT
Reply with one JSON object and nothing else: no prose, no code fences. It must match this JSON Schema exactly, with every property present:
${EXTRACTION_JSON_SCHEMA}`;

  const first = await generateText({ model, system, prompt, maxOutputTokens: 32000 });
  let error: string;
  try {
    const parsed = ExtractionResult.safeParse(parseJsonText(first.text));
    if (parsed.success) return parsed.data;
    error = JSON.stringify(parsed.error.issues.slice(0, 20));
  } catch (e) {
    error = (e as Error).message;
  }

  // One repair pass: hand back the reply and what was wrong with it.
  const retry = await generateText({
    model,
    system,
    messages: [
      { role: "user", content: prompt },
      { role: "assistant", content: first.text },
      { role: "user", content: `That reply did not match the schema: ${error}\nReturn the corrected JSON object only.` },
    ],
    maxOutputTokens: 32000,
  });
  return ExtractionResult.parse(parseJsonText(retry.text));
}

export async function draftRecapEmail(input: {
  deal: DealRecord;
  contactName?: string;
  uncoveredMustFields: string[];
  model?: LanguageModel;
}): Promise<RecapEmailDraft> {
  const prompt = [
    `BUYER NAME\n${input.contactName || "unknown; use a neutral greeting"}`,
    `UNCOVERED MUST FIELDS (ask about at most three)\n${input.uncoveredMustFields.join(", ") || "none"}`,
    `DEAL JSON\n${JSON.stringify(input.deal, null, 2)}`,
  ].join("\n\n");

  const { output } = await generateText({
    model: resolveModel(input.model),
    system: RECAP_SYSTEM,
    prompt,
    output: Output.object({ schema: RecapEmail }),
    providerOptions: ANTHROPIC_OPTIONS,
  });

  return output;
}

export async function writeDemoBrief(input: {
  deal: DealRecord;
  model?: LanguageModel;
}): Promise<string> {
  const { text } = await generateText({
    model: resolveModel(input.model),
    system: DEMO_BRIEF_SYSTEM,
    prompt: `DEAL JSON\n${JSON.stringify(input.deal, null, 2)}`,
    maxOutputTokens: 8000,
  });
  return text;
}

export async function writeProposalBrief(input: {
  deal: DealRecord;
  pricing: PricingAnchors;
  gate: GateResult;
  model?: LanguageModel;
}): Promise<string> {
  const failed = input.gate.tests.filter((t) => !t.passed).map((t) => `${t.n}. ${t.test}: ${t.detail}`);
  const prompt = [
    `HOURS CAP\n${input.pricing.hours_cap} hours`,
    `PRICING\n${JSON.stringify(input.pricing, null, 2)}`,
    `GATE\nDecision: ${input.gate.decision}\nFailed tests:\n${failed.join("\n") || "none"}`,
    `DEAL JSON\n${JSON.stringify(input.deal, null, 2)}`,
  ].join("\n\n");

  const { text } = await generateText({
    model: resolveModel(input.model),
    system: PROPOSAL_SYSTEM,
    prompt,
    maxOutputTokens: 8000,
  });
  return text;
}
