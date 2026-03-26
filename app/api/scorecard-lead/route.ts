import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db/client";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, revenue_range, industry, answers, scores, overall_grade, top_leak, utm_source, utm_medium, utm_campaign, utm_content, utm_term, fb_click_id } = body;

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase().slice(0, 255);

    // If scores are present, this is a quiz completion update
    if (scores && answers) {
      const { error } = await supabaseAdmin
        .from("scorecard_leads")
        .update({
          answers,
          scores,
          overall_grade: overall_grade || null,
          top_leak: top_leak || null,
          updated_at: new Date().toISOString(),
        })
        .eq("email", normalizedEmail);

      if (error) {
        console.error("Failed to update scorecard lead scores:", error);
        return NextResponse.json(
          { error: "Failed to save scores" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // Otherwise this is the initial email capture — upsert
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("scorecard_leads")
      .upsert(
        {
          name: name.trim().slice(0, 200),
          email: normalizedEmail,
          revenue_range: revenue_range?.trim().slice(0, 100) || null,
          industry: industry?.trim().slice(0, 100) || null,
          utm_source: utm_source || null,
          utm_medium: utm_medium || null,
          utm_campaign: utm_campaign || null,
          utm_content: utm_content || null,
          utm_term: utm_term || null,
          fb_click_id: fb_click_id || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

    if (error) {
      console.error("Failed to save scorecard lead:", error);
      return NextResponse.json(
        { error: "Failed to save" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
