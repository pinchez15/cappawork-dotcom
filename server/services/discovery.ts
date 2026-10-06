import { inngest } from "@/lib/inngest/client";
import { supabaseAdmin } from "@/lib/db/client";
import { getDeal, type BDDeal } from "@/server/repos/bd-deals";
import { createRun, ensureDeal, findRunBySourceRef, getActiveBank } from "@/server/repos/discovery";

/** Pre-call research from what the Pipeline deal already records. */
export function buildResearch(deal: BDDeal): string {
  const lines = [
    `Deal: ${deal.name}`,
    deal.company && `Company: ${deal.company}`,
    deal.contact_name && `Contact: ${deal.contact_name}${deal.contact_title ? `, ${deal.contact_title}` : ""}`,
    deal.value && `Pipeline value: $${deal.value.toLocaleString("en-US")}`,
    `Source: ${deal.source}${deal.referral_partner ? ` (via ${deal.referral_partner})` : ""}`,
    deal.next_action && `Next action: ${deal.next_action}`,
    deal.notes && `Notes: ${deal.notes}`,
  ];
  return lines.filter(Boolean).join("\n");
}

/**
 * Which open Pipeline deal a call belongs to, from attendee emails:
 * an exact contact email first, then a contact at the same company domain.
 */
export async function findPipelineDealByEmails(emails: string[], ignoredDomains: Set<string>): Promise<string | null> {
  const openDealMatching = async (pattern: string) => {
    const { data, error } = await supabaseAdmin
      .from("bd_deals")
      .select("id")
      .ilike("email", pattern)
      .not("stage", "in", "(won,lost)")
      .order("updated_at", { ascending: false })
      .limit(1);
    if (error) throw error;
    return (data?.[0]?.id as string | undefined) ?? null;
  };

  for (const email of emails) {
    const id = await openDealMatching(email.replace(/%/g, ""));
    if (id) return id;
  }
  for (const domain of new Set(emails.map((e) => e.split("@")[1]?.toLowerCase()))) {
    if (!domain || ignoredDomains.has(domain)) continue;
    const id = await openDealMatching(`%@${domain.replace(/%/g, "")}`);
    if (id) return id;
  }
  return null;
}

export async function queueDiscoveryRun(
  bdDealId: string,
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
  if (!bank) throw new Error("No active question bank. Run supabase/seed/discovery_question_bank.sql");

  const pipelineDeal = await getDeal(bdDealId);
  if (!pipelineDeal) throw new Error("Pipeline deal not found");

  const deal = await ensureDeal(bdDealId);
  const autoResearch = buildResearch(pipelineDeal);
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
