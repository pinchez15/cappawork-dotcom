import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { updateSignalStatusSchema } from "@/lib/validators/li-signals";
import { updateLiOutreachStatus } from "@/server/services/li-signals/status";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    await requireAdmin();
    const { accountId } = await params;
    const body = await request.json();
    const parsed = updateSignalStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid status", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await updateLiOutreachStatus({
      accountId,
      status: parsed.data.status,
      contactId: parsed.data.contact_id,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    if (message.includes("FORBIDDEN") || message.includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
