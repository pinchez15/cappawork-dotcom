import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { createCatalyst, getCatalysts } from "@/server/repos/bd-catalysts";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const catalysts = await getCatalysts();
    return NextResponse.json(catalysts);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const catalyst = await createCatalyst({
      name: body.name.trim(),
      company: body.company?.trim() || null,
      title: body.title?.trim() || null,
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      linkedin_url: body.linkedin_url?.trim() || null,
      category: body.category || "other",
      relationship: body.relationship || "cold",
      notes: body.notes?.trim() || null,
      last_contact_date: body.last_contact_date || null,
      next_contact_date: body.next_contact_date || null,
      next_action: body.next_action?.trim() || null,
    });

    return NextResponse.json(catalyst);
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
