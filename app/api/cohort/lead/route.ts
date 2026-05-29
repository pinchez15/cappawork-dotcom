import { NextRequest, NextResponse } from "next/server";
import { createLead, type CohortType } from "@/server/repos/cohorts";
import { sendLeadNotification } from "@/lib/cohort/notifications";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TYPES: CohortType[] = ["build", "literacy"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, linkedin, cohortType } = body ?? {};

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    if (!linkedin || typeof linkedin !== "string" || linkedin.trim().length === 0) {
      return NextResponse.json(
        { error: "A LinkedIn profile is required" },
        { status: 400 }
      );
    }

    if (!cohortType || !VALID_TYPES.includes(cohortType)) {
      return NextResponse.json(
        { error: "Invalid cohort" },
        { status: 400 }
      );
    }

    // Normalize: accept a full URL or a bare username/handle.
    const raw = linkedin.trim();
    const linkedinUrl = raw.startsWith("http")
      ? raw
      : `https://linkedin.com/in/${raw.replace(/^@/, "")}`;

    const lead = await createLead({
      name: typeof name === "string" && name.trim().length > 0 ? name.trim() : null,
      email: email.trim(),
      linkedin_url: linkedinUrl,
      cohort_type: cohortType,
      source: "landing_page",
    });

    // Notify Nate. Don't fail the request if the email send hiccups — the lead
    // is already saved and visible in /admin/leads.
    try {
      await sendLeadNotification({
        name: lead.name,
        email: lead.email,
        linkedin_url: lead.linkedin_url,
        cohort_type: lead.cohort_type,
      });
    } catch (notifyError) {
      console.error("Failed to send cohort lead notification:", notifyError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cohort lead submission failed:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
