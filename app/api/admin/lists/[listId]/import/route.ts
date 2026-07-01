import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { CsvImportRowSchema } from "@/lib/validators/list-builder";
import { startListRun } from "@/server/services/list-builder/runner";
import { inngest } from "@/lib/inngest/client";
import { importCsvAccounts } from "@/server/services/list-builder/runner";
import { updateList } from "@/server/repos/lists";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ listId: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { listId } = await params;
    const body = await request.json();

    if (!body.rows || !Array.isArray(body.rows)) {
      return NextResponse.json({ error: "rows array required" }, { status: 400 });
    }

    const rows = body.rows
      .map((row: unknown) => CsvImportRowSchema.safeParse(row))
      .filter((r) => r.success)
      .map((r) => r.data);

    if (!rows.length) {
      return NextResponse.json({ error: "No valid rows" }, { status: 400 });
    }

    await updateList(listId, { source_provider: "csv" });
    const run = await startListRun(listId, "import", "csv");

    if (process.env.INNGEST_EVENT_KEY || process.env.INNGEST_SIGNING_KEY) {
      await inngest.send({
        name: "list-builder/import",
        data: { listId, runId: run.id, rows },
      });
    } else {
      importCsvAccounts(listId, run.id, rows).catch(console.error);
    }

    return NextResponse.json({
      run,
      message: `Importing ${rows.length} accounts`,
    });
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
