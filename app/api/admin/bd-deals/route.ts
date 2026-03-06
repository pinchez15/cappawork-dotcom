import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { createDeal, getDealsByStage } from "@/server/repos/bd-deals";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const stages = await getDealsByStage();
    return NextResponse.json(stages);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const { name, company, contact_name, contact_title, email, linkedin_url, value, stage, source, referral_partner, notes } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const deal = await createDeal({
      name: name.trim(),
      company: company?.trim() || null,
      contact_name: contact_name?.trim() || null,
      contact_title: contact_title?.trim() || null,
      email: email?.trim() || null,
      linkedin_url: linkedin_url?.trim() || null,
      value: value ? parseInt(value) : null,
      stage: stage || "lead",
      source: source || "linkedin",
      referral_partner: referral_partner?.trim() || null,
      notes: notes?.trim() || null,
    });

    return NextResponse.json(deal);
  } catch {
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}
