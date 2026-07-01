import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { getLists, getListStats, createList } from "@/server/repos/lists";
import { CreateListSchema } from "@/lib/validators/list-builder";
import { getVerticals } from "@/server/repos/verticals";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const [lists, stats, verticals] = await Promise.all([
      getLists(),
      getListStats(),
      getVerticals(),
    ]);
    return NextResponse.json({ lists, stats, verticals });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await request.json();
    const parsed = CreateListSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { criteria, ...listData } = parsed.data;
    const list = await createList(
      {
        ...listData,
        vertical_id: listData.vertical_id ?? null,
        description: listData.description ?? null,
        icp_template: listData.icp_template ?? null,
        notes: listData.notes ?? null,
        status: "draft",
        created_by: user.userId,
      },
      criteria
    );

    return NextResponse.json(list);
  } catch (err) {
    console.error("Create list error:", err);
    return NextResponse.json({ error: "Failed to create list" }, { status: 500 });
  }
}
