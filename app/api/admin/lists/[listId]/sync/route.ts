import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { PromoteAccountsSchema } from "@/lib/validators/list-builder";
import { startListRun, runPromote } from "@/server/services/list-builder/runner";
import { inngest } from "@/lib/inngest/client";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ listId: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { listId } = await params;
    const body = await request.json();
    const parsed = PromoteAccountsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const run = await startListRun(
      listId,
      "promote",
      undefined,
      parsed.data.account_ids
    );

    if (process.env.INNGEST_EVENT_KEY || process.env.INNGEST_SIGNING_KEY) {
      await inngest.send({
        name: "list-builder/promote",
        data: {
          listId,
          runId: run.id,
          accountIds: parsed.data.account_ids,
        },
      });
    } else {
      runPromote(listId, run.id, parsed.data.account_ids).catch(console.error);
    }

    return NextResponse.json({ run, message: "Promote to pipeline started" });
  } catch (err) {
    console.error("Promote error:", err);
    return NextResponse.json({ error: "Failed to promote" }, { status: 500 });
  }
}
