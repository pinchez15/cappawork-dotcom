import { generateText, Output, type LanguageModel } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import {
  ExtractionResult,
  RecapEmail,
  type DealRecord,
  type Extraction,
  type RecapEmailDraft,
} from "./schema";
import { DEMO_BRIEF_SYSTEM, EXTRACTION_SYSTEM, RECAP_SYSTEM } from "./prompt";

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

// Anthropic's JSON tool mode tolerates the schema's array and number bounds;
// Zod still validates the result.
const ANTHROPIC_OPTIONS = { anthropic: { structuredOutputMode: "jsonTool" as const } };

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

  const { output } = await generateText({
    model: resolveModel(input.model),
    system: EXTRACTION_SYSTEM,
    prompt,
    output: Output.object({ schema: ExtractionResult }),
    providerOptions: ANTHROPIC_OPTIONS,
    maxOutputTokens: 16000,
  });

  return output;
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
