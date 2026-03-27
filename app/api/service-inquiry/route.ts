import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, linkedin, service } = body;

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

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "CappaWork <nate@cappawork.com>",
      to: process.env.EMAIL_TO || "nate@cappawork.com",
      subject: `New inquiry: ${service}`,
      text: [
        `New service inquiry from cappawork.com`,
        ``,
        `Service: ${service}`,
        `Email: ${email.trim()}`,
        `LinkedIn: ${linkedin.trim().startsWith("http") ? linkedin.trim() : `https://linkedin.com/in/${linkedin.trim().replace(/^@/, "")}`}`,
        ``,
        `—`,
        `Reach out via LinkedIn DM to follow up.`,
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
