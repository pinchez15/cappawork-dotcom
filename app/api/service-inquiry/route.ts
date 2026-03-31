import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createDeal } from "@/server/repos/bd-deals";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SERVICE_VALUES: Record<string, number> = {
  "AI Team": 90000,
  "AI Strategy Advisor": 2000,
  "AI VP Cohort": 3500,
  "Something else": 0,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, linkedin, service } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!linkedin || typeof linkedin !== "string") {
      return NextResponse.json(
        { error: "LinkedIn username is required" },
        { status: 400 }
      );
    }

    if (!service || typeof service !== "string") {
      return NextResponse.json(
        { error: "Service selection is required" },
        { status: 400 }
      );
    }

    const linkedinUrl = linkedin.trim().startsWith("http")
      ? linkedin.trim()
      : `https://linkedin.com/in/${linkedin.trim().replace(/^@/, "")}`;

    const dealValue = SERVICE_VALUES[service] ?? 0;

    // Create deal in pipeline
    try {
      await createDeal({
        name: `${name.trim()} — ${service}`,
        company: null,
        contact_name: name.trim(),
        contact_title: null,
        email: email.trim(),
        linkedin_url: linkedinUrl,
        value: dealValue || null,
        stage: "lead",
        source: "inbound",
        referral_partner: null,
        catalyst_id: null,
        follow_up_date: null,
        next_action: `Follow up re: ${service}`,
        notes: `Inbound inquiry from cappawork.com. Interested in: ${service}.`,
      });
    } catch (dealError) {
      console.error("Failed to create deal:", dealError);
      // Don't fail the request if deal creation fails — still send the email
    }

    // Send notification email
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "CappaWork <onboarding@resend.dev>",
      to: process.env.EMAIL_TO || "nate@cappawork.com",
      subject: `New inquiry: ${service}`,
      text: [
        `New inquiry from cappawork.com`,
        ``,
        `Name: ${name.trim()}`,
        `Interested in: ${service}`,
        `Deal value: ${dealValue ? `$${dealValue.toLocaleString()}` : "TBD"}`,
        `Email: ${email.trim()}`,
        `LinkedIn: ${linkedinUrl}`,
        ``,
        `Added to pipeline as a lead.`,
      ].join("\n"),
    });

    if (error) {
      console.error("Failed to send service inquiry email:", error);
      return NextResponse.json(
        { error: "Failed to send inquiry" },
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
