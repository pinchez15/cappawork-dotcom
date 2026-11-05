import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { requireAdmin } from "@/lib/auth/guards";
import { importSignalsSchema } from "@/lib/validators/li-signals";
import { importLiSignals } from "@/server/services/li-signals/import";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Loads the built-in building-products signal research from supabase/seed
 * and imports it into gtm_accounts / gtm_contacts / gtm_signals.
 */
export async function POST() {
  try {
    await requireAdmin();

    const seedDir = join(process.cwd(), "supabase", "seed");
    const raw = await readFile(join(seedDir, "li_signals.json"), "utf8");
    const signalsFile = JSON.parse(raw) as {
      signals?: unknown[];
      no_signal?: string[];
    };

    let noSignal = signalsFile.no_signal || [];
    if (!noSignal.length) {
      try {
        const nosigRaw = await readFile(join(seedDir, "nosig.json"), "utf8");
        noSignal = JSON.parse(nosigRaw) as string[];
      } catch {
        // optional
      }
    }

    const parsed = importSignalsSchema.safeParse({
      signals: signalsFile.signals || [],
      no_signal: noSignal,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Seed file failed validation", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await importLiSignals(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Seed failed";
    if (message.includes("FORBIDDEN") || message.includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    console.error("Signal seed error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
