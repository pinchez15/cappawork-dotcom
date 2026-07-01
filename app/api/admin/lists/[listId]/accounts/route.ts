import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { getAccountsForList, bulkUpdateMemberships } from "@/server/repos/list-memberships";
import type { ListAccount } from "@/server/repos/list-memberships";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ listId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { listId } = await params;
    const url = new URL(request.url);
    const reviewStatus = url.searchParams.get("review_status") || undefined;
    const minFitScore = url.searchParams.get("min_fit_score")
      ? parseInt(url.searchParams.get("min_fit_score")!)
      : undefined;

    const accounts = await getAccountsForList(listId, {
      review_status: reviewStatus,
      min_fit_score: minFitScore,
    });

    return NextResponse.json({ accounts });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { listId } = await params;
    const body = await request.json();
    const { account_ids, updates } = body;

    if (!account_ids?.length) {
      return NextResponse.json({ error: "account_ids required" }, { status: 400 });
    }

    await bulkUpdateMemberships(listId, account_ids, updates);
    const accounts = await getAccountsForList(listId);
    return NextResponse.json({ accounts });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
