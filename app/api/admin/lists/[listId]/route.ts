import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import {
  getList,
  updateList,
  deleteList,
  cloneList,
} from "@/server/repos/lists";
import { getRunsForList } from "@/server/repos/list-runs";
import { UpdateListSchema } from "@/lib/validators/list-builder";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ listId: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { listId } = await params;
    const [list, runs] = await Promise.all([
      getList(listId),
      getRunsForList(listId),
    ]);

    if (!list) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ list, runs });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { listId } = await params;
    const body = await request.json();
    const parsed = UpdateListSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const list = await updateList(listId, parsed.data);
    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { listId } = await params;
    await deleteList(listId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAdmin();
    const { listId } = await params;
    const body = await request.json();

    if (body.action === "clone") {
      const cloned = await cloneList(listId, user.userId);
      return NextResponse.json(cloned);
    }

    if (body.action === "archive") {
      const list = await updateList(listId, { status: "archived" });
      return NextResponse.json(list);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
