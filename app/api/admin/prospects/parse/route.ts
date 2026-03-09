import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAdmin } from "@/lib/auth/guards";
import {
  createProspect,
  calculatePriorityScore,
  calculateEnrichmentStatus,
} from "@/server/repos/prospects";
import { getVerticals } from "@/server/repos/verticals";

export const runtime = "nodejs";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a BD assistant for CappaWork, an AI transformation consultancy targeting founder-led service businesses doing $3-10M in revenue.

Your job is to parse information about a target company and create a structured prospect record. The input might be:
- A company website URL
- A LinkedIn company page URL
- A quick text description ("Acme Staffing, Austin TX, ~$5M revenue")
- A pasted company profile or job posting
- Multiple companies at once (one per line or comma-separated)

For EACH company, return a JSON object. If there are multiple companies, return a JSON array.

For a single company, return:
{
  "company_name": "Company name",
  "estimated_revenue": "$3M-$5M" or "$5M-$10M" or "$10M+" or null,
  "location": "City, State" or null,
  "website": "https://..." or null,
  "vertical_match": "Best matching vertical name from the available list, or null",
  "decision_maker_name": "CEO/Owner name if findable, or null",
  "decision_maker_title": "Their title, or null",
  "linkedin_url": "Their LinkedIn URL if findable, or null",
  "key_pain_point": "Likely operational pain point based on vertical and size, or null",
  "why_closes_fast": "Why they'd buy a $30K diagnostic, or null",
  "trigger_event": "Any recent trigger if found, or null",
  "trigger_event_source": "linkedin_post | job_posting | news | ai_generated | null",
  "tech_stack_signal": "Visible tech/tools, or null",
  "tech_stack_source": "job_posting | website | linkedin | ai_generated | null",
  "personalized_first_line": "A personalized opening line for outreach, or null",
  "cold_email_hook": "A punchy email opener, or null",
  "sales_nav_search_tip": "Helpful Sales Nav search tip for this company, or null",
  "message": "Brief confirmation of what you found"
}

For multiple companies, return:
{
  "prospects": [{ ... }, { ... }],
  "message": "Added X companies to the prospect list."
}

Available verticals (match to the closest one):
{{VERTICALS}}

Rules:
- Always return valid JSON, nothing else
- If given a URL, use web search to research the company
- For revenue estimates, use signals like employee count, office locations, job postings. Service businesses with 20-50 employees are typically $3M-$10M.
- Be honest when fields are AI-generated vs discovered. If you search and find real data, that's preferred.
- For the personalized first line, sound like a peer founder — direct, insight-led, no pitch. Reference something specific about the company.
- If you can't determine the vertical, set vertical_match to null
- When processing multiple companies, do your best with each one independently`;

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

    // Get verticals for matching
    const verticals = await getVerticals();
    const verticalList = verticals
      .map((v) => `- ${v.name} (Tier ${v.tier})`)
      .join("\n");

    const systemPrompt = SYSTEM_PROMPT.replace("{{VERTICALS}}", verticalList || "None configured yet");

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
          max_uses: 5,
        },
      ],
      messages: [{ role: "user", content: message.trim() }],
    });

    // Extract text
    const textBlocks = response.content.filter((b) => b.type === "text");
    const text = textBlocks
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse response" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Handle single vs multiple
    const prospectDataList = parsed.prospects
      ? (parsed.prospects as Record<string, unknown>[])
      : [parsed];

    const created = [];

    for (const data of prospectDataList) {
      if (!data.company_name) continue;

      // Match vertical
      let verticalId: string | null = null;
      let verticalTier: number | null = null;
      if (data.vertical_match) {
        const match = verticals.find(
          (v) =>
            v.name.toLowerCase() === (data.vertical_match as string).toLowerCase()
        );
        if (match) {
          verticalId = match.id;
          verticalTier = match.tier;
        }
      }

      const prospectData = {
        vertical_id: verticalId,
        company_name: data.company_name as string,
        estimated_revenue: (data.estimated_revenue as string) || null,
        location: (data.location as string) || null,
        website: (data.website as string) || null,
        decision_maker_name: (data.decision_maker_name as string) || null,
        decision_maker_title: (data.decision_maker_title as string) || null,
        linkedin_url: (data.linkedin_url as string) || null,
        email_verified: null,
        email_source: null,
        key_pain_point: (data.key_pain_point as string) || null,
        why_closes_fast: (data.why_closes_fast as string) || null,
        trigger_event: (data.trigger_event as string) || null,
        trigger_event_source: (data.trigger_event_source as string) || null,
        trigger_event_date: null,
        tech_stack_signal: (data.tech_stack_signal as string) || null,
        tech_stack_source: (data.tech_stack_source as string) || null,
        personalized_first_line: (data.personalized_first_line as string) || null,
        cold_email_hook: (data.cold_email_hook as string) || null,
        sales_nav_search_tip: (data.sales_nav_search_tip as string) || null,
        sequence_stage: "not_started" as const,
      };

      const { score, breakdown } = calculatePriorityScore(
        prospectData,
        verticalTier
      );
      const enrichmentStatus = calculateEnrichmentStatus(prospectData);

      const prospect = await createProspect({
        ...prospectData,
        priority_score: score,
        score_breakdown: breakdown,
        enrichment_status: enrichmentStatus,
      });

      created.push(prospect);
    }

    const confirmMessage =
      parsed.message ||
      `Added ${created.length} prospect${created.length !== 1 ? "s" : ""}.`;

    return NextResponse.json({
      prospects: created,
      count: created.length,
      message: confirmMessage,
    });
  } catch (error) {
    console.error("Prospect parse error:", error);
    return NextResponse.json(
      { error: "Failed to process" },
      { status: 500 }
    );
  }
}
