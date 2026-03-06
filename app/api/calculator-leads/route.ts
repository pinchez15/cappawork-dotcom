import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db/client";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, email, company, inputs, results } = body;

    if (
      !firstName ||
      typeof firstName !== "string" ||
      !email ||
      typeof email !== "string" ||
      !company ||
      typeof company !== "string"
    ) {
      return NextResponse.json(
        { error: "First name, email, and company are required" },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("calculator_leads")
      .insert({
        first_name: firstName.trim().slice(0, 100),
        email: email.trim().toLowerCase().slice(0, 255),
        company: company.trim().slice(0, 200),
        inputs: inputs || {},
        results: results || {},
      });

    if (error) {
      console.error("Failed to save calculator lead:", error);
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
