import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { DiscoveryRunSchema } from "@/lib/validators/discovery";
import { queueDiscoveryRun } from "@/server/services/discovery";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ accountId: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { accountId } = await params;

  const parsed = DiscoveryRunSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const run = await queueDiscoveryRun(accountId, {
      transcript: parsed.data.transcript,
      research: parsed.data.research,
      constraintMap: parsed.data.constraint_map,
      defaults: parsed.data.defaults,
      priceUsd: parsed.data.price_usd,
    });
    return NextResponse.json(run, { status: 202 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to queue run";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
