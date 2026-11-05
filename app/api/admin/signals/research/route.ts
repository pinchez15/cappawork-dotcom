import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { researchSignalsSchema } from "@/lib/validators/li-signals";
import {
  researchAccountSignals,
  researchListSignals,
} from "@/server/services/li-signals/research";
import { inngest } from "@/lib/inngest/client";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = researchSignalsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { account_id, list_id, account_ids } = parsed.data;

    if (account_id) {
      const result = await researchAccountSignals(account_id);
      return NextResponse.json(result);
    }

    if (list_id) {
      const hasInngest =
        process.env.INNGEST_EVENT_KEY || process.env.INNGEST_SIGNING_KEY;
      if (hasInngest && (account_ids?.length || 0) !== 1) {
        await inngest.send({
          name: "li-signals/research-list",
          data: { listId: list_id, accountIds: account_ids },
        });
        return NextResponse.json({
          queued: true,
          message: "Signal research queued for this list",
        });
      }
      const result = await researchListSignals(list_id, account_ids);
      return NextResponse.json(result);
    }

    if (account_ids?.length) {
      const results = [];
      for (const id of account_ids) {
        results.push(await researchAccountSignals(id));
      }
      return NextResponse.json({
        researched: results.length,
        with_signal: results.filter((r) => r.result.has_signal).length,
        no_signal: results.filter((r) => !r.result.has_signal).length,
        results,
      });
    }

    return NextResponse.json(
      { error: "Provide account_id, list_id, or account_ids" },
      { status: 400 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Research failed";
    if (message.includes("FORBIDDEN") || message.includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    if (err instanceof Error && "status" in err && (err as { status: number }).status === 429) {
      return NextResponse.json(
        { error: "Rate limited. Wait a minute and try again." },
        { status: 429 }
      );
    }
    console.error("Signal research error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
