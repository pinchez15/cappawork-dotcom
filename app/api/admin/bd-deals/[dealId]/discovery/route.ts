import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { DiscoveryPatchSchema } from "@/lib/validators/discovery";
import {
  addConstraint,
  confirmPrimaryConstraint,
  ensureDeal,
  getDiscoveryView,
  setField,
  updateDeal,
} from "@/server/repos/discovery";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ dealId: string }> };

async function authorized() {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { dealId } = await params;
  return NextResponse.json(await getDiscoveryView(dealId));
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { dealId } = await params;

  const parsed = DiscoveryPatchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;

  try {
    const deal = await ensureDeal(dealId);
    switch (body.action) {
      case "set_field":
        await setField({
          dealId: deal.id,
          field: body.field,
          items: body.items,
          source: body.source,
          constraintId: body.constraint_id,
        });
        break;
      case "set_hypothesis":
        await updateDeal(deal.id, { hypothesis: body.hypothesis.trim() || null });
        break;
      case "set_price":
        await updateDeal(deal.id, { price_usd: body.price_usd });
        break;
      case "add_constraint":
        await addConstraint(deal.id);
        break;
      case "confirm_primary":
        await confirmPrimaryConstraint(deal.id, body.constraint_id);
        break;
    }
    return NextResponse.json(await getDiscoveryView(dealId));
  } catch (err) {
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message ?? "Failed";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
