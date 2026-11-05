import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import {
  getLiSignalRows,
  getLiSignalStats,
} from "@/server/repos/gtm-signals";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const signal_type = url.searchParams.get("signal_type") || undefined;
    const outreach_status = url.searchParams.get("status") || undefined;
    const min_score = url.searchParams.get("min_score")
      ? parseInt(url.searchParams.get("min_score")!, 10)
      : undefined;
    const include_no_signal = url.searchParams.get("include_no_signal") === "1";

    const [rows, stats] = await Promise.all([
      getLiSignalRows({
        signal_type,
        outreach_status,
        min_score,
        include_no_signal,
      }),
      getLiSignalStats(),
    ]);

    return NextResponse.json({ rows, stats });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
