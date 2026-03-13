import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { getTasks, createTask } from "@/server/repos/admin-tasks";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || undefined;
    const priority = url.searchParams.get("priority") || undefined;
    const project_id = url.searchParams.get("project_id") || undefined;

    const tasks = await getTasks({ status, priority, project_id });
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const { title, description, project_id, status, priority, due_date, source, notes, created_by } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const task = await createTask({
      title: title.trim(),
      description: description?.trim() || null,
      project_id: project_id || null,
      status: status || "todo",
      priority: priority || "medium",
      due_date: due_date || null,
      source: source || "manual",
      notes: notes?.trim() || null,
      created_by: created_by?.trim() || null,
    });

    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
