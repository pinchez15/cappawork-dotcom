import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { RunListActionSchema } from "@/lib/validators/list-builder";
import { startListRun } from "@/server/services/list-builder/runner";
import { inngest } from "@/lib/inngest/client";
import {
  runListGeneration,
  runListEnrichment,
  runListScoring,
  runHypothesisGeneration,
  runPromote,
} from "@/server/services/list-builder/runner";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ listId: string }> };

async function dispatchRun(
  action: string,
  listId: string,
  runId: string,
  accountIds?: string[]
) {
  const eventMap: Record<string, string> = {
    generate: "list-builder/generate",
    enrich: "list-builder/enrich",
    score: "list-builder/score",
    hypothesis: "list-builder/hypothesis",
    promote: "list-builder/promote",
  };

  const eventName = eventMap[action];
  if (!eventName) throw new Error(`Unknown action: ${action}`);

  if (process.env.INNGEST_EVENT_KEY || process.env.INNGEST_SIGNING_KEY) {
    await inngest.send({
      name: eventName as "list-builder/generate",
      data: { listId, runId, accountIds },
    });
    return;
  }

  const runners: Record<string, () => Promise<unknown>> = {
    generate: () => runListGeneration(listId, runId),
    enrich: () => runListEnrichment(listId, runId, accountIds),
    score: () => runListScoring(listId, runId, accountIds),
    hypothesis: () => runHypothesisGeneration(listId, runId, accountIds || []),
    promote: () => runPromote(listId, runId, accountIds || []),
  };

  const runner = runners[action];
  if (runner) {
    runner().catch((err) => console.error(`List run ${runId} failed:`, err));
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { listId } = await params;
    const body = await request.json();
    const parsed = RunListActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { action, account_ids } = parsed.data;

    if ((action === "hypothesis" || action === "promote") && !account_ids?.length) {
      return NextResponse.json(
        { error: "account_ids required" },
        { status: 400 }
      );
    }

    const run = await startListRun(listId, action, undefined, account_ids);
    await dispatchRun(action, listId, run.id, account_ids);

    return NextResponse.json({ run, message: `${action} started` });
  } catch (err) {
    console.error("Run error:", err);
    return NextResponse.json({ error: "Failed to start run" }, { status: 500 });
  }
}
