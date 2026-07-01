import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { reviewGtmSignal, incrementAccountSignalCount } from "@/server/repos/gtm-signals";
import { ReviewSignalSchema } from "@/lib/validators/list-builder";
import { updateGtmAccount, getGtmAccount } from "@/server/repos/gtm-accounts";
import { calculateFitScore, calculatePainScore } from "@/server/services/list-builder/scoring";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ signalId: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { signalId } = await params;
    const body = await request.json();
    const parsed = ReviewSignalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const signal = await reviewGtmSignal(signalId, parsed.data.review_status);

    if (parsed.data.review_status === "accepted") {
      await incrementAccountSignalCount(signal.account_id);
      const account = await getGtmAccount(signal.account_id);
      if (account) {
        const fit = calculateFitScore(
          { ...account, signal_count: account.signal_count + 1 },
          null,
          account.vertical_tier
        );
        const pain = calculatePainScore(
          { ...account, signal_count: account.signal_count + 1 },
          null
        );
        await updateGtmAccount(signal.account_id, {
          signal_count: account.signal_count + 1,
          fit_score: fit.score,
          pain_score: pain.score,
          gtm_stage: "signal_found",
          next_action: fit.nextAction,
        });
      }
    }

    return NextResponse.json(signal);
  } catch {
    return NextResponse.json({ error: "Failed to review signal" }, { status: 500 });
  }
}
