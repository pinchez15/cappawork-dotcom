import { inngest } from "@/lib/inngest/client";
import { getGtmAccountDetail } from "@/server/repos/gtm-accounts";
import { createRun, ensureDeal, findRunBySourceRef, getActiveBank } from "@/server/repos/discovery";

/** Pre-call research from what the CRM already knows about the account. */
export async function buildResearch(accountId: string): Promise<string> {
  const account = await getGtmAccountDetail(accountId);
  if (!account) throw new Error("Account not found");

  const lines = [
    `Company: ${account.company_name}${account.domain ? ` (${account.domain})` : ""}`,
    account.industry && `Industry: ${account.industry}`,
    account.location && `Location: ${account.location}`,
    account.employee_count && `Employees: ${account.employee_count}`,
    account.revenue_estimate && `Revenue estimate: ${account.revenue_estimate}`,
    account.description && `Description: ${account.description}`,
    ...(account.signals as { signal_type: string; evidence_summary: string | null }[]).map(
      (s) => `Signal (${s.signal_type.replace(/_/g, " ")}): ${s.evidence_summary ?? ""}`
    ),
    (account.hypothesis as { likely_pain?: string | null } | null)?.likely_pain &&
      `Outreach hypothesis, likely pain: ${(account.hypothesis as { likely_pain: string }).likely_pain}`,
  ];
  return lines.filter(Boolean).join("\n");
}

export async function queueDiscoveryRun(
  accountId: string,
  input: {
    transcript: string;
    research?: string;
    constraintMap?: string;
    defaults?: Record<string, number>;
    priceUsd?: number;
    source?: "manual" | "google_meet" | "webhook";
    sourceRef?: string;
  }
): Promise<{ runId: string; dealId: string; duplicate?: boolean }> {
  if (input.sourceRef) {
    const existing = await findRunBySourceRef(input.sourceRef);
    if (existing) return { runId: existing.id, dealId: existing.deal_id, duplicate: true };
  }

  const bank = await getActiveBank();
  if (!bank) throw new Error("No active question bank. Run scripts/import-discovery-bank.mjs");

  const deal = await ensureDeal(accountId);
  const autoResearch = await buildResearch(accountId);
  const research = input.research?.trim() ? `${input.research.trim()}\n\n${autoResearch}` : autoResearch;

  const run = await createRun({
    dealId: deal.id,
    transcript: input.transcript,
    research,
    constraintMap: input.constraintMap,
    defaults: input.defaults,
    priceUsd: input.priceUsd ?? deal.price_usd,
    bankVersion: bank.version,
    source: input.source,
    sourceRef: input.sourceRef,
  });

  await inngest.send({
    name: "discovery/transcript.received",
    data: { runId: run.id, dealId: deal.id },
  });

  return { runId: run.id, dealId: deal.id };
}
