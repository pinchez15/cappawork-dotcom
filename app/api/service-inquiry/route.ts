import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createDeal } from "@/server/repos/bd-deals";
import { isRevenueBand } from "@/lib/discovery";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, linkedin, service, company, role, revenue } = body;

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

    if (!company || typeof company !== "string" || company.trim().length === 0) {
      return NextResponse.json(
        { error: "Company is required" },
        { status: 400 }
      );
    }

    if (!role || typeof role !== "string" || role.trim().length === 0) {
      return NextResponse.json(
        { error: "Role is required" },
        { status: 400 }
      );
    }

    if (!revenue || typeof revenue !== "string" || !isRevenueBand(revenue)) {
      return NextResponse.json(
        { error: "Annual revenue is required" },
        { status: 400 }
      );
    }

    const serviceName =
      typeof service === "string" && service.trim().length > 0
        ? service.trim()
        : "Discovery";

    const linkedinUrl =
      typeof linkedin === "string" && linkedin.trim().length > 0
        ? linkedin.trim().startsWith("http")
          ? linkedin.trim()
          : `https://linkedin.com/in/${linkedin.trim().replace(/^@/, "")}`
        : null;

    // Create deal in pipeline
    try {
      await createDeal({
        name: `${name.trim()} — ${company.trim()}`,
        company: company.trim(),
        contact_name: name.trim(),
        contact_title: role.trim(),
        email: email.trim(),
        linkedin_url: linkedinUrl,
        value: null,
        stage: "lead",
        source: "inbound",
        referral_partner: null,
        catalyst_id: null,
        expected_close_date: null,
        follow_up_date: null,
        next_action: `Follow up re: ${serviceName}`,
        notes: `Inbound discovery from cappawork.com. Role: ${role.trim()}. Annual revenue: ${revenue}. Interested in: ${serviceName}.`,
      });
    } catch (dealError) {
      console.error("Failed to create deal:", dealError);
    }

    // Bridge to List Builder for enrichment + scoring (non-blocking)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      import("@/server/services/list-builder/inbound-bridge")
        .then(({ processInboundLead }) =>
          processInboundLead({
            source: "service_inquiry",
            company_name: company.trim(),
            contact_name: name.trim(),
            contact_email: email.trim(),
            contact_title: role.trim(),
            linkedin_url: linkedinUrl ?? undefined,
            created_by: "system",
            metadata: { service: serviceName, role: role.trim(), revenue },
          })
        )
        .catch((err) => console.error("List Builder inbound bridge failed:", err));
    }

    // Send notification email
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "CappaWork <onboarding@resend.dev>",
      to: process.env.EMAIL_TO || "nate@cappawork.com",
      subject: `Discovery request: ${company.trim()}`,
      text: [
        `New discovery request from cappawork.com`,
        ``,
        `Name: ${name.trim()}`,
        `Role: ${role.trim()}`,
        `Company: ${company.trim()}`,
        `Annual revenue: ${revenue}`,
        `Interested in: ${serviceName}`,
        `Email: ${email.trim()}`,
        linkedinUrl ? `LinkedIn: ${linkedinUrl}` : null,
        ``,
        `Added to pipeline as a lead.`,
      ]
        .filter((line) => line !== null)
        .join("\n"),
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
