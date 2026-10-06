import { inngest } from "@/lib/inngest/client";
import { supabaseAdmin } from "@/lib/db/client";
import {
  DEFAULT_DISCOVERY_MODEL,
  draftRecapEmail,
  extractDiscovery,
  writeDemoBrief,
} from "@/lib/discovery/extract";
import { evaluateGate, uncoveredMustFields } from "@/lib/discovery/gate";
import {
  getActiveBank,
  getRunForJob,
  mustFields,
  updateDeal,
  updateRun,
  writeExtraction,
} from "@/server/repos/discovery";

// Post-call pass: transcript → extraction → fields → recap draft → gate → demo brief on Build.
export const discoveryPostCall = inngest.createFunction(
  {
    id: "discovery-post-call",
    retries: 1,
    concurrency: { key: "event.data.dealId", limit: 1 },
    triggers: [{ event: "discovery/transcript.received" }],
    onFailure: async ({ event, error }) => {
      const { runId } = event.data.event.data as { runId: string };
      await updateRun(runId, { status: "failed", error: error.message });
    },
  },
  async ({ event, step }) => {
    const { runId } = event.data as { runId: string; dealId: string };

    const run = await step.run("load", async () => {
      const r = await getRunForJob(runId);
      await updateRun(runId, { status: "extracting", model: DEFAULT_DISCOVERY_MODEL });
      return r;
    });
    const dealId = run.deal_id;

    const extraction = await step.run("extract", async () => {
      const result = await extractDiscovery({
        transcript: run.transcript,
        research: run.research ?? undefined,
        hypothesis: run.discovery_deals.hypothesis ?? undefined,
        constraintMap: run.constraint_map ?? undefined,
        defaults: run.defaults,
        priceUsd: run.price_usd,
      });
      await updateRun(runId, {
        status: "writing",
        extraction: result,
        hypothesis_check: result.hypothesis_check,
      });
      return result;
    });

    const uncovered = await step.run("write-fields", async () => {
      const bank = await getActiveBank();
      if (!bank) throw new Error("No active question bank");
      const must = mustFields(bank);
      const missing = uncoveredMustFields(extraction, must);
      const coverage = must.length ? (must.length - missing.length) / must.length : 0;
      await writeExtraction(dealId, runId, extraction, Number(coverage.toFixed(3)));
      await updateRun(runId, { status: "recap" });
      return missing;
    });

    await step.run("draft-recap", async () => {
      const { data: pipelineDeal } = await supabaseAdmin
        .from("bd_deals")
        .select("contact_name")
        .eq("id", run.discovery_deals.bd_deal_id)
        .maybeSingle();

      const recap = await draftRecapEmail({
        deal: extraction.deal,
        contactName: pipelineDeal?.contact_name?.split(" ")[0],
        uncoveredMustFields: uncovered.slice(0, 3),
      });
      await updateRun(runId, { status: "gating", recap_subject: recap.subject, recap_body: recap.body });
    });

    const gate = await step.run("gate", async () => {
      const result = evaluateGate({ result: extraction, priceUsd: run.price_usd, uncoveredMust: uncovered });
      await updateRun(runId, { gate: result, status: result.decision === "build" ? "brief" : "done" });
      await updateDeal(dealId, { decision: result.decision });
      return result;
    });

    if (gate.decision === "build") {
      await step.run("demo-brief", async () => {
        const brief = await writeDemoBrief({ deal: extraction.deal });
        await updateRun(runId, { demo_brief: brief, status: "done" });
      });
    }

    await step.run("complete", () => updateRun(runId, { completed_at: new Date().toISOString() }));

    return { runId, decision: gate.decision, uncovered };
  }
);

export const discoveryFunctions = [discoveryPostCall];
