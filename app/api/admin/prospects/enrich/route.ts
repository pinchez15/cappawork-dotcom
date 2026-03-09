import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAdmin } from "@/lib/auth/guards";
import {
  getProspect,
  updateProspect,
  calculatePriorityScore,
} from "@/server/repos/prospects";
import { getVertical } from "@/server/repos/verticals";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an AI sales intelligence researcher for CappaWork, an AI transformation consultancy targeting founder-led service businesses doing $3-10M in revenue.

Your job is to research a target company and return enriched intelligence that helps the founder (Nate) start a sales conversation.

CappaWork's offer: $30K operational diagnostic that identifies where AI automation can improve profitability. Proof case: helped a founder go from $1.5M revenue / $45K profit to $1.8M revenue / $225K profit in 12 months (5x profit improvement).

Research the company and return ONLY a JSON object with these fields:

{
  "decision_maker_name": "Best guess at CEO/Owner/Founder name, or null",
  "decision_maker_title": "Their exact title, or null",
  "linkedin_url": "Their LinkedIn profile URL if findable, or null",
  "trigger_event": "A specific, recent, real event that suggests they might be ready to buy — a job posting, a LinkedIn post, a news article, a growth announcement. Be specific. If you can't find a real one, generate a plausible one based on the vertical and mark trigger_event_source as ai_generated.",
  "trigger_event_source": "linkedin_post | job_posting | news | ai_generated",
  "tech_stack_signal": "What technology/tools they appear to be using based on job postings, website, or other signals. e.g., 'Bullhorn ATS + manual spreadsheet processes' or 'AppFolio with limited automation'",
  "tech_stack_source": "job_posting | website | linkedin | ai_generated",
  "personalized_first_line": "A 2-3 sentence opening for a LinkedIn DM or cold email. Must reference something specific about THIS company — a trigger event, a pain point visible from their online presence, or a vertical-specific insight. End with a question or soft CTA. Never pitch directly. Lead with value or insight.",
  "cold_email_hook": "A punchy 1-2 sentence email opener that creates curiosity. Reference a specific number, pain point, or proof case. Must make them want to read the next line.",
  "key_pain_point": "The single biggest operational pain point this company likely has, based on their vertical, size, and any signals you found.",
  "why_closes_fast": "1-2 sentences on why this specific company would close a $30K diagnostic quickly — what's their motivation?"
}

Guidelines:
- Prefer REAL signals over generated ones. If you find an actual job posting, LinkedIn post, or news article, use that.
- Be specific. "They posted about AI" is weak. "CEO posted on LinkedIn 2 weeks ago about struggling to scale past 50 client sites without adding headcount" is strong.
- The personalized first line should sound like a peer founder reaching out, not a salesperson. Nate's voice is direct, no-BS, and insight-led.
- If you can't find much, say so in the fields rather than fabricating specifics. "ai_generated" source is fine — just be honest about it.`;

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const { prospect_id } = await request.json();

    if (!prospect_id) {
      return NextResponse.json(
        { error: "prospect_id is required" },
        { status: 400 }
      );
    }

    const prospect = await getProspect(prospect_id);
    if (!prospect) {
      return NextResponse.json(
        { error: "Prospect not found" },
        { status: 404 }
      );
    }

    // Get vertical info for context
    let verticalName = prospect.vertical_name || "Unknown";
    let verticalTier = prospect.vertical_tier;
    if (prospect.vertical_id && !prospect.vertical_name) {
      const vertical = await getVertical(prospect.vertical_id);
      if (vertical) {
        verticalName = vertical.name;
        verticalTier = vertical.tier;
      }
    }

    const userMessage = `Research this company for sales outreach:

Company: ${prospect.company_name}
Website: ${prospect.website || "Unknown"}
Vertical: ${verticalName}
Location: ${prospect.location || "Unknown"}
Estimated Revenue: ${prospect.estimated_revenue || "Unknown"}
Known Pain Point (if any): ${prospect.key_pain_point || "None specified"}

Find: decision maker, trigger events, tech stack, and generate personalized outreach copy.${prospect.website ? ` Start by searching for "${prospect.website}".` : ""}`;

    let response;
    try {
      response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        tools: [
          {
            type: "web_search_20250305",
            name: "web_search",
            max_uses: 5,
          },
        ],
        messages: [{ role: "user", content: userMessage }],
      });
    } catch (apiError: unknown) {
      // Surface rate limit errors clearly
      if (apiError instanceof Error && "status" in apiError && (apiError as { status: number }).status === 429) {
        return NextResponse.json(
          { error: "Rate limited — wait a minute and try again" },
          { status: 429 }
        );
      }
      throw apiError;
    }

    // Extract text from response — use the LAST text block, which is Claude's
    // final answer after web search. Earlier text blocks may contain preamble
    // or thinking that can interfere with JSON extraction.
    const textBlocks = response.content.filter((b) => b.type === "text");
    if (textBlocks.length === 0) {
      console.error(`Enrichment for "${prospect.company_name}": no text blocks in response`);
      return NextResponse.json(
        { error: "No text response from AI" },
        { status: 500 }
      );
    }

    // Try the last text block first (most likely to have the JSON), then fall back to all
    const lastText = (textBlocks[textBlocks.length - 1] as { type: "text"; text: string }).text;
    const allText = textBlocks.map((b) => (b as { type: "text"; text: string }).text).join("\n");

    let enrichment: Record<string, unknown> | null = null;

    for (const text of [lastText, allText]) {
      // Try to find JSON — use a non-greedy approach to find the first complete object
      // that contains our expected keys
      const matches = text.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
      if (matches) {
        for (const m of matches) {
          try {
            const parsed = JSON.parse(m);
            // Verify it looks like our enrichment object (has at least one expected key)
            if (
              parsed.decision_maker_name !== undefined ||
              parsed.key_pain_point !== undefined ||
              parsed.trigger_event !== undefined ||
              parsed.personalized_first_line !== undefined
            ) {
              enrichment = parsed;
              break;
            }
          } catch {
            // Not valid JSON, try next match
          }
        }
      }
      if (enrichment) break;
    }

    if (!enrichment) {
      console.error(
        `Enrichment for "${prospect.company_name}": failed to extract JSON. Last text block: ${lastText.slice(0, 500)}`
      );
      return NextResponse.json(
        { error: "Failed to parse enrichment response" },
        { status: 500 }
      );
    }
    const now = new Date().toISOString();

    // Build update payload
    const updates: Record<string, unknown> = {
      last_enriched_at: now,
      ai_enrichment_log: [
        ...(prospect.ai_enrichment_log || []),
        { timestamp: now, result: enrichment },
      ],
    };

    // Only update fields that Claude returned non-null values for
    const fieldMap: Record<string, string> = {
      decision_maker_name: "decision_maker_name",
      decision_maker_title: "decision_maker_title",
      linkedin_url: "linkedin_url",
      trigger_event: "trigger_event",
      trigger_event_source: "trigger_event_source",
      tech_stack_signal: "tech_stack_signal",
      tech_stack_source: "tech_stack_source",
      personalized_first_line: "personalized_first_line",
      cold_email_hook: "cold_email_hook",
      key_pain_point: "key_pain_point",
      why_closes_fast: "why_closes_fast",
    };

    for (const [aiKey, dbKey] of Object.entries(fieldMap)) {
      if (enrichment[aiKey]) {
        updates[dbKey] = enrichment[aiKey];
      }
    }

    // Recalculate score
    const merged = { ...prospect, ...updates };
    const { score, breakdown } = calculatePriorityScore(
      merged as Record<string, unknown>,
      verticalTier
    );
    updates.priority_score = score;
    updates.score_breakdown = breakdown;

    // Calculate enrichment status
    const enrichmentFields = [
      merged.decision_maker_name,
      merged.trigger_event,
      merged.tech_stack_signal,
      merged.personalized_first_line,
      merged.cold_email_hook,
      merged.key_pain_point,
    ];
    const filled = enrichmentFields.filter(Boolean).length;
    updates.enrichment_status = filled >= 5 ? "fully_enriched" : filled > 0 ? "partially_enriched" : "raw";

    const updated = await updateProspect(prospect_id, updates);

    return NextResponse.json({
      prospect: updated,
      enrichment,
      message: `Enriched ${prospect.company_name} — found ${filled}/6 intelligence fields.`,
    });
  } catch (error) {
    console.error("Enrichment error:", error);
    return NextResponse.json(
      { error: "Enrichment failed" },
      { status: 500 }
    );
  }
}
