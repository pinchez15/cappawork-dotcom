import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAdmin } from "@/lib/auth/guards";
import { createCatalyst } from "@/server/repos/bd-catalysts";

export const runtime = "nodejs";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a BD assistant for CappaWork, an AI consultancy targeting founder-led service businesses doing $3M+ revenue. Your job is to parse information about a potential referral catalyst — someone who knows the ICP and could send referrals.

Catalysts are professionals who serve the same audience: CPAs, attorneys, business coaches, fractional executives, EOS implementers, insurance brokers, bankers, consultants, and peer founders.

Given a message — which could be a quick note, a pasted LinkedIn profile, a forwarded email, or a URL — extract whatever information you can into this JSON structure:

{
  "name": "Full name of the person",
  "company": "Their firm or company name",
  "title": "Their title/role",
  "email": "Email if provided",
  "phone": "Phone if provided",
  "linkedin_url": "LinkedIn profile URL if provided",
  "category": "cpa | attorney | coach | fractional | eos | insurance | banker | consultant | peer | other",
  "relationship": "cold | warm | strong | champion",
  "notes": "Any additional context about how you know them, why they're valuable, etc.",
  "next_action": "Suggested first action if none specified",
  "message": "A brief friendly confirmation of what you created"
}

Rules:
- Always return valid JSON, nothing else
- For category, pick the best match from: cpa, attorney, coach, fractional, eos, insurance, banker, consultant, peer, other
  - "cpa" = CPAs, accountants, bookkeepers, tax professionals
  - "attorney" = lawyers, legal professionals
  - "coach" = business coaches, executive coaches, leadership coaches
  - "fractional" = fractional CFOs, COOs, CMOs, CTOs
  - "eos" = EOS implementers, Traction coaches
  - "insurance" = insurance brokers/agents
  - "banker" = bankers, financial advisors, wealth managers
  - "consultant" = management consultants, strategy consultants
  - "peer" = fellow founders, business owners, CEO peer group members
  - "other" = doesn't fit any category
- Default relationship to "cold" unless context suggests otherwise (e.g. "my buddy" = warm, "close friend" = strong, "sends me deals regularly" = champion)
- If the user just gives a name, that's fine — fill what you can, leave the rest null
- For next_action, suggest something like "Send intro message on LinkedIn" or "Schedule coffee chat" if the user didn't specify one
- The "message" field should be a short confirmation like "Added Mike Johnson (CPA) — cold lead, suggested reaching out on LinkedIn."
- If info looks like a LinkedIn profile, extract role, company, and categorize appropriately
- If it's a forwarded email, extract contact details from headers/signature and summarize context in notes
- Keep notes concise — just capture what matters for the relationship`;

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

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse response" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const confirmMessage = parsed.message || "Catalyst created.";

    const catalyst = await createCatalyst({
      name: parsed.name || "Unknown",
      company: parsed.company || null,
      title: parsed.title || null,
      email: parsed.email || null,
      phone: parsed.phone || null,
      linkedin_url: parsed.linkedin_url || null,
      category: parsed.category || "other",
      relationship: parsed.relationship || "cold",
      notes: parsed.notes || null,
      last_contact_date: null,
      next_contact_date: null,
      next_action: parsed.next_action || null,
    });

    return NextResponse.json({ catalyst, message: confirmMessage });
  } catch (error) {
    console.error("Catalyst parse error:", error);
    return NextResponse.json(
      { error: "Failed to process" },
      { status: 500 }
    );
  }
}
