import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAdmin } from "@/lib/auth/guards";
import { createDeal } from "@/server/repos/bd-deals";

export const runtime = "nodejs";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a BD assistant for CappaWork, an AI consultancy targeting founder-led service businesses doing $3M+ revenue. Your job is to parse lead information into a structured deal card.

Given a message from the user — which could be a quick note about a lead, a pasted LinkedIn profile, a forwarded email, or a URL — extract whatever information you can into this JSON structure:

{
  "name": "Deal name — use format: Company Name or Contact Name if no company",
  "company": "Company name if mentioned",
  "contact_name": "Full name of the contact",
  "contact_title": "Their title/role (CEO, President, Owner, etc.)",
  "email": "Email if provided (look for email addresses in signatures, headers, from fields, etc.)",
  "linkedin_url": "LinkedIn profile URL if provided",
  "value": null,
  "source": "linkedin | referral | inbound | calculator | other",
  "referral_partner": "Name of person who referred them, if mentioned",
  "notes": "Any additional context the user provided that doesn't fit other fields",
  "message": "A brief friendly confirmation of what you created"
}

Rules:
- Always return valid JSON, nothing else
- ALWAYS place new leads in the "lead" stage — never skip stages
- Set source to "linkedin" if LinkedIn is mentioned or a LinkedIn URL is provided
- Set source to "referral" if someone referred the lead
- Set source to "inbound" if they reached out first or if the input looks like an inbound email
- If the user just gives a name with no context, that's fine — fill what you can, leave the rest null
- For value, only set it if the user explicitly mentions a dollar amount. Don't guess.
- The "message" field should be a short, natural confirmation like "Added John Smith from Acme — looks like a good fit for a diagnostic."
- If the info looks like it's from a LinkedIn profile (has headline, experience, etc.), extract the most relevant current role and company
- If the input looks like a forwarded or pasted email, extract the sender's name, email, company (from domain or signature), and title. Summarize the email content in notes. Set source to "inbound".
- If the input has email headers (From:, Subject:, etc.) or a signature block, parse those carefully for contact details
- Keep notes concise — just capture context that matters for follow-up`;

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const { message } = await request.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: message.trim() }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse response" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const confirmMessage = parsed.message || "Deal created.";

    // Create the deal
    const deal = await createDeal({
      name: parsed.name || "Untitled Lead",
      company: parsed.company || null,
      contact_name: parsed.contact_name || null,
      contact_title: parsed.contact_title || null,
      email: parsed.email || null,
      linkedin_url: parsed.linkedin_url || null,
      value: parsed.value ? parseInt(parsed.value) : null,
      stage: "lead",
      source: parsed.source || "linkedin",
      referral_partner: parsed.referral_partner || null,
      catalyst_id: null,
      follow_up_date: null,
      next_action: null,
      notes: parsed.notes || null,
    });

    return NextResponse.json({ deal, message: confirmMessage });
  } catch (error) {
    console.error("Deal parse error:", error);
    return NextResponse.json(
      { error: "Failed to process" },
      { status: 500 }
    );
  }
}
