import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { getGtmAccountDetail } from "@/server/repos/gtm-accounts";
import { approveGtmHypothesis } from "@/server/repos/gtm-hypotheses";
import { ApproveHypothesisSchema } from "@/lib/validators/list-builder";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ listId: string; accountId: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { accountId } = await params;
    const account = await getGtmAccountDetail(accountId);

    if (!account) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { accountId } = await params;
    const body = await request.json();

    if (body.action === "approve_hypothesis") {
      const parsed = ApproveHypothesisSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }

      const account = await getGtmAccountDetail(accountId);
      const hypothesis = account?.hypothesis as { id: string } | null;
      if (!hypothesis?.id) {
        return NextResponse.json({ error: "No hypothesis found" }, { status: 404 });
      }

      const updated = await approveGtmHypothesis(
        hypothesis.id,
        parsed.data.approval_status,
        parsed.data.edits
      );
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
