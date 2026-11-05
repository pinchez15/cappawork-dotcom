import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { importSignalsSchema } from "@/lib/validators/li-signals";
import { importLiSignals } from "@/server/services/li-signals/import";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = importSignalsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid import payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await importLiSignals(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Import failed";
    if (message.includes("FORBIDDEN") || message.includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    console.error("Signal import error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
