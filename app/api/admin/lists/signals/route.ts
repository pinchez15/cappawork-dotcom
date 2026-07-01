import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { getPendingSignals } from "@/server/repos/gtm-signals";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const signals = await getPendingSignals();
    return NextResponse.json({ signals });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
